/**
 * Greek translation
 * By thesilentman (utf8 encoding)
 * 27 Apr 2008
 *
 * Changes since previous (second) Version:
 * + added Ext.Date.shortMonthNames
 * + added Ext.Date.getShortMonthName
 * + added Ext.Date.monthNumbers
 * + added Ext.grid.feature.Grouping
 */
Ext.onReady(function() {

    if (Ext.Date) {
        Ext.Date.monthNames = ["ÎÎ±Î½Î¿ÏÎ¬ÏÎ¹Î¿Ï", "Î¦ÎµÎ²ÏÎ¿ÏÎ¬ÏÎ¹Î¿Ï", "ÎÎ¬ÏÏÎ¹Î¿Ï", "ÎÏÏÎ¯Î»Î¹Î¿Ï", "ÎÎ¬Î¹Î¿Ï", "ÎÎ¿ÏÎ½Î¹Î¿Ï", "ÎÎ¿ÏÎ»Î¹Î¿Ï", "ÎÏÎ³Î¿ÏÏÏÎ¿Ï", "Î£ÎµÏÏÎ­Î¼Î²ÏÎ¹Î¿Ï", "ÎÎºÏÏÎ²ÏÎ¹Î¿Ï", "ÎÎ¿Î­Î¼Î²ÏÎ¹Î¿Ï", "ÎÎµÎºÎ­Î¼Î²ÏÎ¹Î¿Ï"];

        Ext.Date.shortMonthNames = ["ÎÎ±Î½", "Î¦ÎµÎ²", "ÎÎ¬Ï", "ÎÏÏ", "ÎÎ¬Î¹", "ÎÎ¿Ï", "ÎÎ¿Ï", "ÎÏÎ³", "Î£ÎµÏ", "ÎÎºÏ", "ÎÎ¿Î­", "ÎÎµÎº"];

        Ext.Date.getShortMonthName = function(month) {
            return Ext.Date.monthNames[month].substring(0, 3);
        };

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

        Ext.Date.getMonthNumber = function(name) {
            return Ext.Date.monthNumbers[name.substring(0, 1).toUpperCase() + name.substring(1, 3).toLowerCase()];
        };

        Ext.Date.dayNames = ["ÎÏÏÎ¹Î±ÎºÎ®", "ÎÎµÏÏÎ­ÏÎ±", "Î¤ÏÎ¯ÏÎ·", "Î¤ÎµÏÎ¬ÏÏÎ·", "Î Î­Î¼ÏÏÎ·", "Î Î±ÏÎ±ÏÎºÎµÏÎ®", "Î£Î¬Î²Î²Î±ÏÎ¿"];
    }

    if (Ext.util && Ext.util.Format) {
        Ext.apply(Ext.util.Format, {
            thousandSeparator: '.',
            decimalSeparator: ',',
            currencySign: '\u20ac',
            // Greek Euro
            dateFormat: 'd/m/Y'
        });
    }
});

Ext.define("Ext.locale.el_GR.view.View", {
    override: "Ext.view.View",
    emptyText: ""
});

Ext.define("Ext.locale.el_GR.grid.plugin.DragDrop", {
    override: "Ext.grid.plugin.DragDrop",
    dragText: "{0} ÎÏÎ¹Î»ÎµÎ³Î¼Î­Î½ÎµÏ ÏÎµÎ¹ÏÎ­Ï"
});

Ext.define("Ext.locale.el_GR.tab.Tab", {
    override: "Ext.tab.Tab",
    closeText: "ÎÎ»ÎµÎ¯ÏÏÎµ ÏÎ¿ tab"
});

Ext.define("Ext.locale.el_GR.form.field.Base", {
    override: "Ext.form.field.Base",
    invalidText: "Î¤Î¿ ÏÎµÏÎ¹ÎµÏÏÎ¼ÎµÎ½Î¿ ÏÎ¿Ï ÏÎµÎ´Î¯Î¿Ï Î´ÎµÎ½ ÎµÎ¯Î½Î±Î¹ Î±ÏÎ¿Î´ÎµÎºÏÏ"
});

