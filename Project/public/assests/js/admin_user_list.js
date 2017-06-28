// click xóa bỏ user
$(".user-delete").click(function () {

    var user_id = $(this).attr('id');

    if (confirm('Bạn có chắc chắn xóa người dùng có Mã số: '+user_id+'?')) {
        $('#action-type').val('delete');
        $('#user-id').val(user_id);
        $('#frmInfoUser').submit();
    }else{
        //không làm gì cả!
    }

});

$(".user-reset-pass").click(function () {
    var user_id = $(this).attr('id');

    if (confirm('Bạn muốn reset mật khẩu của người dùng có Mã số: '+user_id+'?')) {
        $('#action-type').val('reset-pass');
        $('#user-id').val(user_id);
        $('#frmInfoUser').submit();

    }else{
        //không làm gì cả!
    }
});