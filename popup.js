// Copyright (c) 2012,2013 Peter Coles - http://mrcoles.com/ - All rights reserved.
// Use of this source code is governed by the MIT License found in LICENSE


//
// State fields
//

var currentTab, // result of chrome.tabs.query of current active tab
    resultWindowId; // window id for putting resulting images



const ITEM_LEVEL_FIRST = 1;
const ITEM_LEVEL_SECOND = 2;

var currMetricReportCfg = [];

var itemProcessIndex = 0;
var metricReport = '';
var fromRegExp = new RegExp(/from=[^&]+/, 'i');
var toRegExp = new RegExp(/to=[^&]+/, 'i');
var defaultMetricFrom = 'now-7d';
var defaultMetricTo = 'now';
var defaultPageLoadingTime = 30000;
//
// Utility methods
//

function $(id) { return document.getElementById(id); }
function show(id) { $(id).style.display = 'block'; }
function hide(id) { $(id).style.display = 'none'; }

function getFilename(contentURL) {
    //var name = contentURL.split('?')[0].split('#')[0];
    //if (name) {
    //    name = name
    //        .replace(/^https?:\/\//, '')
    //        .replace(/[^A-z0-9]+/g, '-')
    //        .replace(/-+/g, '-')
    //        .replace(/^[_\-]+/, '')
    //        .replace(/[_\-]+$/, '');
    //    name = '-' + name;
    //} else {
    //    name = '';
    //}
    //return 'screencapture' + name + '-' + Date.now() + '.png';
    return 'metric-img-' + itemProcessIndex + '.png';
}


//
// Capture Handlers
//


function displayCaptures(filenames) {
    if (!filenames || !filenames.length) {
        show('uh-oh');
        return;
    }

    _displayCapture(filenames);
}


function _displayCapture(filenames, index) {
    index = index || 0;

    var filename = filenames[index];
    var last = index === filenames.length - 1;

    if (currentTab.incognito && index === 0) {
        // cannot access file system in incognito, so open in non-incognito
        // window and add any additional tabs to that window.
        //
        // we have to be careful with focused too, because that will close
        // the popup.
        chrome.windows.create({
            url: filename,
            incognito: false,
            focused: last
        }, function(win) {
            resultWindowId = win.id;
        });
    } else {
        let theImgFileName = filename;
        chrome.tabs.create({
            url: filename,
            //active: last,
            active: false,
            windowId: resultWindowId,
            openerTabId: currentTab.id,
            index: (currentTab.incognito ? 0 : currentTab.index) + 1 + index
        }, function(theTab) {
            if(last) {
                let pureFileNameArray = theImgFileName.split(/\//);
                let pureFileName = pureFileNameArray[pureFileNameArray.length - 1];
                let fileAbsolutePath = 'metrics-biz-img\/' + new Date().toJSON().slice(0,10) + '\/' + pureFileName;
                chrome.downloads.download({url: theImgFileName, filename: fileAbsolutePath, conflictAction: 'overwrite'}, function(downloadId){
                    setTimeout(function() {
                        chrome.tabs.remove(theTab.id, function() {
                            //console.log('remove tab , tab id is ' + theTab.id);
                        });
                    }, defaultPageLoadingTime <= 5000 ? (defaultPageLoadingTime - 2000) : 5000);

                    metricReport += '图片名称: ' + pureFileName + '\n';
                    itemProcessIndex ++;
                    metricReport += '\n';
                    progress(itemProcessIndex / currMetricReportCfg.length);
                    metricItemProcessGo();
                });
            }
        });
    }

    if (!last) {
        _displayCapture(filenames, index + 1);
    }
}


function errorHandler(reason) {
    show('uh-oh'); // TODO - extra uh-oh info?
}


function progress(complete) {
    if (complete === 0) {
        // Page capture has just been initiated.
        show('loading');
    }
    else {
        $('bar').style.width = parseInt(complete * 100, 10) + '%';
    }
}


function splitnotifier() {
    show('split-image');
}


//
// start doing stuff immediately! - including error cases
//

//chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
//    var tab = tabs[0];
//    currentTab = tab; // used in later calls to get tab info
//
//    var filename = getFilename(tab.url);
//
//    CaptureAPI.captureToFiles(tab, filename, displayCaptures,
//        errorHandler, progress, splitnotifier);
//});

var doTabCapture = function() {
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        var tab = tabs[0];
        currentTab = tab; // used in later calls to get tab info

        var filename = getFilename(tab.url);

        console.log('---- tab capture begin');

        CaptureAPI.captureToFiles(tab, filename, displayCaptures,
            errorHandler, null, splitnotifier);
    });
};

var doMetricItemProcess = function(metricReportItem) {
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        chrome.tabs.update(tabs[0].id, {active: true, url: metricReportItem.url}, function(newTab) {
            let thePageLoadingTime = metricReportItem.loadingTime ? metricReportItem.loadingTime : defaultPageLoadingTime;
            setTimeout(function() {
                doTabCapture();
            }, thePageLoadingTime);
            showProcessTip('waiting for the page of [' + metricReportItem.url + '] loading, it will take ' + thePageLoadingTime / 1000 + ' seconds');
        });
    });
};

var metricItemProcessGo = function() {
    while (itemProcessIndex < currMetricReportCfg.length) {
        let theItem = currMetricReportCfg[itemProcessIndex];
        metricReport += theItem.title + (theItem.level === ITEM_LEVEL_FIRST ? '\n' : '');
        if(theItem.url) {
            metricReport += '(' + theItem.url + ')' + '\n';
            doMetricItemProcess(theItem);
            break;
        }else {
            itemProcessIndex++;
            metricReport += '\n';
        }
    }

    if(itemProcessIndex >= currMetricReportCfg.length) {
        show('metric-container');
        $('metric-result').value = metricReport;
        showProcessTip('处理完成！！');
        hide('loader-bar');
    }
};

var metricCfgProcess= function() {
    currMetricReportCfg.forEach(function(i) {
        if(i) {
            metricTitleProcess(i);
            metricUrlProcess(i);
        }
    })
};

var metricTitleProcess = function(theItem) {
    if(theItem.level === ITEM_LEVEL_FIRST) {
        theItem.title = '# ' + theItem.title;
    }else if(theItem.level === ITEM_LEVEL_SECOND) {
        theItem.title = '## ' + theItem.title;
    }
};

var metricUrlProcess = function(theItem) {
    if(theItem.url) {
        theItem.url = theItem.url.replace(fromRegExp, 'from=' + defaultMetricFrom).replace(toRegExp, 'to=' + defaultMetricTo);
    }
};

var eProcessPopTip = $('process-tip');
var showProcessTip = function(tip) {
    eProcessPopTip.innerHTML = tip;
};

chrome.storage.sync.get(['metricBeginTimestamp', 'metricEndTimestamp', 'metricCaptureConfig', 'metricPageLoadingTime'], function(data) {
    defaultMetricFrom = data.metricBeginTimestamp ? data.metricBeginTimestamp : defaultMetricFrom;
    defaultMetricTo = data.metricEndTimestamp ? data.metricEndTimestamp : defaultMetricTo;
    defaultPageLoadingTime = data.metricPageLoadingTime ? data.metricPageLoadingTime : defaultPageLoadingTime;
    if(defaultPageLoadingTime < 5000) {
        defaultPageLoadingTime = 5000;
    }
    currMetricReportCfg = data.metricCaptureConfig ? JSON.parse(data.metricCaptureConfig) : currMetricReportCfg;

    metricCfgProcess();
    metricItemProcessGo();
});






