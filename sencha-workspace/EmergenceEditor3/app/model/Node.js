/*jslint browser: true, undef: true, white: false, laxbreak: true *//*global Ext, EmergenceEditor*/
Ext.define('EmergenceEditor3.model.Node', {
	extend: 'Ext.data.Model'
	
	//,idProperty: 'ID' // ID isn't unique between SiteFile and SiteCollection!
	,fields: [{
		name: 'url'
		,mapping: 'href'
		,convert: function(v, r) {
			//TODO take /develop out of non-root node's url
			return v;
			
//			if(r.get('id') == 'root' || !r.parentId) {
//				return v;
//			}
//			else {
//				debugger
//			}
		}
	},{
		name: 'class'
		,type: 'string'
		,convert: function(v, r) {
			if(Ext.DomQuery.isXml(r.raw) && Ext.DomQuery.selectNode('resourcetype collection', r.raw)) {
				return 'Collection';
			}
			return 'File';
		}
	},{
		name: 'href'
		,convert: function() {
			return null;
		}
	},{
		// override the special "text" field to programmatically populate it from a different place
		name: 'text'
		,convert: function(v, r) {
			var href = r.get('url')
				,matches;
				
			if(href && (matches = href.match(/([^\/]+)\/?$/))) {
				return decodeURIComponent(matches[1]);
			}
			else {
				return null;
			}
		}
	},{
		name: 'leaf'
		,type: 'boolean'
		,convert: function(v, r) {
			if(Ext.DomQuery.isXml(r.raw)) {
				return !Ext.DomQuery.selectNode('resourcetype collection', r.raw);
			}
			return false;
		}
	}]
});