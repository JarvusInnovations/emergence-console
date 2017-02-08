/* global EmergenceConsole */
Ext.define('EmergenceConsole.controller.Sites', {
    extend: 'Ext.app.Controller',

    // entry points
    routes: {
        'sites': 'showSitesConsole'
    },

    control: {
        'sites-menu button': {
            'click': 'onMenuButtonClick'
        },
        'sites-menu button#toggleexpanded': {
            'click': 'onMenuToggleExpandedClick'
        },
        'sites-toolbar button[action="host-list"]': {
            'click': 'onHostListButtonClick'
        },
        'sites-hostlist grid': {
            'boxready': 'onHostListGridBoxReady',
            'rowdblclick': 'onHostListGridRowDblClick',
            'removeclick': 'onHostListGridRemoveClick'
        },
        'sites-hostlist button[action="remember-host"]': {
            'click': 'onRememberHostClick'
        },
        'sites-toolbar textfield[name="Host"]': {
            'updatehost': 'onUpdateHostClick'
        },
        'sites-hostlist': {
            'focusleave': 'onHostListFocusLeave'
        }
    },

    // controller configuration
    stores: [
        'sites.Hosts'
    ],

    views: [
        'sites.Container',
        'sites.Toolbar',
        'sites.Menu',
        'sites.HostList'
    ],

    refs: {
        'appViewport': 'app-viewport',
        'sitesContainer': 'sites-container',
        'sitesMenu': 'sites-menu',
        'hostField': 'field[name=Host]',
        'hostList': {
            selector: 'sites-hostlist',
            xtype: 'sites-hostlist',
            autoCreate: true
        }
    },

    onLaunch: function() {
        var me = this;

        me.getHostField().setValue(EmergenceConsole.proxy.API.getHost());
    },

    // route handlers
    showSitesConsole: function() {
        var me = this;

        me.getAppViewport().getLayout().setActiveItem(me.getSiteContainer());
    },

    onMenuButtonClick: function(button) {
        var route = button.route;

        if (route) {
            this.redirectTo(route);
        }
    },

    onHostListButtonClick: function(button) {
        var me = this,
            hostList = me.getHostList();

        if (hostList.isVisible()) {
            hostList.close();
        } else {
            hostList.showBy(button, 'tl-bl');
        }
    },

    onHostListGridBoxReady: function(grid) {
        var store = grid.getStore();

        if (!store.isLoaded() && !store.isLoading()) {
            store.load();
        }
    },

    onHostListGridRowDblClick: function(grid, record) {
        location.search='?apiHost='+record.get('host');
    },

    onRememberHostClick: function() {
        var me = this,
            store = me.getHostList().down('grid').getStore(),
            host = me.getHostField().getValue();

        if (store.find('host', host) === -1) {
            store.add({
                host: me.getHostField().getValue()
            });
            store.save();
        }
    },

    onHostListGridRemoveClick: function(grid, record) {
        var store = grid.getStore();

        store.remove(record);
        store.save();
    },

    // close the host list window if anything other than the host list button is clicked
    onHostListFocusLeave: function(win, evt) {
        if (!Ext.ComponentQuery.is(evt.toComponent, 'button[action="host-list"]')) {
            win.close()
        }
    },

    onUpdateHostClick: function() {
        var me = this;

        location.search='?apiHost='+me.getHostField().getValue().replace(/^https?:\/\//i, '');
    },

    onMenuToggleExpandedClick: function(toggle) {
        var me = this,
            menu = me.getSitesMenu(),
            expanded = menu.getExpanded(),
            buttons = menu.query('button'),
            buttonsLength = buttons.length,
            button,
            i = 0;

        for (; i<buttonsLength; i++) {
            button = buttons[i];
            if (expanded) {
                button.setText('');
                toggle.setIconCls(toggle.iconClsCollapsed);
            } else {
                button.setText(button.initialConfig.text);
                toggle.setIconCls(toggle.iconClsExpanded);
            }
        }
        menu.setExpanded(!expanded);
    }
});
