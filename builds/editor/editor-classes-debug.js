/*
Copyright(c) 2011 Jarv.us Innovations
*/
Ext.define('Emergence.Editor.view.Viewport', {
	extend: 'Ext.container.Viewport'	
	,requires: [
		'Ext.layout.container.Border'
	]
	
	,layout: 'border'

	,initComponent: function() {
		//console.info('Emergence.Editor.view.Viewport.initComponent()');
	
	
		this.items = [{
			xtype: 'emergence-menubar'
			,region: 'north'
			//,html: 'Emergence Development Environment'
		},{
			xtype: 'emergence-filetree'
			,region: 'west'
			,stateId: 'viewport-files'
			,title: 'Files'
			,width: 300
			,collapsible: true
			,split: true
			,html: 'files here'
		},{
            xtype: 'emergence-editortabpanel'
			,region: 'center'
		},{
//			xtype: 'tabpanel'
            title: 'Revision History'
            ,xtype: 'emergence-file-revisions'
            ,icon: '/img/icons/fugue/edit-diff.png'
			,region: 'east'
			,stateId: 'viewport-details'
			,width: 275
			,collapsible: true
            ,collapsed: true
			,split: true
//            ,preventHeader: true
//            ,items: [
//                {
//                    title: 'Revisions'
//                    ,xtype: 'emergence-file-revisions'
//                    ,icon: '/img/icons/fugue/edit-diff.png'
//                }
//                /*,{
//                    title: 'Code Navigator'   
//                }*/
//            ]
		},{
			xtype: 'emergence-transfersgrid'
			,region: 'south'
			,stateful: true
			,stateId: 'viewport-transfers'
			,height: 200
			,collapsible: true
			,split: true
            ,icon: '/img/icons/fugue/system-monitor-network.png'
		}];
        
		this.callParent();
		
	}
	
});
Ext.define('Emergence.Editor.store.DavClient', {
	extend: 'Ext.data.Connection'
	,singleton: true
	,mixins: {
        observable: 'Ext.util.Observable'
    }
	,disableCaching: false
	,JSONurl: '/develop/json/' /* this is only for getting collection directory listings */
	,url: '/develop/' /* use this for 'most' calls */
	,failure: function () { console.log('failure'); }
    ,getRevision: function(path, id, callback, scope)
    {
        return this.request({
            url: this.url + path
            ,headers: {
                'X-Revision-ID': id   
            }
            ,method: 'GET'
            ,success: callback
            ,scope: scope
            ,task: 'get-file'
        });
    }
	,getFile: function(path, callback, scope)
    {
		return this.request({
			url: this.url + path
			,method: 'GET'
			,success: callback
			,scope: scope
            ,task: 'get-file'
		});
	}
    ,getCollection: function(path, callback, scope)
    {
        return this.request({
            url: this.JSONurl + path
            ,method: 'PROPFIND'
            ,success: callback
            ,scope: scope
        });
    }
	,writeFile: function(path, data, callback, scope)
    {
		return this.request({
			url: this.url + path
			,method: 'PUT'
			,params: data
			,success: callback
			,scope: scope
            ,task: 'save-file'
		});
	}
    ,createCollectionNode: function(path, callback, scope)
    {
        return this.request({
            url: this.url + path
            ,method: 'MKCOL'
            ,params: ''
            ,success: callback
            ,scope: scope
            ,task: 'create-folder'
        });       
    }
    ,createFileNode: function(path, callback, scope)
    {
        return this.writeFile(path, '', callback, scope);
    }
	,renameNode: function(path, newPath, callback, scope)
    {
        return this.request({
            url: this.url + path
            ,method: 'MOVE'
            ,headers: {
                Destination: this.url + newPath
            }
            ,success: callback
            ,scope: scope   
        });   
    }
    ,deleteNode: function(path,callback,scope) {
        return this.request({
            url: this.url + path
            ,method: 'DELETE'
            ,success: callback
            ,scope: scope 
            ,task: 'delete-node'  
        });    
    }
    ,putDOMFile: function(path, file, completeCallback, progressCallback, scope) {
        
        var xhr = new XMLHttpRequest(); 
        
        xhr.uniqueID = Ext.id(null, 'xhr');
        
        var url = this.url + path;
        
        this.fireEvent('beforefileupload', url, file, xhr);
    	
        var progress = function(args, event) {
            
            var percentage = Math.round( (event.loaded / event.total) * 100);
            
            this.fireEvent('fileuploadprogress', percentage, event, url, file, xhr);
            
            progressCallback.call(scope, percentage, event);
        }
          
    	xhr.upload.addEventListener('progress', progress.bind(this,arguments));
    	
    	xhr.open('PUT',url);
    	
    	xhr.send(file);
    	        
        var readStateChange = function() {
            if(xhr.readyState != 4)
            {
                completeCallback.call(scope);
                this.fireEvent('afterfileupload', url, file, xhr);
            }
        }
                     
    	xhr.onreadystatechange = readStateChange.bind(this, arguments);
    }
});

