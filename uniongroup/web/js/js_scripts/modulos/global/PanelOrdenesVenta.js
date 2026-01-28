/* 
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/JSP_Servlet/JavaScript.js to edit this template
 */

Ext.define('OrdenesVentaUtils', {
    singleton: true,

    BtnBusqOrdenVenta: function () {

        var idEstatusVenta = Ext.getCmp('idCmbEstatusVenta').getValue();

        var param;
        param = {
            busqBnd: 1,
            servicio: 'ServiceOrdenVenta',
            idEstatusVenta: idEstatusVenta,
        };
        OrdenesVentaUtils.BuscarOrdenVenta(param);
    },

    BuscarOrdenVenta: function (prm) {
        var grd = Ext.getCmp('gridOrdenesVenta');
        if (!grd)
            return;

        var store = grd.getStore();
        store.removeAll(true);
        store.reload({
            params: prm
        });
    },

    verLineasOrdenLocal: function (record) {
        var docEntry = record.get('DocEntry');
        var docNum = record.get('DocNum');
        var cardCode = record.get('CardCode');

        if (!Ext.ClassManager.get('modelLineasOrdenVentaLocal')) {
            Ext.define('modelLineasOrdenVentaLocal', {
                extend: 'Ext.data.Model',
                fields: [
                    {name: "LineNum", type: 'int'}, // ? Mayúsculas
                    "ItemCode",
                    "BarCode",
                    {name: "Quantity", type: 'int'}
                ]
            });
        }

        // Store para las líneas LOCALES
        var storeLineasVentas = Ext.create('Ext.data.Store', {
            model: 'modelLineasOrdenVentaLocal',
            autoLoad: true,
            proxy: {
                type: "ajax",
                url: contexto + "/OrdenesVenta",
                extraParams: {
                    busqBnd: 2,
                    docEntry: docEntry,
                    servicio: 'ServiceOrdenVentaDet'
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
                    store: storeLineasVentas,
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
                                storeLineasVentas.reload();
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
                            dataIndex: "LineNum",
                            width: 100,
                            align: "center",
                            filter: {type: 'number'},
                            renderer: function (value) {
                                return '<b style="color: #FF9800;">' + value + '</b>';
                            }
                        },
                        {
                            text: "Código",
                            dataIndex: "ItemCode",
                            width: 200,
                            flex: 1,
                            filter: {type: 'string'}
                        },
                        {
                            text: "Código de Barras",
                            dataIndex: "BarCode",
                            width: 250,
                            flex: 1,
                            filter: {type: 'string'}
                        },
                        {
                            text: "Cantidad",
                            dataIndex: "Quantity",
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
                url: contexto + "/OrdenesVenta",
                extraParams: {
                    busqBnd: 4,
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
                            dataIndex: "LineNum",
                            width: 100,
                            align: "center",
                            filter: {type: 'number'},
                            renderer: function (value) {
                                return '<b style="color: #FF9800;">' + value + '</b>';
                            }
                        },
                        {
                            text: "Código",
                            dataIndex: "ItemCode",
                            width: 200,
                            flex: 1,
                            filter: {type: 'string'}
                        },
                        {
                            text: "Código de Barras",
                            dataIndex: "BarCode",
                            width: 250,
                            flex: 1,
                            filter: {type: 'string'}
                        },
                        {
                            text: "Cantidad",
                            dataIndex: "Quantity",
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

    guardarNuevasOrdenes: function () {
        Ext.MessageBox.confirm(
                'Confirmar',
                '¿Está seguro de cargar las nuevas órdenes de Venta?',
                function (btn) {
                    if (btn === 'yes') {

                        Ext.getBody().mask('Obteniendo órdenes de venta...');

                        // ? PASO 1: Obtener todas las órdenes desde el API externo (busqBnd=3)
                        Ext.Ajax.request({
                            url: contexto + '/OrdenesVenta', // ? CAMBIO: OrdenesCompra ? OrdenesVenta
                            method: 'POST',
                            params: {
                                busqBnd: 3  // ? CAMBIO: 5 ? 3 (ObtenerOrdenesVentaGlobal)
                            },
                            success: function (response) {

                                var ordenesHeader = Ext.decode(response.responseText);
                                console.log('? Órdenes obtenidas:', ordenesHeader.length);

                                if (ordenesHeader.length === 0) {
                                    Ext.getBody().unmask();
                                    Ext.Msg.alert('Información', 'No hay órdenes de venta para procesar');
                                    return;
                                }

                                // ? PASO 2: Obtener las líneas de cada orden
                                var promises = [];
                                var ordenesCompletas = [];

                                ordenesHeader.forEach(function (orden) {
                                    promises.push(
                                            new Promise(function (resolve, reject) {
                                                Ext.Ajax.request({
                                                    url: contexto + '/OrdenesVenta', // ? CAMBIO: OrdenesCompra ? OrdenesVenta
                                                    method: 'POST',
                                                    params: {
                                                        busqBnd: 4, // ? CAMBIO: 2 ? 4 (ObtenerLineasOrdenVenta)
                                                        docEntry: orden.DocEntry
                                                    },
                                                    success: function (responseLineas) {
                                                        var lineas = Ext.decode(responseLineas.responseText);

                                                        // ? Construir el objeto completo con SalesOrder
                                                        ordenesCompletas.push({
                                                            SalesOrder: {// ? CAMBIO: PurchaseOrder ? SalesOrder
                                                                DocEntry: orden.DocEntry,
                                                                DocNum: orden.DocNum,
                                                                NumAtCard: orden.NumAtCard,
                                                                DocDate: orden.DocDate,
                                                                CardCode: orden.CardCode,
                                                                AddressCode: orden.AddressCode, // ? AGREGAR
                                                                Status: orden.Status, // ? AGREGAR
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

                                    var payload = {
                                        orders: ordenesCompletas
                                    };

                                    var jsonToSend = Ext.encode(payload);
                                    console.log('? JSON a enviar:', jsonToSend);

                                    Ext.getBody().mask('Guardando órdenes de venta...');

                                    // ? PASO 4: Enviar a busqBnd=5 (NuevoOrdenVenta)
                                    Ext.Ajax.request({
                                        url: contexto + '/OrdenesVenta', // ? CAMBIO: OrdenesCompra ? OrdenesVenta
                                        method: 'POST',
                                        params: {
                                            busqBnd: 5, // ? CAMBIO: 3 ? 5 (NuevoOrdenVenta)
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
                                                            'Se guardaron correctamente ' + resultado.summary.inserted + ' órdenes de venta.',
                                                            function () {
                                                                var win = Ext.getCmp('winOrdenesVenta');  // ? CAMBIO: winOrdenesCompra ? winOrdenesVenta
                                                                if (win) {
                                                                    win.close();
                                                                }
                                                                // ? Recargar el grid principal
                                                                OrdenesVentaUtils.BtnBusqOrdenVenta();
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
                                            Ext.Msg.alert('Error', 'Error al guardar las órdenes de venta');
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
                                Ext.Msg.alert('Error', 'Error al obtener las órdenes de venta');
                            }
                        });
                    }
                }
        );
    },

    verNuevasOrdenes: function () {
        // Modelo para las órdenes
        if (!Ext.ClassManager.get('modelOrdenesVentaHeader')) {
            Ext.define('modelOrdenesVentaHeader', {
                extend: 'Ext.data.Model',
                fields: [
                    "DocEntry",
                    "DocNum",
                    "NumAtCard",
                    "DocDate",
                    "CardCode",
                    "NumAtCard",
                    "AddressCode",
                    "Status",
                    "Memo",
                ]
            });
        }

        // Store para las órdenes
        var storeOrdenesGlob = Ext.create('Ext.data.Store', {
            model: 'modelOrdenesVentaHeader',
            autoLoad: true,
            proxy: {
                type: "ajax",
                url: contexto + "/OrdenesVenta",
                extraParams: {
                    busqBnd: 3
                },
                reader: {
                    type: "json",
                    rootProperty: ""
                }
            }
        });

        // ? Crear ventana directamente (sin componente separado)
        const win = Ext.create('Ext.window.Window', {
            id: 'winOrdenesVenta',
            title: 'Órdenes de Venta Nuevas',
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
                    store: storeOrdenesGlob,
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
                                OrdenesVentaUtils.guardarNuevasOrdenes();
                            }
                        },
                        '->',
                        {
                            xtype: 'button',
                            text: 'Recargar',
                            iconCls: 'fa fa-refresh',
                            handler: function () {
                                storeOrdenesGlob.reload();
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
                            align: "center"
                        },
                        {
                            text: "No. Documento",
                            dataIndex: "DocNum",
                            align: "center",
                            filter: {type: 'string'}
                        },
                        {
                            text: "Estatus",
                            dataIndex: "Status",
                            align: "center",
                            filter: {type: 'string'}
                        },
                        {
                            text: "No. Cliente",
                            dataIndex: "NumAtCard",
                            align: "center",
                            filter: {type: 'string'}
                        },
                        {
                            text: "Fecha",
                            dataIndex: "DocDate",
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
                            flex: 1,
                            filter: {type: 'string'}
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
                            OrdenesVentaUtils.verLineasOrden(record);
                        }
                    }
                }
            ]
        });

        win.show();
    },

});

Ext.define('Modulos.global.PanelOrdenesVenta', {
    extend: 'Ext.form.Panel',
    requires: [
        'OrdenesVentaUtils'
    ],
    alias: 'widget.PanelOrdenesVenta',
    id: 'idMenu504',
    title: 'Ordenes de Venta',
    bodyPadding: '10 10 10 10',
    layout: {
        type: 'vbox',
        align: 'stretch'
    },
    scrollable: true,
    initComponent: function () {
        var me = this;

        Ext.define('modelOrdenesVenta', {
            extend: 'Ext.data.Model',
            fields: [
                "OVID",
                "DocEntry",
                "DocNum",
                "NumAtCard",
                "DocDate",
                "CardCode",
                "AddressCode",
                "Status",
                "Memo",
                "OVEstatusId", // ? NUEVO
                "OVFechaInsercion"    // ? NUEVO
            ]
        });

        me.storeOrdenesVenta = Ext.create('Ext.data.Store', {
            model: 'modelOrdenesVenta',
            autoLoad: false,
            proxy: {
                type: "ajax",
                url: contexto + "/OrdenesVenta",
                extraParams: {
                    busqBnd: 1,
                    servicio: 'ServiceOrdenVenta'
                },
                reader: {
                    type: "json",
                    rootProperty: ""
                }
            }
        });

        var storeEstatusVentas = Ext.create('Ext.data.Store', {
            fields: ['codigo', 'descripcion'],
            data: [
                {codigo: 'A', descripcion: 'Activo'},
                {codigo: 'C', descripcion: 'Confirmado'},
                {codigo: 'X', descripcion: 'Cancelado'}
            ]
        });

        Ext.apply(me, {
            items: [
                {
                    xtype: 'fieldset',
//                    title: 'Parametros de Consulta',
                    collapsible: true,
                    padding: '15 15 15 15',
                    margin: '10 0 20 0',
                    layout: 'fit',
                    items: [
                        {
                            xtype: 'form',
                            id: 'idMenu504-form',
                            layout: {
                                type: 'hbox',
                                align: 'stretch'
                            },
                            defaults: {
                                xtype: 'container',
                                flex: 1,
                                layout: 'anchor',
                                padding: '10 10 10 10'
                            },
                            items: [
                                {
                                    items: [
                                        {
                                            xtype: 'combobox',
                                            id: "idCmbEstatusVenta",
                                            name: "cmbEstatusVenta",
                                            fieldLabel: 'Estatus',
                                            flex: 1,
                                            width: 300,
                                            store: storeEstatusVentas,
                                            valueField: 'codigo',
                                            displayField: 'descripcion',
                                            queryMode: 'local',
                                            emptyText: 'Seleccione el Estatus',
                                            allowBlank: true,
                                            editable: false
                                        }
                                    ]
                                }
                            ]
                        }
                    ]
                },
                {
                    xtype: 'grid',
                    id: 'gridOrdenesVenta',
                    store: me.storeOrdenesVenta,
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
                                OrdenesVentaUtils.BtnBusqOrdenVenta();
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
                                OrdenesVentaUtils.verNuevasOrdenes();
                            },
                            listeners: {
                                afterrender: function (btn) {
                                    addTooltip(btn, 'Ver Órdenes de Venta Nuevas');
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
                            text: "ID",
                            dataIndex: "OVID",
                            width: 150,
                            align: "center",
                            filter: {type: 'number'}
                        },
                        {
                            text: "Estatus",
                            dataIndex: "OVEstatusId",
                            flex: 1,
                            align: "center",
                            filter: {type: 'string'},
                            renderer: function (value) {
                                // ? Mapeo de códigos a nombres
                                var estatusMap = {
                                    'A': 'Abierto',
                                    'C': 'Cerrado',
                                    'X': 'Cancelado'
                                            // Agrega los estatus que necesites
                                };

                                var nombre = estatusMap[value] || value;

                                // ? Opcional: Agregar colores según estatus
                                var color = '';
                                switch (value) {
                                    case 'A':
                                        color = '#4CAF50';
                                        break; // Verde
                                    case 'C':
                                        color = '#2196F3';
                                        break; // Azul
                                    case 'X':
                                        color = '#F44336';
                                        break; // Rojo
                                }
                                return '<b style="color: ' + color + ';">' + nombre + '</b>';
                            }
                        },
                        {
                            text: "Doc Entry",
                            dataIndex: "DocEntry",
                            width: 150,
                            align: "center",
                            filter: {type: 'number'}
                        },
                        {
                            text: "Doc Num",
                            dataIndex: "DocNum",
                            width: 200,
                            flex: 1,
                            filter: {type: 'string'}
                        },
                        {
                            text: "Numero Card",
                            dataIndex: "NumAtCard",
                            width: 250,
                            flex: 1,
                            filter: {type: 'string'}
                        },
                        {
                            text: "Doc Date",
                            dataIndex: "DocDate",
                            width: 200,
                            filter: {type: 'date'}
                        },
                        {
                            text: "CardCode",
                            dataIndex: "CardCode",
                            width: 200,
                            filter: {type: 'string'}
                        },
                        {
                            text: "Memo",
                            dataIndex: "Memo",
                            width: 200,
                            filter: {type: 'string'}
                        }
                    ],
                    listeners: {
                        edit: function (editor, e) {
                            e.record.commit();
                        },
                        rowdblclick: function (grid, record) {
                            OrdenesVentaUtils.verLineasOrdenLocal(record);
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