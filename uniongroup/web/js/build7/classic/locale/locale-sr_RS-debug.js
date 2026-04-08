/**
 * Serbian Cyrillic Translation
 * by Äolovic Vladan (cyrillic, utf8 encoding)
 * sr_RS (ex: sr_CS, sr_YU)
 * 12 May 2007
 */
Ext.onReady(function() {

    if (Ext.Date) {
        Ext.Date.monthNames = ["ÐÐ°Ð½ÑÐ°Ñ", "Ð¤ÐµÐ±ÑÑÐ°Ñ", "ÐÐ°ÑÑ", "ÐÐ¿ÑÐ¸Ð»", "ÐÐ°Ñ", "ÐÑÐ½", "ÐÑÐ»", "ÐÐ²Ð³ÑÑÑ", "Ð¡ÐµÐ¿ÑÐµÐ¼Ð±Ð°Ñ", "ÐÐºÑÐ¾Ð±Ð°Ñ", "ÐÐ¾Ð²ÐµÐ¼Ð±Ð°Ñ", "ÐÐµÑÐµÐ¼Ð±Ð°Ñ"];

        Ext.Date.dayNames = ["ÐÐµÐ´ÐµÑÐ°", "ÐÐ¾Ð½ÐµÐ´ÐµÑÐ°Ðº", "Ð£ÑÐ¾ÑÐ°Ðº", "Ð¡ÑÐµÐ´Ð°", "Ð§ÐµÑÐ²ÑÑÐ°Ðº", "ÐÐµÑÐ°Ðº", "Ð¡ÑÐ±Ð¾ÑÐ°"];
    }

    if (Ext.util && Ext.util.Format) {
        Ext.apply(Ext.util.Format, {
            thousandSeparator: '.',
            decimalSeparator: ',',
            currencySign: '\u0414\u0438\u043d\u002e',
            // Serbian Dinar
            dateFormat: 'd.m.Y'
        });
    }
});

Ext.define("Ext.locale.sr_RS.view.View", {
    override: "Ext.view.View",
    emptyText: ""
});

Ext.define("Ext.locale.sr_RS.grid.plugin.DragDrop", {
    override: "Ext.grid.plugin.DragDrop",
    dragText: "{0} Ð¸Ð·Ð°Ð±ÑÐ°Ð½Ð¸Ñ ÑÐµÐ´Ð¾Ð²Ð°"
});

Ext.define("Ext.locale.sr_RS.tab.Tab", {
    override: "Ext.tab.Tab",
    closeText: "ÐÐ°ÑÐ²Ð¾ÑÐ¸ Ð¾Ð²Ñ Â»ÐºÐ°ÑÑÐ¸ÑÑÂ«"
});

Ext.define("Ext.locale.sr_RS.form.field.Base", {
    override: "Ext.form.field.Base",
    invalidText: "Ð£Ð½ÐµÑÐµÐ½Ð° Ð²ÑÐµÐ´Ð½Ð¾ÑÑ Ð½Ð¸ÑÐµ Ð¿ÑÐ°Ð²Ð¸Ð»Ð½Ð°"
});

// changing the msg text below will affect the LoadMask
Ext.define("Ext.locale.sr_RS.view.AbstractView", {
    override: "Ext.view.AbstractView",
    loadingText: "Ð£ÑÐ¸ÑÐ°Ð²Ð°Ð¼..."
});

Ext.define("Ext.locale.sr_RS.picker.Date", {
    override: "Ext.picker.Date",
    todayText: "ÐÐ°Ð½Ð°Ñ",
    minText: "ÐÐ°ÑÑÐ¼ ÑÐµ Ð¸ÑÐ¿ÑÐµÐ´ Ð½Ð°ÑÐ¼Ð°ÑÐµÐ³ Ð´Ð¾Ð·Ð²Ð¾ÑÐµÐ½Ð¾Ð³ Ð´Ð°ÑÑÐ¼Ð°",
    maxText: "ÐÐ°ÑÑÐ¼ ÑÐµ Ð½Ð°ÐºÐ¾Ð½ Ð½Ð°ÑÐ²ÐµÑÐµÐ³ Ð´Ð¾Ð·Ð²Ð¾ÑÐµÐ½Ð¾Ð³ Ð´Ð°ÑÑÐ¼Ð°",
    disabledDaysText: "",
    disabledDatesText: "",
    nextText: 'Ð¡Ð»ÐµÐ´ÐµÑÐ¸ Ð¼ÐµÑÐµÑ (Control+ÐÐµÑÐ½Ð¾)',
    prevText: 'ÐÑÐµÑÑÐ¾Ð´Ð½Ð¸ Ð¼ÐµÑÐµÑ (Control+ÐÐµÐ²Ð¾)',
    monthYearText: 'ÐÐ·Ð°Ð±ÐµÑÐ¸ÑÐµ Ð¼ÐµÑÐµÑ (Control+ÐÐ¾ÑÐµ/ÐÐ¾Ð»Ðµ Ð·Ð° Ð¸Ð·Ð±Ð¾Ñ Ð³Ð¾Ð´Ð¸Ð½Ðµ)',
    todayTip: "{0} (Ð Ð°Ð·Ð¼Ð°ÐºÐ½Ð¸ÑÐ°)",
    format: "d.m.y",
    startDay: 1
});

