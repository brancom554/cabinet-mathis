/* *concat build_listing.prd2.js* */
$(document).ready(function() {
    $('.listing3 .bien article').hover(
        function(){
            var card = $(this).find(".card");
            card.addClass('col-xl-7 col-lg-8');
            card.find(".onHover").css("left","450px");
            card.find(".prix").css("margin-right","190px");
        }, 
        function () {
            var card = $(this).find(".card");
            card.removeClass('col-xl-7 col-lg-8');
            card.find(".onHover").css("left","");
            card.find(".prix").css("margin-right","");
        }
    );
});
