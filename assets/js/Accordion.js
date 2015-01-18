;(function(global, ns, $, undefined) {

var doc = global.document;

var s = AccordionManager,
    p = AccordionManager.prototype;

ns.AccordionManager = s;

/**
 * アコーディオン管理クラス
 * @constructor
 */
function AccordionManager(container) {
  var i = 0,
      $accordions = null;

  this.$elm = $(container);
  this.accordions = []
  this.accordionsLen = 0;
  //this.currentIndex = -1;

  $accordions = this.$elm.find('[data-accordion]');
  this.accordionsLen = $accordions.length;

  for(; i < this.accordionsLen; i++) {
    this.accordions[i] = new ns.Accordion(this, $accordions.eq(i));
  }
}

})(this.self || global, TL, jQuery);

;(function(global, ns, $, undefined) {

var doc = global.document;

var s = Accordion,
    p = Accordion.prototype;

ns.Accordion = s;

/**
 * アコーディオンクラス
 * @constructor
 */
function Accordion(manager, $elm) {
  this.manager = manager;
  this.$elm = $elm;
  this.$trigger = this.$elm.find('[data-accordion-trigger]');
  this.$content = this.$elm.find('[data-accordion-content]');

  this.$trigger.on('click', this._onTriggerClicked.bind(this));
}

/**
 * アコーディオントリガーのクリックハンドラ
 * PC表示の場合は通常遷移を行う
 */
p._onTriggerClicked = function(e) {
  var t = e.target,
      $t = t.tagName === 'A' ? $(t) : $(t).closest('[data-accordion-trigger]');

  //SP表示の場合
  if(ns.Application.getMediaState() === 'PC') {
    location.href = $t.attr('href');
    return false;
  }

  e.preventDefault();

  if(this.$elm.hasClass('is-open')) {
    this.close();
  } else {
    this.open();
  }
}

/**
 * アコーディオンを開く
 */
p.open = function() {
  this.$elm.addClass('is-open');
}

/**
 * アコーディオンを閉じる
 */
p.close = function() {
  this.$elm.removeClass('is-open');
}

})(this.self || global, TL, jQuery);