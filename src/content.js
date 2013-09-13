// http://developer.chrome.com/extensions/devguide.html

(function() {
	// 确认存在按钮
	var btn = document.getElementById( 'tae-js-testbed-run' );
	if ( ! btn ) return;

	// 确认存在 irame
	var iframe = document.getElementById( 'tae-js-testbed-iframe' );
	if ( ! iframe ) return;

	// 传值对象
	var data = {};

	// 点击了按钮
	btn.addEventListener( 'click', function( evt ) {
		// 提取 html 内容
		var html = document.getElementById( 'tae-js-testbed-html' );
		data.html = html ? html.value : '';

		// 提取 js 内容
		var js = document.getElementById( 'tae-js-testbed-js' );
		data.js = js ? js.value : '';

		// 请求 caja 编译
		var xhr = new XMLHttpRequest();
		xhr.onreadystatechange = function( evt ) {
			if ( xhr.readyState != 4 ) return;
			if ( xhr.status != 200 ) return;

			// caja 编译完成
			var caja = xhr.responseText;
			caja = caja.substr( caja.indexOf( 'TShop.' ) )
					.replace( /&#39;/g, '\'' )
					.replace( /&quot;/g, '"' )
					.replace( /&amp;/g, '&' )
					.replace( /\\\\"/g, '\\\"' );
			data.caja = caja;

			// 重新加载 iframe
			var href = window.location.href;
			var pos = href.lastIndexOf( '/' );
			href = href.substr( 0, pos ) + '/bed.html';
			iframe.contentWindow.location = href;
		};
		xhr.open( 'POST', 'http://zxn.taobao.com/tbcajaService.htm', true );
		xhr.setRequestHeader( 'Content-type', 'application/x-www-form-urlencoded' );
		xhr.send( 'token=TAE-SDK&content=' + encodeURIComponent( data.js ) + '&component=tae_js_testbed' );
	});

	// iframe 加载完毕
	iframe.addEventListener( 'load', function( evt ) {
		// 填入 html 内容
		var doc = iframe.contentWindow.document;
		var mod = doc.getElementById( 'tae-js-testbed-mod' );
		mod.innerHTML = data.html;

		// 引入 caja js 内容
		var sc = doc.createElement( 'script' );
		sc.innerHTML = data.caja;
		doc.body.appendChild( sc );

		// 引入 setup.js
		sc = doc.createElement( 'script' );
		sc.src = 'http://a.tbcdn.cn/apps/??taesite/balcony/core/r3002/caja-setup.js,daogoudian/isv/kissygallery.js';
		doc.body.appendChild( sc );
	});
})();
