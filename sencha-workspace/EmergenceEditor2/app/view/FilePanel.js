/*jslint browser: true ,undef: true ,white: false ,laxbreak: true *//*global Ext*/
Ext.define('EmergenceEditor2.view.FilePanel', {
    extend: 'Ext.tree.Panel'
    ,xtype: 'emergenceeditor-filepanel'
    ,requires: [
        'Ext.tree.plugin.TreeViewDragDrop'
    ]
    
    ,title: 'Filesystem'
    ,store: 'FileTree'  
    ,useArrows: true
    ,rootVisible: false
    ,autoScroll: true
//  ,scrollDelta: 10
    ,multiSelect: true
    ,viewConfig: {
        loadMask: false
        ,plugins: {
            ptype: 'treeviewdragdrop'
            ,pluginId : 'ddplugin'
            ,appendOnly: true
            ,dragText : '{0} selected item{1}'
            ,containerScroll: true
        }
    }
});
