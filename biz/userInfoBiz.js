const app = getApp();
const util = require('../utils/util.js');

// 查询openId
let requestOpenId = (code, success, error) => {
    app.globalData.Bmob.User.requestOpenId(code, {
        success: (userData) => {
            console.log("requestOpenId:" + userData.openid);
            success(userData);
        }
    });
};

// 根据openId查找用户
let findUserByOpenId = (openId, success, error) => {
    console.log("uploadUserInfo：" + openId);
    let User = app.globalData.Bmob.Object.extend("UserInfo");
    let user = new app.globalData.Bmob.Query(User);
    user.equalTo('openId', openId);
    user.find({
        success: (results) => {
            console.log("findUserByOpenId: " + results.length);
            success(results);
        }, error: (error) => {
            console.log("error " + error.message);
            error(error);
        }
    });
};

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
            console.log("设置成功, nickName:" + userInfo.nickName);
        }, error: (result, error) => {
            console.log('设置失败：' + error.message);
        }
    });
};

module.exports = {
    requestOpenId: requestOpenId,
    findUserByOpenId: findUserByOpenId,
    setUserInfo: setUserInfo,
};
