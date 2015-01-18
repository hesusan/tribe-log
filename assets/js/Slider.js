;(function(global, ns, $, undefined) {

var doc = global.document;

var s = Slider,
    p = Slider.prototype;

ns.Slider = s;

/**
 * スライダークラス
 * @constructor
 */
function Slider($elm) {
  var i = 0,
      $slide = null;

  this.$elm = $elm;
  this.$container = this.$elm.find('[data-slider-slide-container]');
  this.$slides = this.$container.children();
  this.$nav = this.$elm.find('[data-slider-nav]');
  this.$prevBtn = this.$nav.find('[data-slider-nav-btn=prev]');
  this.$nextBtn = this.$nav.find('[data-slider-nav-btn=next]');

  this.slidesLen = this.$slides.length;
  this.currentIndex = 0;//現在のインデックス
  this.nextIndex = -1;
  this.isMoving = false;//スライド中フラグ
  this.timer = null;
  this.DURATION = 1600;
  this.TIMER_DURATION = 4000;

  //最初の要素を表示
  for(; i < this.slidesLen; i++) {
    $slide = this.$slides.eq(i);

    if($slide.hasClass('is-active')) {
      this.currentIndex = i;
    } else {
      $slide.addClass('is-ready');
    }
  }

  if(this.slidesLen <= 1) {
    return;
  }

  //イベントの付与
  this._addEvent();

  //タイマーの開始
  this._startTimer();
}

/**
 * イベントの付与
 *
 */
p._addEvent = function() {
  this.$prevBtn.on('click', function(e) {
    this._stopTimer();
    this._move(-1);
  }.bind(this));

  this.$nextBtn.on('click', function(e) {
    this._stopTimer();
    this._move(1);
  }.bind(this));

  this.$container
    .on({
      'mouseenter': this._stopTimer.bind(this),
      'mouseleave': this._startTimer.bind(this)
    });
}

/**
 * 表示切替
 * @param {Integer} n 移動距離
 */
p._move = function(n) {
  var nextIndex;

  if(this.isMoving) {
    console.log('Slider::_move rejected');
    return;
  }

  this.isMoving = true;
  this.nextIndex = this._getNextIndex(this.currentIndex + n);

  this.$slides.eq(this.currentIndex).removeClass('is-active');
  this.$slides
    .eq(this.nextIndex)
    .removeClass('is-ready')
    .addClass('is-active');

  setTimeout(this._update.bind(this), this.DURATION);
}

/**
 * 状態の更新
 *
 */
p._update = function() {
  this.isMoving = false;
  //待機状態に変更
  this.$slides.eq(this.currentIndex).addClass('is-ready');
  //インデックスを更新
  this.currentIndex = this.nextIndex;
  //タイマーを再開
  this._startTimer();
}

/**
 * 次のindexを取得
 * @param {Integer} n 次のインデックス(暫定)
 */
p._getNextIndex = function(n) {
  var index = n,
      len = this.slidesLen;

  if(n < 0) {
    index = len - 1;
  } else if (n >= len) {
    index = 0;
  }

  return index;
}

/**
 * タイマーの開始
 */
p._startTimer = function() {
  this.timer = setTimeout(function() {
    this._move(1);
  }.bind(this), this.TIMER_DURATION);
}

/**
 * タイマーの停止
 */
p._stopTimer = function() {
  if(this.timer != null) {
    clearTimeout(this.timer);
  }
}


})(this.self || global, TL, jQuery);