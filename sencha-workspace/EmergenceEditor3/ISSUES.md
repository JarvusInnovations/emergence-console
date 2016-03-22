# Known Issues

## ExtJS client
- diff logic needs to be migrated to its own controller, loading code needs to be removed from view
- ACE editor needs to be dumbed down to a generic ExtJS wrapper view.
  - Almost everything else should be in the Editor controller, under handlers that react to appropriate state changes and events
  - MIME-type handling logic needs to be moved to an app util singleton so that other plugins/editors can utilize it to pick icons and such.
  - The only mime-type handling that should remain in the ACE editor view is mapping it to an ACE mode, IF there is no functionality built into ACE for this anywhere
- MERGE TOOL

# TODO

## Research other JS diff implementations:
- https://code.google.com/p/google-diff-match-patch/

## Finishing implementing search by file-type
## Move search results out of store, allow multiple tabs with different search results

## Display 'no difference' if a diff is opened for identical files

## Fixed
- js errors when a tab's load callback fires after it has been closed