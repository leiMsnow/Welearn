//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    emptyText: ' 去[领养]一个好习惯吧',
    userInfo: app.globalData.userInfo,
    myHobbies: [],
  },
  onLoad: function () {

  },
  onShow: function () {
    let hobby = wx.getStorage({
      key: 'addHobby',
      success: (res) => {
        if (res) {
          this.addHobby(res);
          try {
            wx.removeStorageSync('addHobby');
          } catch (e) { }
        }
      },
    })
  },
  openHobbies: function () {
    wx.navigateTo({
      url: "../hobbies/hobbies",
    })
  },
  addHobby: function (hobby) {
    if (hobby) {
    }
  }
})
