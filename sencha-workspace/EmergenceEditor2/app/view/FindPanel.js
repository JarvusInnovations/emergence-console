/*jslint browser: true, undef: true, white: false, laxbreak: true *//*global Ext, EmergenceEditor*/
Ext.define('EmergenceEditor2.view.FindPanel', {
    extend: 'Ext.panel.Panel'
    ,requires: ['Ext.form.Panel','Ext.form.field.Text','Ext.form.field.Checkbox']
    ,xtype: 'findpanel'
    
    ,title: 'Find Text'
    ,height: 200
    ,items: [
        {
            xtype: 'form'
            ,defaultType: 'textfield'
            ,items: [{
                fieldLabel: 'Find'
                ,name: 'find'
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
            },{
                fieldLabel: 'Scope'
                ,xtype: 'button'
                ,text: 'Selected Tab'
                ,menu: [{
                        text:'Selected Tab'
                    },{
                        text:'All Open Tabs'
                    },{
                        text:'Whole Project'
                    }]
            }]
            ,buttons: [{
                text: 'Find'
                ,action: 'find'
            },{
                text: 'Find Next'
                ,action: 'next'
            },{
                text: 'Find Previous'
                ,action: 'previous'
            }]
        }       
    ]
});
