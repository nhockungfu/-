
$(function() {

  $.validator.setDefaults({
    errorClass: 'help-block',
    highlight: function(element) {
      $(element)
        .closest('.form-group')
        .addClass('has-error');
    },
    unhighlight: function(element) {
      $(element)
        .closest('.form-group')
        .removeClass('has-error');
    },
    errorPlacement: function (error, element) {
      if (element.prop('type') === 'checkbox') {
        error.insertAfter(element.parent());
      } else {
        error.insertAfter(element);
      }
    }
  });

  $.validator.addMethod('strongPassword', function(value) {
    return value.length >= 8;
  }, 'Mật khẩu phải lớn hơn 8 ký tự')


  $("#register-form").validate({
      ignore: ".ignore",
    rules: {
      txtEmail: {
        required: true,
        email: true
      },
      txtPassWord: {
        required: true,
        strongPassword: true
      },
      txtRepPassWord: {
        required: true,
        equalTo: '#txtPassWord'
      },
       cb_remider: {
        required: true
      },
        txtCaptcha:{
          required: true,
            equalTo: '#mainCaptcha'
        },
        hiddenRecaptcha: {
            required: function () {
                if (grecaptcha.getResponse() == '') {
                    return true;
                } else {
                    return false;
                }
            }
        }
    },
      messages: {
          txtEmail: {
              required: 'Bạn chưa nhập địa chỉ email.',
              email: 'Địa chỉ email không hợp lệ.'
          },
          txtPassWord:{
              required: 'Bạn chưa nhập mật khẩu.'
          },
          txtRepPassWord: {
              required: 'Vui lòng xác nhận mật khẩu',
              equalTo: 'Mật khẩu xác nhận không đúng.'
          },
          txtCaptcha:{
              required: 'Chưa xác nhận chuỗi ký tự',
              equalTo: 'Mã xác nhận sai'
          },
          cb_remider: {
              required: 'Bạn chưa đồng ý điều khoản sử dụng'
          },
          hiddenRecaptcha:{
              required: 'Vui lòng xác nhận Bạn không phải là robot'
          }
      }
  });
  $("#infor-form").validate({
      rules: {
          txt_email: {
              required: true,
              email: true
          },
          txt_hoTen: {
              required: true
          },
          txt_password: {
              required: true
          }
      },
      messages: {
          txt_email: {
              required: 'Bạn chưa nhập địa chỉ email.',
              email: 'Địa chỉ email không hợp lệ.'
          },
          txt_hoTen: {
              required: 'Họ và tên không được để trống.'
          },
          txt_password:{
              required: 'Bạn chưa nhập mật khẩu.'
          }
      }
  });

    $("#changePass-form").validate({
        rules: {
            txt_password: {
                required: true
            },
            txt_passwordNew: {
                required: true,
                strongPassword: true
            },
            txt_passwordNew2: {
                equalTo: '#txt_passwordNew'
            }
        },
        messages: {
            txt_password: {
                required: 'Vui lòng nhập mật khẩu hiện tại.'
            },
            txt_passwordNew: {
                required: 'Vui lòng nhập mật khẩu mới.'
            },
            txt_passwordNew2:{
                equalTo: 'Mật khẩu xác nhận không trùng khớp.'
            }
        }
    });
});




