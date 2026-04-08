Ext.define('Ext.locale.ja.ux.colorpick.Selector', {
    override: 'Ext.ux.colorpick.Selector',

    okButtonText: 'OK',
    cancelButtonText: 'ã­ã£ã³ã»ã«'
});
// This is needed until we can refactor all of the locales into individual files
Ext.define("Ext.locale.ja.Component", {
    override: "Ext.Component"
});
Ext.define('Ext.locale.ja.Dialog', {
    override: 'Ext.Dialog',

    config: {
        maximizeTool: {
            tooltip: "å¨ç»é¢è¡¨ç¤ºã«æå¤§å"
        },
        restoreTool: {
            tooltip: "åã®ãµã¤ãºã«å¾©å"
        }
    }
});
Ext.define("Ext.locale.ja.LoadMask", {
    override: "Ext.LoadMask",

    config: {
        message: 'èª­ã¿è¾¼ã¿ä¸­...'
    }
});
Ext.define('Ext.locale.ja.Panel', {
    override: 'Ext.Panel',

    config: {
        standardButtons: {
            ok: {
                text: 'OK'
            },
            abort: {
                text: 'ããã'
            },
            retry: {
                text: 'ãªãã©ã¤'
            },
            ignore: {
                text: 'ç¡è¦ãã'
            },
            yes: {
                text: 'ã¯ã'
            },
            no: {
                text: 'ããã'
            },
            cancel: {
                text: 'ã­ã£ã³ã»ã«'
            },
            apply: {
                text: 'é©ç¨ãã'
            },
            save: {
                text: 'ä¿å­ãã'
            },
            submit: {
                text: 'æåºãã'
            },
            help: {
                text: 'å©ãã¦'
            },
            close: {
                text: 'éãã'
            }
        },
        closeToolText: 'Panel éãã'
    }
});
Ext.define('Ext.locale.ja.data.validator.Bound', {
    override: 'Ext.data.validator.Bound',

    config: {
        emptyMessage: 'å­å¨ããå¿è¦ãããã¾ã',
        minOnlyMessage: 'å°ãªãã¨ã{0}ã«ããå¿è¦ãããã¾ã',
        maxOnlyMessage: '{0}ä»¥ä¸ã«ããå¿è¦ãããã¾ã',
        bothMessage: 'å¤ã¯{0}ã¨{1}ã®éã«ãªããã°ãªãã¾ãã'
    }
});
Ext.define('Ext.locale.ja.data.validator.CIDRv4', {
    override: 'Ext.data.validator.CIDRv4',

    config: {
        message: 'æå¹ãªCIDRãã­ãã¯ã§ã¯ããã¾ãã'
    }
});
Ext.define('Ext.locale.ja.data.validator.CIDRv6', {
    override: 'Ext.data.validator.CIDRv6',

    config: {
        message: 'æå¹ãªCIDRãã­ãã¯ã§ã¯ããã¾ãã'
    }
});
Ext.define('Ext.locale.ja.data.validator.Currency', {
    override: 'Ext.data.validator.Currency',

    config: {
        message: 'æå¹ãªéè²¨éé¡ã§ã¯ããã¾ãã'
    }

});
Ext.define('Ext.locale.ja.data.validator.Date', {
    override: 'Ext.data.validator.Date',

    config: {
        message: "æå¹ãªæ¥ä»ã§ã¯ããã¾ãã"
    }
});
Ext.define('Ext.locale.ja.data.validator.DateTime', {
    override: 'Ext.data.validator.DateTime',

    config: {
        message: 'æå¹ãªæ¥æã§ã¯ããã¾ãã'
    }
});
Ext.define('Ext.locale.ja.data.validator.Email', {
    override: 'Ext.data.validator.Email',

    config: {
        message: 'æå¹ãªã¡ã¼ã«ã¢ãã¬ã¹ã§ã¯ããã¾ãã'
    }
});
Ext.define('Ext.locale.ja.data.validator.Exclusion', {
    override: 'Ext.data.validator.Exclusion',

    config: {
        message: 'é¤å¤ãããå¤ã§ã'
    }
});
Ext.define('Ext.locale.ja.data.validator.Format', {
    override: 'Ext.data.validator.Format',

    config: {
        message: 'ãã©ã¼ããããéãã¾ã'
    }
});
Ext.define('Ext.locale.ja.data.validator.IPAddress', {
    override: 'Ext.data.validator.IPAddress',

    config: {
        message: 'æå¹ãªIPã¢ãã¬ã¹ã§ã¯ããã¾ãã'
    }
});
Ext.define('Ext.locale.ja.data.validator.Inclusion', {
    override: 'Ext.data.validator.Inclusion',

    config: {
        message: 'è¨±å®¹å¤ã®ãªã¹ãã«å«ã¾ãã¦ãã¾ãã'
    }
});
Ext.define('Ext.locale.ja.data.validator.Length', {
    override: 'Ext.data.validator.Length',

    config: {
        minOnlyMessage: 'é·ãã¯å°ãªãã¨ã{0}ã§ãªããã°ãªãã¾ãã',
        maxOnlyMessage: 'é·ãã¯{0}ãè¶ãã¦ã¯ããã¾ãã',
        bothMessage: 'é·ãã¯{0}ã¨{1}ã®éã§ãªããã°ãªãã¾ãã'
    }
});
Ext.define('Ext.locale.ja.data.validator.Number', {
    override: 'Ext.data.validator.Number',

    config: {
        message: 'æ°å­ã§ã¯ããã¾ãã'
    }
});
Ext.define('Ext.locale.ja.data.validator.Phone', {
    override: 'Ext.data.validator.Phone',

    config: {
        message: 'æå¹ãªé»è©±çªå·ã§ã¯ããã¾ãã'
    }
});
Ext.define('Ext.locale.ja.data.validator.Presence', {
    override: 'Ext.data.validator.Presence',

    config: {
        message: 'å­å¨ãã¦ããå¿è¦ãããã¾ã'
    }
});
Ext.define('Ext.locale.ja.data.validator.Range', {
    override: 'Ext.data.validator.Range',

    config: {
        nanMessage: 'æ°å¤ã§ãªããã°ãªãã¾ãã',
        minOnlyMessage: 'å°ãªãã¨ã{0}ã«ããå¿è¦ãããã¾ã',
        maxOnlyMessage: '{0}ä»¥ä¸ã«ããå¿è¦ãããã¾ã',
        bothMessage: 'å¤ã¯{0}ã¨{1}ã®éã«ãªããã°ãªãã¾ãã'
    }
});
Ext.define('Ext.locale.ja.data.validator.Time', {
    override: 'Ext.data.validator.Time',

    config: {
        message: 'æå¹ãªæéã§ã¯ããã¾ãã'
    }
});
Ext.define('Ext.locale.ja.data.validator.Url', {
    override: 'Ext.data.validator.Url',

    config: {
        message: 'æå¹ãªURLã§ã¯ããã¾ãã'
    }
});
Ext.define('Ext.locale.ja.dataview.Abstract', {
    override: 'Ext.dataview.Abstract',

    config: {
        loadingText: 'èª­ã¿è¾¼ã¿ä¸­...'
    }
});
Ext.define("Ext.locale.ja.dataview.DataView", {
    override: "Ext.dataview.DataView",

    config: {
        emptyText: "è¡¨ç¤ºãããã¼ã¿ãããã¾ãã"
    }
});
Ext.define('Ext.locale.ja.dataview.EmptyText', {
    override: 'Ext.dataview.EmptyText',

    config: {
        html: 'è¡¨ç¤ºãããã¼ã¿ãããã¾ãã'
    }
});
Ext.define('Ext.locale.ja.dataview.List', {
    override: 'Ext.dataview.List',

    config: {
        loadingText: 'èª­ã¿è¾¼ã¿ä¸­...'
    }
});
Ext.define('Ext.locale.ja.dataview.plugin.ListPaging', {
    override: 'Ext.dataview.plugin.ListPaging',

    config: {
        loadMoreText: 'ããã«èª­ã¿è¾¼ã...',
        noMoreRecordsText: 'ããä»¥ä¸ã¬ã³ã¼ãããªã'
    }
});
/**
 * Japanese translation
 */
