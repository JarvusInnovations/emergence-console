/*jslint browser: true, undef: true, white: false, laxbreak: true *//*global Ext, EmergenceEditor3*/
Ext.define('EmergenceEditor3.view.SearchResults', {
	extend: 'Ext.panel.Panel'
	,xtype: 'search-results'
	,layout: 'fit'
	,initComponent: function() {
		
		this.items = [{
			xtype: 'dataview'
			,tpl: new Ext.XTemplate(
				'<section class="activity-feed">'
				,'<tpl for=".">'
					,'<article class="feed-item">'
						,'<span class="file">'
							//TODO This path is broken for _parent files, need to remove develop or implement unified path structure. - KBC
							,'<a class="filename" href="#/develop/{File.FullPath}:{line}" title="/{File.FullPath}:{line}">{File.Handle}</a>'
						,'</span>'
						,'Line {line}<pre>{[this.parseResult(values.result)]}</pre>'
					,'</article>'
				,'</tpl>'
				,'</section>'
				,{
					parseResult: function(result) {
						return result.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
					}
				}
			)
			,itemSelector: 'article'
			,emptyText: 'Nothing found.'
			//,store: 'SiteSearch'
			,autoScroll: true
		}];
		
		this.callParent(arguments);
	}
});