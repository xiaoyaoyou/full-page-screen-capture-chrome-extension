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

var currMetricReportCfg = [
    MetricReportItem.createNew(1, '总结', ''),
    MetricReportItem.createNew(1, '业务metrics', ''),
    MetricReportItem.createNew(2, '微信', 'http://metrics-base.intra.yeshj.com/dashboard/db/xiao-xi-zhong-xin-ye-wu-shu-ju-wei-xin?from=1531670400000&orgId=11&refresh=5s&to=1532275199999'),
    MetricReportItem.createNew(2, '短信', 'http://metrics-base.intra.yeshj.com/dashboard/db/xiao-xi-zhong-xin-ye-wu-shu-ju-duan-xin?orgId=11&from=1531670400000&to=1532275199999'),
    MetricReportItem.createNew(2, '邮件', 'http://metrics-base.intra.yeshj.com/dashboard/db/xiao-xi-zhong-xin-ye-wu-shu-ju-you-jian?refresh=15m&orgId=11&from=1531670400000&to=1532275199999'),
    MetricReportItem.createNew(1, '机器（应用、中间件、数据库）\n 机器负载 \n CPU 使用率 \n 内存使用率 \n 磁盘使用率 \n网络流量', ''),
    MetricReportItem.createNew(2, '微信', 'http://10.10.50.100:3006/dashboard/db/xiao-xi-zhong-xin-wechat?orgId=1&from=1531670400000&to=1532275199999'),
    MetricReportItem.createNew(2, '短信', 'http://10.10.50.100:3006/dashboard/db/xiao-xi-zhong-xin-duan-xin?orgId=1&from=1531670400000&to=1532275199999'),
    MetricReportItem.createNew(2, '模版消息', 'http://10.10.50.100:3006/dashboard/db/xiao-xi-zhong-xin-mo-ban-xiao-xi?orgId=1&from=1531670400000&to=1532275199999'),
    MetricReportItem.createNew(2, '应用推送', 'http://10.10.50.100:3006/dashboard/db/xiao-xi-zhong-xin-app_push?orgId=1&from=1531670400000&to=1532275199999'),
    MetricReportItem.createNew(2, '邮件', 'http://10.10.50.100:3006/dashboard/db/xiao-xi-zhong-xin-you-jian?orgId=1&from=1531670400000&to=1532275199999'),
    MetricReportItem.createNew(2, 'TTS', 'http://10.10.50.100:3006/dashboard/db/xiao-xi-zhong-xin-tts?orgId=1&from=1531670400000&to=1532275199999'),
    MetricReportItem.createNew(2, '用户层通知中心', 'http://10.10.50.100:3006/dashboard/db/xiao-xi-zhong-xin-yong-hu-ceng-tong-zhi-zhong-xin?orgId=1&from=1531670400000&to=1532275199999'),
    MetricReportItem.createNew(1, '网关（API Gateway）', ''),
    MetricReportItem.createNew(2, '周期内站点访问量，状态码数量，超时数据', 'http://elk.yeshj.com/#dashboard/temp/AWTBkff2ADTX0K9c8kx2'),
    MetricReportItem.createNew(2, 'API 调用日志 \n * n 天内每天总数据情况以及 error, warn, info 数据占比 \n * error 排行 top 7 \n * warn 排行 top 7 \n 7 天内每天总数据情况以及 error, warn, info 数据占比', 'http://elk.yeshj.com/#dashboard/temp/AWTBkymRADTX0K9c8k8k'),
    MetricReportItem.createNew(2, 'error 排行 top 7', 'ttp://elk.yeshj.com/#dashboard/temp/AWTBk-jYADTX0K9c8lCu'),
    MetricReportItem.createNew(1, 'Redis', 'http://metrics-base.intra.yeshj.com/dashboard/db/shuang-zhong-xin-redis?refresh=5s&orgId=1&from=now-7d&to=now&var-host=redis-message-base.intra.yeshj.com'),
    MetricReportItem.createNew(1, 'MQ', ''),
    MetricReportItem.createNew(2, '微信', 'http://metrics-base.intra.yeshj.com/dashboard/db/rabbitmq-notifycenter-queue?refresh=30s&orgId=1&from=1531670400000&to=1532275199999&var-host=All&var-vhost=All&var-queue=base.notify.wechat.applet.q&var-queue=base.notify.wechat.group.q&var-queue=base.notify.wechat.qq.q&var-queue=base.notify.wechat.v1.q&var-queue=base.notify.wechat.v2.q'),
    MetricReportItem.createNew(2, '短信', 'http://metrics-base.intra.yeshj.com/dashboard/db/rabbitmq-notifycenter-queue?refresh=30s&orgId=1&var-host=All&var-vhost=All&var-queue=base.notify.sms.high.q&var-queue=base.notify.sms.low.q&var-queue=base.notify.sms.medium.q&from=1531670400000&to=1532275199999'),
    MetricReportItem.createNew(2, '其它', 'http://metrics-base.intra.yeshj.com/dashboard/db/rabbitmq-notifycenter-queue?refresh=30s&orgId=1&from=1531670400000&to=1532275199999&var-host=All&var-vhost=All&var-queue=base.notify.push.delay.q&var-queue=base.notify.push.javaapp.q&var-queue=base.notify.push.javacc.q&var-queue=base.notify.push.javatemplate.q&var-queue=base.notify.push.msgcache.q&var-queue=base.postoffice.multi.msg.push.q&var-queue=mail.exchange.q&var-queue=mail.normal.q&var-queue=mail.postfix.q'),
    MetricReportItem.createNew(1, 'JVM', ''),
    MetricReportItem.createNew(2, '短信', 'http://metrics-base.intra.yeshj.com/dashboard/db/jvm-notifycenter-sms-job-v170911-1624?from=1531670400000&orgId=2&refresh=1m&to=1532275199999'),
    MetricReportItem.createNew(2, '模版消息', 'http://metrics-base.intra.yeshj.com/dashboard/db/jvm-notifycenter-template-job-v170911-1624?refresh=1m&orgId=2&from=1531670400000&to=1532275199999'),
    MetricReportItem.createNew(2, '应用推送', 'http://metrics-base.intra.yeshj.com/dashboard/db/jvm-notifycenter-apppush-v170911-1624?refresh=1m&orgId=2&from=1531670400000&to=1532275199999'),
    MetricReportItem.createNew(2, '邮件', 'http://metrics-base.intra.yeshj.com/dashboard/db/jvm-notifycenter-mail-job-v170911-1624?orgId=2&from=1531670400000&to=1532275199999'),
    MetricReportItem.createNew(2, '用户层通知中心', 'http://metrics-base.intra.yeshj.com/dashboard/db/jvm-notifycenter-postoffice-v170809-1457?orgId=2&from=1531065600000&to=1531670399000'),
    MetricReportItem.createNew(1, 'DB', 'http://10.10.60.81/graph/dashboard/db/mysql-overview?refresh=1m&orgId=5&from=1531065600000&to=1531670399000&var-interval=1s&var-host=10.10.60.101')
];

