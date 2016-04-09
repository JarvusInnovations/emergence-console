/*jslint browser: true, undef: true *//*global Ext*/
Ext.define('EmergenceConsole.view.files.Settings', {
    extend: 'Ext.window.Window',
    xtype: 'files-settings',

    requires: [
        'Jarvus.ace.field.ThemeComboBox',
        'Jarvus.ace.field.FontSizeComboBox',
        'Jarvus.ace.field.KeyboardHandlerComboBox',
        'Jarvus.ace.field.ShowInvisiblesCheckbox',
        'Jarvus.ace.field.ShowGutterCheckbox'
    ],

    layout: 'fit',
    header: false,
    closeAction: 'hide',
    width: 360,

    listeners: {
        focusleave: function(me) {
            me.close();
        }
    },

    items: [{
        xtype: 'form',
        padding: 20,
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
            xtype: 'jarvus-ace-field-showinvisiblescheckbox'
        },{
            xtype: 'jarvus-ace-field-showguttercheckbox'
        }]
    }]

});
