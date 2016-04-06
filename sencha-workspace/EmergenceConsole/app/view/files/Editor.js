/*jslint browser: true, undef: true *//*global Ext*/
Ext.define('EmergenceConsole.view.files.Editor', {
    extend: 'Jarvus.ace.Editor',
    xtype: 'files-editor',

    requires: [
        'EmergenceConsole.view.files.AceConfiguration'
    ],

    config: {
        path: null
    },

    hasPath: function(path) {
        return (this.getPath()==path);
    },

    loadFile: function(text,contentType) {
        var ace = this.getAce();

        if (text) {
            ace.setOption('mode',this.getFileMode(contentType));
            ace.setValue(text,-1);
        }
    },

    getFileMode: function(contentType) {
        switch(contentType)
        {
            case 'application/javascript':
                return 'ace/mode/javascript';

            case 'application/php':
                return 'ace/mode/php';

            case 'text/html':
            case 'text/x-c++':
            case 'text/plain':
                return 'ace/mode/html';

            case 'text/css':
                return 'ace/mode/css';

            case 'text/x-scss':
                return 'ace/mode/scss';

            case 'text/x-dwoo':
            case 'text/x-smarty':
            case 'text/x-html-template':
                return 'ace/mode/html';

            default:
                return false;
        }
    }

});
