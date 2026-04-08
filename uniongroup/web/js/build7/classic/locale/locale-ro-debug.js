/**
 * Romanian translations for ExtJS 2.1
 * First released by Lucian Lature on 2007-04-24
 * Changed locale for Romania (date formats) as suggested by keypoint
 * on ExtJS forums: http://www.extjs.com/forum/showthread.php?p=129524#post129524
 * Removed some useless parts
 * Changed by: Emil Cazamir, 2008-04-24
 * Fixed some errors left behind
 * Changed by: Emil Cazamir, 2008-09-01
 */
Ext.onReady(function() {

    if (Ext.Date) {
        Ext.Date.monthNames = ["Ianuarie", "Februarie", "Martie", "Aprilie", "Mai", "Iunie", "Iulie", "August", "Septembrie", "Octombrie", "Noiembrie", "Decembrie"];

        Ext.Date.getShortMonthName = function(month) {
            return Ext.Date.monthNames[month].substring(0, 3);
        };

        Ext.Date.monthNumbers = {
            Ian: 0,
            Feb: 1,
            Mar: 2,
            Apr: 3,
            Mai: 4,
            Iun: 5,
            Iul: 6,
            Aug: 7,
            Sep: 8,
            Oct: 9,
            Noi: 10,
            Dec: 11
        };

        Ext.Date.getMonthNumber = function(name) {
            return Ext.Date.monthNumbers[name.substring(0, 1).toUpperCase() + name.substring(1, 3).toLowerCase()];
        };

        Ext.Date.dayNames = ["DuminicÄ", "Luni", "MarÅ£i", "Miercuri", "Joi", "Vineri", "SÃ¢mbÄtÄ"];

        Ext.Date.getShortDayName = function(day) {
            return Ext.Date.dayNames[day].substring(0, 3);
        };
    }

    if (Ext.util && Ext.util.Format) {
        Ext.apply(Ext.util.Format, {
            thousandSeparator: '.',
            decimalSeparator: ',',
            currencySign: 'Lei',
            // Romanian Lei
            dateFormat: 'd.m.Y'
        });
    }
});

Ext.define("Ext.locale.ro.grid.plugin.DragDrop", {
    override: "Ext.grid.plugin.DragDrop",
    dragText: "{0} rÃ¢nd(uri) selectate"
});

Ext.define("Ext.locale.ro.tab.Tab", {
    override: "Ext.tab.Tab",
    closeText: "Ãnchide acest tab"
});

Ext.define("Ext.locale.ro.form.field.Base", {
    override: "Ext.form.field.Base",
    invalidText: "Valoarea acestui cÃ¢mp este invalidÄ"
});

// changing the msg text below will affect the LoadMask
Ext.define("Ext.locale.ro.view.AbstractView", {
    override: "Ext.view.AbstractView",
    loadingText: "ÃncÄrcare..."
});

Ext.define("Ext.locale.ro.picker.Date", {
    override: "Ext.picker.Date",
    todayText: "AstÄzi",
    minText: "AceastÄ datÄ este anterioarÄ datei minime",
    maxText: "AceastÄ datÄ este ulterioarÄ datei maxime",
    disabledDaysText: "",
    disabledDatesText: "",
    nextText: 'Luna urmÄtoare (Control+Dreapta)',
    prevText: 'Luna precedentÄ (Control+StÃ¢nga)',
    monthYearText: 'Alege o lunÄ (Control+Sus/Jos pentru a parcurge anii)',
    todayTip: "{0} (Bara spaÈiu)",
    format: "d.m.Y",
    startDay: 0
});

Ext.define("Ext.locale.ro.picker.Month", {
    override: "Ext.picker.Month",
    okText: "&#160;OK&#160;",
    cancelText: "RenunÈÄ"
});

Ext.define("Ext.locale.ro.toolbar.Paging", {
    override: "Ext.PagingToolbar",
    beforePageText: "Pagina",
    afterPageText: "din {0}",
    firstText: "Prima paginÄ",
    prevText: "Pagina anterioarÄ",
    nextText: "Pagina urmÄtoare",
    lastText: "Ultima paginÄ",
    refreshText: "ÃmprospÄteazÄ",
    displayMsg: "AfiÈare Ã®nregistrÄrile {0} - {1} din {2}",
    emptyMsg: 'Nu sunt date de afiÈat'
});

Ext.define("Ext.locale.ro.form.field.Text", {
    override: "Ext.form.field.Text",
    minLengthText: "Lungimea minimÄ pentru acest cÃ¢mp este de {0}",
    maxLengthText: "Lungimea maximÄ pentru acest cÃ¢mp este {0}",
    blankText: "Acest cÃ¢mp este obligatoriu",
    regexText: "",
    emptyText: null
});

Ext.define("Ext.locale.ro.form.field.Number", {
    override: "Ext.form.field.Number",
    minText: "Valoarea minimÄ permisÄ a acestui cÃ¢mp este {0}",
    maxText: "Valaorea maximÄ permisÄ a acestui cÃ¢mp este {0}",
    nanText: "{0} nu este un numÄr valid"
});

Ext.define("Ext.locale.ro.form.field.Date", {
    override: "Ext.form.field.Date",
    disabledDaysText: "Indisponibil",
    disabledDatesText: "Indisponibil",
    minText: "Data din aceastÄ casetÄ trebuie sÄ fie dupÄ {0}",
    maxText: "Data din aceastÄ casetÄ trebuie sÄ fie inainte de {0}",
    invalidText: "{0} nu este o datÄ validÄ, trebuie sÄ fie Ã®n formatul {1}",
    format: "d.m.Y",
    altFormats: "d-m-Y|d.m.y|d-m-y|d.m|d-m|dm|d|Y-m-d"
});

