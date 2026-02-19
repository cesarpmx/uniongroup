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
    }



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
                "status",
                "FechaInsercion"
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
                            dataIndex: "status",
                            align: "center",
                            width: 150,
                            filter: {type: 'string'},
//                            renderer: function (value) {
//                                // ? Mapeo de códigos a nombres
//                                var estatusMap = {
//                                    'A': 'Activo',
//                                    'C': 'Cerrado',
//                                    'X': 'Cancelado'
//                                            // Agrega los estatus que necesites
//                                };
//
//                                var nombre = estatusMap[value] || value;
//
//                                // ? Opcional: Agregar colores según estatus
//                                var color = '';
//                                switch (value) {
//                                    case 'A':
//                                        color = '#4CAF50';
//                                        break; // Verde
//                                    case 'C':
//                                        color = '#2196F3';
//                                        break; // Azul
//                                    case 'X':
//                                        color = '#F44336';
//                                        break; // Rojo
//                                }
//                                return '<b style="color: ' + color + ';">' + nombre + '</b>';
//                            }
                        },
                        {
                            text: "Doc Entry",
                            dataIndex: "DocEntry",
                            align: "center",
                            width: 150,
                            filter: {type: 'number'}
                        },
                        {
                            text: "Doc Num",
                            dataIndex: "DocNum",
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
                                        RetornosUtils.enviarReceiptConfirm(record);
                                    }
                                }
                            ]
                        },
                    ],
                    listeners: {
                        edit: function (editor, e) {
                            e.record.commit();
                        },
                        rowdblclick: function (grid, record) {
                            RetornosUtils.verLineasOrdenLocal(record);
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