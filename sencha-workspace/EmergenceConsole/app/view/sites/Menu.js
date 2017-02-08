Ext.define('EmergenceConsole.view.sites.Menu', {
    extend: 'Ext.toolbar.Toolbar',
    xtype: 'sites-menu',

    mixins: [
        'Ext.state.Stateful'
    ],

    stateful: true,
    stateId: 'sites-menu',
    stateEvents: ['changeexpanded'],

    config: {
        expanded: true
    },

    defaults: {
        xtype: 'button',
        scale: 'small',
        iconAlign: 'top'
    },

    items: [{
        text: 'Changes',
        iconCls: 'x-fa fa-area-chart',
        route: 'sites/changes'
    }, {
        text: 'Files',
        iconCls: 'x-fa fa-files-o',
        route: 'sites/files'
    }, {
        text: 'Sources',
        iconCls: 'x-fa fa-cloud-download'
    }, {
        text: 'Shell',
        iconCls: 'x-fa fa-square'
    }, {
        text: 'Docs',
        iconCls: 'x-fa fa-info-circle',
        route: 'sites/docs'
    }, '->', {
        itemId: 'toggleexpanded',
        iconCls: 'x-fa fa-long-arrow-left',
        iconClsExpanded: 'x-fa fa-long-arrow-left',
        iconClsCollapsed: 'x-fa fa-long-arrow-right'
    }],

    // @private
    getState: function() {
        return { expanded: this.getExpanded() };
    },

    // @private
    applyState: function(state) {
        if (state && state.hasOwnProperty('expanded')) {
            this.setExpanded(state.expanded);
        }
    }

});
