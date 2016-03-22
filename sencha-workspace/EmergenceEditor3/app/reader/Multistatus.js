/*jslint browser: true, undef: true, white: false, laxbreak: true *//*global Ext*/
Ext.define('EmergenceEditor3.reader.Multistatus', {
	extend: 'Ext.data.reader.Xml'
	,alias: 'reader.multistatus'
	
	,root: 'd|multistatus'
	,record: 'response'
	,successProperty: false
	,totalProperty: false
	
	,read: function(response) {
		var resultSet = this.callParent(arguments);
		
		// trim first result from response if it matches requested URL
		if(resultSet.count && resultSet.records[0].get('url') == response.request.options.url) {
			resultSet.records.shift();
			resultSet.count--;
		}
		
		return resultSet;
	}
});