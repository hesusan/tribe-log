;(function(global, ns, undefined) {

var s = ResizeManager,
    p = s.prototype;

ns.ResizeManager = s;

/**
 * リサイズ時の処理を一元管理する
 * @constructor
 */
function ResizeManager() {
}

/**
 * 現在の可視領域の高さ
 * @memberof ResizeManager
 * @name windowHeight
 */
s.windowHeight = global.innerHeight;

/**
 * 現在の可視領域の幅
 * @memberof ResizeManager
 * @name windowHeight
 */
s.windowWidth = global.innerWidth;

/**
 * リサイズ時に実行する処理配列
 * @memberof ResizeManager
 * @name functions
 */
s.functions = [];

/**
 * リサイズ時に実行する処理配列長
 * @memberof ResizeManager
 * @name functionsLen
 */
s.functionsLen = 0;

/**
 * 初期化
 * @memberof ResizeManager
 * @name init
 */
s.init = function() {
  global.addEventListener('resize', s._onResize);
}

/**
 * リサイズ
 * @memberof ResizeManager
 * @name resize
 */
s.resize = function() {
  if(s.functionsLen <= 0) {
    return;
  }
  s._onResize();
}

/**
 * リサイズ処理の登録
 * @memberof ResizeManager
 * @name add
 */
s.add = function(f) {
  s.functions.push(f);
  s.functionsLen++;
}

/**
 * リサイズハンドラ
 * @memberof ResizeManager
 * @name _onResize
 */
s._onResize = function() {
  var i = 0
      len = s.functionsLen;

  s.windowHeight = global.innerHeight;
  s.windowWidth = global.innerWidth;

  console.log('ReisizeManager.resize');

  if(len <= 0) {
    return;
  }

  for(; i < len; i++) {
    s.functions[i]();
  }
}

s.init();

})(this.self || global, TL);