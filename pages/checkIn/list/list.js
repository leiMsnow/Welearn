const app = getApp();
const checkInBiz = require('../../../biz/checkInBiz.js');
let that;
Page({
  data: {
    userList: [],
    myInfo: {},
  },
  onLoad: function (options) {
    that = this;
    console.log('params: ' + options.params);
    let hobby = JSON.parse(options.params);
    wx.setNavigationBarTitle({
      title: hobby.hobbyName + '-完成人数'
    });

    checkInBiz.getTodayCheckIn(hobby.hobbyId, function success(results) {
      let userInfo = results.find(openId => openId === app.globalData.userInfo.openId);
      that.setData({
        userList: results,
        myInfo: userInfo,
      });
    });
  }
});
