/*jslint browser: true, undef: true *//*global Ext*/
Ext.define('EmergenceConsole.view.files.Sources', {
    extend: 'Ext.tree.Panel',
    xtype: 'files-sources',

    rootVisible: true,

    store: [
        'files.Sources'
    ]

});