// changing the msg text below will affect the LoadMask
Ext.define("Ext.locale.el_GR.view.AbstractView", {
    override: "Ext.view.AbstractView",
    loadingText: "ÎÎµÏÎ±ÏÏÏÏÏÏÎ· Î´ÎµÎ´Î¿Î¼Î­Î½ÏÎ½..."
});

Ext.define("Ext.locale.el_GR.picker.Date", {
    override: "Ext.picker.Date",
    todayText: "Î£Î®Î¼ÎµÏÎ±",
    minText: "Î ÎÎ¼ÎµÏÎ¿Î¼Î·Î½Î¯Î± ÎµÎ¯Î½Î±Î¹ ÏÏÎ¿Î³ÎµÎ½Î­ÏÏÎµÏÎ· Î±ÏÏ ÏÎ·Î½ ÏÎ±Î»Î±Î¹ÏÏÎµÏÎ· Î±ÏÎ¿Î´ÎµÎºÏÎ®",
    maxText: "Î ÎÎ¼ÎµÏÎ¿Î¼Î·Î½Î¯Î± ÎµÎ¯Î½Î±Î¹ Î¼ÎµÏÎ±Î³ÎµÎ½Î­ÏÏÎµÏÎ· Î±ÏÏ ÏÎ·Î½ Î½ÎµÏÏÎµÏÎ· Î±ÏÎ¿Î´ÎµÎºÏÎ®",
    disabledDaysText: "",
    disabledDatesText: "",
    nextText: 'ÎÏÏÎ¼ÎµÎ½Î¿Ï ÎÎ®Î½Î±Ï (Control+ÎÎµÎ¾Î¯ ÎÎ­Î»Î¿Ï)',
    prevText: 'Î ÏÎ¿Î·Î³Î¿ÏÎ¼ÎµÎ½Î¿Ï ÎÎ®Î½Î±Ï (Control + ÎÏÎ¹ÏÏÎµÏÏ ÎÎ­Î»Î¿Ï)',
    monthYearText: 'ÎÏÎ¹Î»Î¿Î³Î® ÎÎ·Î½ÏÏ (Control + ÎÏÎ¬Î½Ï/ÎÎ¬ÏÏ ÎÎ­Î»Î¿Ï Î³Î¹Î± Î¼ÎµÏÎ±Î²Î¿Î»Î® ÎµÏÏÎ½)',
    todayTip: "{0} (Î ÎÎ®ÎºÏÏÎ¿ ÎÎ¹Î±ÏÏÎ®Î¼Î±ÏÎ¿Ï)",
    format: "d/m/y"
});

Ext.define("Ext.locale.el_GR.toolbar.Paging", {
    override: "Ext.PagingToolbar",
    beforePageText: "Î£ÎµÎ»Î¯Î´Î±",
    afterPageText: "Î±ÏÏ {0}",
    firstText: "Î ÏÏÏÎ· Î£ÎµÎ»Î¯Î´Î±",
    prevText: "Î ÏÎ¿Î·Î³Î¿ÏÎ¼ÎµÎ½Î· Î£ÎµÎ»Î¯Î´Î±",
    nextText: "ÎÏÏÎ¼ÎµÎ½Î· Î£ÎµÎ»Î¯Î´Î±",
    lastText: "Î¤ÎµÎ»ÎµÏÏÎ±Î¯Î± Î£ÎµÎ»Î¯Î´Î±",
    refreshText: "ÎÎ½Î±Î½Î­ÏÏÎ·",
    displayMsg: "ÎÎ¼ÏÎ¬Î½Î¹ÏÎ· {0} - {1} Î±ÏÏ {2}",
    emptyMsg: 'ÎÎµÎ½ ÏÏÎ¬ÏÏÎ¿ÏÎ½ Î´ÎµÎ´Î¿Î¼Î­Î½Î±'
});

