/**
 * Ukrainian translations for ExtJS (UTF-8 encoding)
 *
 * Original translation by zlatko
 * 3 October 2007
 *
 * Updated by dev.ashevchuk@gmail.com
 * 01.09.2009
 */
Ext.onReady(function() {

    if (Ext.Date) {
        Ext.Date.monthNames = ["Ð¡ÑÑÐµÐ½Ñ", "ÐÑÑÐ¸Ð¹", "ÐÐµÑÐµÐ·ÐµÐ½Ñ", "ÐÐ²ÑÑÐµÐ½Ñ", "Ð¢ÑÐ°Ð²ÐµÐ½Ñ", "Ð§ÐµÑÐ²ÐµÐ½Ñ", "ÐÐ¸Ð¿ÐµÐ½Ñ", "Ð¡ÐµÑÐ¿ÐµÐ½Ñ", "ÐÐµÑÐµÑÐµÐ½Ñ", "ÐÐ¾Ð²ÑÐµÐ½Ñ", "ÐÐ¸ÑÑÐ¾Ð¿Ð°Ð´", "ÐÑÑÐ´ÐµÐ½Ñ"];

        Ext.Date.dayNames = ["ÐÐµÐ´ÑÐ»Ñ", "ÐÐ¾Ð½ÐµÐ´ÑÐ»Ð¾Ðº", "ÐÑÐ²ÑÐ¾ÑÐ¾Ðº", "Ð¡ÐµÑÐµÐ´Ð°", "Ð§ÐµÑÐ²ÐµÑ", "ÐâÑÑÐ½Ð¸ÑÑ", "Ð¡ÑÐ±Ð¾ÑÐ°"];
    }

    if (Ext.util && Ext.util.Format) {
        Ext.apply(Ext.util.Format, {
            thousandSeparator: '.',
            decimalSeparator: ',',
            currencySign: '\u20b4',
            // Ukranian Hryvnia
            dateFormat: 'd.m.Y'
        });
    }
});

Ext.define("Ext.locale.ukr.view.View", {
    override: "Ext.view.View",
    emptyText: "<ÐÐ¾ÑÐ¾Ð¶Ð½ÑÐ¾>"
});

Ext.define("Ext.locale.ukr.grid.plugin.DragDrop", {
    override: "Ext.grid.plugin.DragDrop",
    dragText: "{0} Ð¾Ð±ÑÐ°Ð½Ð¸Ñ ÑÑÐ´ÐºÑÐ²"
});

Ext.define("Ext.locale.ukr.tab.Tab", {
    override: "Ext.tab.Tab",
    closeText: "ÐÐ°ÐºÑÐ¸ÑÐ¸ ÑÑ Ð²ÐºÐ»Ð°Ð´ÐºÑ"
});

Ext.define("Ext.locale.ukr.form.field.Base", {
    override: "Ext.form.field.Base",
    invalidText: "Ð¥Ð¸Ð±Ð½Ðµ Ð·Ð½Ð°ÑÐµÐ½Ð½Ñ"
});

// changing the msg text below will affect the LoadMask
Ext.define("Ext.locale.ukr.view.AbstractView", {
    override: "Ext.view.AbstractView",
    loadingText: "ÐÐ°Ð²Ð°Ð½ÑÐ°Ð¶ÐµÐ½Ð½Ñ..."
});

