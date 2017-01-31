/**
 * Custom field for setting editor print margin
 */
Ext.define('EmergenceConsole.view.files.AceOptionMarginField', {
    extend: 'Ext.form.field.Text',
    xtype: 'files-aceoptionmarginfield',

    requires: [
        'Jarvus.ace.field.AceOptionFieldBase'
    ],

    mixins: {
        acefield: 'Jarvus.ace.field.AceOptionFieldBase'
    },

    config: {
        option: 'printMarginColumn'
    },

    checkChangeEvents: ['blur'],

    listeners: [{
        'render': function(field) {
            field.displayValue(field.getConfiguration().getOption(field.getOption()));
        },
        'change': function(field, val) {
            field.getConfiguration().setOption(field.getOption(), val);
        }
    }],

    displayValue: function(val) {
        this.setValue(val);
    }

});
