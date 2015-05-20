/*jslint vars: true, plusplus: true, devel: true, nomen: true, regexp: true, indent: 4, maxerr: 50 */
/*global define, $, brackets, window, Mustache */

define(function (require, exports, module) {
	"use strict";
	var WM = brackets.getModule('view/WorkspaceManager'),
		ExtensionUtils = brackets.getModule("utils/ExtensionUtils"),

		startPageHTML = require('text!ui/startPage.html'),
		tableRowHTML = require('text!ui/tableRow.html'),
		statusMsgHTML = require('text!ui/statusMsg.html'),
		startPage,
		panel,
		$installBtn,
		$exportBtn,
		$clearBtn,
		$loadedExtensionsContainer,
		$installTable,
		$exportFileContent,
		$statusBoard,
		$statusBoardMessages;

	ExtensionUtils.loadStyleSheet(module, "ui/style.css");

	var UIController = {};

	UIController.initUI = function () {
		//startPage = Mustache.render(startPageHTML, {});

		panel = WM.createBottomPanel('install.extensions.from.file', $(startPageHTML), 100);

		$installBtn = $('#extensions-install-from-file #install-btn');
		$installTable = $('#extensions-install-from-file #install-table');
		$exportBtn = $('#extensions-install-from-file #export-btn');
		$exportFileContent = $('#extensions-install-from-file #export-file-content');
		$statusBoard = $('#extensions-install-from-file #status-board');
		$statusBoardMessages = $statusBoard.children('#status-messages');
		$loadedExtensionsContainer = $('#extensions-install-from-file #loaded-extensions');
		$clearBtn = $('#extensions-install-from-file #clear-board');

		$("#extensions-install-from-file .close").click(function () {
			UIController.hidePanel();
		});

		return UIController;
	};

	UIController.hidePanel = function () {
		if (panel) {
			panel.hide();
		}
		
		return UIController;
	};

	UIController.showPanel = function () {
		if (panel) {
			panel.show();
		}
		
		return UIController;
	};

	UIController.addExtensionToInstall = function (row) {
		var id = row.id,
			title = row.title || '',
			status = row.status || 'Waiting',
			$tableRow;

		if (!id || typeof id !== 'string') {
			throw new TypeError('Invalid argument. Extension ID not given.');
		}

		$tableRow = $(Mustache.render(tableRowHTML, {
			id: id,
			title: title,
			status: status
		}));

		$installTable.append($tableRow);
		return $tableRow;
	};

	UIController.updateExtensionStatus = function (id, newStatus, tooltip) {
		var escapedId = id.replace(/\./g, '\\.');
		console.log('updating status for id: ' + id);
		var $tableRowForId = $('#extensions-install-from-file #' + escapedId),
			$statusField;

		if ($tableRowForId.length === 0) {
			console.log('table row not found, adding new for: ' + id);
			$tableRowForId = UIController.addExtensionToInstall({
				id: id
			});
		}

		$statusField = $tableRowForId.children('.extension-status').children('span');
		tooltip = typeof tooltip === 'string' && tooltip || '';

		if (newStatus === 'install gif') {
			$statusField.empty().addClass('spinner small spin');
		} else {
			$statusField.removeClass('spinner small spin').text(newStatus);
			$tableRowForId.attr('title', tooltip);
		}
		
		return UIController;
	};
	
	UIController.clearStatusBoard = function () {
		$statusBoardMessages.empty();
		
		return UIController;
	};

	UIController.addStatusMessage = function (msg, type) {
		type || (type = 'info');
		var $statusMsg = $(Mustache.render(statusMsgHTML, {message: msg, type: type}));
		
		$statusBoardMessages.append($statusMsg);
		
		return UIController;
	};
	
	UIController.addHTMLToStatusBoard = function (html) {
		$(html).appendTo($statusBoardMessages);
		
		return UIController;
	};
	
	UIController.showLoadedExtensions = function () {
		$loadedExtensionsContainer.show();
	};
	
	UIController.hideLoadedExtensions = function () {
		$loadedExtensionsContainer.hide();
	};

	UIController.resetInstallTable = function () {
		$installTable.children('tr').remove();
		
		return UIController;
	};

	function setHandler($el, event, handler) {
		$el.unbind(event).on(event, handler);
	}

	UIController.setInstallBtnHandler = function (handler) {
		setHandler($installBtn, 'click', handler);
		
		return UIController;
	};

	UIController.setExportBtnHandler = function (handler) {
		setHandler($exportBtn, 'click', handler);
		
		return UIController;
	};
	
	UIController.setClearBtnHandler = function (handler) {
		setHandler($clearBtn, 'click', handler);
		
		return UIController;
	};


	return UIController;
});