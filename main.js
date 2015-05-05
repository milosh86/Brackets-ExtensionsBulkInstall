/*jslint vars: true, plusplus: true, devel: true, nomen: true, regexp: true, indent: 4, maxerr: 50 */
/*global define, $, brackets, window */

/** Simple extension that adds a "File > Hello World" menu item */
define(function (require, exports, module) {
	"use strict";

	var CommandManager = brackets.getModule("command/CommandManager"),
		Menus = brackets.getModule("command/Menus");

	var openF = require('installFromFile');

	// Function to run when the menu item is clicked
	function handleHelloWorld() {
		openF();

		//InstallExtensionDialog.installUsingDialog('http://etf.rs')
		// when brackets is loaded, ExtensionManager.extensions is populated with intalled and default extensions, but after download, em.extensions (also for InstalledViewModel) is a full list of available extensions
		// InstalledViewModel filters that list to remove default extensions
		// ExtensionManager.downloadRegistry() downloads the whole registry
//		ExtensionManager.downloadRegistry().done(function () {
//			console.dir(ExtensionManager.extensions);
//			var em = new ExtensionManagerViewModel.InstalledViewModel();
//
//			em.initialize().done(function () {
//				console.dir(em);
//			})
//		}).fail(function (error) {
//			// extensions download failed
//			console.log('Downlosa failed:');
//			console.log(error);
//		});

//		var extensions = {
//				extensionNameIdL: {
//					registryInfo: {
//						metadata: {
//							name: 'id',
//							title: '',
//							version: ''
//						},
//						owner: '',
//						totalDownloads: 123,
//						versions: [{
//							brackets: ">=1.0.0",
//							downloads: 665,
//							published: "2015-04-18T15:53:01.576Z",
//							version: "1.1.0"
//						}]
//					}
//				},
//			}
			// filterSet
			// sortedFullSet
	}


	// First, register a command - a UI-less object associating an id to a handler
	var MY_COMMAND_ID = "helloworld.sayhello"; // package-style naming to avoid collisions
	CommandManager.register("Hello World", MY_COMMAND_ID, handleHelloWorld);

	// Then create a menu item bound to the command
	// The label of the menu item is the name we gave the command (see above)
	var menu = Menus.getMenu(Menus.AppMenuBar.FILE_MENU);
	// menu.addMenuItem(MY_COMMAND_ID);

	// We could also add a key binding at the same time:
	menu.addMenuItem(MY_COMMAND_ID, "Ctrl-Alt-M");
	// (Note: "Ctrl" is automatically mapped to "Cmd" on Mac)
});
