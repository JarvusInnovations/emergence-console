/*jslint browser: true, undef: true, white: false, laxbreak: true *//*global Ext, EmergenceEditor2*/
Ext.define('EmergenceEditor2.view.contextmenu.RevisionsMenu', {
    extend: 'Ext.menu.Menu'
    ,xtype: 'revisionsmenu'
    ,width: 150
    ,items: [{
            text: 'Open'
            ,action: 'open'
            ,icon: '/img/icons/fugue/blue-folder-horizontal-open.png'
        },{
            text: 'Properties'
            ,action: 'properties'
            ,icon: '/img/icons/fugue/property-blue.png'
        },{
            text: 'Compare Latest'
            ,action: 'compare_latest'
        },{
            text: 'Compare Next'
            ,action: 'compare_next'
        },{
            text: 'Compare Previous'
            ,action: 'compare_previous'
    }]  
});
