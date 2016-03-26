/*jslint browser: true, undef: true *//*global Ext*/
Ext.define('EmergenceConsole.view.sites.Menu', {
    extend: 'Ext.toolbar.Toolbar',
    xtype: 'sites-menu',

    vertical: true,

    items: [{
        text: 'Changes',
        iconCls: 'x-fa fa-home',
        scale: 'medium',
        iconAlign: 'top'
    },{
        text: 'Files',
        iconCls: 'x-fa fa-home',
        scale: 'medium',
        iconAlign: 'top'
    },{
        text: 'Sources',
        iconCls: 'x-fa fa-home',
        scale: 'medium',
        iconAlign: 'top'
    },{
        text: 'Docs',
        iconCls: 'x-fa fa-home',
        scale: 'medium',
        iconAlign: 'top'
    }]

});
