/*jslint browser: true, undef: true *//*global Ext*/
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

    onMenuButtonClick: function(button) {
        var route = button.route;

        if (route) {
            this.redirectTo(route);
        }
    },
    
    onUpdateHostClick: function(button) {
        var me = this;
        location.search='?apiHost='+me.getHostField().getValue();
    }
});
