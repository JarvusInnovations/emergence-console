/*jslint browser: true, undef: true *//*global Ext*/
Ext.define('EmergenceConsole.controller.Files', {
    extend: 'Ext.app.Controller',

    requires: [
        'EmergenceConsole.view.files.Editor'
    ],

    // entry points
    routes: {
        'sites/files': 'showFilesView',

        'sites/files/:path': {
            action: 'openFile',
            conditions: {
                //TODO: improve this regex to include more valid characters
                ':path': "([0-9a-zA-Z\/.-]+)"
            }
        }
    },

    control: {
        'files-sources': {
            itemdblclick: 'onSourcesItemDblClick'
        }
    },

    // controller configuration
    stores: [
        'files.Sources',
        'files.FileRefs'
    ],

    views: [
        'files.Container',
        'files.OpenFilesGrid',
        'files.Sources'
    ],

    refs: {
        'appViewport': 'app-viewport',
        'sitesContainer': 'sites-container',
        'sitesContent': 'sites-container > #content',

        'filesContainer': {
            selector: 'files-container',
            xtype: 'files-container',
            forceCreate: true
        },

        'editorContainer' : 'container#editor-container'
    },

    // route handlers
    showFilesView: function() {
        var me = this;

        me.getAppViewport().getLayout().setActiveItem(me.getSitesContainer());
        me.getSitesContent().setActiveItem(me.getFilesContainer());
    },

    onSourcesItemDblClick: function(view, rec) {

        if (rec.get('Class')=='SiteFile') {
            this.redirectTo('sites/files/' + rec.get('FullPath'));
        }

    },

    // custom controller methods
    openFile: function(path) {
        //TODO handle this better - temp code
        //this.showFilesView();

        var me = this,
            editorContainer = this.getEditorContainer(),
            editor = editorContainer.down('{hasPath("'+path+'")}'),
            cb = Ext.bind(me.openFileCallback,me);

        if (editor) {
            editorContainer.getLayout().setActiveItem(editor);
        } else {
            EmergenceConsole.proxy.WebDavAPI.getFile(path,cb);
        }
    },

    openFileCallback: function(path,text,contentType) {
        var me = this,
            editorContainer = this.getEditorContainer(),
            editor = Ext.create('EmergenceConsole.view.files.Editor',{
                path: path
            }),
            ref = Ext.create('EmergenceConsole.model.file.FileRef', {
                fileName: path.substring(path.lastIndexOf('/') + 1),
                filePath: path,
                editorId: editor.id
            });

        editorContainer.add(editor);
        editor.loadFile(text,contentType);
        editorContainer.getLayout().setActiveItem(editor);

        me.getFilesFileRefsStore().add(ref);

    }
});
