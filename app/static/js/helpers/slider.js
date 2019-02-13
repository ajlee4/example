$(document).ready(function(){
    $('.main-slider').slick({
         autoplay:true,
      autoplaySpeed:2000,
      dots:true,
      fade:true,
    });
  });



  $('.about__row').slick({
      dots: true,
    mobileFirst: true,
    responsive: [
          {
                  breakpoint: 767,
                  settings: 'unslick'
          }
    ]
  });

  
  $('.portfolio__list').slick({
    dots: true,
  mobileFirst: true,
  responsive: [
        {
                breakpoint: 767,
                settings: 'unslick'
        }
  ]
});

