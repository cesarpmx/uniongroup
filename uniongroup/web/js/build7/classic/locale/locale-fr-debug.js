/**
 * France (France) translation
 * By Thylia
 * 09-11-2007, 02:22 PM
 * updated by disizben (22 Sep 2008)
 * updated by Thylia (20 Apr 2010)
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

        Ext.Date.parseCodes.S.s = "(?:er)";

        Ext.Date.getSuffix = function() {
            // eslint-disable-next-line eqeqeq
            return (this.getDate() == 1) ? "er" : "";
        };
    }

    if (Ext.util && Ext.util.Format) {
        Ext.apply(Ext.util.Format, {
            thousandSeparator: '.',
            decimalSeparator: ',',
            currencySign: '\u20ac',
            // French Euro
            dateFormat: 'd/m/Y'
        });
    }
});

Ext.define("Ext.locale.fr.view.View", {
    override: "Ext.view.View",
    emptyText: ""
});

Ext.define("Ext.locale.fr.grid.plugin.DragDrop", {
    override: "Ext.grid.plugin.DragDrop",
    dragText: "{0} ligne{1} sÃ©lectionnÃ©e{1}"
});

Ext.define("Ext.locale.fr.tab.Tab", {
    override: "Ext.tab.Tab",
    closeText: "Fermer cet onglet"
});

// changing the msg text below will affect the LoadMask
Ext.define("Ext.locale.fr.view.AbstractView", {
    override: "Ext.view.AbstractView",
    loadingText: "En cours de chargement..."
});

Ext.define("Ext.locale.fr.picker.Date", {
    override: "Ext.picker.Date",
    todayText: "Aujourd'hui",
    minText: "Cette date est antÃ©rieure Ã  la date minimum",
    maxText: "Cette date est postÃ©rieure Ã  la date maximum",
    disabledDaysText: "",
    disabledDatesText: "",
    nextText: 'Mois suivant (CTRL+FlÃ¨che droite)',
    prevText: "Mois prÃ©cÃ©dent (CTRL+FlÃ¨che gauche)",
    monthYearText: "Choisissez un mois (CTRL+FlÃ¨che haut ou bas pour changer d'annÃ©e.)",
    todayTip: "{0} (Barre d'espace)",
    format: "d/m/y",
    startDay: 1
});

Ext.define("Ext.locale.fr.picker.Month", {
    override: "Ext.picker.Month",
    okText: "&#160;OK&#160;",
    cancelText: "Annuler"
});

Ext.define("Ext.locale.fr.toolbar.Paging", {
    override: "Ext.PagingToolbar",
    beforePageText: "Page",
    afterPageText: "sur {0}",
    firstText: "PremiÃ¨re page",
    prevText: "Page prÃ©cÃ©dente",
    nextText: "Page suivante",
    lastText: "DerniÃ¨re page",
    refreshText: "Actualiser la page",
    displayMsg: "Page courante {0} - {1} sur {2}",
    emptyMsg: 'Aucune donnÃ©e Ã  afficher'
});

Ext.define("Ext.locale.fr.form.Basic", {
    override: "Ext.form.Basic",
    waitTitle: "Veuillez patienter..."
});

Ext.define("Ext.locale.fr.form.field.Base", {
    override: "Ext.form.field.Base",
    invalidText: "La valeur de ce champ est invalide"
});

Ext.define("Ext.locale.fr.form.field.Text", {
    override: "Ext.form.field.Text",
    minLengthText: "La longueur minimum de ce champ est de {0} caractÃ¨re(s)",
    maxLengthText: "La longueur maximum de ce champ est de {0} caractÃ¨re(s)",
    blankText: "Ce champ est obligatoire",
    regexText: "",
    emptyText: null
});

Ext.define("Ext.locale.fr.form.field.Number", {
    override: "Ext.form.field.Number",
    decimalPrecision: 2,
    minText: "La valeur minimum de ce champ doit Ãªtre de {0}",
    maxText: "La valeur maximum de ce champ doit Ãªtre de {0}",
    nanText: "{0} n'est pas un nombre valide",
    negativeText: "La valeur de ce champ ne peut Ãªtre nÃ©gative"
});

Ext.define("Ext.locale.fr.form.field.File", {
    override: "Ext.form.field.File",
    buttonText: "Parcourir..."
});

Ext.define("Ext.locale.fr.form.field.Date", {
    override: "Ext.form.field.Date",
    disabledDaysText: "DÃ©sactivÃ©",
    disabledDatesText: "DÃ©sactivÃ©",
    minText: "La date de ce champ ne peut Ãªtre antÃ©rieure au {0}",
    maxText: "La date de ce champ ne peut Ãªtre postÃ©rieure au {0}",
    invalidText: "{0} n'est pas une date valide - elle doit Ãªtre au format suivant: {1}",
    format: "d/m/y",
    altFormats: "d/m/Y|d-m-y|d-m-Y|d/m|d-m|dm|dmy|dmY|d|Y-m-d"
});

Ext.define("Ext.locale.fr.form.field.ComboBox", {
    override: "Ext.form.field.ComboBox",
    valueNotFoundText: undefined
}, function() {
    Ext.apply(Ext.form.field.ComboBox.prototype.defaultListConfig, {
        loadingText: "En cours de chargement..."
    });
});

Ext.define("Ext.locale.fr.form.field.VTypes", {
    override: "Ext.form.field.VTypes",
    emailText: 'Ce champ doit contenir une adresse email au format: "usager@example.com"',
    urlText: 'Ce champ doit contenir une URL au format suivant: "http:/' + '/www.example.com"',
    alphaText: 'Ce champ ne peut contenir que des lettres et le caractÃ¨re soulignÃ© (_)',
    alphanumText: 'Ce champ ne peut contenir que des caractÃ¨res alphanumÃ©riques ainsi que le caractÃ¨re soulignÃ© (_)'
});

Ext.define("Ext.locale.fr.form.field.HtmlEditor", {
    override: "Ext.form.field.HtmlEditor",
    createLinkText: "Veuillez entrer l'URL pour ce lien:"
}, function() {
    Ext.apply(Ext.form.field.HtmlEditor.prototype, {
        buttonTips: {
            bold: {
                title: 'Gras (Ctrl+B)',
                text: 'Met le texte sÃ©lectionnÃ© en gras.',
                cls: Ext.baseCSSPrefix + 'html-editor-tip'
            },
            italic: {
                title: 'Italique (Ctrl+I)',
                text: 'Met le texte sÃ©lectionnÃ© en italique.',
                cls: Ext.baseCSSPrefix + 'html-editor-tip'
            },
            underline: {
                title: 'SoulignÃ© (Ctrl+U)',
                text: 'Souligne le texte sÃ©lectionnÃ©.',
                cls: Ext.baseCSSPrefix + 'html-editor-tip'
            },
            increasefontsize: {
                title: 'Agrandir la police',
                text: 'Augmente la taille de la police.',
                cls: Ext.baseCSSPrefix + 'html-editor-tip'
            },
            decreasefontsize: {
                title: 'RÃ©duire la police',
                text: 'RÃ©duit la taille de la police.',
                cls: Ext.baseCSSPrefix + 'html-editor-tip'
            },
            backcolor: {
                title: 'Couleur de surbrillance',
                text: 'Modifie la couleur de fond du texte sÃ©lectionnÃ©.',
                cls: Ext.baseCSSPrefix + 'html-editor-tip'
            },
            forecolor: {
                title: 'Couleur de police',
                text: 'Modifie la couleur du texte sÃ©lectionnÃ©.',
                cls: Ext.baseCSSPrefix + 'html-editor-tip'
            },
            justifyleft: {
                title: 'Aligner Ã  gauche',
                text: 'Aligne le texte Ã  gauche.',
                cls: Ext.baseCSSPrefix + 'html-editor-tip'
            },
            justifycenter: {
                title: 'Centrer',
                text: 'Centre le texte.',
                cls: Ext.baseCSSPrefix + 'html-editor-tip'
            },
            justifyright: {
                title: 'Aligner Ã  droite',
                text: 'Aligner le texte Ã  droite.',
                cls: Ext.baseCSSPrefix + 'html-editor-tip'
            },
            insertunorderedlist: {
                title: 'Liste Ã  puce',
                text: 'DÃ©marre une liste Ã  puce.',
                cls: Ext.baseCSSPrefix + 'html-editor-tip'
            },
            insertorderedlist: {
                title: 'Liste numÃ©rotÃ©e',
                text: 'DÃ©marre une liste numÃ©rotÃ©e.',
                cls: Ext.baseCSSPrefix + 'html-editor-tip'
            },
            createlink: {
                title: 'Lien hypertexte',
                text: 'Transforme en lien hypertexte.',
                cls: Ext.baseCSSPrefix + 'html-editor-tip'
            },
            sourceedit: {
                title: 'Code source',
                text: 'Basculer en mode Ã©dition du code source.',
                cls: Ext.baseCSSPrefix + 'html-editor-tip'
            }
        }
    });
});

Ext.define("Ext.locale.fr.grid.header.Container", {
    override: "Ext.grid.header.Container",
    sortAscText: "Tri croissant",
    sortDescText: "Tri dÃ©croissant",
    columnsText: "Colonnes"
});

Ext.define("Ext.locale.fr.grid.GroupingFeature", {
    override: "Ext.grid.feature.Grouping",
    emptyGroupText: '(Aucun)',
    groupByText: 'Grouper par ce champ',
    showGroupsText: 'Afficher par groupes'
});

Ext.define("Ext.locale.fr.grid.PropertyColumnModel", {
    override: "Ext.grid.PropertyColumnModel",
    nameText: "PropriÃ©tÃ©",
    valueText: "Valeur",
    dateFormat: "d/m/Y",
    trueText: "vrai",
    falseText: "faux"
});

Ext.define("Ext.locale.fr.form.field.Time", {
    override: "Ext.form.field.Time",
    minText: "L'heure de ce champ ne peut Ãªtre antÃ©rieure Ã  {0}",
    maxText: "L'heure de ce champ ne peut Ãªtre postÃ©rieure Ã  {0}",
    invalidText: "{0} n'est pas une heure valide",
    format: "H:i",
    altFormats: "g:ia|g:iA|g:i a|g:i A|h:i|g:i|H:i|ga|h a|g a|g A|gi|hi|Hi|gia|hia|g|H"
});

Ext.define("Ext.locale.fr.form.CheckboxGroup", {
    override: "Ext.form.CheckboxGroup",
    blankText: "Vous devez sÃ©lectionner au moins un Ã©lÃ©ment dans ce groupe"
});

Ext.define("Ext.locale.fr.form.RadioGroup", {
    override: "Ext.form.RadioGroup",
    blankText: "Vous devez sÃ©lectionner au moins un Ã©lÃ©ment dans ce groupe"
});

Ext.define("Ext.locale.fr.window.MessageBox", {
    override: "Ext.window.MessageBox",
    buttonText: {
        ok: "OK",
        cancel: "Annuler",
        yes: "Oui",
        no: "Non"
    }
});

Ext.define('Ext.locale.fr.data.validator.Presence', {
    override: 'Ext.data.validator.Presence',
    message: 'Ce champ est obligatoire'
});

// This is needed until we can refactor all of the locales into individual files
Ext.define("Ext.locale.fr.Component", {
    override: "Ext.Component"
});
