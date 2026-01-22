/* 
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/JSP_Servlet/JavaScript.js to edit this template
 */

Ext.define('ProductosUtils', {
    singleton: true,

    enviarProductos: function () {
        var grid = Ext.getCmp('gridProductos');
        var store = grid.getStore();

        if (store.getCount() === 0) {
            Ext.MessageBox.alert('Sin datos', 'No hay productos para enviar');
            return;
        }

        Ext.MessageBox.confirm(
                'Confirmar envío',
                '¿Desea enviar ' + store.getCount() + ' producto(s)?',
                function (btn) {
                    if (btn === 'yes') {
                        ProductosUtils.procesarEnvio(store);
                    }
                }
        );
    },

    procesarEnvio: function (store) {
        var products = [];

        store.each(function (record) {
            products.push(record.getData());
        });

        var requestData = {
            products: products
        };

        var progressWin = Ext.create('Ext.window.Window', {
            title: 'Enviando productos...',
            width: 400,
            height: 150,
            modal: true,
            closable: false,
            layout: 'fit',
            items: [{
                    xtype: 'container',
                    padding: 20,
                    html:
                            '<div style="text-align:center;">' +
                            '<div style="font-size:16px;margin-bottom:10px;">Procesando ' + products.length + ' producto(s)...</div>' +
                            '<div style="width:100%;height:30px;background:#e0e0e0;border-radius:5px;">' +
                            '<div style="width:50%;height:100%;background:#4CAF50;animation:pulse 1s infinite;"></div>' +
                            '</div></div>' +
                            '<style>@keyframes pulse{0%,100%{opacity:1;}50%{opacity:.5;}}</style>'
                }]
        });

        progressWin.show();

        Ext.Ajax.request({
            url: contexto + '/Productos',
            method: 'POST',
            params: {
                busqBnd: 2,
                valores: Ext.encode(requestData)
            },
            timeout: 60000,

            success: function (response) {
                progressWin.close();

                if (!response.responseText) {
                    Ext.MessageBox.alert('Error', 'El servidor no devolvió respuesta');
                    return;
                }

                try {
                    var result = Ext.decode(response.responseText);

                    if (!result.success) {
                        Ext.MessageBox.alert('Error', 'Error al procesar productos');
                        return;
                    }

                    // ? MAPEO CORRECTO DE RESPUESTA
                    var confirmados = [];
                    var noConfirmados = [];

                    Ext.each(result.results, function (item) {
                        // Buscar info extra en el store original
                        var record = store.findRecord('DocEntry', item.DocEntry);

                        if (item.status === 'inserted') {
                            confirmados.push({
                                DocEntry: item.DocEntry,
                                ItemCode: item.ObjectCode,
                                ItemName: record ? record.get('ItemName') : '',
                                fecha: item.RecordDate
                            });
                        }

                        if (item.status === 'error') {
                            noConfirmados.push({
                                DocEntry: item.DocEntry,
                                ItemCode: item.ObjectCode,
                                ItemName: record ? record.get('ItemName') : '',
                                mensaje: item.message || 'Error desconocido'
                            });
                        }
                    });

                    ProductosUtils.mostrarResultados(confirmados, noConfirmados);

                    Ext.toast({
                        title: 'Proceso completado',
                        html:
                                'Insertados: ' + result.summary.inserted +
                                ' | Errores: ' + result.summary.failed,
                        align: 'tr',
                        iconCls: 'fa fa-check'
                    });

                } catch (e) {
                    console.error(e);
                    Ext.MessageBox.alert(
                            'Error',
                            'La respuesta del servidor no es un JSON válido'
                            );
                }
            },

            failure: function (response) {
                progressWin.close();
                Ext.MessageBox.alert(
                        'Error de conexión',
                        'Código: ' + response.status
                        );
            }
        });
    },

    mostrarResultados: function (confirmados, noConfirmados) {


        if (!Ext.ClassManager.get('ResultadoProductoModel')) {
            Ext.define('ResultadoProductoModel', {
                extend: 'Ext.data.Model',
                fields: [
                    'DocEntry',
                    'ItemCode',
                    'ItemName',
                    'mensaje',
                    'fecha'
                ]
            });
        }




        var storeOk = Ext.create('Ext.data.Store', {
            model: 'ResultadoProductoModel',
            data: confirmados
        });

        var storeErr = Ext.create('Ext.data.Store', {
            model: 'ResultadoProductoModel',
            data: noConfirmados
        });

        Ext.create('Ext.window.Window', {
            title: 'Resultado envío de productos',
            width: 900,
            height: 600,
            modal: true,
            layout: 'fit',
            items: [{
                    xtype: 'tabpanel',
                    items: [
                        {
                            title: 'Confirmados (' + confirmados.length + ')',
                            layout: 'fit',
                            items: [{
                                    xtype: 'grid',
                                    store: storeOk,
                                    columns: [
                                        {xtype: 'rownumberer', width: 50},
                                        {text: 'Item', dataIndex: 'ItemCode', width: 150},
                                        {text: 'Descripción', dataIndex: 'ItemName', flex: 1},
                                        {text: 'Fecha', dataIndex: 'fecha', width: 180}
                                    ]
                                }]
                        },
                        {
                            title: 'Errores (' + noConfirmados.length + ')',
                            layout: 'fit',
                            items: [{
                                    xtype: 'grid',
                                    store: storeErr,
                                    columns: [
                                        {xtype: 'rownumberer', width: 50},
                                        {text: 'Item', dataIndex: 'ItemCode', width: 150},
                                        {text: 'Descripción', dataIndex: 'ItemName', flex: 1},
                                        {
                                            text: 'Error',
                                            dataIndex: 'mensaje',
                                            flex: 2,
                                            renderer: function (v) {
                                                return '<span style="color:red;">' + (v || '') + '</span>';
                                            }
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
            model: 'modelProductos',
            autoLoad: false, // No cargar autom?ticamente
            pageSize: 2,
            proxy: {
                type: "ajax",
                url: contexto + "/Productos",
                enablePaging: true,
                extraParams: {
                    busqBnd: 1
                },
                reader: {
                    type: "json",
                    rootProperty: ""
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
                    plugins: {
                        gridfilters: true,
                    },
                    tbar: [
                        {
                            xtype: "button",
                            text: "Datos",
                            iconCls: "icn-busquedaDos",
                            handler: function (btn) {
                                var storeDirecciones = Ext.getCmp('gridProductos').getStore();
                                // Cargar el store
                                storeDirecciones.load({
                                    callback: function (records, operation, success) {
                                        if (success) {
                                            console.log('Productos cargados:', records.length);
                                            Ext.toast({
                                                html: 'Se cargaron ' + records.length + ' productos',
                                                title: 'éxito',
                                                align: 'tr',
                                                iconCls: 'fa fa-check'
                                            });
                                        } else {
                                            console.error('? Error al cargar los productos');
                                            Ext.MessageBox.alert('Error', 'No se pudieron cargar los productos');
                                        }
                                    }
                                });
                            }
                        },
                        {
                            xtype: "button",
                            text: "Enviar",
                            iconCls: "icn-factura",
                            handler: function () {

                                ProductosUtils.enviarProductos();

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
                                text: "Número de artículo",
                                dataIndex: "ItemCode",
                                flex: 1,
                                align: "center"
                            },
                            {
                                text: "Descripción del artículo",
                                dataIndex: "ItemName",
                                flex: 1
                            },
                            {
                                text: "Grupo de artículos",
                                dataIndex: "ItmsGrpCod",
                                flex: 1,
                                align: "center"
                            },
                            {
                                text: "Código de barras",
                                dataIndex: "CodeBars",
                                flex: 1,
                                align: "center"
                            },
                            {
                                text: "Catálogo fabricante",
                                dataIndex: "SuppCatNum",
                                flex: 1,
                                align: "center"
                            },
                            {
                                text: "Fecha de actualización",
                                dataIndex: "UpdateDate",
                                flex: 1,
                                align: "center"
                            },
                            {
                                text: "Inactivo",
                                dataIndex: "frozenFor",
                                flex: 1,
                                align: "center"
                            },
                            {
                                text: "Color (código)",
                                dataIndex: "U_ARGNS_COL",
                                flex: 1,
                                align: "center"
                            },
                            {
                                text: "Modelo",
                                dataIndex: "U_ARGNS_MOD",
                                flex: 1,
                                align: "center"
                            },
                            {
                                text: "Talla",
                                dataIndex: "U_ARGNS_SIZE",
                                flex: 1,
                                align: "center"
                            },
                            {
                                text: "Año",
                                dataIndex: "U_ARGNS_YEAR",
                                flex: 1,
                                align: "center"
                            },
                            {
                                text: "Grupo de modelo",
                                dataIndex: "U_ARGNS_M_GROUP",
                                flex: 1,
                                align: "center"
                            },
                            {
                                text: "Indicador de impuestos",
                                dataIndex: "TaxCodeAR",
                                flex: 1,
                                align: "center"
                            },
                            {
                                text: "Escala",
                                dataIndex: "U_ARGNS_SCL",
                                flex: 1,
                                align: "center"
                            },
                            {
                                text: "Orden visual de talla",
                                dataIndex: "U_ARGNS_SIZEVO",
                                flex: 1,
                                align: "center"
                            },
                            {
                                text: "División",
                                dataIndex: "U_ARGNS_DIV",
                                flex: 1,
                                align: "center"
                            },
                            {
                                text: "Temporada",
                                dataIndex: "U_ARGNS_SEASON",
                                flex: 1,
                                align: "center"
                            },
                            {
                                text: "Línea de producto",
                                dataIndex: "U_ARGNS_LineCode",
                                flex: 1,
                                align: "center"
                            },
                            {
                                text: "Colección",
                                dataIndex: "U_ARGNS_Coll",
                                flex: 1,
                                align: "center"
                            },
                            {
                                text: "Marca",
                                dataIndex: "U_ARGNS_Brand",
                                flex: 1,
                                align: "center"
                            },
                            {
                                text: "Grupo de edad",
                                dataIndex: "U_ARGNS_GEDAD",
                                flex: 1,
                                align: "center"
                            },
                            {
                                text: "Color largo",
                                dataIndex: "U_ARGNS_COLORL",
                                flex: 1,
                                align: "center"
                            },
                            {
                                text: "Color corto",
                                dataIndex: "U_ARGNS_COLORP",
                                flex: 1,
                                align: "center"
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