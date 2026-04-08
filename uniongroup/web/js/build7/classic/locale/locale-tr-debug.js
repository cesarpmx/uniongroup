Ext.onReady(function() {

    if (Ext.Date) {
        Ext.Date.monthNames = ["Ocak", "Åubat", "Mart", "Nisan", "MayÄ±s", "Haziran", "Temmuz", "AÄustos", "EylÃ¼l", "Ekim", "KasÄ±m", "AralÄ±k"];

        Ext.Date.getShortMonthName = function(month) {
            return Ext.Date.monthNames[month].substring(0, 3);
        };

        Ext.Date.monthNumbers = {
            "Ocak": 0,
            "Åubat": 1,
            "Mart": 2,
            "Nisan": 3,
            "MayÄ±s": 4,
            "Haziran": 5,
            "Temmuz": 6,
            "AÄustos": 7,
            "EylÃ¼l": 8,
            "Ekim": 9,
            "KasÄ±m": 10,
            "AralÄ±k": 11
        };

        Ext.Date.getMonthNumber = function(name) {
            return Ext.Date.monthNumbers[name.substring(0, 1).toUpperCase() + name.substring(1, 3).toLowerCase()];
        };

        Ext.Date.dayNames = ["Pazar", "Pazartesi", "SalÄ±", "ÃarÅamba", "PerÅembe", "Cuma", "Cumartesi"];

        Ext.Date.shortDayNames = ["Paz", "Pzt", "Sal", "ÃrÅ", "PrÅ", "Cum", "Cmt"];

        Ext.Date.getShortDayName = function(day) {
            return Ext.Date.shortDayNames[day];
        };
    }

    if (Ext.util && Ext.util.Format) {
        Ext.apply(Ext.util.Format, {
            thousandSeparator: '.',
            decimalSeparator: ',',
            currencySign: 'TL',
            // Turkish Lira
            dateFormat: 'd/m/Y'
        });
    }
});

Ext.define("Ext.locale.tr.view.View", {
    override: "Ext.view.View",
    emptyText: ""
});

Ext.define("Ext.locale.tr.grid.Grid", {
    override: "Ext.grid.Grid",
    ddText: "SeÃ§ili satÄ±r sayÄ±sÄ± : {0}"
});

Ext.define("Ext.locale.tr.tab.Tab", {
    override: "Ext.tab.Tab",
    closeText: "Sekmeyi kapat"
});

Ext.define("Ext.locale.tr.form.field.Base", {
    override: "Ext.form.field.Base",
    invalidText: "Bu alandaki deÄer geÃ§ersiz"
});

// changing the msg text below will affect the LoadMask
Ext.define("Ext.locale.tr.view.AbstractView", {
    override: "Ext.view.AbstractView",
    loadingText: "YÃ¼kleniyor ..."
});

Ext.define("Ext.locale.tr.picker.Date", {
    override: "Ext.picker.Date",
    todayText: "BugÃ¼n",
    minText: "Bu tarih izin verilen en kÃ¼Ã§Ã¼k tarihten daha Ã¶nce",
    maxText: "Bu tarih izin verilen en bÃ¼yÃ¼k tarihten daha sonra",
    disabledDaysText: "",
    disabledDatesText: "",
    nextText: 'Gelecek Ay (Control+Right)',
    prevText: 'Ãnceki Ay (Control+Left)',
    monthYearText: 'Bir ay seÃ§iniz (YÄ±lÄ± artÄ±rmak/azaltmak iÃ§in Control+Up/Down)',
    todayTip: "{0} (BoÅluk TuÅu - Spacebar)",
    format: "d/m/Y",
    startDay: 1
});

Ext.define("Ext.locale.tr.picker.Month", {
    override: "Ext.picker.Month",
    okText: "*Tamam*",
    cancelText: "Ä°ptal"
});

