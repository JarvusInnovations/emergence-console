/*jslint browser: true, undef: true, white: false, laxbreak: true *//*global Ext, EmergenceEditor2*/
Ext.define('EmergenceEditor2.controller.Search', {
    extend: 'Ext.app.Controller'
    
    ,views: ['TabPanel', 'SearchResults']
    ,stores: []
    ,models: []
    ,refs: [{
        ref: 'searchResults'
        ,selector: 'viewport > tabpanel'
    }, {
		ref: 'fileTypeComboBox'
		,selector: 'emergenceeditor-menubar combobox[name=fileTypes]'
    }]
    ,init: function() {
		var me = this
			,fileTypeComboBox, fileTypesData, fileTypeStore;

        // Start listening for events on views
        this.control({
            'viewport > tabpanel': {
                tabchange: this.onTabChange   
            }
        });
        
        //Load File Types
        EmergenceEditor2.API.loadFileTypes(function(success, fileTypes) {
			if(success) {
				fileTypesData = Ext.Array.map ( fileTypes, function(x) {
			            return {text: x, value: x};
			      }, this);
			    
			    fileTypesData.unshift({text: 'All files', value: 'All Files'});
			    
				fileTypeStore = new Ext.data.Store({
				    fields: ['text', 'value'],
				    data : fileTypesData 
				});
				
				fileTypeComboBox = me.getFileTypeComboBox();
				
				fileTypeComboBox.bindStore(fileTypeStore);
				fileTypeComboBox.setValue('All Files');
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
