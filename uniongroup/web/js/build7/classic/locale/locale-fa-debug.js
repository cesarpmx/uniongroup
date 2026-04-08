/**
 * Farsi (Persian) translation
 * By Mohaqa
 * 03-10-2007, 06:23 PM
 */
Ext.onReady(function() {
    if (Ext.Date) {
        Ext.Date.monthNames = ["ÚØ§ÙÙÛÙ", "ÙÙØ±ÛÙ", "ÙØ§Ø±Ø³", "Ø¢Ù¾Ø±ÛÙ", "ÙÛ", "ÚÙØ¦Ù", "Ø¬ÙÙØ§Û", "Ø¢Ú¯ÙØ³Øª", "Ø³Ù¾ØªØ§ÙØ¨Ø±", "Ø§Ú©ØªØ¨Ø±", "ÙÙØ§ÙØ¨Ø±", "Ø¯Ø³Ø§ÙØ¨Ø±"];

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

        Ext.Date.dayNames = ["ÛÚ©Ø´ÙØ¨Ù", "Ø¯ÙØ´ÙØ¨Ù", "Ø³Ù Ø´ÙØ¨Ù", "ÚÙØ§Ø±Ø´ÙØ¨Ù", "Ù¾ÙØ¬Ø´ÙØ¨Ù", "Ø¬ÙØ¹Ù", "Ø´ÙØ¨Ù"];
    }

    if (Ext.MessageBox) {
        Ext.MessageBox.buttonText = {
            ok: "ØªØ§ÛÛØ¯",
            cancel: "Ø¨Ø§Ø²Ú¯Ø´Øª",
            yes: "Ø¨ÙÙ",
            no: "Ø®ÛØ±"
        };
    }

    if (Ext.util && Ext.util.Format) {
        Ext.apply(Ext.util.Format, {
            thousandSeparator: '.',
            decimalSeparator: ',',
            currencySign: '\ufdfc',
            // Iranian Rial
            dateFormat: 'Y/m/d'
        });
    }
});

Ext.define("Ext.locale.fa.view.View", {
    override: "Ext.view.View",
    emptyText: ""
});

Ext.define("Ext.locale.fa.grid.plugin.DragDrop", {
    override: "Ext.grid.plugin.DragDrop",
    dragText: "{0} Ø±Ú©ÙØ±Ø¯ Ø§ÙØªØ®Ø§Ø¨ Ø´Ø¯Ù"
});

Ext.define("Ext.locale.fa.tab.Tab", {
    override: "Ext.tab.Tab",
    closeText: "Ø¨Ø³ØªÙ"
});

Ext.define("Ext.locale.fa.form.field.Base", {
    override: "Ext.form.field.Base",
    invalidText: "ÙÙØ¯Ø§Ø± ÙÛÙØ¯ ØµØ­ÛØ­ ÙÛØ³Øª"
});

// changing the msg text below will affect the LoadMask
Ext.define("Ext.locale.fa.view.AbstractView", {
    override: "Ext.view.AbstractView",
    loadingText: "Ø¯Ø± Ø­Ø§Ù Ø¨Ø§Ø±Ú¯Ø°Ø§Ø±Û ..."
});

Ext.define("Ext.locale.fa.picker.Date", {
    override: "Ext.picker.Date",
    todayText: "Ø§ÙØ±ÙØ²",
    minText: "Ø§ÛÙ ØªØ§Ø±ÛØ® ÙØ¨Ù Ø§Ø² ÙØ­Ø¯ÙØ¯Ù ÙØ¬Ø§Ø² Ø§Ø³Øª",
    maxText: "Ø§ÛÙ ØªØ§Ø±ÛØ® Ù¾Ø³ Ø§Ø² ÙØ­Ø¯ÙØ¯Ù ÙØ¬Ø§Ø² Ø§Ø³Øª",
    disabledDaysText: "",
    disabledDatesText: "",
    nextText: 'ÙØ§Ù Ø¨Ø¹Ø¯ (Control + Right)',
    prevText: 'ÙØ§Ù ÙØ¨Ù (Control+Left)',
    monthYearText: 'ÛÚ© ÙØ§Ù Ø±Ø§ Ø§ÙØªØ®Ø§Ø¨ Ú©ÙÛØ¯ (Control+Up/Down Ø¨Ø±Ø§Û Ø§ÙØªÙØ§Ù Ø¯Ø± Ø³Ø§Ù)',
    todayTip: "{0} (Spacebar)",
    format: "y/m/d",
    startDay: 0
});

Ext.define("Ext.locale.fa.picker.Month", {
    override: "Ext.picker.Month",
    okText: "&#160;OK&#160;",
    cancelText: "Cancel"
});

