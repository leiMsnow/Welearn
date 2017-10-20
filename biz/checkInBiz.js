const app = getApp();
const Bmob = app.globalData.Bmob;
const util = require('../utils/util.js');

// 打卡
let checkIn = (hobbyId, success, fail) => {
    let CheckIn = Bmob.Object.extend('CheckIn');
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
    let CheckIn = Bmob.Object.extend('CheckIn');
    let queryCheckIn = new Bmob.Query(CheckIn);
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
let getCheckInDaysById = (hobby, success, fail) => {

    let checkInContinuousDays = 0;
    let checkInAllDays = 0;
    let allUserTodayCheckInCount = 0;
    let allUserCount = 1;
    let maximumDays = 1;
    let myCheckInDays = [];

    let openId = app.globalData.userInfo.openId;

    let CheckIn = Bmob.Object.extend('CheckIn');
    let query = new Bmob.Query(CheckIn);
    query.equalTo('hobbyId', hobby.hobbyId);
    query.descending('dayStamp');
    query.find({
        success: (results) => {
            console.log('getCheckInDaysById-success-count: ' + results.length);
            if (results.length > 0) {
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
                maximumDays = util.maximumDays(myCheckInDays[myCheckInDays.length - 1]);
                allUserCount = allUserSet.size;
            }
            let checkInDays = {
                'checkInDays': myCheckInDays,
                'maximumDays': maximumDays,
                'checkInAllDays': checkInAllDays,
                'checkInContinuousDays': checkInContinuousDays,
                'allUserCount': allUserCount,
                'allUserTodayCheckInCount': allUserTodayCheckInCount
            };
            let temp = {
                'hobbyInfo': {
                    'title': hobby.hobbyName,
                    'checkInDays': checkInDays.checkInDays
                },
                'maximumDays': {
                    'title': '加入天数',
                    'count': checkInDays.maximumDays,
                },
                'checkInAllDays': {
                    'title': '坚持天数',
                    'key': 'checkInAllDays',
                    'count': checkInDays.checkInAllDays,

                },
                'checkInContinuousDays': {
                    'title': '连续签到',
                    'key': 'checkInContinuousDays',
                    'count': checkInDays.checkInContinuousDays,
                },
                'allUserCount': {
                    'title': '参与人数',
                    'key': 'allUserCount',
                    'count': checkInDays.allUserCount,
                },
                'allUserTodayCheckInCount': {
                    'title': '今日完成',
                    'key': 'allUserTodayCheckInCount',
                    'count': checkInDays.allUserTodayCheckInCount,
                }
            };
            success(temp);
        },
        error: (error) => {
            console.log("getCheckInContinuousCount-error: " + error.code + " " + error.message);
            if (fail)
                fail();
        }
    });
};


/**
 * 获取所有打卡信息，一次返回20条
 * @param {*} isToDay 类型 true今天 false全部
 * @param {*} currentPage 页码 0开始
 * @param {*} success 
 * @param {*} fail 
 */
let getAllCheckIn = (isToDay, currentPage, success, fail) => {

    let limit = 20;
    let CheckIn = Bmob.Object.extend('CheckIn');
    let query = new Bmob.Query(CheckIn);
    if (isToDay) {
        query.equalTo('dayStamp', util.formartTimestamp());
    }
    query.descending('dayStamp');
    query.limit(limit);
    query.skip(currentPage * limit);
    query.find({
        success: (results) => {
            console.log('getAllCheckIn-success-today: ' + isToDay + ', count: ' + results.length);

        },
        error: (error) => {
            console.log("getAllCheckIn-error: " + error.code + " " + error.message);
            if (fail)
                fail();
        }
    });

};

module.exports = {
    checkIn: checkIn,
    getMyHobbiesCheckIn: getMyHobbiesCheckIn,
    getCheckInDaysById: getCheckInDaysById,
    getAllCheckIn: getAllCheckIn,
};