/* 
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/JSP_Servlet/JavaScript.js to edit this template
 */

Ext.define('ProductosUtils', {
    singleton: true,
    
    BtnBusqProductos: function () {
        const param = {busqBnd: 1};
        
        ProductosUtils.BuscarConsignatarios(param);
        var storeProductos = Ext.StoreManager.lookup('storeProductos');
        storeProductos.getProxy().setExtraParams(param);
        storeProductos.loadPage(1);
    },

    BuscarConsignatarios: function (param) {
        const grid = Ext.getCmp('gridProductos');
        const store = grid.getStore();
        store.removeAll(true);
        store.reload({params: param});
    },


    enviarProductos: function () {
        var grid = Ext.getCmp('gridProductos'),
            mainStore = grid.getStore(),
            //totalRegistros = mainStore.getTotalCount();
            totalRegistros = 3000;

        if (totalRegistros === 0) {
            Ext.Msg.alert('Sin datos', 'No hay productos para enviar');
            return;
        }

// Agrega esto al inicio de tu aplicación o antes del Msg.confirm

        Ext.Msg.confirm(
            'Confirmar sincronización',
            '¿Desea procesar los ' + totalRegistros + ' productos? (Se enviaran en lotes)',
            function (btn) {
                if (btn === 'yes') {

                    var tempStore = Ext.create('Ext.data.Store', {
                        model: mainStore.getModel().getName(),
                        proxy: {
                            type: 'ajax',
                            url: mainStore.getProxy().url,
                            extraParams: mainStore.getProxy().getExtraParams(),
                             reader: {type: 'json', rootProperty: 'Data'}
                        }
                    });

                    grid.setLoading('Descargando universo de productos...');

                    tempStore.load({
                        params: { page: 1, limit: totalRegistros },
                        callback: function (records, op, success) {
                            grid.setLoading(false);
                            if (success) {
                                ProductosUtils.iniciarEnvioPorLotes(records);
                            } else {
                                Ext.Msg.alert('Error', 'No se pudo obtener el universo de productos');
                            }
                        }
                    });
                }
            }
        );
    },

    iniciarEnvioPorLotes: function (allRecords) {
        var me = this,
            loteSize = 100,
            totalRecords = allRecords.length,
            confirmadosGlobal = [],
            erroresGlobal = [],
            index = 0;

        var progressWin = Ext.create('Ext.window.Window', {
            title: 'Sincronizando Productos',
            width: 420,
            height: 160,
            modal: true,
            closable: false,
            layout: 'vbox',
            bodyPadding: 20,
            items: [
                { xtype: 'label', id: 'lblProdLote', text: 'Iniciando...' },
                { xtype: 'progressbar', id: 'barProdLote', width: '100%' }
            ]
        });
        progressWin.show();

        function enviarSiguienteLote() {

            var fin = Math.min(index + loteSize, totalRecords),
                loteActual = allRecords.slice(index, fin),
                datosLote = [];

            Ext.Array.each(loteActual, function (rec) {
                var d = rec.data;
                datosLote.push({
                    DocEntry: d.DocEntry,
                    ItemCode: d.ItemCode,
                    ItemName: d.ItemName,
                    ItmsGrpCod: d.ItmsGrpCod,
                    ItmsGrpNam:d.ItmsGrpNam,
                    CodeBars: d.CodeBars,
                    SuppCatNum: d.SuppCatNum,
                    UpdateDate: d.UpdateDate,
                    frozenFor: d.frozenFor,
                    U_ARGNS_COL: d.U_ARGNS_COL,
                    U_ARGNS_MOD: d.U_ARGNS_MOD,
                    U_ARGNS_SIZE: d.U_ARGNS_SIZE,
                    U_ARGNS_YEAR: d.U_ARGNS_YEAR,
                    U_ARGNS_M_GROUP: d.U_ARGNS_M_GROUP,
                    TaxCodeAR: d.TaxCodeAR,
                    U_ARGNS_SCL: d.U_ARGNS_SCL,
                    U_ARGNS_SIZEVO: d.U_ARGNS_SIZEVO,
                    U_ARGNS_DIV: d.U_ARGNS_DIV,
                    U_ARGNS_SEASON: d.U_ARGNS_SEASON,
                    U_ARGNS_LineCode: d.U_ARGNS_LineCode,
                    U_ARGNS_Coll: d.U_ARGNS_Coll,
                    U_ARGNS_Brand: d.U_ARGNS_Brand,
                    U_ARGNS_GEDAD: d.U_ARGNS_GEDAD,
                    U_ARGNS_COLORL: d.U_ARGNS_COLORL,
                    U_ARGNS_COLORP: d.U_ARGNS_COLORP
                });
            });

            Ext.getCmp('lblProdLote')
                .setText('Procesando: ' + (index + 1) + ' - ' + fin + ' de ' + totalRecords);
            Ext.getCmp('barProdLote')
                .updateProgress(index / totalRecords);

            Ext.Ajax.request({
                url: contexto + '/Productos',
                method: 'POST',
                params: {
                    busqBnd: 2,
                    valores: Ext.encode({ products: datosLote })
                },

                success: function (response) {
                    var result;
                    try {
                        result = Ext.decode(response.responseText);
                    } catch (e) {
                        Ext.Msg.alert('Error', 'Respuesta inv?lida del servidor');
                        progressWin.close();
                        return;
                    }

                    if (result.success) {

                        var listaConfirmacion = [];

                        Ext.Array.each(result.results, function (item) {
                            var ori = allRecords.find(r =>
                                r.get('DocEntry') == item.DocEntry
                            );

                            var row = {
                                DocEntry: item.DocEntry,
                                ItemCode: item.ObjectCode,
                                ItemName: ori ? ori.get('ItemName') : '',
                                fecha: item.RecordDate,
                                mensaje: item.status === 'inserted'
                                    ? 'OK'
                                    : item.message
                            };

                            if (item.status === 'inserted') {
                                confirmadosGlobal.push(row);
                                listaConfirmacion.push({
                                    DocEntry: item.DocEntry,
                                    ObjectCode: item.ObjectCode,
                                    RecordDate: item.RecordDate
                                });
                            } else {
                                erroresGlobal.push(row);
                            }
                        });

                        if (listaConfirmacion.length > 0) {
                            me.confirmarAVectorDelta(listaConfirmacion);
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
                    Ext.Msg.alert('Error', 'Fallo de conexi?n en lote ' + index);
                }
            });
        }

        enviarSiguienteLote();
    },

    confirmarAVectorDelta: function (lista) {
        
        var progressMsg = Ext.Msg.show({
            title: 'Confirmando consignatarios',
            message: 'Enviando confirmaci?n a VectorDelta...',
            progress: true,
            closable: false,
            buttons: false
        });

        // Animaci?n simple (indeterminada)
        progressMsg.wait('Procesando...');
        
        Ext.Ajax.request({
            url: contexto + '/Productos',
            method: 'POST',
            params: {
                busqBnd: 3,
                confirmData: Ext.encode({ ConfirmData: lista })
            },
            success: function (response) {
                var resp;

                try {
                    resp = Ext.decode(response.responseText);
                } catch (e) {
                    progressMsg.close();
                    Ext.Msg.alert('Error', 'Respuesta inv?lida del servidor');
                    return;
                }

                progressMsg.close();

                if (resp.success && Ext.isArray(resp.confirmedItems)) {
                    var totalConfirmados = resp.confirmedItems.length;

                    Ext.Msg.alert(
                            'Confirmaci?n exitosa',
                            'Se confirmaron <b>' + totalConfirmados + '</b> productos(s) correctamente.'
                            );
                } else {
                    Ext.Msg.alert(
                            'Aviso',
                            resp.message || 'La confirmaci?n se proces? sin detalle.'
                            );
                }
            },
            
             failure: function () {
                progressMsg.close();
                Ext.Msg.alert('Error', 'No fue posible confirmar los productos');
            }

        });
    },

    mostrarResultados: function (confirmados, errores) {

        if (!Ext.ClassManager.get('ResultadoProductoModel')) {
            Ext.define('ResultadoProductoModel', {
                extend: 'Ext.data.Model',
                fields: ['DocEntry', 'ItemCode', 'ItemName', 'fecha', 'mensaje']
            });
        }

        var storeOk = Ext.create('Ext.data.Store', {
            model: 'ResultadoProductoModel',
            data: confirmados
        });

        var storeErr = Ext.create('Ext.data.Store', {
            model: 'ResultadoProductoModel',
            data: errores
        });

        Ext.create('Ext.window.Window', {
            title: 'Resultados sincronizaci?n de Productos',
            width: 950,
            height: 600,
            modal: true,
            layout: 'fit',
            listeners: {
                destroy: function () {
                    ProductosUtils.BtnBusqProductos();
                }
            },
            items: [{
                xtype: 'tabpanel',
                items: [
                    {
                        title: '?xitos (' + confirmados.length + ')',
                        layout: 'fit',
                        items: [{
                            xtype: 'grid',
                            store: storeOk,
                            columns: [
                                { text: 'Item', dataIndex: 'ItemCode', width: 160 },
                                { text: 'Descripci?n', dataIndex: 'ItemName', flex: 1 },
                                { text: 'Fecha', dataIndex: 'fecha', width: 160 }
                            ]
                        }]
                    },
                    {
                        title: 'Errores (' + errores.length + ')',
                        layout: 'fit',
                        items: [{
                            xtype: 'grid',
                            store: storeErr,
                            columns: [
                                { text: 'Item', dataIndex: 'ItemCode', width: 160 },
                                {
                                    text: 'Error',
                                    dataIndex: 'mensaje',
                                    flex: 1,
                                    renderer: v =>
                                        `<span style="color:red;">${v}</span>`
                                }
                            ]
                        }]
                    }
                ]
            }]
        }).show();
    }
});


Ext.define('Modulos.global.PanelProductos', {
    extend: 'Ext.form.Panel',
    requires: [
        'ProductosUtils'
    ],
    alias: 'widget.PanelProductos',
    id: 'idMenu501', // ID ?nico que coincide con el del ?rbol
    title: 'Productos',
    bodyPadding: '10 10 10 10',
    layout: {
        type: 'vbox',
        align: 'stretch'
    },
    scrollable: true,
    initComponent: function () {
        var me = this;
        // === Modelo ===

        Ext.define('modelProductos', {
            extend: 'Ext.data.Model',
            fields: [
                "DocEntry",
                "ItemCode",
                "ItemName",
                "ItmsGrpCod",
                "ItmsGrpNam",
                "CodeBars",
                "SuppCatNum",
                "UpdateDate",
                "frozenFor",
                "U_ARGNS_COL",
                "U_ARGNS_MOD",
                "U_ARGNS_SIZE",
                "U_ARGNS_YEAR",
                "U_ARGNS_M_GROUP",
                "TaxCodeAR",
                "U_ARGNS_SCL",
                "U_ARGNS_SIZEVO",
                "U_ARGNS_DIV",
                "U_ARGNS_SEASON",
                "U_ARGNS_LineCode",
                "U_ARGNS_Coll",
                "U_ARGNS_Brand",
                "U_ARGNS_GEDAD",
                "U_ARGNS_COLORL",
                "U_ARGNS_COLORP"
            ]
        });
        
        me.storeProductos = Ext.create('Ext.data.Store', {
            id: 'storeProductos',
            model: 'modelProductos',
            autoLoad: false,
            pageSize: 100, // Debe coincidir con lo que esperas
            proxy: {
                type: "ajax",
                url: contexto + "/Productos",
                // ExtJS env?a autom?ticamente page, start y limit
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
                    id: 'gridProductos',
                    store: me.storeProductos,
                    flex: 1,
                    stateful: true,
                    stateId: 'gridProductosState',
                    plugins: {
                        gridfilters: true,
                    },
                    tbar: [
                        {
                            xtype: "button",
                            text: "Actualizar",
                            iconCls: "icn-busquedaDos",
                            handler: function (btn) {
                               ProductosUtils.BtnBusqProductos();
                               
                            }
                        },
                        {
                            xtype: "button",
                            text: "Cargar",
                            iconCls: "icn-factura",
                            handler: function () {

                                ProductosUtils.enviarProductos();

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
                            filter: {
                                type: "string"
                            }
                        },

                        items: [
                            {
                                text: "#",
                                xtype: "rownumberer",
                                flex: 1,
                                align: "center"
                            },
                            {
                                text: "ItemCode",
                                dataIndex: "ItemCode",
                                flex: 1,
                                align: "center"
                            },
                            {
                                text: "ItemName",
                                dataIndex: "ItemName",
                                flex: 1
                            },
                            {
                                text: "ItmsGrpCod",
                                dataIndex: "ItmsGrpCod",
                                flex: 1,
                                align: "center"
                            },
                            {
                                text: "ItmsGrpNam",
                                dataIndex: "ItmsGrpNam",
                                flex: 1,
                                align: "center"
                            },
                            
                            
                            {
                                text: "CodeBars",
                                dataIndex: "CodeBars",
                                flex: 1,
                                align: "center"
                            },
                            {
                                text: "SuppCatNum",
                                dataIndex: "SuppCatNum",
                                flex: 1,
                                align: "center"
                            },
                            {
                                text: "UpdateDate",
                                dataIndex: "UpdateDate",
                                flex: 1,
                                align: "center"
                            },
                            {
                                text: "frozenFor",
                                dataIndex: "frozenFor",
                                flex: 1,
                                align: "center"
                            },
                            {
                                text: "U_ARGNS_COL",
                                dataIndex: "U_ARGNS_COL",
                                flex: 1,
                                align: "center"
                            },
                            {
                                text: "U_ARGNS_MOD",
                                dataIndex: "U_ARGNS_MOD",
                                flex: 1,
                                align: "center"
                            },
                            {
                                text: "U_ARGNS_SIZE",
                                dataIndex: "U_ARGNS_SIZE",
                                flex: 1,
                                align: "center"
                            },
                            {
                                text: "U_ARGNS_YEAR",
                                dataIndex: "U_ARGNS_YEAR",
                                flex: 1,
                                align: "center"
                            },
                            {
                                text: "U_ARGNS_M_GROUP",
                                dataIndex: "U_ARGNS_M_GROUP",
                                flex: 1,
                                align: "center"
                            },
                            {
                                text: "TaxCodeAR",
                                dataIndex: "TaxCodeAR",
                                flex: 1,
                                align: "center"
                            },
                            {
                                text: "U_ARGNS_SCL",
                                dataIndex: "U_ARGNS_SCL",
                                flex: 1,
                                align: "center"
                            },
                            {
                                text: "U_ARGNS_SIZEVO",
                                dataIndex: "U_ARGNS_SIZEVO",
                                flex: 1,
                                align: "center"
                            },
                            {
                                text: "U_ARGNS_DIV",
                                dataIndex: "U_ARGNS_DIV",
                                flex: 1,
                                align: "center"
                            },
                            {
                                text: "U_ARGNS_SEASON",
                                dataIndex: "U_ARGNS_SEASON",
                                flex: 1,
                                align: "center"
                            },
                            {
                                text: "U_ARGNS_LineCode",
                                dataIndex: "U_ARGNS_LineCode",
                                flex: 1,
                                align: "center"
                            },
                            {
                                text: "U_ARGNS_Coll",
                                dataIndex: "U_ARGNS_Coll",
                                flex: 1,
                                align: "center"
                            },
                            {
                                text: "U_ARGNS_Brand",
                                dataIndex: "U_ARGNS_Brand",
                                flex: 1,
                                align: "center"
                            },
                            {
                                text: "U_ARGNS_GEDAD",
                                dataIndex: "U_ARGNS_GEDAD",
                                flex: 1,
                                align: "center"
                            },
                            {
                                text: "U_ARGNS_COLORL",
                                dataIndex: "U_ARGNS_COLORL",
                                flex: 1,
                                align: "center",
                                hidden: true
                            },
                            {
                                text: "U_ARGNS_COLORP",
                                dataIndex: "U_ARGNS_COLORP",
                                flex: 1,
                                align: "center",
                                hidden: true
                            }
                        ]


                    },
                    bbar: {
                        xtype: 'pagingtoolbar',
                        store: me.storeProductos,
                        displayInfo: true,
                        displayMsg: 'Mostrando productos {0} - {1} de {2}',
                        emptyMsg: 'No hay productos'
                    },

                    listeners: {
                        edit: function (editor, e) {
                            e.record.commit();
                        },
                        afterrender: function (grid) {
                         
                            if (grid.isVisible() && !grid.isSearchExecuted) {
                                grid.isSearchExecuted = true; // Marca que la b?squeda se ha ejecutado
                              ProductosUtils.BtnBusqProductos();
                            }
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