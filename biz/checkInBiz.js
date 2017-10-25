const app = getApp();
const Bmob = app.globalData.Bmob;
const util = require('../utils/util.js');
const userInfoBiz = require('../biz/userInfoBiz.js');

// 打卡
let checkIn = (hobby, note, success, fail) => {
    let CheckIn = Bmob.Object.extend('CheckIn');
    let query = new Bmob.Query(CheckIn);
    query.equalTo('uniqueData', app.globalData.userInfo.openId + hobby.hobbyId + util.formartTimestamp());
    query.find({
        success: (results) => {
            console.log('get-checkIn-success-count: ' + results.length);
            let myCheckIn = null;
            if (results.length == 1) {
                console.log('checkIn-update-hobbyId: ' + hobby.hobbyId);
                myCheckIn = results[0];
                myCheckIn.set('image', note.image);
                myCheckIn.set('content', note.content);
            } else {
                console.log('checkIn-create-hobbyId: ' + hobby.hobbyId);
                myCheckIn = new CheckIn();
                myCheckIn.set("hobbyId", hobby.hobbyId);
                myCheckIn.set("openId", app.globalData.userInfo.openId);
                myCheckIn.set('isCheckIn', true);
                if (note) {
                    console.log('checkIn-create-note: ' + note.image);
                    myCheckIn.set('image', note.image);
                    myCheckIn.set('content', note.content);
                }
                myCheckIn.set('hobbyName', hobby.hobbyName);
                myCheckIn.set('dayStamp', util.formartTimestamp());
                myCheckIn.set('uniqueData', app.globalData.userInfo.openId + hobby.hobbyId + util.formartTimestamp());
            }
            myCheckIn.save(null, {
                success: (result) => {
                    console.log('checkIn-success-hobbyId: ' + hobby.hobbyId);
                    success(result);
                },
                error: (result, error) => {
                    console.log('checkIn-error: ' + error.code + " " + error.message);
                    if (fail)
                        fail(error);
                }
            });
        },
        error: (error) => {
            console.log("get-checkIn-error: " + error.code + " " + error.message);
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
 * noteCount 我的总记录数
 */
let getCheckInDaysById = (hobby, success, fail) => {
    let checkInContinuousDays = 0;
    let checkInAllDays = 0;
    let allUserTodayCheckInCount = 0;
    let allUserCount = 1;
    let maximumDays = 1;
    let noteCount = 0;
    let todayNote = false;
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
                        // 我的记录总数
                        if (result.get('image') !== undefined) {
                            noteCount++;
                            //　今日记录数
                            if (result.get('dayStamp') === util.formartTimestamp()) {
                                todayNote = true;
                            }
                        }
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
                    'myCheckInDays': checkInDays.checkInDays,
                    'noteCount': noteCount,
                    'todayNote': todayNote
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
 * @param {*} currentPage 页码 0开始
 * @param {*} success 
 * @param {*} fail 
 */
let getAllCheckIn = (currentPage, success, fail) => {

    let limit = 20;
    let CheckIn = Bmob.Object.extend('CheckIn');
    let query = new Bmob.Query(CheckIn);
    query.descending('dayStamp');
    query.limit(limit);
    query.skip(currentPage * limit);
    query.find({
        success: (results) => {
            console.log('getAllCheckIn-success-count: ' + results.length);
            if (results.length > 0) {
                let todayList = [];
                let allList = [];
                let openIds = [];
                let userMap = new Set();
                let userList = new Map();
                results.forEach(item => {
                    if (!userMap.has(item.get('openId'))) {
                        userMap.add(item.get('openId'));
                        openIds.push(item.get('openId'));
                    }
                });

                userInfoBiz.findAllUserByOpenIds(openIds,
                    function succ(users) {
                        console.log('users: ' + users.length);
                        for (var i = 0; i < users.length; i++) {
                            let user = users[i];
                            userList.set(user.get('openId'), {
                                'nickName': user.get('nickName'),
                                'avatarUrl': user.get('avatarUrl'),
                            });
                        }

                        results.forEach(item => {
                            let list = {
                                'nickName': userList.get(item.get('openId')).nickName,
                                'avatarUrl': userList.get(item.get('openId')).avatarUrl,
                                'hobbyName': item.get('hobbyName'),
                                'time': item.get('createAt'),
                                'noteUrl': item.get('image')
                            };
                            allList.push(list);
                            if (item.get('dayStamp') === util.formartTimestamp()) {
                                todayList.push(list);
                            }
                        });
                        success(todayList, allList);
                    },
                    function error(error) {
                        console.log("getAllCheckIn-error: " + error.code + " " + error.message);
                        if (fail)
                            fail();
                    });
            } else {
                console.log("getAllCheckIn-error: " + error.code + " " + error.message);
                if (fail)
                    fail();
            }
        },
        error: (error) => {
            console.log("getAllCheckIn-error: " + error.code + " " + error.message);
            if (fail)
                fail();
        }
    });
};

// 获取某个hobbyId的打卡信息
let getTodayCheckIn = (hobbyId, success, fail) => {
    let CheckIn = Bmob.Object.extend('CheckIn');
    let checkInQuery = new Bmob.Query(CheckIn);
    checkInQuery.equalTo('hobbyId', hobbyId);
    checkInQuery.descending('dayStamp');

    checkInQuery.find({
        success: (results) => {
            console.log("geTodayCheckIn-success-count: " + results.length);
            let userMap = new Map();
            let openIds = [];
            for (var index = 0; index < results.length; index++) {
                var checkIn = results[index];
                if (!userMap.has(checkIn.get("openId"))) {
                    userMap.set(checkIn.get('openId'), {
                        'todayCheckIn': checkIn.get('dayStamp') === util.formartTimestamp(),
                        'checkInDays': 1,
                    });
                    openIds.push(checkIn.get('openId'));
                } else {
                    let values = userMap.get(checkIn.get('openId'));
                    values.checkInDays += 1;
                    userMap.set(checkIn.get('openId'), values);
                }
            }
            console.log('usermap: ' + userMap.length);
            let userList = [];
            userInfoBiz.findAllUserByOpenIds(openIds,
                function succ(users) {
                    console.log('users: ' + users.length);
                    for (var i = 0; i < users.length; i++) {
                        let user = users[i];
                        let checkInfo = userMap.get(user.get('openId'));
                        checkInfo.nickName = user.get('nickName');
                        checkInfo.avatarUrl = user.get('avatarUrl');
                        userList.push(checkInfo);
                    }
                    success(userList);
                },
                function error(error) {
                    if (fail)
                        fail();
                });

        },
        error: (error) => {
            console.log('geTodayCheckIn-error: ' + error.code + " " + error.message);
            if (fail)
                fail();
        }
    });
};

let uploadFile = (filePath, success, fail) => {
    var name = util.formatFileName() + ".jpg";
    var file = new Bmob.File(name, filePath);
    file.save().then(function(res) {
        console.log('uploadFile: ' + res.url());
        if (res.url()) {
            success(res.url());
        } else {
            if (fail)
                fail();
        }

    }, function(error) {
        console.log('createNote-error: ' + error.code + " " + error.message);
        if (fail)
            fail();
    });
};

module.exports = {
    checkIn: checkIn,
    getMyHobbiesCheckIn: getMyHobbiesCheckIn,
    getCheckInDaysById: getCheckInDaysById,
    getAllCheckIn: getAllCheckIn,
    getTodayCheckIn: getTodayCheckIn,
    uploadFile: uploadFile,
};