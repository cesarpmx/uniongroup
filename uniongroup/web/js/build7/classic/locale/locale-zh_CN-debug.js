/**
 * Simplified Chinese translation
 * By DavidHu
 * 09 April 2007
 *
 * update by andy_ghg
 * 2009-10-22 15:00:57
 */
Ext.onReady(function() {
    var parseCodes;

    if (Ext.Date) {
        Ext.Date.monthNames = ["ä¸æ", "äºæ", "ä¸æ", "åæ", "äºæ", "å­æ", "ä¸æ", "å«æ", "ä¹æ", "åæ", "åä¸æ", "åäºæ"];

        Ext.Date.dayNames = ["æææ¥", "ææä¸", "ææäº", "ææä¸", "ææå", "ææäº", "ææå­"];

        Ext.Date.formatCodes.a = "(this.getHours() < 12 ? 'ä¸å' : 'ä¸å')";
        Ext.Date.formatCodes.A = "(this.getHours() < 12 ? 'ä¸å' : 'ä¸å')";

        parseCodes = {
            g: 1,
            c: "if (/(ä¸å)/i.test(results[{0}])) {\n" +
                "if (!h || h == 12) { h = 0; }\n" +
                "} else { if (!h || h < 12) { h = (h || 0) + 12; }}",
            s: "(ä¸å|ä¸å)",
            calcAtEnd: true
        };

        Ext.Date.parseCodes.a = Ext.Date.parseCodes.A = parseCodes;
    }

    if (Ext.util && Ext.util.Format) {
        Ext.apply(Ext.util.Format, {
            thousandSeparator: ',',
            decimalSeparator: '.',
            currencySign: '\u00a5',
            // Chinese Yuan
            dateFormat: 'yå¹´mædæ¥'
        });
    }
});

Ext.define("Ext.locale.zh_CN.view.View", {
    override: "Ext.view.View",
    emptyText: ""
});

Ext.define("Ext.locale.zh_CN.grid.plugin.DragDrop", {
    override: "Ext.grid.plugin.DragDrop",
    dragText: "éæ©äº {0} è¡"
});

Ext.define("Ext.locale.zh_CN.tab.Tab", {
    override: "Ext.tab.Tab",
    closeText: "å³é­æ­¤æ ç­¾"
});

Ext.define("Ext.locale.zh_CN.form.field.Base", {
    override: "Ext.form.field.Base",
    invalidText: "è¾å¥å¼éæ³"
});

// changing the msg text below will affect the LoadMask
Ext.define("Ext.locale.zh_CN.view.AbstractView", {
    override: "Ext.view.AbstractView",
    loadingText: "è®åä¸­..."
});

Ext.define("Ext.locale.zh_CN.picker.Date", {
    override: "Ext.picker.Date",
    todayText: "ä»å¤©",
    minText: "æ¥æå¿é¡»å¤§äºæå°åè®¸æ¥æ",
    // update
    maxText: "æ¥æå¿é¡»å°äºæå¤§åè®¸æ¥æ",
    // update
    disabledDaysText: "",
    disabledDatesText: "",
    nextText: 'ä¸ä¸ªæ (Ctrl+Right)',
    prevText: 'ä¸ä¸ªæ (Ctrl+Left)',
    monthYearText: 'éæ©ä¸ä¸ªæ (Control+Up/Down æ¥æ¹åå¹´ä»½)',
    // update
    todayTip: "{0} (ç©ºæ ¼é®éæ©)",
    format: "yå¹´mædæ¥",
    ariaTitle: '{0}',
    ariaTitleDateFormat: 'Y\u5e74m\u6708d\u65e5',
    longDayFormat: 'Y\u5e74m\u6708d\u65e5',
    monthYearFormat: 'Y\u5e74m\u6708',
    getDayInitial: function(value) {
        // Grab the last character
        return value.substr(value.length - 1);
    }
});

Ext.define("Ext.locale.zh_CN.picker.Month", {
    override: "Ext.picker.Month",
    okText: "ç¡®å®",
    cancelText: "åæ¶"
});

