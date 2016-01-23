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




// preview-breakpoints-button
//
  $('.preview-breakpoints-button').on('click', function(e) {
    var link, links, root, preview, linkItem, alreadyActive, parent, newWidth, parentWidth, offset;
    e.preventDefault();

    link = $(e.target);
    linkItem = link.closest('.preview-breakpoints-item');
    root = link.closest('.preview-breakpoints');
    parent = root.parent();
    links = root.find('.preview-breakpoints-item');
    preview = root.find('.preview');

    alreadyActive = linkItem.hasClass('active') ? true : false;

    links.removeClass('active');

    linkItem.toggleClass('active');

    if (alreadyActive) {
      linkItem.toggleClass('active');
    }

    if (linkItem.hasClass('active')) {
      newWidth = link.data('width');
      parentWidth = parent.innerWidth();
      preview.css("width", newWidth + 'px');

      if (newWidth > parentWidth) {
        offset = ((newWidth - parentWidth) / 2 * -1);

        preview.css('margin-left', offset + 'px');
      };
    } else {
      preview.css("width", "100%")
    }
  });







  var resizeIFrames = function() {
    // we memoize our iframes here (so if anyone in the far future wants to add components async, this has to be adjusted)
    var iframes = $('iframe.auto-height');

    $.each(iframes, function(i, iframe) {
      var $iframeBody, $iframe, resize;
      $iframe = $(iframe);

      resize = function() {
        if ($iframeBody) {
          $iframe.height($iframeBody.height() + 'px');
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
