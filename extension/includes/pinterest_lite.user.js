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

(function(){

if (window != window.top)   // in iframe
    return;

var board_url = window.location.pathname;

function get_xhr_url()
{
    var script = document.querySelector('script#jsInit');
    var m = script.innerText.match(/"BoardFeedResource", ([^}]*})/);
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
    console.log("getting more items ...");
    getURL(xhr_url, process_autoload_results, autoload_error);
}

function remaining_scroll()
{
    var ret = (document.documentElement.scrollHeight - window.pageYOffset - window.innerHeight);
    return ret;
}

function watch_for_scroll()
{
    if (remaining_scroll() < window.innerHeight * 2 && !autoload.requestingMoreResults)
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

var item_template =  [
'<div class="item " itemprop="itemListElement" itemscope="" itemtype="http://schema.org/ListItem">', 
//'  <meta itemprop="position" content="2">'
'  <meta itemprop="url" content="https://www.pinterest.com/pin/%%id%%/">', 
'  <div class="Module Pin summary" data-component-type="0" >',   // id="Pin-53"
'    <div class="pinWrapper">',
'      <div class="bulkEditPinWrapper">',
'                    </div>',
'      <div class="pinImageActionButtonWrapper">',
'        <div class="repinSendButtonWrapper">',
'          <button class="Button Module ShowModalButton btn primary primaryOnHover repinSmall rounded" data-element-type="0"  type="button">',  // id="ShowModalButton-82"
'            <em></em>',
'            <span class="accessibilityText">Pin it</span>',
'          </button>',
'        </div>',
'        <div class="likeEditButtonWrapper">',
'          <button class="Button LikeButton Module PinLikeButton btn likeSmall rounded" data-element-type="1" data-source-interest-id="" data-text-like="Like" data-text-unlike="Unlike"  type="button">',  // id="PinLikeButton-83"
'            <em></em>',
'            <span class="accessibilityText">Like</span>',
'          </button>',
'        </div>',
'        <div class="pinHolder">',
'          <a href="/pin/%%id%%/" class="pinImageWrapper" data-element-type="35" style="background: #282223;" title="%%description%%">',
'            <h4 class="pinCanonicalDescription">%%description_html%%</h4>',
'            <div class="fadeContainer">',
'              <div class="hoverMask"></div>',
'              <div class="Image Module pinUiImage"  style="width: 236px">',   // id="Image-84"
'                <div class="heightContainer" style="padding-bottom: 133.050847%">',
'                  <img src="%%img236_url%%" class="pinImg fullBleed" onload="P.lazy.onImageLoad(this)" alt="%%description%%">',
'                </div>',
'              </div>',
'            </div>',
'          </a>',
'        </div>',
'      </div>',
'      <div class="pinMeta ">',
'        <p class="pinDescription">',
'          ',
'               %%description_html%%',
'                        ',
'          <button class="Button Module borderless hasText vaseButton"  type="button">', // id="Button-85"
'            <span class="buttonText">More</span>',
'          </button>',
'        </p>',
// '        <h4 class="vaseText hidden">Demons, Legends, Fantasy Art, Laura Sava, Fallen Angel, Angel Warriors, Cryptid, Dark Angels, Arte Digital</h4>',
//'        <h4 class="vaseText hidden">Legend of the Cryptids - Amarie by Laura Sava, via Behance</h4>',
//'        <h4 class="vaseText hidden">Dark angel, female beauty, Wings, fantasy art</h4>',
//'        <h4 class="vaseText hidden">Angel warrior</h4>',
//'        <h4 class="vaseText hidden">fantasy fallen angel</h4>',
//'        <h4 class="vaseText hidden">Mermaids, dragons, demons, oh my!</h4>',
'        <div class="Module SocialIconsCounts" >',   // id="SocialIconsCounts-86"
'          <div class="pinSocialMeta">',
'            <a class="socialItem" href="/pin/%%id%%/repins/" data-element-type="174">',
'              <em class="repinIconSmall"></em>',
'              <em class="socialMetaCount repinCountSmall">',
'                %%repin_count%%',
'            </em>',
'            </a>',
'          </div>',
'        </div>',
'      </div>',
'      <div class="pinCredits">',
'        <div class="creditItem ">',
'          <div class="creditName">',
'            <h3>%%title%%</h3>',
'          </div>',
'          <div class="creditTitle">',
'                                                                                                    %%domain%%',
'                                </div>',
'        </div>',
'      </div>',
'      <div class="sharedContentPosting hidden" itemprop="item" itemscope="" itemtype="http://schema.org/SharedContentPosting">',
// '        <meta itemprop="upvoteCount" content="133">',
// '        <meta itemprop="sharedCount" content="462">',
// '        <meta itemprop="commentCount" content="1">',
// '        <meta itemprop="text" content="Amarie by anotherwanderer armor clothes clothing fashion player character npc | Create your own roleplaying game material w/ RPG Bard: www.rpgbard.com | Writing inspiration for Dungeons and Dragons DND D&D Pathfinder PFRPG Warhammer 40k Star Wars Shadowrun Call of Cthulhu Lord of the Rings LoTR + d20 fantasy science fiction scifi horror design | Not Trusty Sword art: click artwork for source">',
//'        <div itemprop="user" itemscope="" itemtype="http://schema.org/Person">',
//'          <meta itemprop="name" content="Trusty Sword Entertainment">',
//'          <meta itemprop="url" content="https://www.pinterest.com/trustyswordent/">',
//'          <meta itemprop="image" content="https://s-media-cache-ak0.pinimg.com/avatars/trustyswordent_1395642539_30.jpg">',
//'        </div>',
//'        <meta itemprop="datePublished" content="2014-05-08T07:05:50">',
//'        <meta itemprop="image" content="https://s-media-cache-ak0.pinimg.com/736x/f7/63/d3/f763d33ef5a6a92eef770ed462641cca.jpg">',
//'        <meta itemprop="category" content="https://www.pinterest.com/ghdwn862/d/">',
//'        <div class="sharedContent" itemprop="sharedContent" itemscope="" itemtype="http://schema.org/WebPage">',
//'          <meta itemprop="name" content="Amarie by anotherwanderer on deviantART">',
//'          <div itemprop="author" itemscope="" itemtype="http://schema.org/Organization">',
//'            <meta itemprop="name" content="anotherwanderer.deviantart.com">',
//'          </div>',
//'          <meta itemprop="url" content="/pin/380343131003358743/">',
//'        </div>',
'      </div>',
'    </div>',
'  </div>',
'</div>'
];

var item_regexps = null;
function init_item_regexps()
{
    item_regexps = {};
    var props = [ "description", "description_html", "title", "id", "domain", "repin_count" ];
    for (var i in props)
	item_regexps[props[i]] = new RegExp('%%' + props[i] + '%%', 'g');
}

function new_item(item)
{
    var s = item_template.join('\n');
    if (!item_regexps)
	init_item_regexps();

    for (var i in item_regexps)
	s = s.replace(item_regexps[i], item[i]);
    s = s.replace(/%%img236_url%%/g, item.images['236x'].url);
    
    // console.log(s);
    var e = document.createElement('el');
    e.innerHTML = s;
    return e.firstChild;
}

function process_autoload_results(res)
{
    console.log("xhr worked !");
    // window.xhr_res = res;            // FIXME for debugging
    
    var o = JSON.parse(res);
    var fragment = document.createDocumentFragment();
    for (var i in o.resource_response.data)
    {
	var item = o.resource_response.data[i];
	fragment.appendChild(new_item(item));
    }
    var parent = document.querySelector('.locationBoardPageContentWrapper .GridItems.variableHeightLayout'); // board page
    parent.appendChild(fragment);

    document.body.columns_items = 0; // force
    layout();

    // TODO load next results ...
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
    console.log('in main()');

    document.removeEventListener('DOMContentLoaded', main, false);  // call only once, please
    window.onresize = layout;
    layout();

    autoload_init();
}

on_document_ready(add_styles);
document.addEventListener('DOMContentLoaded',  main, false);


}());
