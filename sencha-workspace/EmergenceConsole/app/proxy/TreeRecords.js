/*jslint browser: true, undef: true *//*global Ext*/
Ext.define('EmergenceConsole.proxy.TreeRecords', {
    extend: 'Emergence.proxy.Records',
    alias: 'proxy.treerecords',

    buildRequest: function(operation) {
        var me = this,
            request = me.superclass.superclass.buildRequest.call(me,operation),
            params = request.getParams();

        if (params) {
            delete params[me.getIdParam()];
        }

        return request;
    }

});
