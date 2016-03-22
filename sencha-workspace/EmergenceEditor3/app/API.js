/*jslint browser: true ,undef: true ,white: false ,laxbreak: true *//*global Ext*/
Ext.define('EmergenceEditor3.API', {
	extend: 'Jarvus.util.EmergenceAPI'
	,singleton: true
	
	
	,config: {
		davRoot: '/develop'
	}

	
	,getFile: function(path, revisionId, callback, scope) {
		var headers = {};

		if(Ext.isFunction(revisionId)) {
			scope = callback;
			callback = revisionId;
		}
		
		if(revisionId) {
			headers['X-Revision-ID'] = revisionId;
		}
		
		// normalize path
		if(Ext.isArray(path)) {
			path = path.join('/');
		}

		if(path.charAt(0) != '/') {
			path = '/' + path;
		}
		
		return this.request({
			method: 'GET'
			,url: this.getDavRoot() + path
			,disableCaching: false
			,decodeJson: false
			,headers: headers
			,task: 'get-file'
			,success: callback
			,scope: scope
		});
	}
	
	,putFile: function(path, file, completeCallback, progressCallback, scope) {
		var xhr = new XMLHttpRequest()
			,url = path;
		
		xhr.uniqueID = Ext.id(null, 'xhr');
		
		this.fireEvent('beforefileupload', url, file, xhr);
		
		var progress = function(args, event) {
			
			var percentage = Math.round( (event.loaded / event.total) * 100);
			
			this.fireEvent('fileuploadprogress', percentage, event, url, file, xhr);
			
			progressCallback.call(scope, percentage, event);
		};
		  
		xhr.upload.addEventListener('progress', progress.bind(this,arguments));
		
		xhr.open('PUT',url);
		
		xhr.send(file);
				
		var readStateChange = function() {
			if(xhr.readyState != 4)
			{
				completeCallback.call(scope);
				this.fireEvent('afterfileupload', url, file, xhr);
			}
		};
					 
		xhr.onreadystatechange = readStateChange.bind(this, arguments);
	}
	
	,renameNode: function(path, newPath, callback, scope) {
        return this.request({
            url: path
            ,method: 'MOVE'
            ,headers: {
                Destination: newPath
            }
            ,success: callback
            ,scope: scope   
        });   
    }
    ,deleteNode: function(path,callback,scope) {
        return this.request({
            url: path
            ,method: 'DELETE'
            ,success: callback
            ,scope: scope 
            ,task: 'delete-node'  
        });    
    }
    
	,writeFile: function(path, data, callback, scope) {
		return this.request({
			url: path
			,method: 'PUT'
			,params: data
			,success: callback
			,scope: scope
            ,task: 'save-file'
		});
	}
	
	,createCollectionNode: function(path, callback, scope) {
        return this.request({
            url: path
            ,method: 'MKCOL'
            ,params: ''
            ,success: callback
            ,scope: scope
            ,task: 'create-folder'
        });       
    }
    
	,createFileNode: function(path, callback, scope) {
        return this.writeFile(path, '', callback, scope);
    }
});