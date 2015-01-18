;(function(global, ns, undefined) {

  /**
   *  名前空間
   */
  Util = typeof Util === 'undefined' ? {} : Util;

  ns.Util = Util;

  /**
   *  キャッシュ
   */
  var doc = global.document,
      encodeURIComponent = global.encodeURIComponent,
      decodeURIComponent = global.decodeURIComponent;

  /**
   *  クッキーに保存された値を返す
   *  @param {String} name クッキー名
   *  @return {String} rslt 保存された値
   */
  Util.getCookie = function(name) {
    var rslt = null,
        tgtCk = name + '=',
        Cks = doc.cookie,
        pos = Cks.indexOf(tgtCk);

    if(pos != -1) {
      var sIndx = pos + tgtCk.length,
          eIndx = Cks.indexOf(';', sIndx);

      if(eIndx == -1) {
        eIndx = Cks.length;
      }
      rslt = decodeURIComponent(Cks.substring(sIndx, eIndx));
    }

    return rslt;
  };

  /**
   *  URLのパラメータをオブジェクトで返す
   *  @return {Object} vars URLパラメータオブジェクト
   */
  Util.getUrlParams = function() {
    var vars = {}, params,
        temp_params = window.location.search.substring(1).split('&');

    for(var i = 0; i <temp_params.length; i++) {
      params = temp_params[i].split('=');
      //vars[params[0]] = params[1];
      if(params[0]) {
        vars[decodeURIComponent(params[0])] = decodeURIComponent((params[1]||"").replace(/\+/g, " "));
      }
    }
    return vars;
  };

  /**
   *  クッキーをセットする
   *  @param {String} name 名前
   *  @param {String} data データ
   *  @param {Number} expires 有効期限
   */
  Util.setCookie = function(name, data, expires) {
    var ck = encodeURIComponent(name) + '=' + encodeURIComponent(data);

    if(expires){
      var date = new Date();
      date.setTime(+date + expires);
      ck = ck + ';expires=' + date.toGMTString();
    }

    doc.cookie = ck;

    return doc.cookie;
  };

  /**
   *  引数の時間をミリ秒にして返す
   *  @param {Number} value 時間
   *  @param {Number} unit 単位
   */
  Util.toMilliSec = function(value,unit){
    var rslt = value;

    //Fall Through
    switch(unit){
      case 'day':
        rslt = rslt * 24;
      case 'hrs':
        rslt = rslt * 60;
      case 'min' :
        rslt = rslt * 60;
      case 'sec' :
        rslt = rslt * 1000;
        return rslt;
        break;
      default :
        console.error('invalid arguments[unit]');
        break;
    }
  };


  /**
   *  強制再描画
   *  @param {Element} elm
   */
  Util.forceReflow = function(elm) {
    var elm = elm || doc.body,
        div = doc.createElement('div'),
        style = div.style,
        overflow = elm.overflow;

    elm.overflow = "hidden";
    style.position = "relative";
    style.left = "-100%";
    style.top = "10px";
    style.height = "1px";
    style.width = "1px";

    elm.appendChild(div);

    setTimeout(function(){
      elm.removeChild(div);
      elm.overflow = overflow;
    },100);

    console.log("REFLOW:");
  };

  /**
   *  該当要素をクリック可にする
   *  @param {Element} baseElm 検索基準要素
   */
  Util.enableClickable = function(baseElm) {
    var a, iframe,
        i = 0,
        len;

    if(baseElm == null) {
      baseElm = doc.querySelector('[data-layer-content]');
    }

    a = baseElm.querySelectorAll('a');
    iframe = baseElm.querySelectorAll('iframe');

    len = a.length;
    for(;i < len; i++) {
      a[i].style.pointerEvents = "";
    }
    i = 0;

    len = iframe.length;
    for(;i < len; i++) {
      iframe[i].style.pointerEvents = "";
    }
  };

  /**
   *  該当要素をクリック不可にする
   *  @param {Element} baseElm 検索基準要素
   */
  Util.disableClickable = function(baseElm) {
    var a, iframe, video,
        i = 0,
        len;

    if(baseElm == null) {
      baseElm = doc.querySelector('[data-layer-content]');
    }

    a = baseElm.querySelectorAll('a');
    iframe = baseElm.querySelectorAll('iframe');

    len = a.length;
    for(;i < len; i++) {
      a[i].style.pointerEvents = "none";
    }
    i = 0;

    len = iframe.length;
    for(;i < len; i++) {
      iframe[i].style.pointerEvents = "none";
    }
  };

  /**
   *  様々な環境値を返す
   *  @return {Object} 環境値
   */
  Util.env = (function() {
    var ua = window.navigator.userAgent,
        ptn = {iOS: /iP(hone|od|ad)/, android: /Android/},
        os = ptn.iOS.test(ua) ? 'iOS' : ptn.android.test(ua) ? 'android' : '',
        orientation = 'orientation' in window && 'onorientationchange' in window,
        deviceOrientation = 'ondeviceorientation' in window,
        touch = 'ontouchend' in doc,
        cssTransitions = 'WebKitTransitionEvent' in window,
        pushState = 'pushState' in history && 'replaceState' in history,
        isIOS =  (function() { return os === 'iOS'; })(),
        isAndroid = (function() { return os === 'android'; })(),
        isMobile = (function() { return isIOS || isAndroid; })(),
        isTouchDevice = (function() { return touch; })(),
        androidVer = (function() {
          return isAndroid ? parseFloat(ua.slice(ua.indexOf("Android")+8)) : undefined;
        })(),
        iOSVer = (function() {
          var v = undefined;
          if (isIOS) {
            v = (navigator.appVersion).match(/OS (\d+)_(\d+)_?(\d+)?/);
            v = parseInt(v[1], 10) + parseInt(v[2], 10) / 10;
          }
          return v;
        })(),
        isModernBrowser = (function() {
          return iOSVer >= 6 || androidVer >= 4.3 ? true : false;
        })(),
        hasParallax = (function() {
          return deviceOrientation || androidVer >= 4 ? true : false;
        })(),
        hasFixed = (function() {
          return isIOS || androidVer >= 3 ? true : false;
        })(),
        hasForceReflow = (function() {
          return iOSVer < 6 || isAndroid ? true : false;
        })(),
        hasAnimation = (function() {
          return isIOS || androidVer >= 3 ? true : false;
        })();

    return {
      ua: ua,
      orientation: orientation,
      deviceOrientation: deviceOrientation,
      touch: touch,
      cssTransitions: cssTransitions,
      pushState: pushState,
      isIOS: isIOS,
      isAndroid: isAndroid,
      isMobile: isMobile,
      isTouchDevice: isTouchDevice,
      iOSVer: iOSVer,
      androidVer: androidVer,
      isModernBrowser: isModernBrowser,
      hasParallax: hasParallax,
      hasFixed: hasFixed,
      hasForceReflow: hasForceReflow,
      hasAnimation: hasAnimation
    };
  })();

})(this.self || global, TL);