/**
 * List compiled by mystix on the extjs.com forums.
 * Thank you Mystix!
 *
 * Hungarian Translations (utf-8 encoded)
 * by Amon <amon@theba.hu> (27 Apr 2008)
 * encoding fixed by Vili (17 Feb 2009)
 */
Ext.onReady(function() {

    if (Ext.Date) {
        Ext.Date.monthNames = ["Január", "Február", "Március", "Április", "Május", "Június", "Július", "Augusztus", "Szeptember", "Október", "November", "December"];

        Ext.Date.getShortMonthName = function(month) {
            return Ext.Date.monthNames[month].substring(0, 3);
        };

        Ext.Date.monthNumbers = {
            'Jan': 0,
            'Feb': 1,
            'Már': 2,
            'Ápr': 3,
            'Máj': 4,
            'Jún': 5,
            'Júl': 6,
            'Aug': 7,
            'Sze': 8,
            'Okt': 9,
            'Nov': 10,
            'Dec': 11
        };

        Ext.Date.getMonthNumber = function(name) {
            return Ext.Date.monthNumbers[name.substring(0, 1).toUpperCase() + name.substring(1, 3).toLowerCase()];
        };

        Ext.Date.dayNames = ["Vasárnap", "HétfÅ", "Kedd", "Szerda", "CsÃ¼tÃ¶rtÃ¶k", "Péntek", "Szombat"];

        Ext.Date.getShortDayName = function(day) {
            return Ext.Date.dayNames[day].substring(0, 3);
        };
    }

    if (Ext.util && Ext.util.Format) {
        Ext.apply(Ext.util.Format, {
            thousandSeparator: '.',
            decimalSeparator: ',',
            currencySign: 'Ft',
            // Hungarian Forint
            dateFormat: 'Y m d'
        });
    }
});

Ext.define("Ext.locale.hu.view.View", {
    override: "Ext.view.View",
    emptyText: ""
});

Ext.define("Ext.locale.hu.grid.plugin.DragDrop", {
    override: "Ext.grid.plugin.DragDrop",
    dragText: "{0} kiválasztott sor"
});

Ext.define("Ext.locale.hu.tab.Tab", {
    override: "Ext.tab.Tab",
    closeText: "FÃ¼l bezárása"
});

Ext.define("Ext.locale.hu.form.field.Base", {
    override: "Ext.form.field.Base",
    invalidText: "Hibás érték!"
});

// changing the msg text below will affect the LoadMask
Ext.define("Ext.locale.hu.view.AbstractView", {
    override: "Ext.view.AbstractView",
    loadingText: "BetÃ¶ltés..."
});

Ext.define("Ext.locale.hu.picker.Date", {
    override: "Ext.picker.Date",
    todayText: "Mai nap",
    minText: "A dátum korábbi a megengedettnél",
    maxText: "A dátum késÅbbi a megengedettnél",
    disabledDaysText: "",
    disabledDatesText: "",
    nextText: 'KÃ¶v. hónap (CTRL+Jobbra)',
    prevText: 'ElÅzÅ hónap (CTRL+Balra)',
    monthYearText: 'Válassz hónapot (Évválasztás: CTRL+Fel/Le)',
    todayTip: "{0} (SzókÃ¶z)",
    format: "y-m-d",
    startDay: 0
});

Ext.define("Ext.locale.hu.picker.Month", {
    override: "Ext.picker.Month",
    okText: "&#160;OK&#160;",
    cancelText: "Mégsem"
});

Ext.define("Ext.locale.hu.toolbar.Paging", {
    override: "Ext.PagingToolbar",
    beforePageText: "Oldal",
    afterPageText: "a {0}-ból/bÅl",
    firstText: "ElsÅ oldal",
    prevText: "ElÅzÅ oldal",
    nextText: "KÃ¶vetkezÅ oldal",
    lastText: "Utolsó oldal",
    refreshText: "Frissítés",
    displayMsg: "{0} - {1} sorok láthatók a {2}-ból/bÅl",
    emptyMsg: 'Nincs megjeleníthetÅ adat'
});

Ext.define("Ext.locale.hu.form.field.Text", {
    override: "Ext.form.field.Text",
    minLengthText: "A mezÅ tartalma legalább {0} hosszú kell legyen",
    maxLengthText: "A mezÅ tartalma legfeljebb {0} hosszú lehet",
    blankText: "KÃ¶telezÅen kitÃ¶ltendÅ mezÅ",
    regexText: "",
    emptyText: null
});

Ext.define("Ext.locale.hu.form.field.Number", {
    override: "Ext.form.field.Number",
    minText: "A mezÅ tartalma nem lehet kissebb, mint {0}",
    maxText: "A mezÅ tartalma nem lehet nagyobb, mint {0}",
    nanText: "{0} nem szám"
});

Ext.define("Ext.locale.hu.form.field.Date", {
    override: "Ext.form.field.Date",
    disabledDaysText: "Nem választható",
    disabledDatesText: "Nem választható",
    minText: "A dátum nem lehet korábbi, mint {0}",
    maxText: "A dátum nem lehet késÅbbi, mint {0}",
    invalidText: "{0} nem megfelelÅ dátum - a helyes formátum: {1}",
    format: "Y m d",
    altFormats: "Y-m-d|y-m-d|y/m/d|m/d|m-d|md|ymd|Ymd|d"
});

