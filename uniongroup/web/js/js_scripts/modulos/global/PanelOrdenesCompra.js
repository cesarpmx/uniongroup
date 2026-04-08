/* 
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/JSP_Servlet/JavaScript.js to edit this template
 */

Ext.define('OrdenesCompraUtils', {
    singleton: true,
    dias: localStorage.getItem('diasAtras'),

    BtnBusqOrdenCompra: function () {

        var idEstatusCompras = Ext.getCmp('idCmbEstatusCompras').getValue();
        var idCmbFechaCompras = Ext.Date.format(Ext.getCmp("idCmbFechaCompras").getValue(), "d-m-Y");
        var idCmbDiasCompras = Ext.getCmp('idCmbDiasCompras').getValue();

        var param;

        param = {
            busqBnd: 4,
            servicio: 'ServiceOrdenCompra',
            idEstatusCompras: idEstatusCompras,
            idCmbFechaCompras: idCmbFechaCompras,
            idCmbDiasCompras: idCmbDiasCompras,
        };

        OrdenesCompraUtils.BuscarOrdenCompra(param);

        var storeOrdenesCompras = Ext.StoreManager.lookup('storeOrdenesCompra');
        storeOrdenesCompras.getProxy().setExtraParams(param);
        storeOrdenesCompras.loadPage(1);
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
                    {name: "TotalLines", type: 'int'},
                    "Warehouse"
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
                    // ? AGREGAR SELECTION MODEL CON CHECKBOXES
                    selModel: {
                        type: 'checkboxmodel',
                        mode: 'MULTI',
                        checkOnly: false,
                        showHeaderCheckbox: true // ? Checkbox para seleccionar todas
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
                                    Ext.Msg.alert('Atención', 'Debe seleccionar al menos una orden de compra');
                                    return;
                                }

                                // ? Pasar solo las órdenes seleccionadas
                                OrdenesCompraUtils.guardarNuevasOrdenes(selected);
                            }
                        },
                        '->',
                        {
                            xtype: 'displayfield',
                            id: 'lblSeleccionadas',
                            value: '<b>Seleccionadas: 0</b>',
                            fieldStyle: 'font-size: 13px; color: #FF9800;'
                        },
                        {
                            xtype: 'button',
                            text: 'Recargar',
                            iconCls: 'icn-refresh',
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
                                return '<b style="color: #4CAF50;">' + Ext.util.Format.number(value, '0,000') + '</b>';
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
                        // ? ACTUALIZAR CONTADOR DE SELECCIONADAS
                        selectionchange: function (selModel, selected) {
                            var lbl = Ext.getCmp('lblSeleccionadas');
                            if (lbl) {
                                lbl.setValue('<b>Seleccionadas: ' + selected.length + '</b>');
                            }
                        },
                        rowdblclick: function (grid, record) {
                            OrdenesCompraUtils.verLineasOrden(record);
                        }
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
                '¿Está seguro de cargar ' + totalSeleccionadas + ' orden(es) de compra seleccionada(s)?',
                function (btn) {
                    if (btn === 'yes') {

                        Ext.getBody().mask('Obteniendo órdenes de compra...');

                        // ? Convertir records a array de objetos planos
                        var ordenesHeader = [];
                        Ext.Array.each(ordenesAGuardar, function (record) {
                            ordenesHeader.push({
                                DocEntry: record.get('DocEntry'),
                                DocNum: record.get('DocNum'),
                                NumAtCard: record.get('NumAtCard'),
                                DocDate: record.get('DocDate'),
                                CardCode: record.get('CardCode'),
                                Memo: record.get('Memo'),
                                OrderTotal: record.get('OrderTotal'),
                                TotalLines: record.get('TotalLines')
                            });
                        });

//                        console.log('? Órdenes seleccionadas para guardar:', ordenesHeader.length);

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
//                        console.log('? Órdenes Confirmadas:', confirmadosGlobal);
                        me.mostrarResultados(confirmadosGlobal, erroresGlobal, clienteResponseGlobal);  // ? PASAR clienteResponse
                    }
                },
                failure: function () {
                    index += loteSize;
                    if (index < totalOrders) {
                        enviarSiguienteLote();
                    } else {
                        progressWin.close();
//                        console.log('? Órdenes Confirmadas:', confirmadosGlobal);
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
                    {name: "Quantity", type: 'int'},
                    "totalrecs",
                    "coms",
                    "dcoid",
                    "receivedquantity"
                ]
            });
        }

        // Store para las líneas LOCALES
        var storeLineas = Ext.create('Ext.data.Store', {
            model: 'modelLineasOrdenLocal',
            leadingBufferZone: 100,
            autoLoad: true,
            pageSize: 25,
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
                            text: "Compra",
                            dataIndex: "dcoid",
                            width: 100,
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
                            width: 100,
                            align: "center",
                            filter: {type: 'number'},
                            renderer: function (value) {
                                return '<b style="color: #4CAF50;">' + Ext.util.Format.number(value, '0,000') + '</b>';
                            }
                        },
                        {
                            text: "Recibido",
                            dataIndex: "receivedquantity",
                            align: "center",
                            width: 100,
                            filter: {type: 'number'},
                            renderer: function (value) {
                                return '<b style="color: #4CAF50;">' + Ext.util.Format.number(value, '0,000') + '</b>';
                            }
                        },
                        {
                            text: "Comentarios",
                            dataIndex: "coms",
                            width: 200,
                            filter: {type: 'string'}
                        },
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

    ConfirmarOrdenCompra: function (ocid, silent) {  // ? Agregar parámetro silent
        var payload = {
            OCID: ocid,
            OCEstatusId: "A",
        };

        Ext.Ajax.request({
            url: contexto + '/OrdenesCompra',
            timeout: 60000,
            params: {
                busqBnd: 8,
                centralCompra: Ext.JSON.encode(payload)
            },
            success: function (response) {
                var resultado = Ext.JSON.decode(response.responseText);

                // ? Solo mostrar mensaje si NO es silencioso
                if (!silent) {
                    Ext.MessageBox.show({
                        title: 'Orden Compra',
                        msg: resultado.message,
                        buttons: Ext.MessageBox.OK,
                        icon: Ext.MessageBox.INFO,
                        fn: function (btn) {
                            if (btn === 'ok') {
                                OrdenesCompraUtils.BtnBusqOrdenCompra();
                            }
                        }
                    });
                } else {
                    // ? Si es silencioso, solo refrescar el grid
//                    console.log('? Estatus actualizado silenciosamente:', resultado.message);
                }
            },
            failure: function (response, opts) {
                // ?? Siempre mostrar errores
                Ext.MessageBox.show({
                    title: 'Error',
                    msg: 'No se pudo confirmar la orden...',
                    buttons: Ext.MessageBox.CANCEL,
                    icon: Ext.MessageBox.ERROR
                });
            }
        });
    },

    enviarReceiptConfirm: function (record) {
        var docEntry = record.get("DocEntry");
        var docNum = record.get("DocNum");
        var numAtCard = record.get("NumAtCard");
        var comid = record.get("comid");

        // ? PRIMERO: Obtener líneas y calcular estatus
        Ext.getBody().mask('Calculando estatus de recepción...');

        Ext.Ajax.request({
            url: contexto + "/OrdenesCompra",
            method: "POST",
            params: {
                busqBnd: 5,
                docEntry: docEntry,
                servicio: 'ServiceOrdenCompraDet',
                limit: 9999,
                offset: 0
            },
            success: function (resp) {
                Ext.getBody().unmask();

                var data = Ext.decode(resp.responseText);
                var lineas = data.items || [];

                var totalPedido = 0;
                var totalRecibido = 0;

                // ? CALCULAR TOTALES
                Ext.Array.each(lineas, function (linea) {
                    totalPedido += parseFloat(linea.Quantity) || 0;
                    totalRecibido += parseFloat(linea.receivedquantity) || 0;
                });

                // ? CALCULAR ESTATUS AUTOMÁTICO
                var estatusCalculado = '';
                if (totalRecibido === 0) {
                    estatusCalculado = 'Cancelada';
                } else if (totalRecibido >= totalPedido) {
                    estatusCalculado = 'Completa';
                } else {
                    estatusCalculado = 'Parcial';
                }

//                console.log('? Total Pedido:', totalPedido);
//                console.log('? Total Recibido:', totalRecibido);
//                console.log('? Estatus Calculado:', estatusCalculado);

                // ================= VENTANA PARA CONFIRMAR =================
                var statusCombo = Ext.create('Ext.form.field.ComboBox', {
                    fieldLabel: 'Estatus de Recepción',
                    name: 'status',
                    readOnly: true,
                    store: Ext.create('Ext.data.Store', {
                        fields: ['value', 'text'],
                        data: [
                            {value: 'Completa', text: 'Completa'},
                            {value: 'Parcial', text: 'Parcial'},
                            {value: 'Cancelada', text: 'Cancelada'}
                        ]
                    }),
                    queryMode: 'local',
                    displayField: 'text',
                    valueField: 'value',
                    editable: false,
                    allowBlank: false,
                    value: estatusCalculado, // ? PRE-SELECCIONADO
                    readOnly: true, // ? READ-ONLY
                    labelWidth: 150,
                    width: 400,
                    fieldStyle: 'font-weight: bold;'
                });

                var memoField = Ext.create('Ext.form.field.TextArea', {
                    fieldLabel: 'Observaciones',
                    name: 'memo',
                    labelWidth: 150,
                    width: 400,
                    height: 80
                });

                var win = Ext.create('Ext.window.Window', {
                    title: 'Confirmar Recepción - ' + docNum,
                    modal: true,
                    width: 450,
                    layout: 'fit',
                    items: [{
                            xtype: 'form',
                            bodyPadding: 20,
                            defaults: {
                                anchor: '100%'
                            },
                            items: [
                                {
                                    xtype: 'displayfield',
                                    fieldLabel: 'Doc Entry',
                                    value: docEntry,
                                    labelWidth: 150,
                                    fieldStyle: 'font-weight: bold; color: #2196F3;'
                                },
                                {
                                    xtype: 'displayfield',
                                    fieldLabel: 'Doc Num',
                                    value: docNum,
                                    labelWidth: 150,
                                    fieldStyle: 'font-weight: bold;'
                                },
                                {
                                    xtype: 'displayfield',
                                    fieldLabel: 'Cliente',
                                    value: numAtCard,
                                    labelWidth: 150
                                },
                                {
                                    xtype: 'displayfield',
                                    fieldLabel: 'ID Compra',
                                    value: comid,
                                    labelWidth: 150,
                                    fieldStyle: 'font-weight: bold; color: #4CAF50;'
                                },
                                {
                                    xtype: 'displayfield',
                                    fieldLabel: 'Total Pedido',
                                    value: '<b style="color: #2196F3;">' + totalPedido + '</b> unidades',
                                    labelWidth: 150
                                },
                                {
                                    xtype: 'displayfield',
                                    fieldLabel: 'Total Recibido',
                                    value: '<b style="color: #4CAF50;">' + totalRecibido + '</b> unidades',
                                    labelWidth: 150
                                },
                                statusCombo,
                                memoField
                            ],
                            buttons: [
                                {
                                    text: 'Cancelar',
                                    iconCls: 'icn-back',
                                    handler: function () {
                                        win.close();
                                    }
                                },
                                {
                                    text: 'Confirmar Recepción',
                                    iconCls: 'fa fa-check',
                                    formBind: true,
                                    handler: function () {
                                        var selectedStatus = statusCombo.getValue();
                                        var memoText = memoField.getValue();

                                        win.close();

                                        // ================= CONTINUAR CON EL FLUJO =================
                                        var transactionNumber = comid;
                                        var docDate = Ext.Date.format(new Date(), "Y-m-d\\TH:i:s");

                                        Ext.getBody().mask('Procesando confirmación de recepción...');

                                        // ? CONSTRUIR LÍNEAS CON RECEIVED QUANTITY
                                        var lines = [];
                                        var totalQty = 0;

                                        Ext.Array.each(lineas, function (line) {
                                            var qty = parseFloat(line.receivedquantity) || 0;
                                            totalQty += qty;

                                            lines.push({
                                                LineNum: line.LineNum,
                                                ItemCode: line.ItemCode,
                                                BarCode: line.BarCode,
                                                Quantity: qty
                                            });
                                        });

                                        // ================= JSON FINAL =================
                                        var jsonSend = {
                                            ReceiptConfirm: {
                                                DocDate: docDate,
                                                DocNum: docNum,
                                                NumAtCard: numAtCard,
                                                TransactionNumber: transactionNumber,
                                                Status: selectedStatus,
                                                Memo: memoText
                                            },
                                            ControlValues: {
                                                TotalQuantity: totalQty,
                                                TotalLines: lines.length
                                            },
                                            Lines: lines
                                        };

//                                        console.log("? JSON ReceiptConfirm:");
//                                        console.log(JSON.stringify(jsonSend, null, 4));

                                        // ================= ENVIAR AL SERVLET =================
                                        Ext.Ajax.request({
                                            url: contexto + "/OrdenesCompra",
                                            method: "POST",
                                            params: {
                                                busqBnd: 6,
                                                valores: Ext.encode(jsonSend)
                                            },
                                            success: function (response) {
                                                Ext.getBody().unmask();

                                                try {
                                                    var resultado = Ext.decode(response.responseText);

                                                    if (resultado.success) {
//                                                        console.log("? Respuesta del cliente:", resultado.clienteResponse);

                                                        var ocid = record.get("OCID");
                                                        OrdenesCompraUtils.ConfirmarOrdenCompra(ocid, true); // ? Silencioso

                                                        // ? EXTRAER VALORES
                                                        var docNumResp = 'N/A';
                                                        var systemDate = 'N/A';
                                                        var statusMensaje = 'N/A';

                                                        if (resultado.clienteResponse) {
                                                            docNumResp = resultado.clienteResponse.DocNum || 'N/A';
                                                            systemDate = resultado.clienteResponse.SystemDate || 'N/A';

                                                            if (resultado.clienteResponse.StatusInfo) {
                                                                statusMensaje = resultado.clienteResponse.StatusInfo.Mensaje || 'N/A';
                                                            }
                                                        }

                                                        // Formatear fecha
                                                        var fechaFormateada = systemDate;
                                                        if (systemDate !== 'N/A') {
                                                            try {
                                                                fechaFormateada = Ext.Date.format(new Date(systemDate), 'd/m/Y H:i:s');
                                                            } catch (e) {
                                                                fechaFormateada = systemDate;
                                                            }
                                                        }

                                                        // ? MENSAJE FINAL
                                                        var msg = 'Confirmación de recepción procesada exitosamente<br><br>';
                                                        msg += '<b>Orden:</b> ' + docNum + '<br>';
                                                        msg += '<b>ID Compra:</b> ' + comid + '<br>';
                                                        msg += '<b>Estatus:</b> ' + selectedStatus + '<br>';
                                                        msg += '<b>Pedido:</b> ' + totalPedido + ' | <b>Recibido:</b> ' + totalRecibido + '<br>';
                                                        msg += '<b>Folio:</b> ' + docNumResp + '<br>';
                                                        msg += '<b>Fecha:</b> ' + fechaFormateada + '<br>';
                                                        msg += '<b>Estado:</b> ' + statusMensaje;

                                                        Ext.Msg.alert('Éxito', msg, function () {
                                                            OrdenesCompraUtils.BtnBusqOrdenCompra();
                                                        });
                                                    } else {
                                                        Ext.Msg.alert('Error', resultado.message || 'Error al procesar la confirmación');
                                                    }
                                                } catch (e) {
                                                    console.error("Error al parsear respuesta:", e);
                                                    Ext.Msg.alert('Error', 'Error al procesar la respuesta del servidor');
                                                }
                                            },
                                            failure: function (response) {
                                                Ext.getBody().unmask();
                                                console.error("? Error al enviar ReceiptConfirm:", response);
                                                Ext.Msg.alert('Error', 'Error al enviar la confirmación de recepción');
                                            }
                                        });
                                    }
                                }
                            ]
                        }]
                });

                win.show();
            },
            failure: function () {
                Ext.getBody().unmask();
                Ext.Msg.alert("Error", "No se pudieron cargar líneas para calcular recepción");
            }
        });
    },

    EliminarOrdenCompra: function (prm) {
        Ext.Ajax.request({
            url: contexto + '/OrdenesCompra',
            timeout: 60000,
            params: {
                busqBnd: 7,
                centralCompra: prm
            },
            success: function (response) {
                Ext.MessageBox.show({
                    title: 'Orden Compra',
                    msg: Ext.JSON.decode(response.responseText).message,
                    buttons: Ext.MessageBox.OK,
                    icon: Ext.MessageBox.INFO,
                    fn: function (btn) {
                        if (btn === 'ok') {
                            BtnBusqCentralVentas();
                            Ext.getCmp('OCID').focus();
                        }
                    }
                });
                OrdenesCompraUtils.BtnBusqOrdenCompra();
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
        var idEstatusCompras = Ext.getCmp('idCmbEstatusCompras').getValue();
        var idCmbFechaCompras = Ext.Date.format(Ext.getCmp("idCmbFechaCompras").getValue(), "d-m-Y");
        var idCmbDiasCompras = Ext.getCmp('idCmbDiasCompras').getValue();

        var grd = Ext.getCmp(storeName);
        var store = grd.getStore();
        store.removeAll(true);

        var storeCentralCompras = Ext.StoreManager.lookup('storeOrdenesCompra');

        var param = {
            idEstatusCompras: idEstatusCompras,
            idCmbFechaCompras: idCmbFechaCompras,
            idCmbDiasCompras: idCmbDiasCompras,
            busqBnd: 4,
            offset: 0,
            limit: 99999999
        };

        store.reload({
            params: param,
            callback: function (records, operation, success) {
                if (success) {
                    generarExcel(storeName, archivoName, parametros);
                    storeCentralCompras.loadPage(1);
                }
            }
        });
    },

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
                {
                    name: 'DocDate',
                    type: 'date',
                    convert: formatearFechaCorta
                },
                "CardCode",
                "Memo",
                "OCEstatusId",
                "OCFechaInsercion",
                "comid",
                "comestatus",
                "Warehouse"
            ]
        });

        me.storeOrdenesCompra = Ext.create('Ext.data.Store', {
            id: "storeOrdenesCompra",
            model: 'modelOrdenesCompra',
            leadingBufferZone: 100,
            pageSize: 100,
            autoLoad: true,
            proxy: {
                type: 'ajax',
                url: contexto + '/OrdenesCompra',
                startParam: "offset",
                leadingBufferZone: 100, // Cantidad de registros adicionales para cargar por adelantado
                reader: {
                    type: 'json',
                    rootProperty: 'items',
                    totalProperty: 'total'
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
                                            editable: false,
                                            listeners: {
                                                select: function () {
                                                    OrdenesCompraUtils.BtnBusqOrdenCompra();
                                                }
                                            }

                                        },
                                        {
                                            xtype: "datefield",
                                            fieldLabel: "Fecha",
                                            id: "idCmbFechaCompras",
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
                                                    OrdenesCompraUtils.BtnBusqOrdenCompra();
                                                }
                                            }
                                        },
                                        {
                                            xtype: "numberfield",
                                            fieldLabel: "Dias Atras",
                                            id: "idCmbDiasCompras",
                                            name: "idCntComDias",
                                            flex: 1,
                                            width: 300,
                                            allowBlank: false,
                                            value: 7,
                                            maxValue: parseInt(OrdenesCompraUtils.dias, 10),
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
                                                    OrdenesCompraUtils.BtnBusqOrdenCompra();
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
                    id: 'gridOrdenesCompra',
                    store: me.storeOrdenesCompra,
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
                            text: 'Cargar',
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
                            text: 'Exportar',
                            iconCls: 'icn-excel',
                            // width: 120,
                            handler: function (grid, rowIndex, colIndex, item, event, record) {
                                var idCmbFechaCompras = Ext.Date.format(Ext.getCmp("idCmbFechaCompras").getValue(), "d-m-Y");
                                var idCmbDiasCompras = Ext.getCmp("idCmbDiasCompras").getValue();
                                var idCmbEstatusCompras = Ext.getCmp("idCmbEstatusCompras").getValue()

                                var storeName = "gridOrdenesCompra";
                                var archivoName = "Central Compras";
                                var fechaActual = new Date();
                                var fechaFormateada = Ext.Date.format(fechaActual, 'd/m/Y H:i:s');
                                var titulo = "Central Compras";

                                var parametros = {
                                    'titulo': titulo,
                                    'Estatus': idCmbEstatusCompras,
                                    'Fecha': idCmbFechaCompras,
                                    'Dias Atras': idCmbDiasCompras,
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
                                            OrdenesCompraUtils.cargarStoreYGenerarExcel(storeName, archivoName, parametros);
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
                    bbar: {
                        xtype: 'pagingtoolbar',
                        store: me.storeOrdenesCompra,
                        displayInfo: true,
                        displayMsg: 'Mostrando {0} - {1} de {2} órdenes',
                        emptyMsg: "No hay órdenes para mostrar"
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
                                    'C': 'Confirmado',
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
                            text: "Compra",
                            dataIndex: "comid",
                            width: 80,
                            align: "center",
                            filter: {type: 'number'}
                        },
                        {
                            text: "Estatus Compra",
                            dataIndex: "comestatus",
                            align: "center",
                            width: 150,
                            filter: {type: 'string'},
                            renderer: function (value) {
                                var color = '';
                                switch (value) {
                                    case 'Pendiente':
                                        color = '#FFC107';
                                        break; // Amarillo
                                    case 'En proceso':
                                        color = '#2196F3';
                                        break; // Azul
                                    case 'Recibido':
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
                            text: "DocEntry",
                            dataIndex: "DocEntry",
                            align: "center",
                            width: 150,
                            filter: {type: 'number'}
                        },
                        {
                            text: "DocNum",
                            dataIndex: "DocNum",
                            width: 150,
                            filter: {type: 'string'}
                        },
                        {
                            text: "NumeroAtCard",
                            dataIndex: "NumAtCard",
                            width: 150,
                            filter: {type: 'string'}
                        },
                        {
                            text: "DocDate",
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
                            text: "Warehouse",
                            dataIndex: "Warehouse",
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
                            sortable: false,
                            menuDisabled: true,
                            align: "center",
                            width: 90,
                            items: [
                                {
                                    getClass: function (v, meta, record) {
                                        var estatus = record.get("comestatus");

                                        return estatus === "Recibido" || estatus === "Confirmado"
                                                ? "icn-habilita"
                                                : "icn-habilita-disable";
                                    },
                                    handler: function (grid, rowIndex, colIndex) {
                                        var record = grid.getStore().getAt(rowIndex);
                                        OrdenesCompraUtils.enviarReceiptConfirm(record);
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
                                    getClass: function (v, meta, record) {
                                        var estatus = record.get("OCEstatusId");
                                        var estatusCom = record.get("comestatus");

                                        return estatus === "A" && estatusCom !== "Recibido"
                                                ? "icn-cancela"
                                                : "icn-cancela-disable";
                                    },
                                    handler: function (grid, rowIndex, colIndex, item, event, record) {
                                        Ext.MessageBox.show({
                                            title: "Ordenes de Compra",
                                            msg: '¿Estás seguro que deseas cancelar la compra ' + record.data.OCID + ' ?',
                                            buttons: Ext.MessageBox.OKCANCEL,
                                            icon: Ext.MessageBox.QUESTION,
                                            fn: function (btn) {
                                                if (btn === 'ok') {
                                                    var rowData = record.data;
                                                    record.drop();
                                                    OrdenesCompraUtils.EliminarOrdenCompra(Ext.JSON.encode(record.data));
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
                            OrdenesCompraUtils.verLineasOrdenLocal(record);
                        },
                        afterrender: function (grid) {
                            if (grid.isVisible() && !grid.isSearchExecuted) {
                                grid.isSearchExecuted = true; // Marca que la búsqueda se ha ejecutado
                                OrdenesCompraUtils.BtnBusqOrdenCompra();
                            }
                        },
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