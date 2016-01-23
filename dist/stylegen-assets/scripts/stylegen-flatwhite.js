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
}(window && window.jQuery))
