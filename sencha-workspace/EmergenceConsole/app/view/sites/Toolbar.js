/*jslint browser: true, undef: true *//*global Ext*/
Ext.define('EmergenceConsole.view.sites.Toolbar', {
    extend: 'Ext.toolbar.Toolbar',
    xtype: 'sites-toolbar',

    items: [{
        xtype: 'textfield',
        name: 'Host',
    },{
        xtype: 'button',
        name: 'SetHost',
        text: 'Update Host'
    },{
        xtype: 'textfield',
        name: 'Search',
        flex: 10,
        emptyText: 'Search files and commands'
    },{
        itemId: 'tools',
        xtype: 'container',
        layout: 'card',
        items: {
            xtype: 'container'
        },
        flex: 4
    }]

});
