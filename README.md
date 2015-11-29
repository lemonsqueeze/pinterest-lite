Pinterest Lite
==============

Opera 12 extension for light and fast Pinterest browsing.

### Features

- No need to login / have an account / register / whatever.
- Decent scrolling performance
- Small memory footprint (no external/pinterest javascript loaded)
- Much leaner html
- Autoscroll/Autoload support

### Background

Pretty much anybody accesses Pinterest through mobile, and there's a very good reason for that. Pinterest desktop browser experience sucks. BIG TIME.

Nag screens ask you to login even when there's really no need (maybe all you care is viewing one image).
Pages take forever to load, scrolling performance is god awful, and worst of all it's a major memory hog. If you have more than a few tabs openened you better have LOTS of ram to waste, it loads more than 5Mb of javascript last time I checked. That's more than 5000 pages of code. An entire bookshelf's worth of code just to display a few images ? If you think that's insane you're on the right track.

So here we go, this extension is basically a userscript for Pinterest, taking over and throwing away all the unnecessary/harmful bits. All Pinterest js is gone, the extension takes care of loading and laying out images itself (grand total of 17k of code so far).


### Install

Install [Opera Presto](http://www.opera.com/download/guide/?custom=yes)  
You need 12.16, it won't work with later Opera Webkit versions.

Drag and drop [pinterest_lite.oex](https://github.com/lemonsqueeze/pinterest_lite/releases/latest) file in Opera to install extension.
