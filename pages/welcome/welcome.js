//index.js
//获取应用实例
const app = getApp();

Page({
  data: {
    motto: '去养个好习惯',
    userInfo: {},
    hasLogin: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo')
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
                  this.saveUserInfo(result.userInfo, userData.openid);
                }
              });
            }
          });
        } else {
          console.log('获取用户登录态失败！' + res.errMsg)
        }
      },
      error: function (error) {
        console.log("登录error: " + error.code + " " + error.message);
      }
    });
  },
  saveUserInfo: function (userInfo, openid) {
    app.globalData.userInfo = userInfo;
    this.setData({
      userInfo: userInfo,
      hasLogin: true
    });
    this.uploadUserInfo(userInfo, openid);
  },
  uploadUserInfo: function (userInfo, openid) {
    var User = app.globalData.Bmob.Object.extend("UserInfo");
    var user = new app.globalData.Bmob.Query(User);
    user.equalTo('openid', openid);
    user.find({
      success: (results) => {
        if (results.length > 0) {
          let result = results[0];
          result.set("nickName", userInfo.avatarUrl);
          result.set("avatarUrl", userInfo.avatarUrl);
          result.set("gender", userInfo.gender);
          result.set("province", userInfo.province);
          result.set("city", userInfo.city);
          result.set("country", userInfo.country);
          result.save(null, {
            success: function (result) {
              console.log("更新成功, nickName:" + result.nickName);
            }, error: function (result, error) {
              console.log('更新失败：' + error.message);
            }
          });
        } else {
          user = new User();
          user.save({
            "username": userInfo.nickName,
            "nickName": userInfo.nickName,
            "avatarUrl": userInfo.avatarUr,
            //性别 0：未知、1：男、2：女
            "gender": userInfo.gender,
            "province": userInfo.province,
            "city": userInfo.city,
            "country": userInfo.country,
            "openid": openid,
          },
            {
              success: function (result) {
                console.log("创建成功, openid:" + result.openid);
              },
              error: function (result, error) {
                console.log('创建失败：' + error.message);
              }
            });
        }
      }, error: (error) => {
        console.log("error " + error);
      }
    });
  }
});
