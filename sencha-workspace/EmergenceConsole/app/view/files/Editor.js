/*jslint browser: true, undef: true *//*global Ext*/
Ext.define('EmergenceConsole.view.files.Editor', {
    extend: 'Jarvus.ace.Editor',
    xtype: 'files-editor',

    requires: [
        'EmergenceConsole.view.files.AceConfiguration'
    ]


});
