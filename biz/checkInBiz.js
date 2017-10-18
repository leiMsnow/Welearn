const app = getApp();
const util = require('../utils/util.js');

// 打卡
let checkIn = (hobbyId, success, fail) => {
    let CheckIn = app.globalData.Bmob.Object.extend('CheckIn');
    let myCheckIn = new CheckIn();
    myCheckIn.set("hobbyId", hobbyId);
    myCheckIn.set("openId", app.globalData.userInfo.openId);
    myCheckIn.set('isCheckIn', true);
    myCheckIn.set('dayStamp', util.formartTimestamp());
    myCheckIn.set('uniqueData', app.globalData.userInfo.openId + hobbyId + util.formartTimestamp());
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

// 查询我的所有当日打卡信息
let getMyHobbiesCheckIn = (success, fail) => {
    let CheckIn = app.globalData.Bmob.Object.extend('CheckIn');
    let queryCheckIn = new app.globalData.Bmob.Query(CheckIn);
    queryCheckIn.equalTo('dayStamp', util.formartTimestamp());
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
};

// 获取某个习惯的打卡总天数
let getCheckInDaysById = (hobbyId, success, fail) => {
    let openId = app.globalData.userInfo.openId;
    let checkInContinuousDays = 0;
    let allUserCheckInCount = 0;
    let CheckIn = app.globalData.Bmob.Object.extend('CheckIn');
    let query = new app.globalData.Bmob.Query(CheckIn);
    query.equalTo('hobbyId', hobbyId);
    query.find({
        success: (results) => {
            let myCheckInDays = [];
            results.forEach(result => {
                // 筛选个人的打卡时间
                if (result.get('openId') === openId) {
                    myCheckInDays.push(result.get('dayStamp'));
                }
                // 查找今日打卡人数
                if (result.get('dayStamp') === util.formartTimestamp()) {
                    allUserCheckInCount = allUserCheckInCount + 1;
                }
            });
            checkInContinuousDays = util.continueDays(myCheckInDays);
            console.log("checkInContinuousDays: " + checkInContinuousDays);
            console.log("checkInAllDays: " + myCheckInDays.length);            
            console.log("allUserCheckInCount: " + allUserCheckInCount);
            success(checkInContinuousDays, myCheckInDays.length, allUserCheckInCount);
        }, error: (error) => {
            console.log("getCheckInContinuousCount-error: " + error.code + " " + error.message);
            if (fail)
                fail();
        }
    });
};

module.exports = {
    checkIn: checkIn,
    getMyHobbiesCheckIn: getMyHobbiesCheckIn,
    getCheckInDaysById: getCheckInDaysById,
};