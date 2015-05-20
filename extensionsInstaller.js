/*global define, $, brackets, window */
define(function (require, exports, module) {
	"use strict";
	var reporter = require('reporter'),
		utils = require('utils'),
		ExtensionManager = brackets.getModule("extensibility/ExtensionManager"),
		ExtensionManagerViewModel = brackets.getModule("extensibility/ExtensionManagerViewModel"),
		Package = brackets.getModule("extensibility/Package"),
		Async = brackets.getModule("utils/Async"),

		UIController = require('UIController'),

		installedEM = new ExtensionManagerViewModel.InstalledViewModel(),

		providedExtensions, // the list of all extensions parsed from selected file
		installedExtensions, // all currently installed extensions in the brackets
		readyToInstall, // filtered list of extensions ready to be installed.
		installPromisesList = [],
		registry;


	function initExtensionsLists(parsedExtensionsObject) {
		var result = $.Deferred();

		ExtensionManager.downloadRegistry()
			.then(function () {
				// ExtensionManager.extensions should now be populated with extensions from registry
				return installedEM.initialize();
			})
			.then(function () {
				installedExtensions = utils.arrToMap(installedEM.filterSet);
				registry = installedEM.extensions;
				providedExtensions = Object.keys(parsedExtensionsObject).filter(function (e) {
					return parsedExtensionsObject[e]; // filter out extensions marked with false flag
				});

				result.resolve();
			})
			.fail(function (error) {
				// extensions download failed
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
		readyToInstall = providedExtensions.filter(function (eId) {
			if (installedExtensions[eId]) {
				reporter.addToSkipped(eId);
				UIController.updateExtensionStatus(eId, 'Already Installed');
				return false;
			} else if (registry[eId]) {
				UIController.updateExtensionStatus(eId, 'Preparing to install');
				return true;
			} else {
				UIController.updateExtensionStatus(eId, 'Not found');
				reporter.addToNotFound(eId);
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
				UIController.updateExtensionStatus(extensionId, 'Invalid metadata object');
				return void 0;
			}

			url = ExtensionManager.getExtensionURL(extensionId, version); //sync

			startInstallation(extensionId, url);
		});

		//		$.when.apply($, installPromisesList) //todo: we don;t want to stop on first error. Use utils/Async/waitForAll instead of wait
		//			.done(function () {
		//				console.log('Installation finished!');
		//			})
		//			.fail(function () {
		//				console.log('Installation failed');
		//				reporter.failed();
		//			})
		//			.always(function () {
		//				reporter.generateReport();
		//			});
		//		InstallExtensionDialog.installUsingDialog(urloOrFile)
		//		ExtensionLoader._loadAll
	}

	function startInstallation(id, url) {
		var installPromise;

//		UIController.updateExtensionStatus(id, 'Instalation in progress...');
		UIController.updateExtensionStatus(id, 'install gif');
		UIController.addStatusMessage('Starting installation of extension: ' + id, 'info');

		installPromise = Package.installFromURL(url).promise;

		installPromise
			.done(function (extensionMetadata) {
				reporter.addToInstalled(id);
				UIController.updateExtensionStatus(id, 'Installed'); // TODO: define enum instead of strings
				UIController.addStatusMessage('Installation finished for extension: ' + id, 'info');
			})
			.fail(function (error) {
				reporter.addToFailed(id);
				UIController.updateExtensionStatus(id, 'Installation failed', Package.formatError(error));
				UIController.addStatusMessage('Installation failed for extension: ' + id, 'info');
				UIController.addStatusMessage(id + ': ' + Package.formatError(error), 'info');
			});

		installPromisesList.push(installPromise);
	}


	return {
		install: function install(extensions) {
			return initExtensionsLists(extensions)
				.then(function () {
					filterValidExtensions();
					installExtensions();
					
					return Async.waitForAll(installPromisesList);
				});
		}
	};

});