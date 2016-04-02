/*jslint browser: true, undef: true *//*global Ext*/
Ext.define('EmergenceConsole.controller.Files', {
    extend: 'Ext.app.Controller',

    // entry points
    routes: {
        'sites/files': 'showFilesView'
    },

    // controller configuration
    stores: [
        'files.Sources'
    ],

    views: [
        'files.Container',
        'files.Sources',
        'files.Editor'
    ],

    refs: {
        'appViewport': 'app-viewport',
        'sitesContainer': 'sites-container',
        'sitesContent': 'sites-container > #content',

        'filesContainer': {
            selector: 'files-container',
            xtype: 'files-container',
            forceCreate: true
        }
    },

    // route handlers
    showFilesView: function() {
        var me = this;

        console.log(me.getSitesContent());
        console.log(me.getFilesContainer());

        me.getAppViewport().getLayout().setActiveItem(me.getSitesContainer());
        me.getSitesContent().setActiveItem(me.getFilesContainer());
    }
});
