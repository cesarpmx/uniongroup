Ext.define('ConsignatariosUtils', {
    singleton: true,

    BtnBusqConsignatarios: function () {
        const param = {busqBnd: 1};

        ConsignatariosUtils.BuscarConsignatarios(param);
        var storeConsignatarios = Ext.StoreManager.lookup('storeDirecciones');
        storeConsignatarios.getProxy().setExtraParams(param);
        storeConsignatarios.loadPage(1);
    },

    BuscarConsignatarios: function (param) {
        const grid = Ext.getCmp('gridDirecciones');
        const store = grid.getStore();
        store.removeAll(true);
        store.reload({params: param});
    },

    enviarDirecciones: function () {
        var grid = Ext.getCmp('gridDirecciones'),
            mainStore = grid.getStore(),
            totalRegistros = mainStore.getTotalCount(); // Obtener el total real dinámicamente

        if (totalRegistros === 0) {
            Ext.MessageBox.alert('Sin datos', 'No hay registros para enviar');
            return;
        }

        Ext.MessageBox.confirm(
            'Confirmar Sincronizaci\u00f3n',
            '¿Desea procesar los ' + totalRegistros + ' registros totales? (Se enviarán continuamente en lotes de 100)',
            function (btn) {
                if (btn === 'yes') {
                    ConsignatariosUtils.procesarCiclo100en100(mainStore, totalRegistros);
                }
            }
        );
    },

    procesarCiclo100en100: function (mainStore, totalRecords) {
        var me = this,
            loteSize = 100,
            confirmadosGlobal = [],
            erroresGlobal = [],
            procesadosCount = 0;

        // Ventana de progreso
        var progressWin = Ext.create('Ext.window.Window', {
            title: 'Sincronizando Consignatarios con SAP Global',
            width: 420,
            height: 160,
            modal: true,
            closable: false,
            layout: 'vbox',
            bodyPadding: 20,
            items: [
                { xtype: 'label', id: 'lblProgresoLote', text: 'Iniciando...', margin: '0 0 10 0' },
                { xtype: 'progressbar', id: 'barProgresoLote', width: '100%' }
            ]
        });
        progressWin.show();

        // Store temporal para pedir sólo 100 registros por iteración
        var tempStore = Ext.create('Ext.data.Store', {
            model: mainStore.getModel().getName(),
            proxy: {
                type: 'ajax',
                url: mainStore.getProxy().url,
                extraParams: mainStore.getProxy().getExtraParams(),
                reader: { type: 'json', rootProperty: 'Data' }
            }
        });

        function cargarYEnviarSiguiente() {
            var inicio = procesadosCount + 1;
            var fin = Math.min(procesadosCount + loteSize, totalRecords);

            Ext.getCmp('lblProgresoLote').setText(
                'Procesando consignatarios ' + inicio + ' a ' + fin + ' de ' + totalRecords + '...'
            );

            // ⚠️ CLAVE: SIEMPRE CONSULTAMOS page: 1
            // Al confirmar en el servidor remoto, los registros procesados salen de la lista de pendientes.
            tempStore.load({
                params: { page: 1, limit: loteSize },
                callback: function (records, operation, success) {
                    if (!success || !records || records.length === 0) {
                        finalizarProceso();
                        return;
                    }

                    // Mapeo de campos requeridos por el procedimiento
                    var datosLote = [];
                    Ext.Array.each(records, function (rec) {
                        var d = rec.data;
                        datosLote.push({
                            DocEntry: d.DocEntry,
                            AddressCode: d.AddressCode,
                            CardCode: d.CardCode,
                            CardName: d.CardName,
                            CardType: d.CardType,
                            AdresType: d.AdresType,
                            Address: d.Address,
                            Address2: d.Address2,
                            Address3: d.Address3,
                            Street: d.Street,
                            StreetNo: d.StreetNo,
                            Building: d.Building,
                            Block: d.Block,
                            ZipCode: d.ZipCode,
                            City: d.City,
                            County: d.County,
                            State: d.State,
                            Country: d.Country
                        });
                    });

                    // Envío POST del bloque
                    Ext.Ajax.request({
                        url: contexto + '/Consignatarios',
                        method: 'POST',
                        params: {
                            busqBnd: 2,
                            valores: Ext.encode({ addresses: datosLote })
                        },
                        success: function (response) {
                            var result;
                            try {
                                result = Ext.decode(response.responseText);
                            } catch (e) {
                                progressWin.close();
                                Ext.MessageBox.alert('Error', 'Respuesta JSON inválida del servidor.');
                                return;
                            }

                            if (result.success) {
                                var listaParaConfirmarVector = [];

                                Ext.Array.each(result.results || [], function (item) {
                                    var ori = records.find(r => r.get('DocEntry') == item.DocEntry);
                                    var row = {
                                        DocEntry: item.DocEntry || 'N/A',
                                        ItemCode: item.ObjectCode || '',
                                        CardName: ori ? ori.get('CardName') : '',
                                        Address: ori ? ori.get('Address') : '',
                                        fecha: item.RecordDate,
                                        mensaje: item.status === 'inserted' ? 'OK' : item.message
                                    };

                                    if (item.status === 'inserted') {
                                        confirmadosGlobal.push(row);
                                        listaParaConfirmarVector.push({
                                            DocEntry: item.DocEntry,
                                            ObjectCode: item.ObjectCode,
                                            RecordDate: item.RecordDate
                                        });
                                    } else {
                                        erroresGlobal.push(row);
                                    }
                                });

                                procesadosCount += records.length;
                                Ext.getCmp('barProgresoLote').updateProgress(procesadosCount / totalRecords);

                                var siguientePaso = function () {
                                    // Si devolvió menos de 100 registros o alcanzamos el total, finalizamos
                                    if (records.length < loteSize || procesadosCount >= totalRecords) {
                                        finalizarProceso();
                                    } else {
                                        cargarYEnviarSiguiente(); // Vuelve a ejecutar pidiendo page: 1
                                    }
                                };

                                // Confirmación silenciosa del bloque a VectorDelta
                                if (listaParaConfirmarVector.length > 0) {
                                    me.confirmarAVectorDeltaLote(listaParaConfirmarVector, siguientePaso);
                                } else {
                                    siguientePaso();
                                }

                            } else {
                                progressWin.close();
                                Ext.MessageBox.alert('Error', result.message || 'Error al procesar el lote.');
                            }
                        },
                        failure: function () {
                            progressWin.close();
                            Ext.MessageBox.alert('Error', 'Fallo de conexión al enviar el lote.');
                        }
                    });
                }
            });
        }

        function finalizarProceso() {
            progressWin.close();
            me.mostrarResultados(confirmadosGlobal, erroresGlobal);
        }

        // Iniciar primer lote
        cargarYEnviarSiguiente();
    },

    confirmarAVectorDeltaLote: function (lista, callback) {
        Ext.Ajax.request({
            url: contexto + '/Consignatarios',
            method: 'POST',
            params: {
                busqBnd: 3,
                confirmData: Ext.encode({ ConfirmData: lista })
            },
            success: function () {
                if (Ext.isFunction(callback)) callback();
            },
            failure: function () {
                if (Ext.isFunction(callback)) callback();
            }
        });
    },

    mostrarResultados: function (confirmData, noConfirmData) {
        if (!Ext.ClassManager.get('ResultadoModel')) {
            Ext.define('ResultadoModel', {
                extend: 'Ext.data.Model',
                fields: ['DocEntry', 'ItemCode', 'CardName', 'Address', 'fecha', 'mensaje']
            });
        }

        var storeConfirm = Ext.create('Ext.data.Store', {model: 'ResultadoModel', data: confirmData});
        var storeNoConfirm = Ext.create('Ext.data.Store', {model: 'ResultadoModel', data: noConfirmData});

        const win = Ext.create('Ext.window.Window', {
            title: 'Resultados de Sincronización Total',
            width: 950,
            height: 600,
            modal: true,
            layout: 'fit',

            listeners: {
                destroy: function () {
                    ConsignatariosUtils.BtnBusqConsignatarios();
                }
            },

            items: [{
                xtype: 'tabpanel',
                items: [
                    {
                        title: 'Éxitos (' + confirmData.length + ')',
                        layout: 'fit',
                        items: [{
                            xtype: 'grid',
                            store: storeConfirm,
                            columns: [
                                {text: 'DocEntry', dataIndex: 'DocEntry', width: 120},
                                {text: 'AddressCode', dataIndex: 'ItemCode', width: 150},
                                {text: 'Cliente', dataIndex: 'CardName', flex: 1},
                                {text: 'Fecha Reg.', dataIndex: 'fecha', width: 160}
                            ]
                        }]
                    },
                    {
                        title: 'Errores (' + noConfirmData.length + ')',
                        layout: 'fit',
                        items: [{
                            xtype: 'grid',
                            store: storeNoConfirm,
                            columns: [
                                {text: 'DocEntry', dataIndex: 'DocEntry', width: 120},
                                {
                                    text: 'Error',
                                    dataIndex: 'mensaje',
                                    flex: 1,
                                    renderer: v => `<span style="color:red; white-space: normal; word-break: break-word;">${v}</span>`
                                }
                            ]
                        }]
                    }
                ]
            }],

            buttons: [{
                text: 'Cerrar',
                handler: function () {
                    win.close();
                }
            }]
        });

        win.show();
    }
});

