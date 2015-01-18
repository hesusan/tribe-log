;(function(global, ns, undefined) {

var doc = global.document;

var s = SiteScroller,
    p = SiteScroller.prototype;

ns.SiteScroller = s;

/**
 * スクロール移動
 * @constructor
 */
function SiteScroller() {
}

//s.scrollRootElm = !global.chrome && typeof doc.webkitIsFullScreen != undefined ? 'body' : 'html';

s.attach = function() {
  $('a[href*=#]:not([href=#])').click(function(e) {
    if (location.pathname.replace(/^\//,'') == this.pathname.replace(/^\//,'') &&
        location.hostname == this.hostname) {
      var $target = $(this.hash),
          offsetTop = null;

      e.preventDefault();

      $target = $target.length <= 0 ? $target : $('[name=' + this.hash.slice(1) +']');
      offsetTop = $target.length <= 0 ? 0 : $target.offset().top;

      $('html,body').animate({
        scrollTop: offsetTop
      }, {
        easing: 'easeInOutQuad',
        duration: 800
      });
    }
  });
}

/*
s.attach = function() {
  var $SiteScroller = $('[data-SiteScroller]');

  $SiteScroller.click(function(e) {
    var dest = $(this).attr('data-SiteScroller'),
        $target = $(dest).eq(0);

    e.preventDefault();

    if ($target.length <= 0) {
      return;
    }

    $('html,body').animate(
      {
        scrollTop: $target.offset().top
      },
      {
        easing: 'easeInOutQuad',
        duration: 1000
      }
    );
  });
}
*/

})(this.self || global, TL);