Ext.onReady(function() {
    var parseCodes;

    if (Ext.Date) {
        Ext.Date.monthNames = ['1æ', '2æ', '3æ', '4æ', '5æ', '6æ', '7æ', '8æ', '9æ',
                               '10æ', '11æ', '12æ'];

        Ext.Date.defaultFormat = 'd.m.Y';
        Ext.Date.defaultTimeFormat = 'H:i';

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
Ext.define('Ext.locale.ja.field.Date', {
    override: 'Ext.field.Date',

    minDateMessage: 'ãã®ãã£ã¼ã«ãã®æ¥ä»ã¯ã {0} ä»¥éã®æ¥ä»ã«è¨­å®ãã¦ãã ããã',
    maxDateMessage: 'ãã®ãã£ã¼ã«ãã®æ¥ä»ã¯ã {0} ä»¥åã®æ¥ä»ã«è¨­å®ãã¦ãã ããã'
});
Ext.define('Ext.locale.ja.field.Field', {
    override: 'Ext.field.Field',

    config: {
        requiredMessage: 'ãã®ãã£ã¼ã«ãã¯å¿é ã§ã',
        validationMessage: 'å½¢å¼ãééã£ã¦ãã¾ã'
    }
});
Ext.define("Ext.locale.ja.field.FileButton", {
    override: "Ext.field.FileButton",

    config: {
        text: 'åç§...'
    }
});
Ext.define('Ext.locale.ja.field.Number', {
    override: 'Ext.field.Number',

    decimalsText: 'ãã®ãã£ã¼ã«ãã®æå°å¤ã¯ {0} ã§ãã',
    minValueText: 'ãã®ãã£ã¼ã«ãã®æå°å¤ã¯ {0} ã§ãã',
    maxValueText: 'ãã®ãã£ã¼ã«ãã®æå¤§å¤ã¯ {0} ã§ãã',
    badFormatMessage: '{0} ã¯æ°å¤ã§ã¯ããã¾ããã'
});
Ext.define('Ext.locale.ja.field.Text', {
    override: 'Ext.field.Text',

    badFormatMessage: 'å¤ãå¿è¦ãªãã©ã¼ãããã¨ä¸è´ãã¾ãã',
    config: {
        requiredMessage: 'ãã®ãã£ã¼ã«ãã¯å¿é ã§ã',
        validationMessage: 'å½¢å¼ãééã£ã¦ãã¾ã'
    }
});
Ext.define("Ext.locale.ja.grid.filters.menu.Base", {
    override: "Ext.grid.filters.menu.Base",

    config: {
        text: "ãã£ã«ã¿"
    }
});
Ext.define("Ext.locale.ja.grid.locked.Grid", {
    override: 'Ext.grid.locked.Grid',

    config: {
        columnMenu: {
            items: {
                region: {
                    text: 'é å'
                }
            }
        },
        regions: {
            left: {
                menuLabel: 'ã­ãã¯ï¼å·¦ï¼'
            },
            center: {
                menuLabel: 'ã­ãã¯è§£é¤'
            },
            right: {
                menuLabel: 'ã­ãã¯ï¼å³ï¼'
            }
        }
    }
});
Ext.define("Ext.locale.ja.grid.menu.Columns", {
    override: "Ext.grid.menu.Columns",

    config: {
        text: "ã«ã©ã "
    }
});
Ext.define("Ext.locale.ja.grid.menu.GroupByThis", {
    override: "Ext.grid.menu.GroupByThis",

    config: {
        text: "ããã§ã°ã«ã¼ãåãã"
    }
});
Ext.define("Ext.locale.ja.grid.menu.ShowInGroups", {
    override: "Ext.grid.menu.ShowInGroups",

    config: {
        text: "ã°ã«ã¼ãã§è¡¨ç¤º"
    }
});
Ext.define("Ext.locale.ja.grid.menu.SortAsc", {
    override: "Ext.grid.menu.SortAsc",

    config: {
        text: "æé "
    }
});
Ext.define("Ext.locale.ja.grid.menu.SortDesc", {
    override: "Ext.grid.menu.SortDesc",

    config: {
        text: "éé "
    }
});
Ext.define("Ext.locale.ja.grid.plugin.RowDragDrop", {
    override: "Ext.grid.plugin.RowDragDrop",
    dragText: "{0} è¡é¸æ"
});
Ext.define('Ext.locale.ja.panel.Collapser', {
    override: 'Ext.panel.Collapser',

    config: {
        collapseToolText: "ããã«ãéãã",
        expandToolText: "ããã«ãéã"
    }
});
Ext.define('Ext.locale.ja.panel.Date', {
    override: 'Ext.panel.Date',

    config: {
        nextText: 'æ¬¡æã¸ (ã³ã³ãã­ã¼ã«+å³)',
        prevText: 'åæã¸ (ã³ã³ãã­ã¼ã«+å·¦)',
        buttons: {
            footerTodayButton: {
                text: "ä»æ¥"
            }
        }
    }
});
Ext.define('Ext.locale.ja.picker.Date', {
    override: 'Ext.picker.Date',

    config: {
        doneButton: 'done',
        monthText: 'æ',
        dayText: 'æ¥',
        yearText: 'å¹´'
    }
});
Ext.define('Ext.locale.ja.picker.Picker', {
    override: 'Ext.picker.Picker',

    config: {
        doneButton: 'done',
        cancelButton: 'ã­ã£ã³ã»ã«'
    }
});