Ext.define("Ext.locale.fa.toolbar.Paging", {
    override: "Ext.PagingToolbar",
    beforePageText: "ØµÙØ­Ù",
    afterPageText: "Ø§Ø² {0}",
    firstText: "ØµÙØ­Ù Ø§ÙÙ",
    prevText: "ØµÙØ­Ù ÙØ¨Ù",
    nextText: "ØµÙØ­Ù Ø¨Ø¹Ø¯",
    lastText: "ØµÙØ­Ù Ø¢Ø®Ø±",
    refreshText: "Ø¨Ø§Ø²Ø®ÙØ§ÙÛ",
    displayMsg: "ÙÙØ§ÛØ´ {0} - {1} of {2}",
    emptyMsg: 'Ø¯Ø§Ø¯Ù Ø§Û Ø¨Ø±Ø§Û ÙÙØ§ÛØ´ ÙØ¬ÙØ¯ ÙØ¯Ø§Ø±Ø¯'
});

Ext.define("Ext.locale.fa.form.field.Text", {
    override: "Ext.form.field.Text",
    minLengthText: "Ø­Ø¯Ø§ÙÙ Ø·ÙÙ Ø§ÛÙ ÙÛÙØ¯ Ø¨Ø±Ø§Ø¨Ø± Ø§Ø³Øª Ø¨Ø§ {0}",
    maxLengthText: "Ø­Ø¯Ø§Ú©Ø«Ø± Ø·ÙÙ Ø§ÛÙ ÙÛÙØ¯ Ø¨Ø±Ø§Ø¨Ø± Ø§Ø³Øª Ø¨Ø§ {0}",
    blankText: "Ø§ÛÙ ÙÛÙØ¯ Ø¨Ø§ÛØ¯ ÙÙØ¯Ø§Ø±Û Ø¯Ø§Ø´ØªÙ Ø¨Ø§Ø´Ø¯",
    regexText: "",
    emptyText: null
});

Ext.define("Ext.locale.fa.form.field.Number", {
    override: "Ext.form.field.Number",
    minText: "Ø­Ø¯Ø§ÙÙ ÙÙØ¯Ø§Ø± Ø§ÛÙ ÙÛÙØ¯ Ø¨Ø±Ø§Ø¨Ø± Ø§Ø³Øª Ø¨Ø§ {0}",
    maxText: "Ø­Ø¯Ø§Ú©Ø«Ø± ÙÙØ¯Ø§Ø± Ø§ÛÙ ÙÛÙØ¯ Ø¨Ø±Ø§Ø¨Ø± Ø§Ø³Øª Ø¨Ø§ {0}",
    nanText: "{0} ÛÚ© Ø¹Ø¯Ø¯ ÙÛØ³Øª"
});

Ext.define("Ext.locale.fa.form.field.Date", {
    override: "Ext.form.field.Date",
    disabledDaysText: "ØºÛØ±ÙØ¹Ø§Ù",
    disabledDatesText: "ØºÛØ±ÙØ¹Ø§Ù",
    minText: "ØªØ§Ø±ÛØ® Ø¨Ø§ÛØ¯ Ù¾Ø³ Ø§Ø² {0} Ø¨Ø§Ø´Ø¯",
    maxText: "ØªØ§Ø±ÛØ® Ø¨Ø§ÛØ¯ Ù¾Ø³ Ø§Ø² {0} Ø¨Ø§Ø´Ø¯",
    invalidText: "{0} ØªØ§Ø±ÛØ® ØµØ­ÛØ­Û ÙÛØ³Øª - ÙØ±ÙØª ØµØ­ÛØ­ {1}",
    format: "y/m/d"
});

Ext.define("Ext.locale.fa.form.field.ComboBox", {
    override: "Ext.form.field.ComboBox",
    valueNotFoundText: undefined
}, function() {
    Ext.apply(Ext.form.field.ComboBox.prototype.defaultListConfig, {
        loadingText: "Ø¯Ø± Ø­Ø§Ù Ø¨Ø§Ø±Ú¯Ø°Ø§Ø±Û ..."
    });
});

