/**
 * bind Pollyfill
 */
if (!Function.prototype.bind) {
  Function.prototype.bind = function (oThis) {
    if (typeof this !== "function") {
      // closest thing possible to the ECMAScript 5 internal IsCallable function
      throw new TypeError("Function.prototype.bind - what is trying to be bound is not callable");
    }

    var aArgs = Array.prototype.slice.call(arguments, 1),
        fToBind = this,
        fNOP = function () {},
        fBound = function () {
          return fToBind.apply(this instanceof fNOP
                                 ? this
                                 : oThis || window,
                               aArgs.concat(Array.prototype.slice.call(arguments)));
        };

    fNOP.prototype = this.prototype;
    fBound.prototype = new fNOP();

    return fBound;
  };
}

/*
*   Redefine document.createStyleSheet() in IE11
*   Free and unencumbered, released into the public domain.
*/
(function(d) {
  'use strict';
  d.documentMode === 11 && (d.createStyleSheet = function(s, i) {
    var o = d.createElement('style'), x;
    s && (x = new XMLHttpRequest(), x.onreadystatechange = function() {
    x.readyState === 4 && x.status === 200 && (o = d.createElement('link'), o.setAttribute('rel', 'stylesheet'), o.setAttribute('href', s));
    }, x.open('GET', s, false), x.send(null));
    i && (x = d.styleSheets, x[i]) ? (x = x[i].ownerNode, x.parentNode.insertBefore(o, x)) : d.querySelector('head').appendChild(o);
    return o.sheet;
  });
})(document);

/**
 * addEventListener Pollyfill
 */
!window.addEventListener && (function (WindowPrototype, DocumentPrototype, ElementPrototype, addEventListener, removeEventListener, dispatchEvent, registry) {
  WindowPrototype[addEventListener] = DocumentPrototype[addEventListener] = ElementPrototype[addEventListener] = function (type, listener) {
    var target = this;

    registry.unshift([target, type, listener, function (event) {
      event.currentTarget = target;
      event.preventDefault = function () { event.returnValue = false };
      event.stopPropagation = function () { event.cancelBubble = true };
      event.target = event.srcElement || target;

      listener.call(target, event);
    }]);

    this.attachEvent("on" + type, registry[0][3]);
  };

  WindowPrototype[removeEventListener] = DocumentPrototype[removeEventListener] = ElementPrototype[removeEventListener] = function (type, listener) {
    for (var index = 0, register; register = registry[index]; ++index) {
      if (register[0] == this && register[1] == type && register[2] == listener) {
        return this.detachEvent("on" + type, registry.splice(index, 1)[0][3]);
      }
    }
  };

  WindowPrototype[dispatchEvent] = DocumentPrototype[dispatchEvent] = ElementPrototype[dispatchEvent] = function (eventObject) {
    return this.fireEvent("on" + eventObject.type, eventObject);
  };
})(Window.prototype, HTMLDocument.prototype, Element.prototype, "addEventListener", "removeEventListener", "dispatchEvent", []);

/**
 * jQuery easing
 */
$.easing['jswing'] = $.easing['swing'];
$.extend($.easing,
{
  def: 'easeInOutQuad',
  swing: function (x, t, b, c, d) {
    return $.easing[$.easing.def](x, t, b, c, d);
  },
  easeInOutQuad: function (x, t, b, c, d) {
    if ((t/=d/2) < 1) return c/2*t*t + b;
    return -c/2 * ((--t)*(t-2) - 1) + b;
  },
  easeOutExpo: function (x, t, b, c, d) {
    return (t==d) ? b+c : c * (-Math.pow(2, -10 * t/d) + 1) + b;
  }
});