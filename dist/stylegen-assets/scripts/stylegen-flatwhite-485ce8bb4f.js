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


  $('.nav-close').on('click', function(e) {
    var close, nav;

    close = $(e.target);
    nav = close.closest('.nav');

    nav.css('right', '100%').css('left', '-100%');
  });

  $('.nav-toggle').on('click', function(e) {
    var toggle, nav;

    toggle = $(e.target);
    nav = $(toggle.data('target'));

    if (toggle.hasClass('active')) {
      nav.css('right', '100%').css('left', '-100%');
    } else {
      nav.css('right', '70%').css('left', '0%');
    }

    toggle.toggleClass('active');
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
    preview.css('margin-left', '0px');

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


  var IFrameHeightObserver = function(iframe) {
    this.iframe = iframe;

    // lets memoize the access on the jquery element of our iframe
    this.iframe.$ = $(iframe);

    this.iframeBody = null;
  };

  IFrameHeightObserver.prototype.checkDelay = 500;
  IFrameHeightObserver.prototype.defaultMinHeight = 100;

  IFrameHeightObserver.prototype.setFrameHeight = function(height) {
    this.iframe.$.height(height + 'px');
    setTimeout(this.check.bind(this), this.checkDelay);
  };

  IFrameHeightObserver.prototype.getFrameHeight = function() {
    var frameHeight, bodyHeight, resultHeight;

    frameHeight = this.iframeBody.$.attr('data-frame-height') || 0;
    bodyHeight = Math.max(0, this.iframeBody.$.outerHeight(true) || 0);
    resultHeight = Math.max(bodyHeight, frameHeight);

    return resultHeight > 0 ? resultHeight : this.defaultMinHeight;
  };

  IFrameHeightObserver.prototype.check = function() {
    if (this.iframeBody !== null) {
      this.setFrameHeight(this.getFrameHeight());

    } else {
      // seems that the iframe is not ready yet, and we don't have a reference to our desired content
      this.iframe.$.load(function() {
        this.iframeDoc = this.iframe.contentWindow.document;
        this.iframeBody = this.iframeDoc.body;
        this.iframeBody.$ = $(this.iframeBody);

        this.setFrameHeight(this.getFrameHeight());
      }.bind(this));
    }

    return this;
  };

  $.each($('.preview > iframe'), function(i, iframe) {
    new IFrameHeightObserver(iframe).check();
  });
}(window && window.jQuery))
