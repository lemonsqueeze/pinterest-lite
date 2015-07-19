// ==UserScript==
// @name pinterest_blockjs
// @author lemonsqueeze https://github.com/lemonsqueeze/pinterest_nojs
// @version 1.0
// @description Disable javascript on pinterest
// @published 2015-07-19 11:00
// @include        http://www.pinterest.com/*
// @include        https://www.pinterest.com/*
// ==/UserScript==

(function(document, location) {
    function is_prefix(p, str)
    {
        return (str.slice(0, p.length) == p);
    }
    
    function handle_noscript_tags()
    {
	for (var j = document.getElementsByTagName('noscript'); j[0];
	     j = document.getElementsByTagName('noscript')) 
	{
	    var nstag = document.createElement('wasnoscript');
	    nstag.innerHTML = j[0].innerText;	    
	    j[0].parentNode.replaceChild(nstag, j[0]);
	}
    }

    function beforeextscript_handler(e)
    {
	e.preventDefault();
    }

    // Handler for both inline *and* external scripts
    function beforescript_handler(e)
    {
	if (e.element.src) // external script
	    return;
	e.preventDefault();
    }    

    // block inline scripts
    window.opera.addEventListener('BeforeScript',	  beforescript_handler, false);
    
    // block external scripts (won't even download)
    window.opera.addEventListener('BeforeExternalScript', beforeextscript_handler, false);
    
    // use this one if you want <noscript> tags interpreted as if javascript was disabled in opera.
    document.addEventListener('DOMContentLoaded',  handle_noscript_tags, false);

})(window.document, window.location);
