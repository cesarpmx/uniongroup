/**
 * Macedonia translation
 * By PetarD petar.dimitrijevic@vorteksed.com.mk (utf8 encoding)
 * 23 April 2007
 */
Ext.onReady(function() {

    if (Ext.Date) {
        Ext.Date.monthNames = ["ÐÐ°Ð½ÑÐ°ÑÐ¸", "Ð¤ÐµÐ²ÑÑÐ°ÑÐ¸", "ÐÐ°ÑÑ", "ÐÐ¿ÑÐ¸Ð»", "ÐÐ°Ñ", "ÐÑÐ½Ð¸", "ÐÑÐ»Ð¸", "ÐÐ²Ð³ÑÑÑ", "Ð¡ÐµÐ¿ÑÐµÐ¼Ð²ÑÐ¸", "ÐÐºÑÐ¾Ð¼Ð²ÑÐ¸", "ÐÐ¾ÐµÐ¼Ð²ÑÐ¸", "ÐÐµÐºÐµÐ¼Ð²ÑÐ¸"];

        Ext.Date.dayNames = ["ÐÐµÐ´ÐµÐ»Ð°", "ÐÐ¾Ð½ÐµÐ´ÐµÐ»Ð½Ð¸Ðº", "ÐÑÐ¾ÑÐ½Ð¸Ðº", "Ð¡ÑÐµÐ´Ð°", "Ð§ÐµÑÐ²ÑÑÐ¾Ðº", "ÐÐµÑÐ¾Ðº", "Ð¡Ð°Ð±Ð¾ÑÐ°"];
    }

    if (Ext.util && Ext.util.Format) {
        Ext.apply(Ext.util.Format, {
            thousandSeparator: '.',
            decimalSeparator: ',',
            currencySign: '\u0434\u0435\u043d',
            // Macedonian Denar
            dateFormat: 'd.m.Y'
        });
    }
});

Ext.define("Ext.locale.mk.view.View", {
    override: "Ext.view.View",
    emptyText: ""
});

Ext.define("Ext.locale.mk.grid.plugin.DragDrop", {
    override: "Ext.grid.plugin.DragDrop",
    dragText: "{0} Ð¸Ð·Ð±ÑÐ°Ð½Ð¸ ÑÐµÐ´Ð¸ÑÐ¸"
});

Ext.define("Ext.locale.mk.tab.Tab", {
    override: "Ext.tab.Tab",
    closeText: "ÐÐ°ÑÐ²Ð¾ÑÐ¸ tab"
});

Ext.define("Ext.locale.mk.form.field.Base", {
    override: "Ext.form.field.Base",
    invalidText: "ÐÑÐµÐ´Ð½Ð¾ÑÑÐ° Ð²Ð¾ Ð¾Ð²Ð° Ð¿Ð¾Ð»Ðµ Ðµ Ð½ÐµÐ²Ð°Ð»Ð¸Ð´Ð½Ð°"
});

// changing the msg text below will affect the LoadMask
Ext.define("Ext.locale.mk.view.AbstractView", {
    override: "Ext.view.AbstractView",
    loadingText: "ÐÑÐ¸ÑÑÐ²Ð°Ð¼..."
});

Ext.define("Ext.locale.mk.picker.Date", {
    override: "Ext.picker.Date",
    todayText: "ÐÐµÐ½ÐµÑÐºÐ°",
    minText: "ÐÐ²Ð¾Ñ Ð´Ð°ÑÑÐ¼ Ðµ Ð¿ÑÐµÐ´ Ð½Ð°ÑÐ¼Ð°Ð»Ð¸Ð¾Ñ Ð´Ð°ÑÑÐ¼",
    maxText: "ÐÐ²Ð¾Ñ Ð´Ð°ÑÑÐ¼ Ðµ Ð¿ÑÐµÐ´ Ð½Ð°ÑÐ³Ð¾Ð»ÐµÐ¼Ð¸Ð¾Ñ Ð´Ð°ÑÑÐ¼",
    disabledDaysText: "",
    disabledDatesText: "",
    nextText: 'Ð¡Ð»ÐµÐ´ÐµÐ½ Ð¼ÐµÑÐµÑ (Control+Ð¡ÑÑÐµÐ»ÐºÐ° Ð´ÐµÑÐ½Ð¾)',
    prevText: 'ÐÑÐµÑÑÐ¾Ð´ÐµÐ½ Ð¼ÐµÑÐµÑ (Control+Ð¡ÑÑÐµÐ»ÐºÐ° Ð»ÐµÐ²Ð¾)',
    monthYearText: 'ÐÐ·Ð±ÐµÑÐµÑÐµ Ð¼ÐµÑÐµÑ (Control+Ð¡ÑÑÐµÐ»ÐºÐ° Ð³Ð¾ÑÐµ/Ð¡ÑÑÐµÐ»ÐºÐ° Ð´ÐµÑÐ½Ð¾ Ð·Ð° Ð¼ÐµÐ½ÑÐ²Ð°ÑÐµ Ð³Ð¾Ð´Ð¸Ð½Ð°)',
    todayTip: "{0} (Spacebar)",
    format: "d.m.y"
});

