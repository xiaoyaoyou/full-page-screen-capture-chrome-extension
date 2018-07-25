document.getElementById('confirm-btn').addEventListener('click', function() {
    configConfirm();
});

var eBeginTime = document.getElementById('begin-time');
var eEndTime = document.getElementById('end-time');
var eCaptureConfig = document.getElementById('capture-config');

chrome.storage.sync.get(['metricBeginTimestamp', 'metricEndTimestamp', 'metricCaptureConfig'], function(data) {
    eBeginTime.value = data.metricBeginTimestamp;
    eEndTime.value = data.metricEndTimestamp;
    eCaptureConfig.value = data.metricCaptureConfig;
});

function configConfirm() {
    let beginTimestamp = eBeginTime.value.trim();
    let endTimestamp = eEndTime.value.trim();
    let captureConfig = eCaptureConfig.value.trim();

    chrome.storage.sync.set({metricBeginTimestamp: beginTimestamp, metricEndTimestamp: endTimestamp, metricCaptureConfig: captureConfig}, function() {
    })
}