/**
 * Estonian Translations
 * By Rene Saarsoo (2012-05-28)
 */
Ext.onReady(function() {
    var shortMonthNames;

    if (Ext.Date) {
        Ext.Date.monthNames = ["Jaanuar", "Veebruar", "MÃ¤rts", "Aprill", "Mai", "Juuni", "Juuli", "August", "September", "Oktoober", "November", "Detsember"];

        // Month names aren't shortened to strictly three letters
        shortMonthNames = ["Jaan", "Veeb", "MÃ¤rts", "Apr", "Mai", "Juuni", "Juuli", "Aug", "Sept", "Okt", "Nov", "Dets"];

        Ext.Date.getShortMonthName = function(month) {
            return shortMonthNames[month];
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

        Ext.Date.dayNames = ["PÃ¼hapÃ¤ev", "EsmaspÃ¤ev", "TeisipÃ¤ev", "KolmapÃ¤ev", "NeljapÃ¤ev", "Reede", "LaupÃ¤ev"];

        // Weekday names are abbreviated to single letter
        Ext.Date.getShortDayName = function(day) {
            return Ext.Date.dayNames[day].substring(0, 1);
        };
    }

    if (Ext.util && Ext.util.Format) {
        Ext.apply(Ext.util.Format, {
            thousandSeparator: ' ',
            decimalSeparator: ',',
            currencySign: '\u20ac', // Euro
            dateFormat: 'd.m.Y'
        });
    }
});

Ext.define("Ext.locale.et.view.View", {
    override: "Ext.view.View",
    emptyText: ""
});

Ext.define("Ext.locale.et.grid.plugin.DragDrop", {
    override: "Ext.grid.plugin.DragDrop",
    dragText: "{0} valitud rida"
});

// changing the msg text below will affect the LoadMask
Ext.define("Ext.locale.et.view.AbstractView", {
    override: "Ext.view.AbstractView",
    loadingText: "Laen..."
});

Ext.define("Ext.locale.et.picker.Date", {
    override: "Ext.picker.Date",
    todayText: "TÃ¤na",
    minText: "See kuupÃ¤ev on enne mÃ¤Ã¤ratud vanimat kuupÃ¤eva",
    maxText: "See kuupÃ¤ev on pÃ¤rast mÃ¤Ã¤ratud hiliseimat kuupÃ¤eva",
    disabledDaysText: "",
    disabledDatesText: "",
    nextText: 'JÃ¤rgmine kuu (Ctrl+Paremale)',
    prevText: 'Eelmine kuu (Ctrl+Vasakule)',
    monthYearText: 'Vali kuu (Ctrl+Ãles/Alla aastate muutmiseks)',
    todayTip: "{0} (TÃ¼hik)",
    format: "d.m.Y",
    startDay: 1
});

Ext.define("Ext.locale.et.picker.Month", {
    override: "Ext.picker.Month",
    okText: "&#160;OK&#160;",
    cancelText: "Katkesta"
});

Ext.define("Ext.locale.et.toolbar.Paging", {
    override: "Ext.PagingToolbar",
    beforePageText: "LehekÃ¼lg",
    afterPageText: "{0}-st",
    firstText: "Esimene lk",
    prevText: "Eelmine lk",
    nextText: "JÃ¤rgmine lk",
    lastText: "Viimane lk",
    refreshText: "VÃ¤rskenda",
    displayMsg: "NÃ¤itan {0} - {1} {2}-st",
    emptyMsg: 'Puuduvad andmed mida nÃ¤idata'
});

Ext.define("Ext.locale.et.form.Basic", {
    override: "Ext.form.Basic",
    waitTitle: "Palun oota..."
});

Ext.define("Ext.locale.et.form.field.Base", {
    override: "Ext.form.field.Base",
    invalidText: "VÃ¤lja sisu ei vasta nÃµuetele"
});

Ext.define("Ext.locale.et.form.field.Text", {
    override: "Ext.form.field.Text",
    minLengthText: "Selle vÃ¤lja minimaalne pikkus on {0}",
    maxLengthText: "Selle vÃ¤lja maksimaalne pikkus on {0}",
    blankText: "Selle vÃ¤lja tÃ¤itmine on nÃµutud",
    regexText: "",
    emptyText: null
});

Ext.define("Ext.locale.et.form.field.Number", {
    override: "Ext.form.field.Number",
    minText: "Selle vÃ¤lja vÃ¤him vÃ¤Ã¤rtus vÃµib olla {0}",
    maxText: "Selle vÃ¤lja suurim vÃ¤Ã¤rtus vÃµib olla {0}",
    nanText: "{0} pole korrektne number"
});

Ext.define("Ext.locale.et.form.field.Date", {
    override: "Ext.form.field.Date",
    disabledDaysText: "VÃµimetustatud",
    disabledDatesText: "VÃµimetustatud",
    minText: "KuupÃ¤ev peab olema alates kuupÃ¤evast: {0}",
    maxText: "KuupÃ¤ev peab olema kuni kuupÃ¤evani: {0}",
    invalidText: "{0} ei ole sobiv kuupÃ¤ev - Ãµige formaat on: {1}",
    format: "d.m.Y"
});

Ext.define("Ext.locale.et.form.field.ComboBox", {
    override: "Ext.form.field.ComboBox",
    valueNotFoundText: undefined
}, function() {
    Ext.apply(Ext.form.field.ComboBox.prototype.defaultListConfig, {
        loadingText: "Laen..."
    });
});

Ext.define("Ext.locale.et.form.field.VTypes", {
    override: "Ext.form.field.VTypes",
    emailText: 'Selle vÃ¤lja sisuks peab olema e-posti aadress kujul "kasutaja@domeen.com"',
    urlText: 'Selle vÃ¤lja sisuks peab olema veebiaadress kujul "http:/' + '/www.domeen.com"',
    alphaText: 'See vÃ¤li vÃµib sisaldada vaid tÃ¤hemÃ¤rke ja alakriipsu',
    alphanumText: 'See vÃ¤li vÃµib sisaldada vaid tÃ¤hemÃ¤rke, numbreid ja alakriipsu'
});

Ext.define("Ext.locale.et.form.field.HtmlEditor", {
    override: "Ext.form.field.HtmlEditor",
    createLinkText: 'Palun sisestage selle lingi internetiaadress:'
}, function() {
    Ext.apply(Ext.form.field.HtmlEditor.prototype, {
        buttonTips: {
            bold: {
                title: 'Rasvane kiri (Ctrl+B)',
                text: 'Muuda valitud tekst rasvaseks.',
                cls: Ext.baseCSSPrefix + 'html-editor-tip'
            },
            italic: {
                title: 'Kursiiv (Ctrl+I)',
                text: 'Pane valitud tekst kaldkirja.',
                cls: Ext.baseCSSPrefix + 'html-editor-tip'
            },
            underline: {
                title: 'Allakriipsutus (Ctrl+U)',
                text: 'Jooni valitud tekst alla.',
                cls: Ext.baseCSSPrefix + 'html-editor-tip'
            },
            increasefontsize: {
                title: 'Suurenda',
                text: 'Suurenda teksti suurust.',
                cls: Ext.baseCSSPrefix + 'html-editor-tip'
            },
            decreasefontsize: {
                title: 'VÃ¤henda',
                text: 'VÃ¤henda teksti suurust.',
                cls: Ext.baseCSSPrefix + 'html-editor-tip'
            },
            backcolor: {
                title: 'Tausta vÃ¤rv',
                text: 'Muuda valitud teksti taustavÃ¤rvi.',
                cls: Ext.baseCSSPrefix + 'html-editor-tip'
            },
            forecolor: {
                title: 'Teksti vÃ¤rv',
                text: 'Muuda valitud teksti vÃ¤rvi.',
                cls: Ext.baseCSSPrefix + 'html-editor-tip'
            },
            justifyleft: {
                title: 'Vasakule',
                text: 'Joonda tekst vasakule.',
                cls: Ext.baseCSSPrefix + 'html-editor-tip'
            },
            justifycenter: {
                title: 'Keskele',
                text: 'Joonda tekst keskele.',
                cls: Ext.baseCSSPrefix + 'html-editor-tip'
            },
            justifyright: {
                title: 'Paremale',
                text: 'Joonda tekst paremale.',
                cls: Ext.baseCSSPrefix + 'html-editor-tip'
            },
            insertunorderedlist: {
                title: 'Loetelu',
                text: 'Alusta loetelu.',
                cls: Ext.baseCSSPrefix + 'html-editor-tip'
            },
            insertorderedlist: {
                title: 'Numereeritud list',
                text: 'Alusta numereeritud nimekirja.',
                cls: Ext.baseCSSPrefix + 'html-editor-tip'
            },
            createlink: {
                title: 'Link',
                text: 'Muuda tekst lingiks.',
                cls: Ext.baseCSSPrefix + 'html-editor-tip'
            },
            sourceedit: {
                title: 'LÃ¤htekoodi muutmine',
                text: 'LÃ¼litu lÃ¤htekoodi muutmise reÅ¾iimi.',
                cls: Ext.baseCSSPrefix + 'html-editor-tip'
            }
        }
    });
});

Ext.define("Ext.locale.et.grid.header.Container", {
    override: "Ext.grid.header.Container",
    sortAscText: "JÃ¤rjesta kasvavalt",
    sortDescText: "JÃ¤rjesta kahanevalt",
    columnsText: "Tulbad"
});

Ext.define("Ext.locale.et.grid.feature.Grouping", {
    override: "Ext.grid.feature.Grouping",
    emptyGroupText: '(TÃ¼hi)',
    groupByText: 'Grupeeri selle vÃ¤lja jÃ¤rgi',
    showGroupsText: 'NÃ¤ita gruppides'
});

Ext.define("Ext.locale.et.grid.property.HeaderContainer", {
    override: "Ext.grid.property.HeaderContainer",
    nameText: "Nimi",
    valueText: "VÃ¤Ã¤rtus",
    dateFormat: "d.m.Y"
});

Ext.define("Ext.locale.et.grid.column.Date", {
    override: "Ext.grid.column.Date",
    format: 'd.m.Y'
});

Ext.define("Ext.locale.et.form.field.Time", {
    override: "Ext.form.field.Time",
    minText: "Kellaaeg peab olema alates {0}",
    maxText: "Kellaaeg peab olema kuni {0}",
    invalidText: "{0} ei ole sobiv kellaaeg",
    format: "H:i"
});

Ext.define("Ext.locale.et.form.CheckboxGroup", {
    override: "Ext.form.CheckboxGroup",
    blankText: "VÃ¤hemalt Ã¼ks vÃ¤li selles grupis peab olema valitud"
});

Ext.define("Ext.locale.et.form.RadioGroup", {
    override: "Ext.form.RadioGroup",
    blankText: "VÃ¤hemalt Ã¼ks vÃ¤li selles grupis peab olema valitud"
});

Ext.define("Ext.locale.et.window.MessageBox", {
    override: "Ext.window.MessageBox",
    buttonText: {
        ok: "OK",
        cancel: "Katkesta",
        yes: "Jah",
        no: "Ei"
    }
});

// This is needed until we can refactor all of the locales into individual files
Ext.define("Ext.locale.et.Component", {
    override: "Ext.Component"
});