Ext.define("Ext.locale.sr_RS.toolbar.Paging", {
    override: "Ext.PagingToolbar",
    beforePageText: "Ð¡ÑÑÐ°Ð½Ð°",
    afterPageText: "Ð¾Ð´ {0}",
    firstText: "ÐÑÐ²Ð° ÑÑÑÐ°Ð½Ð°",
    prevText: "ÐÑÐµÑÑÐ¾Ð´Ð½Ð° ÑÑÑÐ°Ð½Ð°",
    nextText: "Ð¡Ð»ÐµÐ´ÐµÑÐ° ÑÑÑÐ°Ð½Ð°",
    lastText: "ÐÐ¾ÑÐ»ÐµÐ´ÑÐ° ÑÑÑÐ°Ð½Ð°",
    refreshText: "ÐÑÐ²ÐµÐ¶Ð¸",
    displayMsg: "ÐÑÐ¸ÐºÐ°Ð·Ð°Ð½Ð° {0} - {1} Ð¾Ð´ {2}",
    emptyMsg: 'ÐÐµÐ¼Ð°Ð¼ ÑÑÐ° Ð¿ÑÐ¸ÐºÐ°Ð·Ð°ÑÐ¸'
});

Ext.define("Ext.locale.sr_RS.form.field.Text", {
    override: "Ext.form.field.Text",
    minLengthText: "ÐÐ¸Ð½Ð¸Ð¼Ð°Ð»Ð½Ð° Ð´ÑÐ¶Ð¸Ð½Ð° Ð¾Ð²Ð¾Ð³ Ð¿Ð¾ÑÐ° ÑÐµ {0}",
    maxLengthText: "ÐÐ°ÐºÑÐ¸Ð¼Ð°Ð»Ð½Ð° Ð´ÑÐ¶Ð¸Ð½Ð° Ð¾Ð²Ð¾Ð³ Ð¿Ð¾ÑÐ° ÑÐµ {0}",
    blankText: "ÐÐ¾ÑÐµ ÑÐµ Ð¾Ð±Ð°Ð²ÐµÐ·Ð½Ð¾",
    regexText: "",
    emptyText: null
});

Ext.define("Ext.locale.sr_RS.form.field.Number", {
    override: "Ext.form.field.Number",
    minText: "ÐÐ¸Ð½Ð¸Ð¼Ð°Ð»Ð½Ð° Ð²ÑÐµÐ´Ð½Ð¾ÑÑ Ñ Ð¿Ð¾ÑÑ ÑÐµ {0}",
    maxText: "ÐÐ°ÐºÑÐ¸Ð¼Ð°Ð»Ð½Ð° Ð²ÑÐµÐ´Ð½Ð¾ÑÑ Ñ Ð¿Ð¾ÑÑ ÑÐµ {0}",
    nanText: "{0} Ð½Ð¸ÑÐµ Ð¿ÑÐ°Ð²Ð¸Ð»Ð°Ð½ Ð±ÑÐ¾Ñ"
});

Ext.define("Ext.locale.sr_RS.form.field.Date", {
    override: "Ext.form.field.Date",
    disabledDaysText: "ÐÐ°ÑÐ¸Ð²Ð½Ð¾",
    disabledDatesText: "ÐÐ°ÑÐ¸Ð²Ð½Ð¾",
    minText: "ÐÐ°ÑÑÐ¼ Ñ Ð¾Ð²Ð¾Ð¼ Ð¿Ð¾ÑÑ Ð¼Ð¾ÑÐ° Ð±Ð¸ÑÐ¸ Ð½Ð°ÐºÐ¾Ð½ {0}",
    maxText: "ÐÐ°ÑÑÐ¼ Ñ Ð¾Ð²Ð¾Ð¼ Ð¿Ð¾ÑÑ Ð¼Ð¾ÑÐ° Ð±Ð¸ÑÐ¸ Ð¿ÑÐµ {0}",
    invalidText: "{0} Ð½Ð¸ÑÐµ Ð¿ÑÐ°Ð²Ð¸Ð»Ð°Ð½ Ð´Ð°ÑÑÐ¼ - Ð·Ð°ÑÑÐµÐ²Ð°Ð½Ð¸ Ð¾Ð±Ð»Ð¸Ðº ÑÐµ {1}",
    format: "d.m.y"
});

