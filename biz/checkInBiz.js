const app = getApp();
const util = require('../utils/util.js');

// 打卡
let checkIn = (hobbyId, success, fail) => {
    let CheckIn = app.globalData.Bmob.Object.extend('CheckIn');
    let myCheckIn = new CheckIn();
    myCheckIn.set("hobbyId", hobbyId);
    myCheckIn.set("openId", app.globalData.userInfo.openId);
    myCheckIn.set('isCheckIn', true);
    myCheckIn.set('date', util.formatDay());
    myCheckIn.save(null, {
        success: (result) => {
            console.log('checkIn-success-hobbyId: ' + hobbyId);
            success(result);
        },
        error: (result, error) => {
            console.log('checkIn-error: ' + error.code + " " + error.message);
            if (fail)
                fail(error);
        }
    });
};

// 查询全部习惯的当日打卡信息
let getMyHobbiesCheckIn = (success, fail) => {
    let CheckIn = app.globalData.Bmob.Object.extend('CheckIn');
    let queryCheckIn = new app.globalData.Bmob.Query(CheckIn);
    queryCheckIn.equalTo('date', util.formatDay());
    queryCheckIn.equalTo('openId', app.globalData.userInfo.openId);
    queryCheckIn.find({
        success: (results) => {
            console.log("queryCheckIn-success-count: " + results.length);
            success(results);
        },
        error: (error) => {
            console.log("getMyHobbiesCheckIn-error: " + error.code + " " + error.message);
            if (fail)
                fail(error);
        }
    });
}

module.exports = {
    checkIn: checkIn,
    getMyHobbiesCheckIn: getMyHobbiesCheckIn,
};