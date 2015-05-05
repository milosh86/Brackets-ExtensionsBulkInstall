/*jslint vars: true, plusplus: true, devel: true, nomen: true, regexp: true, indent: 4, maxerr: 50 */
/*global define, $, brackets, window */

define(function (require, exports, module) {
	"use strict";
	var skippedInstalled = [], // already installed
		skippedNotFound = [], // not found in registry
		installed = [],
		failed = [];

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
			console.log('Report generated:');
			console.dir(skippedInstalled);
			console.dir(skippedNotFound);
			console.dir(installed);
			console.dir(failed);
		}
	};

});
