/*jslint browser: true, undef: true, white: false, laxbreak: true *//*global Ext,EmergenceEditor3*/
Ext.define('EmergenceEditor3.controller.Filesystem', {
	extend: 'Ext.app.Controller'
	,requires: [
	]
	
	
	,views: ['FilePanel', 'contextmenu.FileMenu', 'contextmenu.CollectionMenu', 'contextmenu.MultiNodeMenu']
	
	,stores: [
		'FileTree'
	]
	
	,refs: [{
		ref: 'filePanel'
		,selector: 'emergenceeditor-filepanel'
	},{
		ref: 'fileMenu'
		,selector: 'emergence-filemenu'
		,xtype: 'emergence-filemenu'
		,autoCreate: true
	},{
		ref: 'collectionMenu'
		,autoCreate: true
		,selector: 'emergence-collectionmenu'
		,xtype: 'emergence-collectionmenu'
	},{
		ref: 'multiNodeMenu'
		,autoCreate: true
		,selector: 'emergence-multinodemenu'
		,xtype: 'emergence-multinodemenu'
	}]
	
	
	// controller template methods
	,init: function() {
		this.control({
			'emergenceeditor-filepanel': {
				itemdblclick: this.onNodeDblClick
				,itemcontextmenu: this.onNodeContextMenu
			}
			/* FILE NODE CONTEXT MENU */
			,'emergence-filemenu > menuitem[action=properties]': {
				click: this.onPropertiesClick  
			}
			,'emergence-filemenu > menuitem[action=rename]': {
				click: this.onRenameClick  
			}
			,'emergence-filemenu > menuitem[action=open]': {
				click: this.onOpenClick	 
			}
			,'emergence-filemenu > menuitem[action=delete]': {
				click: this.onDeleteClick  
			}
			/* FOLDER NODE CONTEXT MENU */
			,'emergence-collectionmenu > menuitem[action=new-file]': {
				click: this.onNewFileClick	   
			}
			,'emergence-collectionmenu > menuitem[action=new-folder]': {
				click: this.onNewFolderClick	 
			}
			,'emergence-collectionmenu > menuitem[action=rename]': {
				click: this.onRenameClick	  
			}
			,'emergence-collectionmenu > menuitem[action=refresh]': {
				click: this.onRefreshClick	   
			}
			,'emergence-collectionmenu > menuitem[action=delete]': {
				click: this.onDeleteClick	  
			}
			/* MULTI NODE CONTEXT MENU */
			,'emergence-multinodemenu > menuitem[action=open]': {
				click: this.onMultiOpenClick  
			}
			,'emergence-multinodemenu > menuitem[action=delete]': {
				click: this.onMultiDeleteClick	
			
			}	 
		});
	}
	
	
	// controller methods
	,openFileByRecord: function(record) {
		var filePath = record.get('url')
			,davRoot = EmergenceEditor3.API.getDavRoot();

		// strip davRoot
		if(filePath.indexOf(davRoot) === 0) {
			filePath = filePath.substr(davRoot.length);
		}
		else {
			Ext.Logger.error('Tree file URL does not begin with davRoot: '+filePath);
		}
		
		this.application.selectFilePath(filePath);
    }
	
	
	// event handlers
	//    FILE TREE EVENT HANDLERS
	,onNodeDblClick: function(view, record, item, index, event, options) {
        if(record.get('class') == 'File')
        {
		    this.openFileByRecord(record); 
        }
	}
	
	,onNodeContextMenu: function(treePanel, record, item, index, event, options) {
		var selectionModel = this.getFilePanel().getSelectionModel()
			,selection = selectionModel.getSelection()
			,foundRecordInSelection = false
			,recordClass = record.get('class');
			
		event.stopEvent();
		this.currentRecord = record;
		
		Ext.each(selection,function(item) {
			if(item.internalId == record.internalId) {
				foundRecordInSelection = true;
			}
		},this);
		
		if(!foundRecordInSelection) {
			selectionModel.select(record);
		}
		
		if(recordClass == 'File' && selection.length == 1) {
			this.getFileMenu().showAt(event.getXY()); 
		}
		else if(recordClass == 'Collection' && selection.length == 1) {
			this.getCollectionMenu().showAt(event.getXY()); 
		}
		else if(selection.length > 1) {
			this.getMultiNodeMenu().showAt(event.getXY()); 
		}
	}
	
	//    FILE CONTEXT MENU EVENT HANDLERS
	,onPropertiesClick: function(menuItem, event, options) {
		//TODO need a way to get details about a file since the webdav feed is sparse
		
//		  var data = this.currentRecord.raw;
//		  
//		  var html = ""; 
//		  for (var key in data)
//		  {
//			  html += key + ": " + data[key] + "<br>\n";	 
//		  }
//		  
//		  Ext.create('Ext.window.Window', {
//			  title: data.Handle,
//			  height: 300,
//			  width: 375,
//			  layout: 'fit',
//			  html: html
//		  }).show();
	}
	
	,onOpenClick: function(menuItem, event, options) {
		this.openFileByRecord(this.currentRecord); 
	}
	
	//    FOLDER CONTEXT MENU EVENT HANDLERS
	,onNewFileClick: function(menuItem, event, options) {
		Ext.Msg.prompt('New File', 'Provide a filename:', function(button, value, options) {
			if(button == 'ok' && !Ext.isEmpty(value)) {
				var newFile = this.currentRecord.get('url') + value;
				
				EmergenceEditor3.API.createFileNode(newFile,function() {
					var treeStore = this.getFileTreeStore()
						,node = treeStore.getNodeById(this.currentRecord.internalId);
						
					treeStore.refreshNodeByRecord(this.currentRecord, function() { node.expand(); });
				},this);  
			}
		},this);
	}
	
	,onNewFolderClick: function(menuItem, event, options) {
		Ext.Msg.prompt('New Folder', 'Provide a folder name:', function(button, value, options) {
			if(button == 'ok' && !Ext.isEmpty(value)) {
				var newFolder = this.currentRecord.get('url') + value;
				
				EmergenceEditor3.API.createCollectionNode(newFolder,function() {
					this.getFileTreeStore().refreshNodeByRecord(this.currentRecord);	 
				},this);  
			}
		},this);
	}
	
	,onRefreshClick: function(menuItem, event, options) {
		this.getFileTreeStore().refreshNodeByRecord(this.currentRecord);
	}
	
	/* FOLDER & FILE CONTEXT MENU EVENT HANDLERS */
	,onRenameClick: function(menuItem, event, options) {
		Ext.Msg.prompt('Rename File', 'Provide a new name:', function(button, value, options) {
			if(button == 'ok' && !Ext.isEmpty(value)) {
				var currentPath = this.currentRecord.get('url').replace(/\/$/, "")
					,currentFileName = this.currentRecord.get('text')
					,newPath = currentPath.replace(currentFileName, value).replace(/\/$/, "");
				
				EmergenceEditor3.API.renameNode(currentPath, newPath, function() {
					this.getFileTreeStore().refreshNodeByRecord(this.currentRecord.parentNode);		
				},this);  
			}
		},this,false,this.currentRecord.raw.Handle);
	}
	
	,onDeleteClick: function(menuItem, event, options) {
		Ext.Msg.confirm('Delete File', "Are you sure you want to delete " + this.currentRecord.get('text') + "?", function(button, value, options) {
			if(button == 'yes') {
				EmergenceEditor3.API.deleteNode(this.currentRecord.get('url') ,function() {
					this.getFileTreeStore().refreshNodeByRecord(this.currentRecord.parentNode);		
				},this);
			}
		},this);
	}
	
	/* MULTI NODE CONTEXT MENU EVENT HANDLERS */
	,onMultiOpenClick: function(menuItem, event, options) {
		var selection = this.getFileTree().getSelectionModel().getSelection();
		Ext.each(selection, function(record) {
			if(record.get('class') == 'File') {
				this.openFileByRecord(record);
			}
			else if(record.get('class') == 'Collection') {
				this.getFileTree().expandPath(record.getPath());
			}
		}, this);
	}
	
	,onMultiDeleteClick: function(menuItem, event, options)
	{
		var selection = this.getFileTree().getSelectionModel().getSelection()
			,toRefresh = {};
		
		Ext.Msg.confirm('Delete Multiple Items', "Are you sure you want to delete these " + selection.length + " items?", function(button, value, options) {
			if(button == 'yes') {
				Ext.each(selection, function(record) {
					//TODO port over davclient
//					EmergenceEditor.store.DavClient.deleteNode(record.raw.FullPath,function() {
//						if(record.parentNode) {
//							if(!toRefresh[record.parentNode.raw.ID])
//							{
//								toRefresh[record.parentNode.raw.ID] = true;
//								this.getFileTreeStore().refreshNodeByRecord(record.parentNode); 
//							}
//						}
//					},this);
				}, this);
			}
		}, this);
	}
});