Ext.define("Ext.locale.zh_CN.toolbar.Paging", {
    override: "Ext.PagingToolbar",
    beforePageText: "ç¬¬",
    // update
    afterPageText: "é¡µ,å± {0} é¡µ",
    // update
    firstText: "ç¬¬ä¸é¡µ",
    prevText: "ä¸ä¸é¡µ",
    // update
    nextText: "ä¸ä¸é¡µ",
    lastText: "æåé¡µ",
    refreshText: "å·æ°",
    displayMsg: "æ¾ç¤º {0} - {1}æ¡ï¼å± {2} æ¡",
    // update
    emptyMsg: 'æ²¡ææ°æ®'
});

Ext.define("Ext.locale.zh_CN.form.field.Text", {
    override: "Ext.form.field.Text",
    minLengthText: "è¯¥è¾å¥é¡¹çæå°é¿åº¦æ¯ {0} ä¸ªå­ç¬¦",
    maxLengthText: "è¯¥è¾å¥é¡¹çæå¤§é¿åº¦æ¯ {0} ä¸ªå­ç¬¦",
    blankText: "è¯¥è¾å¥é¡¹ä¸ºå¿è¾é¡¹",
    regexText: "",
    emptyText: null
});

Ext.define("Ext.locale.zh_CN.form.field.Number", {
    override: "Ext.form.field.Number",
    minText: "è¯¥è¾å¥é¡¹çæå°å¼æ¯ {0}",
    maxText: "è¯¥è¾å¥é¡¹çæå¤§å¼æ¯ {0}",
    nanText: "{0} ä¸æ¯æææ°å¼"
});

Ext.define("Ext.locale.zh_CN.form.field.Date", {
    override: "Ext.form.field.Date",
    disabledDaysText: "ç¦ç¨",
    disabledDatesText: "ç¦ç¨",
    minText: "è¯¥è¾å¥é¡¹çæ¥æå¿é¡»å¨ {0} ä¹å",
    maxText: "è¯¥è¾å¥é¡¹çæ¥æå¿é¡»å¨ {0} ä¹å",
    invalidText: "{0} æ¯æ æçæ¥æ - å¿é¡»ç¬¦åæ ¼å¼ï¼ {1}",
    format: "yå¹´mædæ¥"
});

Ext.define("Ext.locale.zh_CN.form.field.ComboBox", {
    override: "Ext.form.field.ComboBox",
    valueNotFoundText: undefined
}, function() {
    Ext.apply(Ext.form.field.ComboBox.prototype.defaultListConfig, {
        loadingText: "è¯»åä¸­..."
    });
});

Ext.define("Ext.locale.zh_CN.form.field.VTypes", {
    override: "Ext.form.field.VTypes",
    emailText: 'è¯¥è¾å¥é¡¹å¿é¡»æ¯çµå­é®ä»¶å°åï¼æ ¼å¼å¦ï¼ "user@example.com"',
    urlText: 'è¯¥è¾å¥é¡¹å¿é¡»æ¯URLå°åï¼æ ¼å¼å¦ï¼ "http:/' + '/www.example.com"',
    alphaText: 'è¯¥è¾å¥é¡¹åªè½åå«åè§å­æ¯å_',
    alphanumText: 'è¯¥è¾å¥é¡¹åªè½åå«åè§å­æ¯,æ°å­å_'
});

