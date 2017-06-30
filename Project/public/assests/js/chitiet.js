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
        g--;
        if(g<0 && p>=0)
        {
            g=59;
            p--;
            if(p<0&&h>=0){
                p=59;
                h--;
                if(h<0 && n>0){
                    h=23;
                    n--;
                }else{
                    clearInterval(timer);
                    g=0;p=0;h=0;
                    $('#p_hettg').show();
                    $('#btn_dg').hide();
                    $('#btn_dgtudong').hide();
                    $('#txt_gia').hide();
                    $('#p_kick').hide();
                }
            }
        }
        $('#p_ngay').text(n);
        $('#p_gio').text(h);
        $('#p_phut').text(p);
        $('#p_giay').text(g);
    }, 1000);
}


