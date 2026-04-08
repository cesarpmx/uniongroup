/**
 * Bulgarian Translation
 *
 * By ÐÐµÐ¾ÑÐ³Ð¸ ÐÐ¾ÑÑÐ°Ð´Ð¸Ð½Ð¾Ð², ÐÐ°Ð»Ð³Ð°ÑÐ¸, ÐÐ°Ð½Ð°Ð´Ð°
 * 10 October 2007
 * By Nedko Penev
 * 26 October 2007
 *
 * (utf-8 encoding)
 */
Ext.onReady(function() {

    if (Ext.Date) {
        Ext.Date.monthNames = ["Ð¯Ð½ÑÐ°ÑÐ¸", "Ð¤ÐµÐ²ÑÑÐ°ÑÐ¸", "ÐÐ°ÑÑ", "ÐÐ¿ÑÐ¸Ð»", "ÐÐ°Ð¹", "Ð®Ð½Ð¸", "Ð®Ð»Ð¸", "ÐÐ²Ð³ÑÑÑ", "Ð¡ÐµÐ¿ÑÐµÐ¼Ð²ÑÐ¸", "ÐÐºÑÐ¾Ð¼Ð²ÑÐ¸", "ÐÐ¾ÐµÐ¼Ð²ÑÐ¸", "ÐÐµÐºÐµÐ¼Ð²ÑÐ¸"];

        Ext.Date.monthNumbers = {
            Jan: 0,
            Feb: 1,
            Mar: 2,
            Apr: 3,
            May: 4,
            Jun: 5,
            Jul: 6,
            Aug: 7,
            Sep: 8,
            Oct: 9,
            Nov: 10,
            Dec: 11
        };

        Ext.Date.dayNames = ["ÐÐµÐ´ÐµÐ»Ñ", "ÐÐ¾Ð½ÐµÐ´ÐµÐ»Ð½Ð¸Ðº", "ÐÑÐ¾ÑÐ½Ð¸Ðº", "Ð¡ÑÑÐ´Ð°", "Ð§ÐµÑÐ²ÑÑÑÑÐº", "ÐÐµÑÑÐº", "Ð¡ÑÐ±Ð¾ÑÐ°"];
    }

    if (Ext.util && Ext.util.Format) {
        Ext.apply(Ext.util.Format, {
            thousandSeparator: '.',
            decimalSeparator: ',',
            currencySign: '\u043b\u0432',
            // Bulgarian Leva
            dateFormat: 'd.m.Y'
        });
    }
});

Ext.define("Ext.locale.bg.view.View", {
    override: "Ext.view.View",
    emptyText: ""
});

Ext.define("Ext.locale.bg.grid.plugin.DragDrop", {
    override: "Ext.grid.plugin.DragDrop",
    dragText: "{0} Ð¸Ð·Ð±ÑÐ°Ð½Ð¸ ÐºÐ¾Ð»Ð¾Ð½Ð¸"
});

Ext.define("Ext.locale.bg.tab.Tab", {
    override: "Ext.tab.Tab",
    closeText: "ÐÐ°ÑÐ²Ð¾ÑÐ¸ ÑÐ°Ð±"
});

Ext.define("Ext.locale.bg.form.field.Base", {
    override: "Ext.form.field.Base",
    invalidText: "ÐÐµÐ²Ð°Ð»Ð¸Ð´Ð½Ð° ÑÑÐ¾Ð¹Ð½Ð¾ÑÑ Ð½Ð° Ð¿Ð¾Ð»ÐµÑÐ¾"
});

// changing the msg text below will affect the LoadMask
Ext.define("Ext.locale.bg.view.AbstractView", {
    override: "Ext.view.AbstractView",
    loadingText: "ÐÐ°ÑÐµÐ¶Ð´Ð°Ð½Ðµ..."
});