Ext.define("Ext.locale.tr.toolbar.Paging", {
    override: "Ext.PagingToolbar",
    beforePageText: "Sayfa",
    afterPageText: " / {0}",
    firstText: "Ä°lk Sayfa",
    prevText: "Ãnceki Sayfa",
    nextText: "Sonraki Sayfa",
    lastText: "Son Sayfa",
    refreshText: "Yenile",
    displayMsg: "GÃ¶sterilen {0} - {1} / {2}",
    emptyMsg: 'GÃ¶sterilebilecek veri yok'
});

Ext.define("Ext.locale.tr.form.field.Text", {
    override: "Ext.form.field.Text",
    minLengthText: "Girilen verinin uzunluÄu en az {0} olabilir",
    maxLengthText: "Girilen verinin uzunluÄu en fazla {0} olabilir",
    blankText: "Bu alan boÅ bÄ±rakÄ±lamaz",
    regexText: "",
    emptyText: null
});

Ext.define("Ext.locale.tr.form.field.Number", {
    override: "Ext.form.field.Number",
    minText: "En az {0} girilebilir",
    maxText: "En Ã§ok {0} girilebilir",
    nanText: "{0} geÃ§ersiz bir sayÄ±dÄ±r"
});

Ext.define("Ext.locale.tr.form.field.Date", {
    override: "Ext.form.field.Date",
    disabledDaysText: "Disabled",
    disabledDatesText: "Disabled",
    minText: "Bu tarih, {0} tarihinden daha sonra olmalÄ±dÄ±r",
    maxText: "Bu tarih, {0} tarihinden daha Ã¶nce olmalÄ±dÄ±r",
    invalidText: "{0} geÃ§ersiz bir tarihdir - tarih formatÄ± {1} Åeklinde olmalÄ±dÄ±r",
    format: "d/m/Y",
    altFormats: "d.m.y|d.m.Y|d/m/y|d-m-Y|d-m-y|d.m|d/m|d-m|dm|dmY|dmy|d|Y.m.d|Y-m-d|Y/m/d"
});

Ext.define("Ext.locale.tr.form.field.ComboBox", {
    override: "Ext.form.field.ComboBox",
    valueNotFoundText: undefined
}, function() {
    Ext.apply(Ext.form.field.ComboBox.prototype.defaultListConfig, {
        loadingText: "YÃ¼kleniyor ..."
    });
});

Ext.define("Ext.locale.tr.form.field.VTypes", {
    override: "Ext.form.field.VTypes",
    emailText: 'Bu alan "user@example.com" Åeklinde elektronik posta formatÄ±nda olmalÄ±dÄ±r',
    urlText: 'Bu alan "http://www.example.com" Åeklinde URL adres formatÄ±nda olmalÄ±dÄ±r',
    alphaText: 'Bu alan sadece harf ve _ iÃ§ermeli',
    alphanumText: 'Bu alan sadece harf, sayÄ± ve _ iÃ§ermeli'
});

