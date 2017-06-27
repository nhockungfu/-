/**
 * Created by svPhu on 6/26/2017.
 */


$('.thumbnail.img-pick img').click(function () {
    $(".anh-san-pham").attr('src', $(this).attr('src'));
});

$(function(){
    DinhDangNgay(sum_s);
});

function DinhDangNgay(sum_s, type){

    // 1 ngày = 86400 giây
    if(type = 'd'){

    }else if(type = 'h'){

    }else if(type = 'm'){

    }else if(type = 's'){

    }
    var d = sum_s/86400;
    var h = (sum_s % 86400)/3600;
    var m = ((sum_s % 86400)%3600)/60;
    var s = (((sum_s % 86400)%3600)%60);

    d = checkTime(d);
    h = checkTime(h);
    m = checkTime(m);
    s = checkTime(s);
}

function checkTime(i){
    if (i < 10) {
        i = "0" + i;
    }
    return i;
}