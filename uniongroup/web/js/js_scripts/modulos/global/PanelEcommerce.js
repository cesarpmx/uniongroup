Ext.define('EcommerceUtils', {
    singleton: true,
    dias: localStorage.getItem('diasAtras'),

    BtnBusqEcommerce: function () {

        var idEstatusEcom = Ext.getCmp('idCmbEstatusEcom').getValue();

        const fecha = Ext.Date.format(Ext.getCmp('idFechaEcom').getValue(), 'd-m-Y');
        const diasAtras = Ext.getCmp('idDiasAtrasEcom').getValue();

        const param = {
            busqBnd: 1,
            estatus: idEstatusEcom,
            dias: diasAtras,
            fecha: fecha
        };

        EcommerceUtils.BuscarEcommerce(param);
        var storeEcommerce = Ext.StoreManager.lookup('storeEcommerce');
        storeEcommerce.getProxy().setExtraParams(param);
        storeEcommerce.loadPage(1);

    },

    BuscarEcommerce: function (param) {
        const grid = Ext.getCmp('gridEcommerce');
        const store = grid.getStore();
        store.removeAll(true);
        store.reload({params: param});
    },

    BtnLimpBuscProductos: function () {

        var form = Ext.getCmp('idMenu508').getForm();
        form.reset();
        Ext.getCmp('idFechaEcom').setValue(new Date());
        Ext.getCmp('idDiasAtrasEcom').setValue("7");
        var storeEcommerce = Ext.StoreManager.lookup('storeEcommerce');
        storeEcommerce.loadData([], false);
    },

    cargarStoreYGenerarExcel: function (storeName, archivoName, parametros) {
        const idEstatus = Ext.getCmp('idCmbEstatusEcom').getValue();
        const fecha = Ext.Date.format(Ext.getCmp('idFechaEcom').getValue(), 'd/m/Y');
        const diasAtras = Ext.getCmp('idDiasAtrasEcom').getValue();


        const grid = Ext.getCmp(storeName);
        const store = grid.getStore();
        store.removeAll(true);
        var storeEcommerce = Ext.StoreManager.lookup('storeEcommerce');

        const param = {
            busqBnd: 1,
            offset: 0,
            limit: 99999999
        };

        store.reload({
            params: param,
            callback: function (records, operation, success) {
                if (success) {
                    generarExcel(storeName, archivoName, parametros);
                    storeEcommerce.loadPage(1);
                }
            }
        });
    },

    detalleEcommerce: function (clave) {

        Ext.require('Modulos.global.FormPanelEcommerceDet', function () {
            var win = Ext.create('Ext.window.Window', {
                id: 'winPaneldetalleEcommerce',
                title: 'Detalle Pedido',
                width: 900,
                height: 500,
                scrollable: 'vertical',
                closable: true,
                closeAction: 'destroy',
                modal: true,
                constrain: true,
                layout: 'fit',
                resizable: true,
                listeners: {
                    destroy: function () {
                        EcommerceUtils.BtnBusqEcommerce();
                    }
                },
                items: [
                    Ext.create('Modulos.global.FormPanelEcommerceDet', {
                        cveEcom: clave,
                        titulo: 'Detalle del pedido',
                        itemId: 'pnlEcommerceDet',
                        height: 200,
                        anchor: '100%',
                        //window: 'winPaneldetalleEcommerce',
                    })
                ]
            });

            //win.setSize(Ext.getBody().getViewSize());
            win.show();
        });
    },

    EliminarPedido: function (prm) {
        Ext.Ajax.request({
            url: contexto + '/Ecommerce',
            timeout: 60000,
            params: {
                busqBnd: 4,
                valores: prm
            },
            success: function (response) {
                Ext.MessageBox.show({
                    title: 'Ecommerce',
                    msg: Ext.JSON.decode(response.responseText).message,
                    buttons: Ext.MessageBox.OK,
                    icon: Ext.MessageBox.INFO,
                    fn: function (btn) {
                        if (btn === 'ok') {
                            EcommerceUtils.BtnBusqEcommerce();
                        }
                    }
                });
            },
            failure: function () {
                Ext.MessageBox.show({
                    title: 'Error',
                    msg: 'No se pudo eliminar el registro...',
                    buttons: Ext.MessageBox.CANCEL,
                    icon: Ext.MessageBox.ERROR
                });
            }
        });
    },

    ConfirmarPedido: function (jsonData) {
        var data = Ext.decode(jsonData);

        Ext.Ajax.request({
            url: contexto + '/Ecommerce',
            method: 'POST',
            params: {
                busqBnd: 5,
                valores: jsonData
            },
            success: function (resp) {
                try {
                    var obj = Ext.decode(resp.responseText);

                    if (obj.success === "true" || obj.success === true) {
                        Ext.Msg.alert(
                                'OK',
                                'Pedido confirmado. Se creó la lista de empaque con ID: ' + obj.preid
                                );
                        EcommerceUtils.BtnBusqEcommerce();
                    } else {
                        Ext.Msg.alert('Error', obj.message || 'Ocurrió un error al generar la lista de empaque');
                    }
                } catch (e) {
                    Ext.Msg.alert('Error', 'Respuesta inválida del servidor');
                }
            },
            failure: function () {
                Ext.Msg.alert('Error', 'No se pudo confirmar el pedido');
            }
        });
    },
    GenerarArchivoConfirmacion: function (ecomid, le) {
        // Mostrar el mensaje de espera antes de la petición
        Ext.Msg.wait('Generando STDRUEAP, un momento por favor...', 'Procesando');

        Ext.Ajax.request({
            url: contexto + '/Ecommerce',
            method: 'POST',
            params: {
                busqBnd: 3,
                ecomid: ecomid,
                le: le
            },
            success: function (resp) {
                // Ocultar el mensaje de espera
                Ext.Msg.hide(); 
                
                // Mostrar el mensaje de éxito
                Ext.Msg.alert('OK', 'Archivo STDRUEAP generado correctamente');
            },
            failure: function () {
                // Ocultar el mensaje de espera
                Ext.Msg.hide(); 
                
                // Mostrar el mensaje de error
                Ext.Msg.alert('Error', 'No se pudo generar el STDRUEAP');
            }
        });
    }

});