Ext.define("Ext.locale.fa.form.field.VTypes", {
    override: "Ext.form.field.VTypes",
    emailText: 'ÙÙØ¯Ø§Ø± Ø§ÛÙ ÙÛÙØ¯ Ø¨Ø§ÛØ¯ ÛÚ© Ø§ÛÙÛÙ Ø¨Ø§ Ø§ÛÙ ÙØ±ÙØª Ø¨Ø§Ø´Ø¯ "user@example.com"',
    urlText: 'ÙÙØ¯Ø§Ø± Ø§ÛÙ Ø¢Ø¯Ø±Ø³ Ø¨Ø§ÛØ¯ ÛÚ© Ø¢Ø¯Ø±Ø³ Ø³Ø§ÛØª Ø¨Ø§ Ø§ÛÙ ÙØ±ÙØª Ø¨Ø§Ø´Ø¯ "http:/' + '/www.example.com"',
    alphaText: 'ÙÙØ¯Ø§Ø± Ø§ÛÙ ÙÛÙØ¯ Ø¨Ø§ÛØ¯ ÙÙØ· Ø§Ø² Ø­Ø±ÙÙ Ø§ÙÙØ¨Ø§ Ù _ ØªØ´Ú©ÛÙ Ø´Ø¯Ù Ø¨Ø§Ø´Ø¯ ',
    alphanumText: 'ÙÙØ¯Ø§Ø± Ø§ÛÙ ÙÛÙØ¯ Ø¨Ø§ÛØ¯ ÙÙØ· Ø§Ø² Ø­Ø±ÙÙ Ø§ÙÙØ¨Ø§Ø Ø§Ø¹Ø¯Ø§Ø¯ Ù _ ØªØ´Ú©ÛÙ Ø´Ø¯Ù Ø¨Ø§Ø´Ø¯'
});

Ext.define("Ext.locale.fa.form.field.HtmlEditor", {
    override: "Ext.form.field.HtmlEditor",
    createLinkText: 'ÙØ·ÙØ§ Ø¢Ø¯Ø±Ø³ ÙÛÙÚ© Ø±Ø§ ÙØ§Ø±Ø¯ Ú©ÙÛØ¯:'
}, function() {
    Ext.apply(Ext.form.field.HtmlEditor.prototype, {
        buttonTips: {
            bold: {
                title: 'ØªÛØ±Ù (Ctrl+B)',
                text: 'ÙØªÙ Ø§ÙØªØ®Ø§Ø¨ Ø´Ø¯Ù Ø±Ø§ ØªÛØ±Ù ÙÛ Ú©ÙØ¯.',
                cls: Ext.baseCSSPrefix + 'html-editor-tip'
            },
            italic: {
                title: 'Ø§ÛØªØ§ÙÛÚ© (Ctrl+I)',
                text: 'ÙØªÙ Ø§ÙØªØ®Ø§Ø¨ Ø´Ø¯Ù Ø±Ø§ Ø§ÛØªØ§ÙÛÚ© ÙÛ Ú©ÙØ¯.',
                cls: Ext.baseCSSPrefix + 'html-editor-tip'
            },
            underline: {
                title: 'Ø²ÛØ±Ø®Ø· (Ctrl+U)',
                text: 'Ø²ÛØ± ÙØ± ÙÙØ´ØªÙ ÛÚ© Ø®Ø· ÙÙØ§ÛØ´ ÙÛ Ø¯ÙØ¯.',
                cls: Ext.baseCSSPrefix + 'html-editor-tip'
            },
            increasefontsize: {
                title: 'Ø§ÙØ²Ø§ÛØ´ Ø§ÙØ¯Ø§Ø²Ù',
                text: 'Ø§ÙØ¯Ø§Ø²Ù ÙÙÙØª Ø±Ø§ Ø§ÙØ²Ø§ÛØ´ ÙÛ Ø¯ÙØ¯.',
                cls: Ext.baseCSSPrefix + 'html-editor-tip'
            },
            decreasefontsize: {
                title: 'Ú©Ø§ÙØ´ Ø§ÙØ¯Ø§Ø²Ù',
                text: 'Ø§ÙØ¯Ø§Ø²Ù ÙØªÙ Ø±Ø§ Ú©Ø§ÙØ´ ÙÛ Ø¯ÙØ¯.',
                cls: Ext.baseCSSPrefix + 'html-editor-tip'
            },
            backcolor: {
                title: 'Ø±ÙÚ¯ Ø²ÙÛÙÙ ÙØªÙ',
                text: 'Ø¨Ø±Ø§Û ØªØºÛÛØ± Ø±ÙÚ¯ Ø²ÙÛÙÙ ÙØªÙ Ø§Ø³ØªÙØ§Ø¯Ù ÙÛ Ø´ÙØ¯.',
                cls: Ext.baseCSSPrefix + 'html-editor-tip'
            },
            forecolor: {
                title: 'Ø±ÙÚ¯ ÙÙÙ',
                text: 'Ø±ÙÚ¯  ÙÙÙ ÙØªÙ Ø±Ø§ ØªØºÛÛØ± ÙÛ Ø¯ÙØ¯.',
                cls: Ext.baseCSSPrefix + 'html-editor-tip'
            },
            justifyleft: {
                title: 'ÚÛØ¯Ù ÙØªÙ Ø§Ø² Ø³ÙØª ÚÙ¾',
                text: 'ÙØªÙ Ø§Ø² Ø³ÙØª ÚÙ¾ ÚÛØ¯Ù Ø´Ø¯Ù ÙÛ Ø´ÙØ¯.',
                cls: Ext.baseCSSPrefix + 'html-editor-tip'
            },
            justifycenter: {
                title: 'ÙØªÙ Ø¯Ø± ÙØ³Ø· ',
                text: 'ÙÙØ§ÛØ´ ÙØªÙ Ø¯Ø± ÙØ³ÙØª ÙØ³Ø· ØµÙØ­Ù Ù Ø±Ø¹Ø§Ø¨Øª Ø³ÙØª ÚÙ¾ Ù Ø±Ø§Ø³Øª.',
                cls: Ext.baseCSSPrefix + 'html-editor-tip'
            },
            justifyright: {
                title: 'ÚÛØ¯Ù ÙØªÙ Ø§Ø² Ø³ÙØª Ø±Ø§Ø³Øª',
                text: 'ÙØªÙ Ø§Ø² Ø³ÙØª Ø±Ø§Ø³Øª Ù¾ÛØ¯Ù Ø®ÙØ§ÙØ¯ Ø´Ø¯.',
                cls: Ext.baseCSSPrefix + 'html-editor-tip'
            },
            insertunorderedlist: {
                title: 'ÙÛØ³Øª ÙÙØ±Ø§Ù Ø¨Ø§ Ø¹ÙØ§ÙØª',
                text: 'ÛÚ© ÙÛØ³Øª Ø¬Ø¯ÛØ¯ Ø§ÛØ¬Ø§Ø¯ ÙÛ Ú©ÙØ¯.',
                cls: Ext.baseCSSPrefix + 'html-editor-tip'
            },
            insertorderedlist: {
                title: 'ÙÛØ³Øª Ø¹Ø¯Ø¯Û',
                text: 'ÛÚ© ÙÛØ³Øª Ø¹Ø¯Ø¯Û Ø§ÛØ¬Ø§Ø¯ ÙÛ Ú©ÙØ¯. ',
                cls: Ext.baseCSSPrefix + 'html-editor-tip'
            },
            createlink: {
                title: 'ÙÛÙÚ©',
                text: 'ÙØªÙ Ø§ÙØªØ®Ø§Ø¨ Ø´Ø¯Ù Ø±Ø§ Ø¨Ù ÙÛÙÚ© ØªØ¨Ø¯ÛÙ Ú©ÙÛØ¯.',
                cls: Ext.baseCSSPrefix + 'html-editor-tip'
            },
            sourceedit: {
                title: 'ÙÛØ±Ø§ÛØ´ Ø³ÙØ±Ø³',
                text: 'Ø±ÙØªÙ Ø¨Ù Ø­Ø§ÙØª ÙÛØ±Ø§ÛØ´ Ø³ÙØ±Ø³.',
                cls: Ext.baseCSSPrefix + 'html-editor-tip'
            }
        }
    });
});

