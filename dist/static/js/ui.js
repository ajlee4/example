"use strict";

(function () {
  var body = document.body;
  var AppInit = {
    accordion: function accordion() {
      var busy = false;
      $(body).on('click', '.js-simple-accord', function () {
        var $parent = $(this).closest(".".concat($(this).data('parent')));
        var $target = $parent.find(".".concat($(this).data('content')));
        if (busy) return false;
        busy = true;

        if ($parent.hasClass('opened')) {
          $target.slideUp(function () {
            busy = false;
          });
          $parent.removeClass('opened');
        } else {
          $target.slideDown(function () {
            busy = false;
          });
          $parent.addClass('opened');
        }

        return false;
      });
    }
  };
  window.addEventListener('DOMContentLoaded', function () {
    AppInit.accordion();
    window.svg4everybody();
    $('.js-datepicker').datepicker();
    $('.js-dropdown-box').each(function () {
      $(this).dropdown({
        prefix: $(this).data('prefix')
      });
    });
  });
  document.documentElement.addEventListener('touchstart', function (event) {
    if (event.touches.length > 1) {
      event.preventDefault();
    }
  }, false);
})();