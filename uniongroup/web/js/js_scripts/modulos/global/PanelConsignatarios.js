Ext.define('ConsignatariosUtils', {
    singleton: true,

    BtnBusqConsignatarios: function () {
        const param = {busqBnd: 1};
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
                totalRegistros = mainStore.getTotalCount();

        if (totalRegistros === 0) {
            Ext.MessageBox.alert('Sin datos', 'No hay registros para enviar');
            return;
        }

        Ext.MessageBox.confirm(
                'Confirmar Sincronización',
                '¿Desea procesar los ' + totalRegistros + ' registros totales? (Se enviarán en lotes para mayor seguridad)',
                function (btn) {
                    if (btn === 'yes') {
                        // Store temporal para bajar todo el universo de datos
                        var tempStore = Ext.create('Ext.data.Store', {
                            model: mainStore.getModel().getName(),
                            proxy: {
                                type: 'ajax',
                                url: mainStore.getProxy().url,
                                extraParams: mainStore.getProxy().getExtraParams(),
                                reader: {type: 'json', rootProperty: 'Data'}
                            }
                        });

                        grid.setLoading('Descargando datos completos de VectorDelta...');

                        tempStore.load({
                            params: {page: 1, limit: totalRegistros},
                            callback: function (records, operation, success) {
                                grid.setLoading(false);
                                if (success) {
                                    ConsignatariosUtils.iniciarEnvioPorLotes(records);
                                } else {
                                    Ext.MessageBox.alert('Error', 'No se pudo obtener la información de origen.');
                                }
                            }
                        });
                    }
                }
        );
    },

    iniciarEnvioPorLotes: function (allRecords) {
        var me = this,
                loteSize = 50, // Tamaño seguro para evitar que el JSON se corte
                totalRecords = allRecords.length,
                confirmadosGlobal = [],
                erroresGlobal = [],
                index = 0;

        var progressWin = Ext.create('Ext.window.Window', {
            title: 'Sincronizando con SAP Global',
            width: 400,
            height: 160,
            modal: true,
            closable: false,
            layout: 'vbox',
            bodyPadding: 20,
            items: [
                {xtype: 'label', id: 'lblProgresoLote', text: 'Iniciando...', margin: '0 0 10 0'},
                {xtype: 'progressbar', id: 'barProgresoLote', width: '100%'}
            ]
        });
        progressWin.show();

        function enviarSiguienteLote() {
            var fin = Math.min(index + loteSize, totalRecords),
                    loteActual = allRecords.slice(index, fin),
                    datosLote = [];

            // Limpieza de datos para que coincidan con el Procedure (Case Sensitive)
            Ext.Array.each(loteActual, function (rec) {
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

            var pct = index / totalRecords;
            Ext.getCmp('lblProgresoLote').setText('Procesando: ' + (index + 1) + ' - ' + fin + ' de ' + totalRecords);
            Ext.getCmp('barProgresoLote').updateProgress(pct);

            Ext.Ajax.request({
                url: contexto + '/Consignatarios',
                method: 'POST',
                params: {
                    busqBnd: 2,
                    valores: Ext.encode({addresses: datosLote})
                },
                success: function (response) {
                    var result;
                    try {
                        result = Ext.decode(response.responseText);
                    } catch (e) {
                        console.error("JSON inválido:", response.responseText);
                        return;
                    }

                    if (result.success) {
                        var listaParaConfirmarVector = [];

                        Ext.Array.each(result.results, function (item) {
                            var ori = allRecords.find(r => r.get('DocEntry') == item.DocEntry);
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
                                // Estructura requerida por VectorDelta
                                listaParaConfirmarVector.push({
                                    DocEntry: item.DocEntry,
                                    ObjectCode: item.ObjectCode,
                                    RecordDate: item.RecordDate
                                });
                            } else {
                                erroresGlobal.push(row);
                            }
                        });

                        // Enviar confirmación a VectorDelta si el lote tuvo éxitos
                        if (listaParaConfirmarVector.length > 0) {
                            me.confirmarAVectorDelta(listaParaConfirmarVector);
                        }

                        index += loteSize;
                        if (index < totalRecords) {
                            enviarSiguienteLote();
                        } else {
                            progressWin.close();
                            me.mostrarResultados(confirmadosGlobal, erroresGlobal);
                        }
                    }
                },
                failure: function () {
                    progressWin.close();
                    Ext.Msg.alert('Error', 'Fallo crítico de conexión en lote ' + index);
                }
            });
        }
        enviarSiguienteLote();
    },

    confirmarAVectorDelta: function (lista) {
        Ext.Ajax.request({
            url: contexto + '/Consignatarios',
            method: 'POST',
            params: {
                busqBnd: 399,
                confirmData: Ext.encode({ConfirmData: lista})
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
            width: 950, height: 600, modal: true, layout: 'fit',
            items: [{
                    xtype: 'tabpanel',
                    items: [
                        {
                            title: 'Éxitos (' + confirmData.length + ')',
                            layout: 'fit',
                            items: [{
                                    xtype: 'grid', store: storeConfirm,
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
                                    xtype: 'grid', store: storeNoConfirm,
                                    columns: [
                                        {text: 'DocEntry', dataIndex: 'DocEntry', width: 120},
                                        {text: 'Error', dataIndex: 'mensaje', flex: 1,
                                            renderer: v => `<span style="color:red;">${v}</span>`}
                                    ]
                                }]
                        }
                    ]
                }],
            buttons: [{text: 'Cerrar', handler: function () {
                        win.close();
                    }}]
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
    id: 'idMenu502', // ID ?nico que coincide con el del ?rbol
    title: 'Consignatarios',
    bodyPadding: '10 10 10 10',
    layout: {
        type: 'vbox',
        align: 'stretch'
    },
    scrollable: true,
    initComponent: function () {
        var me = this;
        // === Modelo ===

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
            pageSize: 100, // Debe coincidir con lo que esperas
            proxy: {
                type: "ajax",
                url: contexto + "/Consignatarios",
                // ExtJS envía automáticamente page, start y limit
                reader: {
                    type: "json",
                    rootProperty: "Data", // Coincide con public ArrayList<ArrDataConsignatarios> Data
                    totalProperty: "Meta.TotalRecords" // Acceso anidado al total de registros
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
                    plugins: {
                        gridfilters: true,
                    },
                    tbar: [
                        {
                            xtype: 'button',
                            text: 'Buscar',
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
                            text: "Enviar",
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
                        },
                    ],
                    columns: {
                        defaults: {
                            filter: {
                                type: "string"
                            }
                        },
                        items: [
                            {
                                text: "#",
                                xtype: "rownumberer",
                                width: 50,
                                align: "center"
                            },
                            {
                                text: "C?digo",
                                dataIndex: "AddressCode",
                                width: 150,
                                align: "center"
                            },
                            {
                                text: "Cliente",
                                dataIndex: "CardName",
                                width: 200,
                                flex: 1
                            },
                            {
                                text: "Direcci?n",
                                dataIndex: "Address",
                                width: 250,
                                flex: 1
                            },
                            {
                                text: "Calle",
                                dataIndex: "Street",
                                width: 200
                            },
                            {
                                text: "No.",
                                dataIndex: "StreetNo",
                                width: 80,
                                align: "center"
                            },
                            {
                                text: "Colonia",
                                dataIndex: "Block",
                                width: 150
                            },
                            {
                                text: "CP",
                                dataIndex: "ZipCode",
                                width: 80,
                                align: "center"
                            },
                            {
                                text: "Ciudad",
                                dataIndex: "County",
                                width: 150
                            },
                            {
                                text: "Estado",
                                dataIndex: "State",
                                width: 80,
                                align: "center"
                            },
                            {
                                text: "Pa?s",
                                dataIndex: "Country",
                                width: 80,
                                align: "center"
                            }
                        ]
                    },
                    bbar: {
                        xtype: 'pagingtoolbar',
                        store: me.storeDirecciones, // El mismo store del grid
                        displayInfo: true,
                        displayMsg: 'Mostrando {0} - {1} de {2}',
                        emptyMsg: 'No hay datos'
                    },
                    listeners: {
                        edit: function (editor, e) {
                            e.record.commit();
                        },
                        rowdblclick: function (editor, e, eOpts) {
                            
                        },
                        rowclick: function (grid, record) {
                           
                        }
                    },
                }
            ],
            features: [
                {
                    ftype: 'grouping',
                    groupHeaderTpl: '{name}',
                    hideGroupedHeader: true,
                    enableGroupingMenu: false
                },
                {
                    ftype: 'groupingsummary'
                },
            ],
        });
        me.callParent(arguments);
    },
});