Ext.define("Ext.locale.tr.form.field.HtmlEditor", {
    override: "Ext.form.field.HtmlEditor",
    createLinkText: 'LÃ¼tfen bu baÄlantÄ± iÃ§in gerekli URL adresini giriniz:'
}, function() {
    Ext.apply(Ext.form.field.HtmlEditor.prototype, {
        buttonTips: {
            bold: {
                title: 'KalÄ±n(Bold) (Ctrl+B)',
                text: 'SeÃ§ili yazÄ±yÄ± kalÄ±n yapar.',
                cls: Ext.baseCSSPrefix + 'html-editor-tip'
            },
            italic: {
                title: 'Ä°talik(Italic) (Ctrl+I)',
                text: 'SeÃ§ili yazÄ±yÄ± italik yapar.',
                cls: Ext.baseCSSPrefix + 'html-editor-tip'
            },
            underline: {
                title: 'Alt Ãâ¡izgi(Underline) (Ctrl+U)',
                text: 'SeÃ§ili yazÄ±nÄ±n altÄ±nÄ± Ã§izer.',
                cls: Ext.baseCSSPrefix + 'html-editor-tip'
            },
            increasefontsize: {
                title: 'Fontu bÃ¼yÃ¼lt',
                text: 'YazÄ± fontunu bÃ¼yÃ¼tÃ¼r.',
                cls: Ext.baseCSSPrefix + 'html-editor-tip'
            },
            decreasefontsize: {
                title: 'Fontu kÃ¼Ã§Ã¼lt',
                text: 'YazÄ± fontunu kÃ¼Ã§Ã¼ltÃ¼r.',
                cls: Ext.baseCSSPrefix + 'html-editor-tip'
            },
            backcolor: {
                title: 'Arka Plan Rengi',
                text: 'SeÃ§ili yazÄ±nÄ±n arka plan rengini deÄiÅtir.',
                cls: Ext.baseCSSPrefix + 'html-editor-tip'
            },
            forecolor: {
                title: 'YazÄ± Rengi',
                text: 'SeÃ§ili yazÄ±nÄ±n rengini deÄiÅtir.',
                cls: Ext.baseCSSPrefix + 'html-editor-tip'
            },
            justifyleft: {
                title: 'Sola Daya',
                text: 'YazÄ±yÄ± sola daya.',
                cls: Ext.baseCSSPrefix + 'html-editor-tip'
            },
            justifycenter: {
                title: 'Ortala',
                text: 'YazÄ±yÄ± editÃ¶rde ortala.',
                cls: Ext.baseCSSPrefix + 'html-editor-tip'
            },
            justifyright: {
                title: 'SaÄa daya',
                text: 'YazÄ±yÄ± saÄa daya.',
                cls: Ext.baseCSSPrefix + 'html-editor-tip'
            },
            insertunorderedlist: {
                title: 'NoktalÄ± Liste',
                text: 'NoktalÄ± listeye baÅla.',
                cls: Ext.baseCSSPrefix + 'html-editor-tip'
            },
            insertorderedlist: {
                title: 'NumaralÄ± Liste',
                text: 'NumaralÄ± lisyeye baÅla.',
                cls: Ext.baseCSSPrefix + 'html-editor-tip'
            },
            createlink: {
                title: 'Web Adresi(Hyperlink)',
                text: 'SeÃ§ili yazÄ±yÄ± web adresi(hyperlink) yap.',
                cls: Ext.baseCSSPrefix + 'html-editor-tip'
            },
            sourceedit: {
                title: 'Kaynak kodu DÃ¼zenleme',
                text: 'Kaynak kodu dÃ¼zenleme moduna geÃ§.',
                cls: Ext.baseCSSPrefix + 'html-editor-tip'
            }
        }
    });
});

Ext.define("Ext.locale.tr.grid.header.Container", {
    override: "Ext.grid.header.Container",
    sortAscText: "Artan sÄ±rada sÄ±rala",
    sortDescText: "Azalan sÄ±rada sÄ±rala",
    lockText: "Kolonu kilitle",
    unlockText: "Kolon kilidini kaldÄ±r",
    columnsText: "Kolonlar"
});

Ext.define("Ext.locale.tr.grid.GroupingFeature", {
    override: "Ext.grid.feature.Grouping",
    emptyGroupText: '(Yok)',
    groupByText: 'Bu Alana GÃ¶re Grupla',
    showGroupsText: 'Gruplar Halinde GÃ¶ster'
});

Ext.define("Ext.locale.tr.grid.PropertyColumnModel", {
    override: "Ext.grid.PropertyColumnModel",
    nameText: "Ad",
    valueText: "DeÄer",
    dateFormat: "d/m/Y"
});

Ext.define("Ext.locale.tr.window.MessageBox", {
    override: "Ext.window.MessageBox",
    buttonText: {
        ok: "Tamam",
        cancel: "Ä°ptal",
        yes: "Evet",
        no: "HayÄ±r"
    }
});

// This is needed until we can refactor all of the locales into individual files
Ext.define("Ext.locale.tr.Component", {
    override: "Ext.Component"
});
