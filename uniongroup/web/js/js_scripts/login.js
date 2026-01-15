/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 * autor: m@rco.@ndr@de
 */

Ext.require([
    'Ext.form.*',
    'Ext.Img',
    'Ext.tree.*',
    'Ext.data.*',
    'Ext.tip.*'
]);

Ext.onReady(function () {
    Ext.QuickTips.init();
    var form = Ext.create('Ext.form.Panel', {
        id: 'formLogin',
        xtype: 'form-login',
        renderTo: 'divLogin',
        frame: true,
        autoSize: true, //modern
        //height: 500,
        width: 370,
        bodyPadding: 35,
        bodyBorder: true,
        //autoHeight: true,
        title: 'Registro de Acceso',
        layout: 'anchor',
        defaults: {
            anchor: '100%'
        },

        items: [
            {
                xtype: 'image',
                align: 'center',
                src: contexto + '/img/GL_72.jpg',
                width: 200,
                height: 300
            },
            {
                xtype: 'textfield',
                name: 'username',
                fieldLabel: 'Usuario',
                emptyText: 'Usuario',
                allowBlank: false,
                enableKeyEvents: true
            }, {
                xtype: 'textfield',
                name: 'password',
                inputType: 'password',
                emptyText: 'Contraseña',
                fieldLabel: 'Contrase&ntilde;a',
                allowBlank: false,
                enableKeyEvents: true,
                cls: 'password'
            },
            {
                xtype: 'component',
                html: '<a href="#" onclick="formRecuperar()" style="display: block; margin-top: 10px; text-align: right;">Restablecer Contraseña</a>'
            }
        ],
        
        buttons: [{
                xtype: 'button',
                id: 'btnEntrar',
                text: 'Enviar',
                width: 95,
                handler: function () {
                    accesar();
                }
            }, {
                xtype: 'button',
                text: 'Limpiar',
                width: 95,
                handler: function () {
                    this.up('form').getForm().reset();
                    Ext.getCmp('btnEntrar').enable();
                }
            }]
    });
});



function formRecuperar() {
    Ext.create('Ext.window.Window', {
        title: 'Restablecer Contraseña',
        id: 'FormOlvidarContra',
        modal: true,
        closable: false, // Permite cerrar la ventana
        closeAction: 'destroy',
        height: 170,
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
                // Configuración del formulario
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
                                items: [
                                    {
                                        xtype: 'textfield',
                                        fieldLabel: 'Usuario',
                                        name: 'usulogin',
                                        labelWidth: 110,
                                        width: '100%',
                                        readOnly: false,
                                        allowBlank: false,
                                    }

                                ]
                            },
                            {
                                items: [
                                    {
                                        xtype: 'textfield',
                                        fieldLabel: 'Correo',
                                        name: 'usucorreo',
                                        labelWidth: 110,
                                        width: '100%',
                                        readOnly: false,
                                        allowBlank: false,
                                        vtype: 'email'
                                    }

                                ]
                            },
                        ]
                    }//fieldSet
                ],
                buttons: [{
                        text: 'Enviar',
                        id: "idBtnRecuperarEntrar",
                        handler: function (btn) {
                            // Obtén el formulario completo
                            var formPanel = Ext.getCmp('pnlRecuperar');
                            var form = formPanel.getForm(); // Aquí se obtiene el formulario para usar sus métodos como isValid()

                            var btnEnviar = Ext.getCmp('idBtnRecuperarEntrar');
                            var btnSalir = Ext.getCmp('idBtnRecuperarSalir');

                            if (form.isValid()) {

                                btnEnviar.setDisabled(true);
                                btnSalir.setDisabled(true);

                                var values = form.getValues(); // Luego obtienes los valores una vez que se valida

                                // Generar el token
                                var token = generarTokenAleatorio();

                                // Agregar el token a los valores del formulario
                                values.usutoken = token;

                                // Convertir a JSON
                                var jsonCarritoFinal = Ext.JSON.encode(values);

                                var correo = values.usucorreo;

                                var newToken = values.usutoken;

                                Ext.Ajax.request({
                                    url: contexto + '/ConfigUsuario',
                                    params: {
                                        bnd: 1,
                                        valores: jsonCarritoFinal,
                                        correo: correo,
                                        _cve: newToken,
                                    },
                                    success: function (response) {
                                        var jsonResponse = Ext.decode(response.responseText);
                                        if (jsonResponse.success) {
                                            Ext.Msg.alert('Éxito', jsonResponse.message);
                                            btn.up('window').close();
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

function generarTokenAleatorio() {
    const longitud = 10;
    const caracteres = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@$!%*?&=";
    let token = "";

    for (let i = 0; i < longitud; i++) {
        token += caracteres.charAt(Math.floor(Math.random() * caracteres.length));
    }

    // Asegurar que tiene al menos un número y un símbolo especial
    const numeros = "0123456789";
    const simbolos = "@$!%*?&=";

    if (!/\d/.test(token)) {
        token = token.substring(0, token.length - 1) + numeros.charAt(Math.floor(Math.random() * numeros.length));
    }
    if (!/[!@#$%^&*]/.test(token)) {
        token = token.substring(0, token.length - 1) + simbolos.charAt(Math.floor(Math.random() * simbolos.length));
    }

    return token;
}

function accesar() {
    var form = Ext.getCmp('formLogin').getForm();
    if (form.isValid()) {
        Ext.getCmp('btnEntrar').disable();
        form.submit({
            clientValidation: true,
            url: contexto + '/Usuario?bnd=1',
            success: function (form, action) {
                var dir = action.result.url;
                var user = action.result.usua;
//                alert(user);
//                window.location =  contexto+dir;
                document.getElementById("usuario").value = user;
                document.formLog.submit();
            },
            failure: function (form, action) {
//                var msg1 = "";
//                console.log(form);
//                msg1 = action.result.message;
//                Ext.Msg.show({
//                    title: 'Datos Incorrectos',
//                    msg: msg1,
//                    buttons: Ext.MessageBox.OK,
//                    icon: Ext.MessageBox.WARNING
//                });

                var msg1 = "";
                if (action.result && action.result.message) {
                    msg1 = action.result.message;
                } else {
                    msg1 = "Error desconocido";
                }
                Ext.Msg.show({
                    title: 'Datos Incorrectos',
                    msg: msg1,
                    buttons: Ext.MessageBox.OK,
                    icon: Ext.MessageBox.WARNING
                });
                var btnEnviar = Ext.getCmp('btnEntrar');
                btnEnviar.setDisabled(false);
            }
        });
    } else {
        Ext.Msg.show({
            title: 'Datos Incompletos',
            msg: 'Debe completar todos los datos',
            buttons: Ext.MessageBox.OK,
            icon: Ext.MessageBox.WARNING
        });
    }
}