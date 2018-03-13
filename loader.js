(function(w, d) {
    if(!w.AdverturManager) {
        w.AdverturManager = {
            banners: [],
            maxCountTime: 120,
            countTime: 0,
            hidden: '',
            visibilityChange: '',
            sliderPosition: {0:0, 1:0, 2:0},
            mobileSectionId: false,

            init: function(w, d) {
                this.window = w;
                this.document = d;

                try {
                    if (typeof this.document.hidden !== "undefined") {
                        this.hidden = "hidden";
                        this.visibilityChange = "visibilitychange";
                    } else if (typeof this.document.msHidden !== "undefined") {
                        this.hidden = "msHidden";
                        this.visibilityChange = "msvisibilitychange";
                    } else if (typeof this.document.webkitHidden !== "undefined") {
                        this.hidden = "webkitHidden";
                        this.visibilityChange = "webkitvisibilitychange";
                    }
                    if (typeof this.document.addEventListener !== "undefined") {
                        this.document.addEventListener(
                            this.visibilityChange,
                            function() {
                                try {
                                    var aManager = window.AdverturManager || top.window.AdverturManager;
                                    if(aManager) {
                                        // aManager.handleVisibilityChange();
                                    }
                                }catch(err){}
                            },
                            false);

                        this.window.addEventListener("message", this.handleMessage, false);
                    } else {
                        this.window.attachEvent("onmessage", this.handleMessage);
                    }
                } catch (e){ console.log(e) }

                this.renderBanners();
            },

            renderBanners: function() {
                var type_id = false, el, extended_type;
                if (this.window['advertur_sections'] && this.window['advertur_sections'].length) {
                    for (var index in this.window['advertur_sections']) {
                        if (this.window['advertur_sections'].hasOwnProperty(index) && !this.window['advertur_sections'][index].rendered) {
                            this.window['advertur_sections'][index].rendered = true;

                            el = this.window['advertur_sections'][index];
                            type_id = !el.type_id ? 1 : el.type_id;
                            extended_type = !el.extended_type_id ? false : el.extended_type_id;

                            switch (type_id) {
                                case 9:
                                    this.renderAdaptiveBanner(el);
                                break;
                                default:
                                    if(extended_type) {
                                        this.prepareExtendedImageBanner(el.section_id);
                                    } else {
                                        this.renderBanner(el.section_id, el.place, el.width, el.height, el.h, el.s, el.r);
                                    }
                                break;
                            }
                        }

                    }
                }
                if(++this.window.AdverturManager.countTime < this.window.AdverturManager.maxCountTime) {
                    setTimeout(function() {
                        try {
                            top.window.AdverturManager.renderBanners();
                        }catch(err){}
                    }, 1000);
                }
            },

            prepareExtendedImageBanner: function (section_id) {
                var params = {
                    id: section_id,
                    action: 'get_settings',
                    async: 1,
                    pg: this._getClientPage()
                };

                this.loadData('JSONP', 'code.js'/*tpa=http://ddnk.advertur.ru/v1/code.js*/, params, function(err, data) {
                    if (err) {
                        console.log(err);
                    }
                });
            },

            setSettingsExtendedImageBanner: function (section_id, settings) {
                var fnParseJson = (JSON && JSON.parse) ? JSON.parse : function(sJSON) { return eval('(' + sJSON + ')'); };
                settings = fnParseJson(decodeURIComponent(settings.replace(/\+/g, ' ')));

                var link = this.document.createElement('link');
                link.href = 'extended_banners.css'/*tpa=http://ddnk.advertur.ru/v1/s/extended_banners.css*/;
                link.rel = 'stylesheet';
                this.document.getElementsByTagName('body')[0].appendChild(link);

                var callRenderBanner = function() {
                    AdverturManager.renderExtendedImageBanner(
                        settings.section_id,
                        settings.width,
                        settings.height,
                        settings.code,
                        settings.image_container || '',
                        settings.image_start || 1,
                        settings.image_limit || 99,
                        settings.image_exclude || ''
                    );
                };

                if( this.document.readyState == 'complete' ) {
                    callRenderBanner();
                } else {
                    this.window.addEventListener("load", function () { callRenderBanner(); });
                }
            },

            renderExtendedImageBanner: function (section_id, w, h, code, image_container, image_start, image_limit, image_exclude) {
                var imgs,
                    index = 0,
                    count = 0,
                    selector = ''
                ;

                image_exclude = image_exclude || '';
                if(image_exclude) {
                    image_exclude = ':not(' + image_exclude + ')';
                }

                selector = image_container + ' img' + image_exclude + ', img' + image_container + image_exclude;

                imgs = this.document.querySelectorAll(selector);

                w = parseInt(w);
                h = parseInt(h);

                for( var i in imgs ) {
                    if (typeof(imgs[i]) === 'object') {
                        var _w = parseInt( this._getStyle( imgs[i], 'width' ) );
                        var _h = parseInt( this._getStyle( imgs[i], 'height' ) );
                        var _b = this._getPositionElement( imgs[i] );

                        if(_w > w && _h > h) {
                            ++index;
                            if( index >= image_start && image_limit > count) {
                                imgs[i].setAttribute('data-w', _w);
                                imgs[i].setAttribute('data-wr', w);

                                imgs[i].setAttribute('data-h', _h);
                                imgs[i].setAttribute('data-hr', h);

                                imgs[i].setAttribute('data-t', _b.top);
                                imgs[i].setAttribute('data-l', _b.left);

                                imgs[i].setAttribute('data-index', i);
                                imgs[i].className = imgs[i].className + ' adverturExtBContainer adverturExtBFront';
                                this.createWrapperElement(imgs[i], section_id, i, w, h, code);

                                ++count;
                            }
                        }
                    }
                }
            },

            createWrapperElement: function( elem, section_id, index, w, h, code ) {
                try {
                    elem.onmouseover = function (event) {
                        var el = event.target,
                            div = el.parentNode.childNodes[1];
                        if (div.hasAttribute("data-content-loaded") && div.getAttribute("data-content-loaded") === 'false') {
                            div.setAttribute("data-content-loaded", 'true');
                            AdverturManager.renderSyncCodeBanner(
                                section_id, div.id, div.getAttribute('data-content-width'), div.getAttribute('data-content-height'), div.getAttribute('data-content')
                            );
                        }
                    };
                }catch(err) { console.log(err) }

                var d = document.createElement('div');
                d.style.overflow = 'hidden';
                d.id = 'adverturExtBContainer_' + index;
                d.className = 'adverturExtBContainer adverturExtBBack';
                d.setAttribute('data-main', 1);

                d.innerHTML ='';
                d.setAttribute('data-content', code);
                d.setAttribute('data-content-width', w);
                d.setAttribute('data-content-height', h);
                d.setAttribute('data-content-loaded', 'false');

                elem.parentNode.insertBefore(d, elem);
                var parent = document.createElement('div');
                parent.style.position = 'absolute';
                parent.style.width = elem.getAttribute('data-w') + 'px';
                parent.style.height = elem.getAttribute('data-h') + 'px';
                parent.className = 'adverturExtBParent';
                d.parentNode.insertBefore( parent, elem );

                var close = document.createElement('div');
                close.className = 'adverturExtBCloseButton';
                close.innerHTML = '<a href="#" onclick="return AdverturManager.closeExBImageWrapper(this);"><div class="adverturExtBCloseButtonDiv"></div></a>';
                d.appendChild(close);

                var cube = document.createElement('div');
                cube.className = 'adverturExtBCube';
                parent.appendChild( elem );
                parent.appendChild( d );
                parent.appendChild( cube );
                var main = document.createElement('div');
                main.style.padding = 0;
                main.style.margin = 0;
                main.style.cssText = elem.style.cssText;
                main.style.border = this._getStyle( elem, 'border' );
                main.style.margin = this._getStyle( elem, 'margin' );
                main.style.width = elem.getAttribute('data-w') + 'px';
                main.style.height = elem.getAttribute('data-h') + 'px';
                main.style.display = 'inline-block';
                main.style.float = elem.style.float;
                elem.style.margin = 0;
                elem.style.padding = 0;
                elem.style.border = 'none';

                parent.parentNode.insertBefore( main, parent );
                main.appendChild( parent );
            },

            closeExBImageWrapper: function(el) {
                var banner = el.parentElement.parentElement.parentElement,
                    main = banner.parentElement,
                    img = banner.children[0]
                ;
                img.className = '';
                main.innerHTML = img.outerHTML;
                return false;
            },

            renderSyncCodeBanner: function(section_id, place, width, height, syncCode) {
                var div = this.document.getElementById(place);
                if (div && !this.document.getElementById('advertur_section_' + place + '_iframe')) {

                    var mW = Math.floor((div.clientWidth - width)/2);
                    var mH = Math.floor((div.clientHeight - height)/2);

                    var publicId = "";
                    try {
                        publicId = this.document.doctype.publicId;
                    } catch (err) {
                        publicId = '';
                    }

                    var documentMode = false;
                    try {
                        documentMode = !(this.document.documentMode > 9);
                    } catch (err) {
                        documentMode = false;
                    }

                    if( (AdverturManager.msieversion() && ((/XHTML/.test(publicId)) || documentMode )) || AdverturManager._getCookie('advertur_hide_' + section_id)) {
                        div.parentElement.removeChild(div);
                    } else {
                        var iframe = this.document.createElement("iframe");
                        iframe.id = 'advertur_section_' + place + '_iframe';
                        iframe.style.border = '0px solid black';

                        iframe.style.margin = mH + 'px ' + mW + 'px';

                        iframe.style.padding = '0';
                        iframe.frameborder = 0;

                        iframe.scrolling = 'no';
                        iframe.width = width;
                        iframe.height = height;
                        div.appendChild(iframe);

                        var docIf = iframe.contentWindow || iframe.contentDocument;
                        if (docIf.document) {
                            docIf = docIf.document;
                        }
                        iframe.src = "javascript:void((function(){var script = document.createElement('script');" +
                            'script.innerHTML = "(function() {document.open();try{document.domain=\'' + this.document.domain + '\';}catch(e){};document.close();})();";' +
                            'document.write(script.outerHTML);})())';

                        var code = decodeURIComponent(syncCode.replace(/\+/g, ' '));
                        docIf.write('<head></head>');
                        docIf.write('<body style="margin:0px;padding:0px;">');
                        docIf.write( code );

                        docIf.write('</body>');
                    }
                }
            },

            renderBanner: function(section_id, place, width, height, h, s, r, at) {
                at = (at !== false);

                var div = this.document.getElementById(place);
                if (div && !this.document.getElementById('advertur_section_' + place + '_iframe')) {
                    var size = this._getMaxClientSizeByElement(div),
                        wM = size.width || 0,
                        hM = size.height || 0
                    ;

                    div.innerHTML = '';
                    div.width = width;
                    div.height = height;

                    var publicId = "";
                    try {
                        publicId = this.document.doctype.publicId;
                    } catch (err) {
                        publicId = '';
                    }

                    var documentMode = false;
                    try {
                        documentMode = !(this.document.documentMode > 9);
                    } catch (err) {
                        documentMode = false;
                    }

                    if( (AdverturManager.msieversion() && ((/XHTML/.test(publicId)) || documentMode )) || AdverturManager._getCookie('advertur_hide_' + section_id)) {
                        div.parentElement.removeChild(div);
                    } else {
                        if(at) {
                            var secondDiv = this.document.createElement("div");
                            secondDiv.id = 'advertur_at_' + section_id;
                            secondDiv.position = 'absolute';
                            secondDiv.style.top = '0';
                            secondDiv.style.right = '0';
                        }

                        var iframe = this.document.createElement("iframe");
                        iframe.id = 'advertur_section_' + place + '_iframe';
                        iframe.style.border = '0px solid black';
                        iframe.style.margin = '0';
                        iframe.style.padding = '0';
                        iframe.frameborder = 0;

                        iframe.scrolling = 'no';
                        iframe.width = width;
                        iframe.height = height;
                        if(at) {
                            secondDiv.appendChild(iframe);
                            div.appendChild(secondDiv);
                        } else {
                            div.appendChild(iframe);
                        }

                        var docIf = iframe.contentWindow || iframe.contentDocument;
                        if (docIf.document) {
                            docIf = docIf.document;
                        }
                        var url = '//ddnk.advertur.ru/v1/code.js?id=' + section_id + '&async=1';
                        if(h) {
                            url += '&h=' + h;
                        } else if(s) {
                            url += '&s=' + s;
                        } else if(r) {
                            url += '&r=' + r;
                        }

                        url += '&wM=' + wM;
                        url += '&hM=' + hM;

                        url += '&pg=' + this._getClientPage();

                        iframe.src = "javascript:void((function(){var script = document.createElement('script');" +
                            'script.innerHTML = "(function() {document.open();try{document.domain=\'' + this.document.domain + '\';}catch(e){};document.close();})();";' +
                            'document.write(script.outerHTML);})())';

                        docIf.write('<head></head>');
                        docIf.write('<body style="margin:0px;padding:0px;">');
                        docIf.write('<scr' + 'ipt src="' + url + '" ></scr' + 'ipt>');
                        docIf.write('<script type="text/javascript">document.close();</script>');
                        docIf.write('</body>');
                    }
                }
            },

            renderAdaptiveBanner: function(section) {
                var
                    el = this.document.getElementById(section.place),
                    size = this._getMaxClientSizeByElement(el),
                    w = size.width || 0,
                    h = size.height || 0,
                    pos = this._getPositionElement(el)
                ;

                el.style.maxWidth = w + 'px';
                el.style.maxHeight = h + 'px';

                var params = {
                    id: section.section_id,
                    is_adaptiv: 1,
                    async: 1,
                    pg: this._getClientPage(),
                    w: w,
                    h: h,
                    posT: pos.top,
                    posL: pos.left,
                    frl: size.frl || 0
                };

                this.loadData('JSONP', 'code.js'/*tpa=http://ddnk.advertur.ru/v1/code.js*/, params, function(err, data) {
                    if (err) {
                        console.log(err);
                    }
                });
            },

            renderAdaptiveGetNext: function(sectionId, networkId, externalId) {
                var
                    element = this.getBannerElementBySectionId(sectionId),
                    nKey = false, cKey =  networkId + '_' + externalId
                ;

                if( element && element.hasOwnProperty('adaptive_rotation') ) {
                    var isFind = false;

                    for (var index in element.adaptive_rotation) {
                        if(element.adaptive_rotation.hasOwnProperty(index)) {
                            if(isFind) {
                                nKey = element.adaptive_rotation[index];
                                break;
                            } else if (!isFind && element.adaptive_rotation[index] == cKey) {
                                isFind = true;
                            }
                        }
                    }
                    if(nKey === false){
                        nKey = 'creative';
                    }

                    var params = {
                        id: sectionId,
                        is_adaptiv: 1,
                        pkey: cKey,
                        nkey: nKey,
                        async: 1,
                        pg: this._getClientPage()
                    };

                    this.loadData('JSONP', 'code.js'/*tpa=http://ddnk.advertur.ru/v1/code.js*/, params, function(err, data) {
                        if (err) {
                            console.log(err);
                        } else {
                            console.log('success load');
                        }
                    });
                }
            },

            showSlideBannersPlace: function(section_id, position, s, h) {
                position = position || 0;
                s = s || false;
                h = h || 9;

                try {
                    this.renderSlideBanner(section_id, position);
                    this.reloadBannerPlace(section_id, s, h);
                } catch (err){ console.log(err) }
            },

            renderSlideBanner: function(section_id, position) {
                var el = this.getBannerElementBySectionId(section_id);
                if(el && this.window.AdverturManager.sliderPosition[position] == 0) {
                    this.window.AdverturManager.sliderPosition[position] = section_id;
                    var closeButtonId = 'advertur_section_' + el.place + '_closeButton';
                    var div = this.document.getElementById(el.place);

                    if (div && !this.document.getElementById(closeButtonId)) {
                        var closeButton = this.document.createElement("div");
                        closeButton.id = closeButtonId;
                        closeButton.innerHTML = '<a href="#" style="text-decoration: none;z-index: 2147483647;"><img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABkAAAAZCAYAAADE6YVjAAACtUlEQVR42pWWz2oaURTGM+qMWmptwdRKmzSIYDYuzENYXTftWkQkGPEvqYLR3KHpA+hKH0Pt3wepoZsuukrVQoJLCfZ8wQPjZIarAx/K9Zzv5z3nzpnZ2eJyknykR5sE74cPFZYsdpeUIOVJbZJY6Xy1lkCMtbkc4iMdky7cbrdIJpOi1WqJfr8P3X9PJBICvyEGsYri8MFwU8g+6czr9d6bzWYzsVwuLYXfms2mQCxydhTl9SaQV6RmNBoVV1dXbCYVYpGDXAId2EG4RGeRSERMJhMkbyXkIBceKJ0d5K3H41nbwXw+/ygzN8YgFx7okRVkFw2s1WrGen+Kx+PjarU6sDK/u7sTuVzuG5Xp983NzSWvwwNeiqI8X0EcDHmjaZqYTqdrRsVicRiLxX6Vy+WBGZDNZr+Hw+E/JycnX82HAV7UmyQARkgex9Ti3wI0YhCvZTIZBnyx2mUqldLJ89QIcZLajUZD2JWFd1QqlYYSAOL1er0OyMXjJ09VhvhIotvtIsgWBEAwGJwEAoF/+XzeFgB1Oh1AdJdL9W8FSafTPwAIhUJ/qXRDrJkBNhCntFwMQIloB58BQOkYZAYYy+XzP9MYwo2XAnidQejVYrHQzRBuPACQ8Qg/mFMMKBQKDIAYNFiBRkYA3fk6DU4dR5ghazcjBiKb4AbDjUaAkV2TK5XK4Ojo6Oft7e0lQ8gDuxBOp/rCDMF1LBkrlk02AsbjsU4TGZD3DCC5pANSBmFdX1/rlAvAB1XT/AwwQ3DtmUa9FMA7oBwAzh0OxwED7CDUL+UlfVTxIGq32w8Og6nJ6AGXqEaAPRMAUi1fAPA8MD9+Aez1ejoEY1rDKYK5IL1DiawAthAWxvXqZeGU1CbpK7VIBRxTPkUMkEJgbCcMO4wJVdV8PF1hLAFsB2FjK4BNmVjaf5I6+NSKts2YAAAAAElFTkSuQmCC" style="width: 25px !important;height: 25px !important;margin: 0px !important;padding: 0px !important;"></a>';
                        this.document.getElementsByTagName('body')[0].appendChild(closeButton);
                        closeButton.style.position = 'fixed';
                        closeButton.style.border = '0px solid black';
                        closeButton.style.margin = '0px';
                        closeButton.style.padding = '0px';
                        closeButton.style.bottom = el.height + 'px';
                        closeButton.style.zIndex = '2147483647';
                        closeButton.style.display = 'none';
                        closeButton.onclick = function(){
                            try {
                                top.AdverturManager._setCookie('advertur_hide_' + section_id, 1, {patch:'/', expires: 60*60});
                                top.AdverturManager.removeBannersPlace(section_id);
                            }catch(err){}
                            return false;
                        };

                        div.style.position = 'fixed';
                        div.style.width = el.width + 'px';
                        div.style.height = el.height + 'px';
                        div.style.margin = '0px';
                        div.style.padding = '1px';
                        div.style.border = '0px solid #000000';
                        div.style.zIndex = '2147483647';
                        div.style.bottom = '0px';
                        div.style['background-color'] = '#FFF';
                        div.style.display = 'block';

                        var clientSize = this._getClientSize();

                        if (clientSize.width <= parseInt(el.width)+50 || clientSize.height <= parseInt(el.height)+50) {
                            if ( clientSize.width <= parseInt(el.width)+50 ) {
                                div.style.left = '0px';
                                closeButton.style.left = parseInt(clientSize.width - 25) + 'px';
                            } else {
                                div.style.left = parseInt(clientSize.width/2 - el.width/2 ) + 'px';
                                closeButton.style.left = parseInt(clientSize.width / 2 + el.width/2) + 'px';
                            }

                            if ( clientSize.height <= parseInt(el.height)+50 ) {
                                div.style.top = '25px';
                                closeButton.style.top = '0px';
                            } else {
                                div.style.top = parseInt(clientSize.height/2 - el.height/2) + 'px';
                                closeButton.style.top = parseInt(clientSize.height/2 - el.height/2 - 25) + 'px';
                            }
                        } else {
                            switch (parseInt(position)) {
                                case 1:
                                    closeButton.style.left = parseInt(clientSize.width / 2 + el.width / 2) + 'px';
                                    div.style.left = parseInt(clientSize.width / 2 - el.width / 2) + 'px';
                                break;
                                case 2:
                                    closeButton.style.right = el.width + 'px';
                                    div.style.right = '0px';
                                break;
                                default:
                                    closeButton.style.left = el.width + 'px';
                                    div.style.left = '0px';
                                break;
                            }
                        }

                        setTimeout(function(){
                            try {
                                var closeButtonId = 'advertur_section_' + el.place + '_closeButton';
                                var div = top.AdverturManager.document.getElementById(el.place);
                                if(div) {
                                    div.style.border = '1px solid #000000';
                                    div.style.padding = '0px';
                                }
                                var closeButton = top.AdverturManager.document.getElementById(closeButtonId);
                                if(closeButton) {
                                    closeButton.style.display = 'block';
                                }
                            }catch(err){}
                        }, 4000);
                    }
                }
            },

            renderMobile: function (section_id) {
                var el = this.getBannerElementBySectionId(section_id),
                    htmlElement = this.document.getElementsByTagName("html")[0];
                if(el) {
                    this.mobileSectionId = section_id;
                    var closeButtonId = 'advertur_section_' + el.place + '_closeButton';
                    var div = this.document.getElementById(el.place);
                    if (div && !this.document.getElementById(closeButtonId)) {
                        div.style.border = '0px solid black';
                        div.style.margin = '0';
                        div.style.padding = '0';
                        div.style.position = 'absolute';
                        div.style.background = 'rgba(0, 0, 0, 0.701961)';
                        div.style.transform = 'translateZ(0px)';
                        div.style.overflow = 'hidden';
                        div.style.direction = 'ltr';
                        div.style.opacity = '1';
                        div.style.top = '0';
                        div.style.left = '0';
                        div.style.width = '100%';
                        div.style.height = '100%';
                        htmlElement.style.overflow = 'hidden';

                        this.renderBanner(section_id, el.place, '100%', '100%', 0, 0, 0, false);

                        var iframe = this.document.getElementById('advertur_section_' + el.place + '_iframe');
                        if(iframe) {
                            iframe.style.width = '100%';
                            iframe.style.height = '100%';
                        }

                        var divAt = this.document.getElementById('advertur_at_' + section_id);
                        if(divAt) {
                            divAt.style.width = '100%';
                            divAt.style.height = '100%';
                        }
                    }
                }
            },

            renderMobileSection: function(section_id, p, w, h, t) {
                var el = this.getBannerElementBySectionId(section_id),
                    place = p || ('advertur_' + section_id),
                    width = w || 0,
                    height = h || 0
                ;

                if( !el && !this.document.getElementById(place) && this.window['advertur_sections']) {
                    this.window['advertur_sections'].push({
                            section_id: section_id,
                            place: place,
                            width: 0,
                            height: 0,
                            rendered: true
                    });

                    var div = this.document.createElement("div");
                    div.id = place;
                    div.style.border = '0px solid black';
                    div.style.margin = '0';
                    div.style.padding = '0';
                    div.width = width;
                    div.height = height;

                    this.document.getElementsByTagName('body')[0].appendChild(div);
                    this.renderBanner(section_id, place, width, height, 0, 0, 0, false);
                }
            },

            reloadBannerPlace: function(section_id, s, h, r) {
                try {
                    if (this.window['advertur_sections'] && this.window['advertur_sections'].length) {
                        for (var index in this.window['advertur_sections']) {
                            if (this.window['advertur_sections'].hasOwnProperty(index)) {
                                if (this.window['advertur_sections'][index].section_id == section_id) {
                                    var div = this.document.getElementById(this.window['advertur_sections'][index].place),
                                        strict = this.window['advertur_sections'][index].strict || false;
                                    if(div && !strict) {
                                        div.innerHTML = '';

                                        this.window['advertur_sections'][index].rendered = false;
                                        this.window['advertur_sections'][index].s = (s || false);
                                        this.window['advertur_sections'][index].h = (h || false);
                                        this.window['advertur_sections'][index].r = (r || false);

                                        this.renderBanners();
                                        return;
                                    }
                                }
                            }
                        }
                    }
                }catch(err){ console.log(err); }
            },

            rotationBannerPlace: function(section_id, s, h, r) {
                try {
                    if (this.window['advertur_sections'] && this.window['advertur_sections'].length) {
                        for (var index in this.window['advertur_sections']) {
                            if (this.window['advertur_sections'].hasOwnProperty(index)) {
                                if (this.window['advertur_sections'][index].section_id == section_id) {
                                    var
                                        el = this.window['advertur_sections'][index],
                                        div = this.document.getElementById(el.place),
                                        strict = el.strict || false
                                    ;
                                    if(div && !strict && el.at_code) {
                                        try{
                                            var wrapper = this.document.createElement('div');
                                            wrapper.innerHTML = decodeURIComponent(el.at_code.replace(/\+/g, ' '));
                                            var
                                                all = wrapper.querySelectorAll('*')
                                            ;
                                            for(var i=0; i<all.length; i++) {
                                                if(all[i].nodeName == 'SCRIPT') {
                                                    if(all[i].src != '') {
                                                        var script = this.document.createElement('script');
                                                        for(k in all[i].attributes) {
                                                            if(all[i].attributes.hasOwnProperty(k)) {
                                                                var name_prop = all[i].attributes[k].name;
                                                                script[name_prop] = all[i][name_prop];
                                                            }
                                                        }
                                                        script.setAttribute('type', 'text/javascript');
                                                        div.appendChild(script);
                                                    } else {
                                                        div.appendChild(all[i]);
                                                        var last_child = div.childNodes[div.childNodes.length-1];
                                                        try {
                                                            eval.call(this.window, last_child.innerHTML);
                                                        } catch (e) {
                                                            console.log('http://ddnk.advertur.ru/v1/s/eval.call', e);
                                                        }
                                                    }
                                                } else {
                                                    div.appendChild(all[i]);
                                                }
                                            }
                                        } catch(e) {
                                            console.log(e, this);
                                        }
                                        return;
                                    }
                                }
                            }
                        }
                    }
                }catch(err){ console.log(err); }
            },

            renderCustomCode: function (section_id, code) {
                try {
                    if (this.window['advertur_sections'] && this.window['advertur_sections'].length) {
                        for (var index in this.window['advertur_sections']) {
                            if (this.window['advertur_sections'].hasOwnProperty(index)) {
                                if (this.window['advertur_sections'][index].section_id == section_id) {
                                    var
                                        el = this.window['advertur_sections'][index],
                                        div = this.document.getElementById(el.place),
                                        strict = el.strict || false
                                    ;
                                    if(div && !strict) {
                                        div.innerHTML = '';
                                        this._setCustomHTML(div, decodeURIComponent(code.replace(/\+/g, ' ')));
                                        return;
                                    }
                                }
                            }
                        }
                    }
                }catch(err){ console.log(err); }
            },

            removeBannersPlace: function(section_id) {
                try {
                    var
                        place = 'advertur_' + section_id,
                        el = this.getBannerElementBySectionId(section_id),
                        div
                    ;

                    if (el && el.rendered) {
                        place = el.place;
                    }

                    div = this.document.getElementById(place);
                    if(div) {
                        div.parentNode.removeChild(div);
                    }

                    div = this.document.getElementById('advertur_section_' + place + '_closeButton');
                    if(div) {
                        div.parentNode.removeChild(div);
                    }
                }catch(err){console.log(err);}
            },

            getBannerElementBySectionId: function(section_id) {
                var result = false;
                try {
                    if (this.window['advertur_sections'] && this.window['advertur_sections'].length) {
                        for (var index in this.window['advertur_sections']) {
                            if (this.window['advertur_sections'].hasOwnProperty(index)) {
                                if (this.window['advertur_sections'][index].section_id == section_id) {
                                    return this.window['advertur_sections'][index];
                                }
                            }
                        }
                    }
                }catch(err){
                    result = false;
                }
                return result;
            },

            msieversion: function() {
                try {
                    var ua = this.window.navigator.userAgent;
                    var msie = ua.indexOf('MSIE ');
                    if (msie > 0) {
                        return parseInt(ua.substring(msie + 5, ua.indexOf('.', msie)), 10);
                    }
                    var trident = ua.indexOf('Trident/');
                    if (trident > 0) {
                        var rv = ua.indexOf('rv:');
                        return parseInt(ua.substring(rv + 3, ua.indexOf('.', rv)), 10);
                    }

                    var edge = ua.indexOf('Edge/');
                    if (edge > 0) {
                        return parseInt(ua.substring(edge + 5, ua.indexOf('.', edge)), 10);
                    }
                }catch(err) {
                    return false;
                }
                return false;
            },

            loadData: function(type, url, params, cb) {
                if ((typeof XMLHttpRequest === 'undefined' || type === 'JSONP')) {
                    var script = this.document.createElement('script');
                    // params.callback = this.unique(8);
                    script.async = true;
                    script.src = url + '?' + this.serialize(params);

                    script.onload = function() {
                        script.parentNode.removeChild(script);
                        delete window[params.callback]
                    };

                    script.onerror = function() {
                        script.parentNode.removeChild(script);
                        delete window[params.callback];
                        return cb(new Error('Server not responded'))
                    };

                    this.document.body.appendChild(script)
                } else {
                    var req = new XMLHttpRequest(),
                        self = this;
                    req.timeout = 5000;
                    req.addEventListener('timeout', function() {
                        return cb(new Error('server timeout'))
                    }, true);
                    req.addEventListener('error', function() {
                        return cb(new Error('server error'))
                    });
                    req.addEventListener('abort', function() {
                        return cb(new Error('server abort'))
                    });
                    req.addEventListener('load', function() {
                        var resp = req.responseText;
                        try {
                            var fnParseJson = (JSON && JSON.parse) ? JSON.parse : function(sJSON) { return eval('(' + sJSON + ')'); };
                            var obj = fnParseJson(resp);
                            return cb(null, obj)
                        } catch (e) {
                            return cb(e)
                        }
                    });
                    req.open('GET', url + '?' + this.serialize(params));
                    return req.send();
                }
            },

            unique: function(length) {
                var chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ',
                    result = ''
                ;
                for (var i = length; i > 0; --i) {
                    result += chars[Math.floor(Math.random() * chars.length)];
                }
                return result;
            },

            serialize: function(obj) {
                var str = [];
                for (var p in obj)
                    if (obj.hasOwnProperty(p)) {
                        str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]))
                    }
                return str.join("&")
            },

            _getCookie: function(name) {
                var matches = this.document.cookie.match(new RegExp(
                    "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
                ));
                return matches ? decodeURIComponent(matches[1]) : undefined;
            },

            _setCookie: function(name, value, options) {
                options = options || {};

                var expires = options.expires;

                if (typeof expires == "number" && expires) {
                    var d = new Date();
                    d.setTime(d.getTime() + expires * 1000);
                    expires = options.expires = d;
                }
                if (expires && expires.toUTCString) {
                    options.expires = expires.toUTCString();
                }

                value = encodeURIComponent(value);

                var updatedCookie = name + "=" + value;

                for (var propName in options) {
                    updatedCookie += "; " + propName;
                    var propValue = options[propName];
                    if (propValue !== true) {
                        updatedCookie += "=" + propValue;
                    }
                }

                this.document.cookie = updatedCookie;
            },

            _getClientSize: function() {
                var K = this.document.createElement("div");
                K.setAttribute("style", "position:absolute;width:100%;height:100%;z-index:-9999;");
                this.document.body.appendChild(K);
                var J = {
                    width: K.clientWidth,
                    height: K.clientHeight
                };
                K.parentNode.removeChild(K);
                return J;
            },

            _getPositionElement: function(el) {
                var box = el.getBoundingClientRect();
                var body = document.body;
                var docEl = document.documentElement;
                var scrollTop = window.pageYOffset || docEl.scrollTop || body.scrollTop;
                var scrollLeft = window.pageXOffset || docEl.scrollLeft || body.scrollLeft;

                var clientTop = docEl.clientTop || body.clientTop || 0;
                var clientLeft = docEl.clientLeft || body.clientLeft || 0;

                var top = box.top + scrollTop - clientTop;
                var left = box.left + scrollLeft - clientLeft;

                return { top: Math.round(top), left: Math.round(left) };
            },

            _getStyle: function( el, styleProp ) {
                var y;
                if (el.currentStyle !== undefined) {
                    y = el.currentStyle[styleProp];
                } else if (this.window.getComputedStyle) {
                    y = this.document.defaultView.getComputedStyle(el, null).getPropertyValue(styleProp);
                }
                return y;
            },

            _getMaxClientSizeByElement: function(el) {
                var result = {
                    width: 0,
                    height: 0,
                    frl: 0
                }, frameEl;
                try {
                    var current = window;
                    if(current != top) {
                        try {
                            do {
                                frameEl = current.frameElement;
                                if (frameEl) {
                                    if (!result.width || result.width > frameEl.clientWidth) {
                                        result.width = frameEl.clientWidth;
                                    }
                                    if (!result.height || result.height > frameEl.clientHeight) {
                                        result.height = frameEl.clientHeight;
                                    }
                                    ++result.frl;
                                }
                                current = current.parent;
                            } while (current != current.parent);
                        } catch (e){}
                    } else {
                        var div = document.createElement('div');
                        div.style.width = '1000px';
                        div.style.height = '1000px';
                        el.appendChild(div);

                        result.width = el.clientWidth;
                        result.height = el.clientHeight;

                        var parent = el.parentNode;
                        while(parent) {
                            if(parent != document && getComputedStyle(parent).display == 'block') {
                                if (result.width > parent.clientWidth) {
                                    result.width = parent.clientWidth;
                                }
                                if (result.height > parent.clientHeight) {
                                    result.height = parent.clientHeight;
                                }
                            }
                            parent = parent.parentNode;
                        }

                        el.removeChild(div);
                    }

                } catch(e) {
                    console.log(e);
                }

                return result;
            },

            _setCustomHTML: function(block, html) {
                try{
                    var hiddenDiv = this.document.createElement('div');
                    hiddenDiv.innerHTML = html;
                    var
                        all = hiddenDiv.querySelectorAll('*'),
                        dest
                    ;
                    for(var i=0; i<all.length; i++) {
                        if(all[i].parentNode.parentNode === null) {
                            dest = block;
                        } else {
                            dest = all[i].parentNode;
                        }
                        if(all[i].nodeName == 'SCRIPT') {
                            if(all[i].src != '') {
                                var script = this.document.createElement('script');
                                for(var k in all[i].attributes) {
                                    if(all[i].attributes.hasOwnProperty(k)) {
                                        var name_prop = all[i].attributes[k].name;
                                        script[name_prop] = all[i][name_prop];
                                    }
                                }
                                script.setAttribute('type', 'text/javascript');
                                dest.appendChild(script);
                            } else {
                                dest.appendChild(all[i]);
                                try {
                                    eval.call(this.window, dest.childNodes[dest.childNodes.length-1].innerHTML);
                                } catch (e) {
                                    console.log('http://ddnk.advertur.ru/v1/s/eval.call', e);
                                }
                            }
                        } else {
                            dest.appendChild(all[i]);
                        }
                    }
                } catch(e) {
                    console.log(e, this);
                }
            },

            handleVisibilityChange: function () {
                try {
                    var self = this.window.AdverturManager || top.window.AdverturManager;
                    if(self) {
                        if (self.document[self.hidden]) {
                            //
                        } else {
                            //reload
                            if (self.window['advertur_sections'] && self.window['advertur_sections'].length) {
                                for (var index in self.window['advertur_sections']) {
                                    if (self.window['advertur_sections'][index].rendered ) {
                                        var el = self.window['advertur_sections'][index];
                                        self.rotationBannerPlace(el.section_id, el.h, el.s, 13);
                                    }
                                }
                            }
                        }
                    }
                }catch(err){ }
            },

            handleMessage: function (event) {
                var
                    self = false,
                    current = window
                ;

                var fnParseJson = (JSON && JSON.parse) ? JSON.parse : function(sJSON) { return eval('(' + sJSON + ')'); };
                try {
                    for (var i = 0; i < 10; i++) {
                        if (current.AdverturManager) {
                            self = current.AdverturManager;
                            break;
                        } else {
                            current = current.parent;
                        }
                    }
                }catch(e){ console.log(e); }

                if(!self) {
                    return;
                }

                if(event && event.data){
                    if(event.data == 'mobile_fullscreen_close') {
                        try {
                            if(self.mobileSectionId) {
                                self._setCookie('advertur_hide_' + self.mobileSectionId, 1, {patch: '/', expires: 60 * 60});
                                self.removeBannersPlace(self.mobileSectionId);
                                self.document.getElementsByTagName("html")[0].style.overflow = '';
                            }
                        } catch (e) {
                            console.log(e);
                        }
                    } else {
                        try {
                            var message = fnParseJson(decodeURIComponent(event.data.replace(/\+/g, ' ')));
                            if(message && message.name) {
                                switch(message.name) {
                                    case 'reloadBannerPlace':
                                        self.reloadBannerPlace(message.section_id || 0, message.s || false, message.h || false, message.r || false);
                                    break;
                                }
                            }
                        } catch(e) {}
                    }
                }
            },

            setElementSettings: function(section_id, name, value) {
                try {
                    if (this.window['advertur_sections'] && this.window['advertur_sections'].length) {
                        for (var index in this.window['advertur_sections']) {
                            if (this.window['advertur_sections'].hasOwnProperty(index)) {
                                if (this.window['advertur_sections'][index].section_id == section_id) {
                                    this.window['advertur_sections'][index][name] = value;
                                }
                            }
                        }
                    }
                }catch(err){ }
            },

            _getClientPage: function() {
                var result = '', error = 0;

                try {
                    result = encodeURIComponent(top.location.href);
                }catch(err){error = 1;}

                if(error && result == '') {
                    try{
                        var current = this.window;
                        for(var i = 0; i < 10; i++) {
                            if(current != top) {
                                if (current.location.href) {
                                    result = encodeURIComponent(current.location.href);
                                }
                                current = current.parent;
                            }
                        }
                    }catch(err){ }
                }
                return result;
            }
        };

        w.AdverturManager.init(w, d);
    }
})(window, document);