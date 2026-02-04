/* 
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/JSP_Servlet/JavaScript.js to edit this template
 */

Ext.define('TransferenciaSalidaUtils', {
    singleton: true,

    BtnBusqTransferenciaSalida: function () {
        var idEstatusTransferenciasSalida = Ext.getCmp('idCmbEstatusOutbound').getValue();

        var param = {
            busqBnd: 4,
            servicio: 'ServiceTransferenciaSalida',
            idEstatusTransferenciasSalida: idEstatusTransferenciasSalida
        };

        TransferenciaSalidaUtils.BuscarTransferenciaSalida(param);
    },

    BuscarTransferenciaSalida: function (prm) {
        var grd = Ext.getCmp('gridTransferenciaSalida');
        if (!grd)
            return;

        var store = grd.getStore();
        store.removeAll(true);
        store.reload({
            params: prm
        });
    },

    verNuevasTransferencias: function () {
        // Modelo para las transferencias
        if (!Ext.ClassManager.get('modelTransferenciasSalidaHeader')) {
            Ext.define('modelTransferenciasSalidaHeader', {
                extend: 'Ext.data.Model',
                fields: [
                    "DocEntry",
                    "DocNum",
                    "NumAtCard",
                    "DocDate",
                    "CardCode",
                    "Status",
                    "Memo",
                    "AddressCode",
                    {name: "OrderTotal", type: 'number'},
                    {name: "TotalLines", type: 'int'}
                ]
            });
        }

        // Store para las transferencias
        var storeTransferencias = Ext.create('Ext.data.Store', {
            model: 'modelTransferenciasSalidaHeader',
            autoLoad: true,
            proxy: {
                type: "ajax",
                url: contexto + "/TransferenciasSalida",
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
            id: 'winTransferenciasSalida',
            title: 'Transferencias de Salida Nuevas',
            width: 1200,
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
                    store: storeTransferencias,
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
                                    Ext.Msg.alert('Atención', 'Debe seleccionar al menos una transferencia');
                                    return;
                                }

                                TransferenciaSalidaUtils.guardarTransferencias(selected);
                            }
                        },
                        '->',
                        {
                            xtype: 'displayfield',
                            id: 'lblSeleccionadasSalida',
                            value: '<b>Seleccionadas: 0</b>',
                            fieldStyle: 'font-size: 13px; color: #FF9800;'
                        },
                        {
                            xtype: 'button',
                            text: 'Recargar',
                            iconCls: 'icn-refresh',
                            handler: function () {
                                storeTransferencias.reload();
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
                            text: "Status",
                            dataIndex: "Status",
                            width: 120,
                            filter: {type: 'string'}
                        },
                        {
                            text: "Dirección",
                            dataIndex: "AddressCode",
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
                            text: "Total",
                            dataIndex: "OrderTotal",
                            width: 100,
                            align: "center",
                            filter: {type: 'number'},
                            renderer: function (value) {
                                return '<b style="color: #4CAF50;">' + value + '</b>';
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
                        selectionchange: function (selModel, selected) {
                            var lbl = Ext.getCmp('lblSeleccionadasSalida');
                            if (lbl) {
                                lbl.setValue('<b>Seleccionadas: ' + selected.length + '</b>');
                            }
                        },
                        rowdblclick: function (grid, record) {
                            TransferenciaSalidaUtils.verLineasTransferencia(record);
                        }
                    }
                }
            ]
        });

        win.show();
    },

    guardarTransferencias: function (selectedRecords) {
        var transferenciasAGuardar = selectedRecords || [];
        var totalSeleccionadas = transferenciasAGuardar.length;

        Ext.MessageBox.confirm(
                'Confirmar',
                '¿Está seguro de cargar ' + totalSeleccionadas + ' transferencia(s) de salida seleccionada(s)?',
                function (btn) {
                    if (btn === 'yes') {

                        Ext.getBody().mask('Obteniendo transferencias de salida...');

                        // Convertir records a array de objetos planos
                        var transferenciasHeader = [];
                        Ext.Array.each(transferenciasAGuardar, function (record) {
                            transferenciasHeader.push({
                                DocEntry: record.get('DocEntry'),
                                DocNum: record.get('DocNum'),
                                NumAtCard: record.get('NumAtCard'),
                                DocDate: record.get('DocDate'),
                                CardCode: record.get('CardCode'),
                                Status: record.get('Status'),
                                Memo: record.get('Memo'),
                                AddressCode: record.get('AddressCode'),
                                OrderTotal: record.get('OrderTotal'),
                                TotalLines: record.get('TotalLines')
                            });
                        });

                        console.log('? Transferencias seleccionadas para guardar:', transferenciasHeader.length);

                        if (transferenciasHeader.length === 0) {
                            Ext.getBody().unmask();
                            Ext.Msg.alert('Información', 'No hay transferencias para procesar');
                            return;
                        }

                        // Obtener las líneas de cada transferencia
                        var promises = [];
                        var transferenciasCompletas = [];

                        transferenciasHeader.forEach(function (transferencia) {
                            promises.push(
                                    new Promise(function (resolve, reject) {
                                        Ext.Ajax.request({
                                            url: contexto + '/TransferenciasSalida',
                                            method: 'POST',
                                            params: {
                                                busqBnd: 2,
                                                docEntry: transferencia.DocEntry
                                            },
                                            success: function (responseLineas) {
                                                var lineas = Ext.decode(responseLineas.responseText);

                                                transferenciasCompletas.push({
                                                    OutboundTransferRequest: {
                                                        DocEntry: transferencia.DocEntry,
                                                        DocNum: transferencia.DocNum,
                                                        NumAtCard: transferencia.NumAtCard,
                                                        DocDate: transferencia.DocDate,
                                                        CardCode: transferencia.CardCode,
                                                        Status: transferencia.Status,
                                                        Memo: transferencia.Memo,
                                                        AddressCode: transferencia.AddressCode
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

                        // Cuando todas las líneas estén cargadas, enviar por lotes
                        Promise.all(promises).then(function () {
                            Ext.getBody().unmask();
                            TransferenciaSalidaUtils.iniciarEnvioPorLotes(transferenciasCompletas);
                        }).catch(function (error) {
                            Ext.getBody().unmask();
                            console.error('? Error al obtener líneas:', error);
                            Ext.Msg.alert('Error', 'Error al obtener las líneas de las transferencias');
                        });
                    }
                }
        );
    },

// ========================================
// ? ENVIAR POR LOTES
// ========================================
    iniciarEnvioPorLotes: function (allTransfers) {
        var me = this,
                loteSize = 10,
                totalTransfers = allTransfers.length,
                confirmadosGlobal = [],
                erroresGlobal = [],
                clienteResponseGlobal = [],
                index = 0;

        var progressWin = Ext.create('Ext.window.Window', {
            title: 'Guardando Transferencias de Salida',
            width: 400,
            height: 160,
            modal: true,
            closable: false,
            layout: 'vbox',
            bodyPadding: 20,
            items: [
                {xtype: 'label', id: 'lblProgresoTransferenciasSalida', text: 'Iniciando...', margin: '0 0 10 0'},
                {xtype: 'progressbar', id: 'barProgresoTransferenciasSalida', width: '100%'}
            ]
        });
        progressWin.show();

        function enviarSiguienteLote() {
            var fin = Math.min(index + loteSize, totalTransfers),
                    loteActual = allTransfers.slice(index, fin);

            var payload = {
                orders: loteActual,
                idUsuario: '1'
            };

            var jsonToSend = Ext.encode(payload);

            var pct = index / totalTransfers;
            Ext.getCmp('lblProgresoTransferenciasSalida').setText('Procesando: ' + (index + 1) + ' - ' + fin + ' de ' + totalTransfers);
            Ext.getCmp('barProgresoTransferenciasSalida').updateProgress(pct);

            Ext.Ajax.request({
                url: contexto + '/TransferenciasSalida',
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
                        if (index < totalTransfers) {
                            enviarSiguienteLote();
                        } else {
                            progressWin.close();
                            me.mostrarResultados(confirmadosGlobal, erroresGlobal, clienteResponseGlobal);
                        }
                        return;
                    }

                    if (resultado.success && resultado.results) {
                        Ext.Array.each(resultado.results, function (item) {
                            var transferenciaOriginal = loteActual.find(
                                    t => t.OutboundTransferRequest.DocEntry === item.DocEntry
                            );

                            var row = {
                                DocEntry: item.DocEntry || 'N/A',
                                DocNum: item.DocNum || '',
                                TSID: item.TSID || '',
                                CardCode: transferenciaOriginal ? transferenciaOriginal.OutboundTransferRequest.CardCode : '',
                                NumAtCard: transferenciaOriginal ? transferenciaOriginal.OutboundTransferRequest.NumAtCard : '',
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

                        if (resultado.clienteResponse) {
                            clienteResponseGlobal = resultado.clienteResponse;
                        }
                    }

                    index += loteSize;
                    if (index < totalTransfers) {
                        enviarSiguienteLote();
                    } else {
                        progressWin.close();
                        me.mostrarResultados(confirmadosGlobal, erroresGlobal, clienteResponseGlobal);
                    }
                },
                failure: function () {
                    index += loteSize;
                    if (index < totalTransfers) {
                        enviarSiguienteLote();
                    } else {
                        progressWin.close();
                        me.mostrarResultados(confirmadosGlobal, erroresGlobal, clienteResponseGlobal);
                    }
                }
            });
        }
        enviarSiguienteLote();
    },

    // ========================================
// ? MOSTRAR RESULTADOS
// ========================================
    mostrarResultados: function (confirmData, noConfirmData, clienteData) {
        if (!Ext.ClassManager.get('ResultadoTransferenciasSalidaModel')) {
            Ext.define('ResultadoTransferenciasSalidaModel', {
                extend: 'Ext.data.Model',
                fields: ['DocEntry', 'DocNum', 'TSID', 'CardCode', 'NumAtCard', 'fecha', 'linesInserted', 'linesFailed', 'mensaje']
            });
        }

        if (!Ext.ClassManager.get('ClienteResponseSalidaModel')) {
            Ext.define('ClienteResponseSalidaModel', {
                extend: 'Ext.data.Model',
                fields: ['Folio', 'DocEntry', 'ObjType', 'SystemDate']
            });
        }

        var storeConfirm = Ext.create('Ext.data.Store', {model: 'ResultadoTransferenciasSalidaModel', data: confirmData});
        var storeNoConfirm = Ext.create('Ext.data.Store', {model: 'ResultadoTransferenciasSalidaModel', data: noConfirmData});
        var storeCliente = Ext.create('Ext.data.Store', {model: 'ClienteResponseSalidaModel', data: clienteData || []});

        const win = Ext.create('Ext.window.Window', {
            title: 'Resultados de Sincronización - Transferencias de Salida',
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
                                        {text: 'TSID', dataIndex: 'TSID', width: 80, align: 'center'},
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
                        // Recargar grid principal si existe
                        var winTransferencias = Ext.getCmp('winTransferenciasSalida');
                        if (winTransferencias) {
                            winTransferencias.close();
                        }
                    }
                }]
        });
        win.show();
    },

// ========================================
// ?? VER LÍNEAS DE TRANSFERENCIA (Desde GLOBAL)
// ========================================
    verLineasTransferencia: function (record) {
        var docEntry = record.get('DocEntry');
        var docNum = record.get('DocNum');
        var cardCode = record.get('CardCode');
        var totalLines = record.get('TotalLines');

        if (!Ext.ClassManager.get('modelLineasTransferenciaSalida')) {
            Ext.define('modelLineasTransferenciaSalida', {
                extend: 'Ext.data.Model',
                fields: [
                    {name: "LineNum", type: 'int'},
                    "ItemCode",
                    "Barcode",
                    {name: "Quantity", type: 'number'}
                ]
            });
        }

        var storeLineas = Ext.create('Ext.data.Store', {
            model: 'modelLineasTransferenciaSalida',
            autoLoad: true,
            proxy: {
                type: "ajax",
                url: contexto + "/TransferenciasSalida",
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
                        console.log('? Cargadas ' + records.length + ' líneas para transferencia #' + docNum);
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
            id: 'winLineasTransferenciaSalida',
            title: 'Líneas de Transferencia #' + docNum + ' - CardCode: ' + cardCode,
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
                            dataIndex: "Barcode",
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

    verLineasTransferenciaLocal: function (record) {
        var docEntry = record.get('DocEntry');
        var docNum = record.get('DocNum');
        var cardCode = record.get('CardCode');

        if (!Ext.ClassManager.get('modelLineasTransferenciaSalidaLocal')) {
            Ext.define('modelLineasTransferenciaSalidaLocal', {
                extend: 'Ext.data.Model',
                fields: [
                    "LineNum",
                    "ItemCode",
                    "Barcode",
                    "Quantity"
                ]
            });
        }

        var storeLineas = Ext.create('Ext.data.Store', {
            model: 'modelLineasTransferenciaSalidaLocal',
            leadingBufferZone: 100,
            autoLoad: true,
            pageSize: 25,
            proxy: {
                type: "ajax",
                url: contexto + "/TransferenciasSalida",
                pageParam: false,
                startParam: "offset",
                limitParam: "limit",
                extraParams: {
                    busqBnd: 5,
                    docEntry: docEntry,
                    servicio: 'ServiceTransferenciaSalidaDet'
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
                        console.log('? Cargadas ' + records.length + ' líneas locales para transferencia #' + docNum);
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
            id: 'winLineasTransferenciaSalidaLocal',
            title: 'Líneas de Transferencia #' + docNum + ' - CardCode: ' + cardCode,
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
                        emptyMsg: "No hay líneas para mostrar",
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
                            filter: {type: 'string'},
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
                            dataIndex: "Barcode",
                            width: 250,
                            flex: 1,
                            filter: {type: 'string'}
                        },
                        {
                            text: "Cantidad",
                            dataIndex: "Quantity",
                            width: 120,
                            align: "right",
                            filter: {type: 'string'},
                            renderer: function (value) {
                                return '<b style="color: #4CAF50;">' + Ext.util.Format.number(parseFloat(value), '0,000') + '</b>';
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

    enviarTransferShipConfirm: function (record) {
        var docEntry = record.get('DocEntry');
        var docNum = record.get('DocNum');
        var numAtCard = record.get('NumAtCard');

        // Store para status
        var storeStatus = Ext.create('Ext.data.Store', {
            fields: ['codigo', 'descripcion'],
            data: [
                {codigo: 'Total', descripcion: 'Total'},
                {codigo: 'Parcial', descripcion: 'Parcial'},
                {codigo: 'Cancelada', descripcion: 'Cancelada'}
            ]
        });

        const win = Ext.create('Ext.window.Window', {
            title: 'Confirmar Embarque - ' + docNum,
            width: 500,
            modal: true,
            layout: 'fit',
            items: [
                {
                    xtype: 'form',
                    bodyPadding: 20,
                    defaults: {
                        anchor: '100%',
                        labelWidth: 120
                    },
                    items: [
                        {
                            xtype: 'displayfield',
                            fieldLabel: 'Doc Num',
                            value: docNum
                        },
                        {
                            xtype: 'displayfield',
                            fieldLabel: 'Cliente',
                            value: numAtCard
                        },
                        {
                            xtype: 'combobox',
                            fieldLabel: 'Status',
                            id: 'cmbStatusShip',
                            store: storeStatus,
                            valueField: 'codigo',
                            displayField: 'descripcion',
                            queryMode: 'local',
                            emptyText: 'Seleccione status',
                            allowBlank: false,
                            editable: false,
                            value: 'Total'
                        },
                        {
                            xtype: 'textareafield',
                            fieldLabel: 'Memo',
                            id: 'txtMemoShip',
                            value: 'Embarque desde sistema local',
                            height: 80
                        }
                    ],
                    buttons: [
                        {
                            text: 'Enviar Confirmación',
                            iconCls: 'fa fa-truck',
                            formBind: true,
                            handler: function () {
                                var status = Ext.getCmp('cmbStatusShip').getValue();
                                var memo = Ext.getCmp('txtMemoShip').getValue();

                                if (!status) {
                                    Ext.Msg.alert('Error', 'Debe seleccionar un status');
                                    return;
                                }

                                Ext.getBody().mask('Obteniendo líneas...');

                                // Obtener líneas desde BD local
                                Ext.Ajax.request({
                                    url: contexto + '/TransferenciasSalida',
                                    method: 'POST',
                                    params: {
                                        busqBnd: 5,
                                        docEntry: docEntry,
                                        servicio: 'ServiceTransferenciaSalidaDet'
                                    },
                                    success: function (response) {
                                        Ext.getBody().unmask();

                                        var data = Ext.decode(response.responseText);
                                        var lineas = data.items || [];

                                        if (lineas.length === 0) {
                                            Ext.Msg.alert('Error', 'No se encontraron líneas para esta transferencia');
                                            return;
                                        }

                                        // Calcular totales
                                        var totalQuantity = 0;
                                        var linesArray = [];

                                        lineas.forEach(function (linea) {
                                            var qty = parseFloat(linea.Quantity) || 0;
                                            totalQuantity += qty;

                                            linesArray.push({
                                                LineNum: parseInt(linea.LineNum),
                                                ItemCode: linea.ItemCode,
                                                BarCode: linea.Barcode,
                                                Quantity: qty
                                            });
                                        });

                                        // Construir JSON TransferShipConfirm
                                        var fechaActual = new Date();
                                        var fechaISO = Ext.Date.format(fechaActual, 'Y-m-d\\TH:i:s');
                                        var transactionNumber = new Date().getTime().toString();

                                        var transferShipJSON = {
                                            TransferShipmentConfirm: {
                                                DocDate: fechaISO,
                                                DocNum: docNum,
                                                NumAtCard: numAtCard,
                                                TransactionNumber: transactionNumber,
                                                Status: status,
                                                Memo: memo
                                            },
                                            ControlValues: {
                                                TotalQuantity: totalQuantity,
                                                TotalLines: linesArray.length
                                            },
                                            Lines: linesArray
                                        };

                                        console.log('? JSON TransferShipConfirm:', transferShipJSON);

                                        // Enviar al servlet
                                        Ext.getBody().mask('Enviando confirmación de embarque...');

                                        Ext.Ajax.request({
                                            url: contexto + '/TransferenciasSalida',
                                            method: 'POST',
                                            params: {
                                                busqBnd: 6,
                                                valores: Ext.encode(transferShipJSON)
                                            },
                                            success: function (responseShip) {
                                                Ext.getBody().unmask();

                                                var resultado = Ext.decode(responseShip.responseText);

                                                if (resultado.success) {
                                                    Ext.Msg.alert('Éxito', 'Confirmación de embarque enviada correctamente', function () {
                                                        win.close();

                                                        // Recargar grid principal
                                                        var grid = Ext.getCmp('gridTransferenciaSalida');
                                                        if (grid && grid.getStore()) {
                                                            grid.getStore().reload();
                                                        }
                                                    });

                                                    console.log('? Respuesta cliente:', resultado.clienteResponse);
                                                } else {
                                                    Ext.Msg.alert('Error', resultado.error || 'Error al enviar confirmación');
                                                }
                                            },
                                            failure: function () {
                                                Ext.getBody().unmask();
                                                Ext.Msg.alert('Error', 'Error de comunicación con el servidor');
                                            }
                                        });
                                    },
                                    failure: function () {
                                        Ext.getBody().unmask();
                                        Ext.Msg.alert('Error', 'No se pudieron obtener las líneas');
                                    }
                                });
                            }
                        },
                        {
                            text: 'Cancelar',
                            iconCls: 'icn-back',
                            handler: function () {
                                win.close();
                            }
                        }
                    ]
                }
            ]
        });

        win.show();
    }

});

// ? Panel principal - UNA SOLA DEFINICIÓN
Ext.define('Modulos.global.PanelTransferenciasSalida', {
    extend: 'Ext.form.Panel',
    requires: [
        'TransferenciaSalidaUtils'
    ],
    alias: 'widget.PanelTransferenciasSalida',
    id: 'idMenu506',
    title: 'Transferencia Salida',
    bodyPadding: '10 10 10 10',
    layout: {
        type: 'vbox',
        align: 'stretch'
    },
    scrollable: true,
    initComponent: function () {
        var me = this;

        Ext.define('modelTransferenciasSalida', {
            extend: 'Ext.data.Model',
            fields: [
                "TSID",
                "DocEntry",
                "DocNum",
                "NumAtCard",
                "DocDate",
                "CardCode",
                "Status",
                "Memo",
                "AddressCode",
                "TSEstatusId",
                "TSFechaInsercion"
            ]
        });

        // ? STORE
        me.storeTransferenciaSalida = Ext.create('Ext.data.Store', {
            model: 'modelTransferenciasSalida',
            autoLoad: false,
            pageSize: 25,
            proxy: {
                type: "ajax",
                url: contexto + "/TransferenciasSalida",
                pageParam: false,
                startParam: "offset",
                limitParam: "limit",
                extraParams: {
                    busqBnd: 4,
                    servicio: 'ServiceTransferenciaSalida'
                },
                reader: {
                    type: "json",
                    rootProperty: "items",
                    totalProperty: "total"
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
                            id: 'idMenu506-form',
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
                                            id: "idCmbEstatusOutbound", // ? CAMBIO
                                            name: "cmbEstatusTransferencia",
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
                    id: 'gridTransferenciaSalida',
                    store: me.storeTransferenciaSalida,
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
                                TransferenciaSalidaUtils.BtnBusqTransferenciaSalida();
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
                                TransferenciaSalidaUtils.verNuevasTransferencias();  // ? CORRECTO
                            },
                            listeners: {
                                afterrender: function (btn) {
                                    addTooltip(btn, 'Ver Transferencias de Salida Nuevas');
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
                        store: me.storeTransferenciaSalida,
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
                            dataIndex: "TSID", // ? CAMBIO
                            width: 50,
                            align: "center",
                            filter: {type: 'number'}
                        },
                        {
                            text: "Estatus",
                            dataIndex: "TSEstatusId", // ? CAMBIO
                            align: "center",
                            width: 150,
                            filter: {type: 'string'},
                            renderer: function (value) {
                                var estatusMap = {
                                    'A': 'Activo',
                                    'C': 'Cerrado',
                                    'X': 'Cancelado'
                                };

                                var nombre = estatusMap[value] || value;

                                var color = '';
                                switch (value) {
                                    case 'A':
                                        color = '#4CAF50';
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
                            text: "Doc Entry",
                            dataIndex: "DocEntry",
                            align: "center",
                            width: 150,
                            filter: {type: 'string'}
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
                            text: "Status",
                            dataIndex: "Status",
                            width: 120,
                            filter: {type: 'string'}
                        },
                        {
                            text: "Address",
                            dataIndex: "AddressCode",
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
                            text: "Embarcar", // ? CAMBIO
                            menuDisabled: true,
                            sortable: false,
                            align: "center",
                            iconCls: 'icn-habilita',
                            width: 90,
                            items: [
                                {
                                    handler: function (grid, rowIndex, colIndex) {
                                        var record = grid.getStore().getAt(rowIndex);
                                        TransferenciaSalidaUtils.enviarTransferShipConfirm(record);  // ? Implementarás después
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
                            TransferenciaSalidaUtils.verLineasTransferenciaLocal(record);
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