Ext.define('Emergence.Editor.model.File', {
	extend: 'Ext.data.Model'

	,idProperty: 'href'
    ,fields: [{
    	name: 'href'
    },{
    	name: 'modified'
    	,mapping: 'getlastmodified'	
    },{
    	name: 'resourcetype'
    },{
    	name: 'status'
    },{
    	name: 'FullPath'
    	,type: 'string'
    },{
        // override the special "text" field to programmatically populate it from a different place
        name: 'text'
        ,type: 'string'
        ,convert: function(v,r) {
            if(r.raw)
                return r.raw.Handle;
            else
                return '[[Unknown Node]]';
        }
    },{
        name: 'leaf'
        ,type: 'boolean'
        ,convert: function(v,r) {
            if(r.raw)
                return (r.raw.Class=='SiteFile'?true:false);
            else 
                return false;
        }
    }]
    /*
     *   Default implementation tries to run destroy through the store just cause I asked for a refresh
     *   This work around is as awesome as it is since it cuts down the call stack considerably.    
    */
    ,destroy: function() {
        this.remove(true);   
    }
});
Ext.define('Emergence.Editor.view.contextmenu.CollectionMenu', {
    extend: 'Ext.menu.Menu'
    ,alias: 'widget.emergence-collectionmenu'
    
    ,stateful: false
	,width: 100
	,items: [
        {
		    text: 'New File'
            ,action: 'new-file'
            ,icon: '/img/icons/fugue/blue-document.png' 
	    },{
		    text: 'New Folder'
            ,action: 'new-folder'
            ,icon: '/img/icons/fugue/blue-folder-horizontal-open.png'
	    },{
		    text: 'Rename'
            ,action: 'rename'
            ,icon: '/img/icons/fugue/blue-folder-rename.png' 
	    },{
		    text: 'Refresh'
            ,action: 'refresh'
            ,icon: '/img/icons/fugue/arrow-circle-135.png' 
	    },{
		    text: 'Delete'
            ,action: 'delete'
            ,icon: '/img/icons/fugue/cross.png'
	    }
    ]
});
Ext.define('Emergence.Editor.view.contextmenu.FileMenu', {
    extend: 'Ext.menu.Menu'
    ,alias: 'widget.emergence-filemenu'
	
    ,stateful: false
    ,width: 130
	,items: [
		{
		    text: 'Open'
            ,action: 'open'
            ,icon: '/img/icons/fugue/blue-folder-horizontal-open.png'
	    }
        ,{
            xtype: 'menuseparator'
        }
		,{
		    text: 'Compare with Open Tab'
            ,action: 'compare_with_active_tab'
            //,icon: ''
	    }
        ,{
            xtype: 'menuseparator'
        }        
        ,{
		    text: 'Properties'
            ,action: 'properties'
            ,icon: '/img/icons/fugue/property-blue.png'
	    },{
		    text: 'Rename'
            ,action: 'rename'
            ,icon: '/img/icons/fugue/blue-document-rename.png'  
	    },{
		    text: 'Delete'
            ,action: 'delete'
            ,icon: '/img/icons/fugue/cross.png'
	    }
    ]
});
Ext.define('Emergence.Editor.view.contextmenu.RevisionsMenu', {
    extend: 'Ext.menu.Menu'
    ,alias: 'widget.emergence-revisionsmenu'
    ,width: 150
	,items: [
        {
		    text: 'Open'
            ,action: 'open'
            ,icon: '/img/icons/fugue/blue-folder-horizontal-open.png'
	    }
	    ,{
		    text: 'Properties'
            ,action: 'properties'
            ,icon: '/img/icons/fugue/property-blue.png'
	    }
	    ,{
		    text: 'Compare Latest'
            ,action: 'compare_latest'
            //,icon: ''
	    }
		,{
		    text: 'Compare Next'
            ,action: 'compare_next'
            //,icon: ''
	    }
	   	,{
		    text: 'Compare Previous'
            ,action: 'compare_previous'
            //,icon: ''
	    }
    ]	
});
Ext.define('Emergence.Editor.view.editor.ACE', {
	extend: 'Ext.Component'
	,alias: 'widget.aceeditor'
	,initComponent: function() {
		this.itemId = this.itemId;
        
        this.isRevision = false;
        
        if(this.revisionID)
        {
            this.isRevision = true;
            this.itemId = 'revision:[' + this.revisionID + ']/'+this.path;
        }
        else
        {
            this.itemId = '/' + this.path;   
            
        }
        
        this.tabConfig = {icon: this.getIcon()};
		
		this.callParent(arguments);
	}

	,afterRender: function() {
		this.callParent(arguments);
		
		if(Emergence.Editor.app.aceReady)
			Ext.defer(this.initEditor, 10, this);
		else
			Emergence.Editor.app.on('aceReady', this.initEditor, this, {single: true, delay: 10});

	}
	,initEditor: function() {
        
		// create ACE editor instance
		this.aceEditor = ace.edit(this.el.down('div').id);
		
        this.onResize();
        
		// configure editor
		this.aceEditor.setShowPrintMargin(false);
		
		if(this.aceTheme)
			this.aceEditor.setTheme(this.aceTheme); 
			
		// listen for changes to mark dirty
		this.aceEditor.getSession().on('change', Ext.bind(this.onEditorChange, this));
        
        // listen for undos to validate dirty state
        Ext.Function.interceptAfter(this.aceEditor.getSession().getUndoManager(), 'undo', Ext.bind(this.onEditorUndo, this));
		
        // disable built in find dialog
        this.aceEditor.commands.removeCommand('find');
        
    /*
        var Split = require("ace/split").Split;
        var split = new Split(this.aceEditor.container, this.aceTheme, 1);
        split.on("focus", function(editor) {
            this.aceEditor = editor;
        });
        this.split = split;
    */
        		
		// load file if one was provided via path config
		if(this.path)
			this.loadFile();
		
        //this.setSplit('beside');	
			
		// relay resize events to ace
		this.on('resize', this.onResize, this);
	}
    ,setSplit: function(value) {
        var sp = this.split;
        if (value == "none") {
            if (sp.getSplits() == 2) {
                secondSession = sp.getEditor(1).session;
            }
            sp.setSplits(1);
        } else {
            var newEditor = (sp.getSplits() == 1);
            if (value == "below") {
                sp.setOriantation(sp.BELOW);
            } else {
                sp.setOriantation(sp.BESIDE);
            }
            sp.setSplits(2);

            if (newEditor) {
                var session = this.secondSession || sp.getEditor(0).session;
                var newSession = sp.setSession(session, 1);
                newSession.name = session.name;
            }
        }      
    }
	,onResize: function() {
        this.aceEditor.container.style.width = this.el.dom.style.width;
        this.aceEditor.container.style.height = this.el.dom.style.height;
        this.aceEditor.resize();
    }
	,onEditorChange: function() {
	
		if(this.loadedValue && !this.fileDirty)
		{
			this.fileDirty = true;
			this.tab.setText(this.tab.text+'*');
		}
	}
    
    ,onEditorUndo: function() {
        if(this.fileDirty && this.loadedValue == this.getValue())
        {
            this.fileDirty = false;
            this.tab.setText(this.tab.text.substr(0, this.tab.text.length-1));
        }
    }


	,loadFile: function(path) {
	
		if(path)
			this.path = path;
            
        this.setLoading({msg: 'Opening /' + this.path}); // enable loading mask
	   
       //console.log(this.isRevision);
       
        if(this.isRevision)
            Emergence.Editor.store.DavClient.getRevision(this.path, this.revisionID, this.afterLoadFile, this);
        else 
		    Emergence.Editor.store.DavClient.getFile(this.path, this.afterLoadFile, this);
	}
	,afterLoadFile: function(response) {

        this.ID = response.getResponseHeader('X-VFS-ID');  
        
        // load revisions
        var revisionsPanel = Emergence.Editor.app.viewport.down('emergence-file-revisions');
        if(revisionsPanel.isVisible(true))
        {
            revisionsPanel.store.load({params: {ID:this.ID}});
        }
        
        this.contentType = response.getResponseHeader('Content-Type');

        
        var mode = this.getFileMode(this.contentType);
        
        this.tab.setIcon(this.getIcon(this.contentType)); 
        
        if(mode)
             this.aceEditor.getSession().setMode(new (require("ace/mode/" + mode).Mode));
             
        this.setValue(response.responseText);
        
        this.setLoading(false); // clear loading  mask
            
    }
	,saveFile: function() {
        this.tab.setIcon('/img/loaders/spinner.gif');
        
        var fileData = this.getValue();

        Emergence.Editor.store.DavClient.writeFile(this.path, fileData, this.afterSaveFile, this);
	}
    ,afterSaveFile: function(response) {
        if(this.fileDirty)
        {
            this.fileDirty = false;
            this.tab.setText(this.tab.text.substr(0, this.tab.text.length-1));
        }
        
        this.loadedValue = response.request.options.params;
        
        this.tab.setIcon(this.getIcon(this.contentType)); 
    } 
	,getValue: function() {
		return this.aceEditor.getSession().getValue();
	}
	
	,setValue: function(value) {
		this.aceEditor.getSession().setValue(value);
        this.loadedValue = value; // store original text for dirty tracking
        return true;
	}
	
	
	,getFileMode: function(mimeType) {
		switch(mimeType)
		{
			case 'application/javascript':
				return 'javascript';
				
			case 'application/php':
				return 'php';
				
			case 'text/html':
			case 'text/x-c++':
			case 'text/plain':
				return 'html';
			
			case 'text/css':
				return 'css';
				
			default:
				return false;
		}	
	}
    ,getIcon: function(mimeType)
    {
        switch(mimeType)
        {
            case 'application/javascript':
                return '/img/icons/fugue/blue-document-text.png';
                
            case 'application/php':
                return '/img/icons/fugue/blue-document-php.png';
                
            case 'text/html':
            case 'text/x-c++':
            case 'text/plain':
                return '/img/icons/fugue/blue-document-text.png';
            
            case 'text/css':
                return '/img/icons/fugue/blue-document-text.png';
                
            default:
                return '/img/icons/fugue/blue-document.png';
        }
    }
	
});
Ext.define('Emergence.Editor.store.Revisions', {
    extend: 'Ext.data.Store'
    ,alias: 'store.revisions'
    ,storeId:'revisions'
    //,autoLoad: true
    ,fields:[
        {name:  'ID', type: 'integer'}
        ,'Class'
        ,'Handle'
        ,'Type'
        ,'MIMEType'
        ,{name:  'Size', type: 'integer'}
        ,'SHA1'
        ,'Status'
        ,{name:  'Timestamp', type: 'date', dateFormat: 'timestamp'}
        ,'Author'
        ,{name:  'AuthorID', type: 'integer'}
        ,{name:  'AncestorID', type: 'integer'}
        ,{name:  'CollectionID', type: 'integer'}
        ,'FullPath'
    ]
    
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
Ext.define('Emergence.Editor.model.ActivityEvent', {
    extend: 'Ext.data.Model'

	,idProperty: 'href'
    ,fields: [{
    	name: 'EventType'
        ,type: 'string'
    },{
    	name: 'Handle'
        ,type: 'string'
    },{
        name: 'CollectionPath'
        ,type: 'string'
    },{
        name: 'FirstTimestamp'
    	,type: 'date'
        ,dateFormat: 'timestamp'
        ,useNull: true
    },{
        name: 'Timestamp'
    	,type: 'date'
        ,dateFormat: 'timestamp'
    },{
        name: 'RevisionID'
        ,type: 'integer'
    },{
        name: 'FirstRevisionID'
        ,type: 'integer'
    },{
        name: 'FirstAncestorID'
        ,type: 'integer'
        ,useNull: true
    },{
        name: 'revisions'
        ,useNull: true
    },{
        name: 'revisionsCount'
        ,convert: function(v, r) {
        	var revisions = r.get('revisions');
            return revisions ? revisions.length : null;
        }
        ,useNull: true
    },{
    	name: 'Author'
    },{
    	name: 'Collection'
    }]
});
Ext.define('Emergence.Editor.view.Activity', {
	extend: 'Ext.panel.Panel'
	,alias: 'widget.emergence-activity'
	,title: 'Activity'
	,layout: 'fit'
	,initComponent: function() {
		
		this.dockedItems = [{
			xtype: 'toolbar'
			,dock: 'bottom'
			,items: [{
				xtype: 'button'
				,text: 'Refresh Activity'
				,action: 'refresh'
				,iconCls: 'refresh'
			}]
		}];
		
		this.items = [{
			xtype: 'dataview'
			,tpl: [
				'<tpl for=".">'
					,'<p>'
						,'<tpl if="FirstTimestamp && FirstTimestamp.getTime() != Timestamp.getTime()">'
							,'{FirstTimestamp:date("M j, g:i a")}&ndash;{Timestamp:date("g:i a")}'
						,'</tpl>'
						,'<tpl if="!FirstTimestamp || FirstTimestamp.getTime() == Timestamp.getTime()">'
							,'{Timestamp:date("M j, g:i a")}'
						,'</tpl>'
						
						
						,' <img src="/thumbnail/person/{Author.ID}/15x15xFFFFFF" width="15" height="15"> {Author.Username}'
						,'<tpl if="EventType == \'save\'">'
							 ,'<tpl if="revisionsCount == 1 && !revisions[0].AncestorID">'
								 ,' created'
							 ,'</tpl>'
							 ,'<tpl if="revisionsCount &gt; 1 && !revisions[0].AncestorID">'
								 ,' created & edited'
							 ,'</tpl>'
							 ,'<tpl if="revisions[0].AncestorID">'
								 ,' edited'
							 ,'</tpl>'
						,'</tpl>'
						,'<tpl if="EventType == \'delete\'">'
							,' deleted'
						,'</tpl>'
						,' <tpl if="Collection.ParentID">&hellip;</tpl>/{Collection.Handle}/<a href="#/{CollectionPath}/{Handle}">{Handle}</a>'
						,' <tpl if="revisionsCount &gt; 1">{revisionsCount} times</tpl>'
                        ,' <tpl if="FirstAncestorID && RevisionID">(<a href="#diff:[{FirstAncestorID},{RevisionID}]/{CollectionPath}/{Handle}">compare</a>)</tpl>'
					,'</p>'
				,'</tpl>'
			]
			,itemSelector: 'p'
			,emptyText: 'No activity'
			,store: 'ActivityStream'
			,autoScroll: true
			,padding: 10
		}];
		
		
		this.callParent(arguments);
	}
	
});
Ext.define('Emergence.Editor.store.ActivityStream', {
    extend: 'Ext.data.Store'
    ,alias: 'store.activitystream'
    //,autoLoad: true
    ,model: 'Emergence.Editor.model.ActivityEvent'
    ,proxy: {
        type: 'ajax'
        ,url: '/editor/activity'
        ,reader: {
            type: 'json'
            ,root: 'data'
        }
    }
});
Ext.define('Emergence.Editor.proxy.Develop', {
	extend: 'Ext.data.proxy.Ajax'
	,alias: 'proxy.develop'
	,requires: ['Ext.data.Request']
	
    ,url: '/develop/json/'
    ,noCache: false
    
    ,buildRequest: function(operation) {
    
    	var url = this.url;
    	
		if(typeof operation.node != "undefined" && operation.node.raw)
		{
			url = '/develop/json/' + operation.node.raw.FullPath;
		}
		else if(operation.records && operation.records[0].raw)
		{
			url = '/develop/json/' + operation.records[0].raw.FullPath;
		}
    	
		return Ext.create('Ext.data.Request', {
			action: operation.action//'Downloading file'//
			,records : operation.records
			,operation: operation
			,url: url
            ,task: 'directory-listing'
		});
	}



	,doRequest: function(operation, callback, scope) {
		var writer  = this.getWriter()
			,request = this.buildRequest(operation, callback, scope);
	
		Ext.apply(request, {
			headers       : this.headers,
			timeout       : this.timeout,
			scope         : this,
			callback      : this.createRequestCallback(request, operation, callback, scope),
			method        : this.getMethod(request),
			disableCaching: false // explicitly set it to false, ServerProxy handles caching
		});
	
		Emergence.Editor.store.DavClient.request(request);
	
		return request;
	}
});
Ext.define('Emergence.Editor.controller.Activity', {
    extend: 'Ext.app.Controller'
    ,views: ['Activity']
    ,stores: ['ActivityStream']
    ,models: ['ActivityEvent']
    ,refs: [{
        ref: 'activityStream'
        ,selector: 'emergence-activity dataview'
    }]
    ,onLaunch: function() {
        //console.info('Emergence.Editor.controller.Activity.onLaunch()');
        if(this.getActivityStream().isVisible())
        {
            this.loadActivity();
        }
        else
        {
           this.getActivityStream().on('activate', this.loadActivity, this, {single: true});
        }
    }
    ,init: function() {
        //console.info('Emergence.Editor.controller.Activity.init()');
        
        // Start listening for events on views
        this.control({
            'emergence-activity button[action=refresh]': {
                click: this.loadActivity
            }
        });
        
    }
    
    
    ,loadActivity: function() {
        this.getActivityStream().getStore().load();
    }
});
Ext.define('Emergence.Editor.view.SiteTools', { 
    extend: 'Ext.window.Window' 
    ,title: 'Site Tools'
    ,alias: 'widget.emergence-site-tools'
    ,height: 200
    ,width: 400
    ,layout: 'fit'
    ,icon: '/img/icons/fugue/gear.png'
    ,html: '<iframe src="/admin/" style="width:100%;height:100%"></iframe>'    
});
/* @Author Henry Paradiz <henry@jarv.us>	
 * 
 *	SimpleCodeViewer
 *
 *	Ext4 reconstruction of Ext 3.2.1's Ext.ux.CodeViewer published online at <http://www.sencha.com/files/blog/old/blog/wp-content/uploads/js-diff-blog/codeViewer.js>
 *
 */

Ext.define('Emergence.Editor.view.SimpleCodeViewer', {
    extend: 'Ext.panel.Panel'
	,alias: 'widget.emergence-diff-viewer'
	,layout: {
		type: 'hbox'
		,align: 'stretch'
	} 
    ,listeners: {
        afterrender: {
            single: true
            ,delay: 10
            ,fn: function(tab, eopts){
                var codeViewerA = tab.items.get(0).items.get(0),
                codeViewerB = tab.items.get(1).items.get(0),
                syncScrollBars = function(e) {
                    var scrollTop = this.dom.scrollTop;
                    codeViewerA.el.dom.scrollTop = scrollTop;
                    codeViewerB.el.dom.scrollTop = scrollTop;
                };
                codeViewerA.el.on("scroll", syncScrollBars);
                codeViewerB.el.on("scroll", syncScrollBars);
                
                tab.initDiffViewer();       
            }
        }
    }
	,tbar: [{	
        xtype: 'button'
        ,text: 'Edit Mode'
        ,enableToggle: true
        ,toggleHandler: function(button, toggled) {
            // Switch between showing editors and viewers
            
            var panel = this.up('emergence-diff-viewer');
            
            panel.items.get(0).layout.setActiveItem(toggled ? 1 : 0);
            panel.items.get(1).layout.setActiveItem(toggled ? 1 : 0);
            
            // If switching back to viewers, re-render
            if (!toggled) {
            	panel.resetViewerCode();
            }
        }
    }]
    ,initDiffViewer: function()
    {
        if(this.path && this.sideAid && this.sideBid)
            this.loadFiles();  
    }
    ,loadFiles: function()
    {
        this.setLoading({msg: 'Opening Revisions: ' + this.sideAid + ',' + this.sideBid + ' /' + this.path});
        
        this.setSideTitle('A','Revision ' + this.sideAid);
        this.setSideTitle('B','Revision ' + this.sideBid);
        
        Emergence.Editor.store.DavClient.getRevision(this.path, this.sideAid, this.readyCodeARequestHandler, this)
        Emergence.Editor.store.DavClient.getRevision(this.path, this.sideBid, this.readyCodeBRequestHandler, this)
    }
    ,readyCodeARequestHandler: function(response) {
        this.codeA = response.responseText.replace(/\r\n?/g, '\n');;
        
        this.setCodeEditor('A',this.codeA);
        
        this.linesA = this.codeA.split('\n');
        
        if(this.codeB && this.linesB)
        {
            this.updateViewCode();
        }
    }
    ,readyCodeBRequestHandler: function(response) {
        this.codeB = response.responseText.replace(/\r\n?/g, '\n');
        
        this.setCodeEditor('B',this.codeB);
        
        this.linesB = this.codeB.split('\n');
        
        if(this.codeA && this.linesA)
        {
            this.updateViewCode();
        } 
    }
    ,updateViewCode: function() {        
        var diffdata = this.diff(this.linesA, this.linesB);

        // Give code to viewer for rendering            
        this.setCode('A', this.codeA, diffdata);
        this.setCode('B', this.codeB, diffdata);
        
        this.setLoading(false);   
    }
    ,setSideTitle: function(side,title)
    {
        this.items.get( side == 'A'?0:1 ).setTitle(title);
    }
    ,setCodeEditor: function(side,code) {
        this.items.get(side == 'A'?0:1).items.get(1).el.dom.value = code;
    }
    ,getCodeEditor: function(side) {
        return this.items.get(side == 'A'?0:1).items.get(1).el.dom.value;
    }
    ,resetViewerCode: function() {
        // Grab code and normalize line breaks
        var codeA = this.getCodeEditor('A').replace(/\r\n?/g, '\n'),
            codeB = this.getCodeEditor('B').replace(/\r\n?/g, '\n'),
            // Split code into lines
            linesA = codeA.split('\n'),
            linesB = codeB.split('\n'),
            // Perform diff
            diff = this.diff(linesA, linesB);

        // Give code to viewer for rendering            
        this.setCode('A', codeA, diff);
        this.setCode('B', codeB, diff);
    }
    ,initComponent: function() {
        
        this.itemId = 'diff:[' + this.sideAid + ',' + this.sideBid + ']/'+this.path;
        
    	this.codeViewer = new Ext.Template(
    		"<div class='ux-codeViewer'></div>"
    	);
    	
		this.lineTpl = new Ext.Template(
		    "<div class='ux-codeViewer-line'>",
		        "<span class='ux-codeViewer-lineNumber'>",
		            "{0:htmlEncode}",
		        "</span>",
		        "<span class='ux-codeViewer-lineText'>",
		            "{1}",
		        "</span>",
		    "</div>");
		this.emptyLineTpl = new Ext.Template(
		    "<div class='ux-codeViewer-line ux-codeViewer-empty'>",
		        "<span class='ux-codeViewer-lineNumber'>",
		        "</span>",
		    "</div>");
		this.tokenTpl = new Ext.Template(
		    "<span class='ux-codeViewer-token-{0}'>{1:htmlEncode}</span>"
		);    
    
    	this.lineTpl.compile();
    	this.emptyLineTpl.compile();
    	this.tokenTpl.compile();
    
    	this.items = [
    		{
	            cls: 'sideA',
	            title: 'Side A',
	            layout: 'card',
	            flex: 1,
	            margins: "6 3 6 6",
	            activeItem: 0,
	            items: [{
	                cls: 'codeViewerA'
	                ,xtype: 'box'
	                ,autoEl: {
				        tag: 'div'
				        ,cls: 'ux-codeViewer'
				    }
	                ,style: "overflow: scroll"
	                ,sideA: false
	            },{
	                cls: 'codeEditorA'
	                ,xtype: 'box'
	                ,autoEl: {
				        tag: 'textarea'
				        ,cls: 'ux-codeEditor'
				    }
	            }]
	        },{
	            cls: 'sideB',
	            title: 'Side B',
	            layout: 'card',
	            flex: 1,
	            margins: "6 6 6 3",
	            activeItem: 0,
	            items: [{
	                cls: 'codeViewerB'
	                ,xtype: 'box'
	                ,autoEl: {
				        tag: 'div'
				        ,cls: 'ux-codeViewer'
				    }
	                ,style: "overflow: scroll"
	                ,sideA: false
	            },{
	                cls: 'codeEditorB'
	                ,xtype: 'box'
	                ,autoEl: {
				        tag: 'textarea'
				        ,cls: 'ux-codeEditor'
				    }
	            }]            
	        }
	    ]; 
    
    
    
    	this.callParent();
    }
    ,diff: function(a,b)
    {
	    var calcMiddleSnake = function(a, aIndex, N, b, bIndex, M) {
	        var V = {},
	            rV = {},
	            maxD = Math.ceil((M+N)/2),
	            delta = N-M,
	            odd = (delta & 1) != 0,
	            x, y, xStart, yStart;
	        
	        V[1] = 0;
	        rV[delta-1] = N;
	        for (var D = 0; D <= maxD; D++) {
	            for (var k = -D; k<=D; k+=2) {
	                var down = (k == -D || k != D && V[k-1] < V[k+1]);
	                if (down) {
	                    xStart = x = V[k+1];
	                    yStart = xStart-(k+1);
	                }
	                else {
	                    xStart = x = V[k-1];
	                    yStart = xStart-(k-1);
	                    x++;
	                }
	                
	                y = x-k;
	                while (x < N && y < M && a[aIndex+x] == b[bIndex+y]) {
	                    x++;
	                    y++;
	                }
	                V[k] = x;
	                if (odd && k >= (delta-(D-1)) && k <= (delta+(D-1))) {
	                    if (rV[k] <= V[k]) {
	                        if (down && xStart == 0 && yStart == -1) {
	                            yStart++;
	                        }
	                        return {
	                            numDiffs: 2*D-1, 
	                            x: aIndex+xStart, 
	                            y: bIndex+yStart, 
	                            u: aIndex+x, 
	                            v: bIndex+y, 
	                            insertion: down,
	                            index: (down?bIndex+yStart:aIndex+xStart),
	                            forward: true
	                        };
	                    }
	                }
	            }
	            var dDelta = D+delta,
	                dDeltaNeg = -D+delta;
	                
	            for (var k = dDeltaNeg; k<=dDelta; k+=2) {
	                var up = (k == dDelta || k != dDeltaNeg && rV[k-1] < rV[k+1]);
	                if (up) {
	                    xStart = x = rV[k-1];
	                    yStart = xStart-(k-1);
	                }
	                else {
	                    xStart = x = rV[k+1];
	                    yStart = xStart-(k+1);
	                    x--;;
	                }
	                
	                y = x-k;
	                while (x > 0 && y > 0 && a[aIndex+x-1] == b[bIndex+y-1]) {
	                    x--;
	                    y--;
	                }
	                rV[k] = x;
	
	                if (!odd && k >= -D && k <= D) {
	                    if (rV[k] <= V[k]) {
	                        if (up && xStart == N && yStart == M+1) {
	                            yStart--;
	                        }
	                        return {
	                            numDiffs: 2*D, 
	                            x: aIndex+x, 
	                            y: bIndex+y, 
	                            u: aIndex+xStart, 
	                            v: bIndex+yStart, 
	                            insertion: up, 
	                            index: (up?bIndex+yStart-1:aIndex+xStart-1),
	                            forward: false
	                        };
	                    }
	                }
	            }
	        }
	        throw "Didn't find middle snake";
	    };
	    
	    var calcSES = function(a, aIndex, N, b, bIndex, M, ses) {
	        if (N == 0 && M == 0) { return; }
	
	        var middleSnake = calcMiddleSnake(a, aIndex, N, b, bIndex, M);
	        
	        if (middleSnake.numDiffs == 1) {
	            (middleSnake.insertion?ses.insertions:ses.deletions).push(middleSnake.index);
	        }
	        else if (middleSnake.numDiffs > 1) {
	            (middleSnake.insertion?ses.insertions:ses.deletions).push(middleSnake.index);
	            calcSES(a, aIndex, middleSnake.x - aIndex, b, bIndex, middleSnake.y - bIndex, ses);
	            calcSES(a, middleSnake.u, aIndex+N-middleSnake.u, b, middleSnake.v, bIndex+M-middleSnake.v, ses);
	        }
	    };
	    
		var ses = {
            insertions: [],
            deletions: []
        };
        calcSES(a, 0, a.length, b, 0, b.length, ses);
        ses.insertions.sort(function(a,b) {return a-b;});
        ses.deletions.sort(function(a,b) {return a-b;});
        return ses;
    }
    ,setCode: function(side,code, diff)
    {
        var el = this.items.get(side == 'A'?0:1).items.get(0).el;
    
        // Clear
        el.update("");
        
        // Create copies of the edit script
        var insertions = diff.insertions.slice(0),
            deletions = diff.deletions.slice(0),
            
            // Obtain reference to HTML templates
            lineTpl = this.lineTpl,
            emptyLineTpl = this.emptyLineTpl,
            
            // Create a "pre" tag to hold the code
            pre = el.createChild({tag: 'pre'}),
            
            // Normalize line-breaks in the code
            code = code.replace(/\r\n?/g, '\n'),
            
            // Split code into discrete lines
            lines = code.split('\n'),
        
            // Cursors/flags for walking the edit script
            sideAIndex = 0,
            sideBIndex = 0,
            sideAChangeIndex = deletions.shift(),
            sideBChangeIndex = insertions.shift(),
            prevWasModified = false;
        
        // Loop over each line
        for (var i = 0, n = lines.length; i<n; i++) {
            // Create the HTML for the line, including highlighting
            var el = lineTpl.append(pre, [i+1, this.highlightLine(lines[i])]);
            
            // By default we want to move both cursors forward
            var advanceA = true,
                advanceB = true;
            
            // If both cursors indicate a change, consider it to be a modification
            if (sideAIndex === sideAChangeIndex && sideBIndex === sideBChangeIndex) {
                Ext.fly(el).addCls('ux-codeViewer-modified');
                
                // Get next changes
                sideAChangeIndex = deletions.shift();
                sideBChangeIndex = insertions.shift();
                
                // Set modified flag so that following lines
                // are marked accordingly
                prevWasModified = true;
            }
            else {
                // Different logic for side A vs side B
                // For instance, an insert means an empty line on side A
                // and highlighting on side B
                if (side == 'A') {
                    // If there was a deletion
                    if (sideAIndex === sideAChangeIndex) {
                        // Either highlight as deleted or modified depending
                        // on the previous line
                        Ext.fly(el).addCls(prevWasModified ? 'ux-codeViewer-modified' : 'ux-codeViewer-deleted');
                        
                        // Get next change
                        sideAChangeIndex = deletions.shift();
                        
                        // Don't advance B cursor
                        advanceB = false;
                    }
                    else {
                        // If there were insertions, generate empty lines
                        while (sideBIndex === sideBChangeIndex) {
                            // Insert empty line
                            emptyLineTpl.insertBefore(el);
                            
                            // Get next change
                            sideBChangeIndex = insertions.shift();
                            
                            // Keep advancing as long as there was an insertion
                            sideBIndex++;
                        }
                    }
                }
                // Side B
                else {
                    //  If there was an insertation
                    if (sideBIndex == sideBChangeIndex) {
                        // Either highlight as inserted or modified depending
                        // on the previous line
                        Ext.fly(el).addCls(prevWasModified ? 'ux-codeViewer-modified' : 'ux-codeViewer-inserted');
                        
                        // Get next change
                        sideBChangeIndex = insertions.shift();
                        
                        // Don't advance A cursor
                        advanceA = false;
                    }
                    else {
                        // If there were deletions, generate empty lines
                        while (sideAIndex === sideAChangeIndex) {
                            // Insert empty line
                            emptyLineTpl.insertBefore(el);
                            
                            // Get next change
                            sideAChangeIndex = deletions.shift();
                            
                            // Keep advancing as long as there was a deletion
                            sideAIndex++;
                        }
                    }
                }
                
                // Reset modified flag
                prevWasModified = false;
            }
            
            // Advance cursors
            if (advanceA) { sideAIndex++; }
            if (advanceB) { sideBIndex++; }
        }
    }
	,highlightLine: function(line) {
		var scope = this;
	
        var matches = [];
        
        var between = function(idx, length) {
            for (var i = 0; i < matches.length; i++){
                var m = matches[i],
                    s = m[0],
                    e = m[1];
                if (s <= idx && (idx + length) <= e){
                    return true;
                }
            }
            return false;
        };
        
        var highlight = function(str, regex, cls, fn){
            regex.compile(regex);
            var match;

            while (match = regex.exec(str)){
                var mdata = fn ? fn(match) : [match.index, match[0]],
                    midx = mdata[0],
                    mstr = mdata[1];
                if (!between(midx, mstr.length)){
                    var replacement = scope.tokenTpl.apply([cls, mstr]),
                        diff = (replacement.length - mstr.length);
                    str = str.slice(0, midx) + replacement + str.slice(midx + mstr.length);
                    regex.lastIndex = midx + replacement.length;
                    for (var i = 0; i < matches.length; i++){
                        var m = matches[i];
                        if (m[1] < midx) continue;
                        
                        m[0] += diff;
                        m[1] += diff;
                    }
                    matches.push([midx, regex.lastIndex]);
                }
            }
            return str;
        };

        // String literals
        line = highlight(line, /("|')[^\1]*?\1/ig, 'string');
        
        // Integers and Floats
        line = highlight(line, /\d+\.?\d*/ig, 'number');

        // Function names
        line = highlight(line, /(\w+)\s*\:\s*function/ig, 'function', function(match){
            return [match.index, match[1]];
        });
        line = highlight(line, /function (\w+)/ig, 'function', function(match){
            return [match.index + 9, match[1]];
        });

        // Keywords
        line = highlight(line, /\b(this|function|null|return|true|false|new|int|float|break|const|continue|delete|do|while|for|in|switch|case|throw|try|catch|typeof|instanceof|var|void|with|yield|if|else)\b/ig, 'keyword');

        // Operators
        line = highlight(line, /\.|\,|\:|\;|\=|\+|\-|\&|\%|\*|\/|\!|\?|\<|\>|\||\^|\~/ig, 'operator');
        
        return line;
    }
});
Ext.define('Emergence.Editor.view.window.Find', {
    extend: 'Ext.window.Window'
    ,alias: 'widget.emergence-find-window'
    
    ,stateId: 'emergence-find-window'
    ,title: 'Find Text'
    ,width: 320
    ,height: 200
    ,layout: 'anchor'
    ,defaults: {
        anchor: '100%'
    }
    ,items: [
        {
            xtype: 'form'
            ,defaultType: 'textfield'
            ,items: [{
                fieldLabel: 'Find'
                ,name: 'find'
            },{
                fieldLabel: 'Case sensitive'
                ,name: 'casesens'
                ,xtype: 'checkboxfield'   
            },{
                fieldLabel: 'Whole words only'
                ,name: 'wholewords'
                ,xtype: 'checkboxfield'   
            },{
                fieldLabel: 'Regular expression'
                ,name: 'regex'
                ,xtype: 'checkboxfield'   
            }]
            ,buttons: [{
                text: 'Find'
                ,action: 'find'
            },{
                text: 'Find Next'
                ,action: 'next'
            },{
                text: 'Find Previous'
                ,action: 'previous'
            }]
        }       
    ]
});
Ext.define('Emergence.Editor.store.FileTree', {
    extend: 'Ext.data.TreeStore'
	,alias: 'store.filetree'
	,requires: ['Emergence.Editor.proxy.Develop']
	
	
    ,model: 'Emergence.Editor.model.File'
	
	,folderSort: true
	,sortOnLoad: true
	,sorters: [{
		property: 'Handle'
		,direction: 'ASC'
	}]
	
    ,root: {
        text: 'children'
        ,id: 'children'
        ,expanded: true
    }
    ,proxy: {
        type: 'develop'
    }
    ,refreshNodeByRecord: function(record)
    {
        this.load({
            node: record
        });     
    }
    //,clearOnLoad: false
    /*
    // proxy INSTANCE was required when trying to parse an XML response who's root wasn't "children"
    ,constructor: function() {
    	this.proxy = Ext.create('Emergence.Editor.proxy.Develop');
    	
    	return this.callParent(arguments);
    }
    */
});
Ext.define('Emergence.Editor.view.editor.TabPanel', {
    extend: 'Ext.tab.Panel'
	,alias: 'widget.emergence-editortabpanel'
    //,enableTabScroll: true 
    ,requires: ['Ext.ux.TabCloseMenu','Ext.ux.TabScrollerMenu','Ext.ux.TabReorderer']
    ,listeners: {
        tabchange: function(tabpanel, newcard, oldcard, options)
        {
            var revisionsPanel = Emergence.Editor.app.viewport.down('emergence-file-revisions');
            if(newcard.itemId == 'activity')
            {
                revisionsPanel.getStore().removeAll();
                revisionsPanel.collapse();   
            }
            else if(newcard.ID)
            {
                if(revisionsPanel.isVisible(true))
                {
                    revisionsPanel.store.load({params: {ID:newcard.ID}});
                }  
            }
        }
        /*,activate: function(tabpanel, options)
        {
            console.log(this);
            Emergence.Editor.app.viewport.down('emergence-file-revisions').up().on('expand', function(viewportEast, options) {
                console.log(this);
            }, this);   
        }*/
        ,scope: this     
    }
	,initComponent: function() {
		
        this.items = [{
			xtype: 'emergence-activity'
			,itemId: 'activity'
		}];
		
		// todo: extend this plugin so we can use our own menu items
		this.plugins = [Ext.create('Ext.ux.TabCloseMenu'),Ext.create('Ext.ux.TabScrollerMenu', { maxText  : 50, pageSize: 30 }),Ext.create('Ext.ux.TabReorderer')];
		
		this.callParent(arguments);
	}
    /* implement statefulness for open tabs */
    ,stateEvents: ['tabchange', 'remove', 'add','afterlayout']
    

    ,getState: function() {
    
        var openFiles = [];
        
        this.items.each(function(item) {
            if(item.path && item.persistent)
                openFiles.push(item.path);
        });
        
        //console.log('gotState: ', openFiles);
        return {openFiles: openFiles};
    }
});
Ext.define('Emergence.Editor.controller.Editors', {
	extend: 'Ext.app.Controller'
	,refs: [{
		ref: 'tabPanel'
		,selector: 'tabpanel'
	}]
	,aceModules: [
		'/jslib/ace/mode-javascript.js'
		,'/jslib/ace/mode-html.js'
		,'/jslib/ace/mode-php.js'
		,'/jslib/ace/mode-css.js'
		,'/jslib/ace/theme-coda-emergence.js'
	]
	,aceTheme: "ace/theme/coda-emergence"
	,views: ['editor.TabPanel','editor.ACE']
	,init: function()
    {
		//console.info('Emergence.Editor.controller.Editors.init()');

		// Start listening for events on views
		this.control({
			'emergence-editortabpanel': {
				tabchange: this.onTabChange
                ,staterestore: this.onTabsStateRestore
			}
		});
		
		this.application.on('fileopen', this.onFileOpen, this);
		this.application.on('filesave', this.onFileSave, this);
		this.application.on('fileclose', this.onFileClose, this);
        this.application.on('diffopen', this.onDiffOpen, this); 
		
		// load ACE javascripts
		this.application.aceReady = false;
		this.application.aceModulesLoaded = [];
		
		Ext.Loader.loadScriptFile('/jslib/ace/ace.js', function() {
			Ext.each(this.aceModules, function(moduleUrl) {
				Ext.Loader.loadScriptFile(moduleUrl, function() {
					this.application.aceModulesLoaded.push(moduleUrl);
					
					if(this.application.aceModulesLoaded.length == this.aceModules.length)
					{
						this.application.aceReady = true;
						this.application.fireEvent('aceReady')
					}
				}, Ext.emptyFn, this);
			}, this);
		}, Ext.emptyFn, this);
	}
	,onLaunch: function()
    {
		//console.info('Emergence.Editor.controller.Editors.onLaunch()');
	}
	,onTabChange: function(tabPanel, newCard, oldCanel)
    {
        var token = newCard.itemId;
           
        if(token)
            this.application.setActiveView(token, newCard.title);
	}
    ,onTabsStateRestore: function(tabPanel, state) {
        
        Ext.each(state.openFiles, function(path) {
            this.onFileOpen(path, false);      
        }, this);
        
    }
    ,onDiffOpen: function(path, autoActivate, sideA, sideB)
    {
        autoActivate = autoActivate !== false; // default to true 
        
        var itemId, title;
        
        title = path.substr(path.lastIndexOf('/')+1) + ' (' + sideA + '&mdash;' + sideB + ')';
        itemId = 'diff:[' + sideA + ',' + sideB + ']/'+path;
        
        var tab = this.getTabPanel().getComponent(itemId); 
        
        if(!tab)
        {
            tab = this.getTabPanel().add({
                xtype: 'emergence-diff-viewer'
                ,path: path
                ,sideAid: sideA
                ,sideBid: sideB
                ,title: title
                ,closable: true
                ,html: '<div></div>'
            });
        }
        
        if(autoActivate)
            this.getTabPanel().setActiveTab(tab);        
    }
	,onFileOpen: function(path, autoActivate, id) {
    
        autoActivate = autoActivate !== false; // default to true
	    
        var itemId, title;
        
        if(id)
        {
            itemId = 'revision:[' + id + ']/'+path;
            title = path.substr(path.lastIndexOf('/')+1) + '(' + id + ')';
        }
        else
        {
            itemId = '/' + path;   
            title = path.substr(path.lastIndexOf('/')+1);
        }
        
        
		var tab = this.getTabPanel().getComponent(itemId);
                                                        
        if(!tab)
		{
        	tab = this.getTabPanel().add({
	        	xtype: 'aceeditor'
	        	,path: path
	        	,aceTheme: this.aceTheme
	        	,title: title
	        	,closable: true
                ,html: '<div></div>'
                ,revisionID: id
                ,persistent: !id
	        });
		}
        
        if(autoActivate)
	    	this.getTabPanel().setActiveTab(tab);

	}
	,onFileSave: function() {
	
		var activeCard = this.getTabPanel().getActiveTab();
		
		if(activeCard.xtype == 'aceeditor')
		{
			activeCard.saveFile();
		}
	}
	,onFileClose: function() {
	
		var activeCard = this.getTabPanel().getActiveTab();
		
		if(activeCard.closable)
		{
			activeCard.close();
		}
	}
});
Ext.define('Emergence.Editor.view.Transfers', {
	extend: 'Ext.grid.Panel'
    ,alias: 'widget.emergence-transfersgrid'
	,title: 'Transfers'
	,sortableColumns: false
	,enableColumnHide: false
	,enableColumnMove: false
	,columns: {
		defaults: {
			menuDisabled: true
		}
		,items: [
			{ header: 'Task',  dataIndex: 'task', width: 150 }
			,{ header: 'Path', dataIndex: 'path', flex: 1 }
			,{ header: 'Info', dataIndex: 'info', flex: 1 }
			,{ header: 'Status', dataIndex: 'status', width: 150 }
		]
	}
	
});
Ext.define('Emergence.Editor.controller.Transfers', {
	extend: 'Ext.app.Controller'


	,views: ['Transfers']
	//,stores: ['Transfers']
	//,models: ['Transfer']
	
	,refs: [{
		ref: 'grid'
		,selector: 'emergence-transfersgrid'
	}]
	
	,init: function() {
		//console.info('Emergence.Editor.controller.Transfers.init()');

		this.application.on('transferComplete', function(data) {
			//throw "Caught deprecated transferComplete event!";
			this.getGrid().getStore().insert(0, data);
			
		}, this);

        Emergence.Editor.store.DavClient.addEvents('beforefileupload','afterfileupload','fileuploadprogress');
        
        Emergence.Editor.store.DavClient.on('beforefileupload', this.onBeforeFileUpload, this);
        Emergence.Editor.store.DavClient.on('afterfileupload', this.onAfterFileUpload, this);
        Emergence.Editor.store.DavClient.on('fileuploadprogress', this.onFileUploadProgress, this);
        
		Emergence.Editor.store.DavClient.on('beforerequest', this.onBeforeRequest, this);
		Emergence.Editor.store.DavClient.on('requestcomplete', this.onRequestComplete, this);
		Emergence.Editor.store.DavClient.on('requestexception', this.onRequestException, this);
	}
	
    ,onBeforeFileUpload: function(path, DOMFile, XHRObject) {
        
        this.getGrid().getStore().insert(0, {
            requestId: XHRObject.uniqueID
            ,task: 'PUT'
            ,path: path
            //,info: 'Transfer Completed, transferred ' + response.responseText.length + ' bytes'
            ,status: 'Request sent'
        });
          
    }
    ,onAfterFileUpload: function(path, DOMFile, XHRObject) {
        var store = this.getGrid().getStore()
            ,oldRecord = store.findRecord('requestId',XHRObject.uniqueID)
            ,newData = {
                requestId: XHRObject.uniqueID
                ,task: 'Uploaded file'
                ,path: path
                ,info: 'Transfer completed, uploaded ' + XHRObject.total + ' bytes' 
                ,status: 'Complete'
            };
            
        if(oldRecord)
            oldRecord.set(newData);
        else
            store.insert(0, newData);
    }
    ,onFileUploadProgress: function(progress, event, path, DOMFile, XHRObject) {
        
        // store total in the xhrobject for later
        XHRObject.total = event.total;
        
        var store = this.getGrid().getStore()
            ,oldRecord = store.findRecord('requestId',XHRObject.uniqueID)
            ,newData = {
                requestId: XHRObject.uniqueID
                ,task: 'PUT'
                ,path: path
                ,info: 'Transfer in progress: ' + Math.round(event.loaded / 1024) + 'KB /' + Math.round(event.total / 1024) + 'KB (' + progress + '%)' 
                ,status: 'In Progress'
            };
            
        if(oldRecord)
            oldRecord.set(newData);
        else
            store.insert(0, newData);   
    }
	,onBeforeRequest: function(connection, options) {

		this.getGrid().getStore().insert(0, {
			requestId: Ext.data.Connection.requestId+1
			,task: options.method
			,path: options.url
			//,info: 'Transfer Completed, transferred ' + response.responseText.length + ' bytes'
			,status: 'Request sent'
        });
	}
	
	,onRequestComplete: function(connection, response, options) {

		//console.log(response.request.options.url);

		var store = this.getGrid().getStore()
			,oldRecord = store.findRecord('requestId', response.requestId)
			,newData = {
				requestId: response.requestId
				,task: options.method
				,path: options.url
				,status: 'Complete'
	        };
	        
		// add method-specific attributes
		if(options.method == 'PUT')
        {
			newData.info = 'Transfer Completed, uploaded ' + options.params.length + ' bytes';
        }
        else
        {
            newData.info = 'Transfer Completed, downloaded ' + response.responseText.length + ' bytes';
        }
        
        switch(response.request.options.task)
        {
            case 'get-file':
                newData.task = 'Downloading file';
                if(typeof response.request.options.headers != 'undefined')
                {
                    newData.path = 'Revision (' + response.request.options.headers['X-Revision-ID'] + ') ' + newData.path;     
                }
                break;
            case 'directory-listing':
                newData.task = 'Reading directory';
                break;
            case 'save-file':
                newData.task = 'Uploading file';
                break;
            case 'delete-file':
                newData.task = 'Deleting file';
                break;
            case 'create-folder':
                newData.task = 'Creating directory';
                break;
        }
                
		// update or insert into grid
		if(oldRecord)
			oldRecord.set(newData);
		else
			store.insert(0, newData);
	}
	
	,onRequestException: function(connection, response, options) {

		this.getGrid().getStore().insert(0, {
            task: options.method
            ,path: options.url
            ,info: 'Request failed with HTTP status '+response.status
            ,status: 'Exception'
        });
	}
	
});
Ext.define('Emergence.Editor.view.Revisions', {
    extend: 'Ext.grid.Panel'
    ,alias: 'widget.emergence-file-revisions'
    ,requires: [
        'Ext.grid.column.Template'
        ,'Ext.grid.column.Number'
        ,'Ext.util.Format'
    ]
    
    ,store: 'Revisions'
    ,componentCls: 'emergence-file-revisions'


    ,initComponent: function() {
        
        this.viewConfig = this.viewConfig || {};
        this.viewConfig.getRowClass = function(record) {
            return 'status-'+record.get('Status');
        };
        
        this.columns = [{
            header: 'Timestamp'
            ,dataIndex: 'Timestamp'
            ,renderer: function(mtime) {
                var now = new Date()
                    ,str = Ext.util.Format.date(mtime, 'g:i a');
                
                // add date if mtime > 24 hours ago
                if(now.getTime() - mtime.getTime() > 86400000) // 24 hr in ms
                {
                    str += ' &ndash; ';
                    str += Ext.util.Format.date(mtime, now.getYear() == mtime.getYear() ? 'M d' : 'M d Y');
                }
                
                return '<time datetime="'+Ext.util.Format.date(mtime, 'c')+'" title="'+Ext.util.Format.date(mtime, 'Y-m-d H:i:s')+'">'+str+'</time>';
            }
            ,width: 110
        },{
            header: 'Author'
            ,dataIndex: 'Author'
            ,flex: 1
            ,xtype: 'templatecolumn'
            ,tpl: [
                '<tpl for="Author">'
                    ,'<a href="/people/{Username}" title="{FirstName} {LastName} <{Email}>" target="_blank">{Username}</a>'
                ,'</tpl>'
            ]
        },{
            header: 'Size'
            ,dataIndex: 'Size'
            ,width: 60
            ,xtype: 'templatecolumn'
            ,tpl: [
                '<tpl if="Status==\'Deleted\'">'
                    ,'DELETED'
                ,'</tpl>'
                ,'<tpl if="Status!=\'Deleted\'">'
                    ,'<abbr title="{Size} bytes">{Size:fileSize}</abbr>'
                ,'</tpl>'
            ]
        }];
        
        this.callParent();    
    }
});
Ext.define('Emergence.Editor.controller.Revisions', {
    extend: 'Ext.app.Controller'
    ,views: ['Revisions','contextmenu.RevisionsMenu','Viewport']
    ,stores: ['Revisions']
    ,models: []
    ,refs: [{
        ref: 'revisionsGrid'
        ,autoCreate: true
        ,selector: 'emergence-file-revisions'
        ,xtype: 'emergence-file-revisions'
    },{
		ref: 'revisionsMenu'
		,autoCreate: true
		,selector: 'emergence-revisionsmenu'
		,xtype: 'emergence-revisionsmenu'
	},{
        ref: 'diffWindow'
        ,autoCreate: true
        ,selector: 'SimpleCodeViewer'
        ,xtype: 'emergence-diff-viewer'   
    },{
        ref: 'tabPanel'
        ,selector: 'viewport > tabpanel'
    }]
    ,onLaunch: function() {
        //console.info('Emergence.Editor.controller.Revisions.onLaunch()');
    }
    ,init: function() {
        //console.info('Emergence.Editor.controller.Files.init()');
        
        // Start listening for events on views
        this.control({
            'emergence-file-revisions': {
                itemdblclick: this.openRevision
                ,itemcontextmenu: this.onRevisionContextMenu
            }
            ,'emergence-revisionsmenu > menuitem[action=open]': {
                click: this.onOpenClick  
            }
            ,'emergence-revisionsmenu > menuitem[action=properties]': {
                click: this.onPropertiesClick  
            }
            ,'emergence-revisionsmenu > menuitem[action=compare_latest]': {
                click: this.onCompareLatestClick  
            }
            ,'emergence-revisionsmenu > menuitem[action=compare_next]': {
                click: this.onCompareNextClick  
            }
            ,'emergence-revisionsmenu > menuitem[action=compare_previous]': {
                click: this.onComparePreviousClick  
            }
            ,'tabPanel': {
                tabchange: this.onTabChange   
            }
        });
    }
    ,onTabChange: function(tabpanel, newcard, oldcard, eopts)
    {
        
    }
    ,openRevisionByRecord: function(record)
    {
    	Ext.util.History.add('revision:[' + record.get('ID') + ']/'+record.get('FullPath'), true);
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
    ,openDiff: function(sideA, sideB)
    {
        Ext.util.History.add('diff:[' + sideA.get('ID') + ',' + sideB.get('ID') + ']/'+sideA.get('FullPath'), true);    
    }
});
Ext.define('Emergence.Editor.view.file.Tree', {
    extend: 'Ext.tree.Panel'
    ,alias: 'widget.emergence-filetree'

    ,store: 'FileTree'
    ,title: 'Filesystem'
    ,useArrows: true
    ,rootVisible: false
    
    ,viewConfig: {
    	loadMask: false
    }
});
Ext.define('Emergence.Editor.controller.Files', {
	extend: 'Ext.app.Controller'
	,views: ['file.Tree', 'contextmenu.CollectionMenu', 'contextmenu.FileMenu']
	,stores: ['FileTree']
	,models: ['File']
	,refs: [{
		ref: 'fileMenu'
		,autoCreate: true
		,selector: 'emergence-filemenu'
		,xtype: 'emergence-filemenu'
	},{
		ref: 'collectionMenu'
		,autoCreate: true
		,selector: 'emergence-collectionmenu'
		,xtype: 'emergence-collectionmenu'
	},{
		ref: 'fileTree'
		,selector: 'emergence-filetree'
		,xtype: 'emergence-filetree'
	}]
    ,onLaunch: function() {
        //console.info('Emergence.Editor.controller.Files.onLaunch()');
    }
	,init: function() {
		//console.info('Emergence.Editor.controller.Files.init()');
		
		// Start listening for events on views
		this.control({
            /*
             *  FILE TREE EVENTS
             */
			'emergence-filetree': {
				itemcontextmenu: this.onNodeContextMenu
				,itemdblclick: this.onNodeDblClick
				,render: this.onTreeRendered
			}
            /*
             *  FILE NODE CONTEXT MENU
             */
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
            /*
             *  FOLDER NODE CONTEXT MENU
             */
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
		});
	}
	,onTreeRendered: function() {
		this.getFileTree().el.on('dragover', this.onTreeDragover, this);
        this.getFileTree().el.on('dragleave', this.onTreeDragleave, this); 
		this.getFileTree().el.on('drop', this.onFileTreeDrop, this);
	}
	,onFileTreeDrop: function(event) {
		event.preventDefault();
		
		var e = event.browserEvent;
		var treePanel = this.getFileTree();
		var treeView = treePanel.view;
		var node = treeView.findTargetByEvent(event);
		var record = treeView.getRecord(node);
		
        // if the drop occured on a file assume the file upload is simply being placed into the parent collection
		if(record.raw.Class == 'SiteFile')
		{
			record = record.parentNode;
		}
		
		if(record.raw.Class == 'SiteCollection')
		{
            //console.log(e.dataTransfer);
            
            var uploadStatus = new Array(e.dataTransfer.files.length);
            
            Ext.each(e.dataTransfer.files, function(file, index, files) {
                
                var path = record.raw.FullPath + '/' + file.name;

                Emergence.Editor.store.DavClient.putDOMFile(path
                    ,file
                    ,function() {
                        uploadStatus[index] = true;
                        
                        var done = true;
                        
                        Ext.each(uploadStatus, function(status, index, uploadStatus) {
                            if(!status)
                            {
                                done = false;   
                            }
                        }, this);
                        
                        if(done) {
                            this.afterDropUpload.call(this,record,e.dataTransfer.files);
                        }
                    }
                    ,function(percentage, event) {
                        //console.log(percentage);
                    }
                ,this);  
            }, this);
		}
	}
    ,afterDropUpload: function(collectionRecord, files) {
        //console.log('file upload sequence completed');
        this.getFileTreeStore().refreshNodeByRecord(collectionRecord);      
    }
    ,onTreeDragleave: function(event) {
        event.preventDefault();
        
        var e = event.browserEvent;
        var treePanel = this.getFileTree();
        var treeView = treePanel.view;
        var node = treeView.findTargetByEvent(event);
        
        if(node) {
            Ext.get(node).removeCls('x-grid-row-focused')
        }
    }
	,onTreeDragover: function(event) {
		event.preventDefault();
        
        var e = event.browserEvent;
        var treePanel = this.getFileTree();
        var treeView = treePanel.view;
        var node = treeView.findTargetByEvent(event);
        
        if(node) {
            Ext.get(node).addCls('x-grid-row-focused');
            
            var record = treeView.getRecord(node);
            
            if(record.raw.Class == 'SiteCollection')
            {
                record.expand();  
            }
        }
	}
    ,openFileByRecord: function(record)
    {
        Ext.util.History.add('/'+record.get('FullPath'), true);       
    }
    ,openRevisionByRecord: function(record)
    {
        
    }
    /*
     *           FILE TREE EVENT HANDLERS
     */
	,onTreeStoreLoad: function(store, node, records, successful, options)
    {  
		
	}
	,onNodeDblClick: function(view, record, item, index, event, options)
    {
        if(record.raw.Class == 'SiteFile')
        {
		    this.openFileByRecord(record); 
        }
	}
	,onNodeContextMenu: function(treePanel, record, item, index, event, options)
    {
		event.stopEvent();
		
        this.currentRecord = record;
        
		if(record.raw.Class == 'SiteFile')
		{
			this.getFileMenu().showAt(event.getXY()); 
		}
		else if(record.raw.Class == 'SiteCollection')
		{
			this.getCollectionMenu().showAt(event.getXY()); 
		}	
	}
    /*
     *           FILE CONTEXT MENU EVENT HANDLERS
     */
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
        this.openFileByRecord(this.currentRecord); 
    }
    /*
     *           FOLDER CONTEXT MENU EVENT HANDLERS
     */
    ,onNewFileClick: function(menuItem, event, options)
    {
        var name = prompt('Provide a filename:');
        if(name != null)
        {  
            var newFile = this.currentRecord.raw.FullPath + '/' + name;
            Emergence.Editor.store.DavClient.createFileNode(newFile,function() {
                this.getFileTreeStore().refreshNodeByRecord(this.currentRecord);     
            },this);   
        }
    }
    ,onNewFolderClick: function(menuItem, event, options)
    {
        var name = prompt('Provide a folder name:');
        if(name != null)
        {  
            var newFolder = this.currentRecord.raw.FullPath + '/' + name;
            Emergence.Editor.store.DavClient.createCollectionNode(newFolder,function() {
                this.getFileTreeStore().refreshNodeByRecord(this.currentRecord);     
            },this);   
        }
    }
    ,onRefreshClick: function(menuItem, event, options)
    {
        this.getFileTreeStore().refreshNodeByRecord(this.currentRecord);
    }
    /*
     *           FOLDER & FILE CONTEXT MENU EVENT HANDLERS
     */
    ,onRenameClick: function(menuItem, event, options)
    {
        var name = prompt('Provide a new name:');
        if(name != null)
        {
            var newPath = this.currentRecord.parentNode.raw.FullPath + '/' + name;
            Emergence.Editor.store.DavClient.renameNode(this.currentRecord.raw.FullPath,newPath,function() {
                this.getFileTreeStore().refreshNodeByRecord(this.currentRecord.parentNode);     
            },this);   
        }
    } 
    ,onDeleteClick: function(menuItem, event, options)
    {
        if(confirm("Are you sure you want to delete " + this.currentRecord.raw.Handle + "?"))
        {
            Emergence.Editor.store.DavClient.deleteNode(this.currentRecord.raw.FullPath,function() {
                this.getFileTreeStore().refreshNodeByRecord(this.currentRecord.parentNode);     
            },this);
        }
    }
});
Ext.define('Emergence.Editor.view.Menubar', {
	extend: 'Ext.toolbar.Toolbar'
    ,alias: 'widget.emergence-menubar'
	,requires: [
		'Ext.layout.container.Border'
		,'Ext.form.field.Text'
		,'Ext.toolbar.TextItem'
	]
    
    ,stateful: false
	,style: { border: 'none' }

	,initComponent: function() {	
	
		this.items = [
            {
                text: 'Emergence'
                ,icon: 'http://emr.ge/img/logo-16.png'
                ,menu: [
                    {
                        text: 'About Emergence'
                        ,href: 'http://emr.ge'
                        ,hrefTarget: '_blank'
                        ,icon: 'http://emr.ge/img/logo-16.png'
                    }
                    ,{
                        xtype: 'menuseparator'
                    }
                    ,{
                        text: 'Site Tools'
                        ,action: 'site-tools'
                        ,icon: '/img/icons/fugue/gear.png'
                    }
                ]
            }
            ,{
                text: 'File'
                ,menu: [
                    /*{
                        text: 'New'
                        ,icon: '/img/icons/fugue/blue-document.png'
                    }
                    ,{
                        text: 'New Tab'
                    }
                    ,{
                        text: 'New Window'
                    }
                    ,{
                        xtype: 'menuseparator'
                    }
                    ,{
                        text: 'Close Current Tab'
                    }
                    ,*/{
                        text: 'Save'
                        ,icon: '/img/icons/fugue/disk-black.png'
                        ,action: 'save'
                    }
                    /*,{
                        text: 'Save As'
                    }*/
                ]
            }
            ,{
                text: 'Edit'
                ,menu: [
                    /*{
                        text: 'Cut'
                        ,icon: '/img/icons/fugue/scissors-blue.png'
                    }
                    ,{
                        text: 'Copy'
                        ,icon: '/img/icons/fugue/blue-document-copy.png'
                    }
                    ,{
                        text: 'Paste'
                        ,icon: '/img/icons/fugue/clipboard-paste-document-text.png'
                    }
                    ,{
                        xtype: 'menuseparator'
                    }
                    ,*/{
                        text: 'Find'
                        ,icon: '/img/icons/fugue/binocular.png'
                        ,action: 'find'
                    }
                    ,{
                        text: 'Replace'
                        ,icon: '/img/icons/fugue/edit-replace.png'
                        ,disabled: true
                    }
                ]
            }
            ,{
                text: 'View'
                ,disabled: true
            }
            ,{
			    text: 'Help'
			    ,menu: {
				    plain: true
				    ,items: [
                        {
    				        text: 'Emergence Homepage'
					        //,plain: true
					        ,href: 'http://emr.ge'
					        ,hrefTarget: '_blank'
                            ,icon: 'http://emr.ge/img/logo-16.png'
				        }
                        ,{
                            xtype: 'menuseparator'
                        }
                        ,{
                            xtype: 'textfield'
                            ,inputType: 'search'
                            ,action: 'help-lookup'
                            ,emptyText: 'Lookup Class'
                        }
                        ,{
                            xtype: 'menuseparator'
                        }
                        ,{
                            text: 'Getting Started with an External Client on OS X'
                            ,href: 'http://emr.ge/manual/getting_started_osx'
                            ,hrefTarget: '_blank'
                        }
                        ,{
                            text: 'Getting Started with an External Client on Windows'
                            ,href: 'http://emr.ge/manual/getting_started_win'
                            ,hrefTarget: '_blank'
                        }
                        ,{
    				        text: 'Working with Models'
					        ,href: 'http://emr.ge/manual/models'
					        ,hrefTarget: '_blank'
				        }
                        ,{
                            text: 'Mapping Links with Controllers'
                            ,href: 'http://emr.ge/manual/controllers'
                            ,hrefTarget: '_blank'
                        }
                        ,{
                            text: 'Views: Using the Template System'
                            ,href: 'http://emr.ge/manual/views'
                            ,hrefTarget: '_blank'
                        }
                    ]
			    }
		    },{
			    xtype: 'tbfill'
		    },{
			    xtype: 'tbtext'
			    ,text: '<a href="http://emr.ge" target="_blank">emergence</a>'
		    }
        ];
		
		this.callParent();
		
	}
	
});
Ext.define('Emergence.Editor.controller.Viewport', {
	extend: 'Ext.app.Controller'
	,requires: ['Ext.util.History']
	,refs: [{
		ref: 'menubar'
		,selector: 'emergence-menubar'
	},{
        ref: 'tabPanel'
        ,selector: 'viewport > tabpanel'
	},{
        ref: 'siteTools'
        ,selector: 'emergence-site-tools'
        ,xtype: 'emergence-site-tools'
        ,autoCreate: true    
    },{
        ref: 'detailsPanel'
        ,selector: 'viewport > tabpanel:last' 
    },{
        ref: 'findWindow'
        ,autoCreate: true
        ,selector: 'emergence-find-window'
        ,xtype: 'emergence-find-window'
    }]

	,views: ['Viewport','Menubar','Activity','SimpleCodeViewer','SiteTools','window.Find']
    
	,init: function()
    {
		//console.info('Emergence.Editor.controller.Viewport.init()');
		
		// Start listening for events on views
		this.control({
			'emergence-menubar menuitem[action=site-tools]': {
				click: this.onSiteToolsClick
			}
        	,'emergence-menubar menuitem[action=save]': {
				click: this.onSaveClick
			}
            ,'emergence-menubar menuitem[action=find]': {
                click: this.onFindClick
            } 
    		,'emergence-menubar textfield[action=help-lookup]': {
				specialkey: this.onHelpLookupSpecialKey
			}
            ,'emergence-find-window': {
                show: this.onFindShow   
            }
            ,'emergence-find-window textfield[name=find]': {
                specialkey: this.onFindSpecialKey   
            }
            ,'emergence-find-window button[action=find]': {
                click: this.onFindButtonClick   
            }
            ,'emergence-find-window button[action=next]': {
                click: this.onFindNextButtonClick   
            }
            ,'emergence-find-window button[action=previous]': {
                click: this.onFindPreviousButtonClick   
            }
            ,'viewport > tabpanel:last': {
                expand: this.onDetailsPanelExpand   
            }
		});
		
		this.application.on('nav', this.onNav, this);		
	}
	,onLaunch: function()
    {
		//console.info('Emergence.Editor.controller.Viewport.onLaunch()');

		// setup history class
		Ext.getBody().createChild({
			tag: 'form'
			,id: 'history-form'
			,cls: 'x-hide-display'
			,cn: [{
				tag: 'input'
				,type: 'hidden'
				,id: 'x-history-field'
			},{
				tag: 'iframe'
				,id: 'x-history-frame'
			}]
		});
		
		// init history
		Ext.util.History.init(this.onHistoryChange, this);
		Ext.util.History.on('change', this.onHistoryChange, this);

		// init keymap
		this.keyMap = Ext.create('Ext.util.KeyMap', document, [{
            key: "s"
            ,ctrl: true
            ,defaultEventAction: 'stopEvent'
            ,scope: this
            ,handler: function() {
            	this.application.fireEvent('filesave');
            }
        },{
            key: "f"
            ,ctrl: true
            ,defaultEventAction: 'stopEvent'
            ,scope: this
            ,handler: function() {
                this.onFindClick();
            }
        }]); 
        
        this.getDetailsPanel().on('expand', this.onDetailsPanelExpand, this);
	}
	,onHistoryChange: function()
    {
		var token = Ext.util.History.getToken();
		
		if(token)
			this.loadNavPath(token);
	}
	,loadNavPath: function(navPath)
    {
		//console.info('loadNavPath: ', navPath);

		if(navPath.charAt(0) == '/')
			this.application.fireEvent('fileopen', navPath.substr(1));
        else if(navPath.substr(0, 9).toLowerCase()== 'revision:')
        {
            var pathpos = navPath.indexOf('/')+1;
            var path = navPath.substr(pathpos);
            
            var idpos = navPath.indexOf('[')+1;
            var idposend = navPath.indexOf(']');
            var id = navPath.substring(idpos,idposend);
            
            this.application.fireEvent('fileopen', path, true, id);    
        }
        else if(navPath.substr(0, 5).toLowerCase() == 'diff:')
        {
            var pathpos = navPath.indexOf('/')+1;
            var path = navPath.substr(pathpos);
            
            var idpos = navPath.indexOf('[')+1;
            var idposend = navPath.indexOf(']');
            var ids = navPath.substring(idpos,idposend);
            
            if(ids.indexOf(',') != false)
            {
                var sides = ids.split(',');
                var sideA = sides[0];
                var sideB = sides[1];
                
                this.application.fireEvent('diffopen', path, true, sideA, sideB);   
            }       
        }
        else
            this.getTabPanel().getLayout().setActiveItem(navPath);
	}
	,onSiteToolsClick: function(item, event, opts)
    {
        this.getSiteTools().show();        
	}
	,onHelpLookupSpecialKey: function(field, event)
    {
		if (event.getKey() == event.ENTER)
		{
			window.open('http://emr.ge/classes/'+field.getValue());
	    }
	}
    ,onSaveClick: function() {
        this.application.fireEvent('filesave');
    }
    ,onFindShow: function(window, options)
    {
        window.down('textfield[name=find]').focus('',true);       
    }
    ,onFindSpecialKey: function(field, event)
    {
        if (event.getKey() == event.ENTER)
        {
            this.onFindButtonClick();
        }    
    }
    ,onFindClick: function() {
        this.getFindWindow().show();
    }
    ,onFindButtonClick: function() {
        var findText = this.getFindWindow().down('textfield[name=find]').value;
        
        var activeTab = this.getTabPanel().activeTab;
        if(typeof activeTab.aceEditor != 'undefined')
        {
            var regex = this.getFindWindow().down('checkboxfield[name=regex]');
            var casesens = this.getFindWindow().down('checkboxfield[name=casesens]');
            var wholewords = this.getFindWindow().down('checkboxfield[name=wholewords]');
            
            activeTab.aceEditor.find(findText, {
                regExp: regex.value
                ,caseSensitive: casesens.value
                ,wholeWord: wholewords.value    
            });       
        }
    }
    ,onFindNextButtonClick: function() {
        var activeTab = this.getTabPanel().activeTab;
        if(typeof activeTab.aceEditor != 'undefined')
        {
            activeTab.aceEditor.findNext();       
        }
    }
    ,onFindPreviousButtonClick: function() {
        var activeTab = this.getTabPanel().activeTab;
        if(typeof activeTab.aceEditor != 'undefined')
        {
            activeTab.aceEditor.findPrevious();       
        }
    }
    ,onDetailsPanelExpand: function(tabpanel, options) {
        var activeTab = this.getTabPanel().activeTab;
        
        if(activeTab.ID)
        {
            tabpanel.down('emergence-file-revisions').store.load({params: {ID:activeTab.ID}});       
        }
    }
});

