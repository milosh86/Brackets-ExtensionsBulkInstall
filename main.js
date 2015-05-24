/*global define, $, brackets, window, console */
define(function (require, exports, module) {
	"use strict";

	var CommandManager = brackets.getModule("command/CommandManager"),
		KeyBindingManager = brackets.getModule("command/KeyBindingManager"),
		UIController = require('./src/UIController'),
		fileLoader = require('./src/fileLoader'),
		installer = require('./src/extensionsInstaller'),
		exporter = require('./src/extensionsExporter'),
		reporter = require('./src/reporter'),
		MY_COMMAND_ID;

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

	UIController.setExportBtnHandler(function () {
		exporter.exportInstalled()
			.done(function (fileName) {
				UIController.addStatusMessage('Installed extensions saved to file at location ' + fileName);
			})
			.fail(function (error) {
				UIController.addStatusMessage('Failed to save extensions to file');
				UIController.addStatusMessage('Error message: ' + error.message);
				console.dir(error.data);
			});
	});
	
	UIController.setToolbarBtnHandler(function () {
		UIController.togglePanel();
	});

	// Function to run when the menu item is clicked
	function handleBulkInstallerCall() {
		UIController.togglePanel();
	}


	MY_COMMAND_ID = "milosh86.bulk.installer";
	CommandManager.register("Extensions Bulk Installer", MY_COMMAND_ID, handleBulkInstallerCall);

	KeyBindingManager.addBinding(MY_COMMAND_ID, "Ctrl-Alt-M");
	// (Note: "Ctrl" is automatically mapped to "Cmd" on Mac)
});