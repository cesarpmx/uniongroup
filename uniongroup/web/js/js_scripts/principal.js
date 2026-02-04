/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 * author: m@rco.@ndrade
 */
Ext.Loader.setConfig({
    enabled: true,
    disableCaching: true
});

// Rutas
Ext.Loader.setPath('Ext.ux', contexto + '/js/build7/packages/ux');
Ext.Loader.setPath('Modulos', contexto + '/js/js_scripts/modulos');
Ext.Loader.setPath('Modulos.global', contexto + '/js/js_scripts/modulos/global');


Ext.require([
    'Ext.tip.QuickTipManager',
    'Ext.container.Viewport',
    'Ext.layout.*',
    'Ext.form.*',
    'Ext.grid.*',
    'Ext.data.*',
    'Ext.tree.*',
    'Ext.selection.*',
    'Ext.tab.Panel',
    'Ext.ux.layout.Center',
    'Ext.util.*',
    'Ext.state.*'
]);

Ext.onReady(function () {
    // Guardar en localStorage el m?ximo de d?as atr?s
    localStorage.setItem('diasAtras', 10000);
    Ext.util.Format.thousandSeparator = ',';
    Ext.util.Format.decimalSeparator = '.';

    // Crear el viewport principal
    Ext.create('Ext.container.Viewport', {
        layout: 'border',
        items: [

            // Toolbar superior
            Ext.create('Ext.toolbar.Toolbar', {
                region: 'north',
                height: 85,
                items: [
                    {
                        xtype: 'button',
                        iconCls: 'icn-menu',
                        cls: 'x-btn-menu-rail',
                        handler: function () {
                            var sidebar = Ext.getCmp('tree-panel');
                            if (sidebar.collapsed) {
                                sidebar.setDisabled(false); // Habilitar antes de expandir
                                sidebar.expand();
                            } else {
                                sidebar.collapse();
                            }
                        },
                        listeners: {
                            render: function (button) {
                                Ext.create('Ext.tip.ToolTip', {
                                    target: button.getEl(),
                                    html: 'Abrir/Cerrar Men&uacute;',
                                    trackMouse: true
                                });
                            }
                        }
                    },
                    '<img src="' + contexto + '/img/GL_72.jpg" width="77" height="77">',
                    '->',
                    Scriptjs[0], // Usuario:
                    Scriptjs[1], // Correo del usuario
                    {
                        xtype: 'button',
                        iconCls: 'icn-usr',
                        scale: 'small',
                        handler: formRecuperar,
                        listeners: {
                            render: function (button) {
                                Ext.create('Ext.tip.ToolTip', {
                                    target: button.getEl(),
                                    html: 'Actualizar Contrase&oacute;a',
                                    trackMouse: true
                                });
                            }
                        }
                    },
                    {
                        xtype: 'button',
                        text: 'Salir',
                        iconCls: 'icn-regresar',
                        scale: 'small',
                        handler: closeSession
                    }
                ]
            }),

            // Panel de m?dulos (men?)
            Ext.create('Ext.tree.Panel', {
                id: 'tree-panel',
                title: 'M&oacute;dulos',
                region: 'west',
                split: true,
                width: 250,
                rootVisible: false,
                autoScroll: true,
                collapsible: true,
                collapsed: true, // Escondido por defecto
                animCollapse: true,
                collapseFirst: true,
                collapseMode: 'mini',
                margins: '0 0 0 5',
                useArrows: true,
                lines: false,
                singleExpand: true, // Solo un nodo padre expandido a la vez (accordion)
                store: store
            }),

            // Panel central din?mico
            Ext.create('Ext.Container', {
                id: 'content-panel',
                layout: 'card',
                region: 'center',
                margins: '2 5 5 0',
                activeItem: 0,
                border: false,
                items: [] // ?Din?mico!
            }),

            // Pie de p?gina
            Ext.create('Ext.toolbar.Toolbar', {
                region: 'south',
                height: 32,
                items: [
                    '->',
                    {
                        xtype: 'label',
                        html: 'Centro de Informaci&oacute;n Argo (CIA) Ver. 3.0 - Copyright @ 2023.',
                        style: 'color:#fff;font-family:Inter,Segoe UI,Roboto,Arial,sans-serif;font-size:13px;font-weight:500;'
                    },
                    '-',
                    '<a href="https://www.concir.com/" target="_blank"><img src="' + contexto + '/img/CONCIRBlanco.png" width="78.4" height="26.7"></a>',
                    '-'
                ]
            })
        ],
        renderTo: Ext.getBody()
    });

    // Evento de selecci?n del ?rbol

    var MODULOS_MAP = {
        501: 'Modulos.global.PanelProductos',
        502: 'Modulos.global.PanelConsignatarios',
        503: 'Modulos.global.PanelOrdenesCompra',
        504: 'Modulos.global.PanelOrdenesVenta',
        505: 'Modulos.global.PanelTransferenciasEntrada',
        506: 'Modulos.global.PanelTransferenciasSalida',
        507: 'Modulos.global.PanelRetornos',
        508: 'Modulos.global.PanelEcommerce'
    };

    var treePanel = Ext.getCmp('tree-panel');

    treePanel.getSelectionModel().on('select', function (selModel, record) {

        if (!record.get('leaf')) {
            return;
        }

        var idRecord = record.getId();
        var idModulo = 'idMenu' + idRecord;
        var panel = Ext.getCmp(idModulo);

        if (!panel) {

            var archivo = MODULOS_MAP[idRecord];

            if (!archivo) {
                console.warn('No hay módulo definido para el id:', idRecord);
                return;
            }

            localStorage.setItem('miGlobalVariable', idRecord);

            Ext.require(archivo, function () {
                var nuevoPanel = Ext.create(archivo, {
                    id: idModulo
                });

                var content = Ext.getCmp('content-panel');
                content.add(nuevoPanel);
                content.getLayout().setActiveItem(nuevoPanel);

                inhabilitar();
            });

        } else {
            Ext.getCmp('content-panel').getLayout().setActiveItem(panel);
            inhabilitar();
        }

        treePanel.getSelectionModel().deselectAll(true);
    });



    Ext.require('Modulos.home', function () {
        var panel = Ext.create('Modulos.home', {
            id: 'start-panel'
        });

        Ext.getCmp('content-panel').add(panel);
        Ext.getCmp('content-panel').getLayout().setActiveItem(panel);
    });

});

