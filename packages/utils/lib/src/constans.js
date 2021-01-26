export default {
    defaultValidateMessages: {//表单验证提示模板
        default: '${label} 验证错误',
        required: '${label} 必填',
        enum: '${label} 必须是 [${enum}] 里的一个值',
        whitespace: '${label} 不能为空',
        date: {
            format: '${label} 时间格式不正确',
            parse: '${label} 不能转化为一个正确的时间格式',
            invalid: '${label} 是一个无效的时间格式',
        },
        types: {
            string: '${label} 必须为字符',
            method: '${label} 必须为方法',
            array: '${label} 必须为数组',
            object: '${label} 必须为对象',
            number: '${label} 必须为数字',
            date: '${label} 必须为时间',
            boolean: '${label} 必须为布尔值',
            integer: '${label} 必须为整数字',
            float: '${label} 必须为浮点数',
            regexp: '${label} 必须为正则表达式',
            email: '${label} 必须为正确的邮件地址',
            url: '${label} 必须为正确的Url地址',
            hex: '${label} 必须为正确的十六进制字符',
        },
        string: {
            len: '${label} 长度必须为${len}',
            min: '${label} 长度必须大于${min}',
            max: '${label} 长度必须小于${max}',
            range: '${label} 长度必须在${min} 和 ${max} 之间',
        },
        number: {
            len: '${label} 长度必须为${len}',
            min: '${label} 长度必须大于${min}',
            max: '${label} 长度必须小于${max}',
            range: '${label} 长度必须在${min} 和 ${max} 之间',
        },
        array: {
            len: '${label} 每个值的长度必须为${len}',
            min: '${label} 每个值的长度必须大于${min}',
            max: '${label} 每个值的长度必须小于${max}',
            range: '${label} 每个值的长度必须在${min} 和 ${max} 之间',
        },
        pattern: {
            mismatch: '${label} 验证不通过',
        },
    }
}