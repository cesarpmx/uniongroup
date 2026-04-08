/**
 * France (Canadian) translation
 * By BernardChhun
 * 04-08-2007, 03:07 AM
 */
Ext.onReady(function() {

    if (Ext.Date) {
        Ext.Date.shortMonthNames = ["Janv", "FÃ©vr", "Mars", "Avr", "Mai", "Juin", "Juil", "AoÃ»t", "Sept", "Oct", "Nov", "DÃ©c"];

        Ext.Date.getShortMonthName = function(month) {
            return Ext.Date.shortMonthNames[month];
        };

        Ext.Date.monthNames = ["Janvier", "FÃ©vrier", "Mars", "Avril", "Mai", "Juin", "Juillet", "AoÃ»t", "Septembre", "Octobre", "Novembre", "DÃ©cembre"];

        Ext.Date.monthNumbers = {
            "Janvier": 0,
            "Janv": 0,
            "FÃ©vrier": 1,
            "FÃ©vr": 1,
            "Mars": 2,
            "Avril": 3,
            "Avr": 3,
            "Mai": 4,
            "Juin": 5,
            "Juillet": 6,
            "Juil": 6,
            "AoÃ»t": 7,
            "Septembre": 8,
            "Sept": 8,
            "Octobre": 9,
            "Oct": 9,
            "Novembre": 10,
            "Nov": 10,
            "DÃ©cembre": 11,
            "DÃ©c": 11
        };

        Ext.Date.getMonthNumber = function(name) {
            return Ext.Date.monthNumbers[Ext.util.Format.capitalize(name)];
        };

        Ext.Date.dayNames = ["Dimanche", "Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi"];

        Ext.Date.getShortDayName = function(day) {
            return Ext.Date.dayNames[day].substring(0, 3);
        };
    }

    if (Ext.util && Ext.util.Format) {
        Ext.apply(Ext.util.Format, {
            thousandSeparator: '.',
            decimalSeparator: ',',
            currencySign: '$',
            // Canadian Dollar
            dateFormat: 'd/m/Y'
        });
    }
});

Ext.define("Ext.locale.fr_CA.view.View", {
    override: "Ext.view.View",
    emptyText: ""
});

Ext.define("Ext.locale.fr_CA.grid.plugin.DragDrop", {
    override: "Ext.grid.plugin.DragDrop",
    dragText: "{0} ligne(s) sÃ©lectionnÃ©(s)"
});

Ext.define("Ext.locale.fr_CA.tab.Tab", {
    override: "Ext.tab.Tab",
    closeText: "Fermer cet onglet"
});

Ext.define("Ext.locale.fr_CA.form.field.Base", {
    override: "Ext.form.field.Base",
    invalidText: "La valeur de ce champ est invalide"
});

// changing the msg text below will affect the LoadMask
Ext.define("Ext.locale.fr_CA.view.AbstractView", {
    override: "Ext.view.AbstractView",
    loadingText: "En cours de chargement..."
});

Ext.define("Ext.locale.fr_CA.picker.Date", {
    override: "Ext.picker.Date",
    todayText: "Aujourd'hui",
    minText: "Cette date est plus petite que la date minimum",
    maxText: "Cette date est plus grande que la date maximum",
    disabledDaysText: "",
    disabledDatesText: "",
    nextText: 'Prochain mois (CTRL+FlÃ©che droite)',
    prevText: 'Mois prÃ©cÃ©dent (CTRL+FlÃ©che gauche)',
    monthYearText: 'Choissisez un mois (CTRL+FlÃ©che haut ou bas pour changer d\'annÃ©e.)',
    todayTip: "{0} (Barre d'espace)",
    format: "d/m/y"
});

Ext.define("Ext.locale.fr_CA.toolbar.Paging", {
    override: "Ext.PagingToolbar",
    beforePageText: "Page",
    afterPageText: "de {0}",
    firstText: "PremiÃ¨re page",
    prevText: "Page prÃ©cÃ©dente",
    nextText: "Prochaine page",
    lastText: "DerniÃ¨re page",
    refreshText: "Recharger la page",
    displayMsg: "Page courante {0} - {1} de {2}",
    emptyMsg: 'Aucune donnÃ©e Ã  afficher'
});

Ext.define("Ext.locale.fr_CA.form.field.Text", {
    override: "Ext.form.field.Text",
    minLengthText: "La longueur minimum de ce champ est de {0} caractÃ¨res",
    maxLengthText: "La longueur maximum de ce champ est de {0} caractÃ¨res",
    blankText: "Ce champ est obligatoire",
    regexText: "",
    emptyText: null
});

Ext.define("Ext.locale.fr_CA.form.field.Number", {
    override: "Ext.form.field.Number",
    minText: "La valeur minimum de ce champ doit Ãªtre de {0}",
    maxText: "La valeur maximum de ce champ doit Ãªtre de {0}",
    nanText: "{0} n'est pas un nombre valide",
    negativeText: "La valeur de ce champ ne peut Ãªtre nÃ©gative"
});

Ext.define("Ext.locale.fr_CA.form.field.File", {
    override: "Ext.form.field.File",
    buttonText: "Parcourir..."
});

Ext.define("Ext.locale.fr_CA.form.field.Date", {
    override: "Ext.form.field.Date",
    disabledDaysText: "DÃ©sactivÃ©",
    disabledDatesText: "DÃ©sactivÃ©",
    minText: "La date de ce champ doit Ãªtre avant le {0}",
    maxText: "La date de ce champ doit Ãªtre aprÃ¨s le {0}",
    invalidText: "{0} n'est pas une date valide - il doit Ãªtre au format suivant: {1}",
    format: "d/m/y"
});

Ext.define("Ext.locale.fr_CA.form.field.ComboBox", {
    override: "Ext.form.field.ComboBox",
    valueNotFoundText: undefined
}, function() {
    Ext.apply(Ext.form.field.ComboBox.prototype.defaultListConfig, {
        loadingText: "En cours de chargement..."
    });
});

Ext.define("Ext.locale.fr_CA.form.field.VTypes", {
    override: "Ext.form.field.VTypes",
    emailText: 'Ce champ doit contenir un courriel et doit Ãªtre sous ce format: "usager@example.com"',
    urlText: 'Ce champ doit contenir une URL sous le format suivant: "http:/' + '/www.example.com"',
    alphaText: 'Ce champ ne peut contenir que des lettres et le caractÃ¨re soulignÃ© (_)',
    alphanumText: 'Ce champ ne peut contenir que des caractÃ¨res alphanumÃ©riques ainsi que le caractÃ¨re soulignÃ© (_)'
});

Ext.define("Ext.locale.fr_CA.grid.header.Container", {
    override: "Ext.grid.header.Container",
    sortAscText: "Tri ascendant",
    sortDescText: "Tri descendant",
    lockText: "VerrouillÃ© la colonne",
    unlockText: "DÃ©verrouillÃ© la colonne",
    columnsText: "Colonnes"
});

Ext.define("Ext.locale.fr_CA.grid.PropertyColumnModel", {
    override: "Ext.grid.PropertyColumnModel",
    nameText: "PropriÃ©tÃ©",
    valueText: "Valeur",
    dateFormat: "d/m/Y"
});

Ext.define("Ext.locale.fr_CA.window.MessageBox", {
    override: "Ext.window.MessageBox",
    buttonText: {
        ok: "OK",
        cancel: "Annuler",
        yes: "Oui",
        no: "Non"
    }
});

// This is needed until we can refactor all of the locales into individual files
Ext.define("Ext.locale.fr_CA.Component", {
    override: "Ext.Component"
});
