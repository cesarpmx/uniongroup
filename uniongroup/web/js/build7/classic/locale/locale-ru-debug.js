/**
 * Russian translation
 * By ZooKeeper (utf-8 encoding)
 * 6 November 2007
 */
Ext.onReady(function() {

    if (Ext.Date) {
        Ext.Date.defaultFormat = 'd.m.Y';

        Ext.Date.monthNames = ["Ð¯Ð½Ð²Ð°ÑÑ", "Ð¤ÐµÐ²ÑÐ°Ð»Ñ", "ÐÐ°ÑÑ", "ÐÐ¿ÑÐµÐ»Ñ", "ÐÐ°Ð¹", "ÐÑÐ½Ñ", "ÐÑÐ»Ñ", "ÐÐ²Ð³ÑÑÑ", "Ð¡ÐµÐ½ÑÑÐ±ÑÑ", "ÐÐºÑÑÐ±ÑÑ", "ÐÐ¾ÑÐ±ÑÑ", "ÐÐµÐºÐ°Ð±ÑÑ"];

        Ext.Date.shortMonthNames = ["Ð¯Ð½Ð²", "Ð¤ÐµÐ²Ñ", "ÐÐ°ÑÑ", "ÐÐ¿Ñ", "ÐÐ°Ð¹", "ÐÑÐ½Ñ", "ÐÑÐ»Ñ", "ÐÐ²Ð³", "Ð¡ÐµÐ½Ñ", "ÐÐºÑ", "ÐÐ¾ÑÐ±", "ÐÐµÐº"];

        Ext.Date.getShortMonthName = function(month) {
            return Ext.Date.shortMonthNames[month];
        };

        Ext.Date.monthNumbers = {
            'Ð¯Ð½Ð²': 0,
            'Ð¤ÐµÐ²': 1,
            'ÐÐ°Ñ': 2,
            'ÐÐ¿Ñ': 3,
            'ÐÐ°Ð¹': 4,
            'ÐÑÐ½': 5,
            'ÐÑÐ»': 6,
            'ÐÐ²Ð³': 7,
            'Ð¡ÐµÐ½': 8,
            'ÐÐºÑ': 9,
            'ÐÐ¾Ñ': 10,
            'ÐÐµÐº': 11
        };

        Ext.Date.getMonthNumber = function(name) {
            return Ext.Date.monthNumbers[name.substring(0, 1).toUpperCase() + name.substring(1, 3).toLowerCase()];
        };

        Ext.Date.dayNames = ["ÐÐ¾ÑÐºÑÐµÑÐµÐ½ÑÐµ", "ÐÐ¾Ð½ÐµÐ´ÐµÐ»ÑÐ½Ð¸Ðº", "ÐÑÐ¾ÑÐ½Ð¸Ðº", "Ð¡ÑÐµÐ´Ð°", "Ð§ÐµÑÐ²ÐµÑÐ³", "ÐÑÑÐ½Ð¸ÑÐ°", "Ð¡ÑÐ±Ð±Ð¾ÑÐ°"];

        Ext.Date.getShortDayName = function(day) {
            return Ext.Date.dayNames[day].substring(0, 3);
        };
    }

    if (Ext.util && Ext.util.Format) {
        Ext.apply(Ext.util.Format, {
            thousandSeparator: ' ',
            decimalSeparator: ',',
            currencySign: '\u0440\u0443\u0431',
            // Russian Ruble
            dateFormat: 'd.m.Y'
        });
    }
});

Ext.define("Ext.locale.ru.view.View", {
    override: "Ext.view.View",
    emptyText: ""
});

Ext.define("Ext.locale.ru.grid.plugin.DragDrop", {
    override: "Ext.grid.plugin.DragDrop",
    dragText: "{0} Ð²ÑÐ±ÑÐ°Ð½Ð½ÑÑ ÑÑÑÐ¾Ðº"
});

Ext.define("Ext.locale.ru.tab.Tab", {
    override: "Ext.tab.Tab",
    closeText: "ÐÐ°ÐºÑÑÑÑ ÑÑÑ Ð²ÐºÐ»Ð°Ð´ÐºÑ"
});

Ext.define("Ext.locale.ru.form.field.Base", {
    override: "Ext.form.field.Base",
    invalidText: "ÐÐ½Ð°ÑÐµÐ½Ð¸Ðµ Ð² ÑÑÐ¾Ð¼ Ð¿Ð¾Ð»Ðµ Ð½ÐµÐ²ÐµÑÐ½Ð¾Ðµ"
});

