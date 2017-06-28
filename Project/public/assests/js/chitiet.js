/**
 * Created by svPhu on 6/26/2017.
 */


$('.thumbnail.img-pick img').click(function () {
    $(".anh-san-pham").attr('src', $(this).attr('src'));
});



var timer;
$(function(){
    var n,h,p,g;
    n=$("#p_ngay").text();
    h=$("#p_gio").text();
    p=$("#p_phut").text();
    g=$("#p_giay").text();
    start(n,h,p,g);
});
function start(n,h,p,g) {
    timer = setInterval(function() {
        if(--g<0)
        {
            g=59;
            if(--p<0){
                p=59;
                if(--h<0){
                    if(n>0)
                        n--;
                }
            }
        }
        $('#p_ngay').text(n);
        $('#p_gio').text(h);
        $('#p_phut').text(p);
        $('#p_giay').text(g);
    }, 1000);
}


// var d;
// var h;
// var m;
// var s;
// $(function(){
//     DinhDangNgay(sum_s);;
// });
//
// function DinhDangNgay(sum_s, type){
//
//     // 1 ngày = 86400 giây
//     if(type = 'd'){
//
//     }else if(type = 'h'){
//
//     }else if(type = 'm'){
//
//     }else if(type = 's'){
//
//     }
//     d = sum_s/86400;
//     h = (sum_s % 86400)/3600;
//     m = ((sum_s % 86400)%3600)/60;
//     s = (((sum_s % 86400)%3600)%60);
//
//     d = checkTime(d);
//     h = checkTime(h);
//     m = checkTime(m);
//     s = checkTime(s);
// }
//