Ext.define("Ext.locale.mk.toolbar.Paging", {
    override: "Ext.PagingToolbar",
    beforePageText: "Ð¡ÑÑÐ°Ð½Ð¸ÑÐ°",
    afterPageText: "Ð¾Ð´ {0}",
    firstText: "ÐÑÐ²Ð° Ð¡ÑÑÐ°Ð½Ð¸ÑÐ°",
    prevText: "ÐÑÐµÑÑÐ¾Ð´Ð½Ð° Ð¡ÑÑÐ°Ð½Ð¸ÑÐ°",
    nextText: "Ð¡Ð»ÐµÐ´Ð½Ð° Ð¡ÑÑÐ°Ð½Ð¸ÑÐ°",
    lastText: "ÐÐ¾ÑÐ»ÐµÐ´Ð½Ð° Ð¡ÑÑÐ°Ð½Ð¸ÑÐ°",
    refreshText: "ÐÑÐ²ÐµÐ¶Ð¸",
    displayMsg: "ÐÑÐ¸ÐºÐ°Ð¶ÑÐ²Ð°Ð¼ {0} - {1} Ð¾Ð´ {2}",
    emptyMsg: 'ÐÐµÐ¼Ð° Ð¿Ð¾Ð´Ð°ÑÐ¾ÑÐ¸ Ð·Ð° Ð¿ÑÐ¸ÐºÐ°Ð·'
});

Ext.define("Ext.locale.mk.form.field.Text", {
    override: "Ext.form.field.Text",
    minLengthText: "ÐÐ¸Ð½Ð¸Ð¼Ð°Ð»Ð½Ð°ÑÐ° Ð´Ð¾Ð»Ð¶Ð¸Ð½Ð° Ð·Ð° Ð¾Ð²Ð° Ð¿Ð¾Ð»Ðµ Ðµ {0}",
    maxLengthText: "ÐÐ°ÐºÑÐ¸Ð¼Ð°Ð»Ð½Ð°ÑÐ° Ð´Ð¾Ð»Ð¶Ð¸Ð½Ð° Ð·Ð° Ð¾Ð²Ð° Ð¿Ð¾Ð»Ðµ Ðµ {0}",
    blankText: "ÐÐ¾Ð´Ð°ÑÐ¾ÑÐ¸ÑÐµ Ð²Ð¾ Ð¾Ð²Ð° Ð¿Ð¾Ð»Ðµ ÑÐµ Ð¿Ð¾ÑÑÐµÐ±Ð½Ð¸",
    regexText: "",
    emptyText: null
});

Ext.define("Ext.locale.mk.form.field.Number", {
    override: "Ext.form.field.Number",
    minText: "ÐÐ¸Ð½Ð¸Ð¼Ð°Ð»Ð½Ð°ÑÐ° Ð²ÑÐµÐ´Ð½Ð¾ÑÑ Ð·Ð° Ð¾Ð²Ð° Ð¿Ð¾Ð»Ðµ Ðµ {0}",
    maxText: "ÐÐ°ÐºÑÐ¸Ð¼Ð°Ð»Ð½Ð°ÑÐ° Ð²ÑÐµÐ´Ð½Ð¾ÑÑ Ð·Ð° Ð¾Ð²Ð° Ð¿Ð¾Ð»Ðµ Ðµ {0}",
    nanText: "{0} Ð½Ðµ Ðµ Ð²Ð°Ð»Ð¸Ð´ÐµÐ½ Ð±ÑÐ¾Ñ"
});

