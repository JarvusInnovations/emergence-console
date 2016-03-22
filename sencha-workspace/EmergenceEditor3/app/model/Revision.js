/*jslint browser: true, undef: true, white: false, laxbreak: true *//*global Ext, EmergenceEditor*/
Ext.define('EmergenceEditor3.model.Revision', {
	extend: 'Ext.data.Model'
	
	,fields:[{
		name:  'ID'
		,type: 'integer'
		
	},{
		name: 'Class'
		,type: 'string'
	},{
		name: 'Handle'
		,type: 'string'
	},{
		name: 'Type'
		,type: 'string'
	},{
		name: 'MIMEType'
		,type: 'string'
	},{
		name: 'Size'
		,type: 'integer'
	},{
		name: 'SHA1'
		,type: 'string'
	},{
		name: 'Status'
		,type: 'string'
	},{
		name:  'Timestamp'
		,type: 'date'
		,dateFormat: 'timestamp'
	},{
		name: 'Author'
	},{
		name:  'AuthorID'
		,type: 'integer'
		
	},{
		name:  'AncestorID'
		,type: 'integer'
		
	},{
		name:  'CollectionID'
		,type: 'integer'
		
	},{
		name: 'FullPath'
		,type: 'string'
	}]
});