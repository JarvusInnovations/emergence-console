/*jslint browser: true, undef: true, white: false, laxbreak: true *//*global Ext, EmergenceEditor*/
Ext.define('EmergenceEditor3.controller.Editor', {
	extend: 'Ext.app.Controller'
	
	
	,aceModules: [
		'/jslib/ace-new/mode-javascript.js'
		,'/jslib/ace-new/mode-coffee.js'
		,'/jslib/ace-new/mode-html.js'
		,'/jslib/ace-new/mode-php.js'
		,'/jslib/ace-new/mode-css.js'
		,'/jslib/ace-new/mode-sass.js'
		,'/jslib/ace-new/mode-json.js'
		,'/jslib/ace-new/theme-ambiance.js'
		,'/jslib/ace-new/theme-chaos.js'
		,'/jslib/ace-new/theme-chrome.js'
		,'/jslib/ace-new/theme-clouds.js'
	]
	
	
	// controller config
	,views: [
		'editor.ACE'
//		,'editor.TabPanel'
	]
	
	,refs: [{
		ref: 'tabPanel'
		,selector: 'emergenceeditor-tabpanel'
	}]
	
	
	// controller template methods
	,init: function() {
		var me = this
			,app = me.application
			,previousDisableCaching = Ext.Loader.getConfig('disableCaching');
		
		me.control({
			'emergenceeditor-tabpanel': {
//				tabchange: me.onTabChange
                staterestore: me.onTabsStateRestore
			}
			,'aceeditor': {
				staterestore: me.onAceEditorStateRestore
				,activate: me.onAceEditorActivate
				,close: me.onAceEditorClose
			}
		});
		
		app.on({
			scope: me
			,filepathselect: 'onFilePathSelect'
//			,fileopen: 'onFileOpen'
//			,filesave: 'onFileSave'
			//TODO complete file actions -KBC
//			,fileclose: 'onFileClose'
		});
		
		// load ACE javascripts
		app.aceReady = false;
		app.aceModulesLoaded = [];

		Ext.Loader.setConfig('disableCaching', false);
		Ext.Loader.loadScript({
			url: '/jslib/ace-new/ace.js'
			,onLoad: function() {
				Ext.each(me.aceModules, function(moduleUrl) {
					Ext.Loader.loadScript({
						url: moduleUrl
						,onLoad: function() {
							app.aceModulesLoaded.push(moduleUrl);
							
							if(app.aceModulesLoaded.length == me.aceModules.length)
							{
								Ext.Loader.setConfig('disableCaching', previousDisableCaching);
								app.aceReady = true;
								
								app.fireEvent('aceReady');
							}
						}
					});
				});
			}
		});
		
		window.onbeforeunload = function () {
	        //TODO check to make sure there are no tabs with unsaved changes
	    };
	}
	
	
	// event handlers
	,onFilePathSelect: function(filePath, lineNo, revisionId) {
		console.log('Editor.onFilePathSelect(filePath=%o, lineNo=%o, revisionId=%o)', filePath, lineNo, revisionId);
		
		var me = this
			,tabPanel = me.getTabPanel()
			,editorView = me.getEditorForFile(filePath, revisionId);
		
		me.syncTabTitles();
		
		tabPanel.setActiveTab(editorView);
		
		if(lineNo) {
			console.warn('TODO: jump to line '+lineNo);
		}
	}
	
	,onAceEditorActivate: function(editorView) {
		var me = this
			,queuedFile = editorView.queuedFile
			,path;
		
		if(queuedFile) {
			editorView.queuedFile = null;
			editorView.loadingFile = queuedFile;
			
			editorView.setLoading('Opening ' + queuedFile.name + '&hellip;');
			EmergenceEditor3.API.getFile(queuedFile.path, queuedFile.revisionId, function(response) {
				
				if(queuedFile.revisionId && response.getResponseHeader('X-Revision-ID') != queuedFile.revisionId) {
					return me.application.error('Received revision ID did not match requested revision ID');
				}
				
				queuedFile.contentType = response.getResponseHeader('Content-Type');
				queuedFile.body = response.responseText;
				
		        // TODO: move mime-to-icon and other mime-logic to a singleton utility class
		        if(editorView.tab) {
		        	editorView.tab.setIcon(editorView.getIcon(queuedFile.contentType));
		        }
		        
				editorView.setLoading(false);
				
				editorView.loadingFile = null;
				editorView.loadFile(queuedFile);
			});
		}
	}
	
	,onAceEditorClose: function() {
		this.syncTabTitles();
	}
	
//	,onTabChange: function(tabPanel, newCard, oldCanel) {
//        var token = newCard.itemId
//			,activeCard = this.getTabPanel().getActiveTab();
//           
//        if(token) {
//            this.application.setActiveView(token, newCard.title);
//        }
//            
//		if(activeCard.xtype == 'aceeditor' && typeof activeCard.aceEditor != 'undefined') {
//			activeCard.onResize();
//		}  
//	}
	
	,onAceEditorStateRestore: function(aceEditor, state) {
		aceEditor.setAceTheme(state.aceTheme);
	}
	
    ,onTabsStateRestore: function(tabPanel, state) {
		var me = this;

		console.log('onTabsStateRestore(tabPanel=%o, state=%o)', tabPanel, state);
		
		Ext.each(state.openFiles, function(file) {
			if(file.path && file.revisionId) {
				me.getEditorForFile(file.path, file.revisionId);
			}
		});
		
		me.syncTabTitles();
    }
    
    // @deprecated
//	,onFileOpen: function(path, autoActivate, id, line) {
//		var tabPanel = this.getTabPanel()
//			,tabs = tabPanel.items;
//		
//		autoActivate = autoActivate !== false; // default to true
//		
//		var itemId, title;
//		
//		if(id)
//		{
//			itemId = 'revision:[' + id + ']/'+path;
//			title = path.substr(path.lastIndexOf('/')+1) + '(' + id + ')';
//		}
//		else
//		{
//			itemId = '/' + path;   
//			//TODO Change title to consider other tabs that are open - KBC
//			title = path.substr(path.lastIndexOf('/')+1);
//			//title = this.getUniqueTabName(path, tabs);
//		}		
//		
//		var tab = tabPanel.getComponent(itemId);
//				   
//		if(!tab)
//		{
//			tab = this.getTabPanel().add({
//				xtype: 'aceeditor'
//				,path: path
//				,title: title
//				,closable: true
//				,initialLine: line
//				,html: '<div></div>'
//				,revisionID: id
//				,isRevision: typeof id == 'string'
//				,persistent: !id
//			});
//		}
//		
//		this.setTabTitles(tabs);
//		
//		if(autoActivate) {
//			this.getTabPanel().setActiveTab(tab);
//		}
//	}
	
	,onFileClose: function() {
		var tabPanel = this.getTabPanel()
			,tabs = tabPanel.items
			,activeCard = tabPanel.getActiveTab();
		
		if(activeCard.closable)
		{
			activeCard.close();
			this.setTabTitles(tabs);
		}
	}
	
	,onDiffOpen: function(path, autoActivate, sideA, sideB) {
        autoActivate = autoActivate !== false; // default to true 
        
        var itemId, title;
        
        title = path.substr(path.lastIndexOf('/')+1) + ' (' + sideA + '&mdash;' + sideB + ')';
        itemId = 'diff:[' + sideA + ',' + sideB + ']/'+path;
        
        var tab = this.getTabPanel().getComponent(itemId); 
        
        if(!tab)
        {
            tab = this.getTabPanel().add({
                xtype: 'diff-viewer'
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
    
	,onFileSave: function() {
		var activeCard = this.getTabPanel().getActiveTab();
		
		if(activeCard.isXType('aceeditor'))
		{
			activeCard.saveFile();
		}
	}
    
    
    // controller methods
    ,getEditorForFile: function(filePath, revisionId) {
		var tabPanel = this.getTabPanel()
			,fileName = (filePath.substr(filePath.lastIndexOf('/') + 1))
			,tabId = filePath
			,editorView;
		
		if(revisionId) {
			tabId += '@' + revisionId;
		}
		
		console.log('Editor.getEditorForFile(filePath=%o, revisionId=%o), tabId=%o', filePath, revisionId, tabId);
		debugger
		editorView = tabPanel.getComponent(tabId);
				   
		if(!editorView)
		{
			editorView = tabPanel.add({
				xtype: 'aceeditor'
				,itemId: tabId
				,closable: true
				,queuedFile: {
					path: filePath
					,name: fileName
					,revisionId: revisionId
					,pathComponents: filePath.substr(1).split('/')
				}
//				,path: filePath
//				,title: 'File'
//				,closable: true
//				,initialLine: lineNo
//				,html: '<div></div>'
//				,revisionID: revisionId
//				,isRevision: !!revisionId
//				,persistent: !revisionId
			});
		}
		
		return editorView;
    }
    
    ,syncTabTitles: Ext.Function.createBuffered(function() {
		console.groupCollapsed('syncTabTitles');
		
		var tabDataByPath = {}
			,titlesMap, duplicatesDetected
			,i, len, title, file, filePath, tabData, tabView, tabObject;
			
		function _updateTitlesMap() {
			titlesMap = {};
			duplicatesDetected = false;
			
			Ext.Object.each(tabDataByPath, function(filePath, tabData) {
				title = tabData.title;
			
				if(!titlesMap.hasOwnProperty(title)) {
					titlesMap[title] = [filePath];
				}
				else {
					titlesMap[title].push(filePath);
					duplicatesDetected = true;
				}
			});
		}
		
		// enumerate editor tabs and group by path (multiple revisions of the same file could be open)
		this.getTabPanel().items.each(function(tabView) {
			if(!tabView.isXType('aceeditor')) {
				return;
			}
			
			file = tabView.getCurrentFile();
			filePath = file.path;
			
			if(!tabDataByPath.hasOwnProperty(filePath)) {
				tabDataByPath[filePath] = {
					title: file.name
					,pathComponents: file.pathComponents.slice(0, -1)
					,tabs: [{
						tabView: tabView
						,file: file
					}]
				};
			}
			else {
				tabDataByPath[filePath].tabs.push({
					tabView: tabView
					,file: file
				});
			}
		});
		
		// build initial mapping of titles to path arrays
		_updateTitlesMap();
		
		// destroy duplicates
		while(duplicatesDetected) {
		
			Ext.Object.each(titlesMap, function(title, filePaths) {
				len = filePaths.length;
				
				if(len == 1) {
					return;
				}
				
				for(i = 0; i < len; i++) {
					tabData = tabDataByPath[filePaths[i]];
					if(tabData.pathComponents.length) {
						tabData.title = tabData.pathComponents.pop() + '/' + tabData.title;
					}
				}
			});
			
			// update mapping of titles and duplicatesDetected flag
			_updateTitlesMap();
		}
		
		
		// write titles
		Ext.Object.each(tabDataByPath, function(filePath, tabData) {
			for(i = 0, len = tabData.tabs.length; i < len; i++) {
				tabObject = tabData.tabs[i];
				file = tabData.tabs[i].file;
				title = tabData.title;
				
				if(file.revisionId) {
					title += '@' + file.revisionId;
				}
				
				tabObject.tabView.setTitle(title);
				console.log('%o.setTitle(%o)', tabObject.tabView, title);
			}
		});
		
		console.groupEnd();
    }, 50)
});