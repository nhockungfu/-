
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
          }
      }
  });
});

$(function () {
    Captcha();
});

function Captcha(){
    var alpha = new Array('A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z',
        'a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z',
        '0','1','2','3','4','5','6','7','8','9');
    var i;
    for (i=0;i<6;i++){
        var a = alpha[Math.floor(Math.random() * alpha.length)];
        var b = alpha[Math.floor(Math.random() * alpha.length)];
        var c = alpha[Math.floor(Math.random() * alpha.length)];
        var d = alpha[Math.floor(Math.random() * alpha.length)];
        var e = alpha[Math.floor(Math.random() * alpha.length)];
        var f = alpha[Math.floor(Math.random() * alpha.length)];
        var g = alpha[Math.floor(Math.random() * alpha.length)];
    }
    var code = a  + b  +  c +  d +  e +  f  + g;
    document.getElementById("mainCaptcha").innerHTML = code
    document.getElementById("mainCaptcha").value = code
}

function ValidCaptcha(){
    var string1 = removeSpaces(document.getElementById('mainCaptcha').value);
    var string2 = removeSpaces(document.getElementById('txtCaptcha').value);
    if (string1 == string2){
        return true;
    }else{
        return false;
    }
}
function removeSpaces(string){
    return string.split(' ').join('');
}



