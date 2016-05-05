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
                ':path': "([^\0]+)"
            }
        }
    },

    control: {
        'files-sourcestreepanel': {
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
        },
        'files-foldercontextmenu menuitem[action="newfile"]': {
            click: 'onFolderNewFileClick'
        },
        'files-foldercontextmenu menuitem[action="newfolder"]': {
            click: 'onFolderNewFolderClick'
        },
        'files-foldercontextmenu menuitem[action="rename"]': {
            click: 'onFolderRenameClick'
        },
        'files-foldercontextmenu menuitem[action="refresh"]': {
            click: 'onFolderRefreshClick'
        },
        'files-foldercontextmenu menuitem[action="delete"]': {
            click: 'onFolderDeleteClick'
        },
        'files-filecontextmenu menuitem[action="open"]': {
            click: 'onFileOpenClick'
        },
        'files-filecontextmenu menuitem[action="properties"]': {
            click: 'onFilePropertiesClick'
        },
        'files-filecontextmenu menuitem[action="rename"]': {
            click: 'onFileRenameClick'
        },
        'files-filecontextmenu menuitem[action="delete"]': {
            click: 'onFileDeleteClick'
        }
    },


    // controller configuration
    stores: [
        'files.Sources'
    ],

    views: [
        'files.Container',
        'files.OpenFilesGrid',
        'files.SourcesTreePanel',
        'files.EditorContainer',
        'files.EditorToolbar',
        'files.Settings',
        'files.FolderContextMenu',
        'files.FileContextMenu',
        'files.FilePropertiesWindow'
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
        'sourcesTreePanel': 'files-sourcestreepanel',
        'editorContainer': 'files-editorcontainer',
        'settings' : {
            selector: 'files-settings',
            xtype: 'files-settings',
            autoCreate: true
        },
        'folderMenu' : {
            selector: 'files-foldercontextmenu',
            xtype: 'files-foldercontextmenu',
            autoCreate: true
        },
        'fileMenu' : {
            selector: 'files-filecontextmenu',
            xtype: 'files-filecontextmenu',
            autoCreate: true
        },
        'propertiesWindow' : {
            selector: 'files-propertieswindow',
            xtype: 'files-propertieswindow',
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
        this.closeFile(rec.get('path'));
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
            settings = me.getSettings(),
            el,x,y;

        if (settings.isVisible()) {
            settings.close(tool);
        } else {
            // Would rather use showBy with offsets here, but it's buggy on combo trigger
            el = tool.getEl();
            x = el.getX()-settings.width+el.getWidth();
            y = el.getY()+el.getHeight();
            settings.showAt(x,y);

        }
    },

    onSourcesGridContextClick: function(view,rec,item,index,e) {
        var me = this,
            type = rec.get('Class'),
            menu;

        e.preventDefault();

        if (type == 'SiteCollection') {
            menu = me.getFolderMenu();
        } else if (type == 'SiteFile') {
            menu = me.getFileMenu();
        }

        if (menu) {
            menu.setRec(rec);
            menu.showAt(e.getXY());
        }
    },

    onFolderNewFileClick: function(item) {
        var me = this,
            rec = item.up('menu').getRec(),
            path = rec.get('FullPath'),
            cb;

        cb = function(node) {
            me.refreshNode(path);
            // TODO: Debug/test/fix file loading after creation
            me.openFile(node);
        };

        Ext.Msg.prompt('New File', 'Provide a new name:', function(button, value) {
            if (button == 'ok' && !Ext.isEmpty(value)) {
                var newNode = rec.get('FullPath') + '/' + value;
                EmergenceConsole.proxy.WebDavAPI.createNode(newNode,cb);
            }
        },me);
    },

    onFolderNewFolderClick: function(item) {
        var me = this,
            rec = item.up('menu').getRec(),
            path = rec.get('FullPath'),
            cb;

        cb = function() {
            me.refreshNode(path);
        };

        Ext.Msg.prompt('New File', 'Provide a new name:', function(button, value) {
            if (button == 'ok' && !Ext.isEmpty(value)) {
                var newCollection = rec.get('FullPath') + '/' + value;
                EmergenceConsole.proxy.WebDavAPI.createCollection(newCollection,cb);
            }
        },me);
    },

    onFolderRenameClick: function(item) {
        var me = this,
            rec = item.up('menu').getRec(),
            path = rec.get('FullPath'),
            cb;

        cb = function() {
            me.refreshParentNode(path);
        };

        Ext.Msg.prompt('Rename '+rec.get('Handle'), 'Provide a new name:', function(button, value) {
            if (button == 'ok' && !Ext.isEmpty(value)) {
                var newPath = rec.parentNode.get('FullPath') + '/' + value;
                EmergenceConsole.proxy.WebDavAPI.renameNode(path,newPath,cb);
            }
        },me,false,rec.get('Handle'));
    },

    onFolderRefreshClick: function(item) {
        var rec = item.up('menu').getRec(),
            path = rec.get('FullPath');

        this.refreshNode(path);
    },

    onFolderDeleteClick: function(item) {
        var me = this,
            rec = item.up('menu').getRec();

        Ext.Msg.confirm('Delete Folder', 'Are you sure you want to delete '+rec.get('Handle'), function(buttonId) {
            if (buttonId == 'yes') {
                me.deleteFolder(rec.get('FullPath'));
            }
        },me);
    },

    onFileOpenClick: function(item) {
        var rec = item.up('menu').getRec();

        this.redirectTo('sites/files/' + rec.get('FullPath'));
    },

    onFilePropertiesClick: function(item) {
        var rec = item.up('menu').getRec(),
            win = this.getPropertiesWindow();

        win.setTitle(rec.get('Handle'));
        win.down('panel#content').update(rec);
        win.show();
    },

    onFileRenameClick: function(item) {
        var me = this,
            rec = item.up('menu').getRec(),
            path = rec.get('FullPath'),
            cb;

        cb = function() {
            me.refreshParentNode(path);
        };

        Ext.Msg.prompt('Rename '+rec.get('Handle'), 'Provide a new name:', function(button, value) {
            if (button == 'ok' && !Ext.isEmpty(value)) {
                var newPath = rec.parentNode.get('FullPath') + '/' + value;
                EmergenceConsole.proxy.WebDavAPI.renameNode(path,newPath,cb);
            }
        },me,false,rec.get('Handle'));

    },

    onFileDeleteClick: function(item) {
        var me = this,
            rec = item.up('menu').getRec();

        Ext.Msg.confirm('Delete File', 'Are you sure you want to delete '+rec.get('Handle'), function(buttonId) {
            if (buttonId == 'yes') {
                me.deleteFile(rec.get('FullPath'));
            }
        },me);
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

    closeFile: function(path) {
        var me = this,
            editorContainer = me.getEditorContainer(),
            openFilesStore =  me.getOpenFilesGrid().getStore(),
            idx = openFilesStore.find('path',path),
            rec = openFilesStore.getAt(idx),
            editor;

        if (rec) {
            openFilesStore.remove(rec);
            editor = editorContainer.items.get(rec.get('editorId'));
        }

        if (editor) {
            editorContainer.remove(editor);
        }

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

    deleteFile: function(path) {
        var me = this,
            cb = function(options,success) {
                if (success) {
                    me.closeFile(path);
                    me.refreshParentNode(path);
                } else {
                    me.displayError({
                        name: 'File Deletion Error',
                        message: 'The file could not be deleted'
                    });
                }
            };

        EmergenceConsole.proxy.WebDavAPI.deleteNode(path,cb);
    },

    deleteFolder: function(path) {
        var me = this,
            cb = function(options,success) {
                if (success) {
                    me.refreshParentNode(path);
                } else {
                    me.displayError({
                        name: 'Folder Deletion Error',
                        message: 'The folder could not be deleted'
                    });
                }
            };

        EmergenceConsole.proxy.WebDavAPI.deleteNode(path,cb);
    },

    refreshParentNode: function(path) {
        var store = this.getSourcesTreePanel().getStore();
            idx = store.find('FullPath',path),
            rec = store.getAt(idx),
            parentIdx = store.find('FullPath',rec.get('parentId')),
            parentRec = store.getAt(parentIdx);

        store.load({
            node: parentRec,
            callback: function() {
                parentRec.expand();
            }
        });
    },

    refreshNode: function(path,expand) {
        var store = this.getSourcesTreePanel().getStore();
            idx = store.find('FullPath',path),
            rec = store.getAt(idx);

        store.load({
            node: rec,
            callback: function() {
                if (expand) {
                    rec.expand();
                }
            }
        });
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
