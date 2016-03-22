/*jslint browser: true, undef: true, white: false, laxbreak: true *//*global Ext, EmergenceEditor2*/
Ext.define('EmergenceEditor2.store.Revisions', {
    extend: 'Ext.data.Store'
    ,model: 'EmergenceEditor2.model.Revision'
    
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
