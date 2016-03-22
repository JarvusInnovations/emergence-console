/*jslint browser: true, undef: true, white: false, laxbreak: true *//*global Ext, EmergenceEditor*/
Ext.define('EmergenceEditor2.view.window.Replace', {
    extend: 'Ext.window.Window'
    ,requires: ['Ext.form.Panel','Ext.form.field.Text','Ext.form.field.Checkbox']
    ,xtype: 'emergence-replace-window'
    
    ,stateId: 'emergence-replace-window'
    ,title: 'Find &amp; Replace Text'
    ,width: 320
    ,height: 230
    ,layout: 'anchor'
    ,defaults: {
        anchor: '100%'
    }
    ,items: [
        {
            xtype: 'form'
            ,defaultType: 'textfield'
            ,items: [{
                fieldLabel: 'Find'
                ,name: 'find'
            },{
                fieldLabel: 'Replace'
                ,name: 'replace'
            },{
                fieldLabel: 'Case sensitive'
                ,name: 'casesens'
                ,xtype: 'checkboxfield'   
            },{
                fieldLabel: 'Whole words only'
                ,name: 'wholewords'
                ,xtype: 'checkboxfield'   
            },{
                fieldLabel: 'Regular expression'
                ,name: 'regex'
                ,xtype: 'checkboxfield'   
            }]
            // Button actions borrowed from XCode, open to suggestion here - KBC
            ,buttons: [{
                text: 'Replace All'
                ,action: 'replaceAll'
            },{
                text: 'Replace'
                ,action: 'replace'
                ,disabled: true
            },{
                text: 'Replace &amp; Find'
                ,action: 'replaceFind'
                ,disabled: true
            }]
        }       
    ]
});
