const app = getApp();
const util = require('../../utils/util');
const checkInBiz = require('../../biz/checkInBiz.js');
let that;
Page({
    data: {
        myHobbies: [{
            'hobbyId': -1,
            'hobbyName': '新增计划',
        }],
    },
    onShareAppMessage: function (options) {
        console.log('onShareAppMessage-from: ' + options.from);
        return {
            title: app.globalData.appName,
            path: "pages/welcome/welcome",
            success: (res) => { },
            fail: (error) => { }
        };
    },
    onLoad: function () {
        that = this;
        wx.showShareMenu({
            withShareTicket: true
        });
        that.getMyHobbiesForStorage(false);
    },
    onShow: function () {
        wx.getStorage({
            key: 'newHobby',
            success: (res) => {
                console.log('getStorage-newHobby-success: ' + res.data);
                that.getMyHobbiesForStorage(true);
            }
        });
        wx.getStorage({
            key: 'newCheckIn',
            success: (res) => {
                console.log('newCheckIn-success-data: ' + res.data);
                that.updateCheckIn(res.data);
            }
        });
    },
    updateCheckIn: function (hobbyId) {
        wx.removeStorage({
            key: 'newCheckIn',
            success: function (res) {
                console.log('newCheckIn-deleted');
            }
        });
        if (hobbyId) {
            for (let i = 0; i < that.data.myHobbies.length; i++) {
                let hobby = that.data.myHobbies[i];
                if (hobby.hobbyId === hobbyId) {
                    hobby.isCheckIn = true;
                    break;
                }
            }
            that.setData({
                myHobbies: that.data.myHobbies
            });
        }
    },
    getMyHobbiesForStorage: function (del) {
        if (del) {
            wx.removeStorage({
                key: 'newHobby',
                success: function (res) {
                    console.log('newHobby-deleted');
                }
            });
        }
        wx.getStorage({
            key: 'myHobbies',
            success: (res) => {
                console.log('getMyHobbiesForStorage-count: ' + res.data.length);
                if (res.data && res.data.length > 0) {
                    that.getMyHobbies(res.data);
                }
            }
        });
    },
    openCheckIn: function (e) {
        console.log('openCheckIn');        
        let hobby = e.currentTarget.dataset.hobby;
        if (hobby.hobbyId === -1) return;
        app.router("../checkIn/checkIn?params=" + JSON.stringify(hobby));
    },
    openHobbies: function () {
        app.router('../hobbies/hobbies');
    },
    getMyHobbies: function (hobbies) {
        if (hobbies.length > 0) {
            checkInBiz.getMyHobbiesCheckIn(function success(checkInResults) {
                let newHobbies = [];
                newHobbies.push(that.data.myHobbies[that.data.myHobbies.length - 1]);
                hobbies.forEach((item) => {
                    newHobbies.unshift({
                        "hobbyName": item.hobbyName,
                        "categoryId": item.categoryId,
                        'hobbyId': item.hobbyId,
                        'isCheckIn': that.findCheckIn(checkInResults, item.hobbyId)
                    });
                });
                that.setData({
                    myHobbies: newHobbies,
                });
            });
        }
    },
    checkIn: function (e) {
        console.log('checkIn');
        let hobbyId = e.currentTarget.dataset.hobbyid;
        if (that.isCheckIn(hobbyId)) {
            return;
        }
        checkInBiz.checkIn(hobbyId, function success(res) {
            for (var i = 0; i < that.data.myHobbies.length; i++) {
                var item = that.data.myHobbies[i];
                if (item.hobbyId === hobbyId) {
                    item.isCheckIn = true;
                    break;
                }
            }
            that.setData({
                myHobbies: that.data.myHobbies
            });
        });
    },
    isCheckIn: function (hobbyId) {
        let i = that.data.myHobbies.length;
        while (i--) {
            if (that.data.myHobbies[i].hobbyId === hobbyId &&
                that.data.myHobbies[i].isCheckIn === true)
                return true;
        }
        return false;
    },
    findCheckIn: function (checkInResults, hobbyId) {
        let j = checkInResults.length;
        while (j--) {
            if (checkInResults[j].get('hobbyId') === hobbyId)
                return true;
        }
        return false;
    }
});