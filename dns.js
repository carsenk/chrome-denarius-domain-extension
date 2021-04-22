function sleep(milliseconds, requestedhost) {
	// synchronous XMLHttpRequests from Chrome extensions are not blocking event handlers. That is why we use this
	var start = new Date().getTime();
	for (var i = 0; i < 1e7; i++) {
		if (((new Date().getTime() - start) > milliseconds) || (sessionStorage.getItem(requestedhost) != null)){
			break;
		}
	}
}

// run script when a request is about to occur
chrome.webRequest.onBeforeRequest.addListener(function (details) {
	// get the parts of the url (hostname, port) by creating an 'a' element
	var parser = document.createElement('a');
	parser.href = details.url;
	
	// Make sure the domain ends with a Denarius DNS extension.
	var tld = parser.hostname.slice(-1);
	var tld2 = parser.hostname.slice(-3);
	var tld3 = parser.hostname.slice(-4);
	var tld4 = parser.hostname.slice(-7);
	if (tld != 'd' && tld2 != 'btc' && tld3 != 'ipfs' && tld3 != 'king' && tld4 != 'denarii' && tld4 != 'bitcoin') {
		return;
	};

	var requestedhost = parser.hostname;
	var port = (parser.protocol == "https:" ? "443" : "80");
	var access = (parser.protocol == "https:" ? "HTTPS" : "PROXY");

	// Check the local cache to save having to fetch the value from the server again.
	if (sessionStorage.getItem(requestedhost) == undefined) {
		// This domain is not in cache, get the IP from api.denarius.io
		var xhr = new XMLHttpRequest();
		var url = "https://api.denarius.io/name?req="+requestedhost; //denarius-name-api server
		// synchronous XMLHttpRequest is actually asynchronous
		// check out https://developer.chrome.com/extensions/webRequest
		xhr.open("GET", url, false);
		xhr.onreadystatechange = function() {
			if (xhr.readyState == 4) {
				// Get the ip address returned from the DNS API server.
				var ddip = xhr.responseText;
				// store the IP for the hostname in the local cache which is reset on each browser restart
				sessionStorage.setItem(requestedhost, ddip);
			}
		}
		xhr.send();
		// block the request until the new proxy settings are set. Block for up to two seconds.
		sleep(2000, requestedhost);
	};
	
	// Get the IP from the session storage.
	var dip = sessionStorage.getItem(requestedhost);
	var config = {
		mode: "pac_script",
		pacScript: {
			data: "function FindProxyForURL(url, host) {\n" +
			"  if (dnsDomainIs(host, '"+requestedhost+"'))\n" +
			"    return '"+access+" "+dip+":"+port+"';\n" +
			"  return 'DIRECT';\n" +
			"}"
		}
	};
	
	chrome.proxy.settings.set({value: config, scope: 'regular'},function() {});
	console.log('IP '+dip+' for '+requestedhost+' found');
	
}, { urls: ["<all_urls>"] }, ["blocking"]);
