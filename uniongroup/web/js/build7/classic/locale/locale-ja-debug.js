/**
 * Japanese translation
 * By tyama
 * 04-08-2007, 05:49 AM
 *
 * update based on English Translations by Condor (8 Aug 2008)
 * By sakuro (30 Aug 2008)
 */
Ext.onReady(function() {
    var parseCodes;

    if (Ext.Date) {
        Ext.Date.monthNames = ['1æ', '2æ', '3æ', '4æ', '5æ', '6æ', '7æ', '8æ', '9æ', '10æ', '11æ', '12æ'];

        Ext.Date.getShortMonthName = function(month) {
            return "" + (month + 1);
        };

        Ext.Date.monthNumbers = {
            "1": 0,
            "2": 1,
            "3": 2,
            "4": 3,
            "5": 4,
            "6": 5,
            "7": 6,
            "8": 7,
            "9": 8,
            "10": 9,
            "11": 10,
            "12": 11
        };

        Ext.Date.getMonthNumber = function(name) {
            return Ext.Date.monthNumbers[name.substring(0, name.length - 1)];
            // or simply parseInt(name.substring(0, name.length - 1)) - 1
        };

        Ext.Date.dayNames = ["æ¥ææ¥", "æææ¥", "ç«ææ¥", "æ°´ææ¥", "æ¨ææ¥", "éææ¥", "åææ¥"];

        Ext.Date.getShortDayName = function(day) {
            return Ext.Date.dayNames[day].substring(0, 1); // just remove "ææ¥" suffix
        };

        Ext.Date.formatCodes.a = "(this.getHours() < 12 ? 'åå' : 'åå¾')";
        Ext.Date.formatCodes.A = "(this.getHours() < 12 ? 'åå' : 'åå¾')"; // no case difference

        parseCodes = {
            g: 1,
            c: "if (/(åå)/i.test(results[{0}])) {\n" +
                "if (!h || h == 12) { h = 0; }\n" +
                "} else { if (!h || h < 12) { h = (h || 0) + 12; }}",
            s: "(åå|åå¾)",
            calcAtEnd: true
        };

        Ext.Date.parseCodes.a = Ext.Date.parseCodes.A = parseCodes;
    }

    if (Ext.util && Ext.util.Format) {
        Ext.apply(Ext.util.Format, {
            thousandSeparator: ',',
            decimalSeparator: '.',
            currencySign: '\u00a5',
            // Japanese Yen
            dateFormat: 'Y/m/d'
        });
    }
});

Ext.define("Ext.locale.ja.LoadMask", {
    override: "Ext.LoadMask",
    msg: "èª­Á¿è¾¼Á¿ä¸­..."
});

Ext.define("Ext.locale.ja.view.View", {
    override: "Ext.view.View",
    emptyText: ""
});

Ext.define("Ext.locale.ja.grid.plugin.DragDrop", {
    override: "Ext.grid.plugin.DragDrop",
    dragText: "{0} è¡é¸æ"
});

// changing the msg text below will affect the LoadMask
Ext.define("Ext.locale.ja.view.AbstractView", {
    override: "Ext.view.AbstractView",
    loadingText: "èª­Á¿è¾¼Á¿ä¸­..."
});

Ext.define("Ext.locale.ja.picker.Date", {
    override: "Ext.picker.Date",
    todayText: "ä»æ¥",
    minText: "é¸æÁÁæ¥ä»Á¯æå°å¤ä»¥ä¸Á§Áã",
    maxText: "é¸æÁÁæ¥ä»Á¯æå¤§å¤ä»¥ä¸Á§Áã",
    disabledDaysText: "",
    disabledDatesText: "",
    nextText: 'æ¬¡æÁ¸ (ã³ã³ãã­ã¼ã«+å³)',
    prevText: 'åæÁ¸ (ã³ã³ãã­ã¼ã«+å·¦)',
    monthYearText: 'æé¸æ (ã³ã³ãã­ã¼ã«+ä¸/ä¸Á§å¹´ç§»å)',
    todayTip: "{0} (ã¹ãã¼ã¹ã­ã¼)",
    format: "Y/m/d",
    startDay: 0,
    ariaTitle: '{0}',
    ariaTitleDateFormat: 'Y\u5e74m\u6708d\u65e5',
    longDayFormat: 'Y\u5e74m\u6708d\u65e5',
    monthYearFormat: 'Y\u5e74m\u6708'
});