Ext.define("Ext.locale.bg.picker.Date", {
    override: "Ext.picker.Date",
    todayText: "ÐÐ½ÐµÑ",
    minText: "Ð¢Ð°Ð·Ð¸ Ð´Ð°ÑÐ° Ðµ Ð¿ÑÐµÐ´Ð¸ Ð¼Ð¸Ð½Ð¸Ð¼Ð°Ð»Ð½Ð°ÑÐ°",
    maxText: "Ð¢Ð°Ð·Ð¸ Ð´Ð°ÑÐ° Ðµ ÑÐ»ÐµÐ´ Ð¼Ð°ÐºÑÐ¸Ð¼Ð°Ð»Ð½Ð°ÑÐ°",
    disabledDaysText: "",
    disabledDatesText: "",
    nextText: 'Ð¡Ð»ÐµÐ´Ð²Ð°Ñ Ð¼ÐµÑÐµÑ (Control+Right)',
    prevText: 'ÐÑÐµÐ´Ð¸ÑÐµÐ½ Ð¼ÐµÑÐµÑ (Control+Left)',
    monthYearText: 'ÐÐ·Ð±ÐµÑÐ¸ Ð¼ÐµÑÐµÑ (Control+Up/Down Ð·Ð° Ð¿ÑÐµÐ¼ÐµÑÑÐ²Ð°Ð½Ðµ Ð¿Ð¾ Ð³Ð¾Ð´Ð¸Ð½Ð¸)',
    todayTip: "{0} (Spacebar)",
    format: "d.m.y",
    startDay: 1
});

Ext.define("Ext.locale.bg.picker.Month", {
    override: "Ext.picker.Month",
    okText: "&#160;OK&#160;",
    cancelText: "ÐÑÐ¼ÐµÐ½Ð¸"
});

Ext.define("Ext.locale.bg.toolbar.Paging", {
    override: "Ext.PagingToolbar",
    beforePageText: "Ð¡ÑÑÐ°Ð½Ð¸ÑÐ°",
    afterPageText: "Ð¾Ñ {0}",
    firstText: "ÐÑÑÐ²Ð° ÑÑÑÐ°Ð½Ð¸ÑÐ°",
    prevText: "ÐÑÐµÐ´Ð¸ÑÐ½Ð° ÑÑÑÐ°Ð½Ð¸ÑÐ°",
    nextText: "Ð¡Ð»ÐµÐ´Ð²Ð°ÑÐ° ÑÑÑÐ°Ð½Ð¸ÑÐ°",
    lastText: "ÐÐ¾ÑÐ»ÐµÐ´Ð½Ð° ÑÑÑÐ°Ð½Ð¸ÑÐ°",
    refreshText: "ÐÑÐµÐ·Ð°ÑÐµÐ´Ð¸",
    displayMsg: "ÐÐ¾ÐºÐ°Ð·Ð²Ð°Ð¹ÐºÐ¸ {0} - {1} Ð¾Ñ {2}",
    emptyMsg: 'ÐÑÐ¼Ð° Ð´Ð°Ð½Ð½Ð¸ Ð·Ð° Ð¿Ð¾ÐºÐ°Ð·Ð²Ð°Ð½Ðµ'
});

Ext.define("Ext.locale.bg.form.field.Text", {
    override: "Ext.form.field.Text",
    minLengthText: "ÐÐ¸Ð½Ð¸Ð¼Ð°Ð»Ð½Ð°ÑÐ° Ð´ÑÐ»Ð¶Ð¸Ð½Ð° Ð½Ð° ÑÐ¾Ð²Ð° Ð¿Ð¾Ð»Ðµ Ðµ {0}",
    maxLengthText: "ÐÐ°ÐºÑÐ¸Ð¼Ð°Ð»Ð½Ð°ÑÐ° Ð´ÑÐ»Ð¶Ð¸Ð½Ð° Ð½Ð° ÑÐ¾Ð²Ð° Ð¿Ð¾Ð»Ðµ Ðµ {0}",
    blankText: "Ð¢Ð¾Ð²Ð° Ð¿Ð¾Ð»Ðµ Ðµ Ð·Ð°Ð´ÑÐ»Ð¶Ð¸ÑÐµÐ»Ð½Ð¾",
    regexText: "",
    emptyText: null
});

Ext.define("Ext.locale.bg.form.field.Number", {
    override: "Ext.form.field.Number",
    minText: "ÐÐ¸Ð½Ð¸Ð¼Ð°Ð»Ð½Ð°ÑÐ° ÑÑÐ¾Ð¹Ð½Ð¾ÑÑ Ð·Ð° ÑÐ¾Ð²Ð° Ð¿Ð¾Ð»Ðµ Ðµ {0}",
    maxText: "ÐÐ°ÐºÑÐ¸Ð¼Ð°Ð»Ð½Ð°ÑÐ° ÑÑÐ¾Ð¹Ð½Ð¾ÑÑ Ð·Ð° ÑÐ¾Ð²Ð° Ð¿Ð¾Ð»Ðµ Ðµ {0}",
    nanText: "{0} Ð½Ðµ Ðµ Ð²Ð°Ð»Ð¸Ð´Ð½Ð¾ ÑÐ¸ÑÐ»Ð¾"
});