Ext.define("Ext.locale.mk.form.field.Date", {
    override: "Ext.form.field.Date",
    disabledDaysText: "ÐÐµÐ°ÐºÑÐ¸Ð²Ð½Ð¾",
    disabledDatesText: "ÐÐµÐ°ÐºÑÐ¸Ð²Ð½Ð¾",
    minText: "ÐÐ°ÑÑÐ¼Ð¾Ñ Ð²Ð¾ Ð¾Ð²Ð° Ð¿Ð¾Ð»Ðµ Ð¼Ð¾ÑÐ° Ð´Ð° Ð±Ð¸Ð´Ðµ Ð¿ÑÐµÐ´ {0}",
    maxText: "ÐÐ°ÑÑÐ¼Ð¾Ñ Ð²Ð¾ Ð¾Ð²Ð° Ð¿Ð¾Ð»Ðµ Ð¼Ð¾ÑÐ° Ð´Ð° Ð±Ð¸Ð´Ðµ Ð¿Ð¾ {0}",
    invalidText: "{0} Ð½Ðµ Ðµ Ð²Ð°Ð»Ð¸Ð´ÐµÐ½ Ð´Ð°ÑÑÐ¼ - Ð¼Ð¾ÑÐ° Ð´Ð° Ð±Ð¸Ð´Ðµ Ð²Ð¾ ÑÐ¾ÑÐ¼Ð°Ñ {1}",
    format: "d.m.y"
});

Ext.define("Ext.locale.mk.form.field.ComboBox", {
    override: "Ext.form.field.ComboBox",
    valueNotFoundText: undefined
}, function() {
    Ext.apply(Ext.form.field.ComboBox.prototype.defaultListConfig, {
        loadingText: "ÐÑÐ¸ÑÑÐ²Ð°Ð¼..."
    });
});

Ext.define("Ext.locale.mk.form.field.VTypes", {
    override: "Ext.form.field.VTypes",
    emailText: 'ÐÐ²Ð° Ð¿Ð¾Ð»Ðµ ÑÑÐµÐ±Ð° Ð´Ð° Ð±Ð¸Ð´Ðµ e-mail Ð°Ð´ÑÐµÑÐ° Ð²Ð¾ ÑÐ¾ÑÐ¼Ð°Ñ "user@example.com"',
    urlText: 'ÐÐ²Ð° Ð¿Ð¾Ð»Ðµ ÑÑÐµÐ±Ð° Ð´Ð° Ð±Ð¸Ð´Ðµ URL Ð²Ð¾ ÑÐ¾ÑÐ¼Ð°Ñ "http:/' + '/www.example.com"',
    alphaText: 'ÐÐ²Ð° Ð¿Ð¾Ð»Ðµ ÑÑÐµÐ±Ð° Ð´Ð° ÑÐ¾Ð´ÑÐ¶Ð¸ ÑÐ°Ð¼Ð¾ Ð±ÑÐºÐ²Ð¸ Ð¸ _',
    alphanumText: 'ÐÐ²Ð° Ð¿Ð¾Ð»Ðµ ÑÑÐµÐ±Ð° Ð´Ð° ÑÐ¾Ð´ÑÐ¶Ð¸ ÑÐ°Ð¼Ð¾ Ð±ÑÐºÐ²Ð¸, Ð±ÑÐ¾ÑÐºÐ¸ Ð¸ _'
});

Ext.define("Ext.locale.mk.grid.header.Container", {
    override: "Ext.grid.header.Container",
    sortAscText: "Ð¡Ð¾ÑÑÐ¸ÑÐ°Ñ Ð Ð°ÑÑÐµÑÐºÐ¸",
    sortDescText: "Ð¡Ð¾ÑÑÐ¸ÑÐ°Ñ ÐÐ¿Ð°ÑÐ°ÑÐºÐ¸",
    lockText: "ÐÐ°ÐºÐ»ÑÑÐ¸ ÐÐ¾Ð»Ð¾Ð½Ð°",
    unlockText: "ÐÑÐºÐ»ÑÑÐ¸ ÐºÐ¾Ð»Ð¾Ð½Ð°",
    columnsText: "ÐÐ¾Ð»Ð¾Ð½Ð¸"
});

Ext.define("Ext.locale.mk.grid.PropertyColumnModel", {
    override: "Ext.grid.PropertyColumnModel",
    nameText: "ÐÐ¼Ðµ",
    valueText: "ÐÑÐµÐ´Ð½Ð¾ÑÑ",
    dateFormat: "m.d.Y"
});

Ext.define("Ext.locale.mk.window.MessageBox", {
    override: "Ext.window.MessageBox",
    buttonText: {
        ok: "ÐÐ¾ÑÐ²ÑÐ´Ð¸",
        cancel: "ÐÐ¾Ð½Ð¸ÑÑÐ¸",
        yes: "ÐÐ°",
        no: "ÐÐµ"
    }
});

// This is needed until we can refactor all of the locales into individual files
Ext.define("Ext.locale.mk.Component", {
    override: "Ext.Component"
});
