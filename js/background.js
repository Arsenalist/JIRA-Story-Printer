// Called when the url of a tab changes.
function checkForValidUrl(tabId, changeInfo, tab) {
	  // If the letter 'g' is found in the tab's URL...
	  if (tab.url.indexOf('.atlassian.net/browse') > -1) {
	    // ... show the page action.
	    chrome.pageAction.show(tabId);
	  }
	};
	
	// Listen for any changes to the URL of any tab.
chrome.tabs.onUpdated.addListener(checkForValidUrl);

chrome.pageAction.onClicked.addListener(function(tab) {
	chrome.tabs.sendMessage(tab.id, {greeting: "hello"}, function(response) {
  	});
});