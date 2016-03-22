/*jslint browser: true, undef: true, white: false, laxbreak: true *//*global Ext, EmergenceEditor*/
Ext.define('EmergenceEditor3.plugin.diff.Controller', {
	extend: 'EmergenceEditor3.plugin.Abstract'
	,requires: [
		'Emergence.util.Diff'
	]
	
	,views: [
		'EmergenceEditor3.plugin.diff.View'
	]
	
	,refs: [{
		ref: 'tabPanel'
		,selector: 'emergenceeditor-tabpanel'
	}]
	
	
	// controller template methods
	,init: function() {
		var me = this;
		
		me.control({
			'diffview': {
				activate: me.onViewActivate
			}
		});
		
		
		me.application.on('commandselect', 'onCommandSelect', me);
	}
	
	
	// controller methods

	,onCommandSelect: function(commandName, command) {
		console.log('diff.Controller.onCommandSelect(commandName=%o, command.subPath=%o, command.params=%o)', commandName, command.subPath, command.params);
		
		if(commandName != 'diff') {
			return;
		}
		
		var me = this
			,tabPanel = me.getTabPanel()
			,basePath = command.subPath
			,params = command.params
			,specRe = /^([^@]*)(@(\d+))?$/
			,beforePath = Ext.Array.clone(basePath)
			,beforeRevisionId = null
			,afterPath = Ext.Array.clone(basePath)
			,afterRevisionId = null
			,matches
			,diffView;
		
		// parse before and after paths
		if(params.before && (matches = specRe.exec(params.before))) {
			if(matches[1]) {
				beforePath.push.apply(beforePath, matches[1].split('/'));
			}
			
			if(matches[3]) {
				beforeRevisionId = parseInt(matches[3], 10) || null;
			}
		}	
		
		if(params.after && (matches = specRe.exec(params.after))) {
			if(matches[1]) {
				afterPath.push.apply(afterPath, matches[1].split('/'));
			}
			
			if(matches[3]) {
				afterRevisionId = parseInt(matches[3], 10) || null;
			}
		}
		
		// remove any empty items caused by extra opening/trailing slashes
		beforePath = Ext.Array.clean(beforePath);
		afterPath = Ext.Array.clean(afterPath);
		
		// TODO: move all this to another controller along with the loading code that's currently in the diff view
		diffView = tabPanel.add({
			xtype: 'diffview'
			,title: 'Diff'
			,itemId: '!'+command.full
			,closable: true
			,queuedJob: {
				beforePath: beforePath
				,beforeRevisionId: beforeRevisionId
				,afterPath: afterPath
				,afterRevisionId: afterRevisionId
			}
		});
		
		tabPanel.setActiveTab(diffView);
	}
	
	,onViewActivate: function(diffView) {
		console.log('diff.Controller.onViewActivate');
		
		var job = diffView.queuedJob
			,leftCmp = diffView.down('#leftSide')
			,rightCmp = diffView.down('#rightSide')
			,beforeResponse = false
			,afterResponse = false;
		
		if(!job) {
			return;
		}
		
		// spawn async load of both
		leftCmp.setLoading('Loading revision&hellip;');
		EmergenceEditor3.API.getFile(job.beforePath, job.beforeRevisionId, function(response) {
			beforeResponse = response;
			leftCmp.setLoading(false);
			if(afterResponse) {
				_onBothLoaded();
			}
		});
		
		rightCmp.setLoading('Loading revision&hellip;');
		EmergenceEditor3.API.getFile(job.afterPath, job.afterRevisionId, function(response) {
			afterResponse = response;
			rightCmp.setLoading(false);
			if(beforeResponse) {
				_onBothLoaded();
			}
		});
		
		// called after both are loaded
		function _onBothLoaded() {
			var leftLines = beforeResponse.responseText.replace(/\r\n?/g, '\n').split(/\n/)
				,rightLines = afterResponse.responseText.replace(/\r\n?/g, '\n').split(/\n/)
				,diff = Emergence.util.Diff.getDiff(leftLines, rightLines);
			
			diffView.setCode('A', leftLines, diff);
			diffView.setCode('B', rightLines, diff);
		}
	}
});