const app = getApp();
const Bmob = app.globalData.Bmob;
const util = require('../utils/util.js');

// 查询全部习惯
let getHobbies = (success) => {
    var hobbies = Bmob.Object.extend("Hobbies");
    var query = new Bmob.Query(hobbies);
    query.equalTo('isEnable', true);
    query.find({
        success: (results) => {
            console.log("getHobbies-success-count: " + results.length);
            success(results);
        },
        error: function (result, error) {
            console.log("getHobbies-error: " + error.code + " " + error.message);
        }
    });
};

// 添加习惯
let addHobby = (item, success, fail) => {
    let UserHobbies = Bmob.Object.extend('UserHobbies');
    let myHobby = new UserHobbies();
    myHobby.set('openId', app.globalData.userInfo.openId);
    myHobby.set('hobbyName', item.name);
    myHobby.set('hobbyId', item.hobbyId);
    myHobby.set('categoryId', item.categoryId);
    myHobby.set('uniqueData', app.globalData.userInfo.openId + item.hobbyId);
    myHobby.save(null, {
        success: (result) => {
            console.log("addHobby-success-hobbyName: " + item.name);
            success(result);
        },
        error: (result, error) => {
            console.log("addHobby-error: " + error.code + " " + error.message);
            if (fail) {
                fail(error);
            }
        }
    });
};

// 查询我的习惯信息
let getMyHobbies = (success, fail) => {
    let UserHobbies = Bmob.Object.extend('UserHobbies');
    let query = new Bmob.Query(UserHobbies);
    query.equalTo('openId', app.globalData.userInfo.openId);
    query.find({
        success: (results) => {
            console.log("getMyHobbies-success-count: " + results.length);
            success(results);
        },
        error: (error) => {
            console.log("getMyHobbies-error: " + error.code + " " + error.message);
            if (fail)
                fail();
        }
    });
};

module.exports = {
    getHobbies: getHobbies,
    getMyHobbies: getMyHobbies,
    addHobby: addHobby,
};