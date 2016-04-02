/*jslint browser: true, undef: true *//*global Ext*/
Ext.define('EmergenceConsole.store.changes.ActivityStream', {
    extend: 'Ext.data.Store',
    model: 'EmergenceConsole.model.changes.ActivityEvent',

    pageSize: 25,
    autoLoad: {start: 0, limit: 25}
});
