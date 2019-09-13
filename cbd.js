/**
 * Created by YULIYAN on Apr/2018
 * v 3.0 ...
 */
/*jshint esversion:6*/
/* globals window, document, console, clearTimeout, setTimeout  */
const VERSION = "3.0";
/*
 * Detect and report if content blockers are in effect on client browser.
 *
 * Script to run after DOM has loaded, at the end of the page to minimize any performance impact (should be negligible).
 */

/**
 * Using IIFE to avoid polluting the global scope.
 * IE complaints about strict mode , therefore omiting it.
 * @param {cbdPath}  [STRING____the_server_url_to_call]
 */
function detectCB(cbdPath, ajaxmethod, tout) {
    if (!cbdPath) {
        return;
    }

    /** Log function for debugging
     * will log if session storage has '_qa' key
     * @param {msg} [STRING___the_text_to_display_in_console_log_]
     */
    const log = function (msg) {
        if ((window.sessionStorage && window.sessionStorage.getItem('_qa')) || document && document.cookie && document.cookie.match(/_qa/ig)) {
            var cstyles = [
                'background: aqua',
                'color:#333',
                'padding: 2px 8px;'
            ].join(';');
            console.log('%cCBDetection v[' + VERSION + ']: ' + msg + '', cstyles);
        }
    };
    const sessionCookie = function (name, val) {
        let date = new Date();
        date.setTime(date.getTime() + (0.35 * 60 * 60 * 1000));
        document.cookie = name + '=' + val + '; expires=' + date.toUTCString() + ';path=/';
    }
    try {
        if (typeof XMLHttpRequest !== 'function') {
            log('XMLHttpRequest is undefined');
            return;
        }
        if (typeof document.getElementsByTagName !== 'function') {
            log('getElementsByTagName is not available');
            return;
        }
        if (typeof document.createElement !== 'function') {
            log('createElement is not available');
            return;
        }
        if (
            (window.sessionStorage && !window.sessionStorage.getItem('_asdasdqweqwe')) ||
            (document.cookie && !document.cookie.match("_asdasdqweqwe"))
        ) {
            if (typeof XMLHttpRequest !== 'function') {
                log('XMLHttpRequest is undefined');
                return;
            }
            if (typeof document.getElementsByTagName !== 'function') {
                log('getElementsByTagName is not available');
                return;
            }
            if (typeof document.createElement !== 'function') {
                log('createElement is not available');
                return;
            }
            let easyPrivacyListPresent = false;
            const bdy = document.getElementsByTagName('body')[0] || document.documentElement;
            const timeout = tout;
            const testImage = document.createElement('img');
            const testImage2 = document.createElement('img');
            const baseUrl = '/account';
            testImage.src = `${baseUrl}/images/analytics-js/application.png`;
            testImage.height = 1;
            testImage.width = 1;
            testImage.id = 'ADSLOT_1';
            testImage.setAttribute('class', 'FooterAds rt-ad rt-ad-body');
            testImage.style = 'position : absolute;bottom:0;z-index : -999;visibility: hidden;';
            testImage2.src = `${baseUrl}/images/webanalytics.png`;
            testImage2.height = '1';
            testImage2.width = '1';
            testImage2.style = 'position : absolute;bottom:0;left:0;z-index : -999;visibility: hidden;';
            testImage2.id = 'ADSPACE01';
            testImage2.setAttribute('class', 'ProductAd rt-ad rt-ad-body');
            if (testImage) {
                bdy.appendChild(testImage);
            }
            if (testImage2) {
                bdy.appendChild(testImage2);
            }

            /*
             * setTimeout method is needed since some content blockers fail to do their change
             * before I send the request to the server for unknown reasons(slow computer/browser etc.)
             * I have found it works as expected when I give them some time to scrape the DOM and do their blocking
             */
            window.setTimeout(function () {
                log(`testImage.offsetHeight ${testImage && testImage.offsetHeight}`);
                log(`testImage2.offsetHeight ${testImage2 && testImage2.offsetHeight}`);
                if (testImage === undefined || testImage2 === undefined ||
                    testImage.offsetHeight === 0 || testImage2.offsetHeight === 0) {
                    easyPrivacyListPresent = true;
                }
                log(`easyPrivacyList Enabled? ${easyPrivacyListPresent}`);
                // remove the created test elements
                if (testImage) {
                    testImage.parentNode.removeChild(testImage);
                }
                if (testImage2) {
                    testImage2.parentNode.removeChild(testImage2);
                }

                /** do ajax GET/POST
          * use your own ajax method if you wish, I am using native XMLHttpRequest
          * @param {cbdPath} [STRING___path_to_server_file_or_route_to_handle_the_GA_call_from_the_server]
    _     */
                var url = cbdPath,
                    client = new XMLHttpRequest(),
                    method = ajaxmethod,
                    args = 'cbd=' + (easyPrivacyListPresent ? 'true' : 'false'); // if needed
                if (method === 'GET') {
                    client.open(method, url + '?' + args, true);
                    client.send();
                } else {
                    client.open(method, url, true);
                    client.setRequestHeader('Content-type', 'application/x-www-form-urlencoded'); // if needed
                    client.send(args);
                }

                window && window.sessionStorage && document && document.cookie ? (window.sessionStorage.setItem('_asdasdqweqwe', 'true'), sessionCookie("_asdasdqweqwe", "true")) : null;
            }, timeout); // end timeout
        }

    } catch (error) {
        log(error);
    }
}
/**
 * Usage
 * Provide the url path for the Ajax call, the type of call GET/POST and the timeout in ms
 * EXAMPLE:   detectCB("xyz", "GET",750);
 */
