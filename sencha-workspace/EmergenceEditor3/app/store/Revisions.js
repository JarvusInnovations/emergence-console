/*jslint browser: true, undef: true, white: false, laxbreak: true *//*global Ext, EmergenceEditor3*/
Ext.define('EmergenceEditor3.store.Revisions', {
    extend: 'Ext.data.Store'
    ,model: 'EmergenceEditor3.model.Revision'
    
    ,sorters: [{
        property: 'Timestamp'
        ,direction: 'DESC'
    }]
    
    ,proxy: {
        type: 'ajax'
        ,url: '/editor/getRevisions/'
        ,reader: {
            type: 'json'
            ,root: 'revisions'
        }
    }
});