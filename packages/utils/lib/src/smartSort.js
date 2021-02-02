'use strict';

export function sort(arr, sortProperty) {
    if (!Array.isArray(arr)) {
        throw new Error('参数必须是数组');
    }

    const map = arr.reduce((p, n) => {
        let sortProperty_ = sortProperty || 'name'
        if (n[sortProperty_]) {
            const sortKey = getOrderableString(n[sortProperty_]).join('');

            if (p[sortKey]) {
                if (Array.isArray(p[sortKey])) {
                    p[sortKey].push(n);
                } else {
                    p[sortKey] = [p[sortKey], n];
                }
            } else {
                p[sortKey] = n;
            }
            return p;
        } else {
            throw new Error('排序对象不包含指定属性或name属性');
        }
    }, {});

    const keys = Object.keys(map);

    keys.sort();

    let result = [];
    keys.forEach(key => {
        if (Array.isArray(map[key])) {
            result = result.concat(map[key]);
        } else {
            result.push(map[key]);
        }
    });

    return result;
}

export function getOrderableString(source) {
    // let result = source.includes('-') ? source.split('-') : source.includes('_') ? source.split('_') : source.split(''); //区分批量添加测点的-

    // result = replaceNumber(result);

    let result;
    if (source.includes('-') || source.includes('_')) {
        result = source.includes('-') ? source.split('-') : source;
        result = Array.isArray(result) ? result.reduce((p, n) => {
            if (!n.includes('_')) return p.concat(n);

            return p.concat(n.split('_'))
        }, []) : result.includes('_') ? result.split('_') : result;
        result = result.reduce((p, n) => {
            p = p.concat(replaceNumber(n.split('')))

            return p;
        }, []);
    } else {
        result = replaceNumber(source.split(''))
    }

    result = replaceChineseNumber(result);

    result = replaceSpecialWord(result);

    return result;
}

function replaceNumber(source) {
    let result = source.concat([]);
    let numFound = false;
    let numStart = 0;
    let baseLine = 0;
    for (let i = 0; i < source.length; i++) {
        let calc = false;
        let len = 0;
        let num = parseInt(source[i]);
        if (!Number.isNaN(num)) {
            if (!numFound) {
                numFound = true;
                numStart = i;
            }
            if (i == source.length - 1) {
                calc = true;
                len = source.length - numStart;
            }
        }
        else {
            if (numFound) {
                numFound = false;
                calc = true;
                len = i - numStart;
            }
        }
        if (calc) {
            if (len < 5) {
                let zeroes = '';
                for (let j = 0; j < 5 - len; j++) {
                    zeroes += "0";
                }

                if (baseLine > 0 && Number(num) < 10) {
                    //为解决[3d-12,3d-2]排序结果为[3d-12,3d-2]的问题，添加此处
                    baseLine--;
                }
                result.splice(baseLine + numStart, 0, zeroes);
                baseLine += zeroes.length;
            }
        }
    }

    return result.join('').split('');
}

function replaceSpecialWord(source) {
    const map = { "上": "1001", "中": "1002", "下": "1003", "左": "1001", "右": "1003" };

    let result = source.join('');
    Object.keys(map).forEach(key => {
        result = result.replace(key, map[key]);
    });

    return result.split('');
}

function replaceChineseNumber(source) {
    var map =
    {
        "零": 0,
        "一": 1,
        "二": 2,
        "三": 3,
        "四": 4,
        "五": 5,
        "六": 6,
        "七": 7,
        "八": 8,
        "九": 9,
        "十": 10
    };

    var result = source;
    var numFound = false;
    var numStart = 0;
    var baseLine = 0;
    for (let i = 0; i < source.length; i++) {
        var calc = false;
        var len = 0;
        if (map[source[i]]) {//零不作处理
            if (!numFound) {
                numFound = true;
                numStart = i;
            }
            if (i == source.length - 1) {
                calc = true;
                len = source.length - numStart;
            }
        }
        else {
            if (numFound) {
                numFound = false;
                calc = true;
                len = i - numStart;
            }
        }

        if (calc) {
            var cp = '';
            var num = -1;
            if (len == 1) {
                num = map[source[numStart]];
            }
            else if (len == 2) {
                if (source[numStart] == '十') {
                    num = 10 + map[source[numStart + 1]];
                }
                else if (source[numStart + 1] == '十') {
                    num = map[source[numStart]] * 10;
                }
                else {
                    num = map[source[numStart]] * 10 + map[source[numStart + 1]];
                }
            }
            else if (len == 3) {
                if (source[numStart + 1] == '十') {
                    num = map[source[numStart]] * 10 + map[source[numStart + 2]];
                }
                else {
                    num = map[source[numStart]] * 100 + map[source[numStart + 1]] * 10 + map[source[numStart + 2]];
                }
            }

            if (num != -1) {
                var l = 3 - num.toString().length;
                var zeroes = '';
                for (let j = 0; j < l; j++) {
                    zeroes += "0";
                }
                cp = zeroes + num;

                result.splice(baseLine + numStart, len, cp);
                baseLine += cp.length - len;
            }
        }
    }

    return result.join('').split('');
}