/**
 * Polish Translations
 * By vbert 17-April-2007
 * Updated by mmar 16-November-2007
 * Encoding: utf-8
 */
Ext.onReady(function() {

    if (Ext.Date) {
        Ext.Date.monthNames = ["StyczeÅ", "Luty", "Marzec", "KwiecieÅ", "Maj", "Czerwiec", "Lipiec", "SierpieÅ", "WrzesieÅ", "PaÅºdziernik", "Listopad", "GrudzieÅ"];

        Ext.Date.getShortMonthName = function(month) {
            return Ext.Date.monthNames[month].substring(0, 3);
        };

        Ext.Date.monthNumbers = {
            Sty: 0,
            Lut: 1,
            Mar: 2,
            Kwi: 3,
            Maj: 4,
            Cze: 5,
            Lip: 6,
            Sie: 7,
            Wrz: 8,
            PaÅº: 9,
            Lis: 10,
            Gru: 11
        };

        Ext.Date.getMonthNumber = function(name) {
            return Ext.Date.monthNumbers[name.substring(0, 1).toUpperCase() + name.substring(1, 3).toLowerCase()];
        };

        Ext.Date.dayNames = ["Niedziela", "PoniedziaÅek", "Wtorek", "Åroda", "Czwartek", "PiÄtek", "Sobota"];

        Ext.Date.getShortDayName = function(day) {
            switch (day) {
                case 0:
                    return 'ndz';

                case 1:
                    return 'pon';

                case 2:
                    return 'wt';

                case 3:
                    return 'År';

                case 4:
                    return 'czw';

                case 5:
                    return 'pt';

                case 6:
                    return 'sob';

                default:
                    return '';
            }
        };
    }

    if (Ext.util && Ext.util.Format) {
        Ext.apply(Ext.util.Format, {
            thousandSeparator: '.',
            decimalSeparator: ',',
            currencySign: '\u007a\u0142',
            // Polish Zloty
            dateFormat: 'Y-m-d'
        });
    }
});

Ext.define("Ext.locale.pl.view.View", {
    override: "Ext.view.View",
    emptyText: ""
});

Ext.define("Ext.locale.pl.grid.plugin.DragDrop", {
    override: "Ext.grid.plugin.DragDrop",
    dragText: "{0} wybrano wiersze(y)"
});

Ext.define("Ext.locale.pl.tab.Tab", {
    override: "Ext.tab.Tab",
    closeText: "Zamknij zakÅadkÄ"
});

Ext.define("Ext.locale.pl.form.field.Base", {
    override: "Ext.form.field.Base",
    invalidText: "WartoÅÄ tego pola jest niewÅaÅciwa"
});

// changing the msg text below will affect the LoadMask
Ext.define("Ext.locale.pl.view.AbstractView", {
    override: "Ext.view.AbstractView",
    loadingText: "Wczytywanie danych..."
});

Ext.define("Ext.locale.pl.picker.Date", {
    override: "Ext.picker.Date",
    startDay: 1,
    todayText: "Dzisiaj",
    minText: "Data jest wczeÅniejsza od daty minimalnej",
    maxText: "Data jest pÃ³Åºniejsza od daty maksymalnej",
    disabledDaysText: "",
    disabledDatesText: "",
    nextText: "NastÄpny miesiÄc (Control+StrzaÅkaWPrawo)",
    prevText: "Poprzedni miesiÄc (Control+StrzaÅkaWLewo)",
    monthYearText: "Wybierz miesiÄc (Control+Up/Down aby zmieniÄ rok)",
    todayTip: "{0} (Spacja)",
    format: "Y-m-d"
});

Ext.define("Ext.locale.pl.picker.Month", {
    override: "Ext.picker.Month",
    okText: "&#160;OK&#160;",
    cancelText: "Anuluj"
});

Ext.define("Ext.locale.pl.toolbar.Paging", {
    override: "Ext.PagingToolbar",
    beforePageText: "Strona",
    afterPageText: "z {0}",
    firstText: "Pierwsza strona",
    prevText: "Poprzednia strona",
    nextText: "NastÄpna strona",
    lastText: "Ostatnia strona",
    refreshText: "OdÅwieÅ¼",
    displayMsg: "WyÅwietlono {0} - {1} z {2}",
    emptyMsg: "Brak danych do wyÅwietlenia"
});

Ext.define("Ext.locale.pl.form.field.Text", {
    override: "Ext.form.field.Text",
    minLengthText: "Minimalna iloÅÄ znakÃ³w dla tego pola to {0}",
    maxLengthText: "Maksymalna iloÅÄ znakÃ³w dla tego pola to {0}",
    blankText: "To pole jest wymagane",
    regexText: "",
    emptyText: null
});

Ext.define("Ext.locale.pl.form.field.Number", {
    override: "Ext.form.field.Number",
    minText: "Minimalna wartoÅÄ dla tego pola to {0}",
    maxText: "Maksymalna wartoÅÄ dla tego pola to {0}",
    nanText: "{0} to nie jest wÅaÅciwa wartoÅÄ"
});

Ext.define("Ext.locale.pl.form.field.Date", {
    override: "Ext.form.field.Date",
    disabledDaysText: "WyÅÄczony",
    disabledDatesText: "WyÅÄczony",
    minText: "Data w tym polu musi byÄ pÃ³Åºniejsza od {0}",
    maxText: "Data w tym polu musi byÄ wczeÅniejsza od {0}",
    invalidText: "{0} to nie jest prawidÅowa data - prawidÅowy format daty {1}",
    format: "Y-m-d",
    altFormats: "m/d/Y|m-d-y|m-d-Y|m/d|m-d|md|mdy|mdY|d|Y-m-d"
});

