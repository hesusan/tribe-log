;(function(global, ns, $, undefined) {

  var doc = global.document,
      Util = ns.Util,
      env = Util.env,
      abs = Math.abs,
      round = Math.round;

  var s = MenuManager,
      p = MenuManager.prototype;

  ns.MenuManager = MenuManager;

  /**
   * メニュー管理
   * @constructor
   */
  function MenuManager() {
    this.initialize();
  }

  /**
   * 現在のメニューの状態
   */
  s.STATUS = {
    close: 0,
    open: 1,
    progress: 2
  }

  /**
   * メニュー展開時のリンクをクリック不可にするか否か
   */
  s.shouldDisableLinks = env.androidVer < 4;

  /**
   * アニメーション不使用端末
   */
  s.noAnimation = env.androidVer < 4;

  /**
   * 初期化
   */
  p.initialize = function() {
    this.$layer = $('[data-sp-site-nav-layer]')
    this.$elm = $('[data-sp-site-nav]');
    this.$closer = this.$elm.find('[data-sp-site-nav-closer]');
    this.$trigger = $('[data-sp-site-nav-trigger]');

    this.$body = this.$elm.find('[data-sp-site-nav-body]');
    this.$content = this.$elm.find('[data-sp-site-nav-content]');
    this.$scrollBar = this.$elm.find('[data-sp-site-nav-scrollbar]');

    if(s.shouldDisableLinks) {
      this.siteBody = $('[data-site-body]')[0];
      this.siteHeader = $('[data-site-header]')[0];
      this.siteFooter = $('[data-site-footer]')[0];
    }

    //必須要素の定義確認
    if(this.$elm.length <= 0 ||
       this.$closer.length <= 0 ||
       this.$body.length <= 0 ||
       this.$content.length <= 0) {

       throw new Error('Elements not found.');
    }

    //スクロール領域の生成
    this.scroller = new Scroll({
      scrollWrap: this.$body[0],
      scrollArea: this.$content[0],
      scrollBar: this.$scrollBar[0] || null,
      disableScrollBar: this.$scrollBar.length <= 0 ? true : false
    });

    //スクロール機能の適用
    this.scroller.start();

    //現在のステータスのセット
    this.state = s.STATUS.close;

    //要素を準備状態に
    this.$layer.addClass('is-ready');
    this.$elm.addClass('is-ready');

    this.$layer.on('touchmove', this.block);
    this.$trigger.on('click', this.open.bind(this));
    this.$closer.on('click', this.close.bind(this));

    return this;
  }

  /**
   * フリック防止
   * @param {Event} e
   */
  p.block = function(e) {
    console.log('MenuManager:block');
    e.preventDefault();
  }

  /**
   * メニューの展開
   * @param {Event} e
   * @return {Promise}
   */
  p.open = function(e) {
    console.log('MenuManager:open');

    if(this.state === s.STATUS.open ||
       this.state === s.STATUS.progress) {
      return;
    }

    this.state = s.STATUS.progress;

    //body直下の全ての要素をクリック不可にする
    if(s.shouldDisableLinks) {
      Util.disableClickable(this.siteBody);
      Util.disableClickable(this.siteHeader);
      Util.disableClickable(this.siteFooter);
    }

    this._showLayer()
      .then(this._showNav.bind(this))
      .then(this._opened.bind(this));
  }

  p._showLayer = function() {
    var d = new $.Deferred;

    this.$layer.removeClass('is-ready');

    setTimeout(function() {
      this.$layer.addClass('is-in');
    }.bind(this), 0);

    setTimeout(function() {
      d.resolve();
    }.bind(this), 200);

    return d.promise();
  }

  p._showNav = function() {
    var d = new $.Deferred;

    this.$elm.addClass('is-in');

    setTimeout(function() {
      d.resolve();
    }, 200);

    return d.promise();
  }

  p._opened = function() {
    var d = new $.Deferred;

    this.state = s.STATUS.open;
    d.resolve();

    return d.promise();
  }

  /**
   * メニューの収納
   * @param {Event} e
   * @return {Promise}
   */
  p.close = function(e) {
    console.log('MenuManager:close');

    if(this.state === s.STATUS.close ||
       this.state === s.STATUS.progress) {
      return;
    }

    this.state = s.STATUS.progress;

    this._hideNav()
      .then(this._hideLayer.bind(this))
      .then(this._closed.bind(this));
  }

  p._hideNav = function() {
    var d = new $.Deferred;

    this.$elm
      .removeClass('is-in')
      .addClass('is-ready');

    setTimeout(function() {
      d.resolve();
    }.bind(this), 200);

    return d.promise();
  }

  p._hideLayer = function() {
    var d = new $.Deferred;

    this.$layer
      .removeClass('is-in');

    setTimeout(function() {
      this.$layer.addClass('is-ready');
      d.resolve();
    }.bind(this), 200);

    return d.promise();
  }

  p._closed = function() {
    var d = new $.Deferred;

    this.state = s.STATUS.close;

    if(s.shouldDisableLinks) {
      Util.enableClickable(this.siteBody);
      Util.enableClickable(this.siteHeader);
      Util.enableClickable(this.siteFooter);
    }

    d.resolve();

    return d.promise();
  }

})(this.self || global, TL, jQuery);