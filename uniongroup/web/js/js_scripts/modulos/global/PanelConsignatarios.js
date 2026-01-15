/* 
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/JSP_Servlet/JavaScript.js to edit this template
 */

Ext.define('NotaCreditoUtils', {
    singleton: true,
    NotaCredito: function (cveCen, gridEstatus) {
        let idCmbEmpresa = "";
        let idCmbAlmacen = "";
        if (
                Ext.getCmp("idCntNotCredEmpresa").getRawValue() === "" ||
                Ext.getCmp("idCntNotCredAlmacen").getRawValue() === ""
                ) {
            Ext.MessageBox.show({
                title: "Datos Incompletos",
                msg: "Debe Seleccionar alguna empresa para dar de alta una nueva Orden.",
                buttons: Ext.MessageBox.OK,
                icon: Ext.MessageBox.INFO,
            });
            return;
        }

        idCmbEmpresa = Ext.getCmp("idCntNotCredEmpresa").getValue();
        idCmbAlmacen = Ext.getCmp("idCntNotCredAlmacen").getValue();
        Ext.require('Modulos.finanzas.FormNotaCredito', () => {
            const win = Ext.create('Ext.window.Window', {
                id: 'winFormNotaCredito',
                title: 'Cetral Nota de Credito',
                scrollable: 'horizontal',
                closable: false,
                closeAction: 'destroy',
                modal: true,
                constrain: true,
                resizable: true,
                layout: 'fit',
//                listeners: {
//                    destroy: () => VentasUtils.BtnBusqCentralVentas()
//                },
                items: [
                    Ext.create('Modulos.finanzas.FormNotaCredito', {
                        cveCen: cveCen,
                        idEmpresa: idCmbEmpresa,
                        idAlmacen: idCmbAlmacen,
                        titulo: cveCen == null ? "Nueva Nota de Credito" : "Modificar Nota de Credito",
                        itemId: 'pnlNotaCredito',
                        height: 310,
                        anchor: '100%',
                        window: 'winFormNotaCredito',
//                        storeSurtidoOrdenGrid: 'storeSurtidoOrdenGrid',
                        gridEstatus: gridEstatus
                    })
                ]
            });
            win.setSize(Ext.getBody().getViewSize());
            win.show();
        });
    },
    mostrarResultados: function (confirmData, noConfirmData) {
        // Crear modelos
        Ext.define('ResultadoModel', {
            extend: 'Ext.data.Model',
            fields: ['DocEntry', 'ItemCode', 'CardName', 'Address', 'fecha']
        });

        // Stores
        var storeConfirm = Ext.create('Ext.data.Store', {
            model: 'ResultadoModel',
            data: confirmData
        });

        var storeNoConfirm = Ext.create('Ext.data.Store', {
            model: 'ResultadoModel',
            data: noConfirmData
        });

        const win = Ext.create('Ext.window.Window', {
            id: 'winResultadosEnvio',
            title: 'Resultados del Env?o',
            width: 900,
            height: 600,
            scrollable: true,
            closable: true,
            closeAction: 'destroy',
            modal: true,
            constrain: true,
            resizable: true,
            layout: 'fit',
            items: [
                {
                    xtype: 'tabpanel',
                    items: [
                        {
                            title: 'Confirmados (' + confirmData.length + ')',
                            iconCls: 'fa fa-check-circle',
                            layout: 'fit',
                            items: [{
                                    xtype: 'grid',
                                    store: storeConfirm,
                                    columns: [
                                        {
                                            text: '#',
                                            xtype: 'rownumberer',
                                            width: 50,
                                            align: 'center'
                                        },
                                        {
                                            text: 'DocEntry',
                                            dataIndex: 'DocEntry',
                                            width: 100,
                                            align: 'center'
                                        },
                                        {
                                            text: 'ItemCode',
                                            dataIndex: 'ItemCode',
                                            width: 150
                                        },
                                        {
                                            text: 'Cliente',
                                            dataIndex: 'CardName',
                                            flex: 1
                                        },
                                        {
                                            text: 'Direcci?n',
                                            dataIndex: 'Address',
                                            flex: 1
                                        },
                                        {
                                            text: 'Fecha',
                                            dataIndex: 'fecha',
                                            width: 150
                                        }
                                    ]
                                }]
                        },
                        {
                            title: 'No Confirmados (' + noConfirmData.length + ')',
                            iconCls: 'fa fa-times-circle',
                            layout: 'fit',
                            items: [{
                                    xtype: 'grid',
                                    store: storeNoConfirm,
                                    columns: [
                                        {
                                            text: '#',
                                            xtype: 'rownumberer',
                                            width: 50,
                                            align: 'center'
                                        },
                                        {
                                            text: 'DocEntry',
                                            dataIndex: 'DocEntry',
                                            width: 100,
                                            align: 'center'
                                        },
                                        {
                                            text: 'ItemCode',
                                            dataIndex: 'ItemCode',
                                            width: 150
                                        },
                                        {
                                            text: 'Cliente',
                                            dataIndex: 'CardName',
                                            flex: 1
                                        },
                                        {
                                            text: 'Direcci?n',
                                            dataIndex: 'Address',
                                            flex: 1
                                        }
                                    ]
                                }]
                        }
                    ]
                }
            ],
            buttons: [
                {
                    text: 'Exportar Confirmados',
                    iconCls: 'icn-excel',
                    handler: function () {
                        console.log('ConfirmData:', confirmData);
                        // Aqu? puedes exportar o hacer lo que necesites
                    }
                },
                {
                    text: 'Exportar No Confirmados',
                    iconCls: 'icn-excel',
                    handler: function () {
                        console.log('NoConfirmData:', noConfirmData);
                    }
                },
                {
                    text: 'Cerrar',
                    handler: function () {
                        win.close();
                    }
                }
            ]
        });

        win.show();
    }

}
);
Ext.define('Modulos.global.PanelConsignatarios', {
    extend: 'Ext.form.Panel',
    requires: [
        'NotaCreditoUtils'
    ],
    alias: 'widget.PanelConsignatarios',
    id: 'idMenu502', // ID ?nico que coincide con el del ?rbol
    title: 'Consignatarios',
    bodyPadding: '10 10 10 10',
    layout: {
        type: 'vbox',
        align: 'stretch'
    },
    scrollable: true,
    initComponent: function () {
        var me = this;
        // === Modelo ===

        Ext.define('modelDirecciones', {
            extend: 'Ext.data.Model',
            fields: [
                "DocEntry",
                "AddressCode",
                "CardCode",
                "CardName",
                "CardType",
                "AdresType",
                "Address",
                "Address2",
                "Address3",
                "Street",
                "StreetNo",
                "Building",
                "Block",
                "ZipCode",
                "City",
                "County",
                "State",
                "Country"
            ]
        });

        me.storeDirecciones = Ext.create('Ext.data.Store', {
            model: 'modelDirecciones',
            autoLoad: false, // No cargar autom?ticamente
            proxy: {
                type: "ajax",
                url: contexto + "/Consignatarios",
                extraParams: {
                    busqBnd: 1  // ? Par?metro para obtener direcciones
                },
                reader: {
                    type: "json",
                    rootProperty: ""  // El servlet ya devuelve el array directo
                }
            }
        });

//
//        Ext.define('modelCentralVentasGrid', {
//            extend: 'Ext.data.Model',
//            fields: [
//                "facid",
//                "evenombre",
//                "tdonombre",
//                "facserie",
//                "facfolio",
//                "facfecha",
//                "facmonid",
//                "clinombre",
//                "factotal",
//                "faccoms",
//                "surtido",
//                "pagado",
//                "facconid"],
//        });
//
//
//        // === Store ===
//        me.store = Ext.create('Ext.data.Store', {
//            id: 'storeCentralVentas',
//            model: 'modelCentralVentasGrid',
//            leadingBufferZone: 100,
//            pageSize: 100,
//            autoLoad: true,
//            pageSize: 100,
//            proxy: {
//                type: "ajax",
//                url: contexto + "/CentralVenta",
//                startParam: "offset",
//                reader: {
//                    type: "json",
//                    rootProperty: "items",
//                    totalProperty: "total"
//                }
//            }
//        });
//
//        // === Paging Toolbar ===
//        me.pagingToolbar = Ext.create('Ext.PagingToolbar', {
//            store: me.store,
//            displayInfo: true,
//            displayMsg: 'Mostrando {0} - {1} de {2}',
//            emptyMsg: 'No hay registros para mostrar',
//            cls: 'custom-paging-toolbar'
//        });

        // === Componentes ===

        Ext.apply(me, {
            items: [
                // Par?metros de consulta
//                {
//                    xtype: 'fieldset',
////                    title: 'Parámetros de Consulta',
//                    collapsible: true,
//                    padding: '15 15 15 15',
//                    margin: '10 0 20 0',
//                    layout: 'fit',
//                    items: [
//                        {
//                            xtype: 'form',
//                            id: 'idMenu128-form',
//                            layout: {
//                                type: 'hbox',
//                                align: 'stretch'
//                            },
//                            defaults: {
//                                xtype: 'container',
//                                flex: 1,
//                                layout: 'anchor',
//                                padding: '10 10 10 10'
//                            },
//                            items: [
//                                {
//                                    items: [
//                                        {
//                                            xtype: "combobox",
//                                            fieldLabel: "Empresa",
//                                            id: "idCntNotCredEmpresa",
//                                            name: "cmbEmpresa",
//                                            store: createStore("", "", 1, 1, "", false),
//                                            valueField: "empid",
//                                            displayField: "empnomcorto",
//                                            queryMode: "remote",
//                                            emptyText: "Seleccione Empresa",
//                                            typeAhead: true,
//                                            //maxLength: 50,
//                                            anchor: '100%',
//                                            allowBlank: false,
//                                            listeners: {
//                                                select: function () {
////                                                    var empresa = Ext.getCmp("idCntVenEmpresa").getValue();
////                                                    var cmbCliente = Ext.getCmp('idcmbClienteFin');
////
////                                                    cmbCliente.reset();
////                                                    cmbCliente.store.removeAll();
////                                                    cmbCliente.lastQuery = null;
////                                                    cmbCliente.bindStore(buscarProductos(607, empresa, "A"));
////
////                                                    var cmbSerie = Ext.getCmp('idCntSerie');
////                                                    cmbSerie.reset();
////                                                    cmbSerie.store.removeAll();
////                                                    cmbSerie.lastQuery = null;
////                                                    cmbSerie.bindStore(createStore("", "", 628, empresa, "A", "", "I"));
//                                                }
//                                            }
//                                        },
//                                        {
//                                            xtype: "combobox",
//                                            fieldLabel: "Almacén",
//                                            id: "idCntNotCredAlmacen",
//                                            name: "CmbAlmacen",
//                                            store: createStore("", "", 9, 1, "", false),
//                                            valueField: "almid",
//                                            displayField: "almnombre",
//                                            queryMode: "remote",
//                                            emptyText: "Seleccione un Almacén",
//                                            typeAhead: true,
//                                            //maxLength: 50,
//                                            anchor: '100%',
//                                            allowBlank: false,
////                                            listeners: {
////                                                select: function () {
////                                                    NotaCreditoUtils.BtnBusqCentralVentas();
////                                                }
////                                            }
//                                        },
//                                        {
//                                            xtype: "combobox",
////                                            id: "idcmbClienteFin",
//                                            name: "censucursal",
//                                            valueField: "cliid",
//                                            displayField: "clinombre",
//                                            fieldLabel: "Cliente",
//                                            flex: 1,
//                                            anchor: '100%',
//                                            store: createStore("", "", 8, this.idEmpresa, "", false),
//                                            queryMode: "remote",
//                                            typeAhead: true,
//                                            emptyText: "Seleccione un Cliente",
//                                            allowBlank: true,
//                                            hideTrigger: true, // Oculta el bot?n de la lista desplegable
//                                            minChars: 5, // N?mero m?nimo de caracteres para activar la consulta
//                                            triggerAction: 'query',
//                                            selectOnFocus: true,
//                                            tpl: Ext.create('Ext.XTemplate',
//                                                    '<tpl for=".">',
//                                                    '<div class="x-boundlist-item">{cliclave} - {clinombre}</div>',
//                                                    '</tpl>'
//                                                    ),
//                                            displayTpl: Ext.create('Ext.XTemplate',
//                                                    '<tpl for=".">',
//                                                    '{cliclave} - {clinombre}',
//                                                    '</tpl>'
//                                                    ),
//                                            listConfig: {
//                                                loadingText: 'Cargando...', // Texto que se muestra durante la carga de datos
//                                                emptyText: 'No se encontraron resultados' // Texto que se muestra cuando no hay resultados
//                                            },
//                                            listeners: {
//                                                beforequery: function (queryPlan, eOpts) {
//                                                    var combo = queryPlan.combo;
//                                                    var queryString = queryPlan.query;
//                                                    // Configura los par?metros para la solicitud al servicio web
//                                                    combo.getStore().getProxy().setExtraParam('descripcion', queryString);
//                                                    var sucursal = Ext.getCmp("idcmbClienteFin").getValue();
//                                                    var hiddnSucursal = Ext.getCmp('hiddenClienteFin');
//                                                    hiddnSucursal.setValue(sucursal)
//                                                },
//                                                select: function () {
//                                                    NotaCreditoUtils.BtnBusqCentralVentas();
//                                                    var cliente = Ext.getCmp("idcmbClienteFin").getValue();
//                                                    cargarContratosVigentes(cliente, 'idContratoVentas');
//                                                }
//                                            }
//                                        },
//                                        {
//                                            xtype: "textfield",
//                                            fieldLabel: "Cliente Hidden",
////                                            id: "hiddenClienteFin",
//                                            name: "precliid",
//                                            readOnly: true,
//                                            anchor: '100%',
//                                            hidden: true
//                                        },
//                                        {
//                                            xtype: "combobox",
//                                            fieldLabel: "Contrato",
////                                            id: "idContratoVentas",
//                                            name: "cmbContratoPresupuesto",
//                                            //store: createStore('', '', 9, 1),
//                                            valueField: 'conid',
//                                            displayField: 'condescripcion',
//                                            queryMode: "remote",
//                                            emptyText: "Seleccione un contrato",
//                                            typeAhead: true,
//                                            maxLength: 50,
//                                            readOnly: false,
//                                            //   value: email,
//                                            anchor: '100%',
//                                            tpl: Ext.create('Ext.XTemplate',
//                                                    '<tpl for=".">',
//                                                    '<div class="x-boundlist-item">{conid} - {condescripcion}</div>',
//                                                    '</tpl>'
//                                                    ),
//                                            displayTpl: Ext.create('Ext.XTemplate',
//                                                    '<tpl for=".">',
//                                                    '{conid} - {condescripcion}',
//                                                    '</tpl>'
//                                                    ),
//                                            listeners: {
//                                                select: function () {
//                                                    NotaCreditoUtils.BtnBusqCentralVentas();
//                                                }
//                                            }
//                                        },
//                                    ]
//                                },
//                                {
//                                    items: [
//                                        {
//                                            xtype: "datefield",
//                                            fieldLabel: "Fecha",
////                                            id: "idCntVenFecha",
//                                            name: "idCntVenFecha",
//                                            maxLength: 50,
//                                            anchor: '70%',
//                                            allowBlank: false,
//                                            listeners: {
//                                                afterrender: function (datefield) {
//                                                    datefield.setValue(new Date()); // Establecer la fecha actual
//                                                },
//                                                blur: function () {
//                                                    NotaCreditoUtils.BtnBusqCentralVentas();
//                                                }
//                                            }
//                                        },
//                                        {
//                                            xtype: "numberfield",
//                                            fieldLabel: "Días Atrás",
////                                            id: "idCntVenDias",
//                                            allowBlank: false,
//                                            anchor: '70%',
//                                            value: 0,
//                                            maxValue: parseInt(NotaCreditoUtils.dias, 10),
//                                            minValue: 0,
//                                            enforceMaxLength: true,
//                                            listeners: {
//                                                change: function (field, newValue) {
//                                                    var maxValue = field.maxValue;
//                                                    if (newValue > maxValue) {
//                                                        field.setValue(maxValue);
//                                                    }
//                                                },
//                                                blur: function () {
//                                                    NotaCreditoUtils.BtnBusqCentralVentas();
//                                                }
//                                            }
//                                        }
//
//                                    ]
//                                },
//                                {
//                                    items: [
//                                        {
//                                            xtype: "combobox",
//                                            fieldLabel: "Estatus",
////                                            id: "idCntVenEstatus",
//                                            store: createStore("", "", 609, 1, "", false),
//                                            valueField: "eveid",
//                                            displayField: "evenombre",
//                                            queryMode: "remote",
//                                            emptyText: "Seleccione el Estatus",
//                                            typeAhead: true,
//                                            //maxLength: 50,
//                                            anchor: '100%',
//                                            listeners: {
//                                                select: function () {
//                                                    NotaCreditoUtils.BtnBusqCentralVentas();
//                                                }
//                                            }
//                                        },
//                                        {
//                                            xtype: "combobox",
//                                            fieldLabel: "Tipo de Documento",
////                                            id: "idCntTipoDoc",
//                                            store: createStore('', '', 57, 1, "", false),
//                                            valueField: "tdoid",
//                                            displayField: "tdonombre",
//                                            queryMode: "remote",
//                                            emptyText: "Seleccione el Tipo de Documento",
//                                            typeAhead: true,
//                                            //maxLength: 50,
//                                            anchor: '100%',
//                                            listeners: {
//                                                select: function () {
//                                                    NotaCreditoUtils.BtnBusqCentralVentas();
//                                                }
//                                            }
//                                        },
//                                        {
//                                            xtype: "combobox",
//                                            fieldLabel: "Serie",
////                                            id: "idCntSerie",
//                                            valueField: "sfaid",
//                                            displayField: "sfanombre",
//                                            queryMode: "remote",
//                                            emptyText: "Seleccione la Serie",
//                                            typeAhead: true,
//                                            //maxLength: 50,
//                                            anchor: '100%',
//                                            listeners: {
//                                                select: function () {
//                                                    NotaCreditoUtils.BtnBusqCentralVentas();
//                                                }
//                                            }
//                                        }
//
//                                    ]
//                                },
//                                {
//                                    items: [
//                                        {
//                                            xtype: "textfield",
//                                            fieldLabel: "Importe",
//                                            name: "importetot",
//                                            readOnly: true,
//                                            anchor: '100%',
////                                            id: "idImp"
//                                        },
//                                        {
//                                            xtype: "textfield",
//                                            fieldLabel: "Descuento",
//                                            name: "descuentotot",
//                                            readOnly: true,
//                                            anchor: '100%',
////                                            id: "idDesc"
//                                        },
//                                        {
//                                            xtype: "textfield",
//                                            fieldLabel: "Traslados",
//                                            name: "trasladostot",
//                                            readOnly: true,
//                                            anchor: '100%',
////                                            id: "idTras"
//                                        },
//                                        {
//                                            xtype: "textfield",
//                                            fieldLabel: "Retenciones",
//                                            name: "retencionestot",
//                                            readOnly: true,
//                                            anchor: '100%',
////                                            id: "idRete"
//                                        },
//                                        {
//                                            xtype: "textfield",
//                                            fieldLabel: "Total",
//                                            name: "totaltot",
//                                            readOnly: true,
//                                            anchor: '100%',
////                                            id: "idTotal"
//                                        },
//                                    ]
//                                }
//                            ]
//                        }
//                    ]
//                },
                {
                    xtype: 'grid',
                    id: 'gridDirecciones',
                    store: me.storeDirecciones,
                    flex: 1,
                    plugins: {
                        gridfilters: true,
                    },
                    tbar: [{
                            xtype: 'button',
//                            text: 'Buscar',
                            arrowAlign: 'center',
                            iconCls: 'icn-busquedaDos',
                            handler: function () {
//                                NotaCreditoUtils.BtnBusqCentralVentas();
                            },
                            listeners: {
                                afterrender: function (btn) {
                                    addTooltip(btn, 'Buscar');
                                }
                            }
                        }, {
                            xtype: 'button',
                            iconCls: 'icn-add',
//                            text: 'Nuevo',
                            arrowAlign: 'center',
                            handler: function () {
                                NotaCreditoUtils.NotaCredito(null);
                            },
                            listeners: {
                                afterrender: function (btn) {
                                    addTooltip(btn, 'Nuevo');
                                }
                            }
                        }, {
                            xtype: 'button',
//                            text: 'Exportar',
                            iconCls: 'icn-excel',
                            //width: 120,
                            handler: function (grid, rowIndex, colIndex, item, event, record) {
                                if (
                                        Ext.getCmp('idCntVenEmpresa').getRawValue() === "" ||
                                        Ext.getCmp('idCntVenAlmacen').getRawValue() === ""
                                        ) {
                                    Ext.MessageBox.show({
                                        title: 'Datos Incompletos',
                                        msg: 'Debe primero realizar una busqueda para exportar el Excel',
                                        buttons: Ext.MessageBox.OK,
                                        icon: Ext.MessageBox.INFO
                                    });
                                } else {

                                    idEmpresa = Ext.getCmp('idCntVenEmpresa').getValue();
                                    idAlmacen = Ext.getCmp('idCntVenAlmacen').getValue();
                                    var cliente = Ext.getCmp('idcmbClienteFin').getRawValue();
                                    var fecha = Ext.Date.format(Ext.getCmp('idCntVenFecha').getValue(), 'd/m/Y');
                                    var dias = Ext.getCmp('idCntVenDias').getRawValue();
                                    var estatus = Ext.getCmp('idCntVenEstatus').getRawValue();
                                    var tipoDoc = Ext.getCmp('idCntTipoDoc').getRawValue();
                                    var serie = Ext.getCmp('idCntSerie').getRawValue();
                                    var storeName = "gridCentralVentas";
                                    var archivoName = "Central Ventas";
                                    var fechaActual = new Date();
                                    var fechaFormateada = Ext.Date.format(fechaActual, 'd/m/Y H:i:s');
                                    var titulo = "Central Ventas";
                                    var parametros = {
                                        'titulo': titulo,
                                        'Empresa': Ext.getCmp('idCntVenEmpresa').getRawValue(),
                                        'Almac?n': Ext.getCmp('idCntVenAlmacen').getRawValue(),
                                        'Cliente': cliente,
                                        'Fecha': fecha,
                                        'Dias Atras': dias,
                                        'Estatus': estatus,
                                        'Tipo de Documento': tipoDoc,
                                        'Serie': serie,
                                        'Fecha Solicitud': fechaFormateada
                                    };
                                    Ext.Msg.show({
                                        title: 'Generar Excel',
                                        message: '?Desea exportar la p?gina actual o todos los registros existentes?',
                                        buttons: Ext.MessageBox.YESNO,
                                        buttonText: {
                                            yes: 'P?gina actual',
                                            no: 'Todos los registros'
                                        },
                                        icon: Ext.MessageBox.QUESTION,
                                        fn: function (btn) {
                                            if (btn === 'yes') {
                                                // C?digo a ejecutar si se presiona el bot?n "P?gina actual"
                                                generarExcel(storeName, archivoName, parametros);
                                            } else if (btn === 'no') {
                                                NotaCreditoUtils.cargarStoreYGenerarExcel(storeName, archivoName, parametros);
                                            } else {
                                                console.log('Se cerr? la ventana sin hacer clic en ning?n bot?n');
                                            }
                                        }
                                    });
                                }
                            },
                            listeners: {
                                afterrender: function (btn) {
                                    addTooltip(btn, 'Exportar');
                                }
                            }
                        },
                        {
                            xtype: "button",
//                            text: "Impimir Factura",
                            iconCls: "icn-imprimir",
                            handler: function (btn) {

                                var parametros = {
                                    url: '/CentralVenta',
                                    bnd: 13,
                                    tipoFormato: 'facturaGenerico',
                                    clave: NotaCreditoUtils.idVentaSeleccionado,
                                    idEmpresa: Ext.getCmp("idCntVenEmpresa").getValue(),
                                    btn: btn,
                                    ventana: btn.up('window')
                                };
                                NotaCreditoUtils.imprimirPdfCfdi(parametros);
                            },
                            listeners: {
                                afterrender: function (btn) {
                                    addTooltip(btn, 'Impimir Factura');
                                }
                            }
                        },
                        {
                            xtype: "button",
//                            text: "Imprimir Remisi?n", // O "Nota de Compra"
                            iconCls: "icn-imprimir", // Puedes usar otro ?cono si quieres
                            handler: function (btn) {
                                var parametros = {
                                    url: '/CentralVenta',
                                    tipoFormato: 'VentaRemision1',
                                    bnd: 13, // ?? NUEVA BANDERA para remisi?n
                                    clave: NotaCreditoUtils.idVentaSeleccionado,
                                    idEmpresa: Ext.getCmp("idCntVenEmpresa").getValue(),
                                    btn: btn,
                                    ventana: btn.up('window')
                                };
                                NotaCreditoUtils.imprimirPdfCfdi(parametros);
                            },
                            listeners: {
                                afterrender: function (btn) {
                                    addTooltip(btn, 'Impimir Remisi?n');
                                }
                            }
                        },
                        {
                            xtype: "button",
//                            text: "Ver CFDI",
                            iconCls: "icn-factura",
                            handler: function () {
                                var cveCen = NotaCreditoUtils.idVentaSeleccionado;
                                NotaCreditoUtils.nuevaVentaCfdi(cveCen);
                            },
                            listeners: {
                                afterrender: function (btn) {
                                    addTooltip(btn, 'Ver CFDI');
                                }
                            }
                        },
                        {
                            xtype: 'button',
//                            text: 'Limpiar',
                            arrowAlign: 'center',
                            iconCls: 'icn-limpiarBusqueda',
                            handler: function () {
                                NotaCreditoUtils.BtnLimpBuscLineaSurtido();
                            },
                            listeners: {
                                afterrender: function (btn) {
                                    addTooltip(btn, 'Limpiar');
                                }
                            }
                        },
                        {
                            xtype: 'button',
//                            text: 'Regresar',
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
                        },
                        {
                            xtype: "button",
                            text: "Datos",
                            iconCls: "icn-factura",
                            handler: function (btn) {
                                var storeDirecciones = Ext.getCmp('gridDirecciones').getStore();
                                // Cargar el store
                                storeDirecciones.load({
                                    callback: function (records, operation, success) {
                                        if (success) {
                                            console.log('? Direcciones cargadas:', records.length);
                                            Ext.toast({
                                                html: 'Se cargaron ' + records.length + ' direcciones',
                                                title: '?xito',
                                                align: 'tr',
                                                iconCls: 'fa fa-check'
                                            });
                                        } else {
                                            console.error('? Error al cargar direcciones');
                                            Ext.MessageBox.alert('Error', 'No se pudieron cargar las direcciones');
                                        }
                                    }
                                });
                            }
                        },
                        {
                            xtype: "button",
                            text: "Enviar",
                            iconCls: "icn-factura",
                            handler: function () {
                                var grid = Ext.getCmp('gridDirecciones');
                                var store = grid.getStore();

                                if (store.getCount() === 0) {
                                    Ext.MessageBox.alert('Sin datos', 'No hay registros para enviar');
                                    return;
                                }

                                // Arrays para guardar resultados
                                var confirmData = [];
                                var noConfirmData = [];
                                var totalRecords = store.getCount();
                                var processedCount = 0;

                                // Crear ventana de progreso
                                var progressWin = Ext.create('Ext.window.Window', {
                                    title: 'Enviando datos...',
                                    width: 400,
                                    height: 150,
                                    modal: true,
                                    closable: false,
                                    layout: 'fit',
                                    items: [{
                                            xtype: 'container',
                                            padding: 20,
                                            html: '<div style="text-align:center;">' +
                                                    '<div id="progressText" style="font-size:16px; margin-bottom:10px;">Procesando registro 0 de ' + totalRecords + '</div>' +
                                                    '<div id="progressBar" style="width:100%; height:30px; background:#e0e0e0; border-radius:5px; overflow:hidden;">' +
                                                    '<div id="progressFill" style="width:0%; height:100%; background:#4CAF50; transition: width 0.3s;"></div>' +
                                                    '</div>' +
                                                    '</div>'
                                        }]
                                });

                                progressWin.show();

                                // Funci?n para procesar cada registro
                                function processRecord(index) {
                                    if (index >= totalRecords) {
                                        // Termin? el procesamiento, mostrar resultados
                                        progressWin.close();
                                        NotaCreditoUtils.mostrarResultados(confirmData, noConfirmData);
                                        return;
                                    }

                                    var record = store.getAt(index);
                                    var data = {
                                        DocEntry: record.get('DocEntry'),
                                        ItemCode: record.get('AddressCode'),
                                        CardName: record.get('CardName'),
                                        Address: record.get('Address')
                                    };

                                    // Simular POST con delay
                                    setTimeout(function () {
                                        // Simular respuesta aleatoria (70% success, 30% fail)
                                        var success = Math.random() > 0.3;

                                        if (success) {
                                            // Agregar a ConfirmData CON fecha
                                            confirmData.push({
                                                DocEntry: data.DocEntry,
                                                ItemCode: data.ItemCode,
                                                CardName: data.CardName,
                                                Address: data.Address,
                                                fecha: Ext.Date.format(new Date(), 'Y-m-d H:i:s')
                                            });
                                        } else {
                                            // Agregar a NoConfirmData SIN fecha
                                            noConfirmData.push({
                                                DocEntry: data.DocEntry,
                                                ItemCode: data.ItemCode,
                                                CardName: data.CardName,
                                                Address: data.Address
                                            });
                                        }

                                        processedCount++;

                                        // Actualizar progreso
                                        var percentage = Math.round((processedCount / totalRecords) * 100);
                                        document.getElementById('progressText').innerHTML =
                                                'Procesando registro ' + processedCount + ' de ' + totalRecords;
                                        document.getElementById('progressFill').style.width = percentage + '%';

                                        // Procesar siguiente registro
                                        processRecord(index + 1);

                                    }, 200); // 200ms de delay por registro
                                }

                                // Iniciar procesamiento
                                processRecord(0);
                            }
                        }
                    ],
                    columns: {
                        defaults: {
                            filter: {
                                type: "string"
                            }
                        },
                        items: [
                            {
                                text: "#",
                                xtype: "rownumberer",
                                width: 50,
                                align: "center"
                            },
                            {
                                text: "C?digo",
                                dataIndex: "AddressCode",
                                width: 150,
                                align: "center"
                            },
                            {
                                text: "Cliente",
                                dataIndex: "CardName",
                                width: 200,
                                flex: 1
                            },
                            {
                                text: "Direcci?n",
                                dataIndex: "Address",
                                width: 250,
                                flex: 1
                            },
                            {
                                text: "Calle",
                                dataIndex: "Street",
                                width: 200
                            },
                            {
                                text: "No.",
                                dataIndex: "StreetNo",
                                width: 80,
                                align: "center"
                            },
                            {
                                text: "Colonia",
                                dataIndex: "Block",
                                width: 150
                            },
                            {
                                text: "CP",
                                dataIndex: "ZipCode",
                                width: 80,
                                align: "center"
                            },
                            {
                                text: "Ciudad",
                                dataIndex: "County",
                                width: 150
                            },
                            {
                                text: "Estado",
                                dataIndex: "State",
                                width: 80,
                                align: "center"
                            },
                            {
                                text: "Pa?s",
                                dataIndex: "Country",
                                width: 80,
                                align: "center"
                            }
                        ]
                    },
//                    bbar: me.pagingToolbar,
                    listeners: {
                        edit: function (editor, e) {
                            e.record.commit();
                        },
                        rowdblclick: function (editor, e, eOpts) {
                            var grid = Ext.getCmp("gridCentralVentas"); // or e.grid
                            var idCen = grid
                                    .getSelectionModel()
                                    .getLastSelected()
                                    .get("facid");
                            var gridEstatus = grid
                                    .getSelectionModel()
                                    .getLastSelected()
                                    .get("evenombre");
                            NotaCreditoUtils.NotaCredito(idCen, gridEstatus);
                        },
                        rowclick: function (grid, record) {
                            NotaCreditoUtils.idVentaSeleccionado = record.get('facid'); // Guarda el ID seleccionado
                        }
                    },
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
                },
            ],
        });
        me.callParent(arguments);
    },
});
