/*jslint browser: true, undef: true, white: false, laxbreak: true *//*global Ext*/

/**
 * @class EmergenceEditor3.app
 * @extends Ext.app.Application
 * @singleton
 * 
 * This is the entry-point for the application. The framework's {@link Ext#application} method loads MVC requirements and then
 * creates an instance of the configured {@link Ext.app.Application}.
 * 
 * The application instance also serves as a bus for some global events, which may be fired from anywhere in the application.
 */
 
/**
 * @event viewportready
 * Fired by {@link SlateDesktop.controller.Main} after the {@link SlateDesktop.view.Viewport} instance has been created.
 * @param {SlateDesktop.view.Viewport} viewport
 */ 
 
/**
 * @event log
 * Fired by {@link #method-log}
 * @param {String} message
 * @param {String} url
 */
 
/**
 * @event error
 * Fired by {@link #method-error}
 * @param {String} title
 * @param {String} message
 * @param {Object} data Arbitrary data that may have been attached to the error
 */
 Ext.application({
	requires: [
		'Ext.window.MessageBox'
		,'Jarvus.patch.NamespacedXmlRoot'
		,'Jarvus.ext.override.app.PushPath'
	]
	
	,name: 'EmergenceEditor3'
	
	,controllers: [
		'Viewport'
		,'Activity'
		,'Filesystem'
		,'Transfers'
		,'Editor'
		,'Revisions'
		,'Search'
		
		// plugins
		,'EmergenceEditor3.plugin.diff.Controller'
	]
	
	,launch: function() {
		// remove loading class
		Ext.getBody().removeCls('loading');
	}
	
	/**
	 * Fires app-wide signal that the user has selected a file
	 */
	,selectFilePath: function(filePath, lineNo, revisionId) {
		
		// ensure leading /
		if(filePath.charAt(0) != '/') {
			filePath = '/' + filePath;
		}
		
		this.fireEvent('filepathselect', filePath, lineNo, revisionId);
	}
	
	/**
	 * Fires app-wide signal that the user has selected a command
	 */
	,selectCommand: function(commandName, commandObject) {
		this.fireEvent('commandselect', commandName, commandObject);
	}
	
	
	// Global utility methods
	/**
	 * Display an application-themed confirmation dialog.
	 * @param {String} title Short title for the dialog
	 * @param {String} message Main text for the dialog
	 * @param {function(isConfirmed)} callback
	 * @param {Object} scope
	 */
	,confirm: function(title, message, callback, scope) {
		return Ext.callback(callback, scope, [window.confirm(title+":\n\n"+message)]);
	}
	
	/**
	 * Display an application-themed alert dialog.
	 * @param {String} title Short title for the dialog
	 * @param {String} message Main text for the dialog
	 */
	,alert: function(title, message) {
		
		if(window.console) {
			window.console.info('App alert - %s: %s', title, message);
		}
		
		return Ext.Msg.alert(title+":\n\n"+message);
	}
	
	/**
	 * Log an error
	 * @param {String} message An error message
	 * @param {Object} [data=null] Some arbitrary data to attach to the error
	 */
	,error: function() {
		
		var title = 'Error'
			,message = 'There was an unknown problem, please try again later'
			,data = {};
			
		if(arguments.length == 1) {
			message = arguments[0];
		}
		else if(arguments.length == 2) {
			if(Ext.isString(arguments[1])) {
				title = arguments[0];
				message = arguments[1];
			}
			else {
				message = arguments[0];
				data = arguments[1];
			}
		}
		else if(arguments.length >= 3) {
			title = arguments[0];
			message = arguments[1];
			data = arguments[2];
		}
		
		if(window.console) {
			window.console.error('App error: '+message, data);
		}
		
		this.fireEvent('error', title, message, data);
		
		return Ext.Msg.alert(title, message);
	}
	
	/**
	 * Log an interesting event
	 * @param {String} message An arbitrary message
	 * @param {String} [url=Ext.util.History.getToken()] The location of the event
	 */
	,log: function(message, url) {
		url = url || '#'+Ext.util.History.getToken();
		
		this.fireEvent('log', message, url);
	}
	// todo: make this ask the tab for the title and moving this to ontabchange 
	,setActiveView: function(token, title) {
		console.groupCollapsed('app.setActiveView(%o, %o)', token, title);
		console.trace();
		console.groupEnd();
//		Ext.util.History.add(token, true);
//		this.titleDom.innerHTML = title + " - " + location.hostname;
	}
});
