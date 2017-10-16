const app = getApp();
const util = require('../../utils/util.js');
const decryptData = require('../../utils/decryptData.js');

Page({
  data: {
    motto: '养个好习惯',
    userInfo: {},
    hasLogin: false,
    welcome: util.welcome(),
  },
  //事件处理函数
  bindViewTap: function () {
    wx.switchTab({
      url: '../index/index'
    });
  },
  onLoad: function () {
    this.login();
  },
  login: function () {
    wx.login({
      success: (res) => {
        if (res.code) {
          app.globalData.Bmob.User.requestOpenId(res.code, {
            success: (userData) => {
              wx.getUserInfo({
                success: (result) => {
                  let newUser = decryptData.decryptData(userData.session_key, result.encryptedData, result.iv);   
                  this.saveUserInfo(newUser, userData.session_key);
                }
              });
            }
          });
        } else {
          console.log('获取用户登录态失败！' + res.errMsg);
        }
      },
      error: function (error) {
        console.log("登录error: " + error.code + " " + error.message);
      }
    });
  },
  saveUserInfo: function (userInfo, session_key) {
    app.globalData.userInfo = userInfo;
    app.globalData.session_key = session_key;
    this.setData({
      userInfo: userInfo,
      hasLogin: true
    });
    //this.uploadUserInfo(userInfo);
  },
  uploadUserInfo: function (userInfo) {
    var User = app.globalData.Bmob.Object.extend("UserInfo");
    var user = new app.globalData.Bmob.Query(User);
    user.equalTo('openId', userInfo.openId);
    user.find({
      success: (results) => {
        if (results.length > 0) {
          // let result = results[0];
          // result.set("nickName", userInfo.nickName);
          // result.set("avatarUrl", userInfo.avatarUrl);
          // result.set("gender", userInfo.gender);
          // result.set("province", userInfo.province);
          // result.set("city", userInfo.city);
          // result.set("country", userInfo.country);
          // result.set("language", userInfo.language);
          // result.save(null, {
          //   success: (result) => {
          //     console.log("更新成功, nickName:" + result.get("nickName"));
          //   }, error: (result, error) => {
          //     console.log('更新失败：' + error.message);
          //   }
          // });
        } else {
          user = new User();
          user.save({
            "nickName": userInfo.nickName,
            "avatarUrl": userInfo.avatarUr,
            //性别 0：未知、1：男、2：女
            "gender": userInfo.gender,
            "province": userInfo.province,
            "city": userInfo.city,
            "country": userInfo.country,
            "language": userInfo.language,
            "openId": userInfo.openId,
          },
            {
              success: function (result) {
                console.log("创建成功, openId:" + result.get("openId"));
              },
              error: function (result, error) {
                console.log('创建失败：' + error.message);
              }
            });
        }
      }, error: (error) => {
        console.log("error " + error.message);
      }
    });
  }
});
