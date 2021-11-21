var $ = document.querySelector.bind(document);
var $$ = document.querySelectorAll.bind(document);
function validator(option) {
    // xữ lý 
    var selectorRule = {}

    function validate(inputElement, rule) {
        var errorElement = inputElement.parentElement.querySelector(option.errorSelector) // lấy element cha cha cua the input
        var errorMessage 
        var rules = selectorRule[rule.selecttor] //

        for (var i = 0; i < rules.length; i++) {
            errorMessage = rules[i](inputElement.value)
            if (errorMessage) break //nếu có lỗi thì thoát khỏi vòng lặp
        }
        console.log(rules);
        if (!errorMessage) {
            inputElement.parentElement.classList.add('thanhcong')
            errorElement.innerHTML = 'giá trị điền thành công';
            inputElement.parentElement.classList.remove('invalid')
        } else {
            inputElement.parentElement.classList.remove('thanhcong')
            inputElement.parentElement.classList.add('invalid')
            errorElement.innerHTML = errorMessage;

        }
        return !errorMessage // nếu có dữ liệu thì mess trả về  false
    }


    var formElement = $(option.form) // lấy element của form
    if (formElement) {


        formElement.onsubmit = function (e) {
            e.preventDefault();
            var isavlidate = true;
            option.rules.forEach(function (rule) {

                var inputElement = $(rule.selecttor);
                var check = validate(inputElement, rule)
                if (!check) {
                    isavlidate = false
                }
            });




            if (isavlidate) {
                if (typeof option.onSubmit === 'function') {
                    var enableInput = formElement.querySelectorAll('[name]')
                    console.log(enableInput);
                    var formValues = Array.from(enableInput).reduce(function (values, input) {
                        (values[input.name] = input.value) 
                        return values
                    }, {})
                }
            }
            option.onSubmit(123)
        }



        option.rules.forEach(function (rule) {
            var inputElement = $(rule.selecttor)

            if (Array.isArray(selectorRule[rule.selecttor])) {
                selectorRule[rule.selecttor].push(rule.test);
            } else {
                selectorRule[rule.selecttor] = [rule.test];
            }


            if (inputElement) {
                inputElement.onblur = function () {
                    validate(inputElement, rule)
                }
                inputElement.oninput = function () {
                    var errorElement = inputElement.parentElement.querySelector(option.errorSelector)
                    errorElement.innerHTML = '';
                    inputElement.parentElement.classList.remove('thanhcong')
                    inputElement.parentElement.classList.remove('invalid')
                }
            }
        });
    }
}
validator.isRequired = function (selecttor, messge) {
    return {
        selecttor: selecttor,
        test: function (value) {
            return value.trim() ? undefined : messge || 'vui lòng nhập thông tin'
        }
    }
}
validator.isEmail = function (selecttor, messge) {
    return {
        selecttor: selecttor,
        test: function (value) {
            var regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
            return regex.test(value) ? undefined : messge || 'vui lòng nhập lại email'
        }
    }
}
validator.isMinleght = function (selecttor, min, messge) {
    return {
        selecttor: selecttor,
        test: function (value) {
            return value.trim().length >= min ? undefined : messge || `Vui lòng nhập tối thiểu ${min} ký tự`
        }
    }
}

validator.checkconfirmation = function (selecttor, getpassword, messge) {
    return {
        selecttor: selecttor,
        test: function (value) {
            return value.trim() === getpassword() ? undefined : messge || 'Mật khẩu nhập lại không trùng khớp'
        }
    }
}