Ext.define("Ext.locale.ukr.picker.Date", {
    override: "Ext.picker.Date",
    todayText: "Ð¡ÑÐ¾Ð³Ð¾Ð´Ð½Ñ",
    minText: "Ð¦Ñ Ð´Ð°ÑÐ° Ð¼ÐµÐ½ÑÑÐ° Ð·Ð° Ð¼ÑÐ½ÑÐ¼Ð°Ð»ÑÐ½Ñ Ð´Ð¾Ð¿ÑÑÑÐ¸Ð¼Ñ Ð´Ð°ÑÑ",
    maxText: "Ð¦Ñ Ð´Ð°ÑÐ° Ð±ÑÐ»ÑÑÐ° Ð·Ð° Ð¼Ð°ÐºÑÐ¸Ð¼Ð°Ð»ÑÐ½Ñ Ð´Ð¾Ð¿ÑÑÑÐ¸Ð¼Ñ Ð´Ð°ÑÑ",
    disabledDaysText: "",
    disabledDatesText: "",
    nextText: 'ÐÐ°ÑÑÑÐ¿Ð½Ð¸Ð¹ Ð¼ÑÑÑÑÑ (Control+ÐÐ¿ÑÐ°Ð²Ð¾)',
    prevText: 'ÐÐ¾Ð¿ÐµÑÐµÐ´Ð½ÑÐ¹ Ð¼ÑÑÑÑÑ (Control+ÐÐ»ÑÐ²Ð¾)',
    monthYearText: 'ÐÐ¸Ð±ÑÑ Ð¼ÑÑÑÑÑ (Control+ÐÐ²ÐµÑÑ/ÐÐ½Ð¸Ð· Ð´Ð»Ñ Ð²Ð¸Ð±Ð¾ÑÑ ÑÐ¾ÐºÑ)',
    todayTip: "{0} (ÐÑÐ¾Ð±ÑÐ»)",
    format: "d.m.y",
    startDay: 1
});

Ext.define("Ext.locale.ukr.picker.Month", {
    override: "Ext.picker.Month",
    okText: "&#160;OK&#160;",
    cancelText: "ÐÑÐ´Ð¼ÑÐ½Ð°"
});

Ext.define("Ext.locale.ukr.toolbar.Paging", {
    override: "Ext.PagingToolbar",
    beforePageText: "Ð¡ÑÐ¾ÑÑÐ½ÐºÐ°",
    afterPageText: "Ð· {0}",
    firstText: "ÐÐµÑÑÐ° ÑÑÐ¾ÑÑÐ½ÐºÐ°",
    prevText: "ÐÐ¾Ð¿ÐµÑÐµÐ´Ð½Ñ ÑÑÐ¾ÑÑÐ½ÐºÐ°",
    nextText: "ÐÐ°ÑÑÑÐ¿Ð½Ð° ÑÑÐ¾ÑÑÐ½ÐºÐ°",
    lastText: "ÐÑÑÐ°Ð½Ð½Ñ ÑÑÐ¾ÑÑÐ½ÐºÐ°",
    refreshText: "ÐÑÐ²ÑÐ¶Ð¸ÑÐ¸",
    displayMsg: "ÐÑÐ´Ð¾Ð±ÑÐ°Ð¶ÐµÐ½Ð½Ñ Ð·Ð°Ð¿Ð¸ÑÑÐ² Ð· {0} Ð¿Ð¾ {1}, Ð²ÑÑÐ¾Ð³Ð¾ {2}",
    emptyMsg: 'ÐÐ°Ð½Ñ Ð´Ð»Ñ Ð²ÑÐ´Ð¾Ð±ÑÐ°Ð¶ÐµÐ½Ð½Ñ Ð²ÑÐ´ÑÑÑÐ½Ñ'
});

Ext.define("Ext.locale.ukr.form.field.Text", {
    override: "Ext.form.field.Text",
    minLengthText: "ÐÑÐ½ÑÐ¼Ð°Ð»ÑÐ½Ð° Ð´Ð¾Ð²Ð¶Ð¸Ð½Ð° ÑÑÐ¾Ð³Ð¾ Ð¿Ð¾Ð»Ñ {0}",
    maxLengthText: "ÐÐ°ÐºÑÐ¸Ð¼Ð°Ð»ÑÐ½Ð° Ð´Ð¾Ð²Ð¶Ð¸Ð½Ð° ÑÑÐ¾Ð³Ð¾ Ð¿Ð¾Ð»Ñ {0}",
    blankText: "Ð¦Ðµ Ð¿Ð¾Ð»Ðµ Ñ Ð¾Ð±Ð¾Ð²âÑÐ·ÐºÐ¾Ð²Ð¸Ð¼ Ð´Ð»Ñ Ð·Ð°Ð¿Ð¾Ð²Ð½ÐµÐ½Ð½Ñ",
    regexText: "",
    emptyText: null
});

