# Emergence Editor Routing Scheme

## Why change the existing scheme?
The diff URL uses illegal characters (square brackets) that cause headaches when sharing links in various clients.

The new URL scheme should observe legal characters and provide a standard format for pluggable functionality to add new schemes.

## Usable characters
According to [this stackoverflow question][1]:

### Allowed
	!, $, &, ', (, ), *, +, ,, ;, =, something matching %[0-9a-fA-F]{2}, something matching [a-zA-Z0-9], -, ., _, ~, :, @, /, and ?

### Not allowed
	a raw %, #, ^, [, ], {, }, \, ", < and >

## Example routes

### File routes
	Path to a file in the VFS for opening. Must start with /.
	An @ at the end of the path can specify revision, otherwise the latest is retrieved.
	A $ can optionally address a line number. When combined with @, $ must be used second.

* /sencha-workspace/EmergenceEditor3/ROUTING.md
* /sencha-workspace/EmergenceEditor3/app/app.js
* /sencha-workspace/EmergenceEditor3/app/app.js@1234
* /sencha-workspace/EmergenceEditor3/app/app.js$10
* /sencha-workspace/EmergenceEditor3/app/app.js@1234$10

### Plugin routes

#### diff
	Revision is specified following the `@` symbol. If no revision is specified, it means the latest available revision. If no path is supplied for `after`, the same path provided to `before` is used.

* !diff?before=/sencha-workspace/EmergenceEditor3/ROUTING.md@1234&after=@1235
* !diff?before=/sencha-workspace/EmergenceEditor/ROUTING.md@1233&after=/sencha-workspace/EmergenceEditor3/ROUTING.md@1235
* !diff?before=/sencha-workspace/EmergenceEditor/ROUTING.md&after=/sencha-workspace/EmergenceEditor3/ROUTING.md

#### merge
	Merge works like diff, but has an additional `target` parameter.

* !merge?before=/sencha-workspace/EmergenceEditor/ROUTING.md&after=/sencha-workspace/EmergenceEditor3/ROUTING.md&target=/sencha-workspace/EmergenceEditor3/ROUTING.md

#### preview
	Preview files that can be rendered within the editor (images, markdown)

* !preview/sencha-workspace/EmergenceEditor/ROUTING.md

#### push
	Review and push changes to an inherited layer

#### pull
	Review and pull changes from an inherited layer

#### sencha-app-generate

#### sencha-app-build

#### sencha-theme-generate

#### sencha-theme-build

[1]: http://stackoverflow.com/questions/2849756/list-of-valid-characters-for-the-fragment-identifier-in-an-url

#### search

!search:something?mimeType=application/json&path=/sencha-workspace&layer=parent

