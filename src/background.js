// http://developer.chrome.com/extensions/devguide.html

chrome.browserAction.onClicked.addListener( function( tab ) {
	// 打开工具网页
	// 这是本工具在 GitHub 上通过 gh-pages 发布的网址
	chrome.tabs.create({ url: 'http://maq128.github.io/tae-js-testbed/' }, function( tab ) {
	});
});

chrome.runtime.onMessage.addListener( function( message, sender, sendResponse ) {
	// 复制指定字符串到剪贴板
	if ( message && message.action == 'copy' ) {
		var input = document.createElement( 'input' );
		document.body.appendChild( input );
		input.value = message.text;
		input.focus();
		input.select();
		document.execCommand( 'Copy', false, null );
		document.body.removeChild( input );

		sendResponse( true );
	}
});