Ext.define('Modulos.global.PanelConsignatarios', {
    extend: 'Ext.form.Panel',
    requires: [
        'ConsignatariosUtils'
    ],
    alias: 'widget.PanelConsignatarios',
    id: 'idMenu502',
    title: 'Consignatarios',
    bodyPadding: '10 10 10 10',
    layout: {
        type: 'vbox',
        align: 'stretch'
    },
    scrollable: true,
    initComponent: function () {
        var me = this;

        Ext.define('modelDirecciones', {
            extend: 'Ext.data.Model',
            fields: [
                "DocEntry",
                "AddressCode",
                "CardCode",
                "CardName",
                "CardType",
                "AdresType",
                "Address",
                "Address2",
                "Address3",
                "Street",
                "StreetNo",
                "Building",
                "Block",
                "ZipCode",
                "City",
                "County",
                "State",
                "Country"
            ]
        });

        me.storeDirecciones = Ext.create('Ext.data.Store', {
            id: 'storeDirecciones',
            model: 'modelDirecciones',
            autoLoad: false,
            pageSize: 100,
            proxy: {
                type: "ajax",
                url: contexto + "/Consignatarios",
                reader: {
                    type: "json",
                    rootProperty: "Data",
                    totalProperty: "Meta.TotalRecords"
                }
            }
        });

        Ext.apply(me, {
            items: [
                {
                    xtype: 'grid',
                    id: 'gridDirecciones',
                    store: me.storeDirecciones,
                    flex: 1,
                    stateful: true,
                    stateId: 'gridDireccionesState',
                    plugins: {
                        gridfilters: true,
                    },
                    tbar: [
                        {
                            xtype: 'button',
                            text: 'Actualizar',
                            arrowAlign: 'center',
                            iconCls: 'icn-busquedaDos',
                            handler: function (btn) {
                                ConsignatariosUtils.BtnBusqConsignatarios();
                            },
                            listeners: {
                                afterrender: function (btn) {
                                    addTooltip(btn, 'Buscar');
                                }
                            }
                        },
                        {
                            xtype: "button",
                            text: "Cargar",
                            iconCls: "icn-factura",
                            handler: function () {
                                ConsignatariosUtils.enviarDirecciones();
                            }
                        },
                        {
                            xtype: 'button',
                            text: 'Regresar',
                            iconCls: 'icn-back',
                            arrowAlign: 'center',
                            handler: function () {
                                regresarInicio();
                            },
                            listeners: {
                                afterrender: function (btn) {
                                    addTooltip(btn, 'Regresar');
                                }
                            }
                        }
                    ],
                    columns: {
                        defaults: {
                            filter: { type: "string" }
                        },
                        items: [
                            { text: "#", xtype: "rownumberer", flex: 1, align: "center" },
                            { text: "DocEntry", dataIndex: "DocEntry", flex: 1, align: "center" },
                            { text: "AddressCode", dataIndex: "AddressCode", flex: 1, align: "center" },
                            { text: "CardCode", dataIndex: "CardCode", flex: 1, align: "center" },
                            { text: "CardName", dataIndex: "CardName", flex: 1 },
                            { text: "CardType", dataIndex: "CardType", flex: 1, align: "center" },
                            { text: "AdresType", dataIndex: "AdresType", flex: 1, align: "center" },
                            { text: "Address", dataIndex: "Address", flex: 1 },
                            { text: "Address2", dataIndex: "Address2", flex: 1 },
                            { text: "Address3", dataIndex: "Address3", flex: 1 },
                            { text: "Street", dataIndex: "Street", flex: 1 },
                            { text: "StreetNo", dataIndex: "StreetNo", flex: 1, align: "center" },
                            { text: "Building", dataIndex: "Building", flex: 1 },
                            { text: "Block", dataIndex: "Block", flex: 1 },
                            { text: "ZipCode", dataIndex: "ZipCode", flex: 1, align: "center" },
                            { text: "City", dataIndex: "City", flex: 1 },
                            { text: "County", dataIndex: "County", flex: 1 },
                            { text: "State", dataIndex: "State", flex: 1, align: "center" },
                            { text: "Country", dataIndex: "Country", flex: 1, align: "center" }
                        ]
                    },
                    bbar: {
                        xtype: 'pagingtoolbar',
                        store: me.storeDirecciones,
                        displayInfo: true,
                        displayMsg: 'Mostrando {0} - {1} de {2}',
                        emptyMsg: 'No hay datos'
                    },
                    listeners: {
                        edit: function (editor, e) {
                            e.record.commit();
                        },
                        afterrender: function (grid) {
                            if (grid.isVisible() && !grid.isSearchExecuted) {
                                grid.isSearchExecuted = true;
                                ConsignatariosUtils.BtnBusqConsignatarios();
                            }
                        }
                    }
                }
            ],
            features: [
                {
                    ftype: 'grouping',
                    groupHeaderTpl: '{name}',
                    hideGroupedHeader: true,
                    enableGroupingMenu: false
                },
                { ftype: 'groupingsummary' }
            ]
        });
        me.callParent(arguments);
    }
});