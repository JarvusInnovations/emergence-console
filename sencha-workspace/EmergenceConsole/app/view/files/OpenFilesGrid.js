/*jslint browser: true, undef: true *//*global Ext*/
Ext.define('EmergenceConsole.view.files.OpenFilesGrid', {
    extend: 'Ext.grid.Panel',
    xtype: 'files-openfilesgrid',

    store: 'files.FileRefs',

    hideHeaders: true,
    viewConfig: {
        loadMask: false
    },

    columns: [{
        text: 'Name',
        dataIndex: 'fileName',
        flex: 1
    }]
});