Ext.define("Ext.locale.bg.form.field.Date", {
    override: "Ext.form.field.Date",
    disabledDaysText: "ÐÐµÐ´Ð¾ÑÑÑÐ¿ÐµÐ½",
    disabledDatesText: "ÐÐµÐ´Ð¾ÑÑÑÐ¿ÐµÐ½",
    minText: "ÐÐ°ÑÐ°ÑÐ° Ð² ÑÐ¾Ð²Ð° Ð¿Ð¾Ð»Ðµ ÑÑÑÐ±Ð²Ð° Ð´Ð° Ðµ ÑÐ»ÐµÐ´ {0}",
    maxText: "ÐÐ°ÑÐ°ÑÐ° Ð² ÑÐ¾Ð²Ð° Ð¿Ð¾Ð»Ðµ ÑÑÑÐ±Ð²Ð° Ð´Ð° Ðµ Ð¿ÑÐµÐ´Ð¸ {0}",
    invalidText: "{0} Ð½Ðµ Ðµ Ð²Ð°Ð»Ð¸Ð´Ð½Ð° Ð´Ð°ÑÐ° - ÑÑÑÐ±Ð²Ð° Ð´Ð° Ð±ÑÐ´Ðµ Ð²ÑÐ² ÑÐ¾ÑÐ¼Ð°Ñ {1}",
    format: "d.m.y",
    altFormats: "d.m.y|d/m/Y|d-m-y|d-m-Y|d/m|d-m|dm|dmy|dmY|d|Y-m-d"
});

Ext.define("Ext.locale.bg.form.field.ComboBox", {
    override: "Ext.form.field.ComboBox",
    valueNotFoundText: undefined
}, function() {
    Ext.apply(Ext.form.field.ComboBox.prototype.defaultListConfig, {
        loadingText: "ÐÐ°ÑÐµÐ¶Ð´Ð°Ð½Ðµ..."
    });
});

Ext.define("Ext.locale.bg.form.field.VTypes", {
    override: "Ext.form.field.VTypes",
    emailText: 'Ð¢Ð¾Ð²Ð° Ð¿Ð¾Ð»Ðµ ÑÑÑÐ±Ð²Ð° Ð´Ð° Ð±ÑÐ´Ðµ ÐµÐ¼ÐµÐ¹Ð» Ð²ÑÐ² ÑÐ¾ÑÐ¼Ð°Ñ "user@example.com"',
    urlText: 'Ð¢Ð¾Ð²Ð° Ð¿Ð¾Ð»Ðµ ÑÑÑÐ±Ð²Ð° Ð´Ð° Ð±ÑÐ´Ðµ URL Ð²ÑÐ² ÑÐ¾ÑÐ¼Ð°Ñ "http:/' + '/www.example.com"',
    alphaText: 'Ð¢Ð¾Ð²Ð° Ð¿Ð¾Ð»Ðµ ÑÑÑÐ±Ð²Ð° Ð´Ð° ÑÑÐ´ÑÑÐ¶Ð° ÑÐ°Ð¼Ð¾ Ð±ÑÐºÐ²Ð¸ Ð¸ _',
    alphanumText: 'Ð¢Ð¾Ð²Ð° Ð¿Ð¾Ð»Ðµ ÑÑÑÐ±Ð²Ð° Ð´Ð° ÑÑÐ´ÑÑÐ¶Ð° ÑÐ°Ð¼Ð¾ Ð±ÑÐºÐ²Ð¸, ÑÐ¸ÑÑÐ¸ Ð¸ _'
});

