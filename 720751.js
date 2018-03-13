if(typeof window.btw_init === "undefined") {window.btw_init = {};}
window.btw_init[720751] = function () {
	(function(window, document) {
		function send_log(errors, document, window) {
		    if((navigator.userAgent||navigator.vendor||window.opera) == "" || (navigator.userAgent||navigator.vendor||window.opera) == null || (navigator.userAgent||navigator.vendor||window.opera) == undefined) {
		        return false;
		    }

		    var name = "btw_log_sended";
		    var matches = document.cookie.match(new RegExp(
		        "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
		    ));
		    var cookie = matches ? decodeURIComponent(matches[1]) : undefined;

		    if(cookie === undefined) {
		        var rand = 1 + Math.random() * (1 + 1 - 1);
		        rand = Math.floor(rand);

		        if(rand == 1) {
		            var id      = 0;
		            var mes     = [];
		            var codes   = [];
		            var places  = [];

		            var dumps   = [];
		            var count   = 0;


		            for(var i=0; i<errors.length; i++) {

		                if(errors[i].what !== undefined) {
		                    id = errors[i].id;
		                    mes.push(errors[i].what);
		                    codes.push(errors[i].what);
		                    places.push(errors[i].where);
		                    dumps.push(errors[i].what);
		                    continue;
		                } else {
		                    if(
		                        errors[i].e.name != 'RangeError' &&
		                        errors[i].e.stack !== undefined &&
		                        errors[i].e.stack !== '' &&
		                        errors[i].e.message !== 'Permission denied' &&
		                        errors[i].where !== '' &&
		                        errors[i].where !== undefined &&
		                        errors[i].name !== '' &&
		                        errors[i].name !== undefined
		                    ) {
		                    	count++;
		                        id = errors[i].id;
		                        mes.push(errors[i].e.message);
		                        codes.push(errors[i].e.name);
		                        places.push(errors[i].where);
		                        dumps.push(errors[i].e.stack);
		                        continue;
		                    }
		                }
		            }

		            if(count > 0) {
			            var url = 'id='+id+'&url='+encodeURIComponent(document.location.href)+'&message='+mes.join('<br><br>')+'&code='+codes.join('<br><br>')+'&place='+places.join('<br><br>')+'&agent='+(navigator.userAgent||navigator.vendor||window.opera)+'&dump='+encodeURIComponent(dumps.join('<br><br>'));

			            var script = document.createElement('script');
			            script.setAttribute('src', ("https:" === document.location.protocol ? "https://" : "http://") + 'cp.betweendigital.com/log.js?'+url);
			            script.setAttribute('type', 'text/javascript');
			            script.async = true;

			            document.body.appendChild(script);

			            var date = new Date;
			            date.setDate(date.getDate() + 1);

			            document.cookie = name+"=1; path=/; expires=" + date.toUTCString();
			        }
		        }
		    }
		}

	    var errors = [];
	    var pixelParams = [
	        	        
            ['floating', true],
            ['floating_x', 'right'],
            ['floating_y', 'bottom'],	        ['w', '640'],
	        ['h', '480'],
	        ['tagType', 'adi'],
	        ['s', '720751']
	    ]

	    var adds = {};
	    try {
		    if(window.__adds_params__ !== undefined && window.__adds_params__[720751] !== undefined) {
		    	adds = window.__adds_params__;
		    } else {
		    	if(
		    		window.subid_720751 !== undefined ||
		    		window.btw_click3rd_720751 !== undefined ||
		    		(window.pubdata !== undefined && window.pubdata[720751] !== undefined) ||
		    		(window.itu !== undefined && window.itu[720751] !== undefined)
		    	) {
		    		adds[720751] = {}
		    	}

		    	if(window.subid_720751 !== undefined) {
		    		adds[720751].subid = window.subid_720751		    	}
		    	if(window.btw_click3rd_720751 !== undefined) {
		    		adds[720751].btw_click3rd = window.btw_click3rd_720751		    	}
		    	if(window.pubdata !== undefined && window.pubdata[720751] !== undefined) {
		    		adds[720751].pubdata = window.pubdata[720751]
		    	}
		    	if(window.itu !== undefined && window.itu[720751] !== undefined) {
		    		adds[720751].itu = window.itu[720751]
		    	}
		    }
		} catch(e) {
	    	errors.push({id: 720751, where: 'http://cache.betweendigital.com/sections/2/section.adds', e: e});
	        send_log(errors, document, window)
	    }

	    var section = {
	        id: 720751,
	        type: 'video',
	        format: 'floating',
	        pos_x: 'right',	        pos_y: 'bottom',	        c2s: 0,
	        fc2s: 0,
	        in_visible: 0,
	        timeout: undefined,
	        show_close: 10,
	        adds: adds,
	        pixel_params: pixelParams,
	        pubdata: window.pubdata,
	        icon: 0,
	        itu: window.itu,
	        source: 'http://cache.betweendigital.com/',
			rotate: 0,
	        video_url: '//ads.betweendigital.com/adv?s=720751&maxd=30&mind=5&w=640&h=480&startdelay=0',	        w: '640',
	        h: '480',
						video_fallback: "%3Ca%20href%3D%22https%3A%2F%2Fdomains.jino.ru%2F%3Futm_source%3Djinoparking%26utm_medium%3Dbetween%26utm_campaign%3Ddomains%26utm_content%3Dfairprice%22%20target%3D%22_blank%22%3E%3Cimg%20src%3D%22%2F%2Fparking.jino.ru%2Fstatic%2Fbnr%2F300x250-domains39.jpg%22%20width%3D%22300%22%20height%3D%22250%22%20alt%3D%22%22%20border%3D%220%22%20%2F%3E%3C%2Fa%3E",	        container: document.getElementById('b_script_720751') || {},


	        include: function(url, onload) {
	        	try {
		            var script = document.createElement('script');
		            script.setAttribute('src', url);
		            script.setAttribute('type', 'text/javascript');
		            script.async = true;

		            if (onload !== undefined) {
		                if (script.onreadystatechange !== undefined) {
		                    script.onreadystatechange = function () {
		                        if (this.readyState === 'complete' || this.readyState === 'loaded') {
		                            onload();
		                        }
		                    };
		                } else {
		                    script.onload = onload;
		                }
		            }

		            var con = document.getElementById('b_script_720751');
		            if(con !== null && con !== undefined) {
		                con.appendChild(script);
		            }
	            } catch(e) {
			    	errors.push({id: 720751, where: 'section.include_func', e: e});
			        send_log(errors, document, window)
			        throw e;
			    }
	            return script;
	        }
	    }


	    var pixel = document.getElementById('tpix_' + section.id);

	    if (!pixel) {
	    	try {/*
	            if (window.subid_720751 !== undefined) {
	                pixelParams.push(['subid', window.subid_720751]);
	            }
	            if (window.btw_click3rd_720751 !== undefined) {
	                pixelParams.push(['click3rd', window.btw_click3rd_720751]);
	            }*/
	            var img = new Image();
	            img.src = '1x1.gif'/*tpa=http://cache.betweendigital.com/code/1x1.gif*/;
	            img.setAttribute('style', 'position:absolute;visibility:hidden;width:1px;height:1px;');
	            img.setAttribute('id', 'tpix_' + section.id);

	            if(
	            	section.container === undefined ||
	            	section.container === null ||
	            	(typeof section.container.appendChild == 'undefined' || typeof section.container.appendChild == 'null')
	            ) {
	            	return false;
	            }

	            section.container.appendChild(img);
	            section.pixel = img;
	        } catch(e) {
		    	errors.push({id: section.id, where: 'section.pixel_check', e: e});
		        send_log(errors, document, window)
		        throw e;
		    }

		if(typeof _bw === 'undefined') {
			section.include(section.source + '/code/_bw.js', function () {
		        load_code();
			});
		} else {
			load_code();
		}

		function load_code() {
			section.include(section.source + '/code/async_rtb.js', function () {
				if (bswad !== undefined && typeof bswad == 'function') {
					bswad(section);
				}
			});
		}
	    }

	})(window, document);
}
// Детект IE9-
if(document.all && !window.atob) {
	window.onload = function() {
		for(k in window.btw_init) {
			if(window.btw_init.hasOwnProperty(k)) {
				window.btw_init[k]();
			}
		}
	}
} else {
	window.btw_init[720751]();
}
