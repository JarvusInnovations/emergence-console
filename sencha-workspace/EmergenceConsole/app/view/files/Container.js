/*jslint browser: true, undef: true *//*global Ext*/
Ext.define('EmergenceConsole.view.files.Container', {
    extend: 'Ext.Container',
    xtype: 'files-container',

    layout: {
        type: 'hbox',
        align: 'stretch'
    },

    items: [{
        xtype: 'container',
        width: 200,
        layout: {
            type: 'vbox',
            align: 'stretch'
        },
        items: [{
            xtype: 'files-openfilesgrid',
            title: 'Open Files',
            flex: 1
        },{
            xtype: 'files-sources',
            title: 'Sources',
            flex: 3
        }]
    },{
        xtype: 'container',
        itemId: 'editor-container',
        layout: 'card',
        flex: 1
    }]

});
