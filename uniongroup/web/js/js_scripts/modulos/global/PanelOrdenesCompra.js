/* 
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/JSP_Servlet/JavaScript.js to edit this template
 */

Ext.define('OrdenesCompraUtils', {
    singleton: true,

    BtnBusqOrdenCompra: function () {
        var param;
        param = {
            busqBnd: 4,
            servicio: 'ServiceOrdenCompra'
        };
        OrdenesCompraUtils.BuscarOrdenCompra(param);
    },

    BuscarOrdenCompra: function (prm) {
        var grd = Ext.getCmp('gridOrdenesCompra');
        if (!grd)
            return;

        var store = grd.getStore();
        store.removeAll(true);
        store.reload({
            params: prm
        });
    },

    // ? Función para abrir modal de ÓRDENES (SIN Ext.require)
    verNuevasOrdenes: function () {

        // Modelo para las órdenes
        if (!Ext.ClassManager.get('modelOrdenesCompraHeader')) {
            Ext.define('modelOrdenesCompraHeader', {
                extend: 'Ext.data.Model',
                fields: [
                    "DocEntry",
                    "DocNum",
                    "NumAtCard",
                    "DocDate",
                    "CardCode",
                    "Memo",
                    {name: "OrderTotal", type: 'number'},
                    {name: "TotalLines", type: 'int'}
                ]
            });
        }

        // Store para las órdenes
        var storeOrdenes = Ext.create('Ext.data.Store', {
            model: 'modelOrdenesCompraHeader',
            autoLoad: true,
            proxy: {
                type: "ajax",
                url: contexto + "/OrdenesCompra",
                extraParams: {
                    busqBnd: 1
                },
                reader: {
                    type: "json",
                    rootProperty: ""
                }
            }
        });

        // ? Crear ventana directamente (sin componente separado)
        const win = Ext.create('Ext.window.Window', {
            id: 'winOrdenesCompra',
            title: 'Órdenes de Compra Nuevas',
            width: 1000,
            height: 600,
            scrollable: true,
            closable: true,
            closeAction: 'destroy',
            modal: true,
            constrain: true,
            resizable: true,
            layout: 'fit',
            items: [
                {
                    xtype: 'grid',
                    store: storeOrdenes,
                    plugins: {
                        gridfilters: true
                    },
                    tbar: [
                        {
                            xtype: 'button',
                            text: 'Guardar Nuevas',
                            iconCls: 'icn-guardar',
                            scale: 'medium',
                            handler: function () {
                                OrdenesCompraUtils.guardarNuevasOrdenes();
                            }
                        },
                        '->',
                        {
                            xtype: 'button',
                            text: 'Recargar',
                            iconCls: 'fa fa-refresh',
                            handler: function () {
                                storeOrdenes.reload();
                            }
                        },
                        {
                            xtype: 'button',
                            text: 'Cerrar',
                            iconCls: 'icn-back',
                            handler: function () {
                                win.close();
                            }
                        }
                    ],
                    columns: [
                        {
                            text: "#",
                            xtype: "rownumberer",
                            width: 50,
                            align: "center"
                        },
                        {
                            text: "No. Documento",
                            dataIndex: "DocNum",
                            width: 150,
                            align: "center",
                            filter: {type: 'string'}
                        },
                        {
                            text: "No. Cliente",
                            dataIndex: "NumAtCard",
                            width: 150,
                            align: "center",
                            filter: {type: 'string'}
                        },
                        {
                            text: "Fecha",
                            dataIndex: "DocDate",
                            width: 120,
                            align: "center",
                            filter: {type: 'date'},
                            renderer: function (value) {
                                if (value) {
                                    return Ext.Date.format(new Date(value), 'd/m/Y');
                                }
                                return '';
                            }
                        },
                        {
                            text: "Proveedor",
                            dataIndex: "CardCode",
                            width: 150,
                            flex: 1,
                            filter: {type: 'string'}
                        },
                        {
                            text: "Total Líneas",
                            dataIndex: "TotalLines",
                            width: 120,
                            align: "center",
                            filter: {type: 'number'},
                            renderer: function (value) {
                                return '<b style="color: #2196F3;">' + value + '</b>';
                            }
                        },
                        {
                            text: "Total Orden",
                            dataIndex: "OrderTotal",
                            width: 150,
                            align: "right",
                            filter: {type: 'number'},
                            renderer: function (value) {
                                return '<b style="color: #4CAF50;">$' + Ext.util.Format.number(value, '0,000.00') + '</b>';
                            }
                        },
                        {
                            text: "Memo",
                            dataIndex: "Memo",
                            width: 200,
                            flex: 1,
                            filter: {type: 'string'}
                        }
                    ],
                    listeners: {
                        rowdblclick: function (grid, record) {
                            OrdenesCompraUtils.verLineasOrden(record);
                        }
                    }
                }
            ]
        });

        win.show();
    },

    // ? Arma el JSON en el frontend
    guardarNuevasOrdenes: function () {
        Ext.MessageBox.confirm(
                'Confirmar',
                '¿Está seguro de cargar las nuevas órdenes de compra?',
                function (btn) {
                    if (btn === 'yes') {

                        Ext.getBody().mask('Obteniendo órdenes de compra...');

                        // ? PASO 1: Obtener todas las órdenes desde el API externo
                        Ext.Ajax.request({
                            url: contexto + '/OrdenesCompra',
                            method: 'POST',
                            params: {
                                busqBnd: 1
                            },
                            success: function (response) {

                                var ordenesHeader = Ext.decode(response.responseText);
                                console.log('? Órdenes obtenidas:', ordenesHeader.length);

                                if (ordenesHeader.length === 0) {
                                    Ext.getBody().unmask();
                                    Ext.Msg.alert('Información', 'No hay órdenes de compra para procesar');
                                    return;
                                }

                                // ? PASO 2: Obtener las líneas de cada orden
                                var promises = [];
                                var ordenesCompletas = [];

                                ordenesHeader.forEach(function (orden) {
                                    promises.push(
                                            new Promise(function (resolve, reject) {
                                                Ext.Ajax.request({
                                                    url: contexto + '/OrdenesCompra',
                                                    method: 'POST',
                                                    params: {
                                                        busqBnd: 2,
                                                        docEntry: orden.DocEntry
                                                    },
                                                    success: function (responseLineas) {
                                                        var lineas = Ext.decode(responseLineas.responseText);

                                                        // ? Construir el objeto completo
                                                        ordenesCompletas.push({
                                                            PurchaseOrder: {
                                                                DocEntry: orden.DocEntry,
                                                                DocNum: orden.DocNum,
                                                                NumAtCard: orden.NumAtCard,
                                                                DocDate: orden.DocDate,
                                                                CardCode: orden.CardCode,
                                                                Memo: orden.Memo
                                                            },
                                                            Lines: lineas
                                                        });

                                                        resolve();
                                                    },
                                                    failure: function () {
                                                        reject();
                                                    }
                                                });
                                            })
                                            );
                                });

                                // ? PASO 3: Cuando todas las líneas estén cargadas, construir el JSON final
                                Promise.all(promises).then(function () {

                                    // ? Construir el JSON en el formato correcto
                                    var payload = {
                                        orders: ordenesCompletas
                                    };

                                    var jsonToSend = Ext.encode(payload);
                                    console.log('? JSON a enviar:', jsonToSend);

                                    Ext.getBody().mask('Guardando órdenes de compra...');

                                    // ? PASO 4: Enviar a busqBnd=3
                                    Ext.Ajax.request({
                                        url: contexto + '/OrdenesCompra',
                                        method: 'POST',
                                        params: {
                                            busqBnd: 3,
                                            valores: jsonToSend
                                        },
                                        success: function (responsePost) {
                                            Ext.getBody().unmask();

                                            try {
                                                var resultado = Ext.decode(responsePost.responseText);

                                                console.log('? Respuesta del servidor:', resultado);

                                                if (resultado.success) {
                                                    Ext.Msg.alert(
                                                            'Éxito',
                                                            'Se guardaron correctamente ' + resultado.summary.inserted + ' órdenes de compra.',
                                                            function () {
                                                                var win = Ext.getCmp('winOrdenesCompra');
                                                                if (win) {
                                                                    win.close();
                                                                }
                                                            }
                                                    );
                                                } else {
                                                    var mensaje = 'Insertadas: ' + resultado.summary.inserted +
                                                            '<br>Fallidas: ' + resultado.summary.failed;
                                                    Ext.Msg.alert('Resultado', mensaje);
                                                }
                                            } catch (e) {
                                                console.error('? Error al parsear respuesta:', e);
                                                Ext.Msg.alert('Error', 'Error al procesar la respuesta del servidor');
                                            }
                                        },
                                        failure: function (response) {
                                            Ext.getBody().unmask();
                                            console.error('? Error en POST:', response);
                                            Ext.Msg.alert('Error', 'Error al guardar las órdenes de compra');
                                        }
                                    });

                                }).catch(function (error) {
                                    Ext.getBody().unmask();
                                    console.error('? Error al obtener líneas:', error);
                                    Ext.Msg.alert('Error', 'Error al obtener las líneas de las órdenes');
                                });

                            },
                            failure: function (response) {
                                Ext.getBody().unmask();
                                console.error('? Error al obtener órdenes:', response);
                                Ext.Msg.alert('Error', 'Error al obtener las órdenes de compra');
                            }
                        });
                    }
                }
        );
    },

    // ? Función para abrir modal de LÍNEAS (API externo)
    verLineasOrden: function (record) {
        var docEntry = record.get('DocEntry');
        var docNum = record.get('DocNum');
        var cardCode = record.get('CardCode');
        var totalLines = record.get('TotalLines');

        // Modelo para las líneas
        if (!Ext.ClassManager.get('modelLineasOrden')) {
            Ext.define('modelLineasOrden', {
                extend: 'Ext.data.Model',
                fields: [
                    {name: "LineNum", type: 'int'},
                    "ItemCode",
                    "BarCode",
                    {name: "Quantity", type: 'int'}
                ]
            });
        }

        // Store para las líneas
        var storeLineas = Ext.create('Ext.data.Store', {
            model: 'modelLineasOrden',
            autoLoad: true,
            proxy: {
                type: "ajax",
                url: contexto + "/OrdenesCompra",
                extraParams: {
                    busqBnd: 2,
                    docEntry: docEntry
                },
                reader: {
                    type: "json",
                    rootProperty: ""
                }
            },
            listeners: {
                load: function (store, records, successful) {
                    if (successful) {
                        console.log('? Cargadas ' + records.length + ' líneas para orden #' + docNum);
                        Ext.toast({
                            html: 'Se cargaron ' + records.length + ' líneas',
                            title: 'Éxito',
                            align: 'tr',
                            iconCls: 'fa fa-check',
                            timeout: 2000
                        });
                    }
                }
            }
        });

        const win = Ext.create('Ext.window.Window', {
            id: 'winLineasOrden',
            title: 'Líneas de Orden #' + docNum + ' - Proveedor: ' + cardCode,
            width: 900,
            height: 500,
            scrollable: true,
            closable: true,
            closeAction: 'destroy',
            modal: true,
            constrain: true,
            resizable: true,
            layout: 'fit',
            items: [
                {
                    xtype: 'grid',
                    store: storeLineas,
                    plugins: {
                        gridfilters: true
                    },
                    tbar: [
                        {
                            xtype: 'displayfield',
                            value: '<b>Total de líneas: ' + totalLines + '</b>',
                            fieldStyle: 'font-size: 14px; color: #2196F3;'
                        },
                        '->',
                        {
                            xtype: 'button',
                            text: 'Recargar',
                            iconCls: 'fa fa-refresh',
                            handler: function () {
                                storeLineas.reload();
                            }
                        },
                        {
                            xtype: 'button',
                            text: 'Cerrar',
                            iconCls: 'icn-back',
                            handler: function () {
                                win.close();
                            }
                        }
                    ],
                    columns: [
                        {
                            text: "#",
                            xtype: "rownumberer",
                            width: 50,
                            align: "center"
                        },
                        {
                            text: "Línea",
                            dataIndex: "linenum",
                            width: 100,
                            align: "center",
                            filter: {type: 'number'},
                            renderer: function (value) {
                                return '<b style="color: #FF9800;">' + value + '</b>';
                            }
                        },
                        {
                            text: "Código",
                            dataIndex: "itemcode",
                            width: 200,
                            flex: 1,
                            filter: {type: 'string'}
                        },
                        {
                            text: "Código de Barras",
                            dataIndex: "barcode",
                            width: 250,
                            flex: 1,
                            filter: {type: 'string'}
                        },
                        {
                            text: "Cantidad",
                            dataIndex: "quantity",
                            width: 120,
                            align: "right",
                            filter: {type: 'number'},
                            renderer: function (value) {
                                return '<b style="color: #4CAF50;">' + Ext.util.Format.number(value, '0,000') + '</b>';
                            }
                        }
                    ],
                    viewConfig: {
                        stripeRows: true,
                        enableTextSelection: true
                    }
                }
            ]
        });

        win.show();
    },

    // ? Función para ver líneas LOCALES (guardadas en BD)
    verLineasOrdenLocal: function (record) {
        var docEntry = record.get('docentry');
        var docNum = record.get('docnum');
        var cardCode = record.get('cardcode');

        // Modelo para las líneas
        if (!Ext.ClassManager.get('modelLineasOrdenLocal')) {
            Ext.define('modelLineasOrdenLocal', {
                extend: 'Ext.data.Model',
                fields: [
                    "linenum",
                    "itemcode",
                    "barcode",
                    "quantity",
                ]
            });
        }

        // Store para las líneas LOCALES
        var storeLineas = Ext.create('Ext.data.Store', {
            model: 'modelLineasOrdenLocal',
            autoLoad: true,
            proxy: {
                type: "ajax",
                url: contexto + "/OrdenesCompra",
                extraParams: {
                    busqBnd: 5,
                    docEntry: docEntry,
                    servicio: 'ServiceOrdenCompraDet'
                },
                reader: {
                    type: "json",
                    rootProperty: ""
                }
            },
            listeners: {
                load: function (store, records, successful) {
                    if (successful) {
                        console.log('? Cargadas ' + records.length + ' líneas locales para orden #' + docNum);
                        Ext.toast({
                            html: 'Se cargaron ' + records.length + ' líneas',
                            title: 'Éxito',
                            align: 'tr',
                            iconCls: 'fa fa-check',
                            timeout: 2000
                        });
                    }
                }
            }
        });

        const win = Ext.create('Ext.window.Window', {
            id: 'winLineasOrdenLocal',
            title: 'Líneas de Orden #' + docNum + ' - Proveedor: ' + cardCode,
            width: 900,
            height: 500,
            scrollable: true,
            closable: true,
            closeAction: 'destroy',
            modal: true,
            constrain: true,
            resizable: true,
            layout: 'fit',
            items: [
                {
                    xtype: 'grid',
                    store: storeLineas,
                    plugins: {
                        gridfilters: true
                    },
                    tbar: [
                        {
                            xtype: 'displayfield',
                            value: '<b>Doc Entry: ' + docEntry + '</b>',
                            fieldStyle: 'font-size: 14px; color: #2196F3;'
                        },
                        '->',
                        {
                            xtype: 'button',
                            text: 'Recargar',
                            iconCls: 'fa fa-refresh',
                            handler: function () {
                                storeLineas.reload();
                            }
                        },
                        {
                            xtype: 'button',
                            text: 'Cerrar',
                            iconCls: 'icn-back',
                            handler: function () {
                                win.close();
                            }
                        }
                    ],
                    columns: [
                        {
                            text: "#",
                            xtype: "rownumberer",
                            width: 50,
                            align: "center"
                        },
                        {
                            text: "Línea",
                            dataIndex: "linenum",
                            width: 100,
                            align: "center",
                            filter: {type: 'number'},
                            renderer: function (value) {
                                return '<b style="color: #FF9800;">' + value + '</b>';
                            }
                        },
                        {
                            text: "Código",
                            dataIndex: "itemCode",
                            width: 200,
                            flex: 1,
                            filter: {type: 'string'}
                        },
                        {
                            text: "Código de Barras",
                            dataIndex: "barCode",
                            width: 250,
                            flex: 1,
                            filter: {type: 'string'}
                        },
                        {
                            text: "Cantidad",
                            dataIndex: "uantity",
                            width: 120,
                            align: "right",
                            filter: {type: 'number'},
                            renderer: function (value) {
                                return '<b style="color: #4CAF50;">' + Ext.util.Format.number(value, '0,000') + '</b>';
                            }
                        }
                    ],
                    viewConfig: {
                        stripeRows: true,
                        enableTextSelection: true
                    }
                }
            ]
        });

        win.show();
    }
});

