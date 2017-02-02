/*jslint browser: true, undef: true *//*global Ext*/
Ext.define('EmergenceConsole.controller.Sites', {
    extend: 'Ext.app.Controller',

    // entry points
    routes: {
        'sites': 'showSitesConsole'
    },

    control: {
        'sites-menu': {
            'click': 'onMenuClick'
        },
        'sites-menu button': {
            'click': 'onMenuButtonClick'
        },
        'sites-menu button#toggleexpanded': {
            'click': 'onMenuToggleExpandedClick'
        },
        'sites-toolbar button[name="SetHost"]': {
            'click': 'onUpdateHostClick'
        }
    },

    // controller configuration
    views: [
        'sites.Container',
        'sites.Toolbar',
        'sites.Menu'
    ],

    refs: {
        'appViewport' : 'app-viewport',
        'sitesContainer' : 'sites-container',
        'sitesMenu' : 'sites-menu',
        'hostField' : 'field[name=Host]'
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

    onMenuClick: function(menu) {
        console.log('menu-clicked');
    },

    onMenuButtonClick: function(button) {
        var route = button.route;

        if (route) {
            this.redirectTo(route);
        }
    },

    onUpdateHostClick: function(button) {
        var me = this;
        location.search='?apiHost='+me.getHostField().getValue();
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
