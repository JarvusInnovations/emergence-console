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
        'console' : 'sites-container',
        'host' : '[name=Host]'
    },
    
    onLaunch: function() {
        var me = this;
        me.getHost().setValue(EmergenceConsole.proxy.API.getHost());
    },
     
    onSiteSelected: function() {
        EmergenceConsole.proxy.API.setHost(this.getSites().value);
        this.redirectTo('sites/files');
    },

    // route handlers
    showSitesConsole: function() {
        var me = this;

        me.getAppViewport().getLayout().setActiveItem(me.getConsole());
    },

    onMenuButtonClick: function(button) {
        var route = button.route;

        if (route) {
            this.redirectTo(route);
        }
    },
    
    onUpdateHostClick: function(button) {
        location.search='?apiHost='+this.getHost();
    }
});