Ext.define("Ext.locale.ukr.form.field.Number", {
    override: "Ext.form.field.Number",
    minText: "ÐÐ½Ð°ÑÐµÐ½Ð½Ñ Ñ ÑÑÐ¾Ð¼Ñ Ð¿Ð¾Ð»Ñ Ð½Ðµ Ð¼Ð¾Ð¶Ðµ Ð±ÑÑÐ¸ Ð¼ÐµÐ½ÑÑÐµ {0}",
    maxText: "ÐÐ½Ð°ÑÐµÐ½Ð½Ñ Ñ ÑÑÐ¾Ð¼Ñ Ð¿Ð¾Ð»Ñ Ð½Ðµ Ð¼Ð¾Ð¶Ðµ Ð±ÑÑÐ¸ Ð±ÑÐ»ÑÑÐµ {0}",
    nanText: "{0} Ð½Ðµ Ñ ÑÐ¸ÑÐ»Ð¾Ð¼"
});

Ext.define("Ext.locale.ukr.form.field.Date", {
    override: "Ext.form.field.Date",
    disabledDaysText: "ÐÐµ Ð´Ð¾ÑÑÑÐ¿Ð½Ð¾",
    disabledDatesText: "ÐÐµ Ð´Ð¾ÑÑÑÐ¿Ð½Ð¾",
    minText: "ÐÐ°ÑÐ° Ñ ÑÑÐ¾Ð¼Ñ Ð¿Ð¾Ð»Ñ Ð¿Ð¾Ð²Ð¸Ð½Ð½Ð° Ð±ÑÑÐ¸ Ð±ÑÐ»ÑÑÐ° {0}",
    maxText: "ÐÐ°ÑÐ° Ñ ÑÑÐ¾Ð¼Ñ Ð¿Ð¾Ð»Ñ Ð¿Ð¾Ð²Ð¸Ð½Ð½Ð° Ð±ÑÑÐ¸ Ð¼ÐµÐ½ÑÑÐ° {0}",
    invalidText: "{0} ÑÐ¸Ð±Ð½Ð° Ð´Ð°ÑÐ° - Ð´Ð°ÑÐ° Ð¿Ð¾Ð²Ð¸Ð½Ð½Ð° Ð±ÑÑÐ¸ Ð²ÐºÐ°Ð·Ð°Ð½Ð° Ñ ÑÐ¾ÑÐ¼Ð°ÑÑ {1}",
    format: "d.m.y"
});

Ext.define("Ext.locale.ukr.form.field.ComboBox", {
    override: "Ext.form.field.ComboBox",
    valueNotFoundText: undefined
}, function() {
    Ext.apply(Ext.form.field.ComboBox.prototype.defaultListConfig, {
        loadingText: "ÐÐ°Ð²Ð°Ð½ÑÐ°Ð¶ÐµÐ½Ð½Ñ..."
    });
});

