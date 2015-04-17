/*jslint vars: true, plusplus: true, devel: true, nomen: true, regexp: true, indent: 4, maxerr: 50 */
/*global define, $, brackets, window */

/** Simple extension that adds a "File > Hello World" menu item */
define(function (require, exports, module) {
    "use strict";

    var CommandManager = brackets.getModule("command/CommandManager"),
        EditorManager  = brackets.getModule("editor/EditorManager"),
        Menus = brackets.getModule("command/Menus"),
        ExtensionManager = brackets.getModule("extensibility/ExtensionManager"),
        ExtensionManagerViewModel = brackets.getModule("extensibility/ExtensionManagerViewModel");
    


    // Function to run when the menu item is clicked
    function handleHelloWorld() {
        var editor = EditorManager.getFocusedEditor();
        if (editor) {
            var insertionPos = editor.getCursorPos();
            //editor.document.replaceRange('hello world!', insertionPos);
        }
        // when brackets is loaded, ExtensionManager.extensions is populated with intalled and default extensions
        // InstalledViewModel filters that list to remove default extensions
        // ExtensionManager.downloadRegistry() downloads the whole registry
//       ExtensionManager.downloadRegistry().done(function(){console.dir(ExtensionManager.extensions);});
        var em = new ExtensionManagerViewModel.InstalledViewModel();
       
        em.initialize().done(function () {
            console.dir(em);
        })
        
        // filterSet
        // sortedFullSet
    }


    // First, register a command - a UI-less object associating an id to a handler
    var MY_COMMAND_ID = "helloworld.sayhello";   // package-style naming to avoid collisions
    CommandManager.register("Hello World", MY_COMMAND_ID, handleHelloWorld);

    // Then create a menu item bound to the command
    // The label of the menu item is the name we gave the command (see above)
    var menu = Menus.getMenu(Menus.AppMenuBar.FILE_MENU);
   // menu.addMenuItem(MY_COMMAND_ID);

    // We could also add a key binding at the same time:
    menu.addMenuItem(MY_COMMAND_ID, "Ctrl-Alt-M");
    // (Note: "Ctrl" is automatically mapped to "Cmd" on Mac)
});
