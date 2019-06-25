/**
 * Created by YULIYAN on Apr/2018
 * v 2.3
 */
/*jshint esversion:6*/
/* globals window, document, console, clearTimeout, setTimeout  */
/*
 * Detect and report if content blockers are in effect on client browser.
 *
 * Script to run after DOM has loaded, at the end of the page to minimize any performance impact (should be negligible).
 */
/**
* Using IIFE to avoid polluting the global scope.
* IE complaints about strict mode , therefore omiting it.
* @param {String} nua [STRING____navigator.userAgent]
* @param {String/Boolean} url [STRING____navigator.userAgent]
*/
(function (nua, url) {
    //
    /**
     * use an image pixel that is loaded from a blocked directory from easyPrivacy list
     * target Chrom/FF only if needed
     * create a folder on the server "analytics-js"
     * create a (transparent)pixel file "someImage.png"
     * create the php file that will handle the analytics call "somerandomnamedlocalfile.php"
     * use a cookie to fire the conversion once in a session
     */
    const GA = "UA-123456789-0";
    try {
        var inProgress = false;
        var version = "2.3";
        //check for problems
        if (typeof nua === "undefined") {
            throw new Error("navigator.userAgent is undefined");
        }
        if (typeof window !== "object") {
            throw new Error("window is undefined");
        }
        if (typeof document !== "object") {
            throw new Error("document is undefined");
        }
        if (typeof XMLHttpRequest !== "function") {
            throw new Error("XMLHttpRequest is undefined");
        }
        if (typeof window.sessionStorage !== "object") {
            if (typeof document.cookie !== "string") {
                throw new Error("sessionStorage & cookie are not available");
            }
        }
        if (typeof document.createElement !== "function") {
            throw new Error("createElement is not available");
        }
        /*
        * {@type} [string] info/warning/danger/success
        * {@msg} [string]
        */
        const _log = function (msg, type) {
            if (document.cookie.match(/_qa/ig) || sessionStorage.getItem("_qa")) {
                let cstyles = [
                    'background:' + (type === 'info' ? 'teal' : type === "danger" ? "red" : type === "success" ? "green" : "yellow")
                    , 'color:' + (type === 'warning' || type === 'info' ? "#eee" : "#fff")
                    , 'padding: 2px 8px'
                ].join(';');
                console.log('%c::WIDGET-content blockers detection v.' + version + ':: ' + msg + '', cstyles);
            }
        };
        /**
         *
         * @param {string} name
         * @param {string} val
         */
        const setSessionCookie = function (name, val) {
            let d = new Date();
            d.setTime(d.getTime() + 1000 * 60 * 60 * 24 * 0.064);
            document.cookie = name + '=' + val + ';path=/;expires=' + d.toUTCString() + ';domain=' + document.domain + ';';
        };//setSessionCookie

        // Set QA cookie and session storage
        //window && window.sessionStorage ? window.sessionStorage.setItem("_qa", "true") : null;
        //document.cookie && !document.cookie.match(/_qa/ig) ? setSessionCookie("_qa", "true") : null;

        if (((window.sessionStorage && !window.sessionStorage.getItem("_asdasdqweqwe")) || !document.cookie.match(/_asdasdqweqwe/ig)) && !inProgress && document.domain && document.domain.match(/tesco/ig)) {
            inProgress = true;
            var easyPrivacyListPresent = false,
                bdy = document.getElementsByTagName("body")[0] || document.documentElement,
                timeout = 750, // in ms
                testImage = document.createElement('img'), // to test easyPrivacyList
                testImage2 = document.createElement('img'); // to test easyPrivacyList

            //
            testImage.src = '/analytics-js/cbd.png';
            testImage.height = 1;
            testImage.width = 1;
            testImage.id = "ADSLOT_1";
            testImage.setAttribute("class", "FooterAds rt-ad rt-ad-body");
            testImage.style = "position : absolute;bottom:0;z-index : -999;visibility: hidden;";
            //
            testImage2.src = "/_webanalytics.png";
            testImage2.height = "1";
            testImage2.width = "1";
            testImage2.style = "position : absolute;bottom:0;left:0;z-index : -999;visibility: hidden;";
            testImage2.id = 'ADSPACE01';
            testImage2.setAttribute("class", "ProductAd rt-ad rt-ad-body");
            //
            testImage ? bdy.appendChild(testImage) : null;
            testImage2 ? bdy.appendChild(testImage2) : null;
            //
            window.setTimeout(function () {
                _log("testImage.offsetHeight " + testImage.offsetHeight, "info");
                _log("testImage2.offsetHeight " + testImage2.offsetHeight, "info");
                if (testImage.offsetHeight === 0 || testImage2.offsetHeight === 0) {
                    easyPrivacyListPresent = true;
                }
                _log('easyPrivacyList Enabled? ' + easyPrivacyListPresent, "info");

                // remove the created test elements
                testImage ? testImage.parentNode.removeChild(testImage) : null;
                testImage2 ? testImage2.parentNode.removeChild(testImage2) : null;

                if (url) {
                    //do ajax POST request to local file here
                    //
                    let client = new XMLHttpRequest();
                    //var url = "./01_yuli_cbd.php";
                    const method = "GET"; // or POST depending on where it will be implemented
                    const args = "v=1&aip=1&ds=web&qt=0" +
                        "&tid=UA-125521677-1" +
                        "&cid=" + (document.cookie.match(/akavpau_tesco_(groceries|secure)=\d+/) && document.cookie.match(/akavpau_tesco_(groceries|secure)=\d+/)[0] ? document.cookie.match(/akavpau_tesco_(groceries|secure)=\d+/)[0].split("=")[1].substr(0, 8) : btoa(navigator.userAgent).substr(8, 16)) +
                        "&t=event" +
                        "&ec=ContentBlockerDetection" +
                        "&ea=nonInteractionEvent" +
                        "&el=" + (easyPrivacyListPresent ? 'sessionWithContentBlocker' : 'sessionWithoutContentBlocker') +
                        "&ua=" + navigator.userAgent +
                        "&dr=" + encodeURIComponent(document.referrer || "") +
                        "&dh=" + encodeURIComponent(document.location.host || "") +
                        "&dp=" + encodeURIComponent(document.location.pathname || "") +
                        "&dt=" + encodeURIComponent(document.title || "");
                    // send (async) the event
                    if (method === "POST") {
                        client.open(method, url, true);
                        client.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
                        client.send(args);
                    } else {
                        client.open(method, url + "?" + args, true);
                        client.send();
                    }
                    // handle response if necessary
                    client.onload = (e) => {
                        if (e.target.status >= 200 && e.target.status < 300) {
                            _log('Response: ' + e.target.response, "success");
                        } else {
                            _log('Status : ' + e.target.statusText, "warning");
                        }
                    };
                    // log error for the request if any
                    client.onerror = (e) => {
                        _log('Error : ' + e.target.statusText, "danger");
                    };
                    //
                    window && window.sessionStorage ? window.sessionStorage.setItem("_asdasdqweqwe", "true") : document && document.cookie ? setSessionCookie("_qa", "true") : null;
                }
                inProgress = false;
            }, timeout);// end timeout
        }
    } catch (error) {
        console && console.error ? console.error("Problem detecting CB: " + error) : null;
        // call error handling script to report the error
    }

})(navigator && navigator.userAgent, false);