Ext.define("Ext.locale.ukr.form.field.VTypes", {
    override: "Ext.form.field.VTypes",
    emailText: 'Ð¦Ðµ Ð¿Ð¾Ð»Ðµ Ð¿Ð¾Ð²Ð¸Ð½Ð½Ð¾ Ð¼ÑÑÑÐ¸ÑÐ¸ Ð°Ð´ÑÐµÑÑ ÐµÐ»ÐµÐºÑÑÐ¾Ð½Ð½Ð¾Ñ Ð¿Ð¾ÑÑÐ¸ Ñ ÑÐ¾ÑÐ¼Ð°ÑÑ "user@example.com"',
    urlText: 'Ð¦Ðµ Ð¿Ð¾Ð»Ðµ Ð¿Ð¾Ð²Ð¸Ð½Ð½Ð¾ Ð¼ÑÑÑÐ¸ÑÐ¸ URL Ñ ÑÐ¾ÑÐ¼Ð°ÑÑ "http:/' + '/www.example.com"',
    alphaText: 'Ð¦Ðµ Ð¿Ð¾Ð»Ðµ Ð¿Ð¾Ð²Ð¸Ð½Ð½Ð¾ Ð¼ÑÑÑÐ¸ÑÐ¸ Ð²Ð¸ÐºÐ»ÑÑÐ½Ð¾ Ð»Ð°ÑÐ¸Ð½ÑÑÐºÑ Ð»ÑÑÐµÑÐ¸ ÑÐ° ÑÐ¸Ð¼Ð²Ð¾Ð» Ð¿ÑÐ´ÐºÑÐµÑÐ»ÐµÐ½Ð½Ñ "_"',
    alphanumText: 'Ð¦Ðµ Ð¿Ð¾Ð»Ðµ Ð¿Ð¾Ð²Ð¸Ð½Ð½Ð¾ Ð¼ÑÑÑÐ¸ÑÐ¸ Ð²Ð¸ÐºÐ»ÑÑÐ½Ð¾ Ð»Ð°ÑÐ¸Ð½ÑÑÐºÑ Ð»ÑÑÐµÑÐ¸, ÑÐ¸ÑÑÐ¸ ÑÐ° ÑÐ¸Ð¼Ð²Ð¾Ð» Ð¿ÑÐ´ÐºÑÐµÑÐ»ÐµÐ½Ð½Ñ "_"'
});

