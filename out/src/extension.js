'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode_1 = require("vscode");
const WebRequest = require("web-request");
// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
let _flag = false, _rs = '', google2baidu = {
    en: 'en',
    th: 'th',
    ru: 'ru',
    pt: 'pt',
    el: 'el',
    nl: 'nl',
    pl: 'pl',
    bg: 'bul',
    et: 'est',
    da: 'dan',
    fi: 'fin',
    cs: 'cs',
    ro: 'rom',
    sl: 'slo',
    sv: 'swe',
    hu: 'hu',
    de: 'de',
    it: 'it',
    zh: 'zh',
    'zh-CN': 'zh',
    'zh-TW': 'cht',
    'zh-HK': 'yue',
    ja: 'jp',
    ko: 'kor',
    es: 'spa',
    fr: 'fra',
    ar: 'ara'
};
function activate(context) {
    // Use the console to output diagnostic information (console.log) and errors (console.error)
    // This line of code will only be executed once when your extension is activated
    context.subscriptions.push(new Translate());
    context.subscriptions.push(vscode_1.commands.registerCommand('extension.translateon', () => {
        if (!_flag) {
            vscode_1.window.showInformationMessage('Translate on!');
            _flag = true;
        }
        else {
            vscode_1.window.showInformationMessage('Translate off!');
            _flag = false;
        }
    }));
    context.subscriptions.push(vscode_1.commands.registerCommand('extension.translateReplace', () => {
        if (!_flag) {
            return;
        }
        var editor = vscode_1.window.activeTextEditor, selection = editor.selection;
        editor.edit(edit => edit.replace(selection, _rs));
    }));
}
exports.activate = activate;
// this method is called when your extension is deactivated
function deactivate() {
}
exports.deactivate = deactivate;
class Translate {
    constructor() {
        if (!this._statusBarItem) {
            this._statusBarItem = vscode_1.window.createStatusBarItem(vscode_1.StatusBarAlignment.Left);
        }
        let subscriptions = [];
        vscode_1.window.onDidChangeTextEditorSelection(this.updateTranslate, this, subscriptions);
        this._disposable = vscode_1.Disposable.from(...subscriptions);
        this.updateTranslate();
        this._statusBarItem.show();
    }
    updateTranslate() {
        var cfg = vscode_1.workspace.getConfiguration(), _proxy = String(cfg.get("http.proxy")), _api = String(cfg.get("translation.api")), _targetLanguage = String(cfg.get("translation.targetLanguage")), _fromLanguage = String(cfg.get("translation.fromLanguage"));
        let editor = vscode_1.window.activeTextEditor;
        if (!_flag || !editor) {
            this._statusBarItem.hide();
            return;
        }
        let doc = editor.document, str = doc.getText(editor.selection);
        setTimeout(() => {
            this.languageDetection(str, _fromLanguage).then((isReverse) => {
                if (isReverse) {
                    [_fromLanguage, _targetLanguage] = [_targetLanguage, _fromLanguage];
                }
                this.dotranslate(encodeURIComponent(str), _proxy, _api, _targetLanguage, _fromLanguage);
            });
        }, 1000);
    }
    dotranslate(str, _proxy, _api, _targetLanguage, _fromLanguage) {
        var statusBarItem = this._statusBarItem;
        if (str.trim() == '')
            return;
        var translateStr = _api == 'baidu' ? this.baiduTranslate(str, google2baidu[_targetLanguage], google2baidu[_fromLanguage]) : this.googleTranslate(str, _targetLanguage, _fromLanguage);
        WebRequest.get(translateStr, { "proxy": _proxy }).then(function (TResult) {
            var rs = '', res = JSON.parse(TResult.content.toString());
            if (_api == 'baidu') {
                if (res.error)
                    return;
                rs = res.trans_result.data[0].dst;
            }
            else {
                var result = [];
                res.sentences.forEach(function (v) {
                    result.push(v.trans);
                });
                rs = result.join(',');
            }
            statusBarItem.text = _rs = rs;
            statusBarItem.show();
        });
    }
    languageDetection(str, _fromLanguage) {
        return WebRequest.post('http://fanyi.baidu.com/langdetect', { "formData": { "query": str } }).then(function (result) {
            var res = JSON.parse(result.content);
            if (res.error || res.lan == _fromLanguage) {
                return false;
            }
            else {
                return true;
            }
        }, function () {
            return false;
        });
    }
    baiduTranslate(str, _targetLanguage, _fromLanguage) {
        return 'http://fanyi.baidu.com/v2transapi?query=' + str + (_fromLanguage ? '&from=' + _fromLanguage : '') + (_targetLanguage ? '&to=' + _targetLanguage : '');
    }
    googleTranslate(str, _targetLanguage, _fromLanguage) {
        return 'https://translate.google.cn/translate_a/single?client=gtx&sl=' + (_fromLanguage || 'auto') + '&tl=' + (_targetLanguage || 'auto') + '&hl=zh-CN&dt=t&dt=bd&ie=UTF-8&oe=UTF-8&dj=1&source=icon&q=' + str;
    }
    dispose() {
        this._statusBarItem.dispose();
        this._disposable.dispose();
    }
}
//# sourceMappingURL=extension.js.map