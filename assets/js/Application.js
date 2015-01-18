;(function(global, $, ns, undefined) {

var doc = global.document,
    env = ns.Util.env;

var s = Application,
    p = s.prototype;


ns.Application = s;

/**
 * 本体
 * @constructor
 */
function Application() {
  this.init();
}

/**
 * ブレイクポイント
 */
s.BREAKPOINT = {
  sp : 767
};

/**
 * ページの表示タイプ
 */
s.getMediaState = function() {
  return ns.ResizeManager.windowWidth > s.BREAKPOINT.sp ? 'PC' : 'SP';
}

/**
 * 初期化
 */
p.init = function() {
  //ファストクリックを適用
  if(env.isMobile) {
    FastClick.attach(doc.body);
  }

  //スクローラーの適用
  ns.SiteScroller.attach();

  //PCのグローバルナビゲーション
  //@TO_DO オブジェクトにまとめる
  var $base = $('[data-pc-gnav]'),
      $menuItem = $base.find('[data-pc-gnav-base]');

  $menuItem.hover(
    function() {
      $(this)
        .addClass('is-hover')
        .find('> [data-pc-gnav-sub]')
        .addClass('is-open');
    },
    function() {
      $(this)
        .removeClass('is-hover')
        .find('> [data-pc-gnav-sub]')
        .removeClass('is-open');
    }
  );

  //アコーディオンの生成
  $('[data-accordion-container]').each(function() {
    new ns.AccordionManager(this);
  });

  //スライダーの生成
  new ns.Slider($('[data-slider=top-hl]'));

  //SP用グローバルナビゲーションの生成
  new ns.MenuManager();

  //ギャラリーの生成
  new ns.Gallery();
}

//DOMContentLoaded
$(function() {
  ns.ResizeManager.resize();

});

//Load
$(global).on('load', function() {

  if(env.isMobile) {
    global.scroll(0,1);
  }

  var application = new ns.Application();
});

})(this.self || global, jQuery, TL);