Ext.define("Ext.locale.ukr.form.field.HtmlEditor", {
    override: "Ext.form.field.HtmlEditor",
    createLinkText: 'ÐÑÐ´Ñ-Ð»Ð°ÑÐºÐ° Ð²Ð²ÐµÐ´ÑÑÑ Ð°Ð´ÑÐµÑÑ:'
}, function() {
    Ext.apply(Ext.form.field.HtmlEditor.prototype, {
        buttonTips: {
            bold: {
                title: 'ÐÐ°Ð¿ÑÐ²Ð¶Ð¸ÑÐ½Ð¸Ð¹ (Ctrl+B)',
                text: 'ÐÑÐ¾Ð±Ð¸ÑÐ¸ Ð½Ð°Ð¿ÑÐ²Ð¶Ð¸ÑÐ½Ð¸Ð¼ Ð²Ð¸Ð´ÑÐ»ÐµÐ½Ð¸Ð¹ ÑÐµÐºÑÑ.',
                cls: Ext.baseCSSPrefix + 'html-editor-tip'
            },
            italic: {
                title: 'ÐÑÑÑÐ¸Ð² (Ctrl+I)',
                text: 'ÐÑÐ¾Ð±Ð¸ÑÐ¸ ÐºÑÑÑÐ¸Ð²Ð¾Ð¼ Ð²Ð¸Ð´ÑÐ»ÐµÐ½Ð¸Ð¹ ÑÐµÐºÑÑ.',
                cls: Ext.baseCSSPrefix + 'html-editor-tip'
            },
            underline: {
                title: 'ÐÑÐ´ÐºÑÐµÑÐ»ÐµÐ½Ð¸Ð¹ (Ctrl+U)',
                text: 'ÐÑÐ¾Ð±Ð¸ÑÐ¸ Ð¿ÑÐ´ÐºÑÐµÑÐ»ÐµÐ½Ð¸Ð¼ Ð²Ð¸Ð´ÑÐ»ÐµÐ½Ð¸Ð¹ ÑÐµÐºÑÑ.',
                cls: Ext.baseCSSPrefix + 'html-editor-tip'
            },
            increasefontsize: {
                title: 'ÐÐ±ÑÐ»ÑÑÐ¸ÑÐ¸ ÑÐ¾Ð·Ð¼ÑÑ',
                text: 'ÐÐ±ÑÐ»ÑÑÐ¸ÑÐ¸ ÑÐ¾Ð·Ð¼ÑÑ ÑÑÐ¸ÑÑÐ°.',
                cls: Ext.baseCSSPrefix + 'html-editor-tip'
            },
            decreasefontsize: {
                title: 'ÐÐ¼ÐµÐ½ÑÑÐ¸ÑÐ¸ ÑÐ¾Ð·Ð¼ÑÑ',
                text: 'ÐÐ¼ÐµÐ½ÑÑÐ¸ÑÐ¸ ÑÐ¾Ð·Ð¼ÑÑ ÑÑÐ¸ÑÑÐ°.',
                cls: Ext.baseCSSPrefix + 'html-editor-tip'
            },
            backcolor: {
                title: 'ÐÐ°Ð»Ð¸Ð²ÐºÐ°',
                text: 'ÐÐ¼ÑÐ½Ð¸ÑÐ¸ ÐºÐ¾Ð»ÑÑ ÑÐ¾Ð½Ñ Ð´Ð»Ñ Ð²Ð¸Ð´ÑÐ»ÐµÐ½Ð¾Ð³Ð¾ ÑÐµÐºÑÑÑ Ð°Ð±Ð¾ Ð°Ð±Ð·Ð°ÑÑ.',
                cls: Ext.baseCSSPrefix + 'html-editor-tip'
            },
            forecolor: {
                title: 'ÐÐ¾Ð»ÑÑ ÑÐµÐºÑÑÑ',
                text: 'ÐÐ¼ÑÐ½Ð¸ÑÐ¸ ÐºÐ¾Ð»ÑÑ Ð²Ð¸Ð´ÑÐ»ÐµÐ½Ð¾Ð³Ð¾ ÑÐµÐºÑÑÑ Ð°Ð±Ð¾ Ð°Ð±Ð·Ð°ÑÑ.',
                cls: Ext.baseCSSPrefix + 'html-editor-tip'
            },
            justifyleft: {
                title: 'ÐÐ¸ÑÑÐ²Ð½ÑÑÐ¸ ÑÐµÐºÑÑ Ð¿Ð¾ Ð»ÑÐ²Ð¾Ð¼Ñ Ð¿Ð¾Ð»Ñ',
                text: 'ÐÐ¸ÑÑÐ²Ð½ÑÐ²Ð°Ð½Ð½Ñ ÑÐµÐºÑÑÑ Ð¿Ð¾ Ð»ÑÐ²Ð¾Ð¼Ñ Ð¿Ð¾Ð»Ñ.',
                cls: Ext.baseCSSPrefix + 'html-editor-tip'
            },
            justifycenter: {
                title: 'ÐÐ¸ÑÑÐ²Ð½ÑÑÐ¸ ÑÐµÐºÑÑ Ð¿Ð¾ ÑÐµÐ½ÑÑÑ',
                text: 'ÐÐ¸ÑÑÐ²Ð½ÑÐ²Ð°Ð½Ð½Ñ ÑÐµÐºÑÑÑ Ð¿Ð¾ ÑÐµÐ½ÑÑÑ.',
                cls: Ext.baseCSSPrefix + 'html-editor-tip'
            },
            justifyright: {
                title: 'ÐÐ¸ÑÑÐ²Ð½ÑÑÐ¸ ÑÐµÐºÑÑ Ð¿Ð¾ Ð¿ÑÐ°Ð²Ð¾Ð¼Ñ Ð¿Ð¾Ð»Ñ',
                text: 'ÐÐ¸ÑÑÐ²Ð½ÑÐ²Ð°Ð½Ð½Ñ ÑÐµÐºÑÑÑ Ð¿Ð¾ Ð¿ÑÐ°Ð²Ð¾Ð¼Ñ Ð¿Ð¾Ð»Ñ.',
                cls: Ext.baseCSSPrefix + 'html-editor-tip'
            },
            insertunorderedlist: {
                title: 'ÐÐ°ÑÐºÐµÑÐ¸',
                text: 'ÐÐ¾ÑÐ°ÑÐ¸ Ð¼Ð°ÑÐºÐ¾Ð²Ð°Ð½Ð¸Ð¹ ÑÐ¿Ð¸ÑÐ¾Ðº.',
                cls: Ext.baseCSSPrefix + 'html-editor-tip'
            },
            insertorderedlist: {
                title: 'ÐÑÐ¼ÐµÑÐ°ÑÑÑ',
                text: 'ÐÐ¾ÑÐ°ÑÐ¸ Ð½ÑÐ¼ÐµÑÐ½Ð¾Ð²Ð°Ð½Ð¸Ð¹ ÑÐ¿Ð¸ÑÐ¾Ðº.',
                cls: Ext.baseCSSPrefix + 'html-editor-tip'
            },
            createlink: {
                title: 'ÐÑÑÐ°Ð²Ð¸ÑÐ¸ Ð³ÑÐ¿ÐµÑÐ¿Ð¾ÑÐ¸Ð»Ð°Ð½Ð½Ñ',
                text: 'Ð¡ÑÐ²Ð¾ÑÐµÐ½Ð½Ñ Ð¿Ð¾ÑÐ¸Ð»Ð°Ð½Ð½Ñ ÑÐ· Ð²Ð¸Ð´ÑÐ»ÐµÐ½Ð¾Ð³Ð¾ ÑÐµÐºÑÑÑ.',
                cls: Ext.baseCSSPrefix + 'html-editor-tip'
            },
            sourceedit: {
                title: 'ÐÐ¶ÐµÑÐµÐ»ÑÐ½Ð¸Ð¹ ÐºÐ¾Ð´',
                text: 'Ð ÐµÐ¶Ð¸Ð¼ ÑÐµÐ´Ð°Ð³ÑÐ²Ð°Ð½Ð½Ñ Ð´Ð¶ÐµÑÐµÐ»ÑÐ½Ð¾Ð³Ð¾ ÐºÐ¾Ð´Ñ.',
                cls: Ext.baseCSSPrefix + 'html-editor-tip'
            }
        }
    });
});

