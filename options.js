document.getElementById('confirm-btn').addEventListener('click', function() {
    configConfirm();
});

function configConfirm() {
    let beginTimestamp = document.getElementById('begin-time').value.trim();
    let endTimestamp = document.getElementById('end-time').value.trim();
    let captureConfig = document.getElementById('capture-config').value.trim().replace('\n', '');

    chrome.storage.sync.set({metricBeginTimestamp: beginTimestamp, metricEndTimestamp: endTimestamp, metricCaptureConfig: captureConfig}, function() {
        console.log(beginTimestamp);
        console.log(endTimestamp);
        console.log(captureConfig);
    })
}