// changing the msg text below will affect the LoadMask
Ext.define("Ext.locale.ru.view.AbstractView", {
    override: "Ext.view.AbstractView",
    loadingText: "ÐÐ°Ð³ÑÑÐ·ÐºÐ°..."
});

Ext.define("Ext.locale.ru.picker.Date", {
    override: "Ext.picker.Date",
    todayText: "Ð¡ÐµÐ³Ð¾Ð´Ð½Ñ",
    minText: "Ð­ÑÐ° Ð´Ð°ÑÐ° ÑÐ°Ð½ÑÑÐµ Ð¼Ð¸Ð½Ð¸Ð¼Ð°Ð»ÑÐ½Ð¾Ð¹ Ð´Ð°ÑÑ",
    maxText: "Ð­ÑÐ° Ð´Ð°ÑÐ° Ð¿Ð¾Ð·Ð¶Ðµ Ð¼Ð°ÐºÑÐ¸Ð¼Ð°Ð»ÑÐ½Ð¾Ð¹ Ð´Ð°ÑÑ",
    disabledDaysText: "ÐÐµÐ´Ð¾ÑÑÑÐ¿Ð½Ð¾",
    disabledDatesText: "ÐÐµÐ´Ð¾ÑÑÑÐ¿Ð½Ð¾",
    nextText: 'Ð¡Ð»ÐµÐ´ÑÑÑÐ¸Ð¹ Ð¼ÐµÑÑÑ (Control+ÐÐ¿ÑÐ°Ð²Ð¾)',
    prevText: 'ÐÑÐµÐ´ÑÐ´ÑÑÐ¸Ð¹ Ð¼ÐµÑÑÑ (Control+ÐÐ»ÐµÐ²Ð¾)',
    monthYearText: 'ÐÑÐ±Ð¾Ñ Ð¼ÐµÑÑÑÐ° (Control+ÐÐ²ÐµÑÑ/ÐÐ½Ð¸Ð· Ð´Ð»Ñ Ð²ÑÐ±Ð¾ÑÐ° Ð³Ð¾Ð´Ð°)',
    todayTip: "{0} (ÐÑÐ¾Ð±ÐµÐ»)",
    format: "d.m.y",
    startDay: 1
});

Ext.define("Ext.locale.ru.picker.Month", {
    override: "Ext.picker.Month",
    okText: "&#160;OK&#160;",
    cancelText: "ÐÑÐ¼ÐµÐ½Ð°"
});

Ext.define("Ext.locale.ru.toolbar.Paging", {
    override: "Ext.PagingToolbar",
    beforePageText: "Ð¡ÑÑÐ°Ð½Ð¸ÑÐ°",
    afterPageText: "Ð¸Ð· {0}",
    firstText: "ÐÐµÑÐ²Ð°Ñ ÑÑÑÐ°Ð½Ð¸ÑÐ°",
    prevText: "ÐÑÐµÐ´ÑÐ´ÑÑÐ°Ñ ÑÑÑÐ°Ð½Ð¸ÑÐ°",
    nextText: "Ð¡Ð»ÐµÐ´ÑÑÑÐ°Ñ ÑÑÑÐ°Ð½Ð¸ÑÐ°",
    lastText: "ÐÐ¾ÑÐ»ÐµÐ´Ð½ÑÑ ÑÑÑÐ°Ð½Ð¸ÑÐ°",
    refreshText: "ÐÐ±Ð½Ð¾Ð²Ð¸ÑÑ",
    displayMsg: "ÐÑÐ¾Ð±ÑÐ°Ð¶Ð°ÑÑÑÑ Ð·Ð°Ð¿Ð¸ÑÐ¸ Ñ {0} Ð¿Ð¾ {1}, Ð²ÑÐµÐ³Ð¾ {2}",
    emptyMsg: 'ÐÐµÑ Ð´Ð°Ð½Ð½ÑÑ Ð´Ð»Ñ Ð¾ÑÐ¾Ð±ÑÐ°Ð¶ÐµÐ½Ð¸Ñ'
});

