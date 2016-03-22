/*jslint browser: true, undef: true, white: false, laxbreak: true *//*global Ext, EmergenceEditor3*/
Ext.define('EmergenceEditor3.store.FileType', {
    extend: 'Ext.data.Store'       
    ,model: 'EmergenceEditor3.model.FileType'
    ,autoLoad: true
    ,storeId: 'FileType'
    ,proxy: {
        type: 'ajax'
        ,url: '/editor/getFileTypes'
        ,reader: {
            type: 'json'
            ,root: 'data'
        }
    }
});