Ext.define("Ext.locale.ja.picker.Month", {
    override: "Ext.picker.Month",
    okText: "&#160;OK&#160;",
    cancelText: "ã­ã£ã³ã»ã«"
});

Ext.define("Ext.locale.ja.toolbar.Paging", {
    override: "Ext.PagingToolbar",
    beforePageText: "ãã¼ã¸",
    afterPageText: "/ {0}",
    firstText: "æåÁ®ãã¼ã¸",
    prevText: "åÁ®ãã¼ã¸",
    nextText: "æ¬¡Á®ãã¼ã¸",
    lastText: "æå¾Á®ãã¼ã¸",
    refreshText: "æ´æ°",
    displayMsg: "{2} ä»¶ä¸­ {0} - {1} ãè¡¨ç¤º",
    emptyMsg: 'è¡¨ç¤ºÁããã¼ã¿ÁÁãÁ¾Áãã'
});

Ext.define("Ext.locale.ja.form.field.Base", {
    override: "Ext.form.field.Base",
    invalidText: "ãã£ã¼ã«ãÁ®å¤Áä¸æ­£Á§Áã"
});

Ext.define("Ext.locale.ja.form.field.Text", {
    override: "Ext.form.field.Text",
    minLengthText: "ÁÁ®ãã£ã¼ã«ãÁ®æå°å¤Á¯ {0} Á§Áã",
    maxLengthText: "ÁÁ®ãã£ã¼ã«ãÁ®æå¤§å¤Á¯ {0} Á§Áã",
    blankText: "å¿é é ç®Á§Áã",
    regexText: "",
    emptyText: null
});

Ext.define("Ext.locale.ja.form.field.File", {
    override: "Ext.form.field.File",
    buttonText: "åç§..."
});

Ext.define("Ext.locale.ja.form.field.Number", {
    override: "Ext.form.field.Number",
    decimalPrecision: 2,
    minText: "ÁÁ®ãã£ã¼ã«ãÁ®æå°å¤Á¯ {0} Á§Áã",
    maxText: "ÁÁ®ãã£ã¼ã«ãÁ®æå¤§å¤Á¯ {0} Á§Áã",
    nanText: "{0} Á¯æ°å¤Á§Á¯ÁãÁ¾Áãã",
    negativeText: "è² Á®å¤Á¯ç¡å¹Á§Áã"
});

Ext.define("Ext.locale.ja.form.field.Date", {
    override: "Ext.form.field.Date",
    disabledDaysText: "ç¡å¹",
    disabledDatesText: "ç¡å¹",
    minText: "ÁÁ®ãã£ã¼ã«ãÁ®æ¥ä»Á¯ã {0} ä»¥éÁ®æ¥ä»Á«è¨­å®ÁÁ¦ÁÁ ÁÁã",
    maxText: "ÁÁ®ãã£ã¼ã«ãÁ®æ¥ä»Á¯ã {0} ä»¥åÁ®æ¥ä»Á«è¨­å®ÁÁ¦ÁÁ ÁÁã",
    invalidText: "{0} Á¯ééÁ£Áæ¥ä»å¥åÁ§Áã - å¥åå½¢å¼Á¯ã{1}ãÁ§Áã",
    format: "Y/m/d",
    altFormats: "y/m/d|m/d/y|m/d/Y|m-d-y|m-d-Y|m/d|m-d|md|mdy|mdY|d|Y-m-d"
});

