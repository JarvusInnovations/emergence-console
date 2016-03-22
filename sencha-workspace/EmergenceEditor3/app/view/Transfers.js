/*jslint browser: true, undef: true, white: false, laxbreak: true *//*global Ext, EmergenceEditor*/
Ext.define('EmergenceEditor3.view.Transfers', {
	extend: 'Ext.grid.Panel'
    ,xtype: 'emergenceeditor-transfersgrid'
	,title: 'Transfers'
	,sortableColumns: false
	,enableColumnHide: false
	,enableColumnMove: false
	,columns: {
		defaults: {
			menuDisabled: true
		}
		,items: [
			{ text: 'Task',  dataIndex: 'task', width: 150 }
			,{ text: 'Path', dataIndex: 'path', flex: 1 }
			,{ text: 'Info', dataIndex: 'info', flex: 1 }
			,{ text: 'Status', dataIndex: 'status', width: 150 }
		]
	}
});