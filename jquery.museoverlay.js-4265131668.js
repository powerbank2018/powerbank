/*
 Copyright 2011-2016 Adobe Systems Incorporated. All Rights Reserved.
*/
(function(a){a.fn.museOverlay=function(b){var c=a.extend({autoOpen:!0,offsetLeft:0,offsetTop:0,$overlaySlice:a(),$slides:a(),$overlayWedge:a(),duration:300,overlayExtraWidth:0,overlayExtraHeight:0,$elasticContent:a()},b);return this.each(function(){var d=a(this).data("museOverlay");if(d&&d[b]!==void 0)return d[b].apply(this,Array.prototype.slice.call(arguments,1));var d=a("body"),g=a("<div></div>").appendTo(d).css({position:"absolute",top:0,left:0,zIndex:100001}).hide(),f=a("<div></div>").append(c.$overlaySlice).appendTo(g).css({position:"absolute",
top:0,left:0}),j=a(this).css({position:"absolute",left:0,top:0,outline:"none"}).attr({role:"dialog",tabindex:"0"}).appendTo(g),h=g.siblings("div"),k=a(window),i=k.data("scrollWrapper"),l,n,o=null,d=g.find("a, button, [tabindex], input, textarea, [contenteditable]"),p=d[0],q=d[d.length-1],m=c.$elasticContent,s=m.length?parseInt(m.css("padding-left"))+parseInt(m.css("padding-right"))+parseInt(m.css("border-left-width"))+parseInt(m.css("border-right-width")):0,t=m.length?parseInt(m.css("padding-top"))+
parseInt(m.css("padding-bottom"))+parseInt(m.css("border-top-width"))+parseInt(m.css("border-bottom-width")):0,C=c.$overlaySlice.outerWidth(),E=c.$overlaySlice.outerHeight(),v={isOpen:!1,reuseAcrossBPs:function(){c.reuseAcrossBPs=!0},handleClose:function(){v.close()},open:function(){if(!v.isOpen){if(!c.reuseAcrossBPs&&c.slideshow.$bp){if(!c.slideshow.$bp.hasClass("active"))return;c.slideshow.breakpoint.swapPlaceholderNodesRecursively(g);c.slideshow.breakpoint.activateIDs(g)}Muse.Utils.showWidgetsWhenReady(g);
l=k.width();n=k.height();v.positionContent(l,n);g.show();f.bind("click",v.handleClose);f.css({opacity:0}).stop(!0);j.css({opacity:0}).stop(!0);h.attr("aria-hidden","true");f.bind("click",v.handleClose).animate({opacity:0.99},{queue:!1,duration:c.duration,complete:function(){f.css({opacity:""});j.animate({opacity:1},{queue:!1,duration:c.duration,complete:function(){j.css({opacity:""});v.applyPageDimensions();window.setTimeout(function(){j[0].focus()},void 0)}})}});a(document).bind("keydown",v.onKeyDown);
v.doLayout(l,n);v.isOpen=!0;k.bind("resize",v.onWindowResize);a("body").bind("muse_bp_deactivate",v.onBreakpointChange)}},close:function(b){f.unbind("click",v.handleClose);k.unbind("resize",v.onWindowResize);a("body").unbind("muse_bp_deactivate",v.onBreakpointChange);a(document).unbind("keydown",v.onKeyDown);if(c.onClose)c.onClose();f.css({opacity:0.99}).stop(!0);j.css({opacity:0.99}).stop(!0);j.animate({opacity:0},{queue:!1,duration:b?0:c.duration,complete:function(){f.animate({opacity:0},{queue:!1,
duration:b?0:c.duration,complete:function(){g.hide();j.css({opacity:""});f.css({opacity:""});h.removeAttr("aria-hidden")}})}});v.isOpen=!1},next:function(){if(c.onNext)c.onNext()},previous:function(){if(c.onPrevious)c.onPrevious()},focusTrap:function(a){a.keyCode===9&&(a.shiftKey?a.target===p&&q.focus():a.target===q&&p.focus())},onBreakpointChange:function(){v.close(!0)},onKeyDown:function(a){switch(a.which||a.keyCode){case 37:case 38:j.is(":focus")&&v.previous();break;case 39:case 41:j.is(":focus")&&
v.next();break;case 27:v.close()}v.focusTrap(a)},onWindowResize:function(){var a=k.width(),b=k.height();(l!=a||n!=b)&&o==null&&(o=setTimeout(function(){v.doLayout(k.width(),k.height());v.positionContent(k.width(),k.height());o=null},10))},doLayout:function(a,b){g.css({width:0,height:0});c.$overlayWedge.css({width:0,height:0});var f=a-s,d=b-t;m.length&&m.hasClass("fullwidth")&&(m.width(f),c.resizeSlidesFn&&c.resizeSlidesFn(f,d));v.applyPageDimensions()},applyPageDimensions:function(){var b=a(document),
f=b.width(),b=b.height(),d=document.documentElement||document.body;d.clientWidth!=d.offsetWidth&&(f=d.scrollWidth-1);d.clientHeight!=d.offsetHeight&&b<d.scrollHeight&&(b=d.scrollHeight-1);g.css({width:f,height:b});c.$overlayWedge.css({width:f-C,height:b-E})},positionContent:function(a,b){var f=-c.$slides.outerWidth()/2,d=-c.$slides.outerHeight()/2,f=(i||k).scrollLeft()+Math.max(0,a/2+f),d=(i||k).scrollTop()+Math.max(0,b/2+d);j.css({top:d,left:f});m.length&&m.hasClass("fullwidth")&&m.css("left",-f);
d=a-s;f=b-t;m.length&&(m.width(d),m.hasClass("fullscreen")&&m.height(f),c.resizeSlidesFn&&c.resizeSlidesFn(d,f))}};j.data("museOverlay",v);c.autoShow&&v.open()})}})(jQuery);
;(function(){if(!("undefined"==typeof Muse||"undefined"==typeof Muse.assets)){var a=function(a,b){for(var c=0,d=a.length;c<d;c++)if(a[c]==b)return c;return-1}(Muse.assets.required,"jquery.museoverlay-1.js"/*tpa=http://solzar.sumirina.ru/scripts/jquery.museoverlay.js*/);if(-1!=a){Muse.assets.required.splice(a,1);for(var a=document.getElementsByTagName("meta"),b=0,c=a.length;b<c;b++){var d=a[b];if("generator"==d.getAttribute("name")){"http://solzar.sumirina.ru/scripts/2015.1.2.344"!=d.getAttribute("content")&&Muse.assets.outOfDate.push("jquery.museoverlay-1.js"/*tpa=http://solzar.sumirina.ru/scripts/jquery.museoverlay.js*/);break}}}}})();