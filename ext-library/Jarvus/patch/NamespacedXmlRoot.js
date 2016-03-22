/*jslint browser: true, undef: true, white: false, laxbreak: true *//*global Ext*/
Ext.define('Jarvus.patch.NamespacedXmlRoot', {
	override: 'Ext.data.reader.Xml'
	
	// replace namespace | with : when comparing node name
	,getRoot: function(data) {
		var nodeName = data.nodeName,
			root	 = this.root;

		if (!root || (nodeName && nodeName == root.replace(/\|/, ':'))) {
			return data;
		} else if (Ext.DomQuery.isXml(data)) {
			// This fix ensures we have XML data
			// Related to TreeStore calling getRoot with the root node, which isn't XML
			// Probably should be resolved in TreeStore at some point
			return Ext.DomQuery.selectNode(root, data);
		}
	}
});