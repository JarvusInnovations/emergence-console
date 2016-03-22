/*jslint browser: true, undef: true, white: false, laxbreak: true *//*global Ext, EmergenceEditor3*/
Ext.define('EmergenceEditor3.store.SiteSearch', {
    extend: 'Ext.data.Store'       
    ,model: 'EmergenceEditor3.model.SearchResult'
    ,proxy: {
        type: 'ajax'
        ,url: '/editor/search'
        ,reader: {
            type: 'json'
            ,root: 'data'
        }
    }
});