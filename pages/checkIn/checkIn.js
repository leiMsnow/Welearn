const app = getApp();
const checkInBiz = require('../../biz/checkInBiz.js');
const util = require('../../utils/util.js');
let that;

Page({
    data: {
        hobby: {},
        checkInDays: {},
    },
    onLoad: function (options) {
        that = this;
        console.log('options: ' + options.params);
        let hobby = JSON.parse(options.params);
        that.setData({
            hobby: hobby,
        });
        wx.setNavigationBarTitle({
            title: hobby.hobbyName
        });
    },
    onShow: function () {
        console.log('onShow: ' + that.data.hobby.hobbyName);
        that.getCheckInDays(that.data.hobby);
    },
    router: function (e) {
        let url = e.currentTarget.dataset.url;
        app.router(url, that.data.hobby);
    },
    checkIn: function (e) {
        if (that.data.hobby.isCheckIn) {
            return;
        }
        checkInBiz.checkIn(that.data.hobby, null,
            function success(res) {
                that.data.checkInDays.hobbyInfo.myCheckInDays.unshift(util.formartTimestamp());
                let newContinuousDay = util.continueDays(that.data.checkInDays.hobbyInfo.myCheckInDays);
                that.data.hobby.isCheckIn = true;
                that.data.checkInDays.checkInContinuousDays.count = newContinuousDay;
                that.data.checkInDays.checkInAllDays.count++;
                that.data.checkInDays.allUserTodayCheckInCount.count++;
                that.setData({
                    hobby: that.data.hobby,
                    checkInDays: that.data.checkInDays,
                });
                wx.setStorage({
                    key: 'newCheckIn',
                    data: that.data.hobby.hobbyId
                });
            });
    },
    getCheckInDays: function (hobby) {
        checkInBiz.getCheckInDaysById(hobby,
            function success(checkInDays) {
                checkInDays.hobbyInfo.myCheckInDays.forEach(item => {
                    if (item === util.formartTimestamp()) {
                        that.data.hobby.isCheckIn = true;
                        wx.setStorage({
                            key: 'newCheckIn',
                            data: hobby.hobbyId
                        });
                    }
                });
                that.setData({
                    checkInDays: checkInDays,
                    hobby: that.data.hobby,
                });
            },
            function fail(error) {

            });
    }
});