Ext.define("Ext.locale.el_GR.form.field.Text", {
    override: "Ext.form.field.Text",
    minLengthText: "Î¤Î¿ Î¼Î¹ÎºÏÏÏÎµÏÎ¿ Î±ÏÎ¿Î´ÎµÎºÏÏ Î¼Î®ÎºÎ¿Ï Î³Î¹Î± ÏÎ¿ ÏÎµÎ´Î¯Î¿ ÎµÎ¯Î½Î±Î¹ {0}",
    maxLengthText: "Î¤Î¿ Î¼ÎµÎ³Î±Î»ÏÏÎµÏÎ¿ Î±ÏÎ¿Î´ÎµÎºÏÏ Î¼Î®ÎºÎ¿Ï Î³Î¹Î± ÏÎ¿ ÏÎµÎ´Î¯Î¿ ÎµÎ¯Î½Î±Î¹ {0}",
    blankText: "Î¤Î¿ ÏÎµÎ´Î¯Î¿ ÎµÎ¯Î½Î±Î¹ ÏÏÎ¿ÏÏÎµÏÏÎ¹ÎºÏ",
    regexText: "",
    emptyText: null
});

Ext.define("Ext.locale.el_GR.form.field.Number", {
    override: "Ext.form.field.Number",
    minText: "Î Î¼Î¹ÎºÏÏÏÎµÏÎ· ÏÎ¹Î¼Î® ÏÎ¿Ï ÏÎµÎ´Î¯Î¿Ï ÎµÎ¯Î½Î±Î¹ {0}",
    maxText: "Î Î¼ÎµÎ³Î±Î»ÏÏÎµÏÎ· ÏÎ¹Î¼Î® ÏÎ¿Ï ÏÎµÎ´Î¯Î¿Ï ÎµÎ¯Î½Î±Î¹ {0}",
    nanText: "{0} Î´ÎµÎ½ ÎµÎ¯Î½Î±Î¹ Î±ÏÎ¿Î´ÎµÎºÏÏÏ Î±ÏÎ¹Î¸Î¼ÏÏ"
});

Ext.define("Ext.locale.el_GR.form.field.Date", {
    override: "Ext.form.field.Date",
    disabledDaysText: "ÎÎ½ÎµÎ½ÎµÏÎ³Ï",
    disabledDatesText: "ÎÎ½ÎµÎ½ÎµÏÎ³Ï",
    minText: "Î Î·Î¼ÎµÏÎ¿Î¼Î·Î½Î¯Î± Î±ÏÏÎ¿Ï ÏÎ¿Ï ÏÎµÎ´Î¯Î¿Ï ÏÏÎ­ÏÎµÎ¹ Î½Î± ÎµÎ¯Î½Î±Î¹ Î¼ÎµÏÎ¬ ÏÎ·Î½ {0}",
    maxText: "Î Î·Î¼ÎµÏÎ¿Î¼Î·Î½Î¯Î± Î±ÏÏÎ¿Ï ÏÎ¿Ï ÏÎµÎ´Î¯Î¿Ï ÏÏÎ­ÏÎµÎ¹ Î½Î± ÎµÎ¯Î½Î±Î¹ ÏÏÎ¹Î½ ÏÎ·Î½ {0}",
    invalidText: "{0} Î´ÎµÎ½ ÎµÎ¯Î½Î±Î¹ Î­Î³ÎºÏÏÎ· Î·Î¼ÎµÏÎ¿Î¼Î·Î½Î¯Î± - ÏÏÎ­ÏÎµÎ¹ Î½Î± ÎµÎ¯Î½Î±Î¹ ÏÏÎ· Î¼Î¿ÏÏÎ® {1}",
    format: "d/m/y"
});

Ext.define("Ext.locale.el_GR.form.field.ComboBox", {
    override: "Ext.form.field.ComboBox",
    valueNotFoundText: undefined
}, function() {
    Ext.apply(Ext.form.field.ComboBox.prototype.defaultListConfig, {
        loadingText: "ÎÎµÏÎ±ÏÏÏÏÏÏÎ· Î´ÎµÎ´Î¿Î¼Î­Î½ÏÎ½..."
    });
});

