/*jslint browser: true, undef: true, white: false, laxbreak: true *//*global Ext, EmergenceEditor3*/
Ext.define('EmergenceEditor3.controller.Search', {
    extend: 'Ext.app.Controller'
    
    ,views: ['TabPanel', 'SearchResults']
    ,stores: []
    ,models: []
    ,refs: [{
        ref: 'searchResults'
        ,selector: 'viewport > tabpanel'
    }]
    ,init: function() {
        // Start listening for events on views
        this.control({
            'viewport > tabpanel': {
                tabchange: this.onTabChange   
            }
        });
	}
	,onTabChange: function(tabPanel, newCard, oldCard, eOpts)
    {
		if(newCard.isXType('search-results')) {
			//TODO It would be better to prevent this view from scrolling all the way right in the first place, but this is a workaround for now - KBC
	        newCard.down('dataview').getEl().scrollTo('left', 0, false);
		}
    }
});