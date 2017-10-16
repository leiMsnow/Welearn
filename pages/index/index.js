const app = getApp();
const util = require('../../utils/util');

Page({
    data: {
        myHobbies: [{
            'hobbyId': -1,
            'hobbyName': '添加新习惯',
        }],
    },
    onLoad: function() {
        this.getMyHobbiesForStorage();
    },
    onShow: function() {
        wx.getStorage({
            key: 'newHobby',
            success: (res) => {
                this.getMyHobbiesForStorage(true);
            }
        });
    },
    getMyHobbiesForStorage: function(del) {
        if (del) {
            wx.removeStorage({
                key: 'newHobby',
                success: function(res) {
                    console.log('newHobby - deleted');
                }
            });
        }
        wx.getStorage({
            key: 'myHobbies',
            success: (res) => {
                console.log('getMyHobbiesForStorage-count: ' + res.data.length);
                if (res.data && res.data.length > 0) {
                    this.getMyHobbies(res.data);
                }
            }
        });
    },
    openHobbies: function() {
        wx.navigateTo({
            url: "../hobbies/hobbies",
        });
    },
    getMyHobbies: function(hobbies) {
        if (hobbies.length > 0) {
            // 查询打卡信息
            let CheckIn = app.globalData.Bmob.Object.extend('CheckIn');
            let queryCheckIn = new app.globalData.Bmob.Query(CheckIn);
            queryCheckIn.equalTo('date', util.formatDay());
            queryCheckIn.equalTo('openId', app.globalData.userInfo.openId);
            queryCheckIn.find({
                success: (checkInResults) => {
                    console.log("queryCheckIn共查询到 " + checkInResults.length + " 条记录");
                    let newHobbies = []
                    newHobbies.push(this.data.myHobbies[this.data.myHobbies.length - 1]);
                    hobbies.forEach((item) => {
                        newHobbies.unshift({
                            "hobbyName": item.hobbyName,
                            "categoryId": item.categoryId,
                            'hobbyId': item.hobbyId,
                            'isCheckIn': this.findCheckIn(checkInResults, item.hobbyId)
                        });
                    });

                    this.setData({
                        myHobbies: newHobbies,
                    });

                },
                error: (error) => {
                    console.log("error: " + error.code + " " + error.message);
                }
            });
        }
    },
    openCheckIn: function(e) {
        let hobby = e.currentTarget.dataset.hobby;
        if (hobby.hobbyId === -1) return;
        wx.navigateTo({
            url: "../checkIn/checkIn?hobby=" + hobby,
        });
    },
    checkIn: function(e) {
        let hobbyId = e.currentTarget.dataset.hobbyid;
        if (this.myHobbiesCheckIn(hobbyId)) {
            wx.showToast({
                title: '已经打过卡了',
                icon: 'success',
                duration: 2000
            });
            return;
        }
        let CheckIn = app.globalData.Bmob.Object.extend('CheckIn');
        let myCheckIn = new CheckIn();
        myCheckIn.set("hobbyId", hobbyId);
        myCheckIn.set("openId", app.globalData.userInfo.openId);
        myCheckIn.set('isCheckIn', true);
        myCheckIn.set('date', util.formatDay());
        myCheckIn.save(null, {
            success: (result) => {
                wx.showToast({
                    title: '今天辛苦啦',
                    icon: 'success',
                    duration: 2000
                });

                for (var i = 0; i < this.data.myHobbies.length; i++) {
                    var item = this.data.myHobbies[i];
                    if (item.hobbyId === hobbyId) {
                        item.isCheckIn = true;
                        break;
                    }
                }

                this.setData({
                    myHobbies: this.data.myHobbies
                });
            },
            error: (result, error) => {
                console.log('打卡失败:' + error.code + " " + error.message);
            }
        });
    },
    myHobbiesCheckIn: function(hobbyId) {
        let i = this.data.myHobbies.length;
        while (i--) {
            if (this.data.myHobbies[i].hobbyId === hobbyId &&
                this.data.myHobbies[i].isCheckIn === true)
                return true;
        }
        return false;
    },
    findCheckIn: function(checkInResults, hobbyId) {
        let j = checkInResults.length;
        while (j--) {
            if (checkInResults[j].get('hobbyId') === hobbyId)
                return true;
        }
        return false;
    }
});