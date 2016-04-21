# emergence-console

This [Ext JS 6 Classic](http://docs.sencha.com/extjs/6.0/) app provides a user interface for managing Emergence hosts and sites.

## Getting started with development
1. [Install latest 6.x Sencha CMD](https://www.sencha.com/products/extjs/cmd-download/)
2. `git clone --recursive -b develop git@github.com:JarvusInnovations/emergence-console.git`
3. `cd emergence-console/sencha-workspace/EmergenceConsole`
4. `sencha app build`

If you have a version of GIT older than 1.6, get a newer version of git.

Then run a web server from `emergence-console/sencha-workspace` or higher in your file tree and navigate to the
`sencha-workspace/EmergenceConsole` folder in your browser. If you don't have a server you can run `sencha web start`
to run a basic local server at [http://localhost:1841](http://localhost:1841).

## Connecting to a server
You can connect EmergenceConsole to any remote data instance that has CORS enabled by appending the query
parameter `apiHost` when loading the page.
