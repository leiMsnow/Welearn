const app = getApp();
const checkInBiz = require('../../biz/checkInBiz.js');
const util = require('../../utils/util.js');
let that;
Page({
    data: {
        hobby: {},
        checkInDays: {},
        note: [],
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
        that.getCheckInDays(hobby);
    },
    router: function (e) {
        let url = e.currentTarget.dataset.url;
        app.router(url, JSON.stringify(that.data.hobby));
    },
    checkIn: function (e) {
        let hobbyId = e.currentTarget.dataset.hobbyid;
        if (that.data.hobby.isCheckIn) {
            return;
        }
        that.data.checkInDays.hobbyInfo.checkInDays.unshift(util.formartTimestamp());
        let newContinuousDay = util.continueDays(that.data.checkInDays.hobbyInfo.checkInDays);
        checkInBiz.checkIn(hobbyId, function success(res) {
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
                data: hobbyId
            });
        });
    },
    getCheckInDays: function (hobby) {
        checkInBiz.getCheckInDaysById(hobby,
            function success(checkInDays) {
                that.setData({
                    checkInDays: checkInDays,
                });
            },
            function fail(error) {

            });
    }
});