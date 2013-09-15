// http://developer.chrome.com/extensions/devguide.html

(function() {
	// 确认“运行”按钮
	var btn = document.getElementById( 'tae-js-testbed-run' );
	if ( ! btn ) return;

	// 埋下插件版本标记
	var m = chrome.runtime.getManifest();
	btn.setAttribute( 'data-ext-version', m.version );

	// 确认“运行结果”的 irame
	var iframe = document.getElementById( 'tae-js-testbed-iframe' );
	if ( ! iframe ) return;

	// 传值对象
	var data = {};

	// 点击了“运行”按钮
	btn.addEventListener( 'click', function( evt ) {
		// 提取 html 内容
		var html = document.getElementById( 'tae-js-testbed-html' );
		data.html = html ? html.value : '';

		// 提取 js 内容
		var js = document.getElementById( 'tae-js-testbed-js' );
		data.js = js ? js.value : '';

		// 提取 js 环境版本
		var ver = document.getElementById( 'tae-js-testbed-ver' );
		data.ver = ver ? ver.value : 'r3002';

		// 对于 r4000 环境，要从 html 中提取出 modules
		if ( data.ver == 'r4000' ) {
			// <cajamodules inlucde="kissy/1.3.0/core,kissy/gallery/kcharts/1.1/index"></cajamodules>
			var m = data.html.match( /<cajamodules\s+inlucde=['"]([^'"]*)['"]/i );
			if ( m ) {
				// 每个 module 都加上 'openjs/' 前缀
				var modules = m[1].split( ',' );
				for ( var i in modules ) {
					modules[i] = 'openjs/' + modules[i].trim();
				}
				data.modules = modules.join( ',' );
			}
		}

		// 请求 caja 编译
		var xhr = new XMLHttpRequest();
		xhr.open( 'POST', 'http://zxn.taobao.com/tbcajaService.htm', true );
		xhr.setRequestHeader( 'Content-type', 'application/x-www-form-urlencoded' );
		xhr.onreadystatechange = function( evt ) {
			if ( xhr.readyState != 4 ) return;
			if ( xhr.status != 200 ) return;

			// caja 编译完成，对得到的结果进行一些清洗
			var caja = xhr.responseText;
			caja = caja.substr( caja.indexOf( 'TShop.' ) )
					.replace( /&#39;/g, '\'' )
					.replace( /&quot;/g, '"' )
					.replace( /&amp;/g, '&' )
					.replace( /\\\\"/g, '\\\"' );
			data.caja = caja;

			// 重新加载 iframe
			// FIXME: 似乎这里的“重新加载”方式并不能彻底清空上一次加载留下的痕迹……？
			var href = window.location.href;
			var pos = href.lastIndexOf( '/' );
			href = href.substr( 0, pos ) + '/bed.' + data.ver + '.html';
			if ( data.modules ) {
				// 通过 url 传入 modules
				href += '?' + encodeURIComponent( data.modules );
			}
			iframe.contentWindow.location = href;
		};
		xhr.send( 'token=TAE-SDK&content=' + encodeURIComponent( data.js ) + '&component=tae_js_testbed' );
	});

	// iframe 加载完毕
	iframe.addEventListener( 'load', function( evt ) {
		// 填入 html 内容
		var doc = iframe.contentWindow.document;
		var mod = doc.getElementById( 'tae-js-testbed-mod' );
		mod.innerHTML = data.html;

		// 引入 caja 编译后的 js 内容
		var sc = doc.createElement( 'script' );
		sc.innerHTML = data.caja;
		doc.body.appendChild( sc );

		// 启动沙箱环境
		sc = doc.createElement( 'script' );
		sc.src = data.ver == 'r4000'
			? 'http://a.tbcdn.cn/apps/taesite/balcony/core/r4000/base/setup.js'
			: 'http://a.tbcdn.cn/apps/??taesite/balcony/core/r3002/caja-setup.js,daogoudian/isv/kissygallery.js';
		doc.body.appendChild( sc );
	});
})();
