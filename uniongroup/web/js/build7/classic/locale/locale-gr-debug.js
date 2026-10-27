/**
 * Greek (Old Version) Translations by Vagelis
 * 03-June-2007
 */
Ext.onReady(function() {

    if (Ext.Date) {
        Ext.Date.monthNames = ["ÉáíÃ¯ÃµÃñéÃ¯Ã²", "ÃÃ¥Ã¢ñÃ¯ÃµÃñéÃ¯Ã²", "ÃÃñÃ´éÃ¯Ã²", "ÁÃ°ñÃÃ«éÃ¯Ã²", "ÃÃéÃ¯Ã²", "ÉÃ¯Ã½íéÃ¯Ã²", "ÉÃ¯Ã½Ã«éÃ¯Ã²", "ÁÃ½Ã£Ã¯ÃµóÃ´Ã¯Ã²", "ÓÃ¥Ã°Ã´ÃÃ¬Ã¢ñéÃ¯Ã²", "ÃÃªÃ´Ã¾Ã¢ñéÃ¯Ã²", "ÍÃ¯ÃÃ¬Ã¢ñéÃ¯Ã²", "ÃÃ¥ÃªÃÃ¬Ã¢ñéÃ¯Ã²"];

        Ext.Date.dayNames = ["ÃÃµñéáÃªÃ", "ÃÃ¥ÃµÃ´Ãñá", "ÃñÃÃ´Ã§", "ÃÃ¥Ã´ÃñÃ´Ã§", "ÃÃÃ¬Ã°Ã´Ã§", "ÃáñáóÃªÃ¥ÃµÃ", "ÓÃÃ¢Ã¢áÃ´Ã¯"];
    }

    if (Ext.util && Ext.util.Format) {
        Ext.apply(Ext.util.Format, {
            thousandSeparator: '.',
            decimalSeparator: ',',
            currencySign: '\u20ac',
            // Greek Euro
            dateFormat: 'Ã¬/Ã§/Ã'
        });
    }
});

Ext.define("Ext.locale.gr.view.View", {
    override: "Ext.view.View",
    emptyText: ""
});

Ext.define("Ext.locale.gr.grid.plugin.DragDrop", {
    override: "Ext.grid.plugin.DragDrop",
    dragText: "{0} Ã¥Ã°éÃ«Ã¥Ã£Ã¬ÃíÃ§(Ã¥Ã²) Ã£ñáÃ¬Ã¬Ã(ÃÃ²)"
});

Ext.define("Ext.locale.gr.tab.Tab", {
    override: "Ext.tab.Tab",
    closeText: "ÃÃ«Ã¥ÃóÃ´Ã¥ áÃµÃ´Ã Ã´Ã§í ÃªáñÃ´ÃÃ«á"
});

Ext.define("Ext.locale.gr.form.field.Base", {
    override: "Ext.form.field.Base",
    invalidText: "Ã Ã´éÃ¬Ã óÃ´Ã¯ Ã°Ã¥Ã¤ÃÃ¯ Ã¤Ã¥í Ã¥Ãíáé ÃÃ£ÃªÃµñÃ§"
});

// changing the msg text below will affect the LoadMask
Ext.define("Ext.locale.gr.view.AbstractView", {
    override: "Ext.view.AbstractView",
    loadingText: "ÃÃ¼ñÃ´Ã¹óÃ§..."
});

Ext.define("Ext.locale.gr.picker.Date", {
    override: "Ext.picker.Date",
    todayText: "ÓÃÃ¬Ã¥ñá",
    minText: "Ã Ã§Ã¬Ã¥ñÃ¯Ã¬Ã§íÃá áÃµÃ´Ã Ã¥Ãíáé Ã°ñéí Ã´Ã§í Ã¬éÃªñÃ¼Ã´Ã¥ñÃ§ Ã§Ã¬Ã¥ñÃ¯Ã¬Ã§íÃá",
    maxText: "Ã Ã§Ã¬Ã¥ñÃ¯Ã¬Ã§íÃá áÃµÃ´Ã Ã¥Ãíáé Ã¬Ã¥Ã´Ã Ã´Ã§í Ã¬Ã¥Ã£áÃ«Ã½Ã´Ã¥ñÃ§ Ã§Ã¬Ã¥ñÃ¯Ã¬Ã§íÃá",
    disabledDaysText: "",
    disabledDatesText: "",
    nextText: 'ÃÃ°Ã¼Ã¬Ã¥íÃ¯Ã² ÃÃíáÃ² (Control+Right)',
    prevText: 'ÃñÃ¯Ã§Ã£Ã¯Ã½Ã¬Ã¥íÃ¯Ã² ÃÃíáÃ² (Control+Left)',
    monthYearText: 'ÃÃ°éÃ«ÃÃ®Ã´Ã¥ ÃÃíá (Control+Up/Down Ã£éá Ã¬Ã¥Ã´áÃªÃíÃ§óÃ§ óÃ´á ÃÃ´Ã§)',
    todayTip: "{0} (Spacebar)",
    format: "Ã¬/Ã§/Ã"
});