Ext.define("Ext.locale.bg.form.field.HtmlEditor", {
    override: "Ext.form.field.HtmlEditor",
    createLinkText: 'ÐÐ¾Ð»Ñ, Ð²ÑÐ²ÐµÐ´ÐµÑÐµ URL Ð·Ð° Ð²ÑÑÐ·ÐºÐ°ÑÐ°:'
}, function() {
    Ext.apply(Ext.form.field.HtmlEditor.prototype, {
        buttonTips: {
            bold: {
                title: 'Bold (Ctrl+B)',
                text: 'Ð£Ð´ÐµÐ±ÐµÐ»ÑÐ²Ð° Ð¸Ð·Ð±ÑÐ°Ð½Ð¸Ñ ÑÐµÐºÑÑ.',
                cls: Ext.baseCSSPrefix + 'html-editor-tip'
            },
            italic: {
                title: 'Italic (Ctrl+I)',
                text: 'ÐÑÐ°Ð²Ð¸ Ð¸Ð·Ð±ÑÐ°Ð½Ð¸Ñ ÑÐµÐºÑÑ ÐºÑÑÑÐ¸Ð².',
                cls: Ext.baseCSSPrefix + 'html-editor-tip'
            },
            underline: {
                title: 'Underline (Ctrl+U)',
                text: 'ÐÐ¾Ð´ÑÐµÑÑÐ°Ð²Ð° Ð¸Ð·Ð±ÑÐ°Ð½Ð¸Ñ ÑÐµÐºÑÑ.',
                cls: Ext.baseCSSPrefix + 'html-editor-tip'
            },
            increasefontsize: {
                title: 'Ð£Ð³Ð¾Ð»ÐµÐ¼Ð¸ ÑÐµÐºÑÑÐ°',
                text: 'Ð£Ð³Ð¾Ð»ÐµÐ¼ÑÐ²Ð° ÑÐ°Ð·Ð¼ÐµÑÐ° Ð½Ð° ÑÑÐ¸ÑÑÐ°.',
                cls: Ext.baseCSSPrefix + 'html-editor-tip'
            },
            decreasefontsize: {
                title: 'ÐÐ°Ð¼Ð°Ð»Ð¸ ÑÐµÐºÑÑÐ°',
                text: 'ÐÐ°Ð¼Ð°Ð»ÑÐ²Ð° ÑÐ°Ð·Ð¼ÐµÑÐ° Ð½Ð° ÑÑÐ¸ÑÑÐ°.',
                cls: Ext.baseCSSPrefix + 'html-editor-tip'
            },
            backcolor: {
                title: 'Ð¦Ð²ÑÑ Ð½Ð° Ð¼Ð°ÑÐºÐ¸ÑÐ°Ð½Ð¸Ñ ÑÐµÐºÑÑ',
                text: 'ÐÑÐ¾Ð¼ÐµÐ½Ñ ÑÐ¾Ð½Ð¾Ð²Ð¸Ñ ÑÐ²ÑÑ Ð½Ð° Ð¸Ð·Ð±ÑÐ°Ð½Ð¸Ñ ÑÐµÐºÑÑ.',
                cls: Ext.baseCSSPrefix + 'html-editor-tip'
            },
            forecolor: {
                title: 'Ð¦Ð²ÑÑ Ð½Ð° ÑÑÐ¸ÑÑÐ°',
                text: 'ÐÑÐ¾Ð¼ÐµÐ½Ñ ÑÐ²ÐµÑÐ° Ð½Ð° Ð¸Ð·Ð±ÑÐ°Ð½Ð¸Ñ ÑÐµÐºÑÑ.',
                cls: Ext.baseCSSPrefix + 'html-editor-tip'
            },
            justifyleft: {
                title: 'ÐÑÐ²Ð¾ Ð¿Ð¾Ð´ÑÐ°Ð²Ð½ÑÐ²Ð°Ð½Ðµ',
                text: 'ÐÐ¾Ð´ÑÐ°Ð²Ð½ÑÐ²Ð° ÑÐµÐºÑÑÐ° Ð½Ð° Ð»ÑÐ²Ð¾.',
                cls: Ext.baseCSSPrefix + 'html-editor-tip'
            },
            justifycenter: {
                title: 'Ð¦ÐµÐ½ÑÑÐ¸ÑÐ°Ð½Ðµ',
                text: 'Ð¦ÐµÐ½ÑÑÐ¸ÑÐ° ÑÐµÐºÑÑÐ°.',
                cls: Ext.baseCSSPrefix + 'html-editor-tip'
            },
            justifyright: {
                title: 'ÐÑÑÐ½Ð¾ Ð¿Ð¾Ð´ÑÐ°Ð²Ð½ÑÐ²Ð°Ð½Ðµ',
                text: 'ÐÐ¾Ð´ÑÐ°Ð²Ð½ÑÐ²Ð° ÑÐµÐºÑÑÐ° Ð½Ð° Ð´ÑÑÐ½Ð¾.',
                cls: Ext.baseCSSPrefix + 'html-editor-tip'
            },
            insertunorderedlist: {
                title: 'ÐÐµÐ½Ð¾Ð¼ÐµÑÐ¸ÑÐ°Ð½ ÑÐ¿Ð¸ÑÑÐº',
                text: 'ÐÐ°Ð¿Ð¾ÑÐ²Ð° Ð½ÐµÐ½Ð¾Ð¼ÐµÑÐ¸ÑÐ°Ð½ ÑÐ¿Ð¸ÑÑÐº.',
                cls: Ext.baseCSSPrefix + 'html-editor-tip'
            },
            insertorderedlist: {
                title: 'ÐÐ¾Ð¼ÐµÑÐ¸ÑÐ°Ð½ ÑÐ¿Ð¸ÑÑÐº',
                text: 'ÐÐ°Ð¿Ð¾ÑÐ²Ð° Ð½Ð¾Ð¼ÐµÑÐ¸ÑÐ°Ð½ ÑÐ¿Ð¸ÑÑÐº.',
                cls: Ext.baseCSSPrefix + 'html-editor-tip'
            },
            createlink: {
                title: 'Ð¥Ð¸Ð¿ÐµÑÐ²ÑÑÐ·ÐºÐ°',
                text: 'ÐÑÐµÐ²ÑÑÑÐ° Ð¸Ð·Ð±ÑÐ°Ð½Ð¸Ñ ÑÐµÐºÑÑ Ð² ÑÐ¸Ð¿ÐµÑÐ²ÑÑÐ·ÐºÐ°.',
                cls: Ext.baseCSSPrefix + 'html-editor-tip'
            },
            sourceedit: {
                title: 'Ð ÐµÐ´Ð°ÐºÑÐ¸ÑÐ°Ð½Ðµ Ð½Ð° ÐºÐ¾Ð´Ð°',
                text: 'ÐÑÐµÐ¼Ð¸Ð½Ð°Ð²Ð°Ð½Ðµ Ð² ÑÐµÐ¶Ð¸Ð¼ Ð½Ð° ÑÐµÐ´Ð°ÐºÑÐ¸ÑÐ°Ð½Ðµ Ð½Ð° ÐºÐ¾Ð´Ð°.',
                cls: Ext.baseCSSPrefix + 'html-editor-tip'
            }
        }
    });
});

