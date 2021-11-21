var $ = document.querySelector.bind(document)
var $$ = document.querySelectorAll.bind(document)
function validator(formselector) {
    var _this=this
    var formRules = {}
    var validatorRules = {
        required: function (value) {
            return value ? undefined : 'Vui long nhập trường này'
        },
        email: function (value) {
            var regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
            return regex.test(value) ? undefined : 'vui lòng nhập lại email'
        },
        min: function (min) {
            return function (value) {
                return value.length >= min ? undefined : `Vui lòng nhập tối thiểu ${min}`
            }
        },
        max: function (min) {
            return function (value) {
                value.trim().length >= min ? undefined : `Vui lòng nhập tối thiểu ${max}`
            }
        }
    }

    var formElement = $(formselector)


    if (formElement) {
        var inputs = formElement.querySelectorAll('[name][rules]')//lấy tất cả các input có rules và name
        for (var input of inputs) { //lọc quan các phần tử inputs
            var rules = input.getAttribute('rules').split('|')  // tìm các rules có 2 điều kiện
            for (var rule of rules) {  //lọc điều kiện có 2 rules trở lên

                var ruleInfo;
                const isRuleHasValue = rule.includes(":");

                if (isRuleHasValue) {
                    ruleInfo = rule.split(":");
                    rule = ruleInfo[0];
                }

                var ruleFunc = validatorRules[rule];

                //Nếu là rule cần value thì lấy function bên trong
                if (isRuleHasValue) {
                    ruleFunc = ruleFunc(ruleInfo[1]);
                }

                // truyền dũ liệu vào mảng  formRules và tìm các điều kiên tương ứng trong validator
                if (Array.isArray(formRules[input.name])) {
                    formRules[input.name].push(ruleFunc)
                } else {
                    formRules[input.name] = [ruleFunc]
                }
                //--------------------------


            }


            // lắng nghe sự kiện 

            input.onblur = handleValidate;
            input.oninput = handleClearError;

        }

        //xử lý hành vi onblur
        function handleValidate(event) {
            var rules = formRules[event.target.name]
            var errorMessage;
            for (rule of rules) {
                errorMessage = rule(event.target.value)
                if (errorMessage) {
                    break;
                }
            };
            var inputGroud = getParent(event.target, '.form-group'); //lấy ra thẻ div cha cua input
            var formMessge = inputGroud.querySelector('span')
            if (errorMessage) {
                if (inputGroud) {
                    inputGroud.classList.add('invalid')

                    formMessge.innerHTML = errorMessage;

                }

            } else {
                formMessge.innerHTML = '';
                inputGroud.classList.remove('invalid')
            }

            return !errorMessage;
        }

        //xử lý hành vi oninput
        function handleClearError(e) {
            var inputGroud = e.path[1];
            if (inputGroud.classList.contains('invalid')) {
                inputGroud.classList.remove('invalid')
            }
        }
        //xử lí hành vi submit
        formElement.onsubmit = function (e) {
            e.preventDefault();
            var isvalid = true;
            var inputs = formElement.querySelectorAll('[name][rules]')//lấy tất cả các input có rules và name
            for (var input of inputs) { //lọc điều kiện có 2 rules trở lên
                if (!handleValidate({ target: input })) {
                    isvalid = false;
                }
            }

            if (isvalid) {

                if (typeof _this.onSubmit === 'function') {
                    var inputvalue = formElement.querySelectorAll('[name]')
                    var formValues = Array.from(inputvalue).reduce(function (values, input) {

                        switch (input.type) {
                            case 'radio':
                                if (input.matches(':checked')) {
                                    values[input.name] = input.value;
                                } break
                            case 'checkbox':
                                if (!input.matches(':checked')) return values
                                if (!Array.isArray(values[input.name])) {
                                    values[input.name] = []
                                }
                                values[input.name].push(input.value)

                                break;
                            case 'file':
                                values[input.name] = input.files
                                break
                            default: (values[input.name] = input.value)
                        }

                        return values
                    }, {})
                    return _this.onSubmit(formValues);
                }
                formElement.submit();
            }
        }
        function getParent(element, selecttor) {
            while (element.parentElement) {
                if (element.parentElement.matches(selecttor)) {
                    return element.parentElement;
                }
                element = element.parentElement;
            }
        }
        console.log(formRules);
    }
}