const app = getApp();
const util = require('../utils/util.js');

// 打卡
let checkIn = (hobbyId, success, error) => {
    let CheckIn = app.globalData.Bmob.Object.extend('CheckIn');
    let myCheckIn = new CheckIn();
    myCheckIn.set("hobbyId", hobbyId);
    myCheckIn.set("openId", app.globalData.userInfo.openId);
    myCheckIn.set('isCheckIn', true);
    myCheckIn.set('date', util.formatDay());
    myCheckIn.save(null, {
        success: (result) => {
            console.log('打卡成功');
            success(result);
        },
        error: (result, error) => {
            console.log('打卡失败:' + error.code + " " + error.message);
            error(result, error);
        }
    });
};

// 查询全部习惯的当日打卡信息
let getMyHobbiesCheckIn = (success, error) => {
    let CheckIn = app.globalData.Bmob.Object.extend('CheckIn');
    let queryCheckIn = new app.globalData.Bmob.Query(CheckIn);
    queryCheckIn.equalTo('date', util.formatDay());
    queryCheckIn.equalTo('openId', app.globalData.userInfo.openId);
    queryCheckIn.find({
        success: (checkInResults) => {
            console.log("queryCheckIn共查询到 " + checkInResults.length + " 条记录");
            success(checkInResults);
        },
        error: (error) => {
            console.log("error: " + error.code + " " + error.message);
            error(error);
        }
    });
}

module.exports = {
    checkIn: checkIn,
    getMyHobbiesCheckIn: getMyHobbiesCheckIn,
};
