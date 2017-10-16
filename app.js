//app.js
var Bmob = require('utils/bmob.js');
Bmob.initialize("e39c13caed4c3461ed8042446bc6284f", "6d3d28b40129b56a9f14111e14d77b1f");

App({
  onLaunch: function () {
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || [];
    logs.unshift(Date.now());
    wx.setStorageSync('logs', logs);
  },
  globalData: {
    userInfo: {},
    Bmob: Bmob,
    session_key:'',
  }
});