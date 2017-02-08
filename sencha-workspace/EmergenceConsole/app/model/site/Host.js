Ext.define('EmergenceConsole.model.site.Host', {
    extend: 'Ext.data.Model',

    proxy: {
        type: 'localstorage',
        id: 'hosts-remembered'
    },

    fields: [{
        name: 'host',
        type: 'string'
    }]

});
