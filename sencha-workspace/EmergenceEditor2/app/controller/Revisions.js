/*jslint browser: true, undef: true, white: false, laxbreak: true *//*global Ext, EmergenceEditor2*/
Ext.define('EmergenceEditor2.controller.Revisions', {
    extend: 'Ext.app.Controller'
    
    ,views: ['Revisions','contextmenu.RevisionsMenu','TabPanel','Viewport']
    ,stores: ['Revisions']
    ,models: []
    ,refs: [{
        ref: 'revisionsGrid'
        ,autoCreate: true
        ,selector: 'file-revisions'
        ,xtype: 'file-revisions'
    },{
        ref: 'revisionsMenu'
        ,autoCreate: true
        ,selector: 'revisionsmenu'
        ,xtype: 'revisionsmenu'
    },{
        ref: 'diffWindow'
        ,autoCreate: true
        ,selector: 'SimpleCodeViewer'
        ,xtype: 'emergence-diff-viewer'   
    },{
        ref: 'tabPanel'
        ,selector: 'viewport > tabpanel'
    },{
        ref: 'aceEditor'
        ,selector: 'aceeditor'
    }]
    ,init: function() {
        // Start listening for events on views
        this.control({
            'file-revisions': {
                expand: this.onRevisionsExpand
                ,itemdblclick: this.openRevision
                ,itemcontextmenu: this.onRevisionContextMenu
            }
            ,'revisionsmenu > menuitem[action=open]': {
                click: this.onOpenClick  
            }
            ,'revisionsmenu > menuitem[action=properties]': {
                click: this.onPropertiesClick  
            }
            ,'revisionsmenu > menuitem[action=compare_latest]': {
                click: this.onCompareLatestClick  
            }
            ,'revisionsmenu > menuitem[action=compare_next]': {
                click: this.onCompareNextClick  
            }
            ,'revisionsmenu > menuitem[action=compare_previous]': {
                click: this.onComparePreviousClick  
            }
            ,'viewport > tabpanel': {
                tabchange: this.onTabChange   
            }
        });
        
        this.application.on('afterloadfile', this.onAfterLoadFile, this);
    }
    ,onTabChange: function(tabPanel, newCard, oldCard, eOpts)
    {
        if(newCard.isXType('aceeditor')) {
            var revisionID = newCard.getRevisionID();
            
            if(revisionID) {
                this.loadRevisionByID(revisionID);
            }
        }
    }
    ,openRevisionByRecord: function(record)
    {
        //TODO Move develop out of path and have fileOpen handle appending the site collection - KBC
        Ext.util.History.add(record.get('FullPath') + '@' + record.get('ID'), true);
    }
    ,openRevision: function(view, record, itemindex, event, options)
    {
        this.openRevisionByRecord(record);
    }
    ,onRevisionContextMenu: function(revisionsGrid, record, item, index, event, options)
    {
        event.stopEvent();
        
        this.currentRecord = record;
        this.currentIndex = index;

        this.getRevisionsMenu().showAt(event.getXY());  
    }
    ,onPropertiesClick: function(menuItem, event, options)
    {
        var data = this.currentRecord.raw;
        
        var html = ""; 
        for (var key in data)
        {
            html += key + ": " + data[key] + "<br>\n";     
        }
        
        Ext.create('Ext.window.Window', {
            title: data.Handle,
            height: 300,
            width: 375,
            layout: 'fit',
            html: html
        }).show();
    }
    ,onOpenClick: function(menuItem, event, options)
    {
        this.openRevisionByRecord(this.currentRecord); 
    }
    ,onCompareLatestClick: function(menuItem, event, options)
    {
        this.openDiff(this.currentRecord,this.currentRecord.store.data.get(0));
    }
    ,onCompareNextClick: function(menuItem, event, options)
    {  
        this.openDiff(this.currentRecord,this.currentRecord.store.data.get(this.currentIndex-1));
    }
    ,onComparePreviousClick: function(menuItem, event, options)
    {
        this.openDiff(this.currentRecord.store.data.get(this.currentIndex+1),this.currentRecord);   
    }
    ,onRevisionsExpand: function(revisionsPanel) {
        var editor = this.getAceEditor()
            ,revisionID = editor.getRevisionID();
        
        if(revisionID != revisionsPanel.getRevisionID()) {
            this.loadRevisionByID(revisionID);
        }
    }
    ,openDiff: function(sideA, sideB)
    {
        Ext.util.History.add('diff:[' + sideA.get('ID') + ',' + sideB.get('ID') + ']/'+sideA.get('FullPath'), true);    
    }
    ,loadRevisionByID: function(revisionID) {
        var revisionsPanel = this.getRevisionsGrid();
        
        if(!revisionsPanel.getCollapsed())
        {
            revisionsPanel.store.load({
                params: {ID: revisionID}
            });
        }
    }
    ,onAfterLoadFile: function(editor, revisionID, response) {   
        this.loadRevisionByID(revisionID);
    }
});
