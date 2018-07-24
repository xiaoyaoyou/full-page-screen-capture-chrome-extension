// Copyright (c) 2012,2013 Peter Coles - http://mrcoles.com/ - All rights reserved.
// Use of this source code is governed by the MIT License found in LICENSE


//
// State fields
//

var currentTab, // result of chrome.tabs.query of current active tab
    resultWindowId; // window id for putting resulting images

var MetricReportItem = {
    level: 1,
    title: '',
    url: '',

    createNew: function(level, title, url) {
        var obj = {};
        obj.level = level;
        obj.title = title;
        obj.url = url;

        return obj;
    }
};

const ITEM_LEVEL_FIRST = 1;
const ITEM_LEVEL_SECOND = 2;

var skeleton = [
    MetricReportItem.createNew(1, '总结', ''),
    MetricReportItem.createNew(1, '业务metrics', ''),
    MetricReportItem.createNew(2, '微信', 'http://metrics-base.intra.yeshj.com/dashboard/db/xiao-xi-zhong-xin-ye-wu-shu-ju-wei-xin?from=1531670400000&orgId=11&refresh=5s&to=1532275199999'),
    MetricReportItem.createNew(2, '短信', 'http://metrics-base.intra.yeshj.com/dashboard/db/xiao-xi-zhong-xin-ye-wu-shu-ju-duan-xin?orgId=11&from=1531670400000&to=1532275199999')
];

var itemProcessIndex = 0;
var metricReport = '';
//
// Utility methods
//

function $(id) { return document.getElementById(id); }
function show(id) { $(id).style.display = 'block'; }
function hide(id) { $(id).style.display = 'none'; }


function getFilename(contentURL) {
    var name = contentURL.split('?')[0].split('#')[0];
    if (name) {
        name = name
            .replace(/^https?:\/\//, '')
            .replace(/[^A-z0-9]+/g, '-')
            .replace(/-+/g, '-')
            .replace(/^[_\-]+/, '')
            .replace(/[_\-]+$/, '');
        name = '-' + name;
    } else {
        name = '';
    }
    return 'screencapture' + name + '-' + Date.now() + '.png';
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
        }, function() {
            if(last) {
                chrome.downloads.download({url: theImgFileName, filename: 'metrics-biz-img\\' + Date.now() + '.png', conflictAction: 'overwrite'}, function(downloadId){
                    console.log(currentTab.url + ' capture finished, the filename is ' + filename);

                    metricReport += '图片路径: ' + theImgFileName + '\n';
                    itemProcessIndex ++;
                    metricReport += '\n';
                    progress(itemProcessIndex / skeleton.length);
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

        CaptureAPI.captureToFiles(tab, filename, displayCaptures,
            errorHandler, null, splitnotifier);
    });
};

var doMetricItemProcess = function(metricReportItem) {
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        chrome.tabs.update(tabs[0].id, {active: true, url: metricReportItem.url}, function(newTab) {
            setTimeout(function() {
                doTabCapture();
            }, 20000);
        });
    });
};

var metricItemProcessGo = function() {
    while (itemProcessIndex < skeleton.length) {
        let theItem = skeleton[itemProcessIndex];
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

    if(itemProcessIndex >= skeleton.length) {
        show('metric-container');
        $('metric-result').value = metricReport;
        console.log('metricReport is ' + metricReport);
    }
};

chrome.storage.sync.get(['metricBeginTimestamp', 'metricEndTimestamp', 'metricCaptureConfig'], function(data) {
    console.log('data is ' + JSON.stringify(data));
    if(data.metricCaptureConfig) {
        skeleton = data.metricCaptureConfig;
    }

    metricItemProcessGo();
});





