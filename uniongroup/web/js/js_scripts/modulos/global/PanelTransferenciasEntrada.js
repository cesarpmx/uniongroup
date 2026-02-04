/* 
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/JSP_Servlet/JavaScript.js to edit this template
 */

Ext.define('TransferenciaEntradaUtils', {
    singleton: true,

    BtnBusqTransferenciaEntrada: function () {
        var idEstatusTransferencias = Ext.getCmp('idCmbEstatusInbound').getValue();

        var param = {
            busqBnd: 4,
            servicio: 'ServiceTransferenciaEntrada',
            idEstatusTransferencias: idEstatusTransferencias
        };

        TransferenciaEntradaUtils.BuscarTransferenciaEntrada(param);
    },

    BuscarTransferenciaEntrada: function (prm) {
        var grd = Ext.getCmp('gridTransferenciaEntrada');
        if (!grd)
            return;

        var store = grd.getStore();
        store.removeAll(true);
        store.reload({
            params: prm
        });
    },

    verNuevasTransferencias: function () {
        Ext.getBody().mask('Cargando transferencias...');

        Ext.Ajax.request({
            url: contexto + '/TransferenciasEntrada',
            method: 'POST',
            params: {
                busqBnd: 1
            },
            success: function (response) {
                Ext.getBody().unmask();

                try {
                    var transferencias = Ext.decode(response.responseText);

                    if (!transferencias || transferencias.length === 0) {
                        Ext.Msg.alert('Información', 'No hay transferencias nuevas disponibles');
                        return;
                    }

                    console.log('? Transferencias obtenidas:', transferencias);

                    // Crear ventana modal con grid
                    TransferenciaEntradaUtils.mostrarVentanaTransferencias(transferencias);

                } catch (e) {
                    console.error('Error al parsear transferencias:', e);
                    Ext.Msg.alert('Error', 'Error al procesar las transferencias');
                }
            },
            failure: function () {
                Ext.getBody().unmask();
                Ext.Msg.alert('Error', 'Error al obtener las transferencias de GLOBAL');
            }
        });
    },

    mostrarVentanaTransferencias: function (transferencias) {
        // Store para las transferencias
        var storeNuevas = Ext.create('Ext.data.Store', {
            fields: [
                'DocEntry', 'DocNum', 'NumAtCard', 'DocDate',
                'CardCode', 'AddressCode', 'Status', 'Memo',
                {name: 'OrderTotal', type: 'int'},
                {name: 'TotalLines', type: 'int'}
            ],
            data: transferencias
        });

        var winTransferencias = Ext.create('Ext.window.Window', {
            title: 'Transferencias de Entrada - GLOBAL',
            width: 1200,
            height: 600,
            modal: true,
            layout: 'fit',
            items: [{
                    xtype: 'grid',
                    store: storeNuevas,
                    selModel: {
                        type: 'checkboxmodel',
                        mode: 'MULTI',
                        showHeaderCheckbox: true
                    },
                    tbar: [
                        {
                            xtype: 'button',
                            text: 'Guardar Seleccionadas',
                            iconCls: 'icn-guardar',
                            scale: 'medium',
                            handler: function () {
                                var grid = this.up('grid');
                                var seleccionadas = grid.getSelection();

                                if (seleccionadas.length === 0) {
                                    Ext.Msg.alert('Atención', 'Debe seleccionar al menos una transferencia');
                                    return;
                                }

                                winTransferencias.close();
                                TransferenciaEntradaUtils.guardarTransferencias(seleccionadas);
                            }
                        },
                        '->',
                        {
                            xtype: 'displayfield',
                            id: 'lblSeleccionadasEntrada',
                            value: '<b>Seleccionadas: 0</b>',
                            fieldStyle: 'font-size: 13px; color: #FF9800;'
                        },
                        {
                            xtype: 'button',
                            text: 'Recargar',
                           iconCls: 'icn-refresh',
                            handler: function () {
                                storeNuevas.reload();
                            }
                        },
                        {
                            xtype: 'button',
                            text: 'Cerrar',
                            iconCls: 'icn-back',
                            handler: function () {
                                winTransferencias.close();
                            }
                        }
                    ],
                    columns: [
                        {
                            text: "Doc Entry",
                            dataIndex: "DocEntry",
                            width: 100,
                            align: "center"
                        },
                        {
                            text: "Doc Num",
                            dataIndex: "DocNum",
                            width: 150,
                            flex: 1
                        },
                        {
                            text: "Num At Card",
                            dataIndex: "NumAtCard",
                            width: 130
                        },
                        {
                            text: "Doc Date",
                            dataIndex: "DocDate",
                            width: 150,
                            renderer: function (value) {
                                if (!value)
                                    return '';
                                var date = new Date(value);
                                return Ext.Date.format(date, 'd/m/Y H:i');
                            }
                        },
                        {
                            text: "Card Code",
                            dataIndex: "CardCode",
                            width: 120
                        },
                        {
                            text: "Address",
                            dataIndex: "AddressCode",
                            width: 150
                        },
                        {
                            text: "Status",
                            dataIndex: "Status",
                            width: 100,
                            align: "center",
                            renderer: function (value) {
                                var color = value === 'Abierto' ? '#4CAF50' : '#2196F3';
                                return '<b style="color: ' + color + ';">' + value + '</b>';
                            }
                        },
                        {
                            text: "Total Líneas",
                            dataIndex: "TotalLines",
                            width: 100,
                            align: "center",
                            renderer: function (value) {
                                return '<b style="color: #2196F3;">' + value + '</b>';
                            }
                        },
                        {
                            text: "Total Piezas",
                            dataIndex: "OrderTotal",
                            width: 100,
                            align: "center",
                            renderer: function (value) {
                                return '<b style="color: #4CAF50;">' + value + '</b>';
                            }
                        },
                        {
                            text: "Memo",
                            dataIndex: "Memo",
                            flex: 1
                        }
                    ],
                    listeners: {
                        selectionchange: function (selModel, selected) {
                            var lbl = Ext.getCmp('lblSeleccionadasEntrada');
                            if (lbl) {
                                lbl.setValue('<b>Seleccionadas: ' + selected.length + '</b>');
                            }
                        },
                        rowdblclick: function (grid, record) {
                            TransferenciaEntradaUtils.verLineasTransferencia(record);
                        }
                    }
                }]
        });

        winTransferencias.show();
    },

    verLineasTransferencia: function (record) {
        var docEntry = record.get('DocEntry');
        var docNum = record.get('DocNum');

        Ext.getBody().mask('Cargando líneas...');

        Ext.Ajax.request({
            url: contexto + '/TransferenciasEntrada',
            method: 'POST',
            params: {
                busqBnd: 2, // Obtener líneas desde GLOBAL
                docEntry: docEntry
            },
            success: function (response) {
                Ext.getBody().unmask();

                try {
                    var lineas = Ext.decode(response.responseText);

                    var storeLineas = Ext.create('Ext.data.Store', {
                        fields: ['LineNum', 'ItemCode', 'Barcode', 'Quantity'],
                        data: lineas
                    });

                    var winLineas = Ext.create('Ext.window.Window', {
                        title: 'Líneas de Transferencia - ' + docNum,
                        width: 700,
                        height: 400,
                        modal: true,
                        layout: 'fit',
                        items: [{
                                xtype: 'grid',
                                store: storeLineas,
                                columns: [
                                    {text: "Línea", dataIndex: "LineNum", width: 80, align: "center"},
                                    {text: "Item Code", dataIndex: "ItemCode", flex: 1},
                                    {text: "Código Barras", dataIndex: "Barcode", width: 150},
                                    {
                                        text: "Cantidad",
                                        dataIndex: "Quantity",
                                        width: 100,
                                        align: "center",
                                        renderer: function (value) {
                                            return '<b style="color: #4CAF50;">' + value + '</b>';
                                        }
                                    }
                                ]
                            }],
                        buttons: [
                            {
                                text: 'Cerrar',
                                iconCls: 'icn-back',
                                handler: function () {
                                    winLineas.close();
                                }
                            }
                        ]
                    });

                    winLineas.show();

                } catch (e) {
                    console.error('Error al parsear líneas:', e);
                    Ext.Msg.alert('Error', 'Error al procesar las líneas');
                }
            },
            failure: function () {
                Ext.getBody().unmask();
                Ext.Msg.alert('Error', 'Error al obtener las líneas');
            }
        });
    },

    // ========================================
// ? FUNCIÓN: Guardar Transferencias Seleccionadas
// ========================================
    guardarTransferencias: function (transferencias) {
        // Convertir records de ExtJS a objetos planos
        var allTransfers = transferencias.map(function (record) {
            return record.getData ? record.getData() : record;
        });

        console.log('? Transferencias a guardar:', allTransfers);

        // Obtener líneas para cada transferencia
        var promises = [];
        allTransfers.forEach(function (transfer) {
            var promise = new Promise(function (resolve, reject) {
                Ext.Ajax.request({
                    url: contexto + '/TransferenciasEntrada',
                    method: 'POST',
                    params: {
                        busqBnd: 2,
                        docEntry: transfer.DocEntry
                    },
                    success: function (response) {
                        var lineas = Ext.decode(response.responseText);
                        resolve({transfer: transfer, lineas: lineas});
                    },
                    failure: function () {
                        reject(transfer.DocEntry);
                    }
                });
            });
            promises.push(promise);
        });

        Ext.getBody().mask('Obteniendo líneas...');

        Promise.all(promises).then(function (results) {
            // Construir JSON con transferencias y líneas
            var ordersToSend = results.map(function (result) {
                return {
                    InboundTransferRequest: {
                        DocEntry: result.transfer.DocEntry,
                        DocNum: result.transfer.DocNum,
                        NumAtCard: result.transfer.NumAtCard || '',
                        DocDate: result.transfer.DocDate,
                        CardCode: result.transfer.CardCode,
                        Status: result.transfer.Status,
                        Memo: result.transfer.Memo || '',
                        AddressCode: result.transfer.AddressCode || ''
                    },
                    Lines: result.lineas.map(function (linea) {
                        return {
                            LineNum: linea.LineNum,
                            ItemCode: linea.ItemCode,
                            Barcode: linea.Barcode,
                            Quantity: linea.Quantity
                        };
                    })
                };
            });

            TransferenciaEntradaUtils.iniciarEnvioPorLotes(ordersToSend);

        }).catch(function (error) {
            Ext.getBody().unmask();
            Ext.Msg.alert('Error', 'Error al obtener líneas para DocEntry: ' + error);
        });
    },

    iniciarEnvioPorLotes: function (allTransfers) {
        var batchSize = 10;
        var totalBatches = Math.ceil(allTransfers.length / batchSize);
        var currentBatch = 0;

        var confirmadosGlobal = [];
        var erroresGlobal = [];
        var clienteResponseGlobal = [];

        // Ventana de progreso
        var winProgreso = Ext.create('Ext.window.Window', {
            title: 'Guardando Transferencias',
            width: 400,
            height: 150,
            modal: true,
            closable: false,
            layout: 'fit',
            items: [{
                    xtype: 'panel',
                    bodyPadding: 20,
                    html: '<div style="text-align:center;">' +
                            '<div id="lblProgresoTransferencias" style="font-size:14px;margin-bottom:10px;">Procesando lote 0 de ' + totalBatches + '</div>' +
                            '<div id="barProgresoTransferencias" style="width:100%;height:25px;background:#e0e0e0;border-radius:5px;overflow:hidden;">' +
                            '<div style="width:0%;height:100%;background:#4CAF50;transition:width 0.3s;"></div>' +
                            '</div>' +
                            '</div>'
                }]
        });

        winProgreso.show();

        function enviarLote(batch) {
            var inicio = batch * batchSize;
            var fin = Math.min(inicio + batchSize, allTransfers.length);
            var lote = allTransfers.slice(inicio, fin);

            var payload = {
                orders: lote,
            };

            Ext.Ajax.request({
                url: contexto + '/TransferenciasEntrada',
                method: 'POST',
                params: {
                    busqBnd: 3,
                    valores: Ext.encode(payload)
                },
                success: function (response) {
                    try {
                        var resultado = Ext.decode(response.responseText);

                        if (resultado.results) {
                            resultado.results.forEach(function (item) {
                                if (item.status === 'inserted') {
                                    confirmadosGlobal.push(item);
                                } else {
                                    erroresGlobal.push(item);
                                }
                            });
                        }

                        if (resultado.clienteResponse) {
                            clienteResponseGlobal = clienteResponseGlobal.concat(resultado.clienteResponse);
                        }

                    } catch (e) {
                        console.error('Error al parsear respuesta:', e);
                    }

                    currentBatch++;
                    var progreso = Math.round((currentBatch / totalBatches) * 100);

                    document.getElementById('lblProgresoTransferencias').innerHTML =
                            'Procesando lote ' + currentBatch + ' de ' + totalBatches;
                    document.querySelector('#barProgresoTransferencias > div').style.width = progreso + '%';

                    if (currentBatch < totalBatches) {
                        enviarLote(currentBatch);
                    } else {
                        winProgreso.close();
                        TransferenciaEntradaUtils.mostrarResultados(
                                confirmadosGlobal,
                                erroresGlobal,
                                clienteResponseGlobal
                                );
                    }
                },
                failure: function () {
                    winProgreso.close();
                    Ext.Msg.alert('Error', 'Error al enviar lote ' + (currentBatch + 1));
                }
            });
        }

        enviarLote(0);
    },

// ========================================
// ? FUNCIÓN: Mostrar Resultados
// ========================================
    mostrarResultados: function (confirmados, errores, clienteResponse) {
        // Stores
        var storeExitos = Ext.create('Ext.data.Store', {
            fields: ['TEID', 'DocEntry', 'DocNum', 'NumAtCard', 'CardCode', 'linesInserted', 'linesFailed', 'RecordDate'],
            data: confirmados
        });

        var storeErrores = Ext.create('Ext.data.Store', {
            fields: ['DocEntry', 'DocNum', 'NumAtCard', 'message'],
            data: errores
        });

        var storeCliente = Ext.create('Ext.data.Store', {
            fields: ['Folio', 'DocEntry', 'ObjType', 'SystemDate'],
            data: clienteResponse
        });

        // Ventana de resultados
        var winResultados = Ext.create('Ext.window.Window', {
            title: 'Resultados del Guardado',
            width: 900,
            height: 500,
            modal: true,
            layout: 'fit',
            items: [{
                    xtype: 'tabpanel',
                    items: [
                        {
                            title: 'Éxitos (' + confirmados.length + ')',
                            xtype: 'grid',
                            store: storeExitos,
                            columns: [
                                {text: 'TEID', dataIndex: 'TEID', width: 80, renderer: function (v) {
                                        return '<b style="color:#4CAF50;">' + v + '</b>';
                                    }},
                                {text: 'DocEntry', dataIndex: 'DocEntry', width: 100},
                                {text: 'DocNum', dataIndex: 'DocNum', flex: 1},
                                {text: 'NumAtCard', dataIndex: 'NumAtCard', width: 120},
                                {text: 'CardCode', dataIndex: 'CardCode', width: 120},
                                {text: 'Líneas OK', dataIndex: 'linesInserted', width: 90, align: 'center', renderer: function (v) {
                                        return '<b style="color:#4CAF50;">' + v + '</b>';
                                    }},
                                {text: 'Líneas Error', dataIndex: 'linesFailed', width: 100, align: 'center', renderer: function (v) {
                                        return v > 0 ? '<b style="color:#F44336;">' + v + '</b>' : v;
                                    }},
                                {text: 'Fecha', dataIndex: 'RecordDate', width: 150}
                            ]
                        },
                        {
                            title: 'Errores (' + errores.length + ')',
                            xtype: 'grid',
                            store: storeErrores,
                            columns: [
                                {text: 'DocEntry', dataIndex: 'DocEntry', width: 100},
                                {text: 'DocNum', dataIndex: 'DocNum', width: 150},
                                {text: 'NumAtCard', dataIndex: 'NumAtCard', width: 120},
                                {text: 'Error', dataIndex: 'message', flex: 1, renderer: function (v) {
                                        return '<span style="color:#F44336;">' + v + '</span>';
                                    }}
                            ]
                        },
                        {
                            title: 'Confirmación Cliente (' + clienteResponse.length + ')',
                            xtype: 'grid',
                            store: storeCliente,
                            columns: [
                                {text: 'Folio', dataIndex: 'Folio', flex: 1, renderer: function (v) {
                                        return '<b style="color:#2196F3;">' + v + '</b>';
                                    }},
                                {text: 'DocEntry', dataIndex: 'DocEntry', width: 100},
                                {text: 'ObjType', dataIndex: 'ObjType', width: 180},
                                {text: 'Fecha Sistema', dataIndex: 'SystemDate', width: 180, renderer: function (v) {
                                        if (!v)
                                            return '';
                                        return Ext.Date.format(new Date(v), 'd/m/Y H:i:s');
                                    }}
                            ]
                        }
                    ]
                }],
            buttons: [
                {
                    text: 'Cerrar',
                    iconCls: 'icn-back',
                    handler: function () {
                        winResultados.close();
                        TransferenciaEntradaUtils.BtnBusqTransferenciaEntrada();
                    }
                }
            ]
        });

        winResultados.show();
    },

    // ========================================
// ?? FUNCIÓN: Ver Líneas desde BD Local
// ========================================
    verLineasTransferenciaLocal: function (record) {
        var docEntry = record.get('DocEntry');
        var docNum = record.get('DocNum');
        var cardCode = record.get('CardCode');

        // Modelo para las líneas
        if (!Ext.ClassManager.get('modelLineasTransferenciaLocal')) {
            Ext.define('modelLineasTransferenciaLocal', {
                extend: 'Ext.data.Model',
                fields: [
                    "LineNum",
                    "ItemCode",
                    "Barcode",
                    "Quantity"
                ]
            });
        }

        // Store para las líneas LOCALES
        var storeLineas = Ext.create('Ext.data.Store', {
            model: 'modelLineasTransferenciaLocal',
            leadingBufferZone: 100,
            autoLoad: true,
            pageSize: 25,
            proxy: {
                type: "ajax",
                url: contexto + "/TransferenciasEntrada",
                pageParam: false,
                startParam: "offset",
                limitParam: "limit",
                extraParams: {
                    busqBnd: 5,
                    docEntry: docEntry,
                    servicio: 'ServiceTransferenciaEntradaDet'
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
            id: 'winLineasTransferenciaLocal',
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

    // ========================================
// ? FUNCIÓN: Enviar TransferReceiptConfirm
// ========================================
    enviarTransferReceiptConfirm: function (record) {
        var docEntry = record.get("DocEntry");
        var docNum = record.get("DocNum");
        var numAtCard = record.get("NumAtCard");

        // Ventana para seleccionar estatus
        var statusCombo = Ext.create('Ext.form.field.ComboBox', {
            fieldLabel: 'Estatus de Recepción',
            name: 'status',
            store: Ext.create('Ext.data.Store', {
                fields: ['value', 'text'],
                data: [
                    {value: 'Total', text: 'Total'},
                    {value: 'Parcial', text: 'Parcial'},
                    {value: 'Cancelada', text: 'Cancelada'}
                ]
            }),
            queryMode: 'local',
            displayField: 'text',
            valueField: 'value',
            editable: false,
            allowBlank: false,
            value: 'Total',
            labelWidth: 150,
            width: 350
        });

        var memoField = Ext.create('Ext.form.field.TextArea', {
            fieldLabel: 'Observaciones',
            name: 'memo',
            value: 'Recepción desde sistema local',
            labelWidth: 150,
            width: 350,
            height: 60
        });

        var win = Ext.create('Ext.window.Window', {
            title: 'Confirmar Recepción - ' + docNum,
            modal: true,
            width: 400,
            layout: 'fit',
            items: [{
                    xtype: 'form',
                    bodyPadding: 15,
                    items: [statusCombo, memoField],
                    buttons: [
                        {
                            text: 'Cancelar',
                            handler: function () {
                                win.close();
                            }
                        },
                        {
                            text: 'Confirmar Recepción',
                            formBind: true,
                            handler: function () {
                                var selectedStatus = statusCombo.getValue();
                                var memoText = memoField.getValue();

                                if (!selectedStatus) {
                                    Ext.Msg.alert('Error', 'Debe seleccionar un estatus');
                                    return;
                                }

                                win.close();

                                var transactionNumber = String(Date.now());
                                var docDate = Ext.Date.format(new Date(), "Y-m-d\\TH:i:s");

                                Ext.getBody().mask('Procesando confirmación de recepción...');

                                // Obtener líneas desde BD local
                                Ext.Ajax.request({
                                    url: contexto + "/TransferenciasEntrada",
                                    method: "POST",
                                    params: {
                                        busqBnd: 5,
                                        docEntry: docEntry,
                                        servicio: 'ServiceTransferenciaEntradaDet'
                                    },
                                    success: function (resp) {
                                        var data = Ext.decode(resp.responseText);
                                        var lines = [];
                                        var totalQty = 0;

                                        Ext.Array.each(data.items, function (line, index) {
                                            totalQty += parseFloat(line.Quantity);
                                            lines.push({
                                                LineNum: index + 1, // Forzar inicio en 1
                                                ItemCode: line.ItemCode,
                                                Barcode: line.Barcode,
                                                Quantity: parseFloat(line.Quantity)
                                            });
                                        });

                                        // JSON final
                                        var jsonSend = {
                                            TransferReceiptConfirm: {
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

                                        console.log("? JSON TransferReceiptConfirm:");
                                        console.log(JSON.stringify(jsonSend, null, 4));

                                        // Enviar al servlet
                                        Ext.Ajax.request({
                                            url: contexto + "/TransferenciasEntrada",
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
                                                        // Mensaje simple y directo
                                                        Ext.Msg.alert(
                                                                'Éxito',
                                                                'Confirmación de recepción enviada correctamente',
                                                                function () {
                                                                    TransferenciaEntradaUtils.BtnBusqTransferenciaEntrada();
                                                                }
                                                        );

                                                        console.log("? Respuesta completa:", resultado);
                                                    } else {
                                                        Ext.Msg.alert('Error', resultado.error || 'Error al procesar la confirmación');
                                                    }
                                                } catch (e) {
                                                    console.error("Error al parsear respuesta:", e);
                                                    Ext.Msg.alert('Error', 'Error al procesar la respuesta del servidor: ' + e.message);
                                                }
                                            },
                                            failure: function (response) {
                                                Ext.getBody().unmask();
                                                console.error("? Error al enviar TransferReceiptConfirm:", response);
                                                Ext.Msg.alert('Error', 'Error al enviar la confirmación de recepción');
                                            }
                                        });
                                    },
                                    failure: function () {
                                        Ext.getBody().unmask();
                                        Ext.Msg.alert("Error", "No se pudieron cargar líneas para TransferReceiptConfirm");
                                    }
                                });
                            }
                        }
                    ]
                }]
        });

        win.show();
    }
});

// ? Panel principal - UNA SOLA DEFINICIÓN
Ext.define('Modulos.global.PanelTransferenciasEntrada', {
    extend: 'Ext.form.Panel',
    requires: [
        'TransferenciaEntradaUtils'
    ],
    alias: 'widget.PanelTransferenciasEntrada',
    id: 'idMenu505',
    title: 'Transferencia Entrada',
    bodyPadding: '10 10 10 10',
    layout: {
        type: 'vbox',
        align: 'stretch'
    },
    scrollable: true,
    initComponent: function () {
        var me = this;

        Ext.define('modelTransferenciasEntrada', {
            extend: 'Ext.data.Model',
            fields: [
                "TEID",
                "DocEntry",
                "DocNum",
                "NumAtCard",
                "DocDate",
                "CardCode",
                "Status",
                "Memo",
                "AddressCode",
                "TEEstatusId",
                "TEFechaInsercion"
            ]
        });

        me.storeTransferenciaEntrada = Ext.create('Ext.data.Store', {
            model: 'modelTransferenciasEntrada',
            autoLoad: false,
            pageSize: 25,
            proxy: {
                type: "ajax",
                url: contexto + "/TransferenciasEntrada",
                pageParam: false, // ? AGREGAR
                startParam: "offset", // ? AGREGAR
                limitParam: "limit", // ? AGREGAR
                extraParams: {
                    busqBnd: 4,
                    servicio: 'ServiceTransferenciaEntrada'
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
                            id: 'idMenu505-form',
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
                                            id: "idCmbEstatusInbound",
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
                    id: 'gridTransferenciaEntrada',
                    store: me.storeTransferenciaEntrada,
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
                                TransferenciaEntradaUtils.BtnBusqTransferenciaEntrada();
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
                                TransferenciaEntradaUtils.verNuevasTransferencias(); // ? CAMBIO
                            },
                            listeners: {
                                afterrender: function (btn) {
                                    addTooltip(btn, 'Ver Transferencias de Entrada Nuevas'); // ? CAMBIO
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
                        store: me.storeTransferenciaEntrada,
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
                            dataIndex: "TEID", // ? CAMBIO
                            width: 50,
                            align: "center",
                            filter: {type: 'number'}
                        },
                        {
                            text: "Estatus",
                            dataIndex: "TEEstatusId", // ? CAMBIO
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
                            filter: {type: 'string'}  // ? CAMBIO a string
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
                            text: "Status", // ? NUEVO
                            dataIndex: "Status",
                            width: 120,
                            filter: {type: 'string'}
                        },
                        {
                            text: "Address", // ? NUEVO
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
                                        TransferenciaEntradaUtils.enviarTransferReceiptConfirm(record);  // ? Implementarás después
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
                            TransferenciaEntradaUtils.verLineasTransferenciaLocal(record);
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