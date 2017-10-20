let formatTime = date => {
    let year = date.getFullYear();
    let month = date.getMonth() + 1;
    let day = date.getDate();
    let hour = date.getHours();
    let minute = date.getMinutes();
    let second = date.getSeconds();

    return [year, month, day].map(formatNumber).join('-') + ' ' + [hour, minute, second].map(formatNumber).join(':');
};

let formatDay = () => {
    let date = new Date();
    let year = date.getFullYear();
    let month = date.getMonth() + 1;
    let day = date.getDate();

    return [year, month, day].map(formatNumber).join('-');
};

let welcome = () => {
    let hour = new Date().getHours();
    if (hour >= 5 && hour < 12) {
        return '早上好';
    }
    if (hour >= 12 && hour < 14) {
        return '中午好';
    }
    if (hour >= 14 && hour < 18) {
        return '下午好';
    }
    if (hour >= 18 && hour < 23) {
        return '晚上好';
    }
    if (hour >= 23 || hour < 5) {
        return '别熬夜';
    }
    return '你好';
};

// 获取时间戳，不包含时分秒
let formartTimestamp = () => {
    let dt = new Date();
    dt.setHours(0);
    dt.setMinutes(0);
    dt.setSeconds(0);
    dt.setMilliseconds(0);
    let timestamp = Date.parse(dt);
    timestamp = timestamp / 1000;
    return timestamp;
};

// 查到的连续天数
let continueDays = (arrDays) => {
    if (arrDays.length === 0) {
        return 0;
    }
    let today = formartTimestamp();
    if (today !== arrDays[0]) {
        today = arrDays[0];
    }
    let continueDays = 0;
    let dayStamp = 24 * 60 * 60;
    for (var i = 0; i < arrDays.length; i++) {
        if ((today - arrDays[i]) === (dayStamp * i)) {
            continueDays = continueDays + 1;
        } else {
            break;
        }
    }
    return continueDays;
};

// 总加入天数
let maximumDays = (joinDay) => {
    let today = formartTimestamp();
    let dayStamp = 24 * 60 * 60;
    let maximumDays = Math.abs(joinDay - today);
    maximumDays = maximumDays / dayStamp + 1;
    return maximumDays;
};


let formatNumber = n => {
    n = n.toString()
    return n[1] ? n : '0' + n;
};

let isEmpty = str => {
    if (str === undefined || str === '')
        return true;

    return false;
};

module.exports = {
    // formatTime: formatTime,
    // formatDay: formatDay,
    welcome: welcome,
    continueDays: continueDays,
    maximumDays: maximumDays,
    formartTimestamp: formartTimestamp,
    isEmpty: isEmpty,
};