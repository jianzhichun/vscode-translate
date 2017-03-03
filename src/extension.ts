'use strict';
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import { window, workspace, commands, Disposable, ExtensionContext, StatusBarAlignment, StatusBarItem, TextDocument } from 'vscode';
import * as WebRequest from 'web-request';
// import { DOMParser } from 'xmldom';
// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
let _flag = false;
let _rs = '';
// var parser = new DOMParser();


export function activate(context: ExtensionContext) {

    // Use the console to output diagnostic information (console.log) and errors (console.error)
    // This line of code will only be executed once when your extension is activated
    let translate = new Translate();
    context.subscriptions.push(translate);
    var disposable = commands.registerCommand('extension.translateon', () => {
        // The code you place here will be executed every time your command is executed

        // Display a message box to the user
        if (!_flag) {
            window.showInformationMessage('Translate on!');
            _flag = true;
        } else {
            window.showInformationMessage('Translate off!');
            _flag = false;
        }
    });
    context.subscriptions.push(disposable);
    context.subscriptions.push(commands.registerCommand('extension.translateReplace', () => {
        if (!_flag) {
            return;
        }
        var editor = window.activeTextEditor;
        var selection = editor.selection;
        editor.edit(edit =>
            edit.replace(selection, _rs)
        );
    }));

}

// this method is called when your extension is deactivated
export function deactivate() {
}
class Translate {

    private _statusBarItem: StatusBarItem;
    private _disposable: Disposable;
    constructor() {
        if (!this._statusBarItem) {
            this._statusBarItem = window.createStatusBarItem(StatusBarAlignment.Left);
        }
        let subscriptions: Disposable[] = [];
        window.onDidChangeTextEditorSelection(this.updateTranslate, this, subscriptions);
        this._disposable = Disposable.from(...subscriptions);
        this.updateTranslate();
        this._statusBarItem.show();
    }
    public updateTranslate() {
        let cfg = workspace.getConfiguration();
        var _proxy = String(cfg.get("http.proxy"));
        var _api = String(cfg.get("translation.api"));
        var _targetLanguage = String(cfg.get("translation.targetLanguage"));
        var _fromLanguage = String(cfg.get("translation.fromLanguage"));
        let editor = window.activeTextEditor;
        if (!_flag || !editor) {
            this._statusBarItem.hide();
            return;
        }

        let doc = editor.document;
        let str = doc.getText(editor.selection)
        this.dotranslate(encodeURIComponent(str), _proxy, _api, _targetLanguage, _fromLanguage);

    }
    private dotranslate(str, _proxy, _api, _targetLanguage, _fromLanguage) {
        var statusBarItem = this._statusBarItem
        if (str.trim() == '')
            return;
        var translateStr = this.baiduTranslate(str, _targetLanguage, _fromLanguage);
        WebRequest.get(translateStr, { "proxy": _proxy }).then(function (TResult) {
            var rs = '';
            // if (_api == 'baidu') {
                var res = JSON.parse(TResult.content.toString());
                if (res.error) return;
                rs = res.trans_result.data[0].dst;
            // } else {
            //     var domStr = TResult.content.toString()
            //          ,dom = parser.parseFromString(domStr.substring(domStr.indexOf('<body dir'),domStr.lastIndexOf('</body>')+7));
            // }
            statusBarItem.text = _rs = rs;
            statusBarItem.show();
        });
    }
    private baiduTranslate(str, _targetLanguage, _fromLanguage) {
        return 'http://fanyi.baidu.com/v2transapi?query=' + str + (_fromLanguage ? '&from=' + _fromLanguage : '') + (_targetLanguage ? '&to=' + _targetLanguage : '');

    }
    private googleTranslate(str, _targetLanguage, _fromLanguage) {
        return 'https://translate.google.cn/#' + (_fromLanguage ? _fromLanguage : 'auto') + '/' + (_targetLanguage ? _targetLanguage : 'zh-CN') + '/' + str;
    }


    dispose() {
        this._statusBarItem.dispose();
        this._disposable.dispose();
    }
}
