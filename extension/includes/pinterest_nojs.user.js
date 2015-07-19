// ==UserScript==
// @name        Pinterest No JS
// @namespace   https://github.com/lemonsqueeze/pinterest_nojs
// @version     1.0
// @description Browse Pinterest without all the javascript bloat
// @include     http://www.pinterest.com/*
// @include     https://www.pinterest.com/*
// @copyright   2015, lemonsqueeze
// @license     GPL version 3 or any later version; http://www.gnu.org/copyleft/gpl.html
// ==/UserScript==

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

function layout()
{
    var columns = Math.floor(window.innerWidth / (236 + 14));
    console.warn('columns: ' + columns);
    if (columns == document.body.columns_items)  // unchanged
	return;
    document.body.columns_items = columns;

    // remove previous clearfloat divs in case of resize
    removeall(document.querySelectorAll('.GridItems.variableHeightLayout > .clearfloats'));

    var items = document.querySelectorAll('.GridItems.variableHeightLayout > .item');    
    var parent = items[0].parentNode;
    for (var i = 0; i < items.length; i++)
    {
	if (i % columns == 0)
	{
	    var div = document.createElement('div');
	    div.className = 'clearfloats';
	    parent.insertBefore(div, items[i]);
	}
    }
}

function main()
{
    add_style(".GridItems.variableHeightLayout > .item \
                    { float:left; position:static; visibility:visible; } ");
    add_style(".GridItems.variableHeightLayout > .clearfloats \
                    { clear: both; } ");
    add_style(".Pin.summary .pinImg  \
                    { opacity: 1; } ");

    window.onresize = layout;
    layout();
}

document.addEventListener('DOMContentLoaded',  main, false);
//on_document_ready(main);
