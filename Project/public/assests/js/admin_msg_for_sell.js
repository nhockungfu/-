
$(".btn-agree").click(function () {
    var user_id = $(this).attr('id');

    $('#action-type').val('agree');
    $('#user-id').val(user_id);
    $('#frmInfoUser').submit();
});

$(".btn-cancel").click(function () {
    var user_id = $(this).attr('id');

    $('#action-type').val('cancel');
    $('#user-id').val(user_id);
    $('#frmInfoUser').submit();
});

