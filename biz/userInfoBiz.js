const app = getApp();
const util = require('../utils/util.js');

// 查询openId
let requestOpenId = (code, success) => {
    app.globalData.Bmob.User.requestOpenId(code, {
        success: (result) => {
            console.log("requestOpenId-success-openId: " + result.openid);
            success(result);
        },
        error: (error) => {
            console.log('requestOpenId-error: ' + error.code + " " + error.message);
        }
    });
};

// 根据openId查找用户
let findUserByOpenId = (openId, success) => {
    console.log("uploadUserInfo：" + openId);
    let User = app.globalData.Bmob.Object.extend("UserInfo");
    let user = new app.globalData.Bmob.Query(User);
    user.equalTo('openId', openId);
    user.find({
        success: (results) => {
            console.log("findUserByOpenId-success-count: " + results.length);
            success(results);
        },
        error: (error) => {
            console.log('findUserByOpenId-error: ' + error.code + " " + error.message);
        }
    });
};


// 设置用户信息
let setUserInfo = (userInfo, results) => {
    let User = app.globalData.Bmob.Object.extend("UserInfo");
    let user = new User();
    if (results.length === 1) {
        user = results[0];
        console.log("更新用户信息");
        return;
    } else {
        user.set("openId", userInfo.openId);
    }
    user.set("nickName", userInfo.nickName);
    user.set("avatarUrl", userInfo.avatarUrl);
    user.set("gender", userInfo.gender);
    user.set("province", userInfo.province);
    user.set("city", userInfo.city);
    user.set("country", userInfo.country);
    user.set("language", userInfo.language);

    user.save(null, {
        success: (result) => {
            console.log("setUserInfo-success-nickName: " + userInfo.nickName);
        },
        error: (result, error) => {
            console.log('setUserInfo-error: ' + error.code + " " + error.message);
        }
    });
};

module.exports = {
    requestOpenId: requestOpenId,
    findUserByOpenId: findUserByOpenId,
    setUserInfo: setUserInfo,
};