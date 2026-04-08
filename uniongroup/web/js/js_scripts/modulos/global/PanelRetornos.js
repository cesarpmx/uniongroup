/* 
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
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
                    xtype: 'FormNuevosRetornos' // ? tu componente reutilizable
                }
            ]
        });

        win.show();
    },

    detalleRetorno: function (clave) {

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
    var transaccionNum = record.get("comid");

    // 1. Bloqueo preventivo mientras cargamos los datos para la ventana
    Ext.getBody().mask('Calculando totales...');

    /* ================= PASO 1: OBTENER DATOS ANTES DE MOSTRAR VENTANA ================= */
    Ext.Ajax.request({
        url: contexto + "/Retornos",
        method: "POST",
        params: {
            busqBnd: 5,
            clave: clave
        },
        success: function (resp) {
            Ext.getBody().unmask();
            var data = Ext.decode(resp.responseText);

            if (!data || data.length === 0) {
                Ext.Msg.alert("Error", "No se encontraron líneas para este retorno.");
                return;
            }

            // Variables para cálculos
            var lines = [];
            var totalPedido = 0;
            var totalSurtido = 0;

            Ext.Array.each(data, function (line) {
                var qty = line.receivedquantity || 0;
                var pedido = line.quantity || 0;

                totalPedido += pedido;
                totalSurtido += qty;

                lines.push({
                    LineNum: line.linenum,
                    ItemCode: line.itemcode,
                    BarCode: line.barcode || line.itemcode,
                    Quantity: qty
                });
            });

            var estatusCalculado = (totalSurtido >= totalPedido) ? 'Total' : 'Parcial';

            /* ================= PASO 2: CREAR VENTANA CON DATOS CARGADOS ================= */
            
            var memoField = Ext.create('Ext.form.field.TextArea', {
                fieldLabel: 'Observaciones',
                name: 'memo',
                labelAlign: 'top',
                anchor: '100%',
                height: 70
            });

            var win = Ext.create('Ext.window.Window', {
                title: 'Confirmar Retorno - ' + docNum,
                modal: true,
                width: 400,
                layout: 'fit',
                resizable: false,
                items: [{
                    xtype: 'form',
                    bodyPadding: 15,
                    items: [
                        { xtype: 'displayfield', fieldLabel: 'DocEntry', value: docEntry },
                        { xtype: 'displayfield', fieldLabel: 'Transaccion Num', value: transaccionNum, fieldStyle: 'color:blue; font-weight:bold;' },
                        { xtype: 'displayfield', fieldLabel: 'Total Pedido', value: totalPedido },
                        { xtype: 'displayfield', fieldLabel: 'Total Surtido', value: totalSurtido, fieldStyle: 'color:blue; font-weight:bold;' },
                        { 
                            xtype: 'displayfield', 
                            fieldLabel: 'Estatus', 
                            value: estatusCalculado,
                            fieldStyle: 'color: ' + (estatusCalculado === 'Total' ? 'green' : 'orange') + '; font-weight:bold;'
                        },
                        memoField
                    ],
                    buttons: [
                        {
                            text: 'Cancelar',
                            handler: function () { win.close(); }
                        },
                        {
                            text: 'Confirmar Retorno',
                            //scale: 'medium',
                            handler: function () {
                                var memoText = memoField.getValue();
                                var docDate = Ext.Date.format(new Date(), "Y-m-d\\TH:i:s");

                                win.close();
                                Ext.getBody().mask('Procesando en SAP...');

                                /* ================= PASO 3: ENVIAR JSON FINAL ================= */
                                var jsonSend = {
                                    ReturnConfirm: {
                                        DocDate: docDate,
                                        DocNum: docNum,
                                        NumAtCard: cardCode,
                                        TransactionNumber: transaccionNum,
                                        Status: estatusCalculado,
                                        Memo: memoText
                                    },
                                    ControlValues: {
                                        TotalQuantity: totalSurtido,
                                        TotalLines: lines.length
                                    },
                                    Lines: lines
                                };

                                Ext.Ajax.request({
                                    url: contexto + "/Retornos",
                                    method: "POST",
                                    params: {
                                        busqBnd: 6,
                                        valores: Ext.encode(jsonSend)
                                    },
                                    success: function (response) {
                                        Ext.getBody().unmask();
                                        var resultado = Ext.decode(response.responseText);

                                        if (resultado.success) {
                                            RetornosUtils.ConfirmarOrdenCompra(clave, true);
                                            
                                            var res = resultado.clienteResponse || {};
                                            var fecha = res.SystemDate ? Ext.Date.format(new Date(res.SystemDate), 'd/m/Y H:i:s') : 'N/A';

                                            Ext.Msg.alert('Éxito', 
                                                '<b>SAP Doc:</b> ' + (res.DocNum || 'N/A') + '<br>' +
                                                '<b>Fecha:</b> ' + fecha + '<br>' +
                                                '<b>Mensaje:</b> ' + (res.StatusInfo ? res.StatusInfo.Mensaje : 'OK')
                                            );
                                        } else {
                                            Ext.Msg.alert('Error SAP', resultado.message || 'Error en el proceso.');
                                        }
                                    },
                                    failure: function () {
                                        Ext.getBody().unmask();
                                        Ext.Msg.alert('Error', 'Fallo de conexión.');
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
               "retestatus"
            ]
        });

        me.storeRetornos = Ext.create('Ext.data.Store', {
            model: 'modelRetornos',
            autoLoad: false,
            pageSize: 25,
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
                            text: 'Buscar',
                            arrowAlign: 'center',
                            iconCls: "icn-factura",
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
                            text: 'Ver Nuevas',
                            arrowAlign: 'center',
                            iconCls: "icn-factura",
                            handler: function (btn) {
                                RetornosUtils.verNuevasOrdenes();
                            },
                            listeners: {
                                afterrender: function (btn) {
                                    addTooltip(btn, 'Ver ?rdenes de Compra Nuevas');
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
                        displayMsg: 'Mostrando {0} - {1} de {2} ?rdenes',
                        emptyMsg: "No hay ?rdenes para mostrar"
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
                                // ? Mapeo de c?digos a nombres
                                var estatusMap = {
                                    'A': 'Activo',
                                    'C': 'Confirmado',
                                    'X': 'Cancelado',
                                    null: 'Estatus no valido'
                                            // Agrega los estatus que necesites
                                };

                                var nombre = estatusMap[value] || value;

                                // ? Opcional: Agregar colores seg?n estatus
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
                            filter: {type: 'string'}
                        },
                        
                        {
                            xtype: "actioncolumn",
                            text: "Confirmar",
                           // dataIndex: "prrtiempo2",
                            menuDisabled: true,
                            sortable: false,
                            align: "center",
                            iconCls: 'icn-habilita',
                            width: 90,
                            items: [
                                {
                                    handler: function (grid, rowIndex, colIndex) {
                                        var record = grid.getStore().getAt(rowIndex);
                                        RetornosUtils.enviarReturnConfirm(record);
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
                                        var estatus = record.get("retestatus");
                                        var estatusCom = record.get("comestatus");

                                        return estatus === "A" && estatusCom !== "Recibido"
                                                ? "icn-cancela"
                                                : "icn-cancela-disable";
                                    },
                                    handler: function (grid, rowIndex, colIndex, item, event, record) {
                                        Ext.MessageBox.show({
                                            title: "Cancelar Retorno",
                                            msg: '¿Estás seguro que deseas cancelar el retorno: ' + record.data.rtnid + ' ?',
                                            buttons: Ext.MessageBox.OKCANCEL,
                                            icon: Ext.MessageBox.QUESTION,
                                            fn: function (btn) {
                                                if (btn === 'ok') {
                                                    
                                                     var rowData = record.data.rtnid;
                                                        var dteestatus = record.data.retestatus;

                                                        var nuevoObjeto = {
                                                            rtnid: rowData,
                                                            retestatus: dteestatus
                                                        };

                                                    
                                                    RetornosUtils.EliminarRetorno(Ext.JSON.encode(nuevoObjeto));
                                                    record.drop();
                                                } else {
                                                    this.close();
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

                            var grid = Ext.getCmp('gridRetornos'); // or e.grid
                            var cvRetorno = grid.getSelectionModel().getLastSelected().get('rtnid');
                            RetornosUtils.detalleRetorno(cvRetorno);
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