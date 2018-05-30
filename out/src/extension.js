'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode_1 = require("vscode");
const googleTranslate = require("google-translate-api");
const googleTranslateCN = require("google-translate-api-cn");
const humps_1 = require("humps");
const decamelizeQuery = (query) => humps_1.decamelize(humps_1.camelize(query), { split: /(?=[A-Z0-9])/, separator: ' ' });
function activate(context) {
    // Use the console to output diagnostic information (console.log) and errors (console.error)
    // This line of code will only be executed once when your extension is activated
    let isActive, statusBarItem, timer, translate, updateTranslator = () => {
        if (!isActive)
            return;
        let { translation: { api, targetLanguage, detection, fromLanguage } } = vscode_1.workspace.getConfiguration();
        switch (api) {
            case "google-cn":
            case "google":
            default:
                let gTranslate = api === "google" ? googleTranslate : googleTranslateCN;
                translate = (query, _targetLanguage = targetLanguage, unrecursive) => gTranslate(query, { to: _targetLanguage })
                    .then(({ text, from: { text: { autoCorrected, value, didYouMean }, language: { iso, } }, }) => {
                    /*
                    unrecursive -> update;
                    reverse -> translate(reverse);
                    len(value) > 5 && query === text
                    ?
                    translate(decamelize) :
                    update
                    */
                    if (unrecursive) {
                        statusBarItem.text = text;
                        statusBarItem.show();
                        return;
                    }
                    if (detection && iso === _targetLanguage && iso !== fromLanguage) {
                        translate(query, fromLanguage, true);
                        return;
                    }
                    if (query.length > 5) {
                        if (autoCorrected || didYouMean) {
                            vscode_1.window.showWarningMessage(`DidYouMean: ${value}`);
                        }
                        if (query === text) {
                            let queryAfterDecamelize = decamelizeQuery(query);
                            if (query !== queryAfterDecamelize) {
                                translate(queryAfterDecamelize, _targetLanguage, true);
                                return;
                            }
                        }
                    }
                    statusBarItem.text = text;
                    statusBarItem.show();
                }).catch(err => console.error(err));
                break;
        }
    };
    context.subscriptions.push(
    // config change -> update properties
    vscode_1.workspace.onDidChangeConfiguration(updateTranslator), 
    // selection change -> translate
    vscode_1.window.onDidChangeTextEditorSelection(({ textEditor, selections: [selection,] }) => {
        if (isActive && !selection.start.isEqual(selection.end)) {
            clearTimeout(timer);
            timer = setTimeout(() => translate(textEditor.document.getText(selection)), 100);
        }
    }), 
    // commands
    vscode_1.commands.registerCommand('extension.translateon', () => {
        if (isActive) {
            isActive = false;
            vscode_1.window.showInformationMessage('Translate off!');
            statusBarItem.dispose();
            statusBarItem = null;
        }
        else {
            isActive = true;
            vscode_1.window.showInformationMessage('Translate on!');
            statusBarItem = vscode_1.window.createStatusBarItem(vscode_1.StatusBarAlignment.Left);
            updateTranslator();
        }
    }), vscode_1.commands.registerCommand('extension.translateReplace', () => {
        if (isActive) {
            let { activeTextEditor } = vscode_1.window;
            activeTextEditor.edit((edit) => edit.replace(activeTextEditor.selection, statusBarItem.text));
        }
    }));
}
exports.activate = activate;
// this method is called when your extension is deactivated
function deactivate() { }
exports.deactivate = deactivate;
//# sourceMappingURL=extension.js.map