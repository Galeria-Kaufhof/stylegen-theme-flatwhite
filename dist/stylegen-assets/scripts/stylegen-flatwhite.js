(function($){
  "use strict";

  $('.tabs .tabs-nav-link').on('click', function(e) {
    var tabs, link, navItem;
    e.preventDefault();

    link = $(e.target);
    navItem = link.closest('.tabs-nav-item');
    tabs = link.closest('.tabs');

    tabs.find('.tabs-item, .tabs-nav-item').removeClass('active');
    navItem.addClass('active');
    tabs.find(link.attr('href')).addClass('active')
  });


  var resizeIFrames = function() {
    // we memoize our iframes here (so if anyone in the far future wants to add components async, this has to be adjusted)
    var iframes = $('iframe.auto-height');

    $.each(iframes, function(i, iframe) {
      var $iframeBody, $iframe, resize;
      $iframe = $(iframe);

      resize = function() {
        var scrollHeight;

        if ($iframeBody) {
          scrollHeight = $iframeBody.height() + 'px';
          if (i === 0) { console.log(scrollHeight); }
          $iframe.height(scrollHeight);
          setTimeout(resize, 500);
        } else {
          $iframe.load(function() {
            $iframeBody = $(iframe.contentWindow.document.body);
            $iframe.height($iframeBody.height() + 'px');
            setTimeout(resize, 500);
          });
        }
      };

      resize();
    });
  };

  resizeIFrames();


}(window && window.jQuery))
