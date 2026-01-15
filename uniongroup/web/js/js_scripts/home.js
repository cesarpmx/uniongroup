Ext.define('Modulos.home', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.home',
    bodyPadding: '10 10 10 10',
    layout: {
        type: 'vbox',
        align: 'stretch'
    },
    scrollable: true,

    initComponent: function () {
        var me = this;

        Ext.apply(me, {
            items: [
                Ext.create('Ext.panel.Panel', {
                   // title: 'Inicio',
                    layout: 'fit',
                    border: false,
                    bodyPadding: 20,
                    bodyStyle: 'background-color: #ffffff;',
                    html: `
                        <table align="center" style="width:100%;height:100%">
                            <tr>
                                <td align="center" valign="top">
                                   
                                </td>
                            </tr>
                            <tr>
                                <td align="center" valign="middle" style="padding-top:30px;">
                                  
                                </td>
                            </tr>
                        </table>
                    `
                })
            ]
        });

        me.callParent(arguments);
    }
});