Ext.define("Ext.locale.ru.form.field.Text", {
    override: "Ext.form.field.Text",
    minLengthText: "ÐÐ¸Ð½Ð¸Ð¼Ð°Ð»ÑÐ½Ð°Ñ Ð´Ð»Ð¸Ð½Ð° ÑÑÐ¾Ð³Ð¾ Ð¿Ð¾Ð»Ñ {0}",
    maxLengthText: "ÐÐ°ÐºÑÐ¸Ð¼Ð°Ð»ÑÐ½Ð°Ñ Ð´Ð»Ð¸Ð½Ð° ÑÑÐ¾Ð³Ð¾ Ð¿Ð¾Ð»Ñ {0}",
    blankText: "Ð­ÑÐ¾ Ð¿Ð¾Ð»Ðµ Ð¾Ð±ÑÐ·Ð°ÑÐµÐ»ÑÐ½Ð¾ Ð´Ð»Ñ Ð·Ð°Ð¿Ð¾Ð»Ð½ÐµÐ½Ð¸Ñ",
    regexText: "",
    emptyText: null
});

Ext.define("Ext.locale.ru.form.field.Number", {
    override: "Ext.form.field.Number",
    minText: "ÐÐ½Ð°ÑÐµÐ½Ð¸Ðµ ÑÑÐ¾Ð³Ð¾ Ð¿Ð¾Ð»Ñ Ð½Ðµ Ð¼Ð¾Ð¶ÐµÑ Ð±ÑÑÑ Ð¼ÐµÐ½ÑÑÐµ {0}",
    maxText: "ÐÐ½Ð°ÑÐµÐ½Ð¸Ðµ ÑÑÐ¾Ð³Ð¾ Ð¿Ð¾Ð»Ñ Ð½Ðµ Ð¼Ð¾Ð¶ÐµÑ Ð±ÑÑÑ Ð±Ð¾Ð»ÑÑÐµ {0}",
    nanText: "{0} Ð½Ðµ ÑÐ²Ð»ÑÐµÑÑÑ ÑÐ¸ÑÐ»Ð¾Ð¼",
    negativeText: "ÐÐ½Ð°ÑÐµÐ½Ð¸Ðµ Ð½Ðµ Ð¼Ð¾Ð¶ÐµÑ Ð±ÑÑÑ Ð¾ÑÑÐ¸ÑÐ°ÑÐµÐ»ÑÐ½ÑÐ¼"
});

Ext.define("Ext.locale.ru.form.field.Date", {
    override: "Ext.form.field.Date",
    disabledDaysText: "ÐÐµÐ´Ð¾ÑÑÑÐ¿Ð½Ð¾",
    disabledDatesText: "ÐÐµÐ´Ð¾ÑÑÑÐ¿Ð½Ð¾",
    minText: "ÐÐ°ÑÐ° Ð² ÑÑÐ¾Ð¼ Ð¿Ð¾Ð»Ðµ Ð´Ð¾Ð»Ð¶Ð½Ð° Ð±ÑÑÑ Ð¿Ð¾Ð·Ð¶Ðµ {0}",
    maxText: "ÐÐ°ÑÐ° Ð² ÑÑÐ¾Ð¼ Ð¿Ð¾Ð»Ðµ Ð´Ð¾Ð»Ð¶Ð½Ð° Ð±ÑÑÑ ÑÐ°Ð½ÑÑÐµ {0}",
    invalidText: "{0} Ð½Ðµ ÑÐ²Ð»ÑÐµÑÑÑ Ð¿ÑÐ°Ð²Ð¸Ð»ÑÐ½Ð¾Ð¹ Ð´Ð°ÑÐ¾Ð¹ - Ð´Ð°ÑÐ° Ð´Ð¾Ð»Ð¶Ð½Ð° Ð±ÑÑÑ ÑÐºÐ°Ð·Ð°Ð½Ð° Ð² ÑÐ¾ÑÐ¼Ð°ÑÐµ {1}",
    format: "d.m.y",
    altFormats: "d.m.y|d/m/Y|d-m-y|d-m-Y|d/m|d-m|dm|dmy|dmY|d|Y-m-d"
});

Ext.define("Ext.locale.ru.form.field.ComboBox", {
    override: "Ext.form.field.ComboBox",
    valueNotFoundText: undefined
}, function() {
    Ext.apply(Ext.form.field.ComboBox.prototype.defaultListConfig, {
        loadingText: "ÐÐ°Ð³ÑÑÐ·ÐºÐ°..."
    });
});

