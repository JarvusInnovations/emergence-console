# Emergence Editor Plugins

## Planned plugins
* Sencha CMD build tools
* PHP log viewer
* Web server log viewer
* User manager
* PMA-like database editor with /table_manager incorporated
* Pull tool
* Push tool
* Git integration

## Hooks
Plugins must be able to hook into the editor interface in one or more of the following ways:

* Add items to menubar (somewhere? everywhere?)
* Add items to file context menu with the ability to filter applicable files with an arbitrary true/false function
  * Same additional items should be available when right-clicking an open tab header
* Handle prefixed routes
* Application-level events
* Content-type based hooks for preview plugin -- plugins that use other plugins somehow?

## Other ideas
* Editors/previewers as content-type plugin