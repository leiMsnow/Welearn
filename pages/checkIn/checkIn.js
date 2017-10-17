const app = getApp();
const checkInBiz = require('../../biz/checkInBiz.js');
let that;

Page({
    data: {
        hobby: {},
        hobbyContinuousCount: 0,
        hobbyCheckInCount: 0,
        allCheckInCount: 0,
        nodeCount: 0,
    },
    onLoad: function(options) {
        that = this;
        console.log('options: ' + options.hobby);
        let hobby = JSON.parse(options.hobby);
        console.log('options: ' + hobby.hobbyName);
        that.setData({
            hobby: hobby,
        });
        wx.setNavigationBarTitle({
            title: hobby.hobbyName
        });
    },
    openStatistics: function() {
        wx.navigateTo({
            url: '../statistics/statistics',
        });
    },
    checkIn: function(e) {
        let hobbyId = e.currentTarget.dataset.hobbyid;
        if (that.data.hobby.isCheckIn) {
            return;
        }
        checkInBiz.checkIn(hobbyId, function success(res) {
            that.data.hobby.isCheckIn = true;
            that.setData({
                hobby: that.data.hobby,
                hobbyContinuousCount: that.data.hobbyContinuousCount + 1,
                hobbyCheckInCount: that.data.hobbyCheckInCount + 1,
            });
            wx.setStorage({
                key: 'newCheckIn',
                data: hobbyId
            });
        });
    },

});