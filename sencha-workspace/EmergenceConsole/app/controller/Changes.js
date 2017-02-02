/*jslint browser: true, undef: true *//*global Ext*/
Ext.define('EmergenceConsole.controller.Changes', {
    extend: 'Ext.app.Controller',

    // entry points
    routes: {
        'sites/changes': 'showChangesView'
    },

    control: {
        'changes-container': {
            'activate': 'onChangesContainerActivate'
        }
    },


    // controller configuration
    stores: [
        'changes.ActivityStream'
    ],

    views: [
        'changes.Container',
        'changes.Grid'
    ],

    refs: {
        'appViewport': 'app-viewport',
        'sitesContainer': 'sites-container',
        'sitesContent': 'sites-container > #content',
        'sitesTools': 'sites-toolbar container#tools',

        'changesContainer': {
            selector: 'changes-container',
            xtype: 'changes-container',
            forceCreate: true
        }
    },


    // route handlers
    showChangesView: function() {
        var me = this;

        me.getAppViewport().getLayout().setActiveItem(me.getSitesContainer());
        me.getSitesContent().setActiveItem(me.getChangesContainer());
        me.getSitesTools().setActiveItem(0);
    },

    // event handlers
    onChangesContainerActivate: function(cnt) {
        cnt.down('grid').getStore().load();
    }
});