Ext.define("Ext.locale.bg.grid.header.Container", {
    override: "Ext.grid.header.Container",
    sortAscText: "ÐÐ¾Ð´ÑÐµÐ´Ð¸ Ð² Ð½Ð°ÑÐ°ÑÑÐ²Ð°Ñ ÑÐµÐ´",
    sortDescText: "ÐÐ¾Ð´ÑÐµÐ´Ð¸ Ð² Ð½Ð°Ð¼Ð°Ð»ÑÐ²Ð°Ñ ÑÐµÐ´",
    lockText: "ÐÐ°ÐºÐ»ÑÑÐ¸ ÐºÐ¾Ð»Ð¾Ð½Ð°",
    unlockText: "ÐÑÐºÐ»ÑÑÐ¸ ÐºÐ¾Ð»Ð¾Ð½Ð°",
    columnsText: "ÐÐ¾Ð»Ð¾Ð½Ð¸"
});

Ext.define("Ext.locale.bg.grid.PropertyColumnModel", {
    override: "Ext.grid.PropertyColumnModel",
    nameText: "ÐÐ¼Ðµ",
    valueText: "Ð¡ÑÐ¾Ð¹Ð½Ð¾ÑÑ",
    dateFormat: "d.m.Y"
});

Ext.define("Ext.locale.bg.window.MessageBox", {
    override: "Ext.window.MessageBox",
    buttonText: {
        ok: "OK",
        cancel: "ÐÑÐ¼ÐµÐ½Ð¸",
        yes: "ÐÐ°",
        no: "ÐÐµ"
    }
});

// This is needed until we can refactor all of the locales into individual files
Ext.define("Ext.locale.bg.Component", {
    override: "Ext.Component"
});
