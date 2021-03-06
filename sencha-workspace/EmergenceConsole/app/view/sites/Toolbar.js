Ext.define('EmergenceConsole.view.sites.Toolbar', {
    extend: 'Ext.toolbar.Toolbar',
    xtype: 'sites-toolbar',

    items: [{
        xtype: 'button',
        action: 'host-list',
        iconCls: 'x-fa fa-server'
    }, {
        xtype: 'textfield',
        width: 260,
        name: 'Host',
        triggers: {
            'sethost': {
                cls: 'x-fa fa-arrow-right',
                handler: function() {
                    this.fireEvent('updatehost');
                }
            }
        }
    }, {
        xtype: 'textfield',
        name: 'Search',
        flex: 10,
        emptyText: 'Search files and commands'
    }, {
        itemId: 'tools',
        xtype: 'container',
        layout: 'card',
        items: {
            xtype: 'container'
        },
        flex: 2
    }]

});
