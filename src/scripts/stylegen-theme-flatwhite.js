(function($){
  "use strict";

  // **********************************************************
  // tab behavior
  // **********************************************************
  $('.content-group .content-group-nav-link').on('click', function(e) {
    var tabs, link, navItem;
    e.preventDefault();

    link = $(e.target);
    navItem = link.closest('.content-group-nav-item');
    tabs = link.closest('.content-group');

    tabs.find('.content-group-item, .content-group-nav-item').removeClass('active');
    navItem.addClass('active');
    tabs.find(link.attr('href')).addClass('active')
  });





  // **********************************************************
  // off-canvas nav
  // **********************************************************
  var OffCanvasNav = function(nav, content) {
    if (!nav) {
      console.error("Off-Canvas Navigation not found", nav);
    }

    if (!content) {
      console.error("Off-Canvas Content not found", content);
    }

    this.nav = nav.jquery ? nav : $(nav);
    this.content = content.jquery ? content : $(content);
  };

  OffCanvasNav.prototype.showNav = function() {
    var navWidth = this.nav.width();

    this.content
    .addClass('active')
    .css('-moz-transform', `translateX(${ navWidth }px)`)
    .css('-webkit-transform', `translateX(${ navWidth }px)`)
    .css('-o-transform', `translateX(${ navWidth }px)`)
    .css('-ms-transform', `translateX(${ navWidth }px)`)
    .css('transform', `translateX(${ navWidth }px)`);
  };

  OffCanvasNav.prototype.hideNav = function() {
    this.content
    .removeClass('active')
    .css('-moz-transform', `translateX(0px)`)
    .css('-webkit-transform', `translateX(0px)`)
    .css('-o-transform', `translateX(0px)`)
    .css('-ms-transform', `translateX(0px)`)
    .css('transform', `translateX(0px)`);
  };

  OffCanvasNav.prototype.toggleNav = function() {
    console.log('toggle')
    if (this.content.hasClass('active')) {
      this.hideNav();
    } else {
      this.showNav();
    }
  };

  var ocContent = $('.off-canvas-content')[0];
  var ocSwipeOuts = $('.off-canvas-content, .off-canvas-content-fixed-nav-bar');
  var ocNav = $('.off-canvas-nav')[0];

  var offCanvasNav = new OffCanvasNav(ocNav, ocSwipeOuts);

  $('.nav-toggle').on('click', function(e) {
    offCanvasNav.toggleNav();
  });

  var touchContent = new Hammer.Manager(ocContent);
  var touchNav = new Hammer.Manager(ocNav);

  // var the pan gesture support all directions.
  // this will block the vertical scrolling on a touch-device while on the element
  // mc.get('swipe').set({ direction: Hammer.DIRECTION_HORIZONTAL })
  touchContent.add( new Hammer.Swipe({ direction: Hammer.DIRECTION_HORIZONTAL }) );
  touchNav.add( new Hammer.Swipe({ direction: Hammer.DIRECTION_HORIZONTAL }) );

  touchContent.on("swiperight", function(ev) {
    offCanvasNav.showNav();
  });

  touchContent.on("swipeleft", function(ev) {
    offCanvasNav.hideNav();
  });

  touchNav.on("swipeleft", function(ev) {
    offCanvasNav.hideNav();
  });




  // **********************************************************
  // preview-breakpoints-button
  // **********************************************************
  $('.preview-breakpoints-button').on('click', function(e) {
    var link, links, root, preview, linkItem, alreadyActive, newWidth, parentWidth, offset, breakpoints;
    e.preventDefault();

    link = $(e.target);
    // console.log(e.target, link, link.data('width'))
    newWidth = link.data('width');

    linkItem = link.closest('.preview-breakpoints-item');

    root = link.closest('.preview-breakpoints-root');
    breakpoints = root.find('.preview-breakpoints');
    // console.log(breakpoints)
    links = root.find('.preview-breakpoints-item');
    preview = breakpoints.find('.preview');

    // console.log(preview)
    alreadyActive = linkItem.hasClass('active') ? true : false;

    links.removeClass('active');
    preview.css('margin-left', 'auto');

    linkItem.toggleClass('active');

    if (alreadyActive) {
      linkItem.toggleClass('active');
    }

    if (linkItem.hasClass('active')) {
      parentWidth = breakpoints.innerWidth();
      preview.css("width", newWidth + 'px');

      if (newWidth > parentWidth) {
        offset = ((newWidth - parentWidth) / 2 * -1);

        preview.css('margin-left', offset + 'px');
      };
    } else {
      preview.css("width", "100%");
    }
  });





  // **********************************************************
  // iframe height observer
  // **********************************************************
  var IFrameHeightObserver = function(iframe, index) {
    this.iframe = iframe;
    this.index = index;
    this.checkCount = 0;
    // lets memoize the access on the jquery element of our iframe
    this.$iframe = $(iframe);

    this.iframeBody = null;
    this.$iframeBody = null;
  };

  IFrameHeightObserver.prototype.checkDelay = 1500;
  IFrameHeightObserver.prototype.reCheckThreshold = 30;
  IFrameHeightObserver.prototype.defaultMinHeight = 100;

  IFrameHeightObserver.prototype.setFrameHeight = function(height) {
    this.$iframe.height(height + 'px');
    setTimeout(this.check.bind(this), this.checkDelay);
  };

  IFrameHeightObserver.prototype.getFrameHeight = function() {
    var frameHeight, bodyHeight, resultHeight = 0;

    if (this.$iframeBody.length > 0) {
      frameHeight = this.$iframeBody.attr('data-frame-height') || 0;
      // bodyHeight = Math.max(0, this.iframeBody.$.outerHeight(true) || 0);
      resultHeight = frameHeight; // Math.max(bodyHeight, frameHeight);

      if (this.$iframeBody.attr('data-frame-height') === undefined) {
        this.iframeBody = null;
        this.$iframeBody = null;
      }
    }
    return resultHeight > 0 ? resultHeight : this.defaultMinHeight;
  };


  IFrameHeightObserver.prototype.check = function() {
    if (Boolean(this.iframeBody) === false || this.$iframeBody.length < 1) {

      // seems that the iframe is not ready yet, and we don't have a reference to our desired content
      this.iframeDoc = this.iframe.contentWindow.document;
      this.iframeBody = this.iframeDoc.body;

      if (this.iframeBody) {

        this.$iframeBody = $(this.iframeBody);
        var currentHeight = this.getFrameHeight();
        this.setFrameHeight(currentHeight);

        this.checkCount = 0;

      } else {
        if (this.checkCount <= this.reCheckThreshold) {
          this.checkCount++;
          setTimeout(this.check.bind(this), this.checkDelay);
          return;
        } else {
          console.error('IframeObserver reached Checkcount', this.index)
        }

      }

    } else {
      this.setFrameHeight(this.getFrameHeight());
    }

    return this;
  };

  $.each($('.preview > iframe'), function(i, iframe) {
    new IFrameHeightObserver(iframe, i).check();
  });
}(window && window.jQuery))
