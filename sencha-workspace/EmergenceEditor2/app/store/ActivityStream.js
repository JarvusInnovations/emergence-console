/*jslint browser: true, undef: true, white: false, laxbreak: true *//*global Ext, EmergenceEditor*/
Ext.define('EmergenceEditor2.store.ActivityStream', {
    extend: 'Ext.data.Store'        
    ,model: 'EmergenceEditor2.model.ActivityEvent'
    ,proxy: {
        type: 'ajax'
        ,url: '/editor/activity'
        ,reader: {
            type: 'json'
            ,root: 'data'
        }
    }
});
