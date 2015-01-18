;(function(global, ns, $, undefined) {

  var doc = global.document,
      Util = ns.Util,
      env = Util.env,
      abs = Math.abs,
      round = Math.round;

  ns.PCMenuManager = PCMenuManager;

  /**
   * メニュー管理
   * @constructor
   */
  function PCMenuManager() {
    this.initialize();
  }

  //statics
  var s = PCMenuManager;

  //member
  var p = PCMenuManager.prototype;

  /**
   * 現在のメニューの状態
   */
   /*
  s.STATUS = {
    close: 0,
    open: 1,
    progress: 2
  }
  */

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
    this.$elm = $('[data-pc-gnav]');
    this.$base = this.$elm.find('[data-pc-gnav-base]');

    this.$base.on('mouseenter', this._onEnterBase.bind(this));
    this.$base.on('mouseleave', this._onLeaveBase.bind(this));

    return this;
  }

  p._onEnterBase = function(e) {
    var $t = $(e.target),
        name = $t.attr('data-pc-gnav-base');

    console.log(name);

    $t
      .addClass('is-hover')
      .next('[data-pc-gnav-sub="' + name + '"]')
      .removeClass('d-none');
  }

  p._onLeaveBase = function(e) {
    console.log(e.target);
  }

})(this.self || global, TL, jQuery);