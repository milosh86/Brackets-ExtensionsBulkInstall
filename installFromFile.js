/*global define, $, brackets, window */
define(function (require, exports, module) {
	"use strict";
	var showError = require('showError'),
		reporter = require('reporter'),
		utils = require('utils'),
		ExtensionManager = brackets.getModule("extensibility/ExtensionManager"),
		ExtensionManagerViewModel = brackets.getModule("extensibility/ExtensionManagerViewModel"),
		Package = brackets.getModule("extensibility/Package"),
		ProjectModel = brackets.getModule('project/ProjectModel'),
		FileSystem = brackets.getModule('filesystem/FileSystem'),
		FileUtils = brackets.getModule('file/FileUtils'),

		providedExtensions, // the list of all extensions parsed from selected file
		installedExtensions, // all currently installed extensions in the brackets
		readyToInstall, // filtered list of extensions ready to be installed.
		installPromisesList = [],
		registry,
		installedEM = new ExtensionManagerViewModel.InstalledViewModel(),
		model = new ProjectModel.ProjectModel({
			focused: true
		});

	function installExtensionsFromSelectedFile() {
		selectAndLoadFile()
			.then(function (filePath) {
				return parseSelectedFile(filePath);
			})
			.then(function (parsedExtensionsObject) {
				return initExtensionsLists(parsedExtensionsObject.extensions);
			})
			.fail(function (error) {
				showError({
					message: 'File loading/parsing failed ' + error.message,
					data: error.data
				});
			})
			.then(function () {
				filterValidExtensions();
				return installExtensions();
			})
			.fail(function (error) {
				showError({
					message: 'Installation failed ' + error.message,
					data: error.data
				});
			});
	}

	function selectAndLoadFile() {
		var result = $.Deferred();

		// showOpenDialog(allowMultipleSelection, chooseDirectories, title, initialPath, fileTypes, callback)
		FileSystem.showOpenDialog(false, false, 'Choose file to import', /*todo: check why not working: model.projectRoot.fullPath*/ '/', null, function (err, files) {
			if (!err) {
				// If length == 0, user canceled the dialog; length should never be > 1
				if (files.length > 0) {
					result.resolve(files[0]);
				} else {
					//	result.reject({message: '[loadAndParseFile] No file selected'});// - user canceled, don't trigger error
				}
			} else {
				result.reject({
					message: '[loadAndParseFile] Error while opening file',
					data: err
				});
			}
		});

		return result.promise();
	}

	function parseSelectedFile(filePath) {
		var file = FileSystem.getFileForPath(filePath),
			result = $.Deferred();

		if (utils.getStringValidator().isNotValid(filePath)) {
			console.error('parseSelectedFile: Invalid input arguments');
			result.reject({
				message: 'Invalid input arguments'
			});
		}

		FileUtils.readAsText(file)
			.done(function (text) {
				var parsedData;
				try {
					parsedData = JSON.parse(text);
					// todo: validate format of parsed JSON object
				} catch (e) {
					console.error('Failed to parse given file', e);
					result.reject({
						message: 'Invalid format. Failed to parse given file',
						data: e
					});
				}
				result.resolve(parsedData);
			})
			.fail(function (err) {
				console.error('Unable to load selected file', err);
				result.reject({
					message: 'unable to load selected file',
					data: err
				});
			});

		return result.promise();
	}

	function initExtensionsLists(parsedExtensionsObject) {
		var result = $.Deferred();

		ExtensionManager.downloadRegistry()
			.then(function () {
				// ExtensionManager.extensions should now be populated with extensions from registry
				return installedEM.initialize();
			})
			.then(function () {
				installedExtensions = utils.arrToMap(installedEM.filterSet); // todo: extract to utils.js
				registry = installedEM.extensions;
				providedExtensions = Object.keys(parsedExtensionsObject).filter(function (e) {
					return parsedExtensionsObject[e]; // filter out extensions marked with false flag
				});
				result.resolve();
				// list of installed extensions available now.
				//installedEM.filterSet/sortedFullSet;
			})
			.fail(function (error) {
				// extensions download failed
				console.log('Registry download failed');
				result.reject({
					message: 'Registry download failed',
					data: error
				});
			});

		return result.promise();
	}


	// NOT IN installed && IN registry
	// TODO: add extensions lookup by title
	function filterValidExtensions() {
		readyToInstall = providedExtensions.filter(function (e) {
			if (installedExtensions[e]) {
				reporter.addToInstalled(e);
				return false;
			} else if (registry[e]) {
				return true;
			} else {
				reporter.addToNotFound(e);
				return false;
			}
		});
	}

	function installExtensions() {
		readyToInstall.forEach(function (extensionId) {
			var version,
				url;

			try {
				version = registry[extensionId].registryInfo.metadata.version;
			} catch (error) {
				reporter.addToFailed(extensionId);
				UIController.extensionInstallationFailed(id, 'Invalid metadata');
				return void 0;
			}

			url = ExtensionManager.getExtensionURL(extensionId, version); //sync

			startInstallation(extensionId, url);
		});

		$.when.apply($, installPromisesList) //todo: we don;t want to stop on first error. Use utils/Async/waitForAll instead of wait
			.done(function () {
				console.log('Installation finished!');
			})
			.fail(function () {
				console.log('Installation failed');
				reporter.failed();
			})
			.always(function () {
				reporter.generateReport();
			});
		//		InstallExtensionDialog.installUsingDialog(urloOrFile)
		//		ExtensionLoader._loadAll
	}

	function startInstallation(id, url) {
		var installPromise;
		//		UIController.extensionInstallStarted(id, url);

		installPromise = Package.installFromURL(url).promise;
		installPromise.done(function (extensionMetadata) {
				reporter.addToInstalled(id);
				//				UIController.extensionInstalled(id);
			})
			.fail(function (error) {
				reporter.addToFailed(id);
				//				UIController.extensionInstallationFailed(id, Package.formatError(error));
			});

		installPromisesList.push(installPromise);
	}


	function showReport() {
		UIController.showReport(reportData);
	}



	return installExtensionsFromSelectedFile;

});