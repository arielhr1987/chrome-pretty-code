/**
 * Background
 */
/*global chrome, console */
(function () {

    "use strict";

    console.log('background');
    /**
     * Listen for events coming from content script
     */
    chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
        var tabId = sender.tab ? sender.tab.id : null;

        switch (message.action) {
            case 'load-codemirror':

                // chrome.tabs.executeScript(tabId, {
                //     file: 'codemirror/lib/codemirror.js'
                // }, function () {
                //     chrome.tabs.executeScript(tabId, {
                //         file: 'codemirror/addon/runmode/runmode.js'
                //     }, function () {
                //         chrome.tabs.executeScript(tabId, {
                //             file: 'codemirror/mode/javascript/javascript.js'
                //         }, function () {
                //             sendResponse({action: "codemirror-loaded"});
                //             return true;
                //         });
                //     });
                // });

                chrome.tabs.executeScript(tabId, {
                    file: 'codemirror/lib/codemirror.js'
                }, function () {
                    chrome.tabs.executeScript(tabId, {
                        file: 'codemirror/mode/javascript/javascript.js'
                    }, function () {
                        sendResponse({action: "codemirror-loaded"});
                        return true;
                    });
                });

                return true;
                break;
            case "load-css":
                let r = chrome.tabs.insertCSS(tabId, {
                    file: "css/style.css"
                }, function () {
                    chrome.tabs.insertCSS(tabId, {
                        file: "codemirror/lib/codemirror.css"
                    }, function () {
                        chrome.tabs.insertCSS(tabId, {
                            file: "codemirror/theme/monokai.css"
                        }, function (re) {
                            sendResponse({action: "css-loaded", resp: re});
                            return true;
                        });
                    });
                });
                return true;
                break;
            case "get_options":
                sendResponse(options);
                break;
            case "found":
                _gaq.push(["_trackEvent", message.type, message.action]);
                break;
            case "beautify":
                _gaq.push(["_trackEvent", message.type, message.action, message.duration]);
                break;
            case "insert_base_css":
                chrome.tabs.insertCSS(tabId, {
                    file: "codemirror/lib/codemirror.css"
                }, function () {
                    chrome.tabs.insertCSS(tabId, {
                        file: "content-script.css"
                    }, sendResponse);
                });
                return true;
            case "insert_theme":
                chrome.tabs.insertCSS(tabId, {
                    file: "codemirror/theme/" + message.theme + ".css"
                }, sendResponse);
                return true;
            case "insert_css":
                chrome.tabs.insertCSS(tabId, {
                    code: message.css
                }, sendResponse);
                return true;
        }
    });
})();
