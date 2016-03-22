/*jslint browser: true, undef: true, white: false, laxbreak: true *//*global Ext, EmergenceEditor*/
Ext.define('EmergenceEditor3.store.ActivityStream', {
    extend: 'Ext.data.Store'        
    ,model: 'EmergenceEditor3.model.ActivityEvent'
    ,proxy: {
        type: 'ajax'
        ,url: '/editor/activity'
        ,reader: {
            type: 'json'
            ,root: 'data'
        }
    }
});