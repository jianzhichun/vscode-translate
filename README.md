# vscode-translate

[![Current Version](http://vsmarketplacebadge.apphb.com/version/chun.vscode-translate.svg)](https://marketplace.visualstudio.com/items?itemName=chun.vscode-translate)
[![Install Count](http://vsmarketplacebadge.apphb.com/installs/chun.vscode-translate.svg)](https://marketplace.visualstudio.com/items?itemName=chun.vscode-translate)
[![Open Issues](http://vsmarketplacebadge.apphb.com/rating/chun.vscode-translate.svg)](https://marketplace.visualstudio.com/items?itemName=chun.vscode-translate)

## Translate languages.
<br />
press CTRL + t to turn on the translate then u can select the text and see the change of statusBar.
press CTRL + t to turn off the function. <br />

### It looks like:

![](https://raw.githubusercontent.com/jianzhichun/vscode-translate/master/img/translate_show.gif)

#### it will read http.proxy at user-settings to get data by proxy. 

#### and you can set the user-settings to change from language and target language. 

#### as for translation.api only google&baidu provided (default is baidu)

#### translation.languageDetection = true means do detection before language so that we could translate documents between from language and target language. (default is true) 

![](https://raw.githubusercontent.com/jianzhichun/vscode-translate/master/img/config.png)

### And you can press CTRL+SHIFT+R to replace selected-text to result after translation.

![](https://raw.githubusercontent.com/jianzhichun/vscode-translate/master/img/replace_show.gif)

## Language List (from google)

You can see [https://cloud.google.com/translate/docs/languages](https://cloud.google.com/translate/docs/languages)

| Language        | ISO-639-1 Code  
| ------------- |:-------------: |
| Afrikaans | af |
| Albanian | sq |
| Amharic | am |
| Arabic | ar |
| Armenian | hy |
| Azeerbaijani | az |
| Basque | eu |
| Belarusian | be |
| Bengali | bn |
| Bosnian | bs |
| Bulgarian | bg |
| Catalan | ca |
| Cebuano | ceb (ISO-639-2) |
| Chichewa | ny |
| Chinese (Simplified) | zh-CN (BCP-47) |
| Chinese (Traditional) | zh-TW (BCP-47) |
| Corsican | co |
| Croatian | hr |
| Czech | cs |
| Danish | da |
| Dutch | nl |
| English | en |
| Esperanto | eo |
| Estonian | et |
| Filipino | tl |
| Finnish | fi |
| French | fr |
| Frisian | fy |
| Galician | gl |
| Georgian | ka |
| German | de |
| Greek | el |
| Gujarati | gu |
| Haitian Creole | ht |
| Hausa | ha |
| Hawaiian | haw (ISO-639-2) |
| Hebrew | iw |
| Hindi | hi |
| Hmong | hmn (ISO-639-2) |
| Hungarian | hu |
| Icelandic | is |
| Igbo | ig |
| Indonesian | id |
| Irish | ga |
| Italian | it |
| Japanese | ja |
| Javanese | jw |
| Kannada | kn |
| Kazakh | kk |
| Khmer | km |
| Korean | ko |
| Kurdish | ku |
| Kyrgyz | ky |
| Lao | lo |
| Latin | la |
| Latvian | lv |
| Lithuanian | lt |
| Luxembourgish | lb |
| Macedonian | mk |
| Malagasy | mg |
| Malay | ms |
| Malayalam | ml |
| Maltese | mt |
| Maori | mi |
| Marathi | mr |
| Mongolian | mn |
| Burmese | my |
| Nepali | ne |
| Norwegian | no |
| Pashto | ps |
| Persian | fa |
| Polish | pl |
| Portuguese | pt |
| Punjabi | ma |
| Romanian | ro |
| Russian | ru |
| Samoan | sm |
| Scots Gaelic | gd |
| Serbian | sr |
| Sesotho | st |
| Shona | sn |
| Sindhi | sd |
| Sinhala | si |
| Slovak | sk |
| Slovenian | sl |
| Somali | so |
| Spanish | es |
| Sundanese | su |
| Swahili | sw |
| Swedish | sv |
| Tajik | tg |
| Tamil | ta |
| Telugu | te |
| Thai | th |
| Turkish | tr |
| Ukrainian | uk |
| Urdu | ur |
| Uzbek | uz |
| Vietnamese | vi |
| Welsh | cy |
| Xhosa | xh |
| Yiddish | yi |
| Yoruba | yo |
| Zulu | zu |


## Contribution.

[https://github.com/jianzhichun/vscode-translate](https://github.com/jianzhichun/vscode-translate)

## Thanks

[Jesse-Deng](https://github.com/Jesse-Deng)

**Enjoy!**

### 2016/8/28
    init 0.0.1
### 2016/8/29
    init 0.0.2 add proxy support 
### 2016/8/29
    update README.md
### 2017/3/4 
    update to 0.0.4
    add others translation support
    add replace support
### 2017/3/4
    update to 0.0.5
    add google translation optional
### 2017/3/9
    update to 0.1.0
    add language detection support