Ext.define("Ext.locale.ru.form.field.VTypes", {
    override: "Ext.form.field.VTypes",
    emailText: 'Ð­ÑÐ¾ Ð¿Ð¾Ð»Ðµ Ð´Ð¾Ð»Ð¶Ð½Ð¾ ÑÐ¾Ð´ÐµÑÐ¶Ð°ÑÑ Ð°Ð´ÑÐµÑ ÑÐ»ÐµÐºÑÑÐ¾Ð½Ð½Ð¾Ð¹ Ð¿Ð¾ÑÑÑ Ð² ÑÐ¾ÑÐ¼Ð°ÑÐµ "user@example.com"',
    urlText: 'Ð­ÑÐ¾ Ð¿Ð¾Ð»Ðµ Ð´Ð¾Ð»Ð¶Ð½Ð¾ ÑÐ¾Ð´ÐµÑÐ¶Ð°ÑÑ URL Ð² ÑÐ¾ÑÐ¼Ð°ÑÐµ "http:/' + '/www.example.com"',
    alphaText: 'Ð­ÑÐ¾ Ð¿Ð¾Ð»Ðµ Ð´Ð¾Ð»Ð¶Ð½Ð¾ ÑÐ¾Ð´ÐµÑÐ¶Ð°ÑÑ ÑÐ¾Ð»ÑÐºÐ¾ Ð»Ð°ÑÐ¸Ð½ÑÐºÐ¸Ðµ Ð±ÑÐºÐ²Ñ Ð¸ ÑÐ¸Ð¼Ð²Ð¾Ð» Ð¿Ð¾Ð´ÑÐµÑÐºÐ¸Ð²Ð°Ð½Ð¸Ñ "_"',
    alphanumText: 'Ð­ÑÐ¾ Ð¿Ð¾Ð»Ðµ Ð´Ð¾Ð»Ð¶Ð½Ð¾ ÑÐ¾Ð´ÐµÑÐ¶Ð°ÑÑ ÑÐ¾Ð»ÑÐºÐ¾ Ð»Ð°ÑÐ¸Ð½ÑÐºÐ¸Ðµ Ð±ÑÐºÐ²Ñ, ÑÐ¸ÑÑÑ Ð¸ ÑÐ¸Ð¼Ð²Ð¾Ð» Ð¿Ð¾Ð´ÑÐµÑÐºÐ¸Ð²Ð°Ð½Ð¸Ñ "_"'
});

