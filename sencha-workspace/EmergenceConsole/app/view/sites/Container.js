/*jslint browser: true, undef: true *//*global Ext*/
Ext.define('EmergenceConsole.view.sites.Container', {
    extend: 'Ext.tab.Panel',
    xtype: 'sites-container',

    layout: 'fit',

    ui: 'navigation',
    tabPosition: 'left',
    tabRotation: 0,

    defaults: {
        iconAlign: 'top'
    },

    items: [{
        iconCls: 'x-fa fa-area-chart',
        title: 'Changes',
        html: 'Changes'
    },{
        iconCls: 'x-fa fa-files-o',
        title: 'Files',
        html: 'Files'
    },{
        iconCls: 'x-fa fa-cloud-download',
        title: 'Sources',
        html: 'Sources'
    },{
        iconCls: 'x-fa fa-square',
        title: 'Shell',
        html: 'Shell'
    },{
        iconCls: 'x-fa fa-info-circle',
        title: 'Docs',
        html: 'Docs'
    }],

    dockedItems: [{
        xtype: 'sites-toolbar',
        docked: 'top'
    }]

});
