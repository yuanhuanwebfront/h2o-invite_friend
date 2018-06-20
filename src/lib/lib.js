  let self = this;

  let DY = function() {
    if (obj instanceof _) return obj;
    if (!(this instanceof _)) return new DY(obj);
    this._wrapped = obj;
  };

  self.DY = DY;

  DY.version = '1.0.5';

  DY.prototype.value = function() {
    return this._wrapped;
  };

  let ua = navigator.userAgent.toLowerCase();
  DY.isMobile = (function() {
    try {
      document.createEvent("TouchEvent");
      return true;
    } catch (e) {
      return false;
    }
  })();
  if (DY.isMobile) {
    DY.device = {};
    DY.device.app = navigator.appVersion;
    DY.isiDevice = /ip(hone|od|ad)/i.test(ua);
    DY.isAndroid = /android/i.test(ua);
    DY.isWechat = /micromessenger/i.test(ua);
    DY.isQQ = ua.match(/qq\/([0-9]*)/);
    DY.isQQBrowser = /mqqbrowser/i.test(ua);
    DY.screenWidth = (window.innerWidth > 0) ? window.innerWidth : screen.width;
    DY.isPad = DY.screenWidth >= 768;
    DY.isWeibo = (navigator.userAgent.indexOf('Weibo') > -1) ? true : false;
    DY.isChrome = /Chrome/i.test(ua);
    if (DY.isiDevice) {
      var _v = ua.match(/os (\d+)_(\d+)_?(\d+)?/);
      DY.device.version = [parseInt(_v[1], 10), parseInt(_v[2], 10), parseInt(_v[3] || 0, 10)].join('.');
    }
    if (DY.isAndroid) {
      DY.device.version = ua.match(/android\s([0-9\.]*)/)[1];
    }
  }

  DY.prototype.valueOf = DY.prototype.toJSON = DY.prototype.value;

  DY.prototype.toString = function() {
    return '' + this._wrapped;
  };

  var bridgeInitCallbaockQueue = [],
	  bridgeInitFlag;
  function connectWebViewJavascriptBridge(callback) {
    if (bridgeInitFlag) {
      bridgeInitCallbaockQueue.push(callback)
    } else {
      bridgeInitFlag = true;
      document.addEventListener('WebViewJavascriptBridgeReady', function(event) {
        DY.bridge = event.bridge;
        event.bridge.init(function() {});
        for (var i = 0; i < bridgeInitCallbaockQueue.length; i++) {
          bridgeInitCallbaockQueue[i]();
        }
      }, false);
    }
  }
  //  新的验签获取webview的bridge方法
  function connectNewWebViewJavascriptBridge(callback) {
      if (window.WebViewJavascriptBridge) {
          return callback(WebViewJavascriptBridge);
      }
      if (window.WVJBCallbacks) {
          return window.WVJBCallbacks.push(callback);
      }
      window.WVJBCallbacks = [callback];
      var WVJBIframe = document.createElement('iframe');
      WVJBIframe.style.display = 'none';
      WVJBIframe.src = 'https://__bridge_loaded__';
      document.documentElement.appendChild(WVJBIframe);
      setTimeout(function () {
          document.documentElement.removeChild(WVJBIframe)
      }, 0)
  }

  DY.connectWebViewBridge = function(callback) {
    if (!callback || typeof callback !== 'function') {
      callback = function() {};
    }
    if (DY.isiDevice) {
      if (typeof DY.bridge === 'undefined') {
        connectWebViewJavascriptBridge(callback)
      } else {
        callback();
      }
    } else {
      callback();
    }
  };

  DY.connectNewWebViewBridge = function (callback) {
      if (!callback || typeof callback !== 'function') {
          callback = function() {};
      }
      if (DY.isiDevice) {
          if (typeof DY.bridge === 'undefined') {
              connectNewWebViewJavascriptBridge(function(bridge) {
                  DY.bridge = bridge;
                  let event = document.createEvent('Events');
                  event.initEvent('newBridgeReady', false, false);
                  document.dispatchEvent(event);
              })
          } else {
              callback();
          }
      }
  };

  DY.connectWebViewBridge();
  DY.connectNewWebViewBridge();


  let qiniuCrop = function(type, url, w, h, q) {
    var cfg_w = '/w/' + w;
    var cfg_h = '/h/' + w;
    var cfg_q = '';

    if (h) {
      cfg_h = '/h/' + h;
    }

    if (q) {
      cfg_q = '/q/' + q;
    }
    return url + '?imageView2/' + type + cfg_w + cfg_h + cfg_q;
  };

  let dyCrop = function(url, w, h, q) {
    var str = url.split('.');
    var cfg_w = '_' + w + '-' + w;
    var cfg_q = '';

    if (h) {
      cfg_w = '_' + w + '-' + h;
    }

    if (q) {
      cfg_q = '_' + q;
    }

    if (str[str.length - 2].indexOf('_') < 0) {
      str[str.length - 2] += cfg_w;
      str[str.length - 2] += cfg_q;
      return str.join('.');
    } else {
      return url;
    }
  };

  DY.crop = function() {
    var args = Array.prototype.slice.call(arguments, 0);
    var url = args[0];
    var w = args[1];
    var h = args[2];
    var q = args[3];
    var type = 2;
    if (!isNaN(args[0])) {
      type = args[0];
      url = args[1];
      w = args[2];
      h = args[3];
      q = args[4];
    }
    var str = url.split('.');
    var isDY = /dailyyoga.com.cn/.test(url);
    var isQiniu = /qiniucdn/.test(url);
    if (isQiniu) {
      return qiniuCrop(type, url, w, h, q);
    } else if (isDY) {
      return dyCrop(url, w, h, q);
    } else {
      return url;
    }
  };

  DY.quality = function() {
    var args = Array.prototype.slice.call(arguments, 0);
    var str = args[0].split('.');
    var isDY = /dailyyoga.com.cn/.test(args[0]);
    var isQiniu = /qiniucdn/.test(args[0]);
    if (isQiniu) {
      return args[0].split('?')[0] + '?imageView2/1/q/' + args[1];
    } else if (str[str.length - 2].indexOf('_') < 0 && isDY) {
      var _str = str[str.length - 2] + '_' + args[1];
      str[str.length - 2] = _str;
      return str.join('.');
    } else {
      return args[0];
    }
  };

  DY.getUrlQueryObj = function(url) {
    url = url == null ? window.location.href : url;
    var search = url.substring(url.lastIndexOf("?") + 1);
    var obj = {};
    var reg = /([^?&=]+)=([^?&=]*)/g;
    search.replace(reg, function(rs, $1, $2) {
      var name = decodeURIComponent($1);
      var val = decodeURIComponent($2);
      // val = val?isNaN(val)?String(val):parseInt(val):null;
      obj[name] = val;
      return rs;
    });
    return obj;
  };

  DY.compareVersion = function(a, b) {
    var as = a.split('.');
    var bs = b.split('.');
    if (a === b) return 0;

    for (var i = 0; i < as.length; i++) {
      var x = parseInt(as[i]);
      if (!bs[i]) return 1;
      var y = parseInt(bs[i]);
      if (x < y) return -1;
      if (x > y) return 1;
    }
    return -1;
  };

  DY.addSearch = function(url, search) {
    var _obj = DY.getUrlQueryObj(url);
    var _query = search || DY.getUrlQueryObj();
    var _search = '';
    $.each(_query, function(i, v) {
      if (!_obj[i] && !!v) {
        _search += '&' + i + '=' + v;
      }
    });
    if (url.indexOf('?') < 0) {
      return url += _search.replace('&', '?');
    } else {
      return url += _search;
    }
  };

  DY.preloadImages = function(imgs) {
    var newimages = [],
      loadedimages = 0
    var postaction = function() {}
    var imgs = (typeof imgs != "object") ? [imgs] : imgs

    function imageloadpost() {
      loadedimages++
      if (loadedimages == imgs.length) {
        postaction(newimages) //call postaction and pass in newimages array as parameter
      }
    }
    for (var i = 0; i < imgs.length; i++) {
      newimages[i] = new Image();
      newimages[i].src = imgs[i];

      newimages[i].onload = function() {
        imageloadpost()
      }
      newimages[i].onerror = function() {
        imageloadpost()
      }
    }
    return { //return blank object with done() method
      done: function(f) {
        postaction = f || postaction //remember user defined callback functions to be called when images load
      }
    }
  };

  DY.removeURLParameters = function(parameters, url) {
    url = url || location.href;
    var urlparts = url.split('?');
    if (urlparts.length >= 2) {
      if (typeof parameters === 'string') {
        parameters = [parameters];
      }

      var pars = urlparts[1].split(/[&;]/g);
      for (var i = 0; i < parameters.length; i++) {

        var prefix = encodeURIComponent(parameters[i]) + '=';

        //reverse iteration as may be destructive
        for (var j = pars.length; j-- > 0;) {
          //idiom for string.startsWith
          if (pars[j].lastIndexOf(prefix, 0) !== -1) {
            pars.splice(j, 1);
          }
        }

      };
      if (pars.length == 0) {
        return url = urlparts[0];
      } else {
        return url = urlparts[0] + '?' + pars.join('&');
      }
    } else {
      return url;
    }
  };

  DY.hasClass = function(el, cns) {
    return el.className.match(new RegExp('(\\s|^)' + cns + '(\\s|$)'));
  };

  DY.addClass = function(el, cns) {
    if (!DY.hasClass(el, cns)) el.className += " " + cns;
  };

  DY.removeClass = function(el, cns) {
    if (DY.hasClass(el, cns)) {
      var reg = new RegExp('(\\s|^)' + cns + '(\\s|$)');
      el.className = el.className.replace(reg, ' ');
    }
  };

  DY.send = function(obj, callback) {
    console.log(obj);

    if (DY.isiDevice) {
      console.log('iDevice: ', JSON.stringify(obj));

      if (DY.bridge && DY.bridge.send) {
          DY.bridge.send(obj, callback);
      } else {
        //window.location = "ios:"+obj.method+"?"
        console.error('Bridge is not ready!');
      }
    }

    if (DY.isAndroid) {
      console.log('Android: ', JSON.stringify(obj));
      if (typeof Android !== 'undefined') {
        console.log('DY send run: Android.' + obj.method + '()');
        if (Object.getOwnPropertyNames && Object.getOwnPropertyNames(obj).length > 1) {
          if (obj.callback && callback) {
            window[obj.callback] = callback;
          }
          Android[obj.method](JSON.stringify(obj));
        } else {
          Android[obj.method]();
        }
      } else {
        console.error('Android is undefined!');
      }
    }
  };

  DY.sendBridge = function (obj, callback) {
      DY.bridge.callHandler('ocFunction', obj, callback);
  };

  DY.sendWebkit = function(obj, callback) {

        if (DY.isiDevice) {
            window.webkit.messageHandlers.ocFunction.postMessage(obj);
            return "";
        }
    };

  DY.registerHandler = function(name, callback) {
    if (DY.isiDevice) {
      if (DY.bridge && DY.bridge.registerHandler) {
        DY.bridge.registerHandler(name, callback);
      }
    }

    if (DY.isAndroid) {
      window[name] = callback;
    }
  };

  DY.getTimestamp = function() {
    return new Date().getTime();
  };

  DY.timeFormat = function(time, format) {
    var o = {
      "M+": time.getMonth() + 1, //month
      "d+": time.getDate(), //day
      "h+": time.getHours(), //hour
      "m+": time.getMinutes(), //minute
      "s+": time.getSeconds(), //second
      "q+": Math.floor((time.getMonth() + 3) / 3), //quarter
      "S": time.getMilliseconds() //millisecond
    }

    if (/(y+)/.test(format)) {
      format = format.replace(RegExp.$1, (time.getFullYear() + "").substr(4 - RegExp.$1.length));
    }

    for (var k in o) {
      if (new RegExp("(" + k + ")").test(format)) {
        format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length));
      }
    }
    return format;
  };

  /**
   *拉起客户端  v1.0.5 新增
   * @type   1: 'home_page', //首页，: 'post_detail',//帖子详情，3: 'course_detail',课程详情，
   *         4: 'program_detail',//计划详情，5: 'action_library',//动作库详情  6: 'bbs' //瑜乐圈首页   8: 'kol_list', //kol列表
             9: 'kol_detail' //kol详情
   * @id  首页tab值，或者详情页id
   * @callback 客户端唤起失败回调函数
   **/
  DY.schemeHref = function(type, id, errorCallback) {

    if (!errorCallback && typeof id === 'function') {
      errorCallback = id;
    }
    var _schemeUrl = schemeUrl(type, id);
    var getTimestamp = DY.getTimestamp();
    var _iframe = document.getElementById("open_app_iframe");
    _iframe || (_iframe = document.createElement("iframe"),
      _iframe.setAttribute("id", "open_app_iframe"),
      document.body.appendChild(_iframe));
    _iframe.style.display = 'none';

    var version = DY.device.version.split(".");
    version = parseInt(version[0]);
    if ((DY.isiDevice && version >= 9) || DY.isChrome) {
      location.href = _schemeUrl;
    } else {
      _iframe.setAttribute("src", _schemeUrl)
    }

    var timer = window.setTimeout(function() {
      clearTimeout(timer), DY.getTimestamp() - getTimestamp < 2000 && (
        errorCallback && setTimeout(function() {
          errorCallback();
        }, 300));
    }, 1000);
  };

  DY.sendNative = function(str){
      if(DY.isAndroid){
          native.useSystemComponents(str);
      }else{
          window.webkit.messageHandlers.callNative.postMessage(str);
      }
  };

  DY.setTitle = function(title){
      try{
          native.jsSetTitle(title);
      }catch(e){
          let obj = {
              method: 'jsSetTitle',
              info: {
                  title: title
              }
          };

          if(typeof window.webkit !== 'undefined'){
              window.webkit.messageHandlers.callNative.postMessage(JSON.stringify(obj));
          }
      }
  };

  let schemeUrl = function(type, id) {
    var _schemeUrl = "DailyYoga://";
    var _types = {
      1: 'home_page', //首页 tab  0:计划， 1：课程，2：动作库
      2: 'post_detail', //帖子详情:id
      3: 'course_detail', //课程详情:id
      4: 'program_detail', //计划详情:id
      5: 'action_library', //动作库详情:id
      6: 'bbs', //瑜乐圈首页
      7: 'partner_team', //结伴首页 id
      8: 'kol_list',
      9: 'kol_detail'
    };
    if (type) {
      if (type === 1 || type === 6) {
        if (id || id === 0) {
          _schemeUrl += _types[type] + '?tab=' + id;
        } else {
          _schemeUrl += _types[type];
        }
      } else if (type === 7 || type === 8) {
        if (id || id === 0) {
          _schemeUrl += _types[type] + '?id=' + id;
        } else {
          _schemeUrl += _types[type];
        }
      } else {
        if (id || id === 0) {
          _schemeUrl += _types[type] + '?id=' + id;
        } else {
          return false;
        }
      }
    }
    return _schemeUrl;
  };

  export {DY};