Ext.define("Ext.locale.ru.form.field.HtmlEditor", {
    override: "Ext.form.field.HtmlEditor",
    createLinkText: 'ÐÐ¾Ð¶Ð°Ð»ÑÐ¹ÑÑÐ°, Ð²Ð²ÐµÐ´Ð¸ÑÐµ Ð°Ð´ÑÐµÑ:'
}, function() {
    Ext.apply(Ext.form.field.HtmlEditor.prototype, {
        buttonTips: {
            bold: {
                title: 'ÐÐ¾Ð»ÑÐ¶Ð¸ÑÐ½ÑÐ¹ (Ctrl+B)',
                text: 'ÐÑÐ¸Ð¼ÐµÐ½ÐµÐ½Ð¸Ðµ Ð¿Ð¾Ð»ÑÐ¶Ð¸ÑÐ½Ð¾Ð³Ð¾ Ð½Ð°ÑÐµÑÑÐ°Ð½Ð¸Ñ Ðº Ð²ÑÐ´ÐµÐ»ÐµÐ½Ð½Ð¾Ð¼Ñ ÑÐµÐºÑÑÑ.',
                cls: Ext.baseCSSPrefix + 'html-editor-tip'
            },
            italic: {
                title: 'ÐÑÑÑÐ¸Ð² (Ctrl+I)',
                text: 'ÐÑÐ¸Ð¼ÐµÐ½ÐµÐ½Ð¸Ðµ ÐºÑÑÑÐ¸Ð²Ð½Ð¾Ð³Ð¾ Ð½Ð°ÑÐµÑÑÐ°Ð½Ð¸Ñ Ðº Ð²ÑÐ´ÐµÐ»ÐµÐ½Ð½Ð¾Ð¼Ñ ÑÐµÐºÑÑÑ.',
                cls: Ext.baseCSSPrefix + 'html-editor-tip'
            },
            underline: {
                title: 'ÐÐ¾Ð´ÑÑÑÐºÐ½ÑÑÑÐ¹ (Ctrl+U)',
                text: 'ÐÐ¾Ð´ÑÑÑÐºÐ¸Ð²Ð°Ð½Ð¸Ðµ Ð²ÑÐ´ÐµÐ»ÐµÐ½Ð½Ð¾Ð³Ð¾ ÑÐµÐºÑÑÐ°.',
                cls: Ext.baseCSSPrefix + 'html-editor-tip'
            },
            increasefontsize: {
                title: 'Ð£Ð²ÐµÐ»Ð¸ÑÐ¸ÑÑ ÑÐ°Ð·Ð¼ÐµÑ',
                text: 'Ð£Ð²ÐµÐ»Ð¸ÑÐµÐ½Ð¸Ðµ ÑÐ°Ð·Ð¼ÐµÑÐ° ÑÑÐ¸ÑÑÐ°.',
                cls: Ext.baseCSSPrefix + 'html-editor-tip'
            },
            decreasefontsize: {
                title: 'Ð£Ð¼ÐµÐ½ÑÑÐ¸ÑÑ ÑÐ°Ð·Ð¼ÐµÑ',
                text: 'Ð£Ð¼ÐµÐ½ÑÑÐµÐ½Ð¸Ðµ ÑÐ°Ð·Ð¼ÐµÑÐ° ÑÑÐ¸ÑÑÐ°.',
                cls: Ext.baseCSSPrefix + 'html-editor-tip'
            },
            backcolor: {
                title: 'ÐÐ°Ð»Ð¸Ð²ÐºÐ°',
                text: 'ÐÐ·Ð¼ÐµÐ½ÐµÐ½Ð¸Ðµ ÑÐ²ÐµÑÐ° ÑÐ¾Ð½Ð° Ð´Ð»Ñ Ð²ÑÐ´ÐµÐ»ÐµÐ½Ð½Ð¾Ð³Ð¾ ÑÐµÐºÑÑÐ° Ð¸Ð»Ð¸ Ð°Ð±Ð·Ð°ÑÐ°.',
                cls: Ext.baseCSSPrefix + 'html-editor-tip'
            },
            forecolor: {
                title: 'Ð¦Ð²ÐµÑ ÑÐµÐºÑÑÐ°',
                text: 'ÐÐ·Ð¼ÐµÐ½Ð¸Ðµ ÑÐ²ÐµÑÐ° ÑÐµÐºÑÑÐ°.',
                cls: Ext.baseCSSPrefix + 'html-editor-tip'
            },
            justifyleft: {
                title: 'ÐÑÑÐ¾Ð²Ð½ÑÑÑ ÑÐµÐºÑÑ Ð¿Ð¾ Ð»ÐµÐ²Ð¾Ð¼Ñ ÐºÑÐ°Ñ',
                text: 'ÐÑÑaÐ²Ð½Ð¸Ð²Ð°Ð½Ð¸Ðµ ÑÐµÐºÑÑÐ° Ð¿Ð¾ Ð»ÐµÐ²Ð¾Ð¼Ñ ÐºÑÐ°Ñ.',
                cls: Ext.baseCSSPrefix + 'html-editor-tip'
            },
            justifycenter: {
                title: 'ÐÐ¾ ÑÐµÐ½ÑÑÑ',
                text: 'ÐÑÑaÐ²Ð½Ð¸Ð²Ð°Ð½Ð¸Ðµ ÑÐµÐºÑÑÐ° Ð¿Ð¾ ÑÐµÐ½ÑÑÑ.',
                cls: Ext.baseCSSPrefix + 'html-editor-tip'
            },
            justifyright: {
                title: 'ÐÑÑÐ¾Ð²Ð½ÑÑÑ ÑÐµÐºÑÑ Ð¿Ð¾ Ð¿ÑÐ°Ð²Ð¾Ð¼Ñ ÐºÑÐ°Ñ',
                text: 'ÐÑÑaÐ²Ð½Ð¸Ð²Ð°Ð½Ð¸Ðµ ÑÐµÐºÑÑÐ° Ð¿Ð¾ Ð¿ÑÐ°Ð²Ð¾Ð¼Ñ ÐºÑÐ°Ñ.',
                cls: Ext.baseCSSPrefix + 'html-editor-tip'
            },
            insertunorderedlist: {
                title: 'ÐÐ°ÑÐºÐµÑÑ',
                text: 'ÐÐ°ÑÐ°ÑÑ Ð¼Ð°ÑÐºÐ¸ÑÐ¾Ð²Ð°Ð½Ð½ÑÐ¹ ÑÐ¿Ð¸ÑÐ¾Ðº.',
                cls: Ext.baseCSSPrefix + 'html-editor-tip'
            },
            insertorderedlist: {
                title: 'ÐÑÐ¼ÐµÑÐ°ÑÐ¸Ñ',
                text: 'ÐÐ°ÑÐ°ÑÑ Ð½ÑÐ¼ÐµÑÐ½Ð¾Ð²Ð°Ð½Ð½ÑÐ¹ ÑÐ¿Ð¸ÑÐ¾Ðº.',
                cls: Ext.baseCSSPrefix + 'html-editor-tip'
            },
            createlink: {
                title: 'ÐÑÑÐ°Ð²Ð¸ÑÑ Ð³Ð¸Ð¿ÐµÑÑÑÑÐ»ÐºÑ',
                text: 'Ð¡Ð¾Ð·Ð´Ð°Ð½Ð¸Ðµ ÑÑÑÐ»ÐºÐ¸ Ð¸Ð· Ð²ÑÐ´ÐµÐ»ÐµÐ½Ð½Ð¾Ð³Ð¾ ÑÐµÐºÑÑÐ°.',
                cls: Ext.baseCSSPrefix + 'html-editor-tip'
            },
            sourceedit: {
                title: 'ÐÑÑÐ¾Ð´Ð½ÑÐ¹ ÐºÐ¾Ð´',
                text: 'ÐÐµÑÐµÐºÐ»ÑÑÐ¸ÑÑÑÑ Ð½Ð° Ð¸ÑÑÐ¾Ð´Ð½ÑÐ¹ ÐºÐ¾Ð´.',
                cls: Ext.baseCSSPrefix + 'html-editor-tip'
            }
        }
    });
});

