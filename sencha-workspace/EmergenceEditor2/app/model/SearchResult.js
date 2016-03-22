/*jslint browser: true, undef: true, white: false, laxbreak: true *//*global Ext, EmergenceEditor2*/
Ext.define('EmergenceEditor2.model.SearchResult', {
    extend: 'Ext.data.Model'

    ,fields: [{
        name: 'File'
    },{
        name: 'line'
        ,type: 'integer'
    },{
        name: 'result'
    }]
});
