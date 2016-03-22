/*jslint browser: true ,undef: true ,white: false ,laxbreak: true *//*global Ext,EmergenceEditor3*/
Ext.define('EmergenceEditor3.view.Viewport', {
	extend: 'Ext.container.Viewport'
	,xtype: 'emergenceeditor-viewport'
	,requires: [
		'Ext.layout.container.Border'
		,'EmergenceEditor3.view.FilePanel'
		,'EmergenceEditor3.view.FindPanel'
		,'EmergenceEditor3.view.Menubar'
		,'EmergenceEditor3.view.Revisions'
		,'EmergenceEditor3.view.TabPanel'
		,'EmergenceEditor3.view.Transfers'
	]
	
	,layout: 'border'
	,items: [{
		region: 'north'
		,items: [{
			xtype: 'emergenceeditor-menubar'
		}
//		,{
//			xtype: 'findpanel'
//			,collapsible: true
//		}
		]
	},{
		xtype: 'emergenceeditor-filepanel'
		,region: 'west'
		,stateId: 'viewport-filepanel'
		,stateful: true
		,width: 200
		,collapsible: true
		,split: true
	},{
		region: 'center'
		,xtype: 'emergenceeditor-tabpanel'
	},{
        title: 'Revision History'
        ,xtype: 'file-revisions'
        ,icon: '/img/icons/fugue/edit-diff.png'
		,region: 'east'
		,stateId: 'viewport-details'
		,width: 275
		,collapsible: true
        ,collapsed: true
		,split: true
	},{
		xtype: 'emergenceeditor-transfersgrid'
		,region: 'south'
		,stateful: true
		,stateId: 'viewport-transfers'
		,height: 200
		,collapsible: true
		,split: true
        ,icon: '/img/icons/fugue/system-monitor-network.png'
        ,collapsed: true
	}]
});