
chrome.webNavigation.onHistoryStateUpdated.addListener(function(tab) {
  // Send a message to the active tab
  chrome.tabs.query({active: true, currentWindow: true}, async function(tabs) {
    var activeTab = await tabs[0];
    await new Promise(resolve => setTimeout(resolve, 2000))
    chrome.tabs.sendMessage(activeTab.id, {"message": "page_changed"});
  });
});