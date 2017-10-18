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

/**
 * 获取某个习惯的打卡总数
 * return:
 * checkInContinuousDays 连续签到天数
 * checkInAllDays 坚持的天数
 * allUserTodayCheckInCount 今日打卡人数
 * allUserCount 所有参与人数
 * maximumDays 总共加入天数
 */
let getCheckInDaysById = (hobbyId, success, fail) => {

    let checkInContinuousDays = 0;
    let checkInAllDays = 0;
    let allUserTodayCheckInCount = 0;
    let allUserCount = 0;
    let maximumDays = 0;

    let openId = app.globalData.userInfo.openId;

    let CheckIn = app.globalData.Bmob.Object.extend('CheckIn');
    let query = new app.globalData.Bmob.Query(CheckIn);
    query.equalTo('hobbyId', hobbyId);
    query.find({
        success: (results) => {
            let myCheckInDays = [];
            let allUserSet = new Set();
            results.forEach(result => {
                // 筛选个人的打卡时间
                if (result.get('openId') === openId) {
                    myCheckInDays.push(result.get('dayStamp'));
                }
                // 查找今日打卡人数
                if (result.get('dayStamp') === util.formartTimestamp()) {
                    allUserTodayCheckInCount = allUserTodayCheckInCount + 1;
                }
                if (!allUserSet.has(result.get('openId'))) {
                    allUserSet.add(result.get('openId'));
                }
            });

            checkInAllDays = myCheckInDays.length;
            checkInContinuousDays = util.continueDays(myCheckInDays);
            maximumDays = util.maximumDays(myCheckInDays[0], myCheckInDays[checkInAllDays - 1]);
            allUserCount = allUserSet.size;
            console.log("checkInContinuousDays: " + checkInContinuousDays);
            console.log("checkInAllDays: " + checkInAllDays);
            console.log("allUserTodayCheckInCount: " + allUserTodayCheckInCount);
            console.log("allUserCount: " + allUserCount);
            console.log("maximumDays: " + maximumDays);
            success(checkInContinuousDays, checkInAllDays, allUserTodayCheckInCount, allUserCount, maximumDays);
        },
        error: (error) => {
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