Ext.define("Ext.locale.hu.form.field.ComboBox", {
    override: "Ext.form.field.ComboBox",
    valueNotFoundText: undefined
}, function() {
    Ext.apply(Ext.form.field.ComboBox.prototype.defaultListConfig, {
        loadingText: "BetÃ¶ltés..."
    });
});

Ext.define("Ext.locale.hu.form.field.VTypes", {
    override: "Ext.form.field.VTypes",
    emailText: 'A mezÅ email címet tartalmazhat, melynek formátuma "felhasználó@szolgáltató.hu"',
    urlText: 'A mezÅ webcímet tartalmazhat, melynek formátuma "http:/' + '/www.weboldal.hu"',
    alphaText: 'A mezÅ csak betÅ±ket és aláhúzást (_) tartalmazhat',
    alphanumText: 'A mezÅ csak betÅ±ket, számokat és aláhúzást (_) tartalmazhat'
});

Ext.define("Ext.locale.hu.form.field.HtmlEditor", {
    override: "Ext.form.field.HtmlEditor",
    createLinkText: 'Add meg a webcímet:'
}, function() {
    Ext.apply(Ext.form.field.HtmlEditor.prototype, {
        buttonTips: {
            bold: {
                title: 'FélkÃ¶vér (Ctrl+B)',
                text: 'FélkÃ¶vérré teszi a kijelÃ¶lt szÃ¶veget.',
                cls: Ext.baseCSSPrefix + 'html-editor-tip'
            },
            italic: {
                title: 'DÅlt (Ctrl+I)',
                text: 'DÅlté teszi a kijelÃ¶lt szÃ¶veget.',
                cls: Ext.baseCSSPrefix + 'html-editor-tip'
            },
            underline: {
                title: 'Aláhúzás (Ctrl+U)',
                text: 'Aláhúzza a kijelÃ¶lt szÃ¶veget.',
                cls: Ext.baseCSSPrefix + 'html-editor-tip'
            },
            increasefontsize: {
                title: 'SzÃ¶veg nagyítás',
                text: 'NÃ¶veli a szÃ¶vegméretet.',
                cls: Ext.baseCSSPrefix + 'html-editor-tip'
            },
            decreasefontsize: {
                title: 'SzÃ¶veg kicsinyítés',
                text: 'CsÃ¶kkenti a szÃ¶vegméretet.',
                cls: Ext.baseCSSPrefix + 'html-editor-tip'
            },
            backcolor: {
                title: 'Háttérszín',
                text: 'A kijelÃ¶lt szÃ¶veg háttérszínét módosítja.',
                cls: Ext.baseCSSPrefix + 'html-editor-tip'
            },
            forecolor: {
                title: 'SzÃ¶vegszín',
                text: 'A kijelÃ¶lt szÃ¶veg színét módosítja.',
                cls: Ext.baseCSSPrefix + 'html-editor-tip'
            },
            justifyleft: {
                title: 'Balra zárt',
                text: 'Balra zárja a szÃ¶veget.',
                cls: Ext.baseCSSPrefix + 'html-editor-tip'
            },
            justifycenter: {
                title: 'KÃ¶zépre zárt',
                text: 'KÃ¶zépre zárja a szÃ¶veget.',
                cls: Ext.baseCSSPrefix + 'html-editor-tip'
            },
            justifyright: {
                title: 'Jobbra zárt',
                text: 'Jobbra zárja a szÃ¶veget.',
                cls: Ext.baseCSSPrefix + 'html-editor-tip'
            },
            insertunorderedlist: {
                title: 'Felsorolás',
                text: 'Felsorolást kezd.',
                cls: Ext.baseCSSPrefix + 'html-editor-tip'
            },
            insertorderedlist: {
                title: 'Számozás',
                text: 'Számozott listát kezd.',
                cls: Ext.baseCSSPrefix + 'html-editor-tip'
            },
            createlink: {
                title: 'Hiperlink',
                text: 'A kijelÃ¶lt szÃ¶veget linkké teszi.',
                cls: Ext.baseCSSPrefix + 'html-editor-tip'
            },
            sourceedit: {
                title: 'Forrás nézet',
                text: 'Forrás nézetbe kapcsol.',
                cls: Ext.baseCSSPrefix + 'html-editor-tip'
            }
        }
    });
});

Ext.define("Ext.locale.hu.grid.header.Container", {
    override: "Ext.grid.header.Container",
    sortAscText: "NÃ¶vekvÅ rendezés",
    sortDescText: "CsÃ¶kkenÅ rendezés",
    lockText: "Oszlop zárolás",
    unlockText: "Oszlop feloldás",
    columnsText: "Oszlopok"
});

Ext.define("Ext.locale.hu.grid.GroupingFeature", {
    override: "Ext.grid.feature.Grouping",
    emptyGroupText: '(Nincs)',
    groupByText: 'Oszlop szerint csoportosítás',
    showGroupsText: 'Csoportos nézet'
});

Ext.define("Ext.locale.hu.grid.PropertyColumnModel", {
    override: "Ext.grid.PropertyColumnModel",
    nameText: "Név",
    valueText: "Érték",
    dateFormat: "Y m j"
});

Ext.define("Ext.locale.hu.window.MessageBox", {
    override: "Ext.window.MessageBox",
    buttonText: {
        ok: "OK",
        cancel: "Mégsem",
        yes: "Igen",
        no: "Nem"
    }
});

// This is needed until we can refactor all of the locales into individual files
Ext.define("Ext.locale.hu.Component", {
    override: "Ext.Component"
});
