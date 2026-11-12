/* * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/ClientSide/javascript.js to edit this template
 */


Ext.define('RetornosUtils', {
    singleton: true,

    BtnBusqRetornos: function () {

        var idEstatus = Ext.getCmp('idCmbEstatusRetorno').getValue();
        const fecha = Ext.Date.format(Ext.getCmp('idFechaRetorno').getValue(), 'd-m-Y');
        const diasAtras = Ext.getCmp('idDiasAtrasRetorno').getValue();


        const param = {
            busqBnd: 4,
            estatus: idEstatus,
            dias: diasAtras,
            fecha: fecha
        };


        RetornosUtils.BuscarRetornos(param);
    },

    BuscarRetornos: function (prm) {
        var grd = Ext.getCmp('gridRetornos');
        if (!grd)
            return;

        var store = grd.getStore();
        store.removeAll(true);
        store.reload({
            params: prm
        });
    },

    verNuevasOrdenes: function () {
        var win = Ext.create('Ext.window.Window', {
            id: 'winNuevosRetornos',
            title: 'Nuevos Retornos',
            width: 1000,
            height: 600,
            modal: true,
            layout: 'fit',
            closeAction: 'destroy',
            items: [
                {
                    xtype: 'FormNuevosRetornos'
                }
            ],
            // Agregamos el listener aquí
            listeners: {
                destroy: function () {
                    // Llamada a tu función de utilidad
                    RetornosUtils.BtnBusqRetornos();
                }
            }
        });

        win.show();
    },

    detalleRetorno: function (clave, comid) {

        Ext.require('Modulos.global.FormPanelRetornosDet', function () {
            var win = Ext.create('Ext.window.Window', {
                id: 'winPaneldetalleRetorno',
                title: 'Detalle Retorno',
                scrollable: 'vertical',
                width: 800,
                height: 500,
                closable: true,
                closeAction: 'destroy',
                modal: true,
                constrain: true,
                layout: 'fit',
                resizable: true,
                listeners: {
                    destroy: function () {
                        RetornosUtils.BtnBusqRetornos();
                    }
                },
                items: [
                    Ext.create('Modulos.global.FormPanelRetornosDet', {
                        cveRetorno: clave,
                        cveComid: comid,
                        titulo: 'Detalle',
                        itemId: 'pnlRetornoDet',
                        height: 200,
                        anchor: '100%'
                                //window: 'winPaneldetalleEcommerce',
                    })
                ]
            });

            // win.setSize(Ext.getBody().getViewSize());
            win.show();
        });
    },

    ConfirmarOrdenCompra: function (ocid, silent) {  // ? Agregar parámetro silent
        var payload = {
            rtnid: ocid,
            retestatus: "C"
        };

        Ext.Ajax.request({
            url: contexto + '/Retornos',
            timeout: 60000,
            params: {
                busqBnd: 8,
                valores: Ext.JSON.encode(payload)
            },
            success: function (response) {
                var resultado = Ext.JSON.decode(response.responseText);

                // ? Solo mostrar mensaje si NO es silencioso
                if (!silent) {
                    Ext.MessageBox.show({
                        title: 'Retornos',
                        msg: resultado.message,
                        buttons: Ext.MessageBox.OK,
                        icon: Ext.MessageBox.INFO,
                        fn: function (btn) {
                            if (btn === 'ok') {
                                RetornosUtils.BtnBusqRetornos();
                            }
                        }
                    });
                } else {
                    // ? Si es silencioso, solo refrescar el grid
                    console.log('? Estatus actualizado silenciosamente:', resultado.message);
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

    enviarReturnConfirm: function (record) {
        var me = this;
        var clave = record.get("rtnid");
        var docEntry = record.get("DocEntry");
        var docNum = record.get("DocNum");
        var cardCode = record.get("CardCode");
        var comid = record.get("comid");
        var confirmCount = record.get("CONFIRMCOUNT") || 0;

        Ext.getBody().mask('Calculando estatus y pendientes de recepción...');

        Ext.Ajax.request({
            url: contexto + "/Retornos",
            method: "POST",
            params: {
                busqBnd: 5,
                clave: clave,
                limit: 99999 // Trae todo el universo de líneas para calcular
            },
            success: function (resp) {
                Ext.getBody().unmask();
                var data = Ext.decode(resp.responseText);
                
                // Extrae el arreglo 'items' del JSON paginado
                var lineas = data.items || data || [];

                if (lineas.length === 0) {
                    Ext.Msg.alert("Error", "No se encontraron líneas para este retorno.");
                    return;
                }

                var totalPedido = 0;
                var totalRecibido = 0;
                var totalYaConfirmado = 0;
                var deltaTotalAEnviar = 0;
                var linesAEnviar = [];

                // Calcular acumulados y diferencias por línea
                Ext.Array.each(lineas, function (line) {
                    var qtyOriginal = parseFloat(line.quantity !== undefined ? line.quantity : line.Quantity) || 0;
                    var qtyRecibidaFisica = parseFloat(line.receivedquantity !== undefined ? line.receivedquantity : line.ReceivedQuantity) || 0;
                    var qtyConfirmadaPrevia = parseFloat(line.confirmedquantity !== undefined ? line.confirmedquantity : line.ConfirmedQuantity) || 0;

                    var delta = qtyRecibidaFisica - qtyConfirmadaPrevia;
                    if (delta < 0) {
                        delta = 0;
                    }

                    totalPedido += qtyOriginal;
                    totalRecibido += qtyRecibidaFisica;
                    totalYaConfirmado += qtyConfirmadaPrevia;
                    deltaTotalAEnviar += delta;

                    // Solo agregar líneas con producto nuevo recibido
                    if (delta > 0) {
                        linesAEnviar.push({
                            LineNum: line.linenum !== undefined ? line.linenum : line.LineNum,
                            ItemCode: line.itemcode || line.ItemCode,
                            BarCode: line.barcode || line.BarCode || line.itemcode || line.ItemCode,
                            Quantity: delta
                        });
                    }
                });

                // Validar si hay piezas por enviar
                if (deltaTotalAEnviar === 0) {
                    Ext.Msg.alert('Atención', 'No hay nuevas recepciones físicas pendientes por confirmar en este retorno.');
                    return;
                }

                var estatusCalculado = '';
                var esEntregaCompleta = false;

                if (totalRecibido >= totalPedido) {
                    estatusCalculado = 'Total';
                    esEntregaCompleta = true;
                } else if (totalRecibido > 0) {
                    estatusCalculado = 'Parcial';
                    esEntregaCompleta = false;
                } else {
                    estatusCalculado = 'Cancelada';
                }

                // ============================================
                // PREPARACIÓN DE LOTES (500 por bloque)
                // ============================================
                var loteSize = 500;
                var totalLotes = Math.ceil(linesAEnviar.length / loteSize);

                var transactionText = '';
                if (totalLotes === 1) {
                    transactionText = comid + "_" + (confirmCount + 1);
                } else {
                    transactionText = comid + "_" + (confirmCount + 1) + " al " + (confirmCount + totalLotes);
                }

                var memoField = Ext.create('Ext.form.field.TextArea', {
                    fieldLabel: 'Observaciones',
                    name: 'memo',
                    labelAlign: 'top',
                    anchor: '100%',
                    height: 70,
                    value: 'Recepción ' + estatusCalculado 
                });

                var win = Ext.create('Ext.window.Window', {
                    title: 'Confirmar Retorno ' + estatusCalculado + ' - ' + docNum,
                    modal: true,
                    width: 460,
                    layout: 'fit',
                    resizable: false,
                    items: [{
                        xtype: 'form',
                        bodyPadding: 15,
                        items: [
                            {xtype: 'displayfield', fieldLabel: 'Doc Num', value: docNum},
                            {xtype: 'displayfield', fieldLabel: 'Transacciones', value: '<b>' + transactionText + ' (' + totalLotes + ' envíos)</b>'},
                            {xtype: 'displayfield', fieldLabel: 'Total de Líneas a Enviar', value: linesAEnviar.length},
                            {xtype: 'displayfield', fieldLabel: 'Total Solicitado', value: totalPedido + ' pzas'},
                            {xtype: 'displayfield', fieldLabel: 'Total Recibido (Físico)', value: totalRecibido + ' pzas'},
                            {
                                xtype: 'displayfield',
                                fieldLabel: 'A Confirmar (Piezas totales)',
                                value: '<b style="color: #4CAF50; font-size: 14px;">' + deltaTotalAEnviar + ' pzas</b>'
                            },
                            {
                                xtype: 'displayfield',
                                fieldLabel: 'Estatus Final Esperado',
                                value: '<b style="color: ' + (estatusCalculado === 'Total' ? 'green' : 'orange') + ';">' + estatusCalculado + '</b>'
                            },
                            memoField
                        ],
                        buttons: [
                            {
                                text: 'Cancelar',
                                handler: function () {
                                    win.close();
                                }
                            },
                            {
                                text: 'Confirmar y Enviar',
                                iconCls: 'fa fa-check',
                                handler: function () {
                                    var memoText = memoField.getValue();
                                    var docDate = Ext.Date.format(new Date(), "Y-m-d\\TH:i:s");
                                    win.close();

                                    var progressWin = Ext.create('Ext.window.Window', {
                                        title: 'Enviando Lotes a Vector Delta',
                                        width: 400,
                                        height: 160,
                                        modal: true,
                                        closable: false,
                                        layout: 'vbox',
                                        bodyPadding: 20,
                                        items: [
                                            {xtype: 'label', id: 'lblProgLoteConf', text: 'Iniciando envío de lotes...', margin: '0 0 10 0'},
                                            {xtype: 'progressbar', id: 'barProgLoteConf', width: '100%'}
                                        ]
                                    });
                                    progressWin.show();

                                    var index = 0;
                                    var loteActualN = 1;
                                    var respuestasServidor = [];

                                    function enviarLote() {
                                        var fin = Math.min(index + loteSize, linesAEnviar.length);
                                        var loteActual = linesAEnviar.slice(index, fin);

                                        var deltaLote = 0;
                                        Ext.Array.each(loteActual, function(line) {
                                            deltaLote += line.Quantity;
                                        });

                                        var siguienteEnvio = confirmCount + loteActualN;
                                        var currentTransactionNumber = comid + "_" + siguienteEnvio;

                                        // Si van múltiples envíos y el estatus general es Total, los lotes previos van como Parcial
                                        var currentEstatus = estatusCalculado;
                                        if (estatusCalculado === 'Total' && fin < linesAEnviar.length) {
                                            currentEstatus = 'Parcial';
                                        }

                                        var currentMemo = memoText;
                                        if (totalLotes > 1) {
                                            currentMemo += ' (Lote ' + loteActualN + ' de ' + totalLotes + ')';
                                        }

                                        Ext.getCmp('lblProgLoteConf').setText('Enviando Lote ' + loteActualN + ' de ' + totalLotes + '...');
                                        var pct = index / linesAEnviar.length;
                                        Ext.getCmp('barProgLoteConf').updateProgress(pct);

                                        var jsonSend = {
                                            ReturnConfirm: {
                                                DocDate: docDate,
                                                DocNum: docNum,
                                                NumAtCard: cardCode,
                                                TransactionNumber: currentTransactionNumber,
                                                Status: currentEstatus,
                                                Memo: currentMemo
                                            },
                                            ControlValues: {
                                                TotalQuantity: deltaLote,
                                                TotalLines: loteActual.length
                                            },
                                            Lines: loteActual
                                        };

                                        Ext.Ajax.request({
                                            url: contexto + "/Retornos",
                                            method: "POST",
                                            params: {
                                                busqBnd: 6,
                                                valores: Ext.encode(jsonSend),
                                                rtnid: clave,
                                                esCompleta: (fin >= linesAEnviar.length) ? 'S' : 'N'
                                            },
                                            success: function (response) {
                                                var resultado = Ext.decode(response.responseText);
                                                respuestasServidor.push(resultado);

                                                index += loteSize;
                                                loteActualN++;

                                                if (index < linesAEnviar.length) {
                                                    enviarLote();
                                                } else {
                                                    progressWin.close();
                                                    mostrarResumenFinal();
                                                }
                                            },
                                            failure: function () {
                                                progressWin.close();
                                                Ext.Msg.alert('Error', 'Fallo de conexión al enviar el lote ' + loteActualN + '. El proceso se ha detenido.');
                                                RetornosUtils.BtnBusqRetornos();
                                            }
                                        });
                                    }

                                    function mostrarResumenFinal() {
                                        var allSuccess = true;
                                        Ext.Array.each(respuestasServidor, function(res) {
                                            if (!res.success) allSuccess = false;
                                        });

                                        if (allSuccess) {
                                            var ultRes = respuestasServidor[respuestasServidor.length - 1];
                                            var cr = ultRes.clienteResponse || {};
                                            var docNumResp = cr.DocNum || 'N/A';
                                            var statusMensaje = (cr.StatusInfo && cr.StatusInfo.Mensaje) ? cr.StatusInfo.Mensaje : 'OK';

                                            var msg = 'Confirmación procesada exitosamente en <b>' + totalLotes + ' lote(s)</b><br><br>';
                                            msg += '<b>Retorno:</b> ' + docNum + '<br>';
                                            msg += '<b>Transacciones generadas:</b> ' + transactionText + '<br>';
                                            msg += '<b>Líneas enviadas en total:</b> ' + linesAEnviar.length + '<br>';
                                            msg += '<b>Piezas confirmadas:</b> <b style="color:#4CAF50;">' + deltaTotalAEnviar + ' pzas</b><br>';
                                            msg += '<b>Último Folio SAP:</b> ' + docNumResp + '<br>';
                                            msg += '<b>Estado Cliente:</b> ' + statusMensaje;

                                            Ext.Msg.alert('Éxito', msg, function () {
                                                RetornosUtils.BtnBusqRetornos();
                                            });
                                        } else {
                                            Ext.Msg.alert('Aviso', 'El proceso terminó, pero algunos lotes reportaron error en el servidor. Revise los registros.');
                                            RetornosUtils.BtnBusqRetornos();
                                        }
                                    }

                                    enviarLote();
                                }
                            }
                        ]
                    }]
                });

                win.show();
            },
            failure: function () {
                Ext.getBody().unmask();
                Ext.Msg.alert("Error", "No se pudo conectar para obtener los totales.");
            }
        });
    },
    
    EliminarRetorno: function (prm) {
        Ext.Ajax.request({
            url: contexto + '/Retornos',
            timeout: 60000,
            params: {
                busqBnd: 7,
                valores: prm
            },
            success: function (response) {
                Ext.MessageBox.show({
                    title: 'Retornos',
                    msg: Ext.JSON.decode(response.responseText).message,
                    buttons: Ext.MessageBox.OK,
                    icon: Ext.MessageBox.INFO,
                    fn: function (btn) {
                        if (btn === 'ok') {
                            BtnBusqRetornos();

                        }
                    }
                });
                RetornosUtils.BtnBusqRetornos();
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

});

Ext.define('Modulos.global.PanelRetornos', {
    extend: 'Ext.form.Panel',
    requires: [
        'RetornosUtils',
        'Modulos.global.FormNuevosRetornos'
    ],
    alias: 'widget.PanelRetornos',
    id: 'idMenu507',
    title: 'Retornos',
    bodyPadding: '10 10 10 10',
    layout: {
        type: 'vbox',
        align: 'stretch'
    },
    scrollable: true,
    initComponent: function () {
        var me = this;

        Ext.define('modelRetornos', {
            extend: 'Ext.data.Model',
            fields: [
                "RTNID",
                "DocEntry",
                "DocNum",
                "DocDate",
                "CardCode",
                "Memo",
                "Status",
                "FechaInsercion",
                'comid',
                "comestatus",
                "retestatus",
                "CONFIRMCOUNT",
                "NumAtCard"// <-- Contador de transacciones
            ]
        });

        me.storeRetornos = Ext.create('Ext.data.Store', {
            model: 'modelRetornos',
            autoLoad: false,
            pageSize: 50,
            proxy: {
                type: "ajax",
                url: contexto + "/Retornos",
                pageParam: false,
                startParam: "offset",
                limitParam: "limit",
                extraParams: {
                    busqBnd: 1,
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
                            id: 'idMenu507-form',
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
                                            id: "idCmbEstatusRetorno",
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
                                        },

                                        {
                                            xtype: 'datefield',
                                            id: 'idFechaRetorno',
                                            name: 'fechaBase',
                                            fieldLabel: 'Fecha',
                                            format: 'd-m-Y', // puedes cambiar el formato si quieres
                                            width: 300,
                                            value: new Date(),
                                            allowBlank: false
                                        },
                                        {
                                            xtype: 'numberfield',
                                            id: 'idDiasAtrasRetorno',
                                            name: 'diasAtras',
                                            fieldLabel: 'Dias atras',
                                            value: 7,
                                            // maxValue: EcommerceUtils.dias,
                                            minValue: 0,
                                            allowDecimals: false,
                                            allowBlank: false,
                                            width: 300,

                                        }
                                    ]
                                }
                            ]
                        }
                    ]
                },
                {
                    xtype: 'grid',
                    id: 'gridRetornos',
                    store: me.storeRetornos,
                    flex: 1,
                    stateful: true,
                    stateId: 'gridRetornosState',
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
                                RetornosUtils.BtnBusqRetornos();
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
                                RetornosUtils.verNuevasOrdenes();
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
                    bbar: {
                        xtype: 'pagingtoolbar',
                        store: me.storeRetornos,
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
                            dataIndex: "rtnid",
                            width: 50,
                            align: "center",
                            filter: {type: 'number'}
                        },
                        {
                            text: "Estatus",
                            dataIndex: "retestatus",
                            align: "center",
                            width: 150,
                            filter: {type: 'string'},
                            renderer: function (value) {
                                // ? Mapeo de códigos a nombres
                                var estatusMap = {
                                    'A': 'Activo',
                                    'C': 'Confirmado',
                                    'X': 'Cancelado',
                                    null: 'Estatus no valido'
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
                            text: "Comid",
                            dataIndex: "comid",
                            align: "center",
                            width: 220,
                            filter: {type: 'string'}
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
                            align: "center",
                            width: 150,
                            filter: {type: 'string'}
                        },
                        {
                            text: "DocDate",
                            dataIndex: "DocDate",
                            align: "center",
                            filter: {type: 'date'},
                            width: 150,
                        },
                        {
                            text: "CardCode",
                            dataIndex: "CardCode",
                            align: "center",
                            width: 150,
                            filter: {type: 'string'}
                        },
                        {
                            text: "Memo",
                            dataIndex: "Memo",
                            align: "center",
                            width: 220,
                            filter: {type: 'string'}
                        },
                        {
                            text: "Warehouse",
                            dataIndex: "Warehouse",
                            align: "center",
                            width: 220,
                            filter: {type: 'string'},
                            hidden: true
                        },
                        {
                            text: "NumAtCard",
                            dataIndex: "NumAtCard",
                            align: "center",
                            width: 220,
                            filter: {type: 'string'},
                            hidden: true
                        },

                        // ==========================================
// 1. CONFIRMAR RETORNO (BLINDADO)
// ==========================================
                        {
                            text: "Confirmar",
                            xtype: "actioncolumn",
                            menuDisabled: true,
                            sortable: false,
                            align: "center",
                            width: 90,
                            items: [
                                {
                                    tooltip: 'Confirmar Retorno / Reenviar Acuse',
                                    getClass: function (v, meta, record) {
                                        var estatusCom = record.get("comestatus");
                                        var estatusRet = record.get("retestatus");

                                        var puedeConfirmar = (estatusCom === "Recibido" || estatusCom === "Recibo Parcial") &&
                                                (estatusRet !== "X");

                                        return puedeConfirmar ? "icn-habilita" : "icn-habilita-disable";
                                    },
                                    isDisabled: function (view, rowIndex, colIndex, item, record) {
                                        var estatusCom = record.get("comestatus");
                                        var estatusRet = record.get("retestatus");

                                        var puedeConfirmar = (estatusCom === "Recibido" || estatusCom === "Recibo Parcial") &&
                                                (estatusRet !== "X");

                                        return !puedeConfirmar;
                                    },
                                    handler: function (grid, rowIndex, colIndex) {
                                        var record = grid.getStore().getAt(rowIndex);
                                        var estatusCom = record.get("comestatus");
                                        var estatusRet = record.get("retestatus");

                                        if (estatusRet === "X") {
                                            Ext.Msg.alert('Atención', 'El retorno se encuentra cancelado.');
                                            return;
                                        }

                                        if (estatusCom !== "Recibido" && estatusCom !== "Recibo Parcial") {
                                            Ext.Msg.alert('Atención', 'El retorno aún no cuenta con piezas recibidas físicamente.');
                                            return;
                                        }

                                        RetornosUtils.enviarReturnConfirm(record);
                                    }
                                }
                            ]
                        },

// ==========================================
// 2. CANCELAR RETORNO (BLINDADO)
// ==========================================
                        {
                            text: "Cancelar",
                            xtype: "actioncolumn",
                            width: 90,
                            menuDisabled: true,
                            sortable: false,
                            align: "center",
                            items: [
                                {
                                    tooltip: 'Cancelar Retorno',
                                    getClass: function (v, meta, record) {
                                        var estatus = record.get("retestatus");
                                        var estatusCom = record.get("comestatus");

                                        var puedeCancelar = (estatus === "A") &&
                                                (estatusCom !== "Recibido" && estatusCom !== "Recibo Parcial" && estatusCom !== "Confirmado");

                                        return puedeCancelar ? "icn-cancela" : "icn-cancela-disable";
                                    },
                                    isDisabled: function (view, rowIndex, colIndex, item, record) {
                                        var estatus = record.get("retestatus");
                                        var estatusCom = record.get("comestatus");

                                        var puedeCancelar = (estatus === "A") &&
                                                (estatusCom !== "Recibido" && estatusCom !== "Recibo Parcial" && estatusCom !== "Confirmado");

                                        return !puedeCancelar;
                                    },
                                    handler: function (grid, rowIndex, colIndex, item, event, record) {
                                        var estatus = record.get("retestatus");
                                        var estatusCom = record.get("comestatus");
                                        var rtnid = record.get("rtnid");

                                        if (estatus !== "A") {
                                            Ext.Msg.alert('Atención', 'Solo se pueden cancelar retornos en estatus Activo.');
                                            return;
                                        }

                                        if (estatusCom === "Recibido" || estatusCom === "Recibo Parcial" || estatusCom === "Confirmado") {
                                            Ext.Msg.alert('Atención', 'No se puede cancelar un retorno con recepciones físicas en almacén.');
                                            return;
                                        }

                                        Ext.MessageBox.show({
                                            title: "Cancelar Retorno",
                                            msg: '¿Está seguro que desea cancelar el retorno: <b>' + record.data.DocNum + '</b> (ID: ' + rtnid + ')?',
                                            buttons: Ext.MessageBox.OKCANCEL,
                                            icon: Ext.MessageBox.QUESTION,
                                            fn: function (btn) {
                                                if (btn === 'ok') {
                                                    var nuevoObjeto = {
                                                        rtnid: record.data.rtnid,
                                                        retestatus: record.data.retestatus
                                                    };
                                                    record.drop();
                                                    RetornosUtils.EliminarRetorno(Ext.JSON.encode(nuevoObjeto));
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
                            // var grid = Ext.getCmp('gridRetornos'); // or e.grid
                            // var cvRetorno = grid.getSelectionModel().getLastSelected().get('rtnid');
                            var cvRetorno = record.get('rtnid'); // ? MEJORADO
                            var comid = record.get('comid');     // ? OBTENEMOS EL COMID
                            
                            RetornosUtils.detalleRetorno(cvRetorno, comid); // ? PASAMOS AMBOS PARÁMETROS
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