Ext.define("Ext.locale.ro.form.field.ComboBox", {
    override: "Ext.form.field.ComboBox",
    valueNotFoundText: undefined
}, function() {
    Ext.apply(Ext.form.field.ComboBox.prototype.defaultListConfig, {
        loadingText: "ÃncÄrcare..."
    });
});

Ext.define("Ext.locale.ro.form.field.VTypes", {
    override: "Ext.form.field.VTypes",
    emailText: 'Acest cÃ¢mp trebuie sÄ conÅ£inÄ o adresÄ de e-mail Ã®n formatul "user@domeniu.com"',
    urlText: 'Acest cÃ¢mp trebuie sÄ conÅ£inÄ o adresÄ URL Ã®n formatul "http:/' + '/www.domeniu.com"',
    alphaText: 'Acest cÃ¢mp trebuie sÄ conÅ£inÄ doar litere Åi _',
    alphanumText: 'Acest cÃ¢mp trebuie sÄ conÅ£inÄ doar litere, cifre Åi _'
});

Ext.define("Ext.locale.ro.form.field.HtmlEditor", {
    override: "Ext.form.field.HtmlEditor",
    createLinkText: 'VÄ rugÄm introduceti un URL pentru aceastÄ legÄturÄ web:'
}, function() {
    Ext.apply(Ext.form.field.HtmlEditor.prototype, {
        buttonTips: {
            bold: {
                title: 'ÃngroÅat (Ctrl+B)',
                text: 'ÃngroÅati caracterele textului selectat.',
                cls: Ext.baseCSSPrefix + 'html-editor-tip'
            },
            italic: {
                title: 'Ãnclinat (Ctrl+I)',
                text: 'ÃnclinaÅ£i caracterele textului selectat.',
                cls: Ext.baseCSSPrefix + 'html-editor-tip'
            },
            underline: {
                title: 'Subliniat (Ctrl+U)',
                text: 'SubliniaÅ£i caracterele textului selectat.',
                cls: Ext.baseCSSPrefix + 'html-editor-tip'
            },
            increasefontsize: {
                title: 'MÄrit',
                text: 'MÄreÅte dimensiunea fontului.',
                cls: Ext.baseCSSPrefix + 'html-editor-tip'
            },
            decreasefontsize: {
                title: 'MicÅorat',
                text: 'MicÅoreazÄ dimensiunea textului.',
                cls: Ext.baseCSSPrefix + 'html-editor-tip'
            },
            backcolor: {
                title: 'Culoarea fundalului',
                text: 'SchimbÄ culoarea fundalului pentru textul selectat.',
                cls: Ext.baseCSSPrefix + 'html-editor-tip'
            },
            forecolor: {
                title: 'Culoarea textului',
                text: 'SchimbÄ culoarea textului selectat.',
                cls: Ext.baseCSSPrefix + 'html-editor-tip'
            },
            justifyleft: {
                title: 'Aliniat la stÃ¢nga',
                text: 'AliniazÄ textul la stÃ¢nga.',
                cls: Ext.baseCSSPrefix + 'html-editor-tip'
            },
            justifycenter: {
                title: 'Centrat',
                text: 'CentreazÄ textul Ã®n editor.',
                cls: Ext.baseCSSPrefix + 'html-editor-tip'
            },
            justifyright: {
                title: 'Aliniat la dreapta',
                text: 'AliniazÄ textul la dreapta.',
                cls: Ext.baseCSSPrefix + 'html-editor-tip'
            },
            insertunorderedlist: {
                title: 'ListÄ cu puncte',
                text: 'InsereazÄ listÄ cu puncte.',
                cls: Ext.baseCSSPrefix + 'html-editor-tip'
            },
            insertorderedlist: {
                title: 'ListÄ numerotatÄ',
                text: 'InsereazÄ o listÄ numerotatÄ.',
                cls: Ext.baseCSSPrefix + 'html-editor-tip'
            },
            createlink: {
                title: 'LegÄturÄ web',
                text: 'TransformÄ textul selectat Ã®n legÄturÄ web.',
                cls: Ext.baseCSSPrefix + 'html-editor-tip'
            },
            sourceedit: {
                title: 'Editare sursÄ',
                text: 'SchimbÄ pe modul de editare al codului HTML.',
                cls: Ext.baseCSSPrefix + 'html-editor-tip'
            }
        }
    });
});

Ext.define("Ext.locale.ro.grid.header.Container", {
    override: "Ext.grid.header.Container",
    sortAscText: "Sortare ascendentÄ",
    sortDescText: "Sortare descendentÄ",
    lockText: "BlocheazÄ coloana",
    unlockText: "DeblocheazÄ coloana",
    columnsText: "Coloane"
});

Ext.define("Ext.locale.ro.grid.GroupingFeature", {
    override: "Ext.grid.feature.Grouping",
    emptyGroupText: '(FÄrÄ)',
    groupByText: 'GrupeazÄ dupÄ aceastÄ coloanÄ',
    showGroupsText: 'AfiÈeazÄ grupat'
});

Ext.define("Ext.locale.ro.grid.PropertyColumnModel", {
    override: "Ext.grid.PropertyColumnModel",
    nameText: "Nume",
    valueText: "Valoare",
    dateFormat: "d.m.Y"
});

Ext.define("Ext.locale.ro.window.MessageBox", {
    override: "Ext.window.MessageBox",
    buttonText: {
        ok: "OK",
        cancel: "RenunÅ£Ä",
        yes: "Da",
        no: "Nu"
    }
});

// This is needed until we can refactor all of the locales into individual files
Ext.define("Ext.locale.ro.Component", {
    override: "Ext.Component"
});
