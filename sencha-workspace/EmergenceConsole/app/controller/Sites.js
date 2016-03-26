/*jslint browser: true, undef: true *//*global Ext*/
Ext.define('EmergenceConsole.controller.Sites', {
    extend: 'Ext.app.Controller',

    // entry points
    routes: {
        'sites': 'showSitesConsole'
    },

    // controller configuration
    views: [
        'sites.Container',
        'sites.Toolbar'
    ],

    refs: {
        'appViewport' : 'app-viewport',
        'console' : 'sites-container'
    },

    // route handlers
    showSitesConsole: function() {
        var me = this;

        me.getAppViewport().getLayout().setActiveItem(me.getConsole());
    }
});
