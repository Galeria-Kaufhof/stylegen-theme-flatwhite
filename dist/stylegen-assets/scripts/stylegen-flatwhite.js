(function($){
  "use strict";

  $('.sgfw-tabs .sgfw-tabs-nav-link').on('click', function(e) {
    var tabs, link, navItem;
    e.preventDefault();

    link = $(e.target);
    navItem = link.closest('.sgfw-tabs-nav-item');
    tabs = link.closest('.sgfw-tabs');

    tabs.find('.sgfw-tabs-item, .sgfw-tabs-nav-item').removeClass('active');
    navItem.addClass('active');
    tabs.find(link.attr('href')).addClass('active')
  });
}(jQuery))