Ext.define('Modulos.global.PanelEcommerce', {
    extend: 'Ext.form.Panel',
    alias: 'widget.PanelEcommerce',
    id: 'idMenu508',
    title: 'Ecommerce',
    bodyPadding: '10 10 10 10',
    layout: {
        type: 'vbox',
        align: 'stretch'
    },
    requires: [
        'EcommerceUtils'
    ],
    scrollable: true,

    initComponent: function () {
        var me = this;

        /* =======================
         MODELO
         ======================= */
        Ext.define('modelEcommerce', {
            extend: 'Ext.data.Model',
            fields: [
                'ecomid',
                'holding',
                'customer',
                'neutralcustomer',
                'ordernumber',
                {
                    name: 'deliverydate',
                    type: 'date',
                    convert: formatearFechaCorta
                },

                'shippername1',
                'shippername2',
                'shippername3',
                'shipperstreet',
                'shippercountry',
                'shipperzip',
                'shippertown',
                'shipperemail',

                'receivernumber',
                'receivername1',
                'receivername2',
                'receivername3',
                'receiverstreet',
                'receivercountry',
                'receiverzip',
                'receivertown',
                'receiverphone',
                'receiveremail',
                'receiveriln',

                'freightpayer',
                'shippingtype',
                'fixeddate',
                'fixedtime',
                'fixeddatetype',
                'palletheight',
                'goodsvalue',

                'processingstatus',
                'preid',
                {
                    name: 'processingdate',
                    type: 'date',
                    convert: formatearFechaCorta
                },
                {
                    name: 'processingtime',
                    type: 'date',
                    convert: formatearHora
                },

                'userprogram',
                'estatusecom',
                'direccion',
                'preestatus'
            ]
        });


        /* =======================
         STORE
         ======================= */
        me.storeEcommerce = Ext.create('Ext.data.Store', {
            id: 'storeEcommerce',
            model: 'modelEcommerce',
            autoLoad: false,
            pageSize: 25,
            proxy: {
                type: 'ajax',
                url: contexto + '/Ecommerce',
                enablePaging: true,
                extraParams: {
                    busqBnd: 1
                },
                reader: {
                    type: 'json',
                    rootProperty: ''
                }
            }
        });

        var storeEstatusEcom = Ext.create('Ext.data.Store', {
            fields: ['codigo', 'descripcion'],
            data: [
                {codigo: 'P', descripcion: 'Pendiente'},
//                {codigo: 'A', descripcion: 'En proceso'},
//                {codigo: 'S', descripcion: 'Surtido'},
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
                            id: 'idMenu508-form',
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
                                // ===== Columna izquierda: Combo =====
                                {
                                    items: [
                                        {
                                            xtype: 'combobox',
                                            id: "idCmbEstatusEcom",
                                            name: "cmbEstatusEcom",
                                            fieldLabel: 'Estatus',
                                            width: 300,
                                            store: storeEstatusEcom,
                                            valueField: 'codigo',
                                            displayField: 'descripcion',
                                            queryMode: 'local',
                                            emptyText: 'Seleccione el Estatus',
                                            allowBlank: true,
                                            listeners: {
                                                scope: this,
                                                select: function () {
                                                    EcommerceUtils.BtnBusqEcommerce();
                                                }
                                            }
                                        },
                                        {
                                            xtype: 'datefield',
                                            id: 'idFechaEcom',
                                            name: 'fechaBase',
                                            fieldLabel: 'Fecha',
                                            format: 'd-m-Y', // puedes cambiar el formato si quieres
                                            width: 300,
                                            value: new Date(),
                                            allowBlank: false
                                        },
                                        {
                                            xtype: 'numberfield',
                                            id: 'idDiasAtrasEcom',
                                            name: 'diasAtras',
                                            fieldLabel: 'Dias atras',
                                            value: 7,
                                            maxValue: EcommerceUtils.dias,
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
                    id: 'gridEcommerce',
                    store: me.storeEcommerce,
                    flex: 1,
                    stateful: true,
                    stateId: 'gridEcommerceState',
                    plugins: {
                        gridfilters: true
                    },

                    tbar: [
                        {
                            xtype: 'button',
                            text: 'Buscar',
                            iconCls: 'icn-busquedaDos',
                            handler: function () {
                                EcommerceUtils.BtnBusqEcommerce();
                            }
                        },
                        {
                            xtype: 'button',
                            text: 'Exportar',
                            iconCls: 'icn-excel',
                            //width: 120,
                            handler: function () {





                                var storeName = "gridEcommerce";
                                var archivoName = "Ecommerce";
                                var fechaActual = new Date();
                                var fechaFormateada = Ext.Date.format(fechaActual, 'd/m/Y H:i:s');
                                var titulo = "Ecommerce";
                                var parametros = {
                                    'titulo': titulo,
                                    'Estatus': Ext.getCmp('idCmbEstatusEcom').getRawValue(),
                                    'Fecha': Ext.getCmp('idFechaEcom').getValue(),
                                    'Dias Atras': Ext.getCmp('idDiasAtrasEcom').getValue(),
                                    'Fecha Solicitud': fechaFormateada

                                };
                                Ext.Msg.show({
                                    title: 'Generar Excel',
                                    message: '¿Desea exportar la pagina actual o todos los registros existentes?',
                                    buttons: Ext.MessageBox.YESNO,
                                    buttonText: {
                                        yes: 'Pagina actual',
                                        no: 'Todos los registros'
                                    },
                                    icon: Ext.MessageBox.QUESTION,
                                    fn: function (btn) {
                                        if (btn === 'yes') {
                                            // CÃ¯¿Â½digo a ejecutar si se presiona el botÃ¯¿Â½n "PÃ¯¿Â½gina actual"
                                            generarExcel(storeName, archivoName, parametros);
                                        } else if (btn === 'no') {
                                            EcommerceUtils.cargarStoreYGenerarExcel(storeName, archivoName, parametros);
                                        } else {
                                            console.log('Se cerrÃ¯¿Â½ la ventana sin hacer clic en ningÃ¯¿Â½n botÃ¯¿Â½n');
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
                            text: 'Limpiar',
                            arrowAlign: 'center',
                            iconCls: 'icn-limpiarBusqueda',
                            handler: function () {
                                EcommerceUtils.BtnLimpBuscProductos();
                            },
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

                    columns: {
                        defaults: {
                            filter: {type: 'string'},
                            align: 'center'
                        },
                        items: [
                            {xtype: 'rownumberer', text: '#', flex: 0.5},

                            {text: 'ecomid', dataIndex: 'ecomid', flex: 1},

                            {
                                text: 'estatusecom',
                                dataIndex: 'estatusecom',
                                flex: 1,
                                renderer: function (value) {
                                    var estatusMap = {
                                        'P': 'Pendiente',
                                        'A': 'Activo',
                                        'S': 'Surtido',
                                        'C': 'Confirmado',
                                        'X': 'Cancelado',
                                        null: 'Estatus no valido'
                                    };

                                    var nombre = estatusMap[value] || value;

                                    var color = '#000';
                                    switch (value) {
                                        case 'A':
                                            color = '#4CAF50';
                                            break;
                                        case 'S':
                                            color = '#2196F3';
                                            break;
                                        case 'C':
                                            color = '#009688';
                                            break;
                                        case 'X':
                                            color = '#F44336';
                                            break;
                                    }

                                    return '<b style="color: ' + color + ';">' + nombre + '</b>';
                                }
                            },

                            {text: 'holding', dataIndex: 'holding', flex: 1},
                            {text: 'customer', dataIndex: 'customer', flex: 1},
                            {text: 'neutralcustomer', dataIndex: 'neutralcustomer', flex: 1},
                            {text: 'ordernumber', dataIndex: 'ordernumber', flex: 1},
                            {text: 'deliverydate', dataIndex: 'deliverydate', flex: 1},

                            {text: 'shippername1', dataIndex: 'shippername1', flex: 1},
                            {text: 'shippingtype', dataIndex: 'shippingtype', flex: 1},

                            {text: 'receivernumber', dataIndex: 'receivernumber', flex: 1},
                            {text: 'receivername1', dataIndex: 'receivername1', flex: 1},
                            {text: 'receiverzip', dataIndex: 'receiverzip', flex: 1},
                            {text: 'receivertown', dataIndex: 'receivertown', flex: 1},

                            {text: 'processingdate', dataIndex: 'processingdate', flex: 1},
                            {text: 'processingtime', dataIndex: 'processingtime', flex: 1},
                            {text: 'userprogram', dataIndex: 'userprogram', flex: 1},

                            {
                                text: 'direccion',
                                dataIndex: 'direccion',
                                flex: 2,
                                renderer: function (value) {
                                    if (!value)
                                        return '';
                                    return '<a href="' + value + '" target="_blank">' + value + '</a>';
                                }
                            },

                            {text: 'preestatus', dataIndex: 'preestatus', flex: 1},
                            {text: 'preid', dataIndex: 'preid', flex: 1},

                            /* ====== OCULTOS ====== */
                            {text: 'shippername2', dataIndex: 'shippername2', hidden: true},
                            {text: 'shippername3', dataIndex: 'shippername3', hidden: true},
                            {text: 'shipperstreet', dataIndex: 'shipperstreet', hidden: true},
                            {text: 'shippercountry', dataIndex: 'shippercountry', hidden: true},
                            {text: 'shipperzip', dataIndex: 'shipperzip', hidden: true},
                            {text: 'shippertown', dataIndex: 'shippertown', hidden: true},
                            {text: 'shipperemail', dataIndex: 'shipperemail', hidden: true},

                            {text: 'receivername2', dataIndex: 'receivername2', hidden: true},
                            {text: 'receivername3', dataIndex: 'receivername3', hidden: true},
                            {text: 'receiverstreet', dataIndex: 'receiverstreet', hidden: true},
                            {text: 'receivercountry', dataIndex: 'receivercountry', hidden: true},
                            {text: 'receiverphone', dataIndex: 'receiverphone', hidden: true},
                            {text: 'receiveremail', dataIndex: 'receiveremail', hidden: true},
                            {text: 'receiveriln', dataIndex: 'receiveriln', hidden: true},

                            {text: 'freightpayer', dataIndex: 'freightpayer', hidden: true},
                            {text: 'fixeddate', dataIndex: 'fixeddate', hidden: true},
                            {text: 'fixedtime', dataIndex: 'fixedtime', hidden: true},
                            {text: 'fixeddatetype', dataIndex: 'fixeddatetype', hidden: true},
                            {text: 'palletheight', dataIndex: 'palletheight', hidden: true},
                            {text: 'goodsvalue', dataIndex: 'goodsvalue', hidden: true},
                            {text: 'processingstatus', dataIndex: 'processingstatus', hidden: true},
                                    {
                                        xtype: 'actioncolumn',
                                        text: "Generar LE",
                                        align: 'center',
                                        width: 100,
                                        items: [
                                            {
                                                tooltip: 'Acción Pedido',
                                                getClass: function (v, meta, record) {
                                                    var estatus = record.get("estatusecom");

                                                    if (estatus === 'P') {
                                                        return "icn-habilita"; // Activo o Confirmado -> habilitado
                                                    } else {
                                                        return "icn-habilita-disable"; // Surtido o Cancelado
                                                    }
                                                },
                                                handler: function (grid, rowIndex, colIndex) {
                                                    const rec = grid.getStore().getAt(rowIndex);
                                                    const ecomid = rec.get('ecomid');
                                                    const estatus = rec.get('estatusecom');

                                                    // Si está Surtido o Cancelado, no hace nada
                                                    if (estatus === 'S' || estatus === 'X') {
                                                        return;
                                                    }

                                                    // Activo -> Confirmar pedido
                                                    if (estatus === 'P') {
                                                        Ext.MessageBox.show({
                                                            title: 'Ecommerce',
                                                            msg: '¿Estas seguro que deseas confirmar el pedido ' + ecomid + ' ?',
                                                            buttons: Ext.MessageBox.OKCANCEL,
                                                            icon: Ext.MessageBox.QUESTION,
                                                            fn: function (btn) {
                                                                if (btn === 'ok') {
                                                                    EcommerceUtils.ConfirmarPedido(Ext.JSON.encode({
                                                                        ecomid: ecomid
                                                                    }));
                                                                }
                                                            }
                                                        });
                                                        return;
                                                    }

                                                    // Confirmado -> Generar archivo de confirmación
//                                            if (estatus === 'C') {
//                                                Ext.MessageBox.show({
//                                                    title: 'Ecommerce',
//                                                    msg: '¿Deseas generar el archivo de confirmación para el pedido ' + ecomid + ' ?',
//                                                    buttons: Ext.MessageBox.OKCANCEL,
//                                                    icon: Ext.MessageBox.QUESTION,
//                                                    fn: function (btn) {
//                                                        if (btn === 'ok') {
//                                                            EcommerceUtils.GenerarArchivoConfirmacion(ecomid);
//                                                        }
//                                                    }
//                                                });
//                                                return;
//                                            }
                                                }
                                            }
                                        ]
                                    },
                            {
                                xtype: 'actioncolumn',
                                text: "Confirmar Pedido",
                                align: 'center',
                                width: 100,
                                items: [
                                    {
                                        tooltip: 'Acción Pedido',
                                        getClass: function (v, meta, record) {
                                            var estatus = record.get("preestatus");

                                            return estatus === "Surtido" || estatus === "Recibido" || estatus === "Confirmado" ? "icn-habilita" : "icn-habilita-disable";
                                        },
                                        handler: function (grid, rowIndex, colIndex) {
                                            const rec = grid.getStore().getAt(rowIndex);
                                            const ecomid = rec.get('ecomid');
                                            const estatus = rec.get('preestatus');
                                            const le = rec.get('preid');


                                            Ext.MessageBox.show({
                                                title: 'Ecommerce',
                                                msg: '¿Deseas generar el archivo de confirmación para el pedido ' + ecomid + ' ?',
                                                buttons: Ext.MessageBox.OKCANCEL,
                                                icon: Ext.MessageBox.QUESTION,
                                                fn: function (btn) {
                                                    if (btn === 'ok') {
                                                        EcommerceUtils.GenerarArchivoConfirmacion(ecomid, le);
                                                    }
                                                }
                                            });


                                        }
                                    }
                                ]
                            }
                            ,
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
                                            var estatus = record.get("estatusecom");

                                            // Solo Activo puede cancelar
                                            if (estatus === "A") {
                                                return "icn-cancela"; // habilitado
                                            } else {
                                                return "icn-cancela-disable"; // deshabilitado
                                            }
                                        },
                                        handler: function (grid, rowIndex, colIndex, item, event, record) {
                                            var estatus = record.get("estatusecom");

                                            // Si no es Activo, no hace nada
                                            if (estatus !== "C") {
                                                return;
                                            }

                                            Ext.MessageBox.show({
                                                title: 'Ecommerce',
                                                msg: '¿Estas seguro que deseas eliminar el pedido ' + record.data.ecomid + ' ?',
                                                buttons: Ext.MessageBox.OKCANCEL,
                                                icon: Ext.MessageBox.QUESTION,
                                                fn: function (btn) {
                                                    if (btn === 'ok') {
                                                        var rowData = record.data.ecomid;
                                                        var dteestatus = record.data.estatusecom;

                                                        var nuevoObjeto = {
                                                            ecomid: rowData,
                                                            estatusecom: dteestatus
                                                        };

                                                        EcommerceUtils.EliminarPedido(Ext.JSON.encode(nuevoObjeto));
                                                    }
                                                }
                                            });
                                        }
                                    }
                                ]
                            }


                        ]
                    },

                    bbar: {
                        xtype: 'pagingtoolbar',
                        store: me.storeEcommerce,
                        displayInfo: true,
                        displayMsg: 'Mostrando pedidos {0} - {1} de {2}',
                        emptyMsg: 'No hay pedidos'
                    },
                    listeners: {
                        rowdblclick: function (editor, e, eOpts) {
                            var grid = Ext.getCmp('gridEcommerce'); // or e.grid
                            var cvEcom = grid.getSelectionModel().getLastSelected().get('ecomid');

                            EcommerceUtils.detalleEcommerce(cvEcom);
                        },
                        edit: function (editor, e) {
                            e.record.commit();

                        },
                        afterrender: function (grid) {

                            if (grid.isVisible() && !grid.isSearchExecuted) {
                                grid.isSearchExecuted = true; // Marca que la búsqueda se ha ejecutado
                                EcommerceUtils.BtnBusqEcommerce();
                            }
                        }
                    }
                }]
        });

        function formatearFechaCorta(value) {
            if (value) {
                let date = new Date(value);
                return Ext.Date.format(date, 'd/m/Y');
            } else {
                return value;
            }
        }

        function formatearHora(value) {
            if (!value)
                return value;

            // value = "100923" o 100923
            value = value.toString().padStart(6, '0');

            var h = value.substring(0, 2);
            var m = value.substring(2, 4);
            var s = value.substring(4, 6);

            return h + ':' + m + ':' + s;
        }



        function formatearFechaLarga(value) {
            if (value) {
                let date = new Date(value);
                return Ext.Date.format(date, 'd/m/Y H:i:s');
            } else {
                return value;
            }
        }



        me.callParent(arguments);
    }
});