// ? Panel principal - UNA SOLA DEFINICIÓN
Ext.define('Modulos.global.PanelOrdenesCompra', {
    extend: 'Ext.form.Panel',
    requires: [
        'OrdenesCompraUtils'
    ],
    alias: 'widget.PanelOrdenesCompra',
    id: 'idMenu502',
    title: 'Ordenes de Compra',
    bodyPadding: '10 10 10 10',
    layout: {
        type: 'vbox',
        align: 'stretch'
    },
    scrollable: true,
    initComponent: function () {
        var me = this;

        Ext.define('modelOrdenesCompra', {
            extend: 'Ext.data.Model',
            fields: [
                "docentry",
                "docnum",
                "numatcard",
                "docdate",
                "cardcode",
                "memo"
            ]
        });

        me.storeOrdenesCompra = Ext.create('Ext.data.Store', {
            model: 'modelOrdenesCompra',
            autoLoad: false,
            proxy: {
                type: "ajax",
                url: contexto + "/OrdenesCompra",
                extraParams: {
                    busqBnd: 4,
                    servicio: 'ServiceOrdenCompra'
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
                    id: 'gridOrdenesCompra',
                    store: me.storeOrdenesCompra,
                    flex: 1,
                    plugins: {
                        gridfilters: true
                    },
                    tbar: [
                        {
                            xtype: 'button',
                            text: 'Buscar',
                            arrowAlign: 'center',
                            iconCls: "icn-factura",
                            handler: function (btn) {
                                OrdenesCompraUtils.BtnBusqOrdenCompra();
                            },
                            listeners: {
                                afterrender: function (btn) {
                                    addTooltip(btn, 'Buscar');
                                }
                            }
                        },
                        {
                            xtype: 'button',
                            text: 'Ver Nuevas',
                            arrowAlign: 'center',
                            iconCls: "icn-factura",
                            handler: function (btn) {
                                OrdenesCompraUtils.verNuevasOrdenes();
                            },
                            listeners: {
                                afterrender: function (btn) {
                                    addTooltip(btn, 'Ver Órdenes de Compra Nuevas');
                                }
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
                    columns: [
                        {
                            text: "#",
                            xtype: "rownumberer",
                            width: 50,
                            align: "center"
                        },
                        {
                            text: "Doc Entry",
                            dataIndex: "docentry",
                            width: 150,
                            align: "center",
                            filter: {type: 'number'}
                        },
                        {
                            text: "Doc Num",
                            dataIndex: "docnum",
                            width: 200,
                            flex: 1,
                            filter: {type: 'string'}
                        },
                        {
                            text: "Numero Card",
                            dataIndex: "numatcard",
                            width: 250,
                            flex: 1,
                            filter: {type: 'string'}
                        },
                        {
                            text: "Doc Date",
                            dataIndex: "docdate",
                            width: 200,
                            filter: {type: 'date'}
                        },
                        {
                            text: "CardCode",
                            dataIndex: "cardcode",
                            width: 200,
                            filter: {type: 'string'}
                        },
                        {
                            text: "Memo",
                            dataIndex: "memo",
                            width: 200,
                            filter: {type: 'string'}
                        }
                    ],
                    listeners: {
                        edit: function (editor, e) {
                            e.record.commit();
                        },
                        rowdblclick: function (grid, record) {
                            OrdenesCompraUtils.verLineasOrdenLocal(record);
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
                {
                    ftype: 'groupingsummary'
                }
            ]
        });
        me.callParent(arguments);
    }
});