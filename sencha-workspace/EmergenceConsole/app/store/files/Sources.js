/*jslint browser: true, undef: true *//*global Ext*/
Ext.define('EmergenceConsole.store.files.Sources', {
    extend: 'Ext.data.TreeStore',

    model: 'EmergenceConsole.model.file.File',

    folderSort: true,
    sortOnLoad: true,
    sorters: [{
        property: 'Handle',
        direction: 'ASC'
    }],

    defaultRootId: 'children',

    root: {
        text: 'children',
        id: 'children',
        expanded: true
    },

    rootVisible: false



});
