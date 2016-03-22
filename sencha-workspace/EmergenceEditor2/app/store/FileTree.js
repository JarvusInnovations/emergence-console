/*jslint browser: true, undef: true, white: false, laxbreak: true *//*global Ext*/
Ext.define('EmergenceEditor2.store.FileTree', {
    extend: 'Ext.data.TreeStore'
    ,requires: [
        'EmergenceEditor2.proxy.DavBrowser'
    ]
    
    ,model: 'EmergenceEditor2.model.Node'
    ,folderSort: true
    ,sortOnLoad: true
    ,sorters: [{
        property: 'Handle'
        ,direction: 'ASC'
    }]
    ,root: {
        url: '/develop/'
        ,expanded: true
    }
    ,proxy: {
        type: 'davbrowser'
    }
    
    // skip TreeStore's mangling of reader config
    ,setProxy: function() {
        return Ext.data.AbstractStore.prototype.setProxy.apply(this, arguments);
    }
    ,refreshNodeByRecord: function(record, callback)
    {
        this.load({
            node: record
            ,callback: callback
        });     
    }
});
