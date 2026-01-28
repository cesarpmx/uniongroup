/* 
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/JSP_Servlet/JavaScript.js to edit this template
 */

Ext.define('OrdenesCompraUtils', {
    singleton: true,

    BtnBusqOrdenCompra: function () {

        var idEstatusCompras = Ext.getCmp('idCmbEstatusCompras').getValue();

        var param;
        param = {
            busqBnd: 4,
            servicio: 'ServiceOrdenCompra',
            idEstatusCompras: idEstatusCompras,
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

    guardarNuevasOrdenes: function () {
        Ext.MessageBox.confirm(
                'Confirmar',
                '¿Está seguro de cargar las nuevas órdenes de compra?',
                function (btn) {
                    if (btn === 'yes') {

                        Ext.getBody().mask('Obteniendo órdenes de compra...');

                        // PASO 1: Obtener todas las órdenes desde el API externo
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

                                // PASO 2: Obtener las líneas de cada orden
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

                                // PASO 3: Cuando todas las líneas estén cargadas, enviar por lotes
                                Promise.all(promises).then(function () {
                                    Ext.getBody().unmask();
                                    OrdenesCompraUtils.iniciarEnvioPorLotes(ordenesCompletas);
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

    iniciarEnvioPorLotes: function (allOrders) {
        var me = this,
                loteSize = 10,
                totalOrders = allOrders.length,
                confirmadosGlobal = [],
                erroresGlobal = [],
                clienteResponseGlobal = [], // ? NUEVO
                index = 0;

        var progressWin = Ext.create('Ext.window.Window', {
            title: 'Guardando Órdenes de Compra',
            width: 400,
            height: 160,
            modal: true,
            closable: false,
            layout: 'vbox',
            bodyPadding: 20,
            items: [
                {xtype: 'label', id: 'lblProgresoOrdenes', text: 'Iniciando...', margin: '0 0 10 0'},
                {xtype: 'progressbar', id: 'barProgresoOrdenes', width: '100%'}
            ]
        });
        progressWin.show();

        function enviarSiguienteLote() {
            var fin = Math.min(index + loteSize, totalOrders),
                    loteActual = allOrders.slice(index, fin);

            var payload = {
                orders: loteActual
            };

            var jsonToSend = Ext.encode(payload);

            var pct = index / totalOrders;
            Ext.getCmp('lblProgresoOrdenes').setText('Procesando: ' + (index + 1) + ' - ' + fin + ' de ' + totalOrders);
            Ext.getCmp('barProgresoOrdenes').updateProgress(pct);

            Ext.Ajax.request({
                url: contexto + '/OrdenesCompra',
                method: 'POST',
                params: {
                    busqBnd: 3,
                    valores: jsonToSend
                },
                success: function (response) {
                    var resultado;
                    try {
                        resultado = Ext.decode(response.responseText);
                    } catch (e) {
                        console.error("JSON inválido:", response.responseText);
                        index += loteSize;
                        if (index < totalOrders) {
                            enviarSiguienteLote();
                        } else {
                            progressWin.close();
                            me.mostrarResultados(confirmadosGlobal, erroresGlobal, clienteResponseGlobal);
                        }
                        return;
                    }

                    if (resultado.success && resultado.results) {
                        Ext.Array.each(resultado.results, function (item) {
                            var ordenOriginal = loteActual.find(
                                    o => o.PurchaseOrder.DocEntry === item.DocEntry
                            );

                            var row = {
                                DocEntry: item.DocEntry || 'N/A',
                                DocNum: item.DocNum || '',
                                OCID: item.OCID || '',
                                CardCode: ordenOriginal ? ordenOriginal.PurchaseOrder.CardCode : '',
                                NumAtCard: ordenOriginal ? ordenOriginal.PurchaseOrder.NumAtCard : '',
                                fecha: item.RecordDate,
                                linesInserted: item.linesInserted || 0,
                                linesFailed: item.linesFailed || 0,
                                mensaje: item.status === 'inserted' ? 'OK' : item.message
                            };

                            if (item.status === 'inserted') {
                                confirmadosGlobal.push(row);
                            } else {
                                erroresGlobal.push(row);
                            }
                        });

                        // ? CAPTURAR respuesta del cliente (solo se envía en el último lote)
                        if (resultado.clienteResponse) {
                            clienteResponseGlobal = resultado.clienteResponse;
                        }
                    }

                    index += loteSize;
                    if (index < totalOrders) {
                        enviarSiguienteLote();
                    } else {
                        progressWin.close();
                        console.log('? Órdenes Confirmadas:', confirmadosGlobal);
                        me.mostrarResultados(confirmadosGlobal, erroresGlobal, clienteResponseGlobal);  // ? PASAR clienteResponse
                    }
                },
                failure: function () {
                    index += loteSize;
                    if (index < totalOrders) {
                        enviarSiguienteLote();
                    } else {
                        progressWin.close();
                        console.log('? Órdenes Confirmadas:', confirmadosGlobal);
                        me.mostrarResultados(confirmadosGlobal, erroresGlobal, clienteResponseGlobal);
                    }
                }
            });
        }
        enviarSiguienteLote();
    },

    mostrarResultados: function (confirmData, noConfirmData, clienteData) {  // ? NUEVO parámetro
        if (!Ext.ClassManager.get('ResultadoOrdenesModel')) {
            Ext.define('ResultadoOrdenesModel', {
                extend: 'Ext.data.Model',
                fields: ['DocEntry', 'DocNum', 'OCID', 'CardCode', 'NumAtCard', 'fecha', 'linesInserted', 'linesFailed', 'mensaje']
            });
        }

        // ? NUEVO modelo para respuesta del cliente
        if (!Ext.ClassManager.get('ClienteResponseModel')) {
            Ext.define('ClienteResponseModel', {
                extend: 'Ext.data.Model',
                fields: ['Folio', 'DocEntry', 'ObjType', 'SystemDate']
            });
        }

        var storeConfirm = Ext.create('Ext.data.Store', {model: 'ResultadoOrdenesModel', data: confirmData});
        var storeNoConfirm = Ext.create('Ext.data.Store', {model: 'ResultadoOrdenesModel', data: noConfirmData});
        var storeCliente = Ext.create('Ext.data.Store', {model: 'ClienteResponseModel', data: clienteData || []});  // ? NUEVO

        const win = Ext.create('Ext.window.Window', {
            title: 'Resultados de Sincronización - Órdenes de Compra',
            width: 1000,
            height: 600,
            modal: true,
            layout: 'fit',
            items: [{
                    xtype: 'tabpanel',
                    items: [
                        {
                            title: 'Éxitos (' + confirmData.length + ')',
                            layout: 'fit',
                            iconCls: 'fa fa-check-circle',
                            items: [{
                                    xtype: 'grid',
                                    store: storeConfirm,
                                    columns: [
                                        {text: '#', xtype: 'rownumberer', width: 50, align: 'center'},
                                        {text: 'OCID', dataIndex: 'OCID', width: 80, align: 'center'},
                                        {text: 'Doc Entry', dataIndex: 'DocEntry', width: 120, align: 'center'},
                                        {text: 'Doc Num', dataIndex: 'DocNum', width: 150, flex: 1},
                                        {text: 'Cliente', dataIndex: 'NumAtCard', width: 150, flex: 1},
                                        {text: 'Proveedor', dataIndex: 'CardCode', width: 120},
                                        {
                                            text: 'Líneas OK',
                                            dataIndex: 'linesInserted',
                                            width: 100,
                                            align: 'center',
                                            renderer: function (v) {
                                                return '<b style="color: #4CAF50;">' + v + '</b>';
                                            }
                                        },
                                        {
                                            text: 'Líneas Error',
                                            dataIndex: 'linesFailed',
                                            width: 100,
                                            align: 'center',
                                            renderer: function (v) {
                                                return v > 0 ? '<b style="color: #F44336;">' + v + '</b>' : v;
                                            }
                                        },
                                        {text: 'Fecha', dataIndex: 'fecha', width: 160, align: 'center'}
                                    ],
                                    viewConfig: {stripeRows: true}
                                }]
                        },
                        {
                            title: 'Errores (' + noConfirmData.length + ')',
                            layout: 'fit',
                            iconCls: 'fa fa-exclamation-triangle',
                            items: [{
                                    xtype: 'grid',
                                    store: storeNoConfirm,
                                    columns: [
                                        {text: '#', xtype: 'rownumberer', width: 50, align: 'center'},
                                        {text: 'Doc Entry', dataIndex: 'DocEntry', width: 120, align: 'center'},
                                        {text: 'Doc Num', dataIndex: 'DocNum', width: 150},
                                        {text: 'Cliente', dataIndex: 'NumAtCard', width: 150},
                                        {
                                            text: 'Error',
                                            dataIndex: 'mensaje',
                                            flex: 1,
                                            renderer: v => `<span style="color:red;">${v}</span>`
                                        }
                                    ],
                                    viewConfig: {stripeRows: true}
                                }]
                        },
                        // ? NUEVO TAB: Confirmación Cliente
                        {
                            title: 'Confirmación Cliente (' + (clienteData ? clienteData.length : 0) + ')',
                            layout: 'fit',
                            iconCls: 'fa fa-check',
                            items: [{
                                    xtype: 'grid',
                                    store: storeCliente,
                                    columns: [
                                        {text: '#', xtype: 'rownumberer', width: 50, align: 'center'},
                                        {
                                            text: 'Folio',
                                            dataIndex: 'Folio',
                                            flex: 1,
                                            renderer: function (v) {
                                                return '<b style="color: #2196F3;">' + v + '</b>';
                                            }
                                        },
                                        {text: 'Doc Entry', dataIndex: 'DocEntry', width: 120, align: 'center'},
                                        {text: 'Tipo Objeto', dataIndex: 'ObjType', width: 200},
                                        {
                                            text: 'Fecha Sistema',
                                            dataIndex: 'SystemDate',
                                            width: 180,
                                            align: 'center',
                                            renderer: function (value) {
                                                if (value) {
                                                    return Ext.Date.format(new Date(value), 'd/m/Y H:i:s');
                                                }
                                                return '';
                                            }
                                        }
                                    ],
                                    viewConfig: {stripeRows: true}
                                }]
                        }
                    ]
                }],
            buttons: [{
                    text: 'Cerrar',
                    iconCls: 'icn-back',
                    handler: function () {
                        win.close();
                        OrdenesCompraUtils.BtnBusqOrdenCompra();
                        var winOrdenes = Ext.getCmp('winOrdenesCompra');
                        if (winOrdenes) {
                            winOrdenes.close();
                        }
                    }
                }]
        });
        win.show();
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
            leadingBufferZone: 100,
            pageSize: 100,
            autoLoad: true,
            pageSize: 100,
            proxy: {
                type: "ajax",
                url: contexto + "/OrdenesCompra",
                extraParams: {
                    busqBnd: 2,
                    docEntry: docEntry
                },
                reader: {
                    type: "json",
                    rootProperty: "items",
                    totalProperty: "total"
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

    // ? Función para ver líneas LOCALES (guardadas en BD)
    verLineasOrdenLocal: function (record) {
        var docEntry = record.get('DocEntry');
        var docNum = record.get('DocNum');
        var cardCode = record.get('CardCode');

        if (!Ext.ClassManager.get('modelLineasOrdenLocal')) {
            Ext.define('modelLineasOrdenLocal', {
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
        var storeLineas = Ext.create('Ext.data.Store', {
            model: 'modelLineasOrdenLocal',
            leadingBufferZone: 100,
            autoLoad: true,
            pageSize: 100,
            proxy: {
                type: "ajax",
                url: contexto + "/OrdenesCompra",
                pageParam: false,
                startParam: "offset",
                limitParam: "limit",
                extraParams: {
                    busqBnd: 5,
                    docEntry: docEntry,
                    servicio: 'ServiceOrdenCompraDet'
                },
                reader: {
                    type: "json",
                    rootProperty: "items",
                    totalProperty: "total"
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
                    bbar: {
                        xtype: 'pagingtoolbar',
                        store: storeLineas,
                        displayInfo: true,
                        displayMsg: 'Mostrando {0} - {1} de {2} líneas',
                        emptyMsg: "No hay órdenes para mostrar",
                        beforePageText: 'Página',
                        afterPageText: 'de {0}',
                        firstText: 'Primera página',
                        lastText: 'Última página',
                        nextText: 'Siguiente',
                        prevText: 'Anterior',
                        refreshText: 'Actualizar'
                    },

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

    enviarReceiptConfirm: function (record) {

        var docEntry = record.get("DocEntry");
        var docNum = record.get("DocNum");
        var numAtCard = record.get("NumAtCard");

        // MOCK TransactionNumber 1-9
        var transactionNumber = Ext.Number.randomInt(1, 9);

        // Fecha ISO
        var docDate = Ext.Date.format(new Date(), "Y-m-d\\TH:i:s");

        // ================= OBTENER LÍNEAS DESDE TU BD =================
        Ext.Ajax.request({
            url: contexto + "/OrdenesCompra",
            method: "POST",
            params: {
                busqBnd: 5,
                docEntry: docEntry,
                servicio: 'ServiceOrdenCompraDet'
            },
            success: function (resp) {

                var data = Ext.decode(resp.responseText);
                var lines = [];
                var totalQty = 0;

                Ext.Array.each(data.items, function (line) {
                    totalQty += line.Quantity;

                    lines.push({
                        LineNum: line.LineNum,
                        ItemCode: line.ItemCode,
                        BarCode: line.BarCode,
                        Quantity: line.Quantity
                    });
                });

                // ================= JSON FINAL =================
                var jsonSend = {
                    ReceiptConfirm: {
                        DocDate: docDate,
                        DocNum: docNum,
                        NumAtCard: numAtCard,
                        TransactionNumber: transactionNumber.toString(),
                        Status: "Parcial", // luego lógica real
                        Memo: "Recepción desde sistema local"
                    },
                    ControlValues: {
                        TotalQuantity: totalQty,
                        TotalLines: lines.length
                    },
                    Lines: lines
                };

                console.log("? JSON ReceiptConfirm:");
                console.log(JSON.stringify(jsonSend, null, 4));

            },
            failure: function () {
                Ext.Msg.alert("Error", "No se pudieron cargar líneas para ReceiptConfirm");
            }
        });
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
                "OCID",
                "DocEntry",
                "DocNum",
                "NumAtCard",
                "DocDate",
                "CardCode",
                "Memo",
                "OCEstatusId",
                "OCFechaInsercion"
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
                    rootProperty: "items",
                    totalProperty: "count"
                }
            }
        });

        var storeEstatus = Ext.create('Ext.data.Store', {
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
                            id: 'idMenu58-form',
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
                                            id: "idCmbEstatusCompras",
                                            name: "cmbEstatusOrden",
                                            fieldLabel: 'Estatus',
                                            flex: 1,
                                            width: 300,
                                            store: storeEstatus,
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
                    bbar: {// ? AGREGAR ESTO
                        xtype: 'pagingtoolbar',
                        store: me.storeOrdenesCompra,
                        displayInfo: true,
                        displayMsg: 'Mostrando {0} - {1} de {2} órdenes',
                        emptyMsg: "No hay órdenes para mostrar",
                        beforePageText: 'Página',
                        afterPageText: 'de {0}',
                        firstText: 'Primera página',
                        lastText: 'Última página',
                        nextText: 'Siguiente',
                        prevText: 'Anterior',
                        refreshText: 'Actualizar'
                    },
                    columns: [
                        {
                            text: "#",
                            xtype: "rownumberer",
                            align: "center",
                            width: 50,
                        },
                        {
                            text: "ID",
                            dataIndex: "OCID",
                            width: 50,
                            align: "center",
                            filter: {type: 'number'}
                        },
                        {
                            text: "Estatus",
                            dataIndex: "OCEstatusId",
                            align: "center",
                            width: 150,
                            filter: {type: 'string'},
                            renderer: function (value) {
                                // ? Mapeo de códigos a nombres
                                var estatusMap = {
                                    'A': 'Activo',
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
                            align: "center",
                            width: 150,
                            filter: {type: 'number'}
                        },
                        {
                            text: "Doc Num",
                            dataIndex: "DocNum",
                            width: 150,
                            filter: {type: 'string'}
                        },
                        {
                            text: "Numero Card",
                            dataIndex: "NumAtCard",
                            width: 150,
                            filter: {type: 'string'}
                        },
                        {
                            text: "Doc Date",
                            dataIndex: "DocDate",
                            filter: {type: 'date'},
                            width: 150,
                        },
                        {
                            text: "CardCode",
                            dataIndex: "CardCode",
                            width: 150,
                            filter: {type: 'string'}
                        },
                        {
                            text: "Memo",
                            dataIndex: "Memo",
                            width: 220,
                            filter: {type: 'string'}
                        },
                        {
                            xtype: "actioncolumn",
                            text: "Confirmar",
                            dataIndex: "prrtiempo2",
                            menuDisabled: true,
                            sortable: false,
                            align: "center",
                            iconCls: 'icn-habilita',
                            width: 90,
                            items: [
                                {
                                    handler: function (grid, rowIndex, colIndex) {
                                        var record = grid.getStore().getAt(rowIndex);
                                        OrdenesCompraUtils.enviarReceiptConfirm(record);
                                    }
                                }
                            ]
                        },
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