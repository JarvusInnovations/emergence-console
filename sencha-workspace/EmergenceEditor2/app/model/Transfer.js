/*jslint browser: true, undef: true, white: false, laxbreak: true *//*global Ext, EmergenceEditor*/
Ext.define('EmergenceEditor2.model.Transfer', {
    extend: 'Ext.data.Model'
    
    ,fields:[{
        name: 'requestId'
        ,type: 'int'
    },{
        name:  'task'
        ,type: 'string'     
    },{
        name: 'path'
        ,type: 'string'
    },{
        name: 'info'
        ,type: 'string'
    },{
        name: 'status'
        ,type: 'string'
    }]
});
