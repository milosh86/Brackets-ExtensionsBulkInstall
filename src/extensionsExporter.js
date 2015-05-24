/*global define, $, brackets, window */
define(function (require, exports, module) {
	"use strict";
	var reporter = require('./reporter'),
		utils = require('./utils'),
		UIController = require('./UIController'),

		ExtensionManager = brackets.getModule("extensibility/ExtensionManager"),
		ExtensionManagerViewModel = brackets.getModule("extensibility/ExtensionManagerViewModel"),
		ProjectManager = brackets.getModule("project/ProjectManager"),
		FileSystem = brackets.getModule('filesystem/FileSystem'),
		FileUtils = brackets.getModule('file/FileUtils'),

		installedEM = new ExtensionManagerViewModel.InstalledViewModel();



	function initExtensionsLists() {
		var result = $.Deferred();

		installedEM.initialize()
			.then(function () {
				var JSONToExport = {};

				try {
					JSONToExport.extensions = utils.arrToMap(installedEM.filterSet);
					JSONToExport.extensions['milosh86.extensions-bulk-installer'] = false;
					JSONToExport = JSON.stringify(JSONToExport, null, 2);
				} catch (error) {
					result.reject({
						message: 'Failed to generate export file content',
						data: error
					});
				}


				result.resolve(JSONToExport);
			})
			.fail(function (error) {
				result.reject({
					message: 'Failed to get installed extensions',
					data: error
				});
			});

		return result.promise();
	}

	function selectAndSaveToFile(content) {
		var result = $.Deferred(),
			projectRoot = ProjectManager.getProjectRoot().fullPath;

		// first get location where to save file
		// title, initialPath, proposedNewFilename, callback
		FileSystem.showSaveDialog('Choose location to save file', projectRoot, 'myExtensionsList.json', function (err, fileName) {
			// fileName - full location to file
			if (err) {
				result.reject({
					message: 'Error occured while saving the file',
					data: err
				});
			} else if (fileName) {
				var file = FileSystem.getFileForPath(fileName);
				// file, text, allowBlindWrite
				FileUtils.writeText(file, content, true)
					.done(function () {
						result.resolve(fileName);
					})
					.fail(function (error) {
						result.reject({
							message: 'Error occured while writing to the file',
							data: error
						});
					});
			} else {
				//If the user cancels the save, the error will be falsy and the name will be empty.	
			}
		});
		
		return result.promise();
	}


	return {
		exportInstalled: function exportInstalledExtensions() {
			// forgot to return here! ... document it as common mistake 
			return initExtensionsLists()
				.then(function (content) {
					return selectAndSaveToFile(content);
				});
		}
	};

});
