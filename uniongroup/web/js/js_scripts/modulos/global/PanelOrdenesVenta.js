/* * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/JSP_Servlet/JavaScript.js to edit this template
 */

Ext.define('OrdenesVentaUtils', {
    singleton: true,
    dias: localStorage.getItem('diasAtras'),
    BtnBusqOrdenVenta: function () {

        var idEstatusVenta = Ext.getCmp('idCmbEstatusVenta').getValue();
        var idCmbFechaVenta = Ext.Date.format(Ext.getCmp("idCmbFechaVenta").getValue(), "d-m-Y");
        var idCmbDiasVenta = Ext.getCmp('idCmbDiasVenta').getValue();
        var param;
        param = {
            busqBnd: 1,
            servicio: 'ServiceOrdenVenta',
            idEstatusVenta: idEstatusVenta,
            idCmbFechaVenta: idCmbFechaVenta,
            idCmbDiasVenta: idCmbDiasVenta,
        };
        OrdenesVentaUtils.BuscarOrdenVenta(param);
        var storeOrdenesVentas = Ext.StoreManager.lookup('storeOrdenesVenta');
        storeOrdenesVentas.getProxy().setExtraParams(param);
        storeOrdenesVentas.loadPage(1);
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
                    {name: "LineNum", type: 'int'},
                    "ItemCode",
                    "BarCode",
                    {name: "Quantity", type: 'int'},
                    "coms",
                    "CONFIRMEDQUANTITY"
                ]
            });
        }

        // Store para las líneas LOCALES
        var storeLineasVentas = Ext.create('Ext.data.Store', {
            model: 'modelLineasOrdenVentaLocal',
            autoLoad: true,
            pageSize: 25, // ? AGREGAR
            proxy: {
                type: "ajax",
                url: contexto + "/OrdenesVenta",
                pageParam: false, // ? AGREGAR
                startParam: "offset", // ? AGREGAR
                limitParam: "limit", // ? AGREGAR
                extraParams: {
                    busqBnd: 2,
                    docEntry: docEntry,
                    servicio: 'ServiceOrdenVentaDet'
                },
                reader: {
                    type: "json",
                    rootProperty: "items", // ? CAMBIAR de "" a "items"
                    totalProperty: "total"  // ? AGREGAR
                }
            },
            listeners: {
                load: function (store, records, successful) {
                    if (successful) {
//                        console.log('? Cargadas ' + records.length + ' líneas locales para orden #' + docNum);
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
            id: 'winLineasOrdenVentaLocal',
            title: 'Líneas de Orden #' + docNum + ' - Cliente: ' + cardCode,
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
                            iconCls: 'icn-refresh',
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
                        },
                        {
                            text: "Comentarios",
                            dataIndex: "coms",
                            width: 300,
                            align: "right",
                            filter: {type: 'string'},
                        }
                    ],
                    bbar: {// ? AGREGAR ESTO
                        xtype: 'pagingtoolbar',
                        store: storeLineasVentas,
                        displayInfo: true,
                        displayMsg: 'Mostrando {0} - {1} de {2} líneas',
                        emptyMsg: "No hay líneas para mostrar"
                    },
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
        // Modelo para las líneas
        if (!Ext.ClassManager.get('modelLineasOrdenVenta')) {
            Ext.define('modelLineasOrdenVenta', {
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
            model: 'modelLineasOrdenVenta',
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
//                        console.log('? Cargadas ' + records.length + ' líneas para orden #' + docNum);
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
            id: 'winLineasOrdenVenta',
            title: 'Líneas de Orden #' + docNum + ' - Cliente: ' + cardCode,
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
                            iconCls: 'icn-refresh',
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
    // ? MODIFICAR PARA ACEPTAR ÓRDENES SELECCIONADAS
    guardarNuevasOrdenes: function (selectedRecords) {
        var ordenesAGuardar = selectedRecords || [];
        var totalSeleccionadas = ordenesAGuardar.length;
        Ext.MessageBox.confirm(
                'Confirmar',
                '¿Está seguro de cargar ' + totalSeleccionadas + ' orden(es) de venta seleccionada(s)?',
                function (btn) {
                    if (btn === 'yes') {

                        Ext.getBody().mask('Obteniendo órdenes de venta...');
                        // ? Convertir records a array de objetos planos
                        var ordenesHeader = [];
                        Ext.Array.each(ordenesAGuardar, function (record) {
                            ordenesHeader.push({
                                DocEntry: record.get('DocEntry'),
                                DocNum: record.get('DocNum'),
                                NumAtCard: record.get('NumAtCard'),
                                DocDate: record.get('DocDate'),
                                CardCode: record.get('CardCode'),
                                AddressCode: record.get('AddressCode'),
                                Status: record.get('Status'),
                                Memo: record.get('Memo')
                            });
                        });
//                        console.log('? Órdenes de venta seleccionadas para guardar:', ordenesHeader.length);
                        if (ordenesHeader.length === 0) {
                            Ext.getBody().unmask();
                            Ext.Msg.alert('Información', 'No hay órdenes de venta para procesar');
                            return;
                        }

                        // PASO 2: Obtener las líneas de cada orden
                        var promises = [];
                        var ordenesCompletas = [];
                        ordenesHeader.forEach(function (orden) {
                            promises.push(
                                    new Promise(function (resolve, reject) {
                                        Ext.Ajax.request({
                                            url: contexto + '/OrdenesVenta',
                                            method: 'POST',
                                            params: {
                                                busqBnd: 4,
                                                docEntry: orden.DocEntry
                                            },
                                            success: function (responseLineas) {
                                                var lineas = Ext.decode(responseLineas.responseText);
                                                ordenesCompletas.push({
                                                    SalesOrder: {
                                                        DocEntry: orden.DocEntry,
                                                        DocNum: orden.DocNum,
                                                        NumAtCard: orden.NumAtCard,
                                                        DocDate: orden.DocDate,
                                                        CardCode: orden.CardCode,
                                                        AddressCode: orden.AddressCode,
                                                        Status: orden.Status,
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
                            OrdenesVentaUtils.iniciarEnvioPorLotes(ordenesCompletas);
                        }).catch(function (error) {
                            Ext.getBody().unmask();
                            console.error('? Error al obtener líneas:', error);
                            Ext.Msg.alert('Error', 'Error al obtener las líneas de las órdenes');
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
                clienteResponseGlobal = [],
                index = 0;
        var progressWin = Ext.create('Ext.window.Window', {
            title: 'Guardando Órdenes de Venta',
            width: 400,
            height: 160,
            modal: true,
            closable: false,
            layout: 'vbox',
            bodyPadding: 20,
            items: [
                {xtype: 'label', id: 'lblProgresoOrdenesVenta', text: 'Iniciando...', margin: '0 0 10 0'},
                {xtype: 'progressbar', id: 'barProgresoOrdenesVenta', width: '100%'}
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
            Ext.getCmp('lblProgresoOrdenesVenta').setText('Procesando: ' + (index + 1) + ' - ' + fin + ' de ' + totalOrders);
            Ext.getCmp('barProgresoOrdenesVenta').updateProgress(pct);
            Ext.Ajax.request({
                url: contexto + '/OrdenesVenta',
                method: 'POST',
                params: {
                    busqBnd: 5,
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
                                    o => o.SalesOrder.DocEntry === item.DocEntry
                            );
                            var row = {
                                DocEntry: item.DocEntry || 'N/A',
                                DocNum: item.DocNum || '',
                                OVID: item.OVID || '',
                                CardCode: ordenOriginal ? ordenOriginal.SalesOrder.CardCode : '',
                                NumAtCard: ordenOriginal ? ordenOriginal.SalesOrder.NumAtCard : '',
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
//                        console.log('? Órdenes de Venta Confirmadas:', confirmadosGlobal);
                        me.mostrarResultados(confirmadosGlobal, erroresGlobal, clienteResponseGlobal);
                    }
                },
                failure: function () {
                    index += loteSize;
                    if (index < totalOrders) {
                        enviarSiguienteLote();
                    } else {
                        progressWin.close();
//                        console.log('? Órdenes de Venta Confirmadas:', confirmadosGlobal);
                        me.mostrarResultados(confirmadosGlobal, erroresGlobal, clienteResponseGlobal);
                    }
                }
            });
        }
        enviarSiguienteLote();
    },
    mostrarResultados: function (confirmData, noConfirmData, clienteData) {
        if (!Ext.ClassManager.get('ResultadoOrdenesVentaModel')) {
            Ext.define('ResultadoOrdenesVentaModel', {
                extend: 'Ext.data.Model',
                fields: ['DocEntry', 'DocNum', 'OVID', 'CardCode', 'NumAtCard', 'fecha', 'linesInserted', 'linesFailed', 'mensaje']
            });
        }

        // ? Modelo para respuesta del cliente
        if (!Ext.ClassManager.get('ClienteResponseVentaModel')) {
            Ext.define('ClienteResponseVentaModel', {
                extend: 'Ext.data.Model',
                fields: ['Folio', 'DocEntry', 'ObjType', 'SystemDate']
            });
        }

        var storeConfirm = Ext.create('Ext.data.Store', {model: 'ResultadoOrdenesVentaModel', data: confirmData});
        var storeNoConfirm = Ext.create('Ext.data.Store', {model: 'ResultadoOrdenesVentaModel', data: noConfirmData});
        var storeCliente = Ext.create('Ext.data.Store', {model: 'ClienteResponseVentaModel', data: clienteData || []});
        const win = Ext.create('Ext.window.Window', {
            title: 'Resultados de Sincronización - Órdenes de Venta',
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
                                        {text: 'OVID', dataIndex: 'OVID', width: 80, align: 'center'},
                                        {text: 'Doc Entry', dataIndex: 'DocEntry', width: 120, align: 'center'},
                                        {text: 'Doc Num', dataIndex: 'DocNum', width: 150, flex: 1},
                                        {text: 'Cliente', dataIndex: 'NumAtCard', width: 150, flex: 1},
                                        {text: 'CardCode', dataIndex: 'CardCode', width: 120},
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
                                            renderer: v => `<span style="color:red; white-space: normal; word-break: break-word;">${v}</span>`
                                        }
                                    ],
                                    viewConfig: {stripeRows: true}
                                }]
                        },
                        // ? TAB: Confirmación Cliente
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
                        OrdenesVentaUtils.BtnBusqOrdenVenta();
                        var winOrdenes = Ext.getCmp('winOrdenesVenta');
                        if (winOrdenes) {
                            winOrdenes.close();
                        }
                    }
                }]
        });
        win.show();
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
                    "AddressCode",
                    "Status",
                    "Memo",
                    "Warehouse",
                    {name: "OrderTotal", type: 'number'}, // ? AGREGAR
                    {name: "TotalLines", type: 'int'}      // ? AGREGAR
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
                    selModel: {
                        type: 'checkboxmodel',
                        mode: 'MULTI',
                        checkOnly: false,
                        showHeaderCheckbox: true
                    },
                    plugins: {
                        gridfilters: true
                    },
                    tbar: [
                        {
                            xtype: 'button',
                            text: 'Guardar Seleccionadas',
                            iconCls: 'icn-guardar',
                            scale: 'medium',
                            handler: function () {
                                var grid = this.up('grid');
                                var selected = grid.getSelection();
                                if (selected.length === 0) {
                                    Ext.Msg.alert('Atención', 'Debe seleccionar al menos una orden de venta');
                                    return;
                                }

                                OrdenesVentaUtils.guardarNuevasOrdenes(selected);
                            }
                        },
                        '->',
                        {
                            xtype: 'displayfield',
                            id: 'lblSeleccionadasVenta',
                            value: '<b>Seleccionadas: 0</b>',
                            fieldStyle: 'font-size: 13px; color: #FF9800;'
                        },
                        {
                            xtype: 'button',
                            text: 'Recargar',
                            iconCls: 'icn-refresh',
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
                            width: 50,
                            align: "center"
                        },
                        {
                            text: "DocNum",
                            dataIndex: "DocNum",
                            width: 150,
                            align: "center",
                            filter: {type: 'string'}
                        },
                        {
                            text: "Status",
                            dataIndex: "Status",
                            width: 120,
                            align: "center",
                            filter: {type: 'string'}
                        },
                        {
                            text: "NumAtCard",
                            dataIndex: "NumAtCard",
                            width: 150,
                            align: "center",
                            filter: {type: 'string'}
                        },
                        {
                            text: "DocDate",
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
                            text: "CardCode",
                            dataIndex: "CardCode",
                            width: 150,
                            filter: {type: 'string'}
                        },
                        {
                            text: "AddressCode",
                            dataIndex: "AddressCode",
                            width: 150,
                            filter: {type: 'string'}
                        },
                        {
                            text: "Warehouse",
                            dataIndex: "Warehouse",
                            width: 150,
                            filter: {type: 'string'}
                        },
                        {
                            text: "TotalLines",
                            dataIndex: "TotalLines",
                            width: 120,
                            align: "center",
                            filter: {type: 'number'},
                            renderer: function (value) {
                                return '<b style="color: #2196F3;">' + value + '</b>';
                            }
                        },
                        {
                            text: "OrderTotal",
                            dataIndex: "OrderTotal",
                            width: 150,
                            align: "right",
                            filter: {type: 'number'},
                            renderer: function (value) {
                                return '<b style="color: #4CAF50;">' + Ext.util.Format.number(value, '0,000.00') + '</b>';
                            }
                        },
                        {
                            text: "Memo",
                            dataIndex: "Memo",
                            width: 200,
                            filter: {type: 'string'}
                        }
                    ],
                    listeners: {
                        selectionchange: function (selModel, selected) {
                            var lbl = Ext.getCmp('lblSeleccionadasVenta');
                            if (lbl) {
                                lbl.setValue('<b>Seleccionadas: ' + selected.length + '</b>');
                            }
                        },
                        rowdblclick: function (grid, record) {
                            OrdenesVentaUtils.verLineasOrden(record);
                        }
                    }
                }
            ]
        });
        win.show();
    },

//    ConfirmarOrdenVenta: function (ovid, idUsuario) {
//        var payload = {
//            OVID: ovid,
//            OVEstatusId: "A",
//        };
//        Ext.Ajax.request({
//            url: contexto + '/OrdenesVenta',
//            timeout: 60000,
//            params: {
//                busqBnd: 10,
//                centralVenta: Ext.JSON.encode(payload)
//            },
//            success: function (response) {
//                var resultado = Ext.JSON.decode(response.responseText);
//                Ext.MessageBox.show({
//                    title: 'Orden Venta',
//                    msg: resultado.message,
//                    buttons: Ext.MessageBox.OK,
//                    icon: Ext.MessageBox.INFO,
//                    fn: function () {
//                        OrdenesVentaUtils.BtnBusqOrdenVenta();
//                    }
//                });
//            },
//            failure: function () {
//                Ext.MessageBox.show({
//                    title: 'Error',
//                    msg: 'No se pudo confirmar la orden...',
//                    buttons: Ext.MessageBox.CANCEL,
//                    icon: Ext.MessageBox.ERROR
//                });
//            }
//        });
//    },

    ConfirmarOrdenVenta: function (ovid, silent) {  // ? AGREGAR silent
        var payload = {
            OVID: ovid,
            OVEstatusId: "A",
        };
        Ext.Ajax.request({
            url: contexto + '/OrdenesVenta',
            timeout: 60000,
            params: {
                busqBnd: 10,
                centralVenta: Ext.JSON.encode(payload)
            },
            success: function (response) {
                var resultado = Ext.JSON.decode(response.responseText);

                // ? Solo mostrar si NO es silencioso
                if (!silent) {
                    Ext.MessageBox.show({
                        title: 'Orden Venta',
                        msg: resultado.message,
                        buttons: Ext.MessageBox.OK,
                        icon: Ext.MessageBox.INFO,
                        fn: function () {
                            OrdenesVentaUtils.BtnBusqOrdenVenta();
                        }
                    });
                } else {
                    console.log('? Estatus actualizado silenciosamente:', resultado.message);
                }
            },
            failure: function () {
                Ext.MessageBox.show({
                    title: 'Error',
                    msg: 'No se pudo confirmar la orden...',
                    buttons: Ext.MessageBox.CANCEL,
                    icon: Ext.MessageBox.ERROR
                });
            }
        });
    },

    enviarShipmentConfirm: function (record) {
        var docEntry = record.get('DocEntry');
        var docNum = record.get('DocNum');
        var cardCode = record.get('CardCode');
        var addressCode = record.get('AddressCode') || '';
        var preid = record.get('preid');
        var ovid = record.get('OVID');
        var confirmCount = record.get('CONFIRMCOUNT') || 0;

        if (!preid || preid === 0) {
            Ext.Msg.alert('Error', 'Esta orden no tiene Lista de Empaque generada');
            return;
        }

        Ext.getBody().mask('Calculando estatus y remanentes...');
        var totalPedido = 0;
        var totalSurtido = 0;

        // 1. Obtener las líneas originales de la orden
        Ext.Ajax.request({
            url: contexto + '/OrdenesVenta',
            method: 'POST',
            params: {busqBnd: 2, docEntry: docEntry, servicio: 'ServiceOrdenVentaDet', limit: 9999, offset: 0},
            success: function (responseOriginal) {
                var dataOriginal = Ext.decode(responseOriginal.responseText);
                var lineasOriginales = dataOriginal.items || [];

                // 2. Obtener lo que el almacén surtió físicamente
                Ext.Ajax.request({
                    url: contexto + '/OrdenesVenta',
                    method: 'POST',
                    params: {busqBnd: 9, preid: preid},
                    success: function (responseSurtido) {
                        Ext.getBody().unmask();
                        var dataSurtido = Ext.decode(responseSurtido.responseText);
                        var productosSurtidos = dataSurtido.items || [];

                        // Mapeo: Relacionamos el ItemCode con la cantidad surtida
                        var mapSurtidos = {};
                        Ext.Array.each(productosSurtidos, function (p) {
                            mapSurtidos[p.itemcode] = parseFloat(p.unidades) || 0;
                        });

                        var deltaTotalAEnviar = 0;
                        var linesAEnviar = [];

                        // Iterar sobre las líneas ORIGINALES para conservar el LineNum exacto de SAP
                        Ext.Array.each(lineasOriginales, function (linea) {
                            var qtyOriginal = parseFloat(linea.Quantity) || 0;
                            var qtyConfirmadaPrevia = parseFloat(linea.CONFIRMEDQUANTITY) || 0;

                            // Buscamos cuánto de este producto se surtió en la lista de empaque
                            var qtySurtidaFisica = mapSurtidos[linea.ItemCode] || 0;

                            var delta = qtySurtidaFisica - qtyConfirmadaPrevia;
                            if (delta < 0)
                                delta = 0;

                            totalPedido += qtyOriginal;
                            totalSurtido += qtySurtidaFisica;
                            deltaTotalAEnviar += delta;

                            // Solo agregar al JSON si hay piezas nuevas que enviar en esta transacción
                            if (delta > 0) {
                                linesAEnviar.push({
                                    LineNum: linea.LineNum,
                                    ItemCode: linea.ItemCode,
                                    BarCode: linea.BarCode,
                                    Quantity: delta
                                });
                            }
                        });

                        if (deltaTotalAEnviar === 0) {
                            Ext.Msg.alert('Atención', 'No surtidos pendientes por confirmar.');
                            return;
                        }

                        // Estatus permitidos en ShipmentConfirm: "Total" o "Parcial"
                        var estatusCalculado = '';
                        var esEntregaCompleta = false;

                        if (totalSurtido >= totalPedido) {
                            estatusCalculado = 'Total';
                            esEntregaCompleta = true;
                        } else if (totalSurtido > 0) {
                            estatusCalculado = 'Parcial';
                            esEntregaCompleta = false;
                        } else {
                            estatusCalculado = 'Cancelada';
                        }

                        var siguienteEnvio = confirmCount + 1;
                        var transactionNumber = preid + "_" + siguienteEnvio;

                        var memoField = Ext.create('Ext.form.field.TextArea', {
                            fieldLabel: 'Observaciones',
                            name: 'memo',
                            labelWidth: 130,
                            height: 70,
                            anchor: '100%',
                            value: 'Envío ' + estatusCalculado + ' transacción #' + siguienteEnvio
                        });

                        var winConfirm = Ext.create('Ext.window.Window', {
                            title: 'Confirmar Envío ' + estatusCalculado + ' - ' + docNum,
                            width: 550, layout: 'fit', modal: true,
                            items: [{
                                    xtype: 'form', bodyPadding: 20,
                                    items: [
                                        {xtype: 'displayfield', fieldLabel: 'Doc Num', value: docNum, labelWidth: 130},
                                        {xtype: 'displayfield', fieldLabel: 'Lista Empaque', value: '<b>' + preid + '</b>', labelWidth: 130},
                                        {xtype: 'displayfield', fieldLabel: 'Transacción', value: '<b>' + transactionNumber + '</b>', labelWidth: 130},
                                        {xtype: 'displayfield', fieldLabel: 'Total Pedido', value: totalPedido + ' pzas', labelWidth: 130},
                                        {xtype: 'displayfield', fieldLabel: 'Surtido (Físico)', value: totalSurtido + ' pzas', labelWidth: 130},
                                        {xtype: 'displayfield', fieldLabel: 'A Confirmar', value: '<b style="color: #4CAF50;">' + deltaTotalAEnviar + ' pzas</b>', labelWidth: 130},
                                        {xtype: 'displayfield', fieldLabel: 'Estatus', value: '<b style="color: #2196F3;">' + estatusCalculado + '</b>', labelWidth: 130},
                                        memoField
                                    ],
                                    buttons: [
                                        {text: 'Cancelar', handler: function () {
                                                winConfirm.close();
                                            }},
                                        {
                                            text: 'Confirmar y Enviar', iconCls: 'fa fa-check',
                                            handler: function () {
                                                var memo = memoField.getValue();
                                                winConfirm.close();
                                                Ext.getBody().mask('Procesando envío...');

                                                var docDate = Ext.Date.format(new Date(), "Y-m-d\\TH:i:s");
                                                var jsonSend = {
                                                    ShipmentConfirm: {
                                                        DocDate: docDate,
                                                        DocNum: docNum,
                                                        NumAtCard: record.get('NumAtCard') || '',
                                                        TransactionNumber: transactionNumber,
                                                        AddressCode: addressCode,
                                                        Status: estatusCalculado,
                                                        Memo: memo
                                                    },
                                                    ControlValues: {
                                                        TotalQuantity: deltaTotalAEnviar,
                                                        TotalLines: linesAEnviar.length
                                                    },
                                                    Lines: linesAEnviar
                                                };

                                                Ext.Ajax.request({
                                                    url: contexto + '/OrdenesVenta',
                                                    method: 'POST',
                                                    params: {
                                                        busqBnd: 6,
                                                        valores: Ext.encode(jsonSend),
                                                        ovid: ovid,
                                                        esCompleta: esEntregaCompleta ? 'S' : 'N'
                                                    },
                                                    success: function (responseConfirm) {
                                                        Ext.getBody().unmask();
                                                        var resultado = Ext.decode(responseConfirm.responseText);

                                                        if (resultado.success) {
                                                            var cr = resultado.clienteResponse || {};
                                                            var docNumResp = cr.DocNum || 'N/A';
                                                            var statusMensaje = (cr.StatusInfo && cr.StatusInfo.Mensaje) ? cr.StatusInfo.Mensaje : 'OK';

                                                            var systemDate = cr.SystemDate || 'N/A';
                                                            var fechaFormateada = systemDate;
                                                            if (systemDate !== 'N/A') {
                                                                try {
                                                                    fechaFormateada = Ext.Date.format(new Date(systemDate), 'd/m/Y H:i:s');
                                                                } catch (e) {
                                                                    fechaFormateada = systemDate;
                                                                }
                                                            }

                                                            var msg = 'Confirmación de envío procesada exitosamente<br><br>' +
                                                                    '<b>Orden:</b> ' + docNum + '<br>' +
                                                                    '<b>Transacción:</b> ' + transactionNumber + '<br>' +
                                                                    '<b>Estatus:</b> ' + estatusCalculado + '<br>' +
                                                                    '<b>Enviado en esta transacción:</b> <b style="color:#4CAF50;">' + deltaTotalAEnviar + ' pzas</b><br>' +
                                                                    '<b>Folio SAP:</b> ' + docNumResp + '<br>' +
                                                                    '<b>Fecha Respuesta:</b> ' + fechaFormateada + '<br>' +
                                                                    '<b>Estado Cliente:</b> ' + statusMensaje;

                                                            Ext.Msg.alert('Éxito', msg, function () {
                                                                OrdenesVentaUtils.BtnBusqOrdenVenta();
                                                            });
                                                        } else {
                                                            Ext.Msg.alert('Error', resultado.message || 'Error al procesar');
                                                        }
                                                    },
                                                    failure: function () {
                                                        Ext.getBody().unmask();
                                                        Ext.Msg.alert('Error', 'Fallo de comunicación al enviar acuse.');
                                                    }
                                                });
                                            }
                                        }
                                    ]
                                }]
                        });
                        winConfirm.show();
                    }
                });
            }
        });
    },

    EliminarOrdenVeta: function (prm) {
        Ext.Ajax.request({
            url: contexto + '/OrdenesVenta',
            timeout: 60000,
            params: {
                busqBnd: 7,
                centralVenta: prm
            },
            success: function (response) {
                Ext.MessageBox.show({
                    title: 'Orden Venta',
                    msg: Ext.JSON.decode(response.responseText).message,
                    buttons: Ext.MessageBox.OK,
                    icon: Ext.MessageBox.INFO,
                    fn: function (btn) {
                        if (btn === 'ok') {
                            BtnBusqCentralVentas();
                            Ext.getCmp('OVID').focus();
                        }
                    }
                });
                OrdenesVentaUtils.BtnBusqOrdenVenta();
            },
            failure: function (response, opts) {
                Ext.MessageBox.show({
                    title: 'Error',
                    msg: 'No se pudo guardar los datos...',
                    buttons: Ext.MessageBox.CANCEL,
                    icon: Ext.MessageBox.ERROR
                });
            }
        });
    },
    cargarStoreYGenerarExcel: function (storeName, archivoName, parametros) {
        var idCmbFechaVenta = Ext.Date.format(Ext.getCmp("idCmbFechaVenta").getValue(), "d-m-Y");
        var idCmbDiasVenta = Ext.getCmp("idCmbDiasVenta").getValue();
        var idCmbEstatusVenta = Ext.getCmp("idCmbEstatusVenta").getValue();
        var grd = Ext.getCmp(storeName);
        var store = grd.getStore();
        store.removeAll(true);
        var storeOrdenesVenta = Ext.StoreManager.lookup('storeOrdenesVenta');
        var param = {
            idCmbFechaVenta: idCmbFechaVenta,
            idCmbDiasVenta: idCmbDiasVenta,
            idCmbEstatusVenta: idCmbEstatusVenta,
            busqBnd: 1,
            servicio: 'ServiceOrdenVenta',
            offset: 0,
            limit: 99999999
        };
        store.reload({
            params: param,
            callback: function (records, operation, success) {
                if (success) {
                    generarExcel(storeName, archivoName, parametros);
                    storeOrdenesVenta.loadPage(1);
                }
            }
        });
    },
    GenerarListaEmpaque: function (prm) {
        Ext.Ajax.request({
            url: contexto + '/OrdenesVenta',
            timeout: 60000,
            params: {
                busqBnd: 8,
                ordenListaEmpaque: prm
            },
            success: function (response) {
                Ext.MessageBox.show({
                    title: 'Orden venta',
                    msg: Ext.JSON.decode(response.responseText).message,
                    buttons: Ext.MessageBox.OK,
                    icon: Ext.MessageBox.INFO,
                    fn: function (btn) {
                        if (btn === 'ok') {
                            OrdenesVentaUtils.BtnBusqOrdenVenta();
                            Ext.getCmp('OVID').focus();
                        }
                    }
                });
            },
            failure: function (response, opts) {
                Ext.MessageBox.show({
                    title: 'Error',
                    msg: 'No se pudo guardar los datos...',
                    buttons: Ext.MessageBox.CANCEL,
                    icon: Ext.MessageBox.ERROR
                });
            }
        });
    },
    EliminarListaEmpaque: function (prm) {
        Ext.getBody().mask('Eliminando lista de empaque ');
        Ext.Ajax.request({
            url: contexto + '/OrdenesVenta',
            timeout: 60000,
            params: {
                busqBnd: 11,
                ordenListaEmpaque: prm
            },
            success: function (response) {
                Ext.getBody().unmask();
                var res = Ext.JSON.decode(response.responseText);

                Ext.MessageBox.show({
                    title: 'Lista de Empaque',
                    msg: res.message,
                    buttons: Ext.MessageBox.OK,
                    icon: res.success ? Ext.MessageBox.INFO : Ext.MessageBox.WARNING,
                    fn: function (btn) {
                        if (btn === 'ok') {
                            OrdenesVentaUtils.BtnBusqOrdenVenta();
                        }
                    }
                });
            },
            failure: function () {
                Ext.getBody().unmask();
                Ext.MessageBox.show({
                    title: 'Error',
                    msg: 'Fallo de conexión al eliminar la lista de empaque.',
                    buttons: Ext.MessageBox.CANCEL,
                    icon: Ext.MessageBox.ERROR
                });
            }
        });
    }

});
// Panel principal
Ext.define('Modulos.global.PanelOrdenesVenta', {
    extend: 'Ext.form.Panel',
    requires: [
        'OrdenesVentaUtils'
    ],
    alias: 'widget.PanelOrdenesVenta',
    id: 'idMenu504',
    title: 'Órdenes de Venta',
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
                {
                    name: 'DocDate',
                    type: 'date',
                    convert: formatearFechaCorta
                },
                "CardCode",
                "AddressCode",
                "Status",
                "Memo",
                "OVEstatusId",
                "OVFechaInsercion",
                "preid",
                "CONFIRMCOUNT"
            ]
        });
        me.storeOrdenesVenta = Ext.create('Ext.data.Store', {
            id: "storeOrdenesVenta",
            model: 'modelOrdenesVenta',
            leadingBufferZone: 100,
            pageSize: 100,
            autoLoad: true,
            proxy: {
                type: 'ajax',
                url: contexto + '/OrdenesVenta',
                startParam: "offset",
                leadingBufferZone: 100, // Cantidad de registros adicionales para cargar por adelantado
                reader: {
                    type: 'json',
                    rootProperty: 'items',
                    totalProperty: 'total'
                }
            }
        });
        var storeEstatusVentas = Ext.create('Ext.data.Store', {
            fields: ['codigo', 'descripcion'],
            data: [
                {codigo: 'A', description: 'Activo'},
                {codigo: 'P', description: 'Pendiente'},
                {codigo: 'C', description: 'Confirmado'},
                {codigo: 'X', description: 'Cancelado'}
            ]
        });
        Ext.apply(me, {
            items: [
                {
                    xtype: 'fieldset',
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
                                            displayField: 'description',
                                            queryMode: 'local',
                                            emptyText: 'Seleccione el Estatus',
                                            allowBlank: true,
                                            editable: false,
                                            listeners: {
                                                select: function () {
                                                    OrdenesVentaUtils.BtnBusqOrdenVenta();
                                                }
                                            }
                                        },
                                        {
                                            xtype: "datefield",
                                            fieldLabel: "Fecha",
                                            id: "idCmbFechaVenta",
                                            name: "idCntComFecha",
                                            maxLength: 50,
                                            flex: 1,
                                            width: 300,
                                            allowBlank: false,
                                            listeners: {
                                                afterrender: function (datefield) {
                                                    datefield.setValue(new Date()); // Establecer la fecha actual
                                                },
                                                blur: function () {
                                                    OrdenesVentaUtils.BtnBusqOrdenVenta();
                                                }
                                            }
                                        },
                                        {
                                            xtype: "numberfield",
                                            fieldLabel: "Días Atrás",
                                            id: "idCmbDiasVenta",
                                            name: "idCntComDias",
                                            flex: 1,
                                            width: 300,
                                            allowBlank: false,
                                            value: 7,
                                            maxValue: parseInt(OrdenesVentaUtils.dias, 10),
                                            minValue: 0,
                                            enforceMaxLength: true,
                                            listeners: {
                                                change: function (field, newValue) {
                                                    var maxValue = field.maxValue;
                                                    if (newValue > maxValue) {
                                                        field.setValue(maxValue);
                                                    }
                                                },
                                                blur: function () {
                                                    OrdenesVentaUtils.BtnBusqOrdenVenta();
                                                }
                                            }
                                        },
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
                    stateful: true,
                    stateId: 'gridOrdenesVentaState',
                    plugins: {
                        gridfilters: true
                    },
                    tbar: [
                        {
                            xtype: 'button',
                            text: 'Actualizar',
                            arrowAlign: 'center',
                            iconCls: "icn-busquedaDos",
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
                            text: 'Cargar',
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
                            text: 'Exportar',
                            iconCls: 'icn-excel',
                            // width: 120,
                            handler: function (grid, rowIndex, colIndex, item, event, record) {
                                var idCmbFechaVenta = Ext.Date.format(Ext.getCmp("idCmbFechaVenta").getValue(), "d-m-Y");
                                var idCmbDiasVenta = Ext.getCmp("idCmbDiasVenta").getValue();
                                var idCmbEstatusVenta = Ext.getCmp("idCmbEstatusVenta").getValue();
                                var storeName = "gridOrdenesVenta";
                                var archivoName = "Central Venta";
                                var fechaActual = new Date();
                                var fechaFormateada = Ext.Date.format(fechaActual, 'd/m/Y H:i:s');
                                var titulo = "Central Venta";
                                var parametros = {
                                    'titulo': titulo,
                                    'Estatus': idCmbEstatusVenta,
                                    'Fecha': idCmbFechaVenta,
                                    'Dias Atras': idCmbDiasVenta,
                                    'Fecha Solicitud': fechaFormateada
                                };
                                Ext.Msg.show({
                                    title: 'Generar Excel',
                                    message: '¿Desea exportar la página actual o todos los registros existentes?',
                                    buttons: Ext.MessageBox.YESNO,
                                    buttonText: {
                                        yes: 'Página actual',
                                        no: 'Todos los registros'
                                    },
                                    icon: Ext.MessageBox.QUESTION,
                                    fn: function (btn) {
                                        if (btn === 'yes') {
                                            // Código a ejecutar si se presiona el botón "Página actual"
                                            generarExcel(storeName, archivoName, parametros);
                                        } else if (btn === 'no') {
                                            OrdenesVentaUtils.cargarStoreYGenerarExcel(storeName, archivoName, parametros);
                                        } else {
                                            console.log('Se cerró la ventana sin hacer clic en ningún botón');
                                        }
                                    }
                                });
                            },
                            listeners: {
                                afterrender: function (btn) {
                                    addTooltip(btn, 'Exportar');
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
                            width: 50,
                            align: "center",
                            filter: {type: 'number'}
                        },
                        {
                            text: "Estatus",
                            dataIndex: "OVEstatusId",
                            align: "center",
                            width: 150,
                            filter: {type: 'string'},
                            renderer: function (value) {
                                var estatusMap = {
                                    'A': 'Activo',
                                    'P': 'Pendiente',
                                    'C': 'Confirmado',
                                    'X': 'Cancelado'
                                };
                                var nombre = estatusMap[value] || value;
                                var color = '';
                                switch (value) {
                                    case 'A':
                                        color = '#4CAF50';
                                        break;
                                    case 'P':
                                        color = '#F5CF27';
                                        break;
                                    case 'C':
                                        color = '#2196F3';
                                        break;
                                    case 'X':
                                        color = '#F44336';
                                        break;
                                }
                                return '<b style="color: ' + color + ';">' + nombre + '</b>';
                            }
                        },
                        {
                            text: "DocEntry",
                            dataIndex: "DocEntry",
                            width: 150,
                            align: "center",
                            filter: {type: 'number'}
                        },
                        {
                            text: "DocNum",
                            dataIndex: "DocNum",
                            width: 150,
                            filter: {type: 'string'}
                        },
                        {
                            text: "NumAtCard",
                            dataIndex: "NumAtCard",
                            width: 150,
                            filter: {type: 'string'}
                        },
                        {
                            text: "DocDate",
                            dataIndex: "DocDate",
                            width: 150,
                            filter: {type: 'date'}
                        },
                        {
                            text: "CardCode",
                            dataIndex: "CardCode",
                            width: 150,
                            filter: {type: 'string'}
                        },
                        {
                            text: "AddressCode",
                            dataIndex: "AddressCode",
                            width: 150,
                            filter: {type: 'string'}
                        },
                        {
                            text: "Memo",
                            dataIndex: "Memo",
                            width: 200,
                            filter: {type: 'string'},
                            hidden: true
                        },
                        {
                            xtype: "actioncolumn",
                            text: 'Generar LE',
                            sortable: false,
                            align: "center",
                            width: 90,
                            items: [
                                {
                                    tooltip: 'Generar Lista de Empaque',
                                    getClass: function (v, meta, record) {
                                        var estatus = record.get("OVEstatusId");
                                        var leNo = record.get("preid");
                                        var puedeGenerar = (estatus !== "X" && estatus !== "C") && (!leNo || leNo === 0);
                                        return puedeGenerar ? "icn-lista" : "icn-lista-disable";
                                    },
                                    // Bloqueo a nivel componente (desactiva clic y navegación por teclado)
                                    isDisabled: function (view, rowIndex, colIndex, item, record) {
                                        var estatus = record.get("OVEstatusId");
                                        var leNo = record.get("preid");
                                        return (estatus === "X" || estatus === "C") || (leNo && leNo > 0);
                                    },
                                    handler: function (grid, rowIndex, colIndex, item, event, record) {
                                        var estatus = record.get("OVEstatusId");
                                        var leNo = record.get("preid");

                                        // Guardia de ejecución (evita atajos por consola o eventos forzados)
                                        if ((estatus === "X" || estatus === "C") || (leNo && leNo > 0)) {
                                            Ext.Msg.alert('Atención', 'No es posible generar una lista de empaque para esta orden en su estado actual.');
                                            return;
                                        }

                                        Ext.MessageBox.show({
                                            title: "Central de Ventas",
                                            msg: '¿Está seguro de generar la lista de empaque para la orden <b>' + record.data.DocNum + '</b>?',
                                            buttons: Ext.MessageBox.OKCANCEL,
                                            icon: Ext.MessageBox.QUESTION,
                                            fn: function (btn) {
                                                if (btn === 'ok') {
                                                    OrdenesVentaUtils.GenerarListaEmpaque(Ext.JSON.encode(record.data));
                                                }
                                            }
                                        });
                                    }
                                }
                            ]
                        },
                        {
                            text: "Lista Empaque",
                            dataIndex: "preid",
                            width: 120,
                            align: "center",
                            filter: {type: 'number'}
                        },
                        {
                            text: "Estatus Surtido",
                            dataIndex: "preestatus",
                            align: "center",
                            width: 150,
                            filter: {type: 'string'},
                            renderer: function (value) {
                                var color = '';
                                switch (value) {
                                    case 'Pendiente':
                                        color = '#FFC107';
                                        break; // Amarillo
                                    case 'En Proceso':
                                        color = '#2196F3';
                                        break; // Azul
                                    case 'Recibido':
                                    case 'Surtido':
                                        color = '#4CAF50';
                                        break; // Verde
                                    case 'Confirmado':
                                        color = '#00BCD4';
                                        break; // Cyan
                                    case 'Cancelado':
                                        color = '#F44336';
                                        break; // Rojo
                                    default:
                                        color = '#6c757d';
                                        break; // Gris - Desconocido
                                }
                                return '<b style="color: ' + color + ';">' + value + '</b>';
                            }
                        },
                        {
                            xtype: "actioncolumn",
                            text: 'Eliminar LE',
                            sortable: false,
                            align: "center",
                            width: 90,
                            items: [
                                {
                                    tooltip: 'Eliminar Lista de Empaque',
                                    getClass: function (v, meta, record) {
                                        var estatus = record.get("OVEstatusId");
                                        var leNo = record.get("preid");
                                        var estatusSurtido = record.get("preestatus");

                                        // Solo si tiene LE, NO está surtida físicamente y la orden no está cerrada/cancelada
                                        var puedeEliminarLE = (leNo && leNo > 0) &&
                                                (estatus !== "C" && estatus !== "X") &&
                                                (estatusSurtido !== "Surtido" && estatusSurtido !== "Recibido");

                                        return puedeEliminarLE ? "icn-cancela" : "icn-cancela-disable";
                                    },
                                    isDisabled: function (view, rowIndex, colIndex, item, record) {
                                        var estatus = record.get("OVEstatusId");
                                        var leNo = record.get("preid");
                                        var estatusSurtido = record.get("preestatus");

                                        var puedeEliminarLE = (leNo && leNo > 0) &&
                                                (estatus !== "C" && estatus !== "X") &&
                                                (estatusSurtido !== "Surtido" && estatusSurtido !== "Recibido");

                                        return !puedeEliminarLE;
                                    },
                                    handler: function (grid, rowIndex, colIndex, item, event, record) {
                                        var leNo = record.get("preid");
                                        var docNum = record.get("DocNum");

                                        Ext.MessageBox.show({
                                            title: "Eliminar Lista de Empaque",
                                            msg: '¿Está seguro de eliminar la lista de empaque <b>' + leNo + '</b> de la orden <b>' + docNum + '</b>?<br><br>El inventario reservado será liberado en almacén.',
                                            buttons: Ext.MessageBox.OKCANCEL,
                                            icon: Ext.MessageBox.QUESTION,
                                            fn: function (btn) {
                                                if (btn === 'ok') {
                                                    var payload = {
                                                        OVID: record.get("OVID"),
                                                        idUsuario: '1'
                                                    };
                                                    OrdenesVentaUtils.EliminarListaEmpaque(Ext.JSON.encode(payload));
                                                }
                                            }
                                        });
                                    }
                                }
                            ]
                        },
                        {
                            xtype: 'actioncolumn',
                            text: 'Confirmar Envío',
                            width: 90,
                            align: 'center',
                            items: [
                                {
                                    tooltip: 'Confirmar Envío',
                                    getClass: function (v, meta, record) {
                                        var estatus = record.get("preestatus");
                                        var estatusVenta = record.get("OVEstatusId");

                                        // Solo disponible si tiene estatus de surtido válido y la orden no está cancelada
                                        var puedeConfirmar = (estatus === "Surtido" || estatus === "Recibido" || estatus === "Confirmado") &&
                                                (estatusVenta !== "X");

                                        return puedeConfirmar ? "icn-habilita" : "icn-habilita-disable";
                                    },
                                    isDisabled: function (view, rowIndex, colIndex, item, record) {
                                        var estatus = record.get("preestatus");
                                        var estatusVenta = record.get("OVEstatusId");

                                        var puedeConfirmar = (estatus === "Surtido" || estatus === "Recibido" || estatus === "Confirmado") &&
                                                (estatusVenta !== "X");

                                        return !puedeConfirmar;
                                    },
                                    handler: function (grid, rowIndex, colIndex) {
                                        var record = grid.getStore().getAt(rowIndex);
                                        var estatus = record.get("preestatus");
                                        var estatusVenta = record.get("OVEstatusId");
                                        var preid = record.get("preid");

                                        // Guardia 1: Cancelada
                                        if (estatusVenta === "X") {
                                            Ext.Msg.alert('Atención', 'La orden se encuentra cancelada.');
                                            return;
                                        }

                                        // Guardia 2: Lista de empaque inexistente
                                        if (!preid || preid === 0) {
                                            Ext.Msg.alert('Atención', 'Esta orden no tiene una Lista de Empaque generada.');
                                            return;
                                        }

                                        // Guardia 3: Estatus físico no apto
                                        if (estatus !== "Surtido" && estatus !== "Recibido" && estatus !== "Confirmado") {
                                            Ext.Msg.alert('Atención', 'La lista de empaque aún no cuenta con piezas surtidas para confirmar el envío.');
                                            return;
                                        }

                                        OrdenesVentaUtils.enviarShipmentConfirm(record);
                                    }
                                }
                            ]
                        },
                        {
                            xtype: "actioncolumn",
                            text: "Cancelar",
                            width: 90,
                            menuDisabled: true,
                            sortable: false,
                            align: "center",
                            items: [
                                {
                                    tooltip: 'Cancelar Orden de Venta',
                                    getClass: function (v, meta, record) {
                                        var estatus = record.get("OVEstatusId");
                                        var leNo = record.get("preid");
                                        var estatusSurtido = record.get("preestatus");

                                        // CONDICIÓN ESTRICTA:
                                        // 1. No debe estar confirmada ni cancelada.
                                        // 2. NO debe tener lista de empaque activa (leNo == 0 o null).
                                        // 3. NO debe estar surtida.
                                        var puedeCancelarOrden = (estatus !== "X" && estatus !== "C") &&
                                                (!leNo || leNo === 0) &&
                                                (estatusSurtido !== "Surtido" && estatusSurtido !== "Recibido");

                                        return puedeCancelarOrden ? "icn-cancela" : "icn-cancela-disable";
                                    },
                                    isDisabled: function (view, rowIndex, colIndex, item, record) {
                                        var estatus = record.get("OVEstatusId");
                                        var leNo = record.get("preid");
                                        var estatusSurtido = record.get("preestatus");

                                        var puedeCancelarOrden = (estatus !== "X" && estatus !== "C") &&
                                                (!leNo || leNo === 0) &&
                                                (estatusSurtido !== "Surtido" && estatusSurtido !== "Recibido");

                                        return !puedeCancelarOrden;
                                    },
                                    handler: function (grid, rowIndex, colIndex, item, event, record) {
                                        var docNum = record.get("DocNum");

                                        Ext.MessageBox.show({
                                            title: "Cancelar Orden de Venta",
                                            msg: '¿Está seguro que desea cancelar la orden de venta <b>' + docNum + '</b>?',
                                            buttons: Ext.MessageBox.OKCANCEL,
                                            icon: Ext.MessageBox.QUESTION,
                                            fn: function (btn) {
                                                if (btn === 'ok') {
                                                    var payload = {
                                                        OVID: record.get("OVID"),
                                                        OVEstatusId: record.get("OVEstatusId"),
                                                        idUsuario: '1'
                                                    };
                                                    OrdenesVentaUtils.EliminarOrdenVeta(Ext.JSON.encode(payload));
                                                }
                                            }
                                        });
                                    }
                                }
                            ]
                        }
                    ],
                    listeners: {
                        edit: function (editor, e) {
                            e.record.commit();
                        },
                        rowdblclick: function (grid, record) {
                            OrdenesVentaUtils.verLineasOrdenLocal(record);
                        },
                        afterrender: function (grid) {
                            if (grid.isVisible() && !grid.isSearchExecuted) {
                                grid.isSearchExecuted = true; // Marca que la búsqueda se ha ejecutado
                                OrdenesVentaUtils.BtnBusqOrdenVenta();
                            }
                        },
                    }
                }
            ],
            bbar: {
                xtype: 'pagingtoolbar',
                store: me.storeOrdenesVenta,
                displayInfo: true,
                displayMsg: 'Mostrando {0} - {1} de {2} órdenes',
                emptyMsg: "No hay órdenes para mostrar"
            },
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