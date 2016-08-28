'use strict';
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
var vscode_1 = require('vscode');
var WebRequest = require('web-request');
// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
function activate(context) {
    // Use the console to output diagnostic information (console.log) and errors (console.error)
    // This line of code will only be executed once when your extension is activated
    vscode_1.window.showInformationMessage('Congratulations, your extension "vscode-translate" is now active!');
    var translate = new Translate();
    vscode_1.window.showInformationMessage('sdfsdafdfsdafd!');
    context.subscriptions.push(translate);
    // Add to a list of disposables which are disposed when this extension is deactivated.
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
        if (!editor) {
            this._statusBarItem.hide();
            return;
        }
        var doc = editor.document;
        var str = doc.getText(editor.selection);
        this.dotranslate(str);
    };
    Translate.prototype.dotranslate = function (str) {
        // let request = require('request');
        var statusBarItem = this._statusBarItem;
        WebRequest.get('http://fanyi.baidu.com/v2transapi?query=' + str + '&to=zh').then(function (TResult) {
            var res = JSON.parse(TResult.content.toString());
            if (res.error)
                return;
            statusBarItem.text = res.trans_result.data[0].dst;
            vscode_1.window.showInformationMessage(res.trans_result.data[0].dst);
        });
        //     if (!error && response.statusCode == 200) {
        //         var res = JSON.parse(body);
        //         if (res.error) return;
        //         statusBarItem.text = res.trans_result.data[0].dst;
        //         window.showInformationMessage(res.trans_result.data[0].dst);
        //     }
        // })
        // statusBarItem.text="sdfsf";
    };
    Translate.prototype.dispose = function () {
        this._statusBarItem.dispose();
        this._disposable.dispose();
    };
    return Translate;
}());
//# sourceMappingURL=extension.js.map