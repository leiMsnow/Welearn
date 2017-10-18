const app = getApp();
const checkInBiz = require('../../biz/checkInBiz.js');
const util = require('../../utils/util.js');
let that;

Page({
    data: {
        hobby: {},
        checkInContinuousDays: 0,
        checkInAllDays: 0,
        allUserCheckInCount: 0,
        note: {},
    },
    onLoad: function (options) {
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
        that.getCheckInDays(hobby.hobbyId);
    },
    router: function (e) {
        let url = e.currentTarget.dataset.url;
        app.router(url);
    },
    checkIn: function (e) {
        let hobbyId = e.currentTarget.dataset.hobbyid;
        if (that.data.hobby.isCheckIn) {
            return;
        }
        checkInBiz.checkIn(hobbyId, function success(res) {
            that.data.hobby.isCheckIn = true;
            that.setData({
                hobby: that.data.hobby,
                checkInContinuousDays: that.data.checkInContinuousDays + 1,
                checkInAllDays: that.data.checkInAllDays + 1,
                allUserCheckInCount: that.data.allUserCheckInCount + 1,
            });
            wx.setStorage({
                key: 'newCheckIn',
                data: hobbyId
            });
        });
    },
    getCheckInDays: function (hobbyId) {
        checkInBiz.getCheckInDaysById(hobbyId,
            function success(checkInContinuousDays, checkInAllDays, allUserCheckInCount) {
                that.setData({
                    checkInContinuousDays: checkInContinuousDays,
                    checkInAllDays: checkInAllDays,
                    allUserCheckInCount: allUserCheckInCount
                });
            },
            function fail(error) {

            });
    }
});