Ext.define("Ext.locale.gr.toolbar.Paging", {
    override: "Ext.PagingToolbar",
    beforePageText: "ÓÃ¥Ã«ÃÃ¤á",
    afterPageText: "áÃ°Ã¼ {0}",
    firstText: "ÃñÃ¾Ã´Ã§ óÃ¥Ã«ÃÃ¤á",
    prevText: "ÃñÃ¯Ã§Ã£Ã¯Ã½Ã¬Ã¥íÃ§ óÃ¥Ã«ÃÃ¤á",
    nextText: "ÃÃ°Ã¼Ã¬Ã¥íÃ§ óÃ¥Ã«ÃÃ¤á",
    lastText: "ÃÃ¥Ã«Ã¥ÃµÃ´áÃá óÃ¥Ã«ÃÃ¤á",
    refreshText: "ÁíáíÃÃ¹óÃ§",
    displayMsg: "ÃÃ¬Ã¶ÃíéóÃ§ {0} - {1} áÃ°Ã¼ {2}",
    emptyMsg: 'ÃÃ¥í Ã¢ñÃÃ¨Ã§Ãªáí Ã¥Ã£Ã£ñáÃ¶ÃÃ² Ã£éá Ã¥Ã¬Ã¶ÃíéóÃ§'
});

Ext.define("Ext.locale.gr.form.field.Text", {
    override: "Ext.form.field.Text",
    minLengthText: "ÃÃ¯ Ã¥Ã«ÃÃ·éóÃ´Ã¯ Ã¬ÃÃ£Ã¥Ã¨Ã¯Ã² Ã£éá áÃµÃ´Ã¼ Ã´Ã¯ Ã°Ã¥Ã¤ÃÃ¯ Ã¥Ãíáé {0}",
    maxLengthText: "ÃÃ¯ Ã¬ÃÃ£éóÃ´Ã¯ Ã¬ÃÃ£Ã¥Ã¨Ã¯Ã² Ã£éá áÃµÃ´Ã¼ Ã´Ã¯ Ã°Ã¥Ã¤ÃÃ¯ Ã¥Ãíáé {0}",
    blankText: "ÃÃ¯ Ã°Ã¥Ã¤ÃÃ¯ áÃµÃ´Ã¼ Ã¥Ãíáé ÃµÃ°Ã¯Ã·ñÃ¥Ã¹Ã´Ã¯ÃªÃ¼",
    regexText: "",
    emptyText: null
});

Ext.define("Ext.locale.gr.form.field.Number", {
    override: "Ext.form.field.Number",
    minText: "Ã Ã¥Ã«ÃÃ·éóÃ´Ã§ Ã´éÃ¬Ã Ã£éá áÃµÃ´Ã¼ Ã´Ã¯ Ã°Ã¥Ã¤ÃÃ¯ Ã¥Ãíáé {0}",
    maxText: "Ã Ã¬ÃÃ£éóÃ´Ã§ Ã´éÃ¬Ã Ã£éá áÃµÃ´Ã¼ Ã´Ã¯ Ã°Ã¥Ã¤ÃÃ¯ Ã¥Ãíáé {0}",
    nanText: "{0} Ã¤Ã¥í Ã¥Ãíáé ÃÃ£ÃªÃµñÃ¯Ã² áñéÃ¨Ã¬Ã¼Ã²"
});