var store = Ext.create('Ext.data.TreeStore', {
    root: {
        expanded: true
    },
    proxy: {
        type: 'ajax',
        url: contexto + '/Usuario?bnd=3'
    },
    folderSort: true
});


function closeSession() {
    Ext.MessageBox.show({
        title: 'Salir',
        msg: '&iquest;Desea cerrar la sesi&oacute;n?',
        buttons: Ext.MessageBox.YESNO,
        fn: function (btn) {
            if (btn == 'no') {
            }
            if (btn == 'yes') {
                Ext.MessageBox.show({
                    msg: 'Cerrando la sesi&acute;n, espere por favor...',
                    progressText: 'Guardando...',
                    width: 300,
                    wait: true,
                    waitConfig: {
                        interval: 200
                    },
                    icon: 'ext-mb-download', //custom class in msg-box.html
                    animEl: 'mb7'
                });
                goToUrl(contexto + '/CerrarSesion');
            }
        },
        icon: Ext.MessageBox.QUESTION
    });
}

var coorX = 0;
var coorY = 0;
var toltip = null;

function formRecuperar() {
    Ext.create('Ext.window.Window', {
        title: 'Actualizar Contrase&ntilde;a',
        id: 'FormOlvidarContra',
        modal: true,
        closable: false, // Permite cerrar la ventana
        closeAction: 'destroy',
        height: 230,
        width: 500,
        maxWidth: 500,
        maxHeight: 230,
        //scrollable: 'horizontal',
        constrain: true,
        resizable: false,
        layout: 'fit',
        items: [{
                xtype: 'form',
                id: 'pnlRecuperar',
                bodyPadding: 10,
                defaults: {
                    anchor: '100%',
                    labelWidth: 130,
                    padding: 5,
                    border: true
                },
                // Configuraci?n del formulario
                items: [
                    {
                        xtype: 'fieldset',
                        //title: 'Datos del Servicio',
                        layout: 'vbox',
                        style: {
                            border: 'none', // Esto quita el borde del fieldset
                            'border-top': '1px solid #ffffff !important'
                        },
                        defaults: {
                            width: '100%',
                            layout: 'hbox',
                            margin: '0 0 5 0',
                            border: false
                        },
                        items: [
                            {
                                margin: '0 0 20 0',
                                items: [
                                    {
                                        xtype: 'textfield',
                                        fieldLabel: 'Contrase&ntilde;a Actual',
                                        inputType: 'password',
                                        id: 'actualPass',
                                        name: 'usupassword',
                                        labelWidth: 130,
                                        width: '100%',
                                        readOnly: false,
                                        allowBlank: false,
//                                        vtype: 'email'
                                    }
                                ]
                            },
                            {
                                items: [{
                                        xtype: 'textfield',
                                        fieldLabel: 'Nueva Contrase&ntilde;a',
                                        id: 'nuevaPass',
                                        name: 'usupasswordNvo',
                                        inputType: 'password',
                                        labelWidth: 130,
                                        width: '100%',
                                        allowBlank: false,
                                        validator: function (value) {
                                            const regex = /^(?=.*[0-9])(?=.*[@$!%*?&=])[A-Za-z\d@$!%*?&=]{8,}$/;
                                            return regex.test(value)
                                                    ? true
                                                    : 'Debe tener al menos 8 caracteres, un n&uacute;mero y un s&iacute;mbolo especial (@$!%*?&=)';
                                        }
                                    }]
                            },
                            {
                                items: [{
                                        xtype: 'textfield',
                                        fieldLabel: 'Confirmar Contrase&ntilde;a',
                                        inputType: 'password',
                                        labelWidth: 130,
                                        width: '100%',
                                        allowBlank: false,
                                        validator: function (value) {
                                            const form = this.up('form');
                                            const nueva = form.down('[id=nuevaPass]').getValue();
                                            return value === nueva
                                                    ? true
                                                    : 'Las contrase&ntilde;as no coinciden';
                                        }
                                    }]
                            }
                        ]
                    }
                ],
                buttons: [{
                        text: 'Enviar',
                        id: "idBtnRecuperarEntrar",
                        handler: function (btn) {
                            // Obt?n el formulario completo
                            var formPanel = Ext.getCmp('pnlRecuperar');
                            var form = formPanel.getForm(); // Aqu? se obtiene el formulario para usar sus m?todos como isValid()

                            var btnEnviar = Ext.getCmp('idBtnRecuperarEntrar');
                            var btnSalir = Ext.getCmp('idBtnRecuperarSalir');

                            if (form.isValid()) {

                                btnEnviar.setDisabled(true);
                                btnSalir.setDisabled(true);

                                var values = form.getValues();

                                // Convertir a JSON
                                var jsonCarritoFinal = Ext.JSON.encode(values);

                                Ext.Ajax.request({
                                    url: contexto + '/Restablecer',
                                    params: {
                                        bnd: 1,
                                        valores: jsonCarritoFinal,
                                    },
                                    success: function (response) {
                                        var jsonResponse = Ext.decode(response.responseText);
                                        if (jsonResponse.success) {
                                            Ext.Msg.alert('&Eacute;xito', jsonResponse.message);
                                            btn.up('window').close();
                                            goToUrl(contexto + '/CerrarSesion');
                                        } else {
                                            Ext.Msg.alert('Error', jsonResponse.message);
                                        }

                                        btnSalir.setDisabled(false);
                                        btnEnviar.setDisabled(false);
                                    },
                                    failure: function () {
                                        Ext.MessageBox.show({
                                            title: 'Error',
                                            msg: 'Hubo un Error en el Servidor...',
                                            buttons: Ext.MessageBox.CANCEL,
                                            icon: Ext.MessageBox.ERROR
                                        });
                                    }
                                });
                            }
                        }
                    }
                    , {
                        text: 'Cancelar',
                        id: "idBtnRecuperarSalir",
                        handler: function () {
                            Ext.getCmp('FormOlvidarContra').close();
                        }
                    }]
            }]
    }).show();
}

function coordenadasMouse(e) {
    if (!e)
        var e = window.event;
    if (e.pageX || e.pageY) {
        coorX = e.pageX;
        coorY = e.pageY;
    } else if (e.clientX || e.clientY) {
        coorX = e.clientX;
        coorY = e.clientY;
    }
}