Ext.define("Ext.locale.pl.form.field.ComboBox", {
    override: "Ext.form.field.ComboBox",
    valueNotFoundText: undefined
}, function() {
    Ext.apply(Ext.form.field.ComboBox.prototype.defaultListConfig, {
        loadingText: "WczytujÄ..."
    });
});

Ext.define("Ext.locale.pl.form.field.VTypes", {
    override: "Ext.form.field.VTypes",
    emailText: 'To pole wymaga podania adresu e-mail w formacie: "nazwa@domena.pl"',
    urlText: 'To pole wymaga podania adresu strony www w formacie: "http:/' + '/www.domena.pl"',
    alphaText: 'To pole wymaga podania tylko liter i _',
    alphanumText: 'To pole wymaga podania tylko liter, cyfr i _'
});

Ext.define("Ext.locale.pl.form.field.HtmlEditor", {
    override: "Ext.form.field.HtmlEditor",
    createLinkText: 'WprowadÅº adres URL strony:'
}, function() {
    Ext.apply(Ext.form.field.HtmlEditor.prototype, {
        buttonTips: {
            bold: {
                title: 'Pogrubienie (Ctrl+B)',
                text: 'Ustaw styl zaznaczonego tekstu na pogrubiony.',
                cls: Ext.baseCSSPrefix + 'html-editor-tip'
            },
            italic: {
                title: 'Kursywa (Ctrl+I)',
                text: 'Ustaw styl zaznaczonego tekstu na kursywÄ.',
                cls: Ext.baseCSSPrefix + 'html-editor-tip'
            },
            underline: {
                title: 'PodkreÅlenie (Ctrl+U)',
                text: 'PodkreÅl zaznaczony tekst.',
                cls: Ext.baseCSSPrefix + 'html-editor-tip'
            },
            increasefontsize: {
                title: 'ZwiÄksz czcionkÄ',
                text: 'ZwiÄksz rozmiar czcionki.',
                cls: Ext.baseCSSPrefix + 'html-editor-tip'
            },
            decreasefontsize: {
                title: 'Zmniejsz czcionkÄ',
                text: 'Zmniejsz rozmiar czcionki.',
                cls: Ext.baseCSSPrefix + 'html-editor-tip'
            },
            backcolor: {
                title: 'WyrÃ³Å¼nienie',
                text: 'ZmieÅ kolor wyrÃ³Å¼nienia zaznaczonego tekstu.',
                cls: Ext.baseCSSPrefix + 'html-editor-tip'
            },
            forecolor: {
                title: 'Kolor czcionki',
                text: 'ZmieÅ kolor zaznaczonego tekstu.',
                cls: Ext.baseCSSPrefix + 'html-editor-tip'
            },
            justifyleft: {
                title: 'Do lewej',
                text: 'WyrÃ³wnaj tekst do lewej.',
                cls: Ext.baseCSSPrefix + 'html-editor-tip'
            },
            justifycenter: {
                title: 'WyÅrodkuj',
                text: 'WyrÃ³wnaj tekst do Årodka.',
                cls: Ext.baseCSSPrefix + 'html-editor-tip'
            },
            justifyright: {
                title: 'Do prawej',
                text: 'WyrÃ³wnaj tekst do prawej.',
                cls: Ext.baseCSSPrefix + 'html-editor-tip'
            },
            insertunorderedlist: {
                title: 'Lista wypunktowana',
                text: 'Rozpocznij listÄ wypunktowanÄ.',
                cls: Ext.baseCSSPrefix + 'html-editor-tip'
            },
            insertorderedlist: {
                title: 'Lista numerowana',
                text: 'Rozpocznij listÄ numerowanÄ.',
                cls: Ext.baseCSSPrefix + 'html-editor-tip'
            },
            createlink: {
                title: 'HiperÅÄcze',
                text: 'PrzeksztaÅÄ zaznaczony tekst w hiperÅÄcze.',
                cls: Ext.baseCSSPrefix + 'html-editor-tip'
            },
            sourceedit: {
                title: 'Edycja ÅºrÃ³dÅa',
                text: 'PrzeÅÄcz w tryb edycji ÅºrÃ³dÅa.',
                cls: Ext.baseCSSPrefix + 'html-editor-tip'
            }
        }
    });
});

Ext.define("Ext.locale.pl.grid.header.Container", {
    override: "Ext.grid.header.Container",
    sortAscText: "Sortuj rosnÄco",
    sortDescText: "Sortuj malejÄco",
    lockText: "Zablokuj kolumnÄ",
    unlockText: "Odblokuj kolumnÄ",
    columnsText: "Kolumny"
});

Ext.define("Ext.locale.pl.grid.GroupingFeature", {
    override: "Ext.grid.feature.Grouping",
    emptyGroupText: '(None)',
    groupByText: 'Grupuj po tym polu',
    showGroupsText: 'PokaÅ¼ w grupach'
});

Ext.define("Ext.locale.pl.grid.PropertyColumnModel", {
    override: "Ext.grid.PropertyColumnModel",
    nameText: "Nazwa",
    valueText: "WartoÅÄ",
    dateFormat: "Y-m-d"
});

Ext.define("Ext.locale.pl.window.MessageBox", {
    override: "Ext.window.MessageBox",
    buttonText: {
        ok: "OK",
        cancel: "Anuluj",
        yes: "Tak",
        no: "Nie"
    }
});

// This is needed until we can refactor all of the locales into individual files
Ext.define("Ext.locale.pl.Component", {
    override: "Ext.Component"
});