Ext.define("Ext.locale.ja.form.field.ComboBox", {
    override: "Ext.form.field.ComboBox",
    valueNotFoundText: undefined
}, function() {
    Ext.apply(Ext.form.field.ComboBox.prototype.defaultListConfig, {
        loadingText: "èª­Á¿è¾¼Á¿ä¸­..."
    });
});

Ext.define("Ext.locale.ja.form.field.VTypes", {
    override: "Ext.form.field.VTypes",
    emailText: 'ã¡ã¼ã«ã¢ãã¬ã¹ã"user@example.com"Á®å½¢å¼Á§å¥åÁÁ¦ÁÁ ÁÁã',
    urlText: 'URLã"http:/' + '/www.example.com"Á®å½¢å¼Á§å¥åÁÁ¦ÁÁ ÁÁã',
    alphaText: 'åè§è±å­Á¨"_"Á®Á¿Á§Áã',
    alphanumText: 'åè§è±æ°Á¨"_"Á®Á¿Á§Áã'
});

Ext.define("Ext.locale.ja.form.field.HtmlEditor", {
    override: "Ext.form.field.HtmlEditor",
    createLinkText: 'ãªã³ã¯Á®URLãå¥åÁÁ¦ÁÁ ÁÁ:'
}, function() {
    Ext.apply(Ext.form.field.HtmlEditor.prototype, {
        buttonTips: {
            bold: {
                title: 'å¤ªå­ (ã³ã³ãã­ã¼ã«+B)',
                text: 'é¸æãã­ã¹ããå¤ªå­Á«ÁÁ¾Áã',
                cls: Ext.baseCSSPrefix + 'html-editor-tip'
            },
            italic: {
                title: 'æä½ (ã³ã³ãã­ã¼ã«+I)',
                text: 'é¸æãã­ã¹ããæä½Á«ÁÁ¾Áã',
                cls: Ext.baseCSSPrefix + 'html-editor-tip'
            },
            underline: {
                title: 'ä¸ç· (ã³ã³ãã­ã¼ã«+U)',
                text: 'é¸æãã­ã¹ãÁ«ä¸ç·ãå¼ÁÁ¾Áã',
                cls: Ext.baseCSSPrefix + 'html-editor-tip'
            },
            increasefontsize: {
                title: 'æå­ãå¤§ÁÁ',
                text: 'ãã©ã³ããµã¤ãºãå¤§ÁÁÁÁ¾Áã',
                cls: Ext.baseCSSPrefix + 'html-editor-tip'
            },
            decreasefontsize: {
                title: 'æå­ãå°ÁÁ',
                text: 'ãã©ã³ããµã¤ãºãå°ÁÁÁÁ¾Áã',
                cls: Ext.baseCSSPrefix + 'html-editor-tip'
            },
            backcolor: {
                title: 'æå­Á®ãã¤ã©ã¤ã',
                text: 'é¸æãã­ã¹ãÁ®èæ¯è²ãå¤æ´ÁÁ¾Áã',
                cls: Ext.baseCSSPrefix + 'html-editor-tip'
            },
            forecolor: {
                title: 'æå­Á®è²',
                text: 'é¸æãã­ã¹ãÁ®è²ãå¤æ´ÁÁ¾Áã',
                cls: Ext.baseCSSPrefix + 'html-editor-tip'
            },
            justifyleft: {
                title: 'å·¦æÁ',
                text: 'ãã­ã¹ããå·¦æÁÁ«ÁÁ¾Áã',
                cls: Ext.baseCSSPrefix + 'html-editor-tip'
            },
            justifycenter: {
                title: 'ä¸­å¤®æÁ',
                text: 'ãã­ã¹ããä¸­å¤®æÁÁ«ÁÁ¾Áã',
                cls: Ext.baseCSSPrefix + 'html-editor-tip'
            },
            justifyright: {
                title: 'å³æÁ',
                text: 'ãã­ã¹ããå³æÁÁ«ÁÁ¾Áã',
                cls: Ext.baseCSSPrefix + 'html-editor-tip'
            },
            insertunorderedlist: {
                title: 'çªå·ÁªÁç®æ¡æ¸Á',
                text: 'çªå·ÁªÁç®æ¡æ¸Áãéå§ÁÁ¾Áã',
                cls: Ext.baseCSSPrefix + 'html-editor-tip'
            },
            insertorderedlist: {
                title: 'çªå·ä»Áç®æ¡æ¸Á',
                text: 'çªå·ä»Áç®æ¡æ¸Áãéå§ÁÁ¾Áã',
                cls: Ext.baseCSSPrefix + 'html-editor-tip'
            },
            createlink: {
                title: 'ãã¤ãã¼ãªã³ã¯',
                text: 'é¸æãã­ã¹ãããã¤ãã¼ãªã³ã¯Á«ÁÁ¾Áã',
                cls: Ext.baseCSSPrefix + 'html-editor-tip'
            },
            sourceedit: {
                title: 'ã½ã¼ã¹ç·¨é',
                text: 'ã½ã¼ã¹ç·¨éã¢ã¼ãÁ«åãæ¿ÁÁ¾Áã',
                cls: Ext.baseCSSPrefix + 'html-editor-tip'
            }
        }
    });
});

