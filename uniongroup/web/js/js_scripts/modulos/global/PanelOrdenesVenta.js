/* 
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
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
                    "coms"
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
                                            renderer: v => `<span style="color:red;">${v}</span>`
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
        var preid = record.get('preid');
        if (!preid || preid === 0) {
            Ext.Msg.alert('Error', 'Esta orden no tiene Lista de Empaque generada');
            return;
        }

        // ? PRIMERO: Obtener datos para calcular estatus
        Ext.getBody().mask('Calculando estatus...');
        var totalPedido = 0;
        var totalSurtido = 0;
        var productosSurtidos = [];
        // Obtener líneas originales
        Ext.Ajax.request({
            url: contexto + '/OrdenesVenta',
            method: 'POST',
            params: {
                busqBnd: 2,
                docEntry: docEntry,
                servicio: 'ServiceOrdenVentaDet',
                limit: 9999,
                offset: 0
            },
            success: function (responseOriginal) {
                var dataOriginal = Ext.decode(responseOriginal.responseText);
                var lineasOriginales = dataOriginal.items || [];
                Ext.Array.each(lineasOriginales, function (linea) {
                    totalPedido += linea.Quantity || 0;
                });
                // Obtener productos surtidos
                Ext.Ajax.request({
                    url: contexto + '/OrdenesVenta',
                    method: 'POST',
                    params: {
                        busqBnd: 9,
                        preid: preid
                    },
                    success: function (responseSurtido) {
                        Ext.getBody().unmask();
                        var dataSurtido = Ext.decode(responseSurtido.responseText);
                        productosSurtidos = dataSurtido.items || [];
                        Ext.Array.each(productosSurtidos, function (producto) {
                            totalSurtido += producto.unidades || 0;
                        });
                        // ? CALCULAR ESTATUS AUTOMÁTICO
                        var estatusCalculado = '';
                        if (totalSurtido === 0) {
                            estatusCalculado = 'Cancelada';
                        } else if (totalSurtido >= totalPedido) {
                            estatusCalculado = 'Total';
                        } else {
                            estatusCalculado = 'Parcial';
                        }

//                        console.log('? Total Pedido:', totalPedido);
//                        console.log('? Total Surtido:', totalSurtido);
//                        console.log('? Estatus Calculado:', estatusCalculado);
                        // ? CREAR MODAL CON ESTATUS PRE-SELECCIONADO
                        var winConfirm = Ext.create('Ext.window.Window', {
                            title: 'Confirmar Envío - Orden #' + docNum,
                            width: 550,
                            height: 450,
                            modal: true,
                            layout: 'fit',
                            items: [{
                                    xtype: 'form',
                                    bodyPadding: 20,
                                    defaults: {
                                        anchor: '100%',
                                        labelWidth: 130
                                    },
                                    items: [
                                        {
                                            xtype: 'displayfield',
                                            fieldLabel: 'Doc Entry',
                                            value: docEntry,
                                            fieldStyle: 'font-weight: bold; color: #2196F3;'
                                        },
                                        {
                                            xtype: 'displayfield',
                                            fieldLabel: 'Doc Num',
                                            value: docNum,
                                            fieldStyle: 'font-weight: bold;'
                                        },
                                        {
                                            xtype: 'displayfield',
                                            fieldLabel: 'Cliente',
                                            value: cardCode
                                        },
                                        {
                                            xtype: 'displayfield',
                                            fieldLabel: 'Lista Empaque',
                                            value: preid,
                                            fieldStyle: 'font-weight: bold; color: #4CAF50;'
                                        },
                                        {
                                            xtype: 'displayfield',
                                            fieldLabel: 'Total Pedido',
                                            value: '<b style="color: #2196F3;">' + totalPedido + '</b> unidades'
                                        },
                                        {
                                            xtype: 'displayfield',
                                            fieldLabel: 'Total Surtido',
                                            value: '<b style="color: #4CAF50;">' + totalSurtido + '</b> unidades'
                                        },
                                        {
                                            xtype: 'combobox',
                                            fieldLabel: 'Estatus',
                                            id: 'cmbEstatusEnvio',
                                            allowBlank: false,
                                            editable: false,
                                            readOnly: true,
                                            store: Ext.create('Ext.data.Store', {
                                                fields: ['value', 'text'],
                                                data: [
                                                    {value: 'Total', text: 'Total'},
                                                    {value: 'Parcial', text: 'Parcial'},
                                                    {value: 'Cancelada', text: 'Cancelada'}
                                                ]
                                            }),
                                            valueField: 'value',
                                            displayField: 'text',
                                            value: estatusCalculado, // ? PRE-SELECCIONADO
                                            fieldStyle: 'font-weight: bold;',
                                            listeners: {
                                                change: function (combo, newValue) {
                                                    // ?? Advertir si cambia el valor
                                                    if (newValue !== estatusCalculado) {
                                                        Ext.Msg.alert(
                                                                'Advertencia',
                                                                'El estatus calculado es <b>' + estatusCalculado + '</b> pero seleccionaste <b>' + newValue + '</b>'
                                                                );
                                                    }
                                                }
                                            }
                                        },
                                        {
                                            xtype: 'textareafield',
                                            fieldLabel: 'Observaciones',
                                            id: 'txtMemoEnvio',
                                            height: 80,
                                            maxLength: 250
                                        }
                                    ]
                                }],
                            buttons: [
                                {
                                    text: 'Confirmar Envío',
                                    iconCls: 'fa fa-check',
                                    handler: function () {
                                        var form = winConfirm.down('form').getForm();
                                        if (!form.isValid()) {
                                            Ext.Msg.alert('Atención', 'Complete todos los campos obligatorios');
                                            return;
                                        }

                                        var estatus = Ext.getCmp('cmbEstatusEnvio').getValue();
                                        var memo = Ext.getCmp('txtMemoEnvio').getValue() || '';
                                        winConfirm.close();
                                        Ext.getBody().mask('Procesando envío...');
                                        // Construir líneas
                                        var lineas = [];
                                        var lineNum = 0;
                                        Ext.Array.each(productosSurtidos, function (producto) {
                                            lineas.push({
                                                LineNum: lineNum++,
                                                ItemCode: producto.itemcode,
                                                BarCode: producto.barcode,
                                                Quantity: producto.unidades
                                            });
                                        });
                                        var now = new Date();
                                        var docDate = now.getFullYear() + '-' +
                                                String(now.getMonth() + 1).padStart(2, '0') + '-' +
                                                String(now.getDate()).padStart(2, '0') + 'T' +
                                                String(now.getHours()).padStart(2, '0') + ':' +
                                                String(now.getMinutes()).padStart(2, '0') + ':' +
                                                String(now.getSeconds()).padStart(2, '0');
                                        var shipmentConfirm = {
                                            ShipmentConfirm: {
                                                DocDate: docDate,
                                                DocNum: docNum,
                                                NumAtCard: record.get('NumAtCard') || '',
                                                TransactionNumber: String(preid),
                                                AddressCode: record.get('AddressCode') || '',
                                                Status: estatus,
                                                Memo: memo
                                            },
                                            ControlValues: {
                                                TotalQuantity: totalSurtido,
                                                TotalLines: lineas.length
                                            },
                                            Lines: lineas
                                        };
                                        var jsonToSend = Ext.encode(shipmentConfirm);
//                                        console.log('? ShipmentConfirm a enviar:', jsonToSend);
                                        Ext.Ajax.request({
                                            url: contexto + '/OrdenesVenta',
                                            method: 'POST',
                                            params: {
                                                busqBnd: 6,
                                                valores: jsonToSend
                                            },
                                            success: function (responseConfirm) {
                                                Ext.getBody().unmask();
                                                try {
                                                    var resultado = Ext.decode(responseConfirm.responseText);

                                                    if (resultado.success) {
//                                                        console.log("? Respuesta del cliente:", resultado.clienteResponse);

                                                        // ? PRIMERO: Actualizar estatus silenciosamente
                                                        var ovid = record.get("OVID");
                                                        OrdenesVentaUtils.ConfirmarOrdenVenta(ovid, true);

                                                        // ? SEGUNDO: Construir mensaje
                                                        var msg = 'Confirmación de envío procesada exitosamente<br><br>';
                                                        msg += '<b>Orden:</b> ' + docNum + '<br>';
                                                        msg += '<b>Lista Empaque:</b> ' + preid + '<br>';
                                                        msg += '<b>Estatus:</b> ' + estatus + '<br>';
                                                        msg += '<b>Pedido:</b> ' + totalPedido + ' | <b>Surtido:</b> ' + totalSurtido + '<br>';

                                                        if (resultado.clienteResponse) {
                                                            var cr = resultado.clienteResponse;
                                                            msg += '<b>Folio:</b> ' + (cr.DocNum || 'N/A') + '<br>';
                                                            msg += '<b>Fecha:</b> ' + (cr.DocDate || 'N/A') + '<br>';
                                                            msg += '<b>Transaction #:</b> ' + (cr.TransactionNumber || 'N/A');
                                                        }

                                                        // ? TERCERO: Mostrar mensaje
                                                        Ext.Msg.alert('Éxito', msg, function () {
                                                            OrdenesVentaUtils.BtnBusqOrdenVenta();
                                                        });
                                                    } else {
                                                        Ext.Msg.alert('Error', resultado.message || 'Error al procesar');
                                                    }
                                                } catch (e) {
                                                    console.error('? Error al procesar:', e);  // ? Ver el error exacto
                                                    console.error('? Respuesta completa:', responseConfirm.responseText);
                                                    Ext.Msg.alert('Error', 'Error al procesar la respuesta: ' + e.message);
                                                }
                                            },
                                            failure: function () {
                                                Ext.getBody().unmask();
                                                Ext.Msg.alert('Error', 'Error al enviar la confirmación');
                                            }
                                        });
                                    }
                                },
                                {
                                    text: 'Cancelar',
                                    iconCls: 'icn-back',
                                    handler: function () {
                                        winConfirm.close();
                                    }
                                }
                            ]
                        });
                        winConfirm.show();
                    },
                    failure: function () {
                        Ext.getBody().unmask();
                        Ext.Msg.alert('Error', 'Error al obtener productos surtidos');
                    }
                });
            },
            failure: function () {
                Ext.getBody().unmask();
                Ext.Msg.alert('Error', 'Error al obtener líneas originales');
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
                "preid"
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
                {codigo: 'A', descripcion: 'Activo'},
                {codigo: 'P', descripcion: 'Pendiente'},
                {codigo: 'C', descripcion: 'Confirmado'},
                {codigo: 'X', descripcion: 'Cancelado'}
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
                                            displayField: 'descripcion',
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
                                            fieldLabel: "Dias Atras",
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
                                            // C?digo a ejecutar si se presiona el bot?n "P?gina actual"
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
                            text: "NumeAtCard",
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
                            text: "Memo",
                            dataIndex: "Memo",
                            width: 200,
                            filter: {type: 'string'}
                        },
                        {
                            xtype: "actioncolumn",
                            text: 'Genrar LE',
                            sortable: false,
                            align: "center",
                            width: 90,
                            items: [
                                {
                                    getClass: function (v, meta, record) {

                                        var estatus = record.get("OVEstatusId");
                                        var leNo = record.get("preid");
                                        var estatusVenta = record.get("preestatus");

                                        return estatus === "X" || leNo !== 0 || estatusVenta === "Surtido"
                                                ? "icn-lista-disable"
                                                : "icn-lista";
                                    },
                                    handler: function (grid, rowIndex, colIndex, item, event, record) {
                                        Ext.MessageBox.show({
                                            title: "Central de Ventas",
                                            msg: '¿Estás seguro que deseas Crear la lista de empaque para el registro ' + record.data.OVID + ' ?',
                                            buttons: Ext.MessageBox.OKCANCEL,
                                            icon: Ext.MessageBox.QUESTION,
                                            fn: function (btn) {
                                                if (btn === 'ok') {
                                                    var rowData = record.data;
                                                    record.drop();
                                                    OrdenesVentaUtils.GenerarListaEmpaque(Ext.JSON.encode(record.data));
                                                } else {
                                                    this.close();
                                                }
                                            }
                                        });
                                    },
                                },
                            ],
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
                            xtype: 'actioncolumn',
                            text: 'Confirmar Envío',
                            width: 90,
                            align: 'center',
//                            iconCls: 'icn-habilita',
                            items: [
                                {
                                    tooltip: 'Confirmar Envío',
                                    getClass: function (v, meta, record) {
                                        var estatus = record.get("preestatus");
                                        return estatus === "Surtido" || estatus === "Recibido" || estatus === "Confirmado"
                                                ? "icn-habilita"
                                                : "icn-habilita-disable";
                                    },
                                    handler: function (grid, rowIndex, colIndex) {
                                        var record = grid.getStore().getAt(rowIndex);
                                        OrdenesVentaUtils.enviarShipmentConfirm(record);
                                    }
                                }]
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
                                    getClass: function (v, meta, record) {
                                        var estatus = record.get("OVEstatusId");
                                        var estatus2 = record.get("preestatus");

                                        return estatus === "A" && estatus2 === "Cancelado" && estatus2 === "Surtido"
                                                ? "icn-cancela"
                                                : "icn-cancela-disable";
                                    },
                                    handler: function (grid, rowIndex, colIndex, item, event, record) {
                                        Ext.MessageBox.show({
                                            title: "Ordenes de Venta",
                                            msg: '¿Estás seguro que deseas cancelar la venta ' + record.data.OVID + ' ?',
                                            buttons: Ext.MessageBox.OKCANCEL,
                                            icon: Ext.MessageBox.QUESTION,
                                            fn: function (btn) {
                                                if (btn === 'ok') {
                                                    var rowData = record.data;
                                                    record.drop();
                                                    OrdenesVentaUtils.EliminarOrdenVeta(Ext.JSON.encode(record.data));
                                                } else {
                                                    this.close();
                                                }
                                            }
                                        });
                                    },
                                },
                            ],
                        },
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