Ext.define("Ext.locale.fa.grid.header.Container", {
    override: "Ext.grid.header.Container",
    sortAscText: "ÙØ±ØªØ¨ Ø³Ø§Ø²Û Ø§ÙØ²Ø§ÛØ´Û",
    sortDescText: "ÙØ±ØªØ¨ Ø³Ø§Ø²Û Ú©Ø§ÙØ´Û",
    lockText: "ÙÙÙ Ø³ØªÙÙ ÙØ§",
    unlockText: "Ø¨Ø§Ø²Ú©Ø±Ø¯Ù Ø³ØªÙÙ ÙØ§",
    columnsText: "Ø³ØªÙÙ ÙØ§"
});

Ext.define("Ext.locale.fa.grid.PropertyColumnModel", {
    override: "Ext.grid.PropertyColumnModel",
    nameText: "ÙØ§Ù",
    valueText: "ÙÙØ¯Ø§Ø±",
    dateFormat: "Y/m/d"
});

Ext.define("Ext.locale.fa.window.MessageBox", {
    override: "Ext.window.MessageBox",
    buttonText: {
        ok: "OK",
        cancel: "Kanselleer",
        yes: "Ja",
        no: "Nee"
    }
});

// This is needed until we can refactor all of the locales into individual files
Ext.define("Ext.locale.fa.Component", {
    override: "Ext.Component"
});
