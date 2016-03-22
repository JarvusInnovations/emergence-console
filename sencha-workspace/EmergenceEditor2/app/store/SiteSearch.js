/*jslint browser: true, undef: true, white: false, laxbreak: true *//*global Ext, EmergenceEditor2*/
Ext.define('EmergenceEditor2.store.SiteSearch', {
    extend: 'Ext.data.Store'       
    ,model: 'EmergenceEditor2.model.SearchResult'
    ,proxy: {
        type: 'ajax'
        ,url: '/editor/search'
        ,reader: {
            type: 'json'
            ,root: 'data'
        }
    }
});