Ext.define("Ext.locale.ja.grid.header.Container", {
    override: "Ext.grid.header.Container",
    sortAscText: "æé ",
    sortDescText: "éé ",
    columnsText: "ã«ã©ã "
});

Ext.define("Ext.locale.ja.grid.column.Date", {
    override: "Ext.grid.column.Date",
    format: "Y/m/d"
});

Ext.define("Ext.locale.ja.grid.GroupingFeature", {
    override: "Ext.grid.feature.Grouping",
    emptyGroupText: '(ÁªÁ)',
    groupByText: 'ÁÁ®ã«ã©ã Á§ã°ã«ã¼ãã³ã°',
    showGroupsText: 'ã°ã«ã¼ãã³ã°'
});

Ext.define("Ext.locale.ja.grid.PropertyColumnModel", {
    override: "Ext.grid.PropertyColumnModel",
    nameText: "åç§°",
    valueText: "å¤",
    dateFormat: "Y/m/d"
});

Ext.define("Ext.locale.ja.form.field.Time", {
    override: "Ext.form.field.Time",
    minText: "ÁÁ®ãã£ã¼ã«ãÁ®æå»Á¯ã {0} ä»¥éÁ®æå»Á«è¨­å®ÁÁ¦ÁÁ ÁÁã",
    maxText: "ÁÁ®ãã£ã¼ã«ãÁ®æå»Á¯ã {0} ä»¥åÁ®æå»Á«è¨­å®ÁÁ¦ÁÁ ÁÁã",
    invalidText: "{0} Á¯ééÁ£Áæå»å¥åÁ§Áã",
    format: "g:i A",
    altFormats: "g:ia|g:iA|g:i a|g:i A|h:i|g:i|H:i|ga|ha|gA|h a|g a|g A|gi|hi|gia|hia|g|H"
});

Ext.define("Ext.locale.ja.form.CheckboxGroup", {
    override: "Ext.form.CheckboxGroup",
    blankText: "ÁÁ®ã°ã«ã¼ãÁãæä½ï¼Á¤Á®ã¢ã¤ãã ãé¸æÁÁªÁãÁ°ÁªãÁ¾Áãã"
});

Ext.define("Ext.locale.ja.form.RadioGroup", {
    override: "Ext.form.RadioGroup",
    blankText: "ÁÁ®ã°ã«ã¼ãÁãï¼Á¤Á®ã¢ã¤ãã ãé¸æÁÁªÁãÁ°ÁªãÁ¾Áãã"
});

Ext.define("Ext.locale.ja.window.MessageBox", {
    override: "Ext.window.MessageBox",
    buttonText: {
        ok: "OK",
        cancel: "ã­ã£ã³ã»ã«",
        yes: "Á¯Á",
        no: "ÁÁÁ"
    }
});

// This is needed until we can refactor all of the locales into individual files
Ext.define("Ext.locale.ja.Component", {
    override: "Ext.Component"
});
