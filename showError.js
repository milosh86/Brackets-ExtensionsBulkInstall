/*jslint vars: true, plusplus: true, devel: true, nomen: true, regexp: true, indent: 4, maxerr: 50 */
/*global define, $, brackets, window */

define(function (require, exports, module) {
	"use strict";

	return function (args) {
		console.log('[showError] Error occured: ');
		console.log('[message] ', args.message);
		if (args.data) {
			console.dir(args.data);
		}
	};

});
