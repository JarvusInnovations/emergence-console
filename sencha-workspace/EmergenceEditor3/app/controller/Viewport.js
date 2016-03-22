/*jslint browser: true, undef: true, white: false, laxbreak: true *//*global Ext,SlateDesktop*/
Ext.define('EmergenceEditor3.controller.Viewport', {
	extend: 'Ext.app.Controller'
	,requires: [
		'EmergenceEditor3.API'
		,'Ext.state.LocalStorageProvider'
	]


	// controller config
	,views: [ 'Viewport', 'Menubar', 'window.Find', 'window.Replace', 'Revisions', 'SearchResults' ]
	
	,refs: [{
		ref: 'viewport'
		,selector: 'emergenceeditor-viewport'
		,autoCreate: true
		
		,xtype: 'emergenceeditor-viewport'
//	},{
//		ref: 'fullscreenViewport'
//		,selector: 'emergenceeditor-viewport-fullscreen'
//		,autoCreate: true
//		
//		,xtype: 'emergenceeditor-viewport-fullscreen'
	},{
		ref: 'tabPanel'
		,selector: 'viewport > tabpanel'
	},{
		ref: 'aceEditor'
		,selector: 'aceeditor'
	},{
		ref: 'menubar'
		,selector: 'emergenceeditor-menubar'
	},{
		ref: 'findWindow'
		,autoCreate: true
		,selector: 'emergence-find-window'
		,xtype: 'emergence-find-window'
	},{
		ref: 'replaceWindow'
		,autoCreate: true
		,selector: 'emergence-replace-window'
		,xtype: 'emergence-replace-window'
	},{
		ref: 'searchInput'
		,selector: 'viewport textfield[name=globalSearch]' 
	},{
		ref: 'searchRegex'
		,selector: 'viewport checkboxfield[name=useRegex]' 
	},{
		ref: 'fileTypeComboBox'
		,selector: 'viewport combobox[name=fileTypes]'
	}]
	
	,stores: ['FileType','SiteSearch']


	// controller template methods
	,init: function() {
		var me = this;
		//console.info('Emergence.Editor.controller.Viewport.init()');
		
		// Start listening for events on views
		me.control({
			'emergenceeditor-tabpanel': {
				tabchange: me.onTabChange
			}
			,'emergenceeditor-menubar menuitem[action=save]': {
				click: me.onSaveClick
			}
			,'emergenceeditor-menubar menuitem[action=change-theme]': {
				click: me.onChangeThemeClick
			}
			,'emergenceeditor-menubar menuitem[action=find]': {
				click: me.onFindClick
			} 
			,'emergenceeditor-menubar menuitem[action=replace]': {
				click: me.onReplaceClick
			} 
			,'viewport button[text=Search]' : {
				click: me.onSearchClick
			}			
			,'viewport textfield[name=globalSearch]': {
				keydown: me.onSearchKeydown
			}
			,'emergence-find-window': {
				show: me.onFindShow	
			}
			,'emergence-find-window textfield[name=find]': {
				specialkey: me.onFindSpecialKey	
			}
			,'emergence-find-window button[action=find]': {
				click: me.onFindButtonClick	
			}
			,'emergence-find-window button[action=next]': {
				click: me.onFindNextButtonClick	
			}
			,'emergence-find-window button[action=previous]': {
				click: me.onFindPreviousButtonClick	
			}
			,'emergence-replace-window button[action=replaceAll]': {
				click: me.onReplaceAllButtonClick
			}
		});
	}
	
	,onLaunch: function() {
		// Create viewport
		if(location.search.match(/\Wfullscreen\W/)) {
//			this.getFullscreenViewport();
			alert('TODO fullscreen viewport');
		}
		else {
			// initialize state manager
			Ext.state.Manager.setProvider(Ext.create('Ext.state.LocalStorageProvider'));
			
			this.getViewport();
		}
		
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
		
	}
	
	
	// event handlers
	,onHistoryChange: function() {
		var token = Ext.util.History.getToken();
		if(token) {
			this.loadNavPath(token);
		}
	}
	
	,onTabChange: function(tabPanel, newCard, oldCard) {
		debugger
		if(newCard.isXType('search-results')) {
			this.pushPath((newCard.useRegex ? 'search_regex:' : 'search:') + newCard.searchQuery);
		}
		else {
			this.pushPath(newCard.getItemId(), newCard.tab.getText());
		}
	}
	
	,onSaveClick: function() {
		this.application.fireEvent('filesave');
	}
	
	,onFindShow: function(window, options) {
		//TODO store last find text to the editor and re populate here, also use for replace dialog
		window.down('textfield[name=find]').focus('',true);
	}
	
	,onFindSpecialKey: function(field, event) {
		if (event.getKey() == event.ENTER) {
			this.onFindButtonClick();
		}	 
	}
	
	,onFindClick: function() {
		this.getFindWindow().show();
	}
	
	,onFindButtonClick: function() {
		var findText = this.getFindWindow().down('textfield[name=find]').value;
		
		var activeTab = this.getTabPanel().activeTab;
		if(typeof activeTab.aceEditor != 'undefined') {
			//TODO Need to test if these options are still valid 
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
		if(typeof activeTab.aceEditor != 'undefined') {
			activeTab.aceEditor.findNext();		  
		}
	}
	
	,onFindPreviousButtonClick: function() {
		var activeTab = this.getTabPanel().activeTab;
		if(typeof activeTab.aceEditor != 'undefined') {
			activeTab.aceEditor.findPrevious();		  
		}
	}
	
	,onReplaceClick: function() {
		this.getReplaceWindow().show();
	}
	
	,onReplaceAllButtonClick: function() {
		var findText = this.getReplaceWindow().down('textfield[name=find]').value,
			replaceText = this.getReplaceWindow().down('textfield[name=replace]').value;
		
		var activeTab = this.getTabPanel().activeTab;
		if(typeof activeTab.aceEditor != 'undefined') {
			//TODO Need to test if these options are still valid 
			var regex = this.getReplaceWindow().down('checkboxfield[name=regex]');
			var casesens = this.getReplaceWindow().down('checkboxfield[name=casesens]');
			var wholewords = this.getReplaceWindow().down('checkboxfield[name=wholewords]');
			
			activeTab.aceEditor.replace(findText, replaceText, {
				regExp: regex.value
				,caseSensitive: casesens.value
				,wholeWord: wholewords.value	
			});		  
		}
	}
	
	,onChangeThemeClick: function(item) {
		this.application.fireEvent('aceThemeChanged', item.text.toLowerCase());
	}
	
	,onSearchKeydown: function(field, event, options) {
		if(event.button == 12) {
			this.onSearchClick();
		}
	}
	
	,onSearchClick: function() {
		var query = this.getSearchInput().value,
			useRegex = this.getSearchRegex().getValue(),
			searchUrl = useRegex ? '#search_regex:' : '#search:';
		
		document.location.hash = searchUrl + encodeURIComponent(query);
	}
	
	
	// controller methods
	,loadNavPath: function(navPath) {
		var path
			,line
			,pathpos
			,id
			,ids
			,idpos
			,idposend
			
			,me = this
			,pathOperator = navPath.charAt(0)
			,pathBody = navPath.substr(1)
			,splitIndex;
			
		
		if(pathOperator == '/') {
			return me.loadFilePath(pathBody);
		}
		else if(pathOperator == '!') {
			return me.loadCommand(pathBody);
		}
		else {
			console.warn('Unhandled path, falling thru to legacy route handler: ' + navPath);
		}
		
		//TODO This could probably be refactored to be cleaner - KBC
		if(navPath.indexOf('@') >= 0)
		{
			//TODO expand this logic to handle diffs
			path = navPath.split('@')[0];
			id = navPath.split('@')[1];
			this.application.fireEvent('fileopen', path, true, id);
		}
		else if(navPath.charAt(0) == '/') {
			if(navPath.indexOf(':') == -1) {
				path = navPath.substr(1);
				line = 1;	
			}
			else {
				path = navPath.substring(1,navPath.indexOf(':'));
				line = navPath.substring(navPath.indexOf(':')+1);
			}
			
			this.application.fireEvent('fileopen', path, true, false, line);
		}
//		else if(navPath.substr(0, 9).toLowerCase()== 'revision:')
//		{
//			pathpos = navPath.indexOf('/')+1;
//			path = navPath.substr(pathpos);
//			
//			idpos = navPath.indexOf('[')+1;
//			idposend = navPath.indexOf(']');
//			id = navPath.substring(idpos,idposend);
//			
//			this.application.fireEvent('fileopen', path, true, id);	   
//		}
		else if(navPath.substr(0, 5).toLowerCase() == 'diff:')
		{
			pathpos = navPath.indexOf('/')+1;
			path = navPath.substr(pathpos);
			
			idpos = navPath.indexOf('[')+1;
			idposend = navPath.indexOf(']');
			ids = navPath.substring(idpos,idposend);
			
			if(ids.indexOf(',') !== false)
			{
				var sides = ids.split(',')
					,sideA = sides[0]
					,sideB = sides[1];
				
				this.application.fireEvent('diffopen', path, true, sideA, sideB);	
			}		
		}
		else if(navPath.substr(0,6).toLowerCase() == 'search') 
		{
			var query = navPath.substr(navPath.indexOf(':')+1),
				useRegex = navPath.substr(0,12).toLowerCase() == 'search_regex';
			this.openSearch(query, useRegex);
		}
		else
			this.getTabPanel().getLayout().setActiveItem(navPath);
	}
	
	,loadFilePath: function(filePath) {
		var lineNo = null
			,revisionId = null
			,operatorIndex;
			
		console.log('loadFilePath(%o)', filePath);
			
		operatorIndex = filePath.lastIndexOf('$');
		if(operatorIndex > 0) {
			lineNo = parseInt(filePath.substr(operatorIndex + 1), 10) || lineNo;
			filePath = filePath.substr(0, operatorIndex);
		}
			
		operatorIndex = filePath.lastIndexOf('@');
		if(operatorIndex > 0) {
			revisionId = parseInt(filePath.substr(operatorIndex + 1), 10) || revisionId;
			filePath = filePath.substr(0, operatorIndex);
		}
		
		this.application.selectFilePath(filePath, lineNo, revisionId);
	}
	
	,loadCommand: function(command) {
		console.log('loadCommand(%o)', command);
		
		// parse command
		var matches = command.match(/^([^\/?]+)(\/[^?]*)?(\?.*)?$/)
			,commandObject = {
				command: matches[1]
				,subPath: matches[2] && matches[2].length > 1 ? matches[2].substr(1).split('/') : []
				,params: matches[3] ? Ext.Object.fromQueryString(matches[3]) : {}
				,full: command
			};
		
		this.application.selectCommand(commandObject.command, commandObject);
	}

	,openSearch: function(encodedQuery, useRegex) {
		// create search tab
		var query = decodeURIComponent(encodedQuery),
			tabPanel = this.getTabPanel(),
			tab;
			
		tab = tabPanel.getComponent(query);
		
		if(!tab) {
			tab = this.getTabPanel().add({
				xtype: 'search-results'
				,searchQuery: query
				,title: 'Search Results for ' + encodedQuery
				,closable: true
				,useRegex: useRegex
				,itemId: query
			});			
		}
		
		var dv = tab.down('dataview');
		
		dv.bindStore(Ext.getStore('SiteSearch'));
		
		// load search results
		//TODO this should not be stored in a store, prevents more than one search tab being used at one time - KBC
		//TODO Should we do a store load if the tab has already been loaded? Probably not, need to add refresh search results button maybe - KBC
		dv.getStore().load({
			params: {
				q: query,
				useRegex: useRegex
			}
		});
		
		// set search tab to activetab
		this.getTabPanel().setActiveTab(tab); 
	}
});