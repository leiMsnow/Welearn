const app = getApp();
const util = require('../../utils/util');
Page({
  data: {
    myHobbies: [
      {
        'hobbyId': -1,
        'hobbyName': '添加新习惯',
      }
    ],
  },
  onLoad: function () {
    this.getMyHobbiesForStorage();
  },
  onShow: function () {
    wx.getStorage({
      key: 'newHobby',
      success: (res) => {
        this.getMyHobbiesForStorage(true);
      }
    });
  }, getMyHobbiesForStorage: function (del) {
    wx.getStorage({
      key: 'myHobbies',
      success: (res) => {
        if (res.data) {
          console.log('getMyHobbiesForStorage: ' + res.data);
          this.getMyHobbies(res.data);
          if (del) {
            wx.removeStorage({
              key: 'newHobby',
              success: function (res) {
                console.log('newHobby - deleted');
              }
            });
          }
        }
      }
    });
  },
  openHobbies: function () {
    wx.navigateTo({
      url: "../hobbies/hobbies",
    });
  },
  getMyHobbies: function (hobbies) {
    // 查询习惯信息
    // let UserHobbies = app.globalData.Bmob.Object.extend('UserHobbies');
    // let query = new app.globalData.Bmob.Query(UserHobbies);
    // query.equalTo('openId', app.globalData.userInfo.openId);
    // query.find({
    // success: (results) => {
    // console.log("getMyHobbies共查询到 " + results.length + " 条记录");
    if (hobbies.length > 0) {
      // 查询打卡信息
      let CheckIn = app.globalData.Bmob.Object.extend('CheckIn');
      let queryCheckIn = new app.globalData.Bmob.Query(CheckIn);
      queryCheckIn.equalTo('date', util.formatDay());
      queryCheckIn.equalTo('openId', app.globalData.userInfo.openId);
      queryCheckIn.find({
        success: (checkInResults) => {
          console.log("queryCheckIn共查询到 " + checkInResults.length + " 条记录");
          hobbies.forEach((item) => {
            this.data.myHobbies.unshift({
              "hobbyName": item.hobbyName,
              "categoryId": item.categoryId,
              'hobbyId': item.hobbyId,
              'isCheckIn': this.findCheckIn(checkInResults, item.hobbyId)
            });
          });

          this.setData({
            myHobbies: this.data.myHobbies,
          });

        }, error: (error) => {
          console.log("error: " + error.code + " " + error.message);
        }
      });
    }
    //   },
    //   error: (error) => {
    //     console.log("error: " + error.code + " " + error.message);
    //   }
    // });
  },
  openCheckIn: function (e) {
    let hobby = e.currentTarget.dataset.hobby;
    if (hobby.hobbyId === -1) return;
    wx.navigateTo({
      url: "../checkIn/checkIn?hobby=" + hobby,
    });
  },
  checkIn: function (e) {
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
      }, error: (result, error) => {
        console.log('打卡失败:' + error.code + " " + error.message);
      }
    });
  },
  myHobbiesCheckIn: function (hobbyId) {
    let i = this.data.myHobbies.length;
    while (i--) {
      if (this.data.myHobbies[i].hobbyId === hobbyId &&
        this.data.myHobbies[i].isCheckIn === true)
        return true;
    }
    return false;
  },
  findCheckIn: function (checkInResults, hobbyId) {
    let j = checkInResults.length;
    while (j--) {
      if (checkInResults[j].hobbyId === hobbyId)
        return true;
    }
    return false;
  }
});
