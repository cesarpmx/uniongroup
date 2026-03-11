/* 
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/ClientSide/javascript.js to edit this template
 */

Ext.define('NuevosRetornosUtils', {
    singleton: true,

    guardarNuevosRetornos: function (selectedRecords) {

        var retornosAGuardar = selectedRecords || [];
        var totalSeleccionados = retornosAGuardar.length;

        Ext.MessageBox.confirm(
                'Confirmar',
                '¿Está seguro de cargar ' + totalSeleccionados + ' retorno(s)?',
                function (btn) {

                    if (btn !== 'yes')
                        return;

                    Ext.getBody().mask('Obteniendo retornos...');

                    var retornosHeader = [];

                    Ext.Array.each(retornosAGuardar, function (record) {
                        retornosHeader.push({
                            DocEntry: record.get('DocEntry'),
                            DocNum: record.get('DocNum'),
                            DocDate: record.get('DocDate'),
                            CardCode: record.get('CardCode'),
                            Memo: record.get('Memo'),
                            Warehouse: record.get('Warehouse')
                        });
                    });

                    if (retornosHeader.length === 0) {
                        Ext.getBody().unmask();
                        Ext.Msg.alert('Información', 'No hay retornos para procesar');
                        return;
                    }

                    var promises = [];
                    var retornosCompletos = [];

                    retornosHeader.forEach(function (retorno) {

                        promises.push(
                                new Promise(function (resolve, reject) {

                                    Ext.Ajax.request({
                                        url: contexto + '/Retornos',
                                        method: 'POST',
                                        params: {
                                            busqBnd: 2,
                                            docEntry: retorno.DocEntry
                                        },
                                        success: function (responseLineas) {

                                            var lineas = Ext.decode(responseLineas.responseText) || [];


                                            retornosCompletos.push({
                                                ReturnRequest: {
                                                    DocEntry: retorno.DocEntry,
                                                    DocNum: retorno.DocNum,
                                                    DocDate: Ext.Date.format(
                                                            new Date(retorno.DocDate),
                                                            'Y-m-d\\TH:i:s'
                                                            ),
                                                    CardCode: retorno.CardCode,
                                                    Status: retorno.Status,
                                                    Memo: retorno.Memo,
                                                    Warehouse:retorno.Warehouse
                                                },
                                                ReturnLines: lineas
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

                    Promise.all(promises).then(function () {
                        Ext.getBody().unmask();
                        NuevosRetornosUtils.iniciarEnvioPorLotes(retornosCompletos);
                    }).catch(function () {
                        Ext.getBody().unmask();
                        Ext.Msg.alert('Error', 'Error al obtener las líneas de los retornos');
                    });

                }
        );
    },

    iniciarEnvioPorLotes: function (allReturns) {

        var me = this,
                loteSize = 10,
                totalReturns = allReturns.length,
                confirmadosGlobal = [],
                erroresGlobal = [],
                index = 0;

        var progressWin = Ext.create('Ext.window.Window', {
            title: 'Guardando Retornos',
            width: 400,
            height: 160,
            modal: true,
            closable: false,
            layout: 'vbox',
            bodyPadding: 20,
            items: [
                {xtype: 'label', id: 'lblProgresoRetornos', text: 'Iniciando...', margin: '0 0 10 0'},
                {xtype: 'progressbar', id: 'barProgresoRetornos', width: '100%'}
            ]
        });

        progressWin.show();

        function enviarSiguienteLote() {

            var fin = Math.min(index + loteSize, totalReturns),
                    loteActual = allReturns.slice(index, fin);

            var payload = {
                returns: loteActual
            };

            var jsonToSend = Ext.encode(payload);

            var pct = index / totalReturns;

            Ext.getCmp('lblProgresoRetornos')
                    .setText('Procesando: ' + (index + 1) + ' - ' + fin + ' de ' + totalReturns);

            Ext.getCmp('barProgresoRetornos').updateProgress(pct);

            Ext.Ajax.request({
                url: contexto + '/Retornos',
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
                        index += loteSize;
                        if (index < totalReturns) {
                            enviarSiguienteLote();
                        } else {
                            progressWin.close();
                            me.mostrarResultados(confirmadosGlobal, erroresGlobal);
                        }
                        return;
                    }

                    if (resultado.success && resultado.results) {

                        Ext.Array.each(resultado.results, function (item) {

                            var row = {
                                DocEntry: item.DocEntry,
                                RTNID: item.RTNID || '',
                                fecha: item.RecordDate,
                                linesInserted: item.linesInserted || 0,
                                linesFailed: item.linesFailed || 0,
                                mensaje: item.status === 'inserted'
                                        ? 'OK'
                                        : item.message
                            };

                            if (item.status === 'inserted') {
                                confirmadosGlobal.push(row);
                            } else {
                                erroresGlobal.push(row);
                            }

                        });
                    }

                    index += loteSize;

                    if (index < totalReturns) {
                        enviarSiguienteLote();
                    } else {
                        progressWin.close();
                        me.mostrarResultados(confirmadosGlobal, erroresGlobal);
                    }
                },
                failure: function () {
                    index += loteSize;
                    if (index < totalReturns) {
                        enviarSiguienteLote();
                    } else {
                        progressWin.close();
                        me.mostrarResultados(confirmadosGlobal, erroresGlobal);
                    }
                }
            });
        }

        enviarSiguienteLote();
    },

    mostrarResultados: function (confirmData, noConfirmData) {

        if (!Ext.ClassManager.get('ResultadoRetornosModel')) {
            Ext.define('ResultadoRetornosModel', {
                extend: 'Ext.data.Model',
                fields: [
                    'DocEntry',
                    'RTNID',
                    'fecha',
                    'linesInserted',
                    'linesFailed',
                    'mensaje'
                ]
            });
        }

        var storeConfirm = Ext.create('Ext.data.Store', {
            model: 'ResultadoRetornosModel',
            data: confirmData
        });

        var storeNoConfirm = Ext.create('Ext.data.Store', {
            model: 'ResultadoRetornosModel',
            data: noConfirmData
        });

        Ext.create('Ext.window.Window', {
            title: 'Resultados - Retornos',
            width: 900,
            height: 500,
            modal: true,
            layout: 'fit',
            items: [{
                    xtype: 'tabpanel',
                    items: [
                        {
                            title: 'Éxitos (' + confirmData.length + ')',
                            layout: 'fit',
                            items: [{
                                    xtype: 'grid',
                                    store: storeConfirm,
                                    columns: [
                                        {xtype: 'rownumberer', width: 50},
                                        {text: 'RTNID', dataIndex: 'RTNID', width: 80},
                                        {text: 'DocEntry', dataIndex: 'DocEntry', width: 120},
                                        {
                                            text: 'Líneas OK',
                                            dataIndex: 'linesInserted',
                                            width: 100,
                                            renderer: v => '<b style="color:green;">' + v + '</b>'
                                        },
                                        {
                                            text: 'Líneas Error',
                                            dataIndex: 'linesFailed',
                                            width: 120,
                                            renderer: v => v > 0
                                                        ? '<b style="color:red;">' + v + '</b>'
                                                        : v
                                        },
                                        {text: 'Fecha', dataIndex: 'fecha', flex: 1}
                                    ]
                                }]
                        },
                        {
                            title: 'Errores (' + noConfirmData.length + ')',
                            layout: 'fit',
                            items: [{
                                    xtype: 'grid',
                                    store: storeNoConfirm,
                                    columns: [
                                        {xtype: 'rownumberer', width: 50},
                                        {text: 'DocEntry', dataIndex: 'DocEntry', width: 120},
                                        {
                                            text: 'Error',
                                            dataIndex: 'mensaje',
                                            flex: 1,
                                            renderer: v => '<span style="color:red;">' + v + '</span>'
                                        }
                                    ]
                                }]
                        }
                    ]
                }]
        }).show();
    },

    verLineasRetorno: function (record) {

        var docEntry = record.get('DocEntry');
        var docNum = record.get('DocNum');

        if (!Ext.ClassManager.get('modelLineasRetorno')) {
            Ext.define('modelLineasRetorno', {
                extend: 'Ext.data.Model',
                fields: [
                    {name: 'LineNum', type: 'int'},
                    'ItemCode','BarCode',
                    {name: 'Quantity', type: 'number'}
                ]
            });
        }

        var storeLineas = Ext.create('Ext.data.Store', {
            model: 'modelLineasRetorno',
            autoLoad: true,
            proxy: {
                type: 'ajax',
                url: contexto + '/Retornos',
                extraParams: {
                    busqBnd: 2,
                    docEntry: docEntry
                },
                reader: {
                    type: 'json',
                    rootProperty: 'items'
                }
            }
        });

        Ext.create('Ext.window.Window', {
            title: 'Lineas Retorno #' + docNum,
            width: 800,
            height: 450,
            modal: true,
            layout: 'fit',
            items: [{
                    xtype: 'grid',
                    store: storeLineas,
                    columns: [
                        {xtype: 'rownumberer', width: 50},
                        {text: 'LineNum', dataIndex: 'LineNum', width: 100},
                        {text: 'ItemCode', dataIndex: 'ItemCode', flex: 1},
                        {text: 'BarCode', dataIndex: 'BarCode', flex: 1},
                        {
                            text: 'Quantity',
                            dataIndex: 'Quantity',
                            width: 120,
                            align: 'right',
                            renderer: function (v) {
                                return '<b style="color:#4CAF50;">' +
                                        Ext.util.Format.number(v, '0,000') +
                                        '</b>';
                            }
                        }
                    ]
                }]
        }).show();
    }
});




Ext.define('Modulos.global.FormNuevosRetornos', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.FormNuevosRetornos',
    requires: ['NuevosRetornosUtils'],
    layout: 'fit',

    initComponent: function () {
        var me = this;

        // ? MODELO HEADER
        if (!Ext.ClassManager.get('modelNuevosRetornosHeader')) {
            Ext.define('modelNuevosRetornosHeader', {
                extend: 'Ext.data.Model',
                fields: [
                    {name: 'id', type: 'int'},
                    {name: 'DocEntry', type: 'int'},
                    'DocNum',
                    'DocDate',
                    'CardCode',
                    'Memo',
                    'Status',
                    'Warehouse',
                    {name: 'TotalLines', type: 'int'}
                ]
            });
        }

        // ? STORE HEADER
        me.storeNuevosRetornos = Ext.create('Ext.data.Store', {
            model: 'modelNuevosRetornosHeader',
            autoLoad: true,
            proxy: {
                type: 'ajax',
                url: contexto + '/Retornos',
                extraParams: {
                    busqBnd: 1
                },
                reader: {
                    type: 'json',
                    rootProperty: 'items',
                    totalProperty: 'total'
                }
            }
        });

        Ext.apply(me, {
            items: [
                {
                    xtype: 'grid',
                    store: me.storeNuevosRetornos,

                    // ? CHECKBOX MODEL
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
                                    Ext.Msg.alert('Atención', 'Debe seleccionar al menos un retorno');
                                    return;
                                }

                                NuevosRetornosUtils.guardarNuevosRetornos(selected);
                            }
                        },
                        '->',
                        {
                            xtype: 'displayfield',
                            id: 'lblSeleccionadasRetornos',
                            value: '<b>Seleccionadas: 0</b>',
                            fieldStyle: 'font-size:13px; color:#FF9800;'
                        },
                        {
                            xtype: 'button',
                            text: 'Recargar',
                            iconCls: 'icn-refresh',
                            handler: function () {
                                me.storeNuevosRetornos.reload();
                            }
                        }
                    ],

                    columns: [
                        {xtype: 'rownumberer', width: 50},

                        {
                            text: 'DocNum',
                            dataIndex: 'DocNum',
                            width: 150,
                            align: 'center',
                            filter: {type: 'string'}
                        },
                        {
                            text: 'Fecha',
                            dataIndex: 'DocDate',
                            width: 120,
                            align: 'center',
                            filter: {type: 'date'},
                            renderer: function (value) {
                                return value
                                        ? Ext.Date.format(new Date(value), 'd/m/Y')
                                        : '';
                            }
                        },
                        {
                            text: 'CardCode',
                            dataIndex: 'CardCode',
                            flex: 1,
                            filter: {type: 'string'}
                        },
                        {
                            text: 'Status',
                            dataIndex: 'Status',
                            flex: 1,
                            filter: {type: 'string'}
                        },
                        {
                            text: 'Total Líneas',
                            dataIndex: 'TotalLines',
                            width: 120,
                            align: 'center',
                            filter: {type: 'number'},
                            renderer: function (value) {
                                return '<b style="color:#2196F3;">' + value + '</b>';
                            }
                        },
                        {
                            text: 'Memo',
                            dataIndex: 'Memo',
                            flex: 1,
                            filter: {type: 'string'}
                        },
                        {
                            text: 'Warehouse',
                            dataIndex: 'Warehouse',
                            flex: 1,
                            filter: {type: 'string'}
                        }
                    ],

                    listeners: {

                        // ? CONTADOR DINÁMICO
                        selectionchange: function (selModel, selected) {
                            var lbl = Ext.getCmp('lblSeleccionadasRetornos');
                            if (lbl) {
                                lbl.setValue('<b>Seleccionadas: ' + selected.length + '</b>');
                            }
                        },

                        rowdblclick: function (grid, record) {
                            NuevosRetornosUtils.verLineasRetorno(record);
                        }
                    }
                }
            ]
        });

        me.callParent(arguments);
    }
});
