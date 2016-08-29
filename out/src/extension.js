'use strict';
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
var vscode_1 = require('vscode');
var WebRequest = require('web-request');
// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
var _flag = false;
var _proxy = vscode_1.workspace.getConfiguration('http').get('proxy');
function activate(context) {
    // Use the console to output diagnostic information (console.log) and errors (console.error)
    // This line of code will only be executed once when your extension is activated
    var translate = new Translate();
    context.subscriptions.push(translate);
    var disposable = vscode_1.commands.registerCommand('extension.translateon', function () {
        // The code you place here will be executed every time your command is executed
        // Display a message box to the user
        if (!_flag) {
            vscode_1.window.showInformationMessage('Translate on!');
            _flag = true;
        }
        else {
            vscode_1.window.showInformationMessage('Translate off!');
            _flag = false;
        }
    });
    context.subscriptions.push(disposable);
}
exports.activate = activate;
// this method is called when your extension is deactivated
function deactivate() {
}
exports.deactivate = deactivate;
var Translate = (function () {
    function Translate() {
        if (!this._statusBarItem) {
            this._statusBarItem = vscode_1.window.createStatusBarItem(vscode_1.StatusBarAlignment.Left);
        }
        var subscriptions = [];
        vscode_1.window.onDidChangeTextEditorSelection(this.updateTranslate, this, subscriptions);
        this._disposable = vscode_1.Disposable.from.apply(vscode_1.Disposable, subscriptions);
        this.updateTranslate();
        this._statusBarItem.show();
    }
    Translate.prototype.updateTranslate = function () {
        var editor = vscode_1.window.activeTextEditor;
        if (!_flag || !editor) {
            this._statusBarItem.hide();
            return;
        }
        var doc = editor.document;
        var str = doc.getText(editor.selection);
        this.dotranslate(str);
    };
    Translate.prototype.dotranslate = function (str) {
        var statusBarItem = this._statusBarItem;
        WebRequest.get('http://fanyi.baidu.com/v2transapi?query=' + str + '&to=zh', { "proxy": _proxy }).then(function (TResult) {
            var res = JSON.parse(TResult.content.toString());
            if (res.error)
                return;
            // if (res.trans_result.data.length > 1) {
            //     window.showInformationMessage(res.trans_result.data.map(v=>v.dst).join(' '))
            // }
            // else {
            statusBarItem.text = res.trans_result.data[0].dst;
            statusBarItem.show();
            // }
        });
    };
    Translate.prototype.dispose = function () {
        this._statusBarItem.dispose();
        this._disposable.dispose();
    };
    return Translate;
}());
//# sourceMappingURL=extension.js.map