/*
    This file is generated and updated by Sencha Cmd. You can edit this file as
    needed for your application, but these edits will have to be merged by
    Sencha Cmd when upgrading.
*/

// DO NOT DELETE - this directive is required for Sencha Cmd packages to work.
//@require @packageOverrides

Ext.application({
    name: 'EmergenceEditor2',
    extend: 'EmergenceEditor2.Application',
    requires: [
        'Jarvus.patch.NamespacedXmlRoot',
        'Jarvus.ext.override.app.PushPath'
    ],
    
    launch: function() {
        // remove loading class
        Ext.getBody().removeCls('loading');
    }
});