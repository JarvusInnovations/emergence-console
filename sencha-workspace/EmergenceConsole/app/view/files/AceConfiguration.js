/*jslint browser: true, undef: true *//*global Ext*/
Ext.define('EmergenceConsole.view.files.AceConfiguration', {
    override: 'Jarvus.ace.util.AbstractConfiguration',

    config: {
        options: {
            theme: 'ace/theme/kr_theme',
            fontSize: 14,
            highlightActiveLine: false,
            showPrintMargin: false
        }
    }
});
