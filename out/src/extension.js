'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode_1 = require("vscode");
const WebRequest = require("web-request");
// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
let isActive = false, translateResult = '', google2baidu = {
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
        if (!isActive) {
            vscode_1.window.showInformationMessage('Translate on!');
            isActive = true;
        }
        else {
            vscode_1.window.showInformationMessage('Translate off!');
            isActive = false;
        }
    }));
    context.subscriptions.push(vscode_1.commands.registerCommand('extension.translateReplace', () => {
        if (!isActive) {
            return;
        }
        var editor = vscode_1.window.activeTextEditor, selection = editor.selection;
        editor.edit(edit => edit.replace(selection, translateResult));
    }));
}
exports.activate = activate;
// this method is called when your extension is deactivated
function deactivate() {
}
exports.deactivate = deactivate;
class Translate {
    constructor() {
        if (!this.statusBarItem) {
            this.statusBarItem = vscode_1.window.createStatusBarItem(vscode_1.StatusBarAlignment.Left);
        }
        let subscriptions = [];
        vscode_1.window.onDidChangeTextEditorSelection(this.updateTranslate, this, subscriptions);
        this.disposable = vscode_1.Disposable.from(...subscriptions);
        this.updateTranslate();
        this.statusBarItem.show();
    }
    updateTranslate() {
        var cfg = vscode_1.workspace.getConfiguration(), proxy = String(cfg.get("http.proxy")), api = String(cfg.get("translation.api")), targetLanguage = String(cfg.get("translation.targetLanguage")), fromLanguage = String(cfg.get("translation.fromLanguage")), languageDetection = Boolean(cfg.get("translation.languageDetection"));
        let editor = vscode_1.window.activeTextEditor;
        if (!isActive || !editor) {
            this.statusBarItem.hide();
            return;
        }
        let doc = editor.document, str = doc.getText(editor.selection).trim();
        if (str.trim() == '')
            return;
        setTimeout(() => {
            languageDetection
                ? this.languageDetection(str, fromLanguage).then((isReverse) => {
                    if (isReverse) {
                        [fromLanguage, targetLanguage] = [targetLanguage, fromLanguage];
                    }
                    this.dotranslate(encodeURIComponent(str), proxy, api, targetLanguage, fromLanguage);
                })
                : this.dotranslate(encodeURIComponent(str), proxy, api, targetLanguage, fromLanguage);
        }, 1000);
    }
    dotranslate(str, proxy, api, targetLanguage, fromLanguage) {
        var statusBarItem = this.statusBarItem;
        var translateStr = api == 'baidu' ? this.baiduTranslate(str, google2baidu[targetLanguage], google2baidu[fromLanguage]) : this.googleTranslate(str, targetLanguage, fromLanguage);
        WebRequest.get(translateStr, { "proxy": proxy }).then(function (TResult) {
            var rs = '', res = JSON.parse(TResult.content.toString());
            if (api == 'baidu') {
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
            statusBarItem.text = translateResult = rs;
            statusBarItem.show();
        });
    }
    languageDetection(str, fromLanguage) {
        return WebRequest.post('http://fanyi.baidu.com/langdetect', { "formData": { "query": str }, "timeout": 500 }).then(function (result) {
            var res = JSON.parse(result.content);
            if (res.error || res.lan == fromLanguage || fromLanguage == '') {
                return false;
            }
            else {
                return true;
            }
        }, function () {
            return false;
        });
    }
    baiduTranslate(str, targetLanguage, fromLanguage) {
        return 'http://fanyi.baidu.com/v2transapi?query=' + str + (fromLanguage ? '&from=' + fromLanguage : '') + (targetLanguage ? '&to=' + targetLanguage : '');
    }
    googleTranslate(str, targetLanguage, fromLanguage) {
        return 'https://translate.google.cn/translate_a/single?client=gtx&sl=' + (fromLanguage || 'auto') + '&tl=' + (targetLanguage || 'auto') + '&hl=zh-CN&dt=t&dt=bd&ie=UTF-8&oe=UTF-8&dj=1&source=icon&q=' + str;
    }
    dispose() {
        this.statusBarItem.dispose();
        this.disposable.dispose();
    }
}
//# sourceMappingURL=extension.js.map