'use strict';

chrome.runtime.onInstalled.addListener(function() {
  chrome.storage.sync.set({theUrl: 'www.google.com'}, function() {
    console.log('www.google.com');
  });
});
