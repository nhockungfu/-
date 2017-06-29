



$(function(){

    // bảng DS đang tham gia đấu giá (ng mua): dòng đang giữ giá sẽ khác các dòng còn lại
    $('table.bidding-table>tbody tr').each(function(){
        if($(this).find('img').attr('class') == 'you_highest'){
            $(this).css('background-color','#D0FBFA');
            $(this).find('img').css('opacity','1');
        }else {
            $(this).css('background-color','#eee');
            $(this).find('img').css('opacity','0');

        }
    })



    $('table.won-list-table>tbody tr').each(function(){
        if($(this).find('td.td-check-mark-seller').text() == 'marked'){
            $(this).find('td.td-check-mark-seller').html('Đã đánh giá');
        }else { //== not yet mark
            var my_html = '<a href="#" style="color: red;font-weight:bold;">Đánh giá ngay</a>'
            $(this).find('td.td-check-mark-seller').html(my_html);
        }
    })

    $('table.bidded-list-table>tbody tr').each(function(){
        if($(this).find('td.td-check-mark-bidder').text() == 'marked'){
            $(this).find('td.td-check-mark-bidder').html('Đã đánh giá');
        }else { //== not yet mark
            var my_html = '<a href="#" style="color: red;font-weight:bold;">Đánh giá ngay</a>'
            $(this).find('td.td-check-mark-bidder').html(my_html);
        }
    })


})

// chuyển tab trong danh sách xem
$("ul.nav-tabs a").click(function (e) {
    e.preventDefault();
    $(this).tab('show');
});


$('.btn-mark').click(function(){
    $('#frmInfoCate').submit();
})