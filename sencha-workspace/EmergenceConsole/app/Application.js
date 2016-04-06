/*jslint browser: true, undef: true *//*global Ext,EmergenceConsole*/
/**
 * The main application class. An instance of this class is created by app.js when it
 * calls Ext.application(). This is the ideal place to handle application launch and
 * initialization details.
 */
Ext.define('EmergenceConsole.Application', {
    extend: 'Ext.app.Application',

    name: 'EmergenceConsole',

    requires: [
        'EmergenceConsole.proxy.API',
        'EmergenceConsole.proxy.WebDavAPI'
    ],

    controllers: [
        'Sites',
        'Hosts',

        'Changes',
        'Files',
        'Docs'
    ],

    /*
    *  check the url for an apiHost parameter and set the API hostname if it exists.
    */
    init: function() {
        var pageParams = Ext.Object.fromQueryString(location.search);

        if (pageParams.apiHost) {
            EmergenceConsole.proxy.API.setHost(pageParams.apiHost);
            EmergenceConsole.proxy.WebDavAPI.setHost(pageParams.apiHost);
        } else {
            // TODO: delete this
            EmergenceConsole.proxy.API.setHost('test.emergence.local');
            EmergenceConsole.proxy.WebDavAPI.setHost('test.emergence.local');
        }
    },

    onAppUpdate: function () {
        Ext.Msg.confirm('Application Update', 'This application has an update, reload?',
            function (choice) {
                if (choice === 'yes') {
                    window.location.reload();
                }
            }
        );
    }
});
