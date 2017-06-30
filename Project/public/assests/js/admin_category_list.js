$(function () {
    $('#cate-id').attr('readonly', true);
    $('#cate-name').attr('readonly', true);
    $('#cate-id').val('');
    $('#cate-name').val('');
    $('#btn-submit').prop('disabled', true);
    thongBaoThaoTac();
})


// xử lý click vào category row
$(".cate-row").click(function () {
    $('#cate-id').val($(this).children(".id").text());
    $('#cate-name').val($(this).children(".name").text());
    $('#cate-name').attr('readonly', true);
    $('#btn-submit').prop('disabled', true);
});


var action_type;

$("#add-icon").click(function () {
    $('#action-type').val('add');
    $('#cate-id').val('---');
    $('#cate-name').val('');
    $('#cate-name').attr('readonly', false);
    $('#btn-submit').prop('disabled', false);
    action_type = 'add';
    console.log(action_type);
});

$("#del-icon").click(function () {

    var cate_id = $('#cate-id').val();
    if (cate_id == '' || cate_id == '---') {
        $(".caption-alert").text("Cảnh báo!");
        $(".text-alert").text("Phải chọn danh mục trước khi thực hiện xóa.");
        $(".alert").css("transition", "0.3s");
        $(".alert").css("opacity", "1");

        setTimeout(function () {
            $(".alert").css("transition", "0.5s");
            $(".alert").css("opacity", "0");
        }, 1300);
    }else{
        var cate_name = $('#cate-name').val();

        if (confirm('Chắc chắn xóa danh mục có Mã số: '+cate_id+' Tên: '+cate_name+'?')) {
            action_type = 'delete';
            $('#action-type').val(action_type);
            $('#frmInfoCate').submit();
        } else {
            // Do nothing!
        }
    }

});

$("#edit-icon").click(function () {
    var cate_id = $('#cate-id').val();
    if (cate_id == '' || cate_id == '---') {
        $(".caption-alert").text("Cảnh báo!");
        $(".text-alert").text("Phải chọn danh mục trước khi thực hiện cập nhật.");
        $(".alert").css("transition", "0.3s");
        $(".alert").css("opacity", "1");

        setTimeout(function () {
            $(".alert").css("transition", "0.5s");
            $(".alert").css("opacity", "0");
        }, 2000);
    }else{
        $('#action-type').val('edit');
        $('#cate-name').attr('readonly', false);
        $('#btn-submit').prop('disabled', false);
        action_type = 'edit';
        console.log(action_type);
    }
});

$("#btn-submit").click(function () {
    $('#action-type').val(action_type);
    $('#frmInfoCate').submit();
    $('#btn-submit').prop('disabled', true);
});











