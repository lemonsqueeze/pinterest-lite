// ==UserScript==
// @name        Pinterest Lite
// @namespace   https://github.com/lemonsqueeze/pinterest_lite
// @version     1.0
// @description Browse Pinterest without all the javascript bloat
// @include     http://www.pinterest.com/*
// @include     https://www.pinterest.com/*
// @copyright   2015, lemonsqueeze
// @license     GPL version 3 or any later version; http://www.gnu.org/copyleft/gpl.html
// ==/UserScript==

/********************************************************************************/

var board_url = window.location.pathname;

function get_xhr_url()
{
    var script = document.querySelector('script#jsInit');
    var s = script.innerText;
    var m = s.match(/"BoardFeedResource", ([^}]*})/);
    if (!m)
	return null;
    var data = JSON.parse('{' + m[1] + '}');    
    data.context = {};
    s = JSON.stringify(data);
    s = encodeURI(s);
    s = s.replace(/:/g, '%3A');
    s = s.replace(/,/g, '%2C');
    s = s.replace(/\//g, '%2F');
    s = s.replace(/=/g, '%3D');

    var url = ("https://www.pinterest.com/resource/BoardFeedResource/get/" +
	       "?source_url=" + board_url.replace(/\//g, '%2F') +
	       "&data=" + s +
	       "&_=" + new Date().getTime());
    return url;
}

/********************************************************************************/

var autoload = {};
var xhr_url = null;

function autoload_init()
{
    xhr_url = get_xhr_url();
    if (!xhr_url)
	return;
    
    // TODO spinner ?
    watch_for_scroll();
}

function request_more_results()
{    
    console.log('getURL: ' + xhr_url);
    getURL(xhr_url, process_autoload_results, autoload_error);
}

function remaining_scroll()
{
    var ret = (document.body.scrollHeight - window.pageYOffset - window.innerHeight);
    return ret;
}

function watch_for_scroll()
{
    if (remaining_scroll() < 300 && !autoload.requestingMoreResults)
    {
        autoload.requestingMoreResults = true;  
        request_more_results();
    }
    setTimeout(watch_for_scroll, 200);
}


function getURL(url, callback, error_callback)
{
    doXHR(xhr_url, callback, error_callback);
}

function doXHR(url, callback, error_callback)  // asynchronous
{
    var xhr = new window.XMLHttpRequest();
    xhr.open('GET', url, true);
    xhr.setRequestHeader("Accept", "application/json, text/javascript, */*; q=0.01");
    xhr.setRequestHeader("X-Requested-With", "XMLHttpRequest");
    xhr.onreadystatechange = function()
    {
       if (this.readyState == 4)
       {
           if (this.status == 200 && this.responseText) // Error check for fetching the URL
               callback(this.responseText);
           else
           {
               opera.postError('XHR ERROR: ' + this.status + ' : ' + url);
               if (error_callback)
                   error_callback();
               return false;
           }
       }
    }    
    xhr.send();
}    

function process_autoload_results(res)
{
    console.log(res);

    // autoload.requestingMoreResults = false;
}

function autoload_error()
{
    console.log("autoload error");
}


/********************************************************************************/

function add_style(css)
{
    var heads = document.getElementsByTagName("head");
    if (heads.length > 0) {
        var node = document.createElement("style");
        node.type = "text/css";
        node.innerHTML = css;
        heads[0].appendChild(node);
    }
}

function on_document_ready(f)
{
    function check_ready()
    {
        if (document.body)
            f();
        else
            setTimeout(check_ready, 50);
    }
    setTimeout(check_ready, 50);
}

function removeall(l)
{
    for (var i = l.length - 1; i >= 0; i--)
	l[i].parentNode.removeChild(l[i]);
}

function layout_items(columns, container_selector)
{
    var containers = document.querySelectorAll(container_selector);
    for (var j = 0; j < containers.length; j++)
    {
	var container = containers[j];
	var items = container.querySelectorAll('div.item');
	for (var i = 0; i < items.length; i++)
	{
	    if (i % columns == 0)
	    {
		var div = document.createElement('div');
		div.className = 'clearfloats';
		container.insertBefore(div, items[i]);
	    }
	}   
    }        
}

function layout()
{
    var columns = Math.floor(window.innerWidth / (236 + 14));
    console.warn('columns: ' + columns);
    if (columns == document.body.columns_items)  // unchanged
	return;
    document.body.columns_items = columns;

    // remove previous clearfloat divs in case of resize
    removeall(document.querySelectorAll('div.clearfloats'));

    var selectors = [    
	'.locationBoardPageContentWrapper .GridItems.variableHeightLayout',	// board page   
	'.gridContainer .GridItems.variableHeightLayout',			// pin page
	'.DomainFeedPage .GridItems.variableHeightLayout'			// source page
    ];

    for (var i = 0; i < selectors.length; i++)
	layout_items(columns, selectors[i]);
}

function add_styles()
{
    add_style(".GridItems.variableHeightLayout > .item \
                    { float:left; position:static; visibility:visible; } ");
    add_style(".GridItems.variableHeightLayout > .clearfloats \
                    { clear: both; } ");
    add_style(".Pin.summary .pinImg  \
                    { opacity: 1; } ");		// make board images visible
    add_style(".Board.boardPinsGrid .pinGridWrapper .item  \
                    { opacity: 1; } ");		// remove pin icons greyout
}

function main()
{
    window.onresize = layout;
    layout();

    autoload_init();
}

on_document_ready(add_styles);
document.addEventListener('DOMContentLoaded',  main, false);


