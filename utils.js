/*jslint vars: true, plusplus: true, devel: true, nomen: true, regexp: true, indent: 4, maxerr: 50 */
/*global define, $, brackets, window */

define(function (require, exports, module) {
	"use strict";

	function arrToMap(arr) {
		return arr.reduce(function (acc, curr) {
			acc[curr] = true;
			return acc;
		}, {});
	}

	function getStringValidator() {
		return {
			isNotValid: function (fileName) {
				if (fileName && typeof fileName === 'string' && fileName.length < 1000) {
					return false;
				} else {
					return true;
				}
			}
		};
	}
	
	return {
		arrToMap: arrToMap,
		getStringValidator: getStringValidator
	};
});