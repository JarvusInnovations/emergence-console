/*jslint browser: true, undef: true, white: false, laxbreak: true *//*global Ext, EmergenceEditor2, ace*/
Ext.define('EmergenceEditor2.view.editor.ACE', {
    extend: 'Ext.Panel'
    ,xtype: 'aceeditor'


    ,stateful: true
    ,stateId: 'aceeditor'
    ,stateEvents: ['updateacetheme']
    ,config: {
        aceTheme: "clouds"
        ,revisionID: null
        ,isRevision: false
        ,viewingLatest: true
    }
    

    ,initComponent: function() {
        var me = this;
        
        //TODO should this be moved to config? - KBC
//      this.itemId = this.itemId;
        
        //this.isRevision = false;
        
        
        //TODO every editor instance should have a revisionID, need a better way to distingish if the editor is viewing a previous version - KBC
//        if(this.revisionID)
//        {
//            this.isRevision = true;
//            this.itemId = 'revision:[' + this.revisionID + ']/'+this.path;
//        }
//        else
//        {
//            this.itemId = '/' + this.path;   
//        }
        
        me.tabConfig = {
            icon: me.getIcon()
        };
        
        me.callParent(arguments);
    }
    ,afterRender: function() {
        this.callParent(arguments);
        
        //TODO is delay needed? - KBC
        if(EmergenceEditor2.app.aceReady)
            Ext.defer(this.initEditor, 10, this);
        else
            EmergenceEditor2.app.on('aceReady', this.initEditor, this, {single: true, delay: 10});
            
        EmergenceEditor2.app.on('aceThemeChanged', this.doChangeTheme, this);
    }
    ,initEditor: function() {
        
        // create ACE editor instance
        this.aceEditor = ace.edit(this.el.down('div').id);
        
        this.onResize();
        
        // configure editor
        this.aceEditor.setShowPrintMargin(false);
        this.aceEditor.getSession().setTabSize(4);
        this.aceEditor.getSession().setUseSoftTabs(false);
                
        if(this.aceTheme) {
            this.doChangeTheme(this.aceTheme); 
        }
            
        // listen for changes to mark dirty
        this.aceEditor.getSession().on('change', Ext.bind(this.onEditorChange, this));
        
        // listen for undos to validate dirty state
        Ext.Function.interceptAfter(this.aceEditor.getSession().getUndoManager(), 'undo', Ext.bind(this.onEditorUndo, this));
        
        // disable built in find dialog
        this.aceEditor.commands.removeCommand('find');
        
        // load file if one was provided via path config
//      if(this.path)
//          this.loadFile();
        
        this.on('resize', this.onResize, this);
        
        this.fireEvent('aceready', this, this.aceEditor);
    }
    
    ,loadFile: function(file) {
        var me = this
            ,mode = me.getFileMode(file.contentType);
            
        me.loadedFile = file;
        
        if(!me.aceEditor) {
            console.warn('deferring loadFile for aceready');
            me.setLoading('Waiting for ACE&hellip;');
            me.on('aceready', function() {
                me.setLoading(false);
                me.loadFile(file);
            }, me, {single: true});
            return;
        }
        
        // set editor mode
        if(mode) {
            me.aceEditor.getSession().setMode("ace/mode/" + mode);
        }
        
        // set editor content
        me.setValue(file.body);
        
        //TODO Should be moved to controller to allow ACE editor to be used for file diffs
        me.loadedValue = file.body;
        me.fireEvent('fileload', me, file, mode);
    }
    
    ,getCurrentFile: function() {
        var me = this;
        return me.queuedFile || me.loadingFile || me.loadedFile;
    }
    
    
    
    ,setSplit: function(value) {
        var sp = this.split;
        if (value == "none") {
            if (sp.getSplits() === 2) {
                secondSession = sp.getEditor(1).session;
            }
            sp.setSplits(1);
        } else {
            var newEditor = (sp.getSplits() == 1);
            if (value == "below") {
                sp.setOriantation(sp.BELOW);
            } else {
                sp.setOriantation(sp.BESIDE);
            }
            sp.setSplits(2);

            if (newEditor) {
                var session = this.secondSession || sp.getEditor(0).session;
                var newSession = sp.setSession(session, 1);
                newSession.name = session.name;
            }
        }      
    }
    ,onResize: function() {
        if(this.aceEditor) {
			this.aceEditor.resize();
        }
    }
    //TODO Should be moved to controller to allow ACE editor to be used for file diffs
    ,onEditorChange: function() {
    
        if((this.loadedValue || this.loadedValue === '') && this.loadedValue != this.getValue() && !this.fileDirty)
        {
            this.fileDirty = true;
            this.tab.setText(this.tab.text+'*');
        }
    }
    
    ,onEditorUndo: function() {
        if(this.fileDirty && this.loadedValue == this.getValue())
        {
            this.fileDirty = false;
            this.tab.setText(this.tab.text.substr(0, this.tab.text.length-1));
        }
    }


//  ,loadFile: function(path) {
//  
//      if(path)
//          this.path = path;
//            
//        this.setLoading({msg: 'Opening /' + this.path}); // enable loading mask
//       
//        if(this.isRevision)
//          EmergenceEditor2.API.getRevision(this.path, this.revisionID, this.afterLoadFile, this);
//        else 
//          EmergenceEditor2.API.getFile(this.path, this.afterLoadFile, this);
//  }
//  ,afterLoadFile: function(response) {
//      console.log('ACE: afterLoadFile', response);
//        this.setRevisionID(response.getResponseHeader('X-VFS-ID'));
//        this.contentType = response.getResponseHeader('Content-Type');
//        
//        // set tab icon
//        this.tab.setIcon(this.getIcon(this.contentType)); 
//
//        // set editor mode
//        var mode = this.getFileMode(this.contentType);
//        if(mode) {
//          this.aceEditor.getSession().setMode("ace/mode/" + mode);
//        }
//        
//        // set editor content
//        this.setValue(response.responseText);
//        
//        this.scanCode(mode,response.responseText);
//        
//        // set line
//        this.aceEditor.gotoLine(this.initialLine);
//        
//        // clear loading  mask
//        this.setLoading(false);
//                    
//        EmergenceEditor2.app.fireEvent('afterloadfile', this, this.getRevisionID(), response);
//    }
    ,saveFile: function() {
        this.tab.setIcon('/img/loaders/spinner.gif');
        //Check server revision has not changed before uploading file
        EmergenceEditor2.API.getFile(this.itemId, this.checkServerVersionBeforeSave, this);
    }
    ,checkServerVersionBeforeSave: function(response) {
        if(this.loadedFile.revisionId < response.getResponseHeader('x-vfs-id')) {
            //Show merge screen
            this.tab.setIcon(this.getIcon(this.contentType)); 
            Ext.Msg.alert('Error', 'The server version is newer than the file you are trying to save. Save aborted.');
        }
        else {
            var fileData = this.getValue();
            EmergenceEditor2.API.writeFile('/' + this.itemId, fileData, this.afterSaveFile, this);
        }
    }
    ,afterSaveFile: function(response) {
		var me = this;

        if(me.fileDirty)
        {
            me.fileDirty = false;
            me.tab.setText(this.tab.text.substr(0, this.tab.text.length-1));
        }        
		//TODO Should be moved to controller to allow ACE editor to be used for file diffs
		me.loadedValue = response.request.options.params;
        
        me.tab.setIcon(me.getIcon(me.contentType)); 
        
        me.loadedFile.revisionId = response.getResponseHeader('x-vfs-id');
    } 
    ,getValue: function() {
        return this.aceEditor.getSession().getValue();
    }
    
    ,setValue: function(value) {
        this.aceEditor.getSession().setValue(value);
        
        //TODO Should be moved to controller to allow ACE editor to be used for file diffs
		this.loadedValue = value; // store original text for dirty tracking
        return true;
    }
    
    
    ,getFileMode: function(mimeType) {
        switch(mimeType)
        {
            //TODO add sass and coffee support - KBC
            case 'application/javascript':
                return 'javascript';
                
            case 'application/php':
                return 'php';
                
            case 'text/html':
            case 'text/x-c++':
            case 'text/plain':
                return 'html';
            
            case 'text/css':
                return 'css';
                
            default:
                return false;
        }   
    }
    ,getIcon: function(mimeType)
    {
        switch(mimeType)
        {
            case 'application/javascript':
                return '/img/icons/fugue/blue-document-text.png';
                
            case 'application/php':
                return '/img/icons/fugue/blue-document-php.png';
                
            case 'text/html':
            case 'text/x-c++':
            case 'text/plain':
                return '/img/icons/fugue/blue-document-text.png';
            
            case 'text/css':
                return '/img/icons/fugue/blue-document-text.png';
                
            default:
                return '/img/icons/fugue/blue-document.png';
        }
    }
    ,scanCode: function(mime,code) {
        switch(mime)
        {
            //TODO add sass and coffee support - KBC
            case 'application/javascript':
                return this.scanJS(code);
                
            case 'application/php':
                return this.scanPHP(code);
                
            default:
                return false;
        }
    }
    ,scanJS: function(code) {
        parse(code);
    }
    ,scanPHP: function(code) {
        
    }
    ,doChangeTheme: function(theme) {
        this.setAceTheme(theme);
        this.fireEvent('updateacetheme');
        this.aceEditor.setTheme("ace/theme/" + theme);
    }
    ,getState: function() {
        return {aceTheme: this.getAceTheme()};
    }
});
