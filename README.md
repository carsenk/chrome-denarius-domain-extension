Denarius Name Chrome Extension
=======================================

4/22/2021: The code is now licensed under GPLv2+

This extension was created to make it as easy as possible for people to surf Denarius domains. Download the extension from the [Chrome Web Store] Coming Soon

Denarius domains are managed by the peer-to-peer [Denarius network](http://denarius.io) with no central authority. The system is still at an early stage of development but is growing rapidly. The authoritative source for new TLD domains is the Denairus blockchain.

This Chrome extension forwards requests whenever a Denarius domain is about to be loaded by the browser. Instead of getting the IP of the domain from the default name servers, it gets the IP via https from api.denarius.io and redirects the request. Note that even though it uses the chrome.proxy API (http://developer.chrome.com/extensions/proxy), it does not make use of a proxy server (but uses the proxy extension to direct the request to the Denarius domain's IP).

It's in a very early state of development and needs a lot of work - please do not hesitate to contact me if you want to help with the programming or with bugs or feature suggestions.


