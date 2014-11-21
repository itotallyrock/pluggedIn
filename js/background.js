chrome.tabs.onUpdated.addListener(
	function(tabId, changeInfo, tab){
		if(tab.url.indexOf('plug.dj') > -1){
			chrome.pageAction.show(tabId);
		}
	}
);