var itemProcessIndex = 0;
var metricReport = '';
var fromRegExp = new RegExp(/from=[^&]+/, 'i');
var toRegExp = new RegExp(/to=[^&]+/, 'i');
var currMetricFrom = 'now-7d';
var currMetricTo = 'now';
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
        }, function(theTab) {
            if(last) {
                chrome.downloads.download({url: theImgFileName, filename: 'metrics-biz-img\\' + Date.now() + '.png', conflictAction: 'overwrite'}, function(downloadId){
                    setTimeout(function() {
                        chrome.tabs.remove(theTab.id, function() {
                            console.log('remove tab , tab id is ' + theTab.id);
                        });
                    }, 5000);

                    metricReport += '图片路径: ' + theImgFileName + '\n';
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
            showProcessTip('等待 ' + metricReportItem.url + ' 完成加载');
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

var metricUrlProcess = function() {
    currMetricReportCfg.forEach(function(i) {
        if(i && i.url) {
            i.url = i.url.replace(fromRegExp, 'from=' + currMetricFrom).replace(toRegExp, 'to=' + currMetricTo);
        }
    })
};

var eProcessPopTip = $('process-tip');
var showProcessTip = function(tip) {
    eProcessPopTip.innerHTML = tip;
};

chrome.storage.sync.get(['metricBeginTimestamp', 'metricEndTimestamp', 'metricCaptureConfig'], function(data) {
    currMetricFrom = data.metricBeginTimestamp ? data.metricBeginTimestamp : currMetricFrom;
    currMetricTo = data.metricEndTimestamp ? data.metricEndTimestamp : currMetricTo;
    if(data.metricCaptureConfig) {
        currMetricReportCfg = typeof data.metricCaptureConfig === 'string' ? JSON.parse(data.metricCaptureConfig) : data.metricCaptureConfig;
    }

    metricUrlProcess();
    metricItemProcessGo();
});






