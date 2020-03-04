$(window).on('load', function () {
    scrollAnime();
    $(".loading").fadeOut(600, function () {
    });
});
$(window).on("resize", function () {
    scrollAnime();
});
$(window).on("scroll", function () {
    scrollAnime();
});
$(function () {
    objectFitImages();
    $('a.scroller[href^="#"]').click(function () {
        var href = $(this).attr("href");
        var target = $(href);
        var position = target.offset().top;
        $('body,html').stop().animate({ scrollTop: position }, 500);
        return false;
    });
});
function scrollAnime() {
    var windowHeight = $(window).innerHeight(), topWindow = $(document).scrollTop(), fadeH = 200;
    $('.fadein').each(function () {
        var targetPosition = $(this).offset().top;
        fadeH = $(this).data("fadeheight") != undefined ? $(this).data("fadeheight") : 200;
        if (topWindow > targetPosition - windowHeight + (fadeH) || $(this).hasClass("firstView")) {
            $(this).addClass($(this).data("fadein"));
        }
    });
}
