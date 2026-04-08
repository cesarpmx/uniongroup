Ext.define('Ext.locale.zh_CN.ux.colorpick.Selector', {
    override: 'Ext.ux.colorpick.Selector',

    okButtonText: 'ç¡®å®',
    cancelButtonText: 'åæ¶'
});
// This is needed until we can refactor all of the locales into individual files
Ext.define("Ext.locale.zh_CN.Component", {
    override: "Ext.Component"
});
Ext.define('Ext.locale.zh_CN.Dialog', {
    override: 'Ext.Dialog',

    config: {
        maximizeTool: {
            tooltip: "æå¤§åå°å¨å±"
        },
        restoreTool: {
            tooltip: "æ¢å¤å°åå§å¤§å°"
        }
    }
});
Ext.define("Ext.locale.zh_CN.LoadMask", {
    override: "Ext.LoadMask",

    config: {
        message: 'è¯»åä¸­...'
    }
});
Ext.define('Ext.locale.zh_CN.Panel', {
    override: 'Ext.Panel',

    config: {
        standardButtons: {
            ok: {
                text: 'OK'
            },
            abort: {
                text: 'éåº'
            },
            retry: {
                text: 'éè¯'
            },
            ignore: {
                text: 'å¿½è§'
            },
            yes: {
                text: 'æ¯'
            },
            no: {
                text: 'æ²¡æ'
            },
            cancel: {
                text: 'åæ¶'
            },
            apply: {
                text: 'åºç¨'
            },
            save: {
                text: 'ä¿å­'
            },
            submit: {
                text: 'æäº¤'
            },
            help: {
                text: 'æå½'
            },
            close: {
                text: 'å³é­'
            }
        },
        closeToolText: 'å³é­é¢æ¿'
    }
});
Ext.define('Ext.locale.zh_CN.data.validator.Bound', {
    override: 'Ext.data.validator.Bound',

    config: {
        emptyMessage: 'å¿é¡»å­å¨',
        minOnlyMessage: 'å¿é¡»è³å°ä¸º{0}',
        maxOnlyMessage: 'å¿é¡»ä¸è¶è¿{0}',
        bothMessage: 'å¿é¡»å¨ {0} å {1} ä¹é´'
    }
});
Ext.define('Ext.locale.zh_CN.data.validator.CIDRv4', {
    override: 'Ext.data.validator.CIDRv4',

    config: {
        message: 'ä¸æ¯ææçCIDRå'
    }
});
Ext.define('Ext.locale.zh_CN.data.validator.CIDRv6', {
    override: 'Ext.data.validator.CIDRv6',

    config: {
        message: 'ä¸æ¯ææçCIDRå'
    }
});
Ext.define('Ext.locale.zh_CN.data.validator.Currency', {
    override: 'Ext.data.validator.Currency',

    config: {
        message: 'ä¸æ¯ææçè´§å¸éé¢'
    }
});
Ext.define('Ext.locale.zh_CN.data.validator.Date', {
    override: 'Ext.data.validator.Date',

    config: {
        message: "ä¸æ¯æææ¥æ"
    }
});
Ext.define('Ext.locale.zh_CN.data.validator.DateTime', {
    override: 'Ext.data.validator.DateTime',

    config: {
        message: 'ä¸æ¯ææçæ¥æåæ¶é´'
    }
});
Ext.define('Ext.locale.zh_CN.data.validator.Email', {
    override: 'Ext.data.validator.Email',

    config: {
        message: 'ä¸æ¯ææççµå­é®ä»¶å°å'
    }
});
Ext.define('Ext.locale.zh_CN.data.validator.Exclusion', {
    override: 'Ext.data.validator.Exclusion',

    config: {
        message: 'æ¯å·²æé¤çå¼'
    }
});
Ext.define('Ext.locale.zh_CN.data.validator.Format', {
    override: 'Ext.data.validator.Format',

    config: {
        message: 'å®çæ ¼å¼ä¸å¯¹'
    }
});
Ext.define('Ext.locale.zh_CN.data.validator.IPAddress', {
    override: 'Ext.data.validator.IPAddress',

    config: {
        message: 'ä¸æ¯ææçIPå°å'
    }
});
Ext.define('Ext.locale.zh_CN.data.validator.Inclusion', {
    override: 'Ext.data.validator.Inclusion',

    config: {
        message: 'å®ä¸å¨å¯æ¥åå¼çåè¡¨ä¸­'
    }
});
Ext.define('Ext.locale.zh_CN.data.validator.Length', {
    override: 'Ext.data.validator.Length',

    config: {
        minOnlyMessage: 'é¿åº¦å¿é¡»è³å°ä¸º{0}',
        maxOnlyMessage: 'é¿åº¦ä¸å¾è¶è¿{0}',
        bothMessage: 'é¿åº¦å¿é¡»ä»äº{0}å{1}ä¹é´'
    }
});
Ext.define('Ext.locale.zh_CN.data.validator.Number', {
    override: 'Ext.data.validator.Number',

    config: {
        message: 'ä¸æ¯ææçæ°å­'
    }
});
Ext.define('Ext.locale.zh_CN.data.validator.Phone', {
    override: 'Ext.data.validator.Phone',

    config: {
        message: 'ä¸æ¯ææççµè¯å·ç '
    }
});
Ext.define('Ext.locale.zh_CN.data.validator.Presence', {
    override: 'Ext.data.validator.Presence',

    config: {
        message: 'å¿é¡»å¨åº'
    }
});
Ext.define('Ext.locale.zh_CN.data.validator.Range', {
    override: 'Ext.data.validator.Range',

    config: {
        nanMessage: 'å®å¿é¡»æ¯æ°å­',
        minOnlyMessage: 'å¿é¡»è³å°ä¸º{0}',
        maxOnlyMessage: 'å¿é¡»ä¸è¶è¿{0}',
        bothMessage: 'å¿é¡»å¨ {0} å {1} ä¹é´'
    }
});
Ext.define('Ext.locale.zh_CN.data.validator.Time', {
    override: 'Ext.data.validator.Time',

    config: {
        message: 'ä¸æ¯ææçæ¶é´'
    }
});
Ext.define('Ext.locale.zh_CN.data.validator.Url', {
    override: 'Ext.data.validator.Url',

    config: {
        message: 'ä¸æ¯ææçURL'
    }
});
Ext.define('Ext.locale.zh_CN.dataview.Abstract', {
    override: 'Ext.dataview.Abstract',

    config: {
        loadingText: 'è¯»åä¸­...'
    }
});
Ext.define("Ext.locale.zh_CN.dataview.DataView", {
    override: "Ext.dataview.DataView",

    config: {
        emptyText: "æ²¡æè¦æ¾ç¤ºçæ°æ®"
    }
});
Ext.define('Ext.locale.zh_CN.dataview.EmptyText', {
    override: 'Ext.dataview.EmptyText',

    config: {
        html: 'æ²¡ææ°æ®æ¾ç¤º'
    }
});
Ext.define('Ext.locale.zh_CN.dataview.List', {
    override: 'Ext.dataview.List',

    config: {
        loadingText: 'è¯»åä¸­...'
    }
});
Ext.define('Ext.locale.zh_CN.dataview.plugin.ListPaging', {
    override: 'Ext.dataview.plugin.ListPaging',

    config: {
        loadMoreText: 'å è½½æ´å¤...',
        noMoreRecordsText: 'æ²¡ææ´å¤è®°å½'
    }
});
/**
 * Simplified Chinese translation
 */
