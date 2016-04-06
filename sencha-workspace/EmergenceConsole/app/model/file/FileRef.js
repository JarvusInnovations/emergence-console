/*jslint browser: true, undef: true *//*global Ext*/
Ext.define('EmergenceConsole.model.file.FileRef', {
    extend: 'Ext.data.Model',

    fields: [{
        name: 'fileName',
        type: 'string'
    },{
        name: 'filePath',
        type: 'string'
    }]
});
