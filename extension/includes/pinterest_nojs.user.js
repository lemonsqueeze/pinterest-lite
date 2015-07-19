// ==UserScript==
// @name        Pinterest no js
// @namespace   http://lemonsqueeze.com/pinterest_no_js
// @version     1.0
// @description Allows to browse Pinterest without js
// @include     http://*.pinterest.com/*
// @include     https://*.pinterest.com/*
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

add_style(".GridItems.variableHeightLayout > .item { float:left; position:static; visibility:visible; }");


