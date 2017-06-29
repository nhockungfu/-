

$('.submit-dat-gia>a').on('click', function() {
    var id = $(this).data('id');
    $('#txtProduceDetail').val(id);
    $('#frmProduceDetail').submit();
});

//--------------------------------------------------------------------------------

$(".thumbnail").on("click", function() {
    console.log('Click!');
});


//-----------------------------------------------------------------------------------


$(".thumbnail").hover(function() {
    // $(this).find('.gia-tien').css("font-size", "35px"); $(this).find('.gia-tien').css("transition", "0.2s");
    $(this).css("transition", "0.1s");
    $(this).css("background-color", "#eee");
    $(this).css("opacity", "0.8");
}, function() {
    // $(this).find('.gia-tien').css("font-size", "30px");
    $(this).css("background-color", "#fff");
    $(this).css("opacity", "1");

});

