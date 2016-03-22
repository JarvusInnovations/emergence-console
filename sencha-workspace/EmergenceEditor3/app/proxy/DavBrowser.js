/*jslint browser: true, undef: true, white: false, laxbreak: true *//*global Ext*/
Ext.define('EmergenceEditor3.proxy.DavBrowser', {
	extend: 'Ext.data.proxy.Ajax'
	,alias: 'proxy.davbrowser'
	,requires: [
		'Ext.data.Request'
		,'EmergenceEditor3.reader.Multistatus'
	]
	
	,pageParam: false
	,startParam: false
	,limitParam: false
	,sortParam: false
	,reader: {
		type: 'multistatus'
	}
	,actionMethods: {
		read: 'PROPFIND'
	}
	
	,buildRequest: function(operation) {
		var request = new Ext.data.Request({
			action: operation.action
			,records: operation.records
			,operation: operation
			,url: operation.node.get('url')
//			,xmlData: '<?xml version="1.0" encoding="utf-8"?><propfind xmlns="DAV:"><prop><resourcetype xmlns="DAV:"/></prop><prop><getcontenttype xmlns="DAV:"/></prop></propfind>'
			//Get all available properties from dav 
			,xmlData: '<?xml version="1.0" encoding="utf-8"?><propfind xmlns="DAV:"><allprop/></propfind>'
		});
		
		return request;
	}
});