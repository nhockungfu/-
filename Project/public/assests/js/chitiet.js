/**
 * Created by svPhu on 6/26/2017.
 */


$('.thumbnail.img-pick img').click(function () {
    $(".anh-san-pham").attr('src', $(this).attr('src'));
});

$(function(){
    // MaHoaEmail($('#seller_email'));
    // MaHoaEmail($('#bidder_email'));
});

// function MaHoaEmail(email) {
//     var index_of_At = email.text().indexOf("@");
//
//     if(index_of_At > 3){
//         var email_string = 'xxx'+ email.text().substring(index_of_At-3);
//     }
//     email.text(email_string);
// }