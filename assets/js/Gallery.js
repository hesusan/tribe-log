;(function(global, ns, $, undefined) {

var doc = global.document;

var s = Gallery,
    p = Gallery.prototype;

ns.Gallery = s;

/**
 * ギャラリー管理クラス
 * @constructor
 */
function Gallery() {
  var $container = $('[data-gllry-artcls-cntnr]'),
      i = 0;

  if($container.length < 0) {
    return;
  }

  this.$container = $container;
  this.$containerData = null;
  this.$navContainer = $('[data-gllry-nav-cntnr]');
  this.$navHolder = this.$navContainer.find('[data-gllry-nav-hldr]');
  this.$navSelector = this.$navContainer.find('[data-gllry-nav-hldr-slctr]');//SP表示時のセレクタ
  this.$navOpt = this.$navContainer.find('[data-gllry-nav-hldr-opt]');//SP表示時のオプション
  this.$nav = this.$navContainer.find('[data-gllry-nav]');
  this.$navBtns = this.$nav.children();
  this.$navBtnLen = this.$navBtns.length;

  this.filterVal = null;
  this.filterNames = [];
  this.isOpen = false;

  //フィルター名を格納
  for(; i < this.$navBtnLen; i++) {
    this.filterNames[i] = this.$navBtns.eq(i).attr('data-filter');
  }

  //コンテナの初期化
  this._initContainer();

  //イベントの付与
  this.$nav.on('click', '[data-gllry-nav-i]', this._onNavBtnClicked.bind(this));
  this.$navOpt.on('click', this._toggle.bind(this));
  this.$navSelector.on('click', this._toggle.bind(this));
  $(global).hashchange(this._onHashChange.bind(this));
}

p._isValidFilter = function(filter) {
  var i = 0;

  for(; i < this.$navBtnLen; i++) {
    if(filter === this.filterNames[i]) {
      return i;
    }
  }

  return -1;
}

p._initContainer = function() {
  var hash = location.hash.replace('#',''),
      filterIndex = this._isValidFilter(hash),
      filter;

  if(filterIndex > 0) {
    filter = '[data-cat=' + this.filterVal + ']';
  } else {
    //不正な値の場合全て0に合わせる
    filterIndex = 0;
    filter = '*';
  }

  //ボタンの状態を更新する
  this._changeState(filterIndex);

  //コンテナにisotopeを適用する
  this.$containerData =
    this.$container
      .isotope({
        filter: filter,
        itemSelector: '[data-gllry-artcl]'
      }).imagesLoaded(function() {
        this.$container.isotope('layout');
      }.bind(this));
}

/**
 * ハッシュの監視
 */
p._onHashChange = function(e) {
  var hash = location.hash.replace('#',''),
      filterIndex = this._isValidFilter(hash);

  //hashが前回の値と同じ || 不正な値の場合
  if(hash === this.filterVal || filterIndex < 0) {
    e.preventDefault();
    return;
  }

  //フィルターの更新
  this.filterVal = hash;
  //状態の更新
  this._changeState(filterIndex);
  //ソートの実行
  this._sort();
}

/**
 * ボタンの状態更新
 *
 */
p._changeState = function(i) {
  var $targetBtn = this.$navBtns.eq(i);

  this._close();
  this.$navBtns.removeClass('is-active');
  $targetBtn.addClass('is-active');
  this.$navSelector.text($targetBtn.text());
}

/**
 * ソートの実行
 *
 */
p._sort = function() {
  var filter;

  if(this.filterVal === 'all') {
    filter = '*';
  } else {
    filter = '[data-cat=' + this.filterVal + ']';
  }

  console.log(filter);

  this.$containerData.isotope({
    filter: filter
  });
}

/**
 * SP用ナビのトグル
 */
p._toggle = function() {
  if(this.isOpen) {
    this._close();
  } else {
    this._open();
  }
}

/**
 * メニューのオープン
 */
p._open = function() {
  this.isOpen = true;
  this.$nav.addClass('is-open');
}

/**
 * メニューのクローズ
 */
p._close = function() {
  this.isOpen = false;
  this.$nav.removeClass('is-open');
}

/**
 * ナビゲーションクリックハンドラ
 */
p._onNavBtnClicked = function(e) {
  var $t = $(e.target),
      filterVal = $t.attr('data-filter');

  location.href = '#' + filterVal;
}


})(this.self || global, TL, jQuery);