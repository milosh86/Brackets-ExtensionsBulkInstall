/*global define, $, brackets, window, Mustache, console */

define(function (require, exports, module) {
    "use strict";
    var WM = brackets.getModule('view/WorkspaceManager'),
        ExtensionUtils = brackets.getModule("utils/ExtensionUtils"),

        startPageHTML = require('text!../ui/startPage.html'),
        tableRowHTML = require('text!../ui/tableRow.html'),
        statusMsgHTML = require('text!../ui/statusMsg.html'),
        panel,
        $installBtn,
        $exportBtn,
        $clearStatusBoardBtn,
        $clearTableBtn,
        $loadedExtensionsContainer,
        $installTableBody,
        $exportFileContent,
        $statusBoard,
        $statusBoardMessages,

        panelOpened = false,
        UIController = {};

    ExtensionUtils.loadStyleSheet(module, "../ui/style.css");


    UIController.initUI = function () {

        panel = WM.createBottomPanel('install-extensions-from-file-panel', $(startPageHTML), 300);

        $installBtn = $('#extensions-install-from-file #install-btn');
        $installTableBody = $('#extensions-install-from-file #install-table #table-body');
        $exportBtn = $('#extensions-install-from-file #export-btn');
        $exportFileContent = $('#extensions-install-from-file #export-file-content');
        $statusBoard = $('#extensions-install-from-file #status-board');
        $statusBoardMessages = $statusBoard.children('#status-messages');
        $loadedExtensionsContainer = $('#extensions-install-from-file #loaded-extensions');
        $clearStatusBoardBtn = $('#extensions-install-from-file #clear-board');
        $clearTableBtn = $('#extensions-install-from-file #clear-table');

        $("#extensions-install-from-file .close").click(function () {
            UIController.hidePanel();
        });

        UIController.setClearStatusBoardBtnHandler(function () {
            UIController.clearStatusBoard();
        });

        UIController.setClearTableBtnHandler(function () {
            UIController.resetInstallTable();
        });

        return UIController;
    };

    UIController.hidePanel = function () {
        if (panel) {
            panel.hide();
            panelOpened = false;
        }

        return UIController;
    };

    UIController.showPanel = function () {
        if (panel) {
            panel.show();
            panelOpened = true;
        }

        return UIController;
    };

    UIController.togglePanel = function () {
        if (panelOpened) {
            UIController.hidePanel();
        } else {
            UIController.showPanel();
        }
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

        $installTableBody.append($tableRow);
        return $tableRow;
    };

    UIController.updateExtensionStatus = function (id, newStatus, tooltip) {
        var escapedId,
            $tableRowForId,
            $statusField;

        escapedId = id.replace(/\./g, '\\.');
        console.log('updating status for id: ' + id);
        $tableRowForId = $('#extensions-install-from-file #' + escapedId);


        if ($tableRowForId.length === 0) {
            console.log('table row not found, adding new for: ' + id);
            $tableRowForId = UIController.addExtensionToInstall({
                id: id
            });
        }

        $statusField = $tableRowForId.children('.extension-status').children('span');
        tooltip = (typeof tooltip === 'string') && (tooltip || '');

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
        var $statusMsg = $(Mustache.render(statusMsgHTML, {
            message: msg,
            type: type
        }));

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
        $installTableBody.empty();

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

    UIController.setClearStatusBoardBtnHandler = function (handler) {
        setHandler($clearStatusBoardBtn, 'click', handler);

        return UIController;
    };

    UIController.setClearTableBtnHandler = function (handler) {
        setHandler($clearTableBtn, 'click', handler);

        return UIController;
    };

    return UIController;
});