Ext.define("Ext.locale.el_GR.form.field.VTypes", {
    override: "Ext.form.field.VTypes",
    emailText: 'Î¤Î¿ ÏÎµÎ´Î¯Î¿ Î´Î­ÏÎµÏÎ±Î¹ Î¼ÏÎ½Î¿ Î´Î¹ÎµÏÎ¸ÏÎ½ÏÎµÎ¹Ï Email ÏÎµ Î¼Î¿ÏÏÎ® "user@example.com"',
    urlText: 'Î¤Î¿ ÏÎµÎ´Î¯Î¿ Î´Î­ÏÎµÏÎ±Î¹ Î¼ÏÎ½Î¿ URL ÏÎµ Î¼Î¿ÏÏÎ® "http:/' + '/www.example.com"',
    alphaText: 'Î¤Î¿ ÏÎµÎ´Î¯Î¿ Î´Î­ÏÎµÏÎ±Î¹ Î¼ÏÎ½Î¿ ÏÎ±ÏÎ±ÎºÏÎ®ÏÎµÏ ÎºÎ±Î¹ _',
    alphanumText: 'Î¤Î¿ ÏÎµÎ´Î¯Î¿ Î´Î­ÏÎµÏÎ±Î¹ Î¼ÏÎ½Î¿ ÏÎ±ÏÎ±ÎºÏÎ®ÏÎµÏ, Î±ÏÎ¹Î¸Î¼Î¿ÏÏ ÎºÎ±Î¹ _'
});