Ext.define("Ext.locale.sr_RS.form.field.ComboBox", {
    override: "Ext.form.field.ComboBox",
    valueNotFoundText: undefined
}, function() {
    Ext.apply(Ext.form.field.ComboBox.prototype.defaultListConfig, {
        loadingText: "Ð£ÑÐ¸ÑÐ°Ð²Ð°Ð¼..."
    });
});

Ext.define("Ext.locale.sr_RS.form.field.VTypes", {
    override: "Ext.form.field.VTypes",
    emailText: 'ÐÐ²Ð¾ Ð¿Ð¾ÑÐµ Ð¿ÑÐ¸ÑÐ²Ð°ÑÐ° e-mail Ð°Ð´ÑÐµÑÑ Ð¸ÑÐºÑÑÑÐ¸Ð²Ð¾ Ñ Ð¾Ð±Ð»Ð¸ÐºÑ "korisnik@domen.com"',
    urlText: 'ÐÐ²Ð¾ Ð¿Ð¾ÑÐµ Ð¿ÑÐ¸ÑÐ²Ð°ÑÐ° URL Ð°Ð´ÑÐµÑÑ Ð¸ÑÐºÑÑÑÐ¸Ð²Ð¾ Ñ Ð¾Ð±Ð»Ð¸ÐºÑ "http:/' + '/www.domen.com"',
    alphaText: 'ÐÐ²Ð¾ Ð¿Ð¾ÑÐµ Ð¼Ð¾Ð¶Ðµ ÑÐ°Ð´ÑÐ¶Ð°ÑÐ¸ Ð¸ÑÐºÑÑÑÐ¸Ð²Ð¾ ÑÐ»Ð¾Ð²Ð° Ð¸ Ð·Ð½Ð°Ðº _',
    alphanumText: 'ÐÐ²Ð¾ Ð¿Ð¾ÑÐµ Ð¼Ð¾Ð¶Ðµ ÑÐ°Ð´ÑÐ¶Ð°ÑÐ¸ ÑÐ°Ð¼Ð¾ ÑÐ»Ð¾Ð²Ð°, Ð±ÑÐ¾ÑÐµÐ²Ðµ Ð¸ Ð·Ð½Ð°Ðº _'
});

Ext.define("Ext.locale.sr_RS.grid.header.Container", {
    override: "Ext.grid.header.Container",
    sortAscText: "Ð Ð°ÑÑÑÑÐ¸ ÑÐµÐ´Ð¾ÑÐ»ÐµÐ´",
    sortDescText: "ÐÐ¿Ð°Ð´Ð°ÑÑÑÐ¸ ÑÐµÐ´Ð¾ÑÐ»ÐµÐ´",
    lockText: "ÐÐ°ÐºÑÑÑÐ°Ñ ÐºÐ¾Ð»Ð¾Ð½Ñ",
    unlockText: "ÐÑÐºÑÑÑÐ°Ñ ÐºÐ¾Ð»Ð¾Ð½Ñ",
    columnsText: "ÐÐ¾Ð»Ð¾Ð½Ðµ"
});

Ext.define("Ext.locale.sr_RS.grid.PropertyColumnModel", {
    override: "Ext.grid.PropertyColumnModel",
    nameText: "ÐÐ°Ð·Ð¸Ð²",
    valueText: "ÐÑÐµÐ´Ð½Ð¾ÑÑ",
    dateFormat: "d.m.Y"
});

Ext.define("Ext.locale.sr_RS.window.MessageBox", {
    override: "Ext.window.MessageBox",
    buttonText: {
        ok: "Ð£ ÑÐµÐ´Ñ",
        cancel: "ÐÐ´ÑÑÑÐ°Ð½Ð¸",
        yes: "ÐÐ°",
        no: "ÐÐµ"
    }
});

// This is needed until we can refactor all of the locales into individual files
Ext.define("Ext.locale.sr_RS.Component", {
    override: "Ext.Component"
});
