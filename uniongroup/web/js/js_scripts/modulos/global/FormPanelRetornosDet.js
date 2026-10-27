/* * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/ClientSide/javascript.js to edit this template
 */


        Ext.define('FormPanelRetornosDetUtils', {
            singleton: true,

            actualizarGrid: function (clave) {

                param = {
                    clave: clave,
                    busqBnd: 5
                };

                var grd = Ext.getCmp("gridRetornosDet");
                var store = grd.getStore();
                store.removeAll(true);
                store.reload({
                    params: param
                });

            }
        });



Ext.define('Modulos.global.FormPanelRetornosDet', {
    extend: 'Ext.container.Container',
    alias: 'widget.FormPanelRetornosDet',

    layout: {
        type: 'vbox',
        align: 'stretch'
    },

    requires: [
        'Ext.grid.Panel',
        'Ext.container.Container',
        'Ext.data.Store',
        'FormPanelRetornosDetUtils'
    ],

    initComponent: function () {
        var me = this;

        var claveRetorno = me.cveRetorno;

        /* =======================
         MODEL
         ======================= */
        if (!Ext.ClassManager.get('modelRetornoDet')) {
            Ext.define('modelRetornoDet', {
                extend: 'Ext.data.Model',
                fields: [
                    'detrnid',
                    'linenum',
                    'itemcode',
                    'quantity',
                    'rtnid',
                    'receivedquantity',
                    'confirmedquantity', // <-- Campo para control de deltas
                    'coms'
                ]
            });
        }

        /* =======================
         STORE
         ======================= */
        me.storeRetornoDet = Ext.create('Ext.data.Store', {
            model: 'modelRetornoDet',
            autoLoad: false,
            proxy: {
                type: 'ajax',
                url: contexto + '/Retornos',
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
            title: 'Detalle Retornos',
            store: me.storeRetornoDet,
            flex: 1,
            id: 'gridRetornosDet',

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
                {
                    text: "#",
                    xtype: "rownumberer",
                    align: "center",
                    width: 50
                },
                {text: 'ID', dataIndex: 'detrnid', width: 90, align: "center"},
                {text: 'Línea', dataIndex: 'linenum', width: 80, align: "center"},
                {text: 'Código de Artículo', dataIndex: 'itemcode', width: 160},
                {text: 'Cant. Pedida', dataIndex: 'quantity', width: 110, align: "right"},
                {text: 'Cant. Recibida', dataIndex: 'receivedquantity', width: 130, align: "right"},
                {
                    text: 'Comentarios',
                    dataIndex: 'coms',
                    flex: 1,
                    minWidth: 250,
                    renderer: function (value, metaData) {
                        metaData.style = "white-space: normal; word-wrap: break-word;";
                        if (value && (value.indexOf('Existencias insuficientes') !== -1 || value.indexOf('no encontrada') !== -1)) {
                            return '<span style="color: #F44336; font-weight: bold;">' + Ext.String.htmlEncode(value) + '</span>';
                        }
                        return Ext.String.htmlEncode(value);
                    }
                },
                {text: 'ID Retorno', dataIndex: 'rtnid', width: 100, align: "center"}
            ],
            viewConfig: {
                stripeRows: true,
                enableTextSelection: true
            },

            bbar: {
                xtype: 'pagingtoolbar',
                store: me.storeRetornoDet,
                displayInfo: true,
                displayMsg: 'Mostrando líneas {0} - {1} de {2}',
                emptyMsg: 'No hay líneas'
            }
        });

        me.items = [grid];

        FormPanelRetornosDetUtils.actualizarGrid(claveRetorno);

        me.callParent(arguments);
    }
});