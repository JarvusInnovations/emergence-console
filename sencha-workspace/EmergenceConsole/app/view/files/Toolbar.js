/*jslint browser: true, undef: true *//*global Ext*/
Ext.define('EmergenceConsole.view.files.Toolbar', {
    extend: 'Ext.toolbar.Toolbar',
    xtype: 'files-toolbar',

    items: [{
        xtype: 'tbfill'
    },{
        iconCls: 'x-fa fa-cog',
        action: 'settings'
    }]

});
