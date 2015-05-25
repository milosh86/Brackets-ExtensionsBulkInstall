/*global define, $, brackets, window */
define(function (require, exports, module) {
    "use strict";
    var fileLoader = {},
        reporter = require('./reporter'),
        utils = require('./utils'),
        ProjectManager = brackets.getModule("project/ProjectManager"),
        FileSystem = brackets.getModule('filesystem/FileSystem'),
        FileUtils = brackets.getModule('file/FileUtils');


    function selectFile() {
        var result = $.Deferred(),
            projectRoot = ProjectManager.getProjectRoot().fullPath;

        // showOpenDialog(allowMultipleSelection, chooseDirectories, title, initialPath, fileTypes, callback)
        FileSystem.showOpenDialog(false, false, 'Choose file to import', projectRoot, null, function (err, files) {
            if (!err) {
                // If length == 0, user canceled the dialog; length should never be > 1
                if (files.length > 0) {
                    result.resolve(files[0]);
                }
            } else {
                result.reject({
                    message: 'Error occured while opening the file',
                    data: err
                });
            }
        });

        return result.promise();
    }

    function loadFile(filePath) {
        var file = FileSystem.getFileForPath(filePath),
            result = $.Deferred();

        if (utils.getStringValidator().isNotValid(filePath)) {
            result.reject({
                message: 'Invalid input arguments'
            });
        }

        FileUtils.readAsText(file)
            .done(function (text) {
                result.resolve(text);
            })
            .fail(function (err) {
                result.reject({
                    message: 'unable to load given file',
                    data: err
                });
            });

        return result.promise();
    }

    function parseFile(text) {
        var parsedData,
            result = $.Deferred();

        try {
            parsedData = JSON.parse(text);

            if (parsedData && typeof parsedData.extensions === 'object') {
                result.resolve(parsedData.extensions);
            } else {
                throw new Error('Invalid structure of parsed JSON file.');
            }
        } catch (e) {
            result.reject({
                message: 'Invalid format. Failed to parse given file',
                data: e
            });
        }
        return result.promise();
    }

    return {
        selectAndParseFile: function () {
            return selectFile()
                .then(function (filePath) {
                    return loadFile(filePath);
                })
                .then(function (text) {
                    return parseFile(text);
                });

        }
    };

});