Ext.define("Ext.locale.el_GR.form.field.HtmlEditor", {
    override: "Ext.form.field.HtmlEditor",
    createLinkText: 'ÎÏÏÏÎµ ÏÎ· Î´Î¹ÎµÏÎ¸ÏÎ½ÏÎ· (URL) Î³Î¹Î± ÏÎ¿ ÏÏÎ½Î´ÎµÏÎ¼Î¿ (link):'
}, function() {
    Ext.apply(Ext.form.field.HtmlEditor.prototype, {
        buttonTips: {
            bold: {
                title: 'ÎÎ½ÏÎ¿Î½Î± (Ctrl+B)',
                text: 'ÎÎ¬Î½ÎµÏÎµ ÏÎ¿ ÏÏÎ¿ÎµÏÎ¹Î»ÎµÎ³Î¼Î­Î½Î¿ ÎºÎµÎ¯Î¼ÎµÎ½Î¿ Î­Î½ÏÎ¿Î½Î¿.',
                cls: Ext.baseCSSPrefix + 'html-editor-tip'
            },
            italic: {
                title: 'Î Î»Î¬Î³Î¹Î± (Ctrl+I)',
                text: 'ÎÎ¬Î½ÎµÏÎµ ÏÎ¿ ÏÏÎ¿ÎµÏÎ¹Î»ÎµÎ³Î¼Î­Î½Î¿ ÎºÎµÎ¯Î¼ÎµÎ½Î¿ ÏÎ»Î¬Î³Î¹Î¿.',
                cls: Ext.baseCSSPrefix + 'html-editor-tip'
            },
            underline: {
                title: 'Î¥ÏÎ¿Î³ÏÎ¬Î¼Î¼Î¹ÏÎ· (Ctrl+U)',
                text: 'Î¥ÏÎ¿Î³ÏÎ±Î¼Î¼Î¯Î¶ÎµÏÎµ ÏÎ¿ ÏÏÎ¿ÎµÏÎ¹Î»ÎµÎ³Î¼Î­Î½Î¿ ÎºÎµÎ¯Î¼ÎµÎ½Î¿.',
                cls: Ext.baseCSSPrefix + 'html-editor-tip'
            },
            increasefontsize: {
                title: 'ÎÎµÎ³Î­Î¸ÏÎ½ÏÎ· ÎºÎµÎ¹Î¼Î­Î½Î¿Ï',
                text: 'ÎÎµÎ³Î±Î»ÏÎ½ÎµÏÎµ ÏÎ· Î³ÏÎ±Î¼Î¼Î±ÏÎ¿ÏÎµÎ¹ÏÎ¬.',
                cls: Ext.baseCSSPrefix + 'html-editor-tip'
            },
            decreasefontsize: {
                title: 'Î£Î¼Î¯ÎºÏÏÎ½ÏÎ· ÎºÎµÎ¹Î¼Î­Î½Î¿Ï',
                text: 'ÎÎ¹ÎºÏÎ±Î¯Î½ÎµÏÎµ ÏÎ· Î³ÏÎ±Î¼Î¼Î±ÏÎ¿ÏÎµÎ¹ÏÎ¬.',
                cls: Ext.baseCSSPrefix + 'html-editor-tip'
            },
            backcolor: {
                title: 'Î§ÏÏÎ¼Î± Î¦ÏÎ½ÏÎ¿Ï ÎÎµÎ¹Î¼Î­Î½Î¿Ï',
                text: 'ÎÎ»Î»Î¬Î¶ÎµÏÎµ ÏÎ¿ ÏÏÏÎ¼Î± ÏÏÎ¿ ÏÏÎ½ÏÎ¿ ÏÎ¿Ï ÏÏÎ¿ÎµÏÎ¹Î»ÎµÎ³Î¼Î­Î½Î¿Ï ÎºÎµÎ¹Î¼Î­Î½Î¿Ï.',
                cls: Ext.baseCSSPrefix + 'html-editor-tip'
            },
            forecolor: {
                title: 'Î§ÏÏÎ¼Î± ÎÏÎ±Î¼Î¼Î±ÏÎ¿ÏÎµÎ¹ÏÎ¬Ï',
                text: 'ÎÎ»Î»Î¬Î¶ÎµÏÎµ ÏÎ¿ ÏÏÏÎ¼Î± ÏÏÎ· Î³ÏÎ±Î¼Î¼Î±ÏÎ¿ÏÎµÎ¹ÏÎ¬ ÏÎ¿Ï ÏÏÎ¿ÎµÏÎ¹Î»ÎµÎ³Î¼Î­Î½Î¿Ï ÎºÎµÎ¹Î¼Î­Î½Î¿Ï.',
                cls: Ext.baseCSSPrefix + 'html-editor-tip'
            },
            justifyleft: {
                title: 'ÎÏÎ¹ÏÏÎµÏÎ® Î£ÏÎ¿Î¯ÏÎ¹ÏÎ· ÎÎµÎ¹Î¼Î­Î½Î¿Ï',
                text: 'Î£ÏÎ¿Î¹ÏÎ¯Î¶ÎµÏÎµ ÏÎ¿ ÎºÎµÎ¯Î¼ÎµÎ½Î¿ ÏÏÎ± Î±ÏÎ¹ÏÏÎµÏÎ¬.',
                cls: Ext.baseCSSPrefix + 'html-editor-tip'
            },
            justifycenter: {
                title: 'ÎÎµÎ½ÏÏÎ¬ÏÎ¹ÏÎ¼Î± ÎÎµÎ¹Î¼Î­Î½Î¿Ï',
                text: 'Î£ÏÎ¿Î¹ÏÎ¯Î¶ÎµÏÎµ ÏÎ¿ ÎºÎµÎ¯Î¼ÎµÎ½Î¿ ÏÏÎ¿ ÎºÎ­Î½ÏÏÎ¿.',
                cls: Ext.baseCSSPrefix + 'html-editor-tip'
            },
            justifyright: {
                title: 'ÎÎµÎ¾Î¹Î¬ Î£ÏÎ¿Î¯ÏÎ¹ÏÎ· ÎÎµÎ¹Î¼Î­Î½Î¿Ï',
                text: 'Î£ÏÎ¿Î¹ÏÎ¯Î¶ÎµÏÎµ ÏÎ¿ ÎºÎµÎ¯Î¼ÎµÎ½Î¿ ÏÏÎ± Î´ÎµÎ¾Î¹Î¬.',
                cls: Ext.baseCSSPrefix + 'html-editor-tip'
            },
            insertunorderedlist: {
                title: 'ÎÎ¹ÏÎ±Î³ÏÎ³Î® ÎÎ¯ÏÏÎ±Ï ÎÎ¿ÏÎºÎ¯Î´ÏÎ½',
                text: 'ÎÎµÎºÎ¹Î½Î®ÏÏÎµ Î¼Î¹Î± Î»Î¯ÏÏÎ± Î¼Îµ ÎºÎ¿ÏÎºÎ¯Î´ÎµÏ.',
                cls: Ext.baseCSSPrefix + 'html-editor-tip'
            },
            insertorderedlist: {
                title: 'ÎÎ¹ÏÎ±Î³ÏÎ³Î® ÎÎ¯ÏÏÎ±Ï ÎÏÎ¯Î¸Î¼Î·ÏÎ·Ï',
                text: 'ÎÎµÎºÎ¹Î½Î®ÏÏÎµ Î¼Î¹Î± Î»Î¯ÏÏÎ± Î¼Îµ Î±ÏÎ¯Î¸Î¼Î·ÏÎ·.',
                cls: Ext.baseCSSPrefix + 'html-editor-tip'
            },
            createlink: {
                title: 'Hyperlink',
                text: 'ÎÎµÏÎ±ÏÏÎ­ÏÎµÏÎµ ÏÎ¿ ÏÏÎ¿ÎµÏÎ¹Î»ÎµÎ³Î¼Î­Î½Î¿ ÎºÎµÎ¯Î¼ÎµÎ½Î¿ ÏÎµ Link.',
                cls: Ext.baseCSSPrefix + 'html-editor-tip'
            },
            sourceedit: {
                title: 'ÎÏÎµÎ¾ÎµÏÎ³Î±ÏÎ¯Î± ÎÏÎ´Î¹ÎºÎ±',
                text: 'ÎÎµÏÎ±Î²Î±Î¯Î½ÎµÏÎµ ÏÏÎ· Î»ÎµÎ¹ÏÎ¿ÏÏÎ³Î¯Î± ÎµÏÎµÎ¾ÎµÏÎ³Î±ÏÎ¯Î±Ï ÎºÏÎ´Î¹ÎºÎ±.',
                cls: Ext.baseCSSPrefix + 'html-editor-tip'
            }
        }
    });
});

