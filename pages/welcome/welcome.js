//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    motto: '今天也要自律',
    userInfo: {},
    hasLogin: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },
  //事件处理函数
  bindViewTap: function () {
    wx.switchTab({
      url: '../index/index'
    })
  },
  onLoad: function () {
    wx.getUserInfo({
      success: res => {
        app.globalData.userInfo = res.userInfo;
        this.setData({
          userInfo: res.userInfo,
          hasLogin: true
        })
        this.saveUserInfo(res.encryptedData);
      }
    })
  },
  saveUserInfo: function (encryptedData) {
    let userInfo = encryptedData;
    let User = app.globalData.Bmob.Object.extend("_User");
    let user = new User();
    user.save({
      "username": userInfo.nickName,
      "avatarUrl": userInfo.avatarUr,
      //性别 0：未知、1：男、2：女
      "gender": userInfo.gender,
      "province": userInfo.province,
      "city": userInfo.city,
      "country": userInfo.country
    }, {
        success: function (result) {
          console.log("创建成功, objectId:" + result.id);
        },
        error: function (result, error) {
          console.log('创建失败');
        }
      });
  }
})
