/**
 * Created by YULIYAN on Apr/2018
 * v 0.2
 */
/*jshint esversion:6*/
/* globals window, document, console, clearTimeout, setTimeout  */
"use strict";
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
(function (cbdPath) {
    if (!cbdPath) {
        return;
    }

    /** Log function for debugging
     * will log if session storage has '_qa' key
     * @param {type} [STRING___info_warning_danger_success]
     * @param {msg} [STRING___the_text_to_display_in_console_log_]
     */
    var _log = function (msg, type) {
        if (window.sessionStorage && window.sessionStorage.getItem('_qa')) {
            var cstyles = [
                'background:' +
                (type === 'info' ?
                    'aqua' :
                    type === 'danger' ?
                    'red' :
                    type === 'success' ? 'green' : 'yellow'),
                'color:' + (type === 'warning' || type === 'info' ? '#333' : '#fff'),
                'padding: 2px 8px'
            ].join(';');
            console.log('%c' + msg + '', cstyles);
        }
    };

    if (
        window.sessionStorage &&
        !window.sessionStorage.getItem('_asdasdqweqwe')
    ) {
        var easyPrivacyListPresent = false,
            easyListPresent = false,
            bdy = document.body || document.documentElement,
            timeout = 500, // in ms
            testImage = document.createElement('img'), // to test for easyPrivacyList
            testDiv = document.createElement('div'); // to test for easyList
        testImage.src = '/analytics-js/someImage.png';
        testImage.height = 1;
        testImage.width = 1;
        testImage.style =
            'position : absolute;bottom:0;z-index : -999;visibility: hidden;display :inline-block;';
        testDiv.style =
            'position : absolute;bottom:0;z-index : -999;visibility: hidden;width:1px;height :1px;';
        testDiv.innerHTML = '<p>&nbsp;</p>'; // IE fix
        testDiv.id = 'ADSPACE02';
        testDiv.setAttribute(
            'class',
            'ADBox AD_area NewsAds ProductAd V7-advert ad--MAIN'
        );
        bdy.appendChild(testImage);
        bdy.appendChild(testDiv);

        /*
         * setTimeout method is needed since some content blockers fail to do their change
         * before I send the request to the server for unknown reasons(slow computer/browser etc.)
         * I have found it works as expected when I give them some time to scrape the DOM and do their blocking
         */
        window.setTimeout(function () {
            _log('testImage.offsetHeight ' + testImage.offsetHeight, 'info');
            _log('testDiv.offsetHeight ' + testDiv.offsetHeight, 'info');
            if (testImage.offsetHeight === 0) {
                easyPrivacyListPresent = true;
            }
            if (testDiv.offsetHeight === 0) {
                easyListPresent = true;
            }
            _log('easyPrivacyList Enabled? ' + easyPrivacyListPresent, 'info');
            _log('easyList Enabled? ' + easyListPresent, 'info');
            // remove the created test elements
            testImage.parentNode.removeChild(testImage); // IE fix
            testDiv.parentNode.removeChild(testDiv); // IE fix

            /** do ajax GET/POST
      * use your own ajax method if you wish, I am using native XMLHttpRequest
      * @param {cbdPath} [STRING___path_to_server_file_or_route_to_handle_the_GA_call_from_the_server]
_     */
            var url = cbdPath,
                client = new XMLHttpRequest(),
                method = 'POST',
                args = 'el=' + (easyPrivacyListPresent || easyListPresent ? 'true' : 'false') +
                        '&_csrf=' + document.body.getAttribute('data-csrf-token'); // if needed
            if (method === 'GET') {
              client.open(method, url + '?' + args, true);
              client.send();
            }else{
                client.open(method, url, true);
                client.setRequestHeader( 'Content-type', 'application/x-www-form-urlencoded' ); // if needed
                client.send(args);
            }

            window.sessionStorage.setItem('_asdasdqweqwe', 'true');
        }, timeout); // end timeout
    }
})(cbdPath);