Ext.define("Ext.locale.ru.form.Basic", {
    override: "Ext.form.Basic",
    waitTitle: "ÐÐ¾Ð¶Ð°Ð»ÑÐ¹ÑÑÐ°, Ð¿Ð¾Ð´Ð¾Ð¶Ð´Ð¸ÑÐµ..."
});

Ext.define("Ext.locale.ru.grid.header.Container", {
    override: "Ext.grid.header.Container",
    sortAscText: "Ð¡Ð¾ÑÑÐ¸ÑÐ¾Ð²Ð°ÑÑ Ð¿Ð¾ Ð²Ð¾Ð·ÑÐ°ÑÑÐ°Ð½Ð¸Ñ",
    sortDescText: "Ð¡Ð¾ÑÑÐ¸ÑÐ¾Ð²Ð°ÑÑ Ð¿Ð¾ ÑÐ±ÑÐ²Ð°Ð½Ð¸Ñ",
    lockText: "ÐÐ°ÐºÑÐµÐ¿Ð¸ÑÑ ÑÑÐ¾Ð»Ð±ÐµÑ",
    unlockText: "Ð¡Ð½ÑÑÑ Ð·Ð°ÐºÑÐµÐ¿Ð»ÐµÐ½Ð¸Ðµ ÑÑÐ¾Ð»Ð±ÑÐ°",
    columnsText: "Ð¡ÑÐ¾Ð»Ð±ÑÑ"
});

Ext.define("Ext.locale.ru.grid.GroupingFeature", {
    override: "Ext.grid.feature.Grouping",
    emptyGroupText: '(ÐÑÑÑÐ¾)',
    groupByText: 'ÐÑÑÐ¿Ð¿Ð¸ÑÐ¾Ð²Ð°ÑÑ Ð¿Ð¾ ÑÑÐ¾Ð¼Ñ Ð¿Ð¾Ð»Ñ',
    showGroupsText: 'ÐÑÐ¾Ð±ÑÐ°Ð¶Ð°ÑÑ Ð¿Ð¾ Ð³ÑÑÐ¿Ð¿Ð°Ð¼'
});

Ext.define("Ext.locale.ru.grid.PropertyColumnModel", {
    override: "Ext.grid.PropertyColumnModel",
    nameText: "ÐÐ°Ð·Ð²Ð°Ð½Ð¸Ðµ",
    valueText: "ÐÐ½Ð°ÑÐµÐ½Ð¸Ðµ",
    dateFormat: "d.m.Y"
});

Ext.define("Ext.locale.ru.window.MessageBox", {
    override: "Ext.window.MessageBox",
    buttonText: {
        ok: "OK",
        cancel: "ÐÑÐ¼ÐµÐ½Ð°",
        yes: "ÐÐ°",
        no: "ÐÐµÑ"
    }
});

Ext.define("Ext.locale.ru.form.field.File", {
    override: "Ext.form.field.File",
    buttonText: "ÐÐ±Ð·Ð¾Ñ..."
});

// This is needed until we can refactor all of the locales into individual files
Ext.define("Ext.locale.ru.Component", {
    override: "Ext.Component"
});
