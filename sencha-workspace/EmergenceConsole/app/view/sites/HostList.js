Ext.define('EmergenceConsole.view.sites.HostList', {
    extend: 'Ext.window.Window',
    xtype: 'sites-hostlist',

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
        }],
        hideHeaders: true
    }]


});
