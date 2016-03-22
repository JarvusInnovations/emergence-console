/*jslint browser: true ,undef: true ,white: false ,laxbreak: true *//*global Ext*/
Ext.define('EmergenceEditor2.view.Menubar', {
    extend: 'Ext.toolbar.Toolbar'
    ,xtype: 'emergenceeditor-menubar'
    
    ,items: [
        {
            text: 'Emergence'
            ,icon: 'http://emr.ge/img/logo-16.png'
            ,menu: [
                {
                    text: 'About Emergence'
                    ,href: 'http://emr.ge'
                    ,hrefTarget: '_blank'
                    ,icon: 'http://emr.ge/img/logo-16.png'
                }
                ,{
                    xtype: 'menuseparator'
                }
                ,{
                    text: 'Import'
                    ,action: 'import'
                    ,icon: '/img/icons/fugue/inbox-download.png'
                }
                ,{
                    text: 'Export'
                    ,action: 'export'
                    ,icon: '/img/icons/fugue/inbox-upload.png'
                    ,href: '/editor/export'
                }
                ,{
                    xtype: 'menuseparator'
                }
                ,{
                    text: 'Site Tools'
                    ,action: 'site-tools'
                    ,icon: '/img/icons/fugue/gear.png'
                }
            ]
        }
        ,{
            text: 'File'
            ,menu: [
                /*{
                    text: 'New'
                    ,icon: '/img/icons/fugue/blue-document.png'
                }
                ,{
                    text: 'New Tab'
                }
                ,{
                    text: 'New Window'
                }
                ,{
                    xtype: 'menuseparator'
                }
                ,{
                    text: 'Close Current Tab'
                }
                ,*/{
                    text: 'Save'
                    ,icon: '/img/icons/fugue/disk-black.png'
                    ,action: 'save'
                }
                /*,{
                    text: 'Save As'
                }*/
            ]
        }
        ,{
            text: 'Edit'
            ,menu: [
                /*{
                    text: 'Cut'
                    ,icon: '/img/icons/fugue/scissors-blue.png'
                }
                ,{
                    text: 'Copy'
                    ,icon: '/img/icons/fugue/blue-document-copy.png'
                }
                ,{
                    text: 'Paste'
                    ,icon: '/img/icons/fugue/clipboard-paste-document-text.png'
                }
                ,{
                    xtype: 'menuseparator'
                }
                ,*/{
                    text: 'Find'
                    ,icon: '/img/icons/fugue/binocular.png'
                    ,action: 'find'
                }
                ,{
                    text: 'Replace'
                    ,icon: '/img/icons/fugue/edit-replace.png'
                    ,action: 'replace'
                }
            ]
        }
//      ,{
//          text: 'View'
//          ,disabled: true
//      }
        ,{
            text: 'Theme'
            ,menu:[{
                xtype: 'menuseparator'
//              ,text: 'Light'               TODO Cannot specify text on menu separator, but would be nice to find a way to seperate the mneu into light and dark sections
            },{
                text: 'Chrome'
                ,action: 'change-theme'
            },{
                text: 'Clouds'
                ,action: 'change-theme'
            },{
                xtype: 'menuseparator'
//              ,text: 'Dark'                TODO Cannot specify text on menu separator, but would be nice to find a way to seperate the mneu into light and dark sections
            },{
                text: 'Ambiance'
                ,action: 'change-theme'
            },{
                text: 'Chaos'
                ,action: 'change-theme'
            }]
        }
        ,{
            text: 'Help'
            ,menu: {
                plain: true
                ,items: [
                    {
                        text: 'Emergence Homepage'
                        //,plain: true
                        ,href: 'http://emr.ge'
                        ,hrefTarget: '_blank'
                        ,icon: 'http://emr.ge/img/logo-16.png'
                    }
                    ,{
                        xtype: 'menuseparator'
                    }
                    ,{
                        xtype: 'textfield'
                        ,inputType: 'search'
                        ,action: 'help-lookup'
                        ,emptyText: 'Lookup Class'
                    }
                    ,{
                        xtype: 'menuseparator'
                    }
                    ,{
                        text: 'Getting Started with an External Client on OS X'
                        ,href: 'http://emr.ge/manual/getting_started_osx'
                        ,hrefTarget: '_blank'
                    }
                    ,{
                        text: 'Getting Started with an External Client on Windows'
                        ,href: 'http://emr.ge/manual/getting_started_win'
                        ,hrefTarget: '_blank'
                    }
                    ,{
                        text: 'Working with Models'
                        ,href: 'http://emr.ge/manual/models'
                        ,hrefTarget: '_blank'
                    }
                    ,{
                        text: 'Mapping Links with Controllers'
                        ,href: 'http://emr.ge/manual/controllers'
                        ,hrefTarget: '_blank'
                    }
                    ,{
                        text: 'Views: Using the Template System'
                        ,href: 'http://emr.ge/manual/views'
                        ,hrefTarget: '_blank'
                    }
                ]
            }
        }
        ,'->'
        ,{
             xtype: 'textfield'
             ,name: 'globalSearch'
             ,hideLabel: true
             ,width: 200
             ,enableKeyEvents: true
             ,emptyText: 'search files...'
        },{
            xtype: 'checkboxfield'
            ,name: 'useRegex'
            ,boxLabel  : 'Regex?'
        },{
            xtype: 'combobox'
            ,name: 'fileTypes'
        }
        ,{
            xtype: 'button'
            ,text: 'Search'
        }
//      ,{
//          xtype: 'tbtext'
//          ,text: '<a href="http://emr.ge" target="_blank">emergence</a>'
//      }
    ]
});
