/*jslint browser: true, undef: true *//*global Ext*/
Ext.define('EmergenceConsole.view.files.Settings', {
    extend: 'Ext.window.Window',
    xtype: 'files-settings',

    requires: [
        'Jarvus.ace.field.ThemeComboBox',
        'Jarvus.ace.field.FontSizeComboBox',
        'Jarvus.ace.field.KeyboardHandlerComboBox',
        'Jarvus.ace.field.ShowInvisiblesCheckbox',
        'Jarvus.ace.field.ShowGutterCheckbox',

        'EmergenceConsole.view.files.AceOptionMarginField'
    ],

    layout: 'fit',
    header: false,
    border: 0,
    closeAction: 'hide',
    width: 260,
    shadow: false,

    listeners: {
        focusleave: function(me) {
            me.close();
        }
    },

    items: [{
        xtype: 'form',
        padding: 16,
        defaults: {
            labelWidth: 100
        },
        items: [{
            xtype: 'jarvus-ace-field-themecombobox',
            fieldLabel: 'theme'
        },{
            xtype: 'jarvus-ace-field-fontsizecombobox',
            fieldLabel: 'Font size'
        },{
            xtype: 'jarvus-ace-field-keyboardhandlercombobox',
            fieldLabel: 'keyboard'
        },{
            xtype: 'files-aceoptionmarginfield',
            width: 180,
            fieldLabel: 'right margin'
        },{
            xtype: 'jarvus-ace-field-showinvisiblescheckbox'
        },{
            xtype: 'jarvus-ace-field-showguttercheckbox'
        }]
    }]

});
