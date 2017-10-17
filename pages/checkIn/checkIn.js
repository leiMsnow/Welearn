const app = getApp();
const checkInBiz = require('../../biz/checkInBiz.js');

Page({
  data: {
    hobby: {},
    hobbyContinuousCount: 0,
    hobbyCheckInCount: 0,
    allCheckInCount: 0,
    nodeCount: 0,
  },
  onLoad: function (options) {
    console.log('options: ' + options.hobby);
    let hobby = JSON.parse(options.hobby);
    console.log('options: ' + hobby.hobbyName);
    this.setData({
      hobby: hobby,
    });
    wx.setNavigationBarTitle({
      title: hobby.hobbyName
    });
  },
  openStatistics: function () {
    wx.navigateTo({
      url: '../statistics/statistics',
    });
  },
  checkIn: function (e) {
    let that = this;
    let hobbyId = e.currentTarget.dataset.hobbyid;
    if (this.data.hobby.isCheckIn) {
      return;
    }
    checkInBiz.checkIn(hobbyId, function success(res) {
      that.data.hobby.isCheckIn = true;
      that.setData({
        hobby: that.data.hobby,
        hobbyContinuousCount: that.data.hobbyContinuousCount + 1,
        hobbyCheckInCount: that.data.hobbyCheckInCount + 1,
      });
    });
  },

});
