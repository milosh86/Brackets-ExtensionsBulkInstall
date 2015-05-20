/*jslint vars: true, plusplus: true, devel: true, nomen: true, regexp: true, indent: 4, maxerr: 50 */
/*global define, $, brackets, window */
define(function (require, exports, module) {
	"use strict";

	var CommandManager = brackets.getModule("command/CommandManager"),
		Menus = brackets.getModule("command/Menus"),
		UIController = require('UIController'),
		fileLoader = require('fileLoader'),
		installer = require('extensionsInstaller'),
		exporter = require('extensionsExporter'),
		reporter = require('reporter');

	UIController.initUI();

	UIController.setInstallBtnHandler(function () {
		reporter.reset();

		fileLoader.selectAndParseFile()
			.then(function (extensionsObject) {
				UIController.addStatusMessage('File loaded and parsed...', 'info');
				UIController.resetInstallTable().showLoadedExtensions();
				return installer.install(extensionsObject);
			})
			.done(function () {
				UIController.addStatusMessage('Extensions installation finished', 'info');
				reporter.generateReport();
			})
			.fail(function (error) {
				UIController.addStatusMessage(error.message, 'error');
			});
	});

	UIController.setClearBtnHandler(function () {
		UIController.clearStatusBoard();
	});

	UIController.setExportBtnHandler(function () {
		exporter.export()
			.done(function (fileName) {
				UIController.addStatusMessage('Installed extensions saved to file at location ' + fileName);
			})
			.fail(function (error) {
				UIController.addStatusMessage('Failed to save extensions to file');
				UIController.addStatusMessage('Error message: ' + error.message);
				console.dir(error.data);
			});;
	});

	// Function to run when the menu item is clicked
	function handleHelloWorld() {
		UIController.showPanel();
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