(function() {
  const body = document.body;

  const AppInit = {
    accordion() {
      let busy = false;

      $(body).on('click', '.js-simple-accord', function() {
        const $parent = $(this).closest(`.${$(this).data('parent')}`);
        const $target = $parent.find(`.${$(this).data('content')}`);

        if (busy) return false;

        busy = true;

        if ($parent.hasClass('opened')) {
          $target.slideUp(function() {
            busy = false;
          });
          $parent.removeClass('opened');
        } else {
          $target.slideDown(function() {
            busy = false;
          });
          $parent.addClass('opened');
        }

        return false;
      });
    },
  };

  window.addEventListener('DOMContentLoaded', () => {
    AppInit.accordion();
    window.svg4everybody();

    $('.js-datepicker').datepicker();

    $('.js-dropdown-box').each(function() {
      $(this).dropdown({
        prefix: $(this).data('prefix'),
      });
    });
  });

  document.documentElement.addEventListener(
    'touchstart',
    function(event) {
      if (event.touches.length > 1) {
        event.preventDefault();
      }
    },
    false,
  );
})();
