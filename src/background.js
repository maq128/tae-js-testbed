// http://developer.chrome.com/extensions/devguide.html

chrome.browserAction.onClicked.addListener( function( tab ) {
	chrome.tabs.create({ url: 'http://maq128.github.io/tae-js-testbed/' }, function( tab ) {
	});
});
