Ext.define('EcommerceUtils', {
    singleton: true,

    BtnBusqEcommerce: function () {
        
        var idEstatusEcom= Ext.getCmp('idCmbEstatusEcom').getValue();
        const param = {
            busqBnd: 1,
            estatus:idEstatusEcom
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

    detalleEcommerce: function (clave) {

        Ext.require('Modulos.global.FormPanelEcommerceDet', function () {
            var win = Ext.create('Ext.window.Window', {
                id: 'winPaneldetalleEcommerce',
                title: 'Detalle Pedido',
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

            win.setSize(Ext.getBody().getViewSize());
            win.show();
        });
    },

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
                'deliverydate',

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
                'processingdate',
                'processingtime',
                'userprogram',
                'estatusecom',

                'direccion'
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
                {codigo: 'A', descripcion: 'Activo'},
                {codigo: 'S', descripcion: 'Surtido'},
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
                                            id: "idCmbEstatusEcom",
                                            name: "cmbEstatusEcom",
                                            fieldLabel: 'Estatus',
                                            flex: 1,
                                            width: 300,
                                            store: storeEstatusEcom,
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
                    id: 'gridEcommerce',
                    store: me.storeEcommerce,
                    flex: 1,
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
                        }
                    ],

                    columns: {
                        defaults: {
                            filter: {type: 'string'},
                            align: 'center'
                        },
                        items: [
                            {xtype: 'rownumberer', text: '#', flex: 0.5},

                            /* ====== VISIBLES ====== */
                            {text: 'Holding', dataIndex: 'holding', flex: 1},
                            {text: 'Cliente', dataIndex: 'customer', flex: 1},
                            {text: 'Cliente neutral', dataIndex: 'neutralcustomer', flex: 1},
                            {text: 'Orden', dataIndex: 'ordernumber', flex: 1},
                            {text: 'Fecha entrega', dataIndex: 'deliverydate', flex: 1},

                            {text: 'Shipper', dataIndex: 'shippername1', flex: 1},
                            {text: 'Tipo envío', dataIndex: 'shippingtype', flex: 1},

                            {text: 'Receptor #', dataIndex: 'receivernumber', flex: 1},
                            {text: 'Receptor nombre', dataIndex: 'receivername1', flex: 1},
                            {text: 'ZIP receptor', dataIndex: 'receiverzip', flex: 1},
                            {text: 'Ciudad receptor', dataIndex: 'receivertown', flex: 1},

                            {text: 'Fecha proceso', dataIndex: 'processingdate', flex: 1},
                            {text: 'Hora proceso', dataIndex: 'processingtime', flex: 1},
                            {text: 'Programa', dataIndex: 'userprogram', flex: 1},
                            {text: 'Estatus', dataIndex: 'estatusecom', flex: 1},

                            {text: 'Dirección', dataIndex: 'direccion', flex: 2},

                            /* ====== OCULTOS ====== */
                            {text: 'Shipper 2', dataIndex: 'shippername2', hidden: true},
                            {text: 'Shipper 3', dataIndex: 'shippername3', hidden: true},
                            {text: 'Calle shipper', dataIndex: 'shipperstreet', hidden: true},
                            {text: 'País shipper', dataIndex: 'shippercountry', hidden: true},
                            {text: 'ZIP shipper', dataIndex: 'shipperzip', hidden: true},
                            {text: 'Ciudad shipper', dataIndex: 'shippertown', hidden: true},
                            {text: 'Email shipper', dataIndex: 'shipperemail', hidden: true},

                            {text: 'Receptor 2', dataIndex: 'receivername2', hidden: true},
                            {text: 'Receptor 3', dataIndex: 'receivername3', hidden: true},
                            {text: 'Calle receptor', dataIndex: 'receiverstreet', hidden: true},
                            {text: 'País receptor', dataIndex: 'receivercountry', hidden: true},
                            {text: 'Tel receptor', dataIndex: 'receiverphone', hidden: true},
                            {text: 'Email receptor', dataIndex: 'receiveremail', hidden: true},
                            {text: 'ILN receptor', dataIndex: 'receiveriln', hidden: true},

                            {text: 'Pagador flete', dataIndex: 'freightpayer', hidden: true},
                            {text: 'Fecha fija', dataIndex: 'fixeddate', hidden: true},
                            {text: 'Hora fija', dataIndex: 'fixedtime', hidden: true},
                            {text: 'Tipo fecha fija', dataIndex: 'fixeddatetype', hidden: true},
                            {text: 'Altura pallet', dataIndex: 'palletheight', hidden: true},
                            {text: 'Valor mercancía', dataIndex: 'goodsvalue', hidden: true},
                            {text: 'Estatus proceso', dataIndex: 'processingstatus', hidden: true},
                            {
                                xtype: 'actioncolumn',
                                text: "STDRUEAP",
                                align: 'center',
                                width: 100,
                                items: [
                                    {
                                        iconCls: 'icn-detalles',
                                        tooltip: 'Generar STDRUEAP',
                                        handler: function (grid, rowIndex, colIndex) {
                                            const rec = grid.getStore().getAt(rowIndex);
                                            const ecomid = rec.get('ecomid');

                                            Ext.Ajax.request({
                                                url: contexto + '/Ecommerce',
                                                method: 'POST',
                                                params: {
                                                    busqBnd: 3,
                                                    ecomid: ecomid
                                                },
                                                success: function (resp) {
                                                    Ext.Msg.alert('OK', 'Archivo STDRUEAP generado correctamente');
                                                },
                                                failure: function () {
                                                    Ext.Msg.alert('Error', 'No se pudo generar el STDRUEAP');
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

                        }
                    }
                }]
        });

        me.callParent(arguments);
    }
});

