/*jslint browser: true, undef: true *//*global Ext*/
Ext.define('EmergenceConsole.view.files.Sources', {
    extend: 'Ext.tree.Panel',
    xtype: 'files-sources',

    store: 'files.Sources',

    viewConfig: {
        loadMask: false
    },

    rootVisible: false


});