Ext.onReady(function() {
    var parseCodes;

    if (Ext.Date) {
        Ext.Date.monthNames = ["ä¸æ", "äºæ", "ä¸æ", "åæ", "äºæ", "å­æ", "ä¸æ", "å«æ",
                               "ä¹æ", "åæ", "åä¸æ", "åäºæ"];

        Ext.Date.dayNames = ["æææ¥", "ææä¸", "ææäº", "ææä¸", "ææå", "ææäº", "ææå­"];

        Ext.Date.formatCodes.a = "(this.getHours() < 12 ? 'ä¸å' : 'ä¸å')";
        Ext.Date.formatCodes.A = "(this.getHours() < 12 ? 'ä¸å' : 'ä¸å')";

        parseCodes = {
            g: 1,
            c: "if (/(ä¸å)/i.test(results[{0}])) {\n" +
                "if (!h || h == 12) { h = 0; }\n" +
                "} else { if (!h || h < 12) { h = (h || 0) + 12; }}",
            s: "(ä¸å|ä¸å)",
            calcAtEnd: true
        };

        Ext.Date.parseCodes.a = Ext.Date.parseCodes.A = parseCodes;
    }

    if (Ext.util && Ext.util.Format) {
        Ext.apply(Ext.util.Format, {
            thousandSeparator: ',',
            decimalSeparator: '.',
            currencySign: '\u00a5',
            // Chinese Yuan
            dateFormat: 'yå¹´mædæ¥'
        });
    }
});
Ext.define('Ext.locale.zh_CN.field.Date', {
    override: 'Ext.field.Date',

    minDateMessage: 'æ­¤å­æ®µä¸­çæ¥æå¿é¡»å¨ {0} ä¹å',
    maxDateMessage: 'æ­¤å­æ®µä¸­çæ¥æå¿é¡»ä¸º {0}'
});
Ext.define('Ext.locale.zh_CN.field.Field', {
    override: 'Ext.field.Field',

    config: {
        requiredMessage: 'æ­¤å­æ®µæ¯å¿å¡«å­æ®µ',
        validationMessage: 'æ ¼å¼éè¯¯'
    }
});
Ext.define("Ext.locale.zh_CN.field.FileButton", {
    override: "Ext.field.FileButton",

    config: {
        text: 'è¯è®º......'
    }
});
Ext.define('Ext.locale.zh_CN.field.Number', {
    override: 'Ext.field.Number',

    decimalsText: 'æå¤§åè¿å¶æ° (0)',
    minValueText: 'è¯¥è¾å¥é¡¹çæå°å¼æ¯ {0}',
    maxValueText: 'è¯¥è¾å¥é¡¹çæå¤§å¼æ¯ {0}',
    badFormatMessage: '{0} ä¸æ¯æææ°å¼'
});
Ext.define('Ext.locale.zh_CN.field.Text', {
    override: 'Ext.field.Text',

    badFormatMessage: 'å¼ä¸æéæ ¼å¼ä¸å¹é',
    config: {
        requiredMessage: 'æ­¤å­æ®µæ¯å¿å¡«å­æ®µ',
        validationMessage: 'æ ¼å¼éè¯¯'
    }
});
Ext.define("Ext.locale.zh_CN.grid.filters.menu.Base", {
    override: "Ext.grid.filters.menu.Base",

    config: {
        text: "è¿æ»¤å¨"
    }
});
Ext.define("Ext.locale.zh_CN.grid.locked.Grid", {
    override: 'Ext.grid.locked.Grid',

    config: {
        columnMenu: {
            items: {
                region: {
                    text: 'åºå'
                }
            }
        },
        regions: {
            left: {
                menuLabel: 'éå®ï¼å·¦)'
            },
            center: {
                menuLabel: 'è§£é'
            },
            right: {
                menuLabel: 'éå®ï¼å³ï¼'
            }
        }
    }
});
Ext.define("Ext.locale.zh_CN.grid.menu.Columns", {
    override: "Ext.grid.menu.Columns",

    config: {
        // update
        text: "å"
    }
});
Ext.define("Ext.locale.zh_CN.grid.menu.GroupByThis", {
    override: "Ext.grid.menu.GroupByThis",

    config: {
        text: "ç±æ­¤åç»"
    }
});
Ext.define("Ext.locale.zh_CN.grid.menu.ShowInGroups", {
    override: "Ext.grid.menu.ShowInGroups",

    config: {
        text: "åç»æ¾ç¤º"
    }
});
Ext.define("Ext.locale.zh_CN.grid.menu.SortAsc", {
    override: "Ext.grid.menu.SortAsc",

    config: {
        // update
        text: "æ­£åº"
    }
});
Ext.define("Ext.locale.zh_CN.grid.menu.SortDesc", {
    override: "Ext.grid.menu.SortDesc",

    config: {
        // update
        text: "ååº"
    }
});
Ext.define("Ext.locale.zh_CN.grid.plugin.RowDragDrop", {
    override: "Ext.grid.plugin.RowDragDrop",
    dragText: "éæ©äº {0} è¡"
});
Ext.define('Ext.locale.zh_CN.panel.Collapser', {
    override: 'Ext.panel.Collapser',

    config: {
        collapseToolText: "å³é­é¢æ¿",
        expandToolText: "å±å¼é¢æ¿"
    }
});
Ext.define('Ext.locale.zh_CN.panel.Date', {
    override: 'Ext.panel.Date',

    config: {
        nextText: 'ä¸ä¸ªæ (Ctrl+Right)',
        prevText: 'ä¸ä¸ªæ (Ctrl+Left',
        buttons: {
            footerTodayButton: {
                text: "ä»å¤©"
            }
        }
    }
});
Ext.define('Ext.locale.zh_CN.picker.Date', {
    override: 'Ext.picker.Date',

    config: {
        doneButton: 'done',
        monthText: 'æ',
        dayText: 'æ¥',
        yearText: 'å¹´'
    }
});
Ext.define('Ext.locale.zh_CN.picker.Picker', {
    override: 'Ext.picker.Picker',

    config: {
        doneButton: 'done',
        cancelButton: 'åæ¶'
    }
});
