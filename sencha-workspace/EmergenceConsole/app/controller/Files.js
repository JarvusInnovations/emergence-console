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
                //':path': "([0-9a-zA-Z\/.-]+)"
                ':path': "([^\0]+)"
            }
        }
    },

    control: {
        'files-sources': {
            itemdblclick: 'onSourcesItemDblClick',
            itemcontextmenu: 'onSourcesGridContextClick'
        },
        'files-editortoolbar button[action="settings"]': {
            click: 'onSettingsClick'
        },
        'files-editor': {
            activate: 'onEditorActivate',
 //           optionchange: 'onEditorOptionChange',
            saverequest: 'onEditorSaveRequest',
            editorchange: 'onAceEditorChange',
            editorsessionchangemode: 'onAceModeChange'
        },
        'files-openfilesgrid': {
            select: 'onOpenFilesGridSelect',
            closefileclick: 'onCloseFileClick',
            savefileclick: 'onSaveFileClick'
        }
    },


    // controller configuration
    stores: [
        'files.Sources'
    ],

    views: [
        'files.Container',
        'files.OpenFilesGrid',
        'files.Sources',
        'files.EditorContainer',
        'files.EditorToolbar',
        'files.Settings',
        'files.SourcesContextMenu'
    ],

    refs: {
        'appViewport': 'app-viewport',
        'sitesContainer': 'sites-container',
        'sitesContent': 'sites-container > #content',

        'filesContainer': {
            selector: 'files-container',
            xtype: 'files-container',
            autoCreate: true
        },
        'openFilesGrid': 'files-openfilesgrid',
        'editorContainer': 'files-editorcontainer',
        'settings' : {
            selector: 'files-settings',
            xtype: 'files-settings',
            autoCreate: true
        },
        'sourcesMenu' : {
            selector: 'files-sourcescontextmenu',
            xtype: 'files-sourcescontextmenu',
            autoCreate: true
        }
    },


    // route handlers
    showFilesView: function() {
        var me = this;

        me.getAppViewport().setActiveItem(me.getSitesContainer());
        me.getSitesContent().setActiveItem(me.getFilesContainer());
    },

    onSourcesItemDblClick: function(view, rec) {
        if (rec.get('Class')=='SiteFile') {
            this.redirectTo('sites/files/' + rec.get('FullPath'));
        }
    },


    // event handlers
    // TODO: this shouldn't be necessary, but corrects bug where first editor loses its options.  fixing bug would be better.
    onEditorActivate: function(editor) {
        // refresh options when editor is activated.
        editor.getAce().setOptions(Ext.apply({},editor.getConfiguration().getOptions()));
    },

/*
    onEditorOptionChange: function(editor,key,val) {
        console.log('optionchange: '+key+' set to '+val);
    },
*/

    onSaveFileClick: function(grid, rec) {
        var me = this,
            editor = me.getEditorContainer().items.get(rec.get('editorId'));

        me.saveFile(editor);
    },

    onEditorSaveRequest: function(editor) {
        this.saveFile(editor);
    },

    onCloseFileClick: function(grid, rec) {
        var me = this,
            editorContainer = me.getEditorContainer(),
            openFilesGrid = me.getOpenFilesGrid(),
            openFilesStore = openFilesGrid.getStore();


        if (openFilesStore.getCount()>0) {
            openFilesGrid.getSelectionModel().select(1);
        }


        editorContainer.remove(editorContainer.items.get(rec.get('editorId')));
        openFilesStore.remove(rec);

        this.redirectTo('sites/files');

    },

    onAceEditorChange: function(editor) {
        this.updateOpenFilesDirtyState(editor);
    },

    onAceModeChange: function() {
        //console.log('onAceModeChange');
    },

    onOpenFilesGridSelect: function(grid, rec) {
        this.redirectTo('sites/files/' + rec.get('path'));
    },

    onSettingsClick: function(tool) {
        var me = this,
            settings = me.getSettings();

        if (settings.isVisible()) {
            settings.close(tool);
        } else {
            settings.showBy(tool,'bl',[-settings.width,0]);
        }
    },

    onSourcesGridContextClick: function(view,rec,item,index,e) {
        var me = this,
            menu = me.getSourcesMenu();

        e.preventDefault();

        menu.showAt(e.getXY());
    },

    // custom controller methods
    openFile: function(path) {
        //TODO handle this better - temp code
        this.showFilesView();

        var me = this,
            editorContainer = me.getEditorContainer(),
            openFilesGrid = me.getOpenFilesGrid(),
            openFiles= editorContainer.getOpenFiles(),
            openFilesLength = openFiles.length,
            i=0,
            editor;

        for (; i < openFilesLength; i++) {
            if (openFiles[i].path == path) {
                editor = editorContainer.items.get(openFiles[i].editorId);
            }
        }

        if (editor) {
            openFilesGrid.getSelectionModel().select(
                openFilesGrid.getStore().find('path',path),false,true
            );
            editorContainer.setActiveItem(editor);
        } else {
            EmergenceConsole.proxy.WebDavAPI.getFile(path,Ext.bind(me.openFileCallback,me));
        }
    },

    openFileCallback: function(path,text,contentType) {
        var me = this,
            fileName =  path.substring(path.lastIndexOf('/') + 1),
            editorContainer = me.getEditorContainer(),
            openFilesGrid = me.getOpenFilesGrid(),
            editor = Ext.create('EmergenceConsole.view.files.Editor',{path: path}),
            ref = {
                fileName: fileName,
                path: path,
                editorId: editor.id
            };

        editorContainer.setActiveItem(editor);
        editorContainer.getOpenFiles().push(ref);
        editor.loadFile(text,contentType);

        // add ref to open files grid and select it
        openFilesGrid.getSelectionModel().select(openFilesGrid.getStore().add(ref),false,true);

    },

    saveFile: function(editor) {
        var me = this,
            path = editor.getPath(),
            text = editor.getAce().getValue(),
            cb = function(options,success) {
                if (success) {
                    editor.setOriginalValue(text);
                    me.updateOpenFilesDirtyState(editor);
                } else {
                    me.displayError({
                        name: 'File Save Error',
                        message: 'The file could not be saved'
                    });
                }
            };

        EmergenceConsole.proxy.WebDavAPI.saveFile(path,text,cb);
    },

    updateOpenFilesDirtyState: function(editor) {
        var me = this,
            openFilesStore = me.getOpenFilesGrid().getStore(),
            idx = openFilesStore.find('editorId',editor.id),
            rec = openFilesStore.getAt(idx);

        if (rec) {
            rec.set('dirty',editor.isDirty());
        }
    },

    displayError: function(err) {
        console.warn(err.name+': '+err.message);
    }

});
