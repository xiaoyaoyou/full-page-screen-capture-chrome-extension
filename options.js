document.getElementById('confirm-btn').addEventListener('click', function() {
    configConfirm();
});

var eBeginTime = document.getElementById('begin-time');
var eEndTime = document.getElementById('end-time');
var eCaptureConfig = document.getElementById('capture-config');
var eLoadingTime = document.getElementById('loading-time');

chrome.storage.sync.get(['metricBeginTimestamp', 'metricEndTimestamp', 'metricCaptureConfig', 'metricPageLoadingTime'], function(data) {
    eBeginTime.value = data.metricBeginTimestamp ? data.metricBeginTimestamp : '';
    eEndTime.value = data.metricEndTimestamp ? data.metricEndTimestamp : '';
    eCaptureConfig.value = data.metricCaptureConfig;
    eLoadingTime.value = data.metricPageLoadingTime ? data.metricPageLoadingTime : '';
});

function configConfirm() {
    let beginTimestamp = eBeginTime.value.trim();
    let endTimestamp = eEndTime.value.trim();
    let captureConfig = eCaptureConfig.value.trim();
    let pageLoadingTime = eLoadingTime.value.trim();

    chrome.storage.sync.set({metricBeginTimestamp: beginTimestamp, metricEndTimestamp: endTimestamp,
        metricPageLoadingTime: pageLoadingTime, metricCaptureConfig: captureConfig}, function() {
    });
}