// add HTMLEditor's tips by andy_ghg
Ext.define("Ext.locale.zh_CN.form.field.HtmlEditor", {
    override: "Ext.form.field.HtmlEditor",
    createLinkText: 'æ·»å è¶çº§é¾æ¥:'
}, function() {
    Ext.apply(Ext.form.field.HtmlEditor.prototype, {
        buttonTips: {
            bold: {
                title: 'ç²ä½ (Ctrl+B)',
                text: 'å°éä¸­çæå­è®¾ç½®ä¸ºç²ä½',
                cls: Ext.baseCSSPrefix + 'html-editor-tip'
            },
            italic: {
                title: 'æä½ (Ctrl+I)',
                text: 'å°éä¸­çæå­è®¾ç½®ä¸ºæä½',
                cls: Ext.baseCSSPrefix + 'html-editor-tip'
            },
            underline: {
                title: 'ä¸åçº¿ (Ctrl+U)',
                text: 'ç»æéæå­å ä¸åçº¿',
                cls: Ext.baseCSSPrefix + 'html-editor-tip'
            },
            increasefontsize: {
                title: 'å¢å¤§å­ä½',
                text: 'å¢å¤§å­å·',
                cls: Ext.baseCSSPrefix + 'html-editor-tip'
            },
            decreasefontsize: {
                title: 'ç¼©å°å­ä½',
                text: 'åå°å­å·',
                cls: Ext.baseCSSPrefix + 'html-editor-tip'
            },
            backcolor: {
                title: 'ä»¥ä¸åé¢è²çªåºæ¾ç¤ºææ¬',
                text: 'ä½¿æå­çä¸å»åæ¯ç¨è§åç¬åäºæ è®°ä¸æ ·',
                cls: Ext.baseCSSPrefix + 'html-editor-tip'
            },
            forecolor: {
                title: 'å­ä½é¢è²',
                text: 'æ´æ¹å­ä½é¢è²',
                cls: Ext.baseCSSPrefix + 'html-editor-tip'
            },
            justifyleft: {
                title: 'å·¦å¯¹é½',
                text: 'å°æå­å·¦å¯¹é½',
                cls: Ext.baseCSSPrefix + 'html-editor-tip'
            },
            justifycenter: {
                title: 'å±ä¸­',
                text: 'å°æå­å±ä¸­å¯¹é½',
                cls: Ext.baseCSSPrefix + 'html-editor-tip'
            },
            justifyright: {
                title: 'å³å¯¹é½',
                text: 'å°æå­å³å¯¹é½',
                cls: Ext.baseCSSPrefix + 'html-editor-tip'
            },
            insertunorderedlist: {
                title: 'é¡¹ç®ç¬¦å·',
                text: 'å¼å§åå»ºé¡¹ç®ç¬¦å·åè¡¨',
                cls: Ext.baseCSSPrefix + 'html-editor-tip'
            },
            insertorderedlist: {
                title: 'ç¼å·',
                text: 'å¼å§åå»ºç¼å·åè¡¨',
                cls: Ext.baseCSSPrefix + 'html-editor-tip'
            },
            createlink: {
                title: 'è½¬æè¶çº§é¾æ¥',
                text: 'å°æéææ¬è½¬æ¢æè¶çº§é¾æ¥',
                cls: Ext.baseCSSPrefix + 'html-editor-tip'
            },
            sourceedit: {
                title: 'ä»£ç è§å¾',
                text: 'ä»¥ä»£ç çå½¢å¼å±ç°ææ¬',
                cls: Ext.baseCSSPrefix + 'html-editor-tip'
            }
        }
    });
});

Ext.define("Ext.locale.zh_CN.grid.header.Container", {
    override: "Ext.grid.header.Container",
    sortAscText: "æ­£åº",
    // update
    sortDescText: "ååº",
    // update
    lockText: "éå®å",
    // update
    unlockText: "è§£é¤éå®",
    // update
    columnsText: "å"
});

Ext.define("Ext.locale.zh_CN.grid.PropertyColumnModel", {
    override: "Ext.grid.PropertyColumnModel",
    nameText: "åç§°",
    valueText: "å¼",
    dateFormat: "yå¹´mædæ¥"
});

Ext.define("Ext.locale.zh_CN.window.MessageBox", {
    override: "Ext.window.MessageBox",
    buttonText: {
        ok: "ç¡®å®",
        cancel: "åæ¶",
        yes: "æ¯",
        no: "å¦"
    }
});

// This is needed until we can refactor all of the locales into individual files
Ext.define("Ext.locale.zh_CN.Component", {
    override: "Ext.Component"
});
