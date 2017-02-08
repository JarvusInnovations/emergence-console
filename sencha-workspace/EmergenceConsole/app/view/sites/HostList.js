Ext.define('EmergenceConsole.view.sites.HostList', {
    extend: 'Ext.window.Window',
    xtype: 'sites-hostlist',

    requires: [
        'Ext.grid.column.Action'
    ],

    layout: 'fit',
    header: false,
    border: 0,
    closeAction: 'hide',
    width: 360,
    shadow: false,

    dockedItems: [{
        xtype: 'button',
        text: 'Remember current host',
        action: 'remember-host',
        docked: 'top'
    }],

    items: [{
        xtype: 'grid',
        store: {
            xclass: 'EmergenceConsole.store.sites.Hosts'
        },
        columns: [{
            text: 'host',
            dataIndex: 'host',
            flex: 1
        }, {
            xtype: 'actioncolumn',
            width: 25,
            items: [{
                action: 'remove',
                glyph: 'xf057@FontAwesome',
                tooltip: 'Remove'
            }]
        }],
        hideHeaders: true
    }]

});
