/*jslint browser: true, undef: true *//*global Ext*/
Ext.define('EmergenceConsole.view.files.EditorContainer', {
    extend: 'Ext.Panel',
    xtype: 'files-editorcontainer',

/*
    config: {
        openFiles: []
    },
*/

    layout: 'card',

    dockedItems: [{
        xtype: 'files-editortoolbar',
        dock: 'top'
    }]

});
