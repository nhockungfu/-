

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

//-----------------------------------------------------------------------------------

       // var timeString;
       // var node_string_time = [];
       //
       // $(function() {
       //
       //     var x = document.getElementsByClassName("chuoi-thoi-gian");
       //
       //     var i;
       //     for (i = 0; i < x.length; i++) {
       //         node_string_time.push(x[i].innerText);
       //         //setInterval(function(){ chayThoiGian(node_string_time[i], i+1); }, 1000);
       //
       //     }
       //
           //     setInterval(function() {
           //         chayThoiGian(node_string_time[0], 1);
           //     }, 1000);
       //     setInterval(function() {
       //         chayThoiGian(node_string_time[1], 2);
       //     }, 1000);
       //     setInterval(function() {
       //         chayThoiGian(node_string_time[2], 3);
       //     }, 1000);
       //     setInterval(function() {
       //         chayThoiGian(node_string_time[3], 4);
       //     }, 1000);
       //     setInterval(function() {
       //         chayThoiGian(node_string_time[4], 5);
       //     }, 1000);
       //     setInterval(function() {
       //         chayThoiGian(node_string_time[5], 6);
       //     }, 1000);
       //     setInterval(function() {
       //         chayThoiGian(node_string_time[5], 7);
       //     }, 1000);
       //     setInterval(function() {
       //         chayThoiGian(node_string_time[5], 8);
       //     }, 1000);
       //
       // });
       //
       // function chayThoiGian(chuoi_thoi_gian, index) {
       //     // console.log(chuoi_thoi_gian); console.log(index); tách giờ, phút, giây
       //     var gio = chuoi_thoi_gian.substr(0, 2);
       //     var phut = chuoi_thoi_gian.substr(3, 2);
       //     var giay = chuoi_thoi_gian.substr(6, 2);
       //
       //     // giảm thời gian xuống 1 giây
       //     node_string_time[index - 1] = giamMotGiay(gio, phut, giay);
       //
       //     // thay đổi chuỗi thời gian
       //     var newNode = document.createElement("p");
       //     newNode.appendChild(document.createTextNode(node_string_time[index - 1]));
       //     newNode.setAttribute("id", index.toString());
       //     newNode.setAttribute("class", "chuoi-thoi-gian");
       //
       //     var preNode = document.getElementById(index.toString());
       //     var parentNode = preNode.parentNode;
       //     parentNode.insertBefore(newNode, preNode);
       //     parentNode.removeChild(preNode);
       //
       //     //console.log(parentNode); debug kết quả: chuỗi thời gian đã giảm console.log(timeString);
       // }
       //
       // function giamMotGiay(gio, phut, giay) {
       //     if (giay > 0) {
       //         giay = giay - 1;
       //     } else {
       //         if (phut > 0) {
       //             giay = 59;
       //             phut = phut - 1;
       //         } else {
       //             if (gio > 0) {
       //                 phut = 59;
       //                 gio = gio - 1;
       //             }
       //         }
       //     }
       //
       //     if (gio.toString().length < 2) {
       //         gio = '0' + gio;
       //     }
       //     if (phut.toString().length < 2) {
       //         phut = '0' + phut;
       //     }
       //     if (giay.toString().length < 2) {
       //         giay = '0' + giay;
       //     }
       //
       //     return (gio + ':' + phut + ':' + giay);
       // }