/*global define, $, brackets, window, Mustache */

define(function (require, exports, module) {
	"use strict";
	var skippedInstalled = [], // already installed
		skippedNotFound = [], // not found in registry
		installed = [],
		failed = [],
		
		reportHTML = require('text!../ui/report.html'),
		UIController = require('./UIController');

	function assertStringNonEmpty(str) {
		if (!(str && typeof str === 'string')) {
			throw new TypeError('Invalid argument - not string or empty.');
		}
	}

	return {
		addToSkipped: function (eId) {
			assertStringNonEmpty(eId);
			skippedInstalled.push(eId);
		},
		addToInstalled: function (eId) {
			assertStringNonEmpty(eId);
			installed.push(eId);
		},
		addToFailed: function (eId) {
			assertStringNonEmpty(eId);
			failed.push(eId);
		},
		addToNotFound: function (eId) {
			assertStringNonEmpty(eId);
			skippedNotFound.push(eId);
		},
		generateReport: function () {
			var report = Mustache.render(reportHTML, {
				installed: installed.join(', ') || 'None',
				skippedInstalled: skippedInstalled.join(', ') || 'None',
				notFound: skippedNotFound.join(', ') || 'None',
				failed: failed.join(', ') || 'None',
				installedNum: installed.length,
				skippedNum: skippedInstalled.length,
				failedNum: failed.length,
				notFoundNum: skippedNotFound.length
			});
			
			UIController.addHTMLToStatusBoard(report);
			
		},
		reset: function () {
			skippedInstalled = [];
			skippedNotFound = [];
			installed = [];
			failed = [];
		}
	};

});