Ext.define("Ext.locale.el_GR.grid.header.Container", {
    override: "Ext.grid.header.Container",
    sortAscText: "ÎÏÎ¾Î¿ÏÏÎ± ÏÎ±Î¾Î¹Î½ÏÎ¼Î·ÏÎ·",
    sortDescText: "Î¦Î¸Î¯Î½Î¿ÏÏÎ± ÏÎ±Î¾Î¹Î½ÏÎ¼Î·ÏÎ·",
    lockText: "ÎÎ»ÎµÎ¯Î´ÏÎ¼Î± ÏÏÎ®Î»Î·Ï",
    unlockText: "ÎÎµÎºÎ»ÎµÎ¯Î´ÏÎ¼Î± ÏÏÎ®Î»Î·Ï",
    columnsText: "Î£ÏÎ®Î»ÎµÏ"
});

Ext.define("Ext.locale.el_GR.grid.GroupingFeature", {
    override: "Ext.grid.feature.Grouping",
    emptyGroupText: '(ÎÎ±Î¼Î¼Î¯Î±)',
    groupByText: 'ÎÎ¼Î±Î´Î¿ÏÎ¿Î¯Î·ÏÎ· Î²Î¬ÏÎµÎ¹ Î±ÏÏÎ¿Ï ÏÎ¿Ï ÏÎµÎ´Î¯Î¿Ï',
    showGroupsText: 'ÎÎ± ÎµÎ¼ÏÎ±Î½Î¯Î¶ÎµÏÎ±Î¹ ÏÏÎ¹Ï Î¿Î¼Î¬Î´ÎµÏ'
});

Ext.define("Ext.locale.el_GR.grid.PropertyColumnModel", {
    override: "Ext.grid.PropertyColumnModel",
    nameText: "ÎÎ½Î¿Î¼Î±",
    valueText: "Î ÎµÏÎ¹ÎµÏÏÎ¼ÎµÎ½Î¿",
    dateFormat: "d/m/Y"
});

Ext.define("Ext.locale.el_GR.window.MessageBox", {
    override: "Ext.window.MessageBox",
    buttonText: {
        ok: "OK",
        cancel: "ÎÎºÏÏÎ¿",
        yes: "ÎÎ±Î¹",
        no: "ÎÏÎ¹"
    }
});

// This is needed until we can refactor all of the locales into individual files
Ext.define("Ext.locale.el_GR.Component", {
    override: "Ext.Component"
});