Ext.define("Ext.locale.ukr.grid.header.Container", {
    override: "Ext.grid.header.Container",
    sortAscText: "Ð¡Ð¾ÑÑÑÐ²Ð°ÑÐ¸ Ð¿Ð¾ Ð·ÑÐ¾ÑÑÐ°Ð½Ð½Ñ",
    sortDescText: "Ð¡Ð¾ÑÑÑÐ²Ð°ÑÐ¸ Ð¿Ð¾ ÑÐ¿Ð°Ð´Ð°Ð½Ð½Ñ",
    lockText: "ÐÐ°ÐºÑÑÐ¿Ð¸ÑÐ¸ ÑÑÐ¾Ð²Ð¿ÐµÑÑ",
    unlockText: "ÐÑÐ´ÐºÑÑÐ¿Ð¸ÑÐ¸ ÑÑÐ¾Ð²Ð¿ÐµÑÑ",
    columnsText: "Ð¡ÑÐ¾Ð²Ð¿ÑÑ"
});

Ext.define("Ext.locale.ukr.grid.PropertyColumnModel", {
    override: "Ext.grid.PropertyColumnModel",
    nameText: "ÐÐ°Ð·Ð²Ð°",
    valueText: "ÐÐ½Ð°ÑÐµÐ½Ð½Ñ",
    dateFormat: "j.m.Y"
});

Ext.define("Ext.locale.ukr.window.MessageBox", {
    override: "Ext.window.MessageBox",
    buttonText: {
        ok: "OK",
        cancel: "ÐÑÐ´Ð¼ÑÐ½Ð°",
        yes: "Ð¢Ð°Ðº",
        no: "ÐÑ"
    }
});

// This is needed until we can refactor all of the locales into individual files
Ext.define("Ext.locale.ukr.Component", {
    override: "Ext.Component"
});
