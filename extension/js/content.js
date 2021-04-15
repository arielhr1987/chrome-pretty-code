(function () {

    "use strict";

    var cm, //Codemirror container
        jfContent,
        pre,
        jfStyleEl,
        slowAnalysisTimeout,
        port,
        startTime = +(new Date()),
        domReadyTime,
        isJsonTime,
        exitedNotJsonTime,
        displayedFormattedJsonTime
    ;

    function ready() {

        domReadyTime = Date.now();

        // First, check if it's a PRE and exit if not
        var bodyChildren = document.body.childNodes;
        pre = bodyChildren[0];
        var codeLength = (pre && pre.innerText || "").length;

        if (bodyChildren.length !== 1 || pre.tagName !== 'PRE' || codeLength > (3000000)) {
            /**
             * This page is not a plain text or is longer than 3MB
             */
            console.log('This page is not a plain text or is longer than 3MB, exiting.');
            console.log(bodyChildren.length, pre.tagName, pre.innerText.length);
        } else {
            /**
             * This is a 'plain text' page (just a body with one PRE child).
             */

            /**
             * Lets determine the language
             */
            var toolbar = document.createElement('div');
            toolbar.id = 'pretty-code-toolbar';
            document.body.prepend(toolbar);

            var codemirrorDiv = document.createElement('div');
            codemirrorDiv.id = 'pretty-code';
            //codemirrorDiv.classList.add('CodeMirror', 'CodeMirror-wrap', 'cm-s-default');
            document.body.appendChild(codemirrorDiv);

            chrome.runtime.sendMessage({
                action: "load-css"
            }, function (res) {
                console.log('Load css');
                console.log(res);
            });

            chrome.runtime.sendMessage({
                action: "load-codemirror"
            }, function (res) {
                console.log('load codemirror');
                console.log(res);
                console.log(CodeMirror);
                // var myCodeMirror = CodeMirror.runMode(pre.innerText,
                //     "javascript",
                //     codemirrorDiv, {
                //         lineNumbers: true
                //     });

                pre.hidden = true;

                var myCodeMirror = CodeMirror(codemirrorDiv, {
                    value: pre.innerText,
                    mode: "javascript",
                    lineWrapping: false,
                    lineNumbers: true,
                    //readOnly: 'nocursor', //true
                    showCursorWhenSelecting: true,
                    viewportMargin: Infinity

                });

                myCodeMirror.setOption("theme", 'monokai'); //cobalt, darcula, icecoder, monokai, panda-syntax, yonce

                // myCodeMirror.setSelection({
                //         'line':myCodeMirror.firstLine(),
                //         'ch':0,
                //         'sticky':null
                //     },{
                //         'line':myCodeMirror.lastLine(),
                //         'ch':0,
                //         'sticky':null
                //     },
                //     {scroll: false});
                // //auto indent the selection
                // myCodeMirror.indentSelection("smart");
            });

            return;

            /**
             * Lets add codemirror
             */
            var codemirrorStyle = document.createElement('link');
            codemirrorStyle.rel = 'stylesheet';
            codemirrorStyle.href = chrome.extension.getURL('lib/codemirror.css');
            document.head.appendChild(codemirrorStyle);

            var codemirrorScript = document.createElement('script');
            codemirrorScript.src = chrome.runtime.getURL('lib/codemirror.js');
            document.head.appendChild(codemirrorScript);

            var codemirrorDiv = document.createElement('div');
            codemirrorDiv.id = 'pretty-code';
            document.body.appendChild(codemirrorDiv);

            return;

            // It might be JSON/JSONP, or just some other kind of plain text (eg CSS).

            // Hide the PRE immediately (until we know what to do, to prevent FOUC)
            pre.hidden = true;
            //console.log('It is text; hidden pre at ') ;
            slowAnalysisTimeout = setTimeout(function () {
                pre.hidden = false;
            }, 1000);

            // Send the contents of the PRE to the BG script
            // Add jfContent DIV, ready to display stuff
            jfContent = document.createElement('div');
            jfContent.id = 'jfContent';
            document.body.appendChild(jfContent);

            // Post the contents of the PRE
            port.postMessage({
                type: "SENDING TEXT",
                text: pre.innerText,
                length: jsonLength
            });

            // Now, this script will just wait to receive anything back via another port message. The returned message will be something like "NOT JSON" or "IS JSON"
        }

        document.addEventListener('keyup', function (e) {
            if (e.keyCode === 37 && typeof buttonPlain !== 'undefined') {
                buttonPlain.click();
            } else if (e.keyCode === 39 && typeof buttonFormatted !== 'undefined') {
                buttonFormatted.click();
            }
        });
    }

    document.addEventListener("DOMContentLoaded", ready, false);

    var mac = navigator.platform.indexOf('Mac') !== -1,
        modKey;
    if (mac)
        modKey = function (ev) {
            return ev.metaKey;
        };
    else
        modKey = function (ev) {
            return ev.ctrlKey;
        };

})();