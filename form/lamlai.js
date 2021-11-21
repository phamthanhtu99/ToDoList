var $ = document.querySelector.bind(document);
var $$ = document.querySelectorAll.bind(document);
var selectorRule = {}
var errorMessage;

function validator(option) {
    var formname = $(option.form);
    console.log(formname);


    //xu kien onblur 
    if (formname) {  // kiển tra #id form
        option.rules.forEach(function (rule) { // loop qua các rules


            if (Array.isArray(selectorRule[rule.selector])) {
                selectorRule[rule.selector].push(rule.test)
            } else {
                selectorRule[rule.selector] = [rule.test]
            }
            var inputElements = $$(rule.selector);
            Array.from(inputElements).forEach(function (inputElement) {
                //xử lí sự kiện khi blur
                inputElement.onblur = function () {
                    validate(inputElement, rule)
                }
                //---------------------------


                // xử lý sự kienj oninput
                inputElement.oninput = function () {
                    var errorElement = getparen(inputElement, option.formGroup).querySelector(option.errorSelector)
                    errorElement.innerHTML = '';
                    getparen(inputElement, option.formGroup).classList.remove('thanhcong')
                    getparen(inputElement, option.formGroup).classList.remove('invalid')
                }

            })

            //Xự  kiện submit

            formname.onsubmit = function (e) {
                e.preventDefault();
                var isavalidate = true;
                option.rules.forEach(function (rule) {
                    var inputElement = $(rule.selector);
                    var check = validate(inputElement, rule);
                    if (!check) {
                        isavalidate = false;
                    }
                })


                if (isavalidate) {
                    if (typeof option.onSubmit === 'function') {
                        var inputvalue = formname.querySelectorAll('[name]')
                        var formValues = Array.from(inputvalue).reduce(function (values, input) {

                            switch (input.type) {
                                case 'radio':
                                    if(input.matches(':checked')){
                                        values[input.name] = input.value;
                                    }break
                                case 'checkbox':
                                    if(!input.matches(':checked')) return values
                                       if(!Array.isArray(values[input.name])){
                                           values[input.name]=[]
                                       }
                                       values[input.name].push(input.value)
                                    
                                   break;
                                   case 'file':
                                    values[input.name]=input.files
                                    break
                                default: (values[input.name] = input.value)
                            }

                            return values
                        }, {})
                    }
                }
                option.onSubmit(formValues)
            }


        })
    }

    function getparen(inputElement, selector) {
        while (inputElement.parentElement) {
            if (inputElement.parentElement.matches(selector)) {
                return inputElement.parentElement;
            }
            inputElement = inputElement.parentElement;
        }
    }

    // xử lý thông báo ui
    function validate(inputElement, rule) {




        var errorElement = getparen(inputElement, option.formGroup).querySelector(option.errorSelector) // lấy element cha cha cua the input
        var rules = selectorRule[rule.selector] //lấy ra cái loại check
        for (let index = 0; index < rules.length; index++) {
            switch (inputElement.type) {
                case 'radio':
                case 'checkbox':
                    errorMessage = rules[index](formname.querySelector(rule.selector + ':checked')); break
                default:
                    errorMessage = rules[index](inputElement.value);

            }
            if (errorMessage) break
        }

        if (errorMessage) {

            getparen(inputElement, option.formGroup).classList.remove('thanhcong')
            getparen(inputElement, option.formGroup).classList.add('invalid')
            errorElement.innerHTML = errorMessage;
        }
        return !errorMessage
    }
    //------------------------------------------------------
}

validator.isRequired = function (selector, messge) {
    return {
        selector: selector,
        test: function (value) {
            return value ? undefined : messge || 'Vui lòng nhập đầy đủ thông tin'
        }
    }
}


validator.isEmail = function (selector, messge) {
    return {
        selector: selector,
        test: function (value) {
            var regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
            return regex.test(value) ? undefined : messge || 'vui lòng nhập lại email'
        }
    }
}

validator.isMinleght = function (selector, min, messge) {
    return {
        selector: selector,
        test: function (value) {
            return value.trim().length >= min ? undefined : messge || `Vui lòng nhập trên ${min} kí tự`
        }
    }
}
validator.checkconfirmation = function (selector, getvalue, messge) {
    return {
        selector: selector,
        test: function (value) {
            return value.trim() === getvalue() ? undefined : messge || `Vui lòng nhập lại mật khẩu`
        }
    }
}