Ext.define("Ext.locale.gr.form.field.Date", {
    override: "Ext.form.field.Date",
    disabledDaysText: "ÁÃ°Ã¥íÃ¥ñÃ£Ã¯Ã°Ã¯éÃ§Ã¬ÃíÃ¯",
    disabledDatesText: "ÁÃ°Ã¥íÃ¥ñÃ£Ã¯Ã°Ã¯éÃ§Ã¬ÃíÃ¯",
    minText: "Ã Ã§Ã¬Ã¥ñÃ¯Ã¬Ã§íÃá ó' áÃµÃ´Ã¼ Ã´Ã¯ Ã°Ã¥Ã¤ÃÃ¯ Ã°ñÃÃ°Ã¥é íá Ã¥Ãíáé Ã¬Ã¥Ã´Ã áÃ°Ã¼ {0}",
    maxText: "Ã Ã§Ã¬Ã¥ñÃ¯Ã¬Ã§íÃá ó' áÃµÃ´Ã¼ Ã´Ã¯ Ã°Ã¥Ã¤ÃÃ¯ Ã°ñÃÃ°Ã¥é íá Ã¥Ãíáé Ã°ñéí áÃ°Ã¼ {0}",
    invalidText: "{0} Ã¤Ã¥í Ã¥Ãíáé ÃÃ£ÃªÃµñÃ§ Ã§Ã¬Ã¥ñÃ¯Ã¬Ã§íÃá - Ã°ñÃÃ°Ã¥é íá Ã¥Ãíáé Ã´Ã§Ã² Ã¬Ã¯ñÃ¶ÃÃ² {1}",
    format: "Ã¬/Ã§/Ã"
});

Ext.define("Ext.locale.gr.form.field.ComboBox", {
    override: "Ext.form.field.ComboBox",
    valueNotFoundText: undefined
}, function() {
    Ext.apply(Ext.form.field.ComboBox.prototype.defaultListConfig, {
        loadingText: "ÃÃ¼ñÃ´Ã¹óÃ§..."
    });
});

Ext.define("Ext.locale.gr.form.field.VTypes", {
    override: "Ext.form.field.VTypes",
    emailText: 'ÁÃµÃ´Ã¼ Ã´Ã¯ Ã°Ã¥Ã¤ÃÃ¯ Ã°ñÃÃ°Ã¥é íá Ã¥Ãíáé e-mail address Ã´Ã§Ã² Ã¬Ã¯ñÃ¶ÃÃ² "user@example.com"',
    urlText: 'ÁÃµÃ´Ã¼ Ã´Ã¯ Ã°Ã¥Ã¤ÃÃ¯ Ã°ñÃÃ°Ã¥é íá Ã¥Ãíáé Ã¬éá Ã¤éÃ¥Ã½Ã¨ÃµíóÃ§ URL Ã´Ã§Ã² Ã¬Ã¯ñÃ¶ÃÃ² "http:/' + '/www.example.com"',
    alphaText: 'ÁÃµÃ´Ã¼ Ã´Ã¯ Ã°Ã¥Ã¤ÃÃ¯ Ã°ñÃÃ°Ã¥é íá Ã°Ã¥ñéÃÃ·Ã¥é Ã£ñÃÃ¬Ã¬áÃ´á Ãªáé _',
    alphanumText: 'ÁÃµÃ´Ã¼ Ã´Ã¯ Ã°Ã¥Ã¤ÃÃ¯ Ã°ñÃÃ°Ã¥é íá Ã°Ã¥ñéÃÃ·Ã¥é Ã£ñÃÃ¬Ã¬áÃ´á, áñéÃ¨Ã¬Ã¯Ã½Ã² Ãªáé _'
});

Ext.define("Ext.locale.gr.grid.header.Container", {
    override: "Ext.grid.header.Container",
    sortAscText: "ÁÃ½Ã®Ã¯Ãµóá ÃáÃ®éíÃ¼Ã¬Ã§óÃ§",
    sortDescText: "ÃÃ¨ÃíÃ¯Ãµóá ÃáÃ®éíÃ¼Ã¬Ã§óÃ§",
    lockText: "ÃÃ«Ã¥ÃÃ¤Ã¹Ã¬á óÃ´ÃÃ«Ã§Ã²",
    unlockText: "ÃÃ¥ÃªÃ«Ã¥ÃÃ¤Ã¹Ã¬á óÃ´ÃÃ«Ã§Ã²",
    columnsText: "ÓÃ´ÃÃ«Ã¥Ã²"
});

Ext.define("Ext.locale.gr.grid.PropertyColumnModel", {
    override: "Ext.grid.PropertyColumnModel",
    nameText: "Â¼íÃ¯Ã¬á",
    valueText: "ÃéÃ¬Ã",
    dateFormat: "Ã¬/Ã§/Ã"
});

Ext.define("Ext.locale.gr.window.MessageBox", {
    override: "Ext.window.MessageBox",
    buttonText: {
        ok: "ÃíÃ´ÃÃ®Ã¥é",
        cancel: "ÁÃªÃ½ñÃ¹óÃ§",
        yes: "Íáé",
        no: "Â¼Ã·é"
    }
});

// This is needed until we can refactor all of the locales into individual files
Ext.define("Ext.locale.gr.Component", {
    override: "Ext.Component"
});
