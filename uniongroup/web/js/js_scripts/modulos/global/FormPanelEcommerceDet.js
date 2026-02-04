/* 
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/ClientSide/javascript.js to edit this template
 */

Ext.define('FormPanelEcommerceDetUtils', {
    singleton: true,

    actualizarGrid: function (clave) {

        param = {
            clave: clave,
            busqBnd: 2
        };

        var grd = Ext.getCmp("gridEcommerceDet");
        var store = grd.getStore();
        store.removeAll(true);
        store.reload({
            params: param
        });

    }






});





Ext.define('Modulos.global.FormPanelEcommerceDet', {
    extend: 'Ext.container.Container',
    alias: 'widget.FormPanelEcommerceDet',

    layout: {
        type: 'vbox',
        align: 'stretch'
    },

    requires: [
        'Ext.grid.Panel',
        'Ext.container.Container',
        'Ext.data.Store',
        'FormPanelEcommerceDetUtils'
    ],

    initComponent: function () {
        var me = this;

        var claveEcom = me.cveEcom;

        /* =======================
         MODEL
         ======================= */
        if (!Ext.ClassManager.get('modelEcomLine')) {
            Ext.define('modelEcomLine', {
                extend: 'Ext.data.Model',
                fields: [
                    'customer',
                    'neutralcustomer',
                    'ordernumber',
                    'orderline',
                    'deliverynote',
                    'deliveryline',
                    'customerreference',
                    'itemnumber',
                    'customeritemnumber',
                    'customeritemtext',
                    'unit',
                    'storagelocation',
                    'quantity',
                    'batch',
                    'qualitykey',
                    'variant',
                    'goodscode',
                    'serial',
                    'sscc',
                    'processingstatus',
                    'processingdate',
                    'processingtime',
                    'user',
                    'requestedquantity',
                    'ean'
                ]
            });
        }

        /* =======================
         STORE
         ======================= */
        me.storeEcomLines = Ext.create('Ext.data.Store', {
            model: 'modelEcomLine',
            autoLoad: false,
            proxy: {
                type: 'ajax',
                url: contexto + '/Ecommerce',
                reader: {
                    type: 'json',
                    rootProperty: '' // arreglo directo
                }
            }
        });

        /* =======================
         GRID
         ======================= */
        var grid = Ext.create('Ext.grid.Panel', {
            title: 'Ecommerce Lines',
            store: me.storeEcomLines,
            flex: 1,
            id: 'gridEcommerceDet',
            
            tbar: {
                items: [
                    
                    {
                        xtype: 'button',
                        text: 'Regresar',
                        iconCls: 'icn-back',
                        //width: 90,
                        arrowAlign: 'center',
                        handler: function () {
                            this.up('window').destroy();
                        },
                        listeners: {
                                afterrender: function (btn) {
                                    addTooltip(btn, 'Regresar');
                                }
                            }
                    }



                ]},

            columns: [
                /* ===== VISIBLES (CON VALOR) ===== */
                { text: 'customer', dataIndex: 'customer', flex: 1 },
                { text: 'neutralcustomer', dataIndex: 'neutralcustomer', flex: 1 },
                { text: 'ordernumber', dataIndex: 'ordernumber', flex: 1 },
                { text: 'orderline', dataIndex: 'orderline', flex: 1 },
                { text: 'deliveryline', dataIndex: 'deliveryline', flex: 1 },
                { text: 'itemnumber', dataIndex: 'itemnumber', flex: 1 },
                { text: 'quantity', dataIndex: 'quantity', flex: 1 },
                { text: 'processingdate', dataIndex: 'processingdate', flex: 1 },
                { text: 'processingtime', dataIndex: 'processingtime', flex: 1 },
                { text: 'user', dataIndex: 'user', flex: 1 },
                { text: 'requestedquantity', dataIndex: 'requestedquantity', flex: 1 },
                { text: 'ean', dataIndex: 'ean', flex: 1 },

                /* ===== OCULTOS (SIN VALOR EN EJEMPLO) ===== */
                { text: 'deliverynote', dataIndex: 'deliverynote', hidden: true },
                { text: 'customerreference', dataIndex: 'customerreference', hidden: true },
                { text: 'customeritemnumber', dataIndex: 'customeritemnumber', hidden: true },
                { text: 'customeritemtext', dataIndex: 'customeritemtext', hidden: true },
                { text: 'unit', dataIndex: 'unit', hidden: true },
                { text: 'storagelocation', dataIndex: 'storagelocation', hidden: true },
                { text: 'batch', dataIndex: 'batch', hidden: true },
                { text: 'qualitykey', dataIndex: 'qualitykey', hidden: true },
                { text: 'variant', dataIndex: 'variant', hidden: true },
                { text: 'goodscode', dataIndex: 'goodscode', hidden: true },
                { text: 'serial', dataIndex: 'serial', hidden: true },
                { text: 'sscc', dataIndex: 'sscc', hidden: true },
                { text: 'processingstatus', dataIndex: 'processingstatus', hidden: true }
            ],

            bbar: {
                xtype: 'pagingtoolbar',
                store: me.storeEcomLines,
                displayInfo: true,
                displayMsg: 'Mostrando líneas {0} - {1} de {2}',
                emptyMsg: 'No hay líneas'
            }
        });

        me.items = [grid];

        FormPanelEcommerceDetUtils.actualizarGrid(claveEcom);

        me.callParent(arguments);
    }
});

