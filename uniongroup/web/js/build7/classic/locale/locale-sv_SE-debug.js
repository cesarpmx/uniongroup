/**
 * Swedish translation (utf8-encoding)
 * By Erik Andersson, Monator Technologies
 * 24 April 2007
 * Changed by Cariad, 29 July 2007
 */
Ext.onReady(function() {
    if (Ext.Date) {
        Ext.Date.monthNames = ["januari", "februari", "mars", "april", "maj", "juni", "juli", "augusti", "september", "oktober", "november", "december"];
        Ext.Date.dayNames = ["sÃ¶ndag", "mÃ¥ndag", "tisdag", "onsdag", "torsdag", "fredag", "lÃ¶rdag"];

        Ext.Date.formatCodes.a = "(m.getHours() < 12 ? 'em' : 'fm')";
        Ext.Date.formatCodes.A = "(m.getHours() < 12 ? 'EM' : 'FM')";
        Ext.Date.parseCodes.a = {
            g: 1,
            c: "if (/(em)/i.test(results[{0}])) {\n" + "if (!h || h == 12) { h = 0; }\n" + "} else { if (!h || h < 12) { h = (h || 0) + 12; }}",
            s: "(em|fm|EM|FM)",
            calcAtEnd: true
        };
        Ext.Date.parseCodes.A = {
            g: 1,
            c: "if (/(em)/i.test(results[{0}])) {\n" + "if (!h || h == 12) { h = 0; }\n" + "} else { if (!h || h < 12) { h = (h || 0) + 12; }}",
            s: "(EM|FM|em|fm)",
            calcAtEnd: true
        };
    }
});
Ext.define("Ext.locale.sv_SE.form.field.Base", {
    override: "Ext.form.field.Base",
    invalidText: "VÃ¤rdet i detta fÃ¤lt Ã¤r inte tillÃ¥tet"
});
Ext.define("Ext.locale.sv_SE.form.field.ComboBox", {
    override: "Ext.form.field.ComboBox",
    valueNotFoundText: undefined
}, function() {
    Ext.apply(Ext.form.field.ComboBox.prototype.defaultListConfig, {
        loadingText: "Laddar..."
    });
});
Ext.define("Ext.locale.sv_SE.form.field.Date", {
    override: "Ext.form.field.Date",
    disabledDaysText: "Inaktiverad",
    disabledDatesText: "Inaktiverad",
    minText: "Datumet i detta fÃ¤lt mÃ¥ste intrÃ¤ffa efter {0}",
    maxText: "Datumet i detta fÃ¤lt mÃ¥ste intrÃ¤ffa fÃ¶re {0}",
    invalidText: "{0} Ã¤r inte ett tillÃ¥tet datum - datum ska anges i formatet {1}",
    format: "Y-m-d"
});
Ext.define("Ext.locale.sv_SE.form.field.Number", {
    override: "Ext.form.field.Number",
    minText: "Minsta tillÃ¥tna vÃ¤rde fÃ¶r detta fÃ¤lt Ã¤r {0}",
    maxText: "StÃ¶rsta tillÃ¥tna vÃ¤rde fÃ¶r detta fÃ¤lt Ã¤r {0}",
    nanText: "{0} Ã¤r inte ett tillÃ¥tet nummer"
});
Ext.define("Ext.locale.sv_SE.form.field.Text", {
    override: "Ext.form.field.Text",
    minLengthText: "Minsta tillÃ¥tna lÃ¤ngd fÃ¶r detta fÃ¤lt Ã¤r {0}",
    maxLengthText: "StÃ¶rsta tillÃ¥tna lÃ¤ngd fÃ¶r detta fÃ¤lt Ã¤r {0}",
    blankText: "Detta fÃ¤lt Ã¤r obligatoriskt",
    regexText: "",
    emptyText: null
});
Ext.define("Ext.locale.sv_SE.form.field.Time", {
    override: "Ext.form.field.Time",
    minText: "Tiden i detta fÃ¤lt mÃ¥ste vara lika med eller efter tiden i {0}",
    maxText: "Tiden i detta fÃ¤lt mÃ¥ste vara lika med eller fÃ¶re tiden i {0}",
    invalidText: "{0} Ã¤r inte en korrekt tid",
    format: "G:i"
});
Ext.define("Ext.locale.sv_SE.form.field.VTypes", {
    override: "Ext.form.field.VTypes",
    emailText: 'Detta fÃ¤lt ska innehÃ¥lla en e-post adress i formatet "anvÃ¤ndare@domÃ¤n.se"',
    urlText: 'Detta fÃ¤lt ska innehÃ¥lla en lÃ¤nk (URL) i formatet "http:/' + '/www.domÃ¤n.se"',
    alphaText: 'Detta fÃ¤lt fÃ¥r bara innehÃ¥lla bokstÃ¤ver och "_"',
    alphanumText: 'Detta fÃ¤lt fÃ¥r bara innehÃ¥lla bokstÃ¤ver, nummer och "_"'
});
Ext.define("Ext.locale.sv_SE.grid.PropertyColumnModel", {
    override: "Ext.grid.PropertyColumnModel",
    nameText: "Namn",
    valueText: "VÃ¤rde",
    dateFormat: "Y-m-d"
});
Ext.define("Ext.locale.sv_SE.grid.header.Container", {
    override: "Ext.grid.header.Container",
    sortAscText: "Sortera stigande",
    sortDescText: "Sortera fallande",
    lockText: "LÃ¥s kolumn",
    unlockText: "LÃ¥s upp kolumn",
    columnsText: "Kolumner"
});
Ext.define("Ext.locale.sv_SE.grid.plugin.DragDrop", {
    override: "Ext.grid.plugin.DragDrop",
    dragText: "{0} markerade rad(er)"
});
Ext.define("Ext.locale.sv_SE.picker.Date", {
    override: "Ext.picker.Date",
    todayText: "Idag",
    minText: "Detta datum intrÃ¤ffar fÃ¶re det tidigast tillÃ¥tna",
    maxText: "Detta datum intrÃ¤ffar efter det senast tillÃ¥tna",
    disabledDaysText: "",
    disabledDatesText: "",
    nextText: 'NÃ¤sta mÃ¥nad (Ctrl + hÃ¶gerpil)',
    prevText: 'FÃ¶regÃ¥ende mÃ¥nad (Ctrl + vÃ¤nsterpil)',
    monthYearText: 'VÃ¤lj en mÃ¥nad (Ctrl + uppÃ¥tpil/nerÃ¥tpil fÃ¶r att Ã¤ndra Ã¥rtal)',
    todayTip: "{0} (mellanslag)",
    format: "Y-m-d",
    startDay: 1
});
Ext.define("Ext.locale.sv_SE.tab.Tab", {
    override: "Ext.tab.Tab",
    closeText: "StÃ¤ng denna flik"
});
Ext.define("Ext.locale.sv_SE.toolbar.Paging", {
    override: "Ext.PagingToolbar",
    beforePageText: "Sida",
    afterPageText: "av {0}",
    firstText: "FÃ¶rsta sidan",
    prevText: "FÃ¶regÃ¥ende sida",
    nextText: "NÃ¤sta sida",
    lastText: "Sista sidan",
    refreshText: "Uppdatera",
    displayMsg: "Visar {0} - {1} av {2}",
    emptyMsg: 'Det finns ingen data att visa'
});
/* This will change AM/PM to EM/FM
 * Ext.Date.format(new Date('2006/01/15 15:00:00'), 'd/m/y h:i:s A'); -> 15/01/06 03:00:00 FM
 * Ext.Date.parse("2006-01-15 3:20:01 FM", "Y-m-d g:i:s A")           -> Sun Jan 15 2006 15:20:01
 */

if (Ext.util && Ext.util.Format) {

    Ext.define('Ext.locale.sv_SE.util.Format', {
        override: 'Ext.util.Format',
        decimalSeparator: ',',
        thousandSeparator: ' ',
        // Swedish Krone
        currencySign: 'kr',
        currencyAtEnd: true,
        dateFormat: 'Y-m-d',
        currencySpacer: ' '
    });
}
// changing the msg text below will affect the LoadMask
Ext.define("Ext.locale.sv_SE.view.AbstractView", {
    override: "Ext.view.AbstractView",
    loadingText: "Laddar..."
});
Ext.define("Ext.locale.sv_SE.view.View", {
    override: "Ext.view.View",
    emptyText: ""
});
Ext.define("Ext.locale.sv_SE.window.MessageBox", {
    override: "Ext.window.MessageBox",
    buttonText: {
        ok: "OK",
        cancel: "Avbryt",
        yes: "Ja",
        no: "Nej"
    }
});
