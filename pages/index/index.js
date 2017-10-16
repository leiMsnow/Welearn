const app = getApp();
const util = require('../../utils/util');
Page({
  data: {
    emptyText: ' 去[领养]一个好习惯吧',
    myHobbies: [],
  },
  onLoad: function () {
    this.hobbies = [];
    this.getMyHobbies();
  },
  onShow: function () {
    let hobby = wx.getStorage({
      key: 'addHobby',
      success: (res) => {
        if (res) {
          this.addHobby(res);
        }
      },
    });
  },
  openHobbies: function () {
    wx.navigateTo({
      url: "../hobbies/hobbies?myHobbies=" + this.data.myHobbies,
    });
  },
  addHobby: function (hobby) {
    if (hobby) {
      let UserHobbies = app.globalData.Bmob.Object.extend('UserHobbies');
      let myHobby = new UserHobbies();
      myHobby.set('openId', app.globalData.userInfo.openId);
      myHobby.set('hobbyName', hobby.data.name);
      myHobby.set('hobbyId', hobby.data.hobbyId);
      myHobby.set('categoryId', hobby.data.categoryId);
      myHobby.save(null, {
        success: (result) => {
          console.log("添加成功");
          this.hobbies.push(result);
          this.setData({
            myHobbies: this.hobbies,
          });
          try {
            wx.removeStorageSync('addHobby');
          } catch (e) { }
        },
        error: (result, error) => {
          console.log("error: " + error.code + " " + error.message);
        }
      });
    }
  },
  getMyHobbies: function () {
    // 查询习惯信息
    let UserHobbies = app.globalData.Bmob.Object.extend('UserHobbies');
    let query = new app.globalData.Bmob.Query(UserHobbies);
    query.equalTo('openId', app.globalData.userInfo.openId);
    query.find({
      success: (results) => {
        console.log("getMyHobbies共查询到 " + results.length + " 条记录");
        if (results.length > 0) {
          // 查询打卡信息
          let CheckIn = app.globalData.Bmob.Object.extend('CheckIn');
          let queryCheckIn = new app.globalData.Bmob.Query(CheckIn);
          queryCheckIn.equalTo('date', util.formatDay());
          queryCheckIn.equalTo('openId', app.globalData.userInfo.openId);
          queryCheckIn.find({
            success: (checkInResults) => {
              console.log("queryCheckIn共查询到 " + checkInResults.length + " 条记录");

              results.forEach((item) => {
                this.hobbies.push({
                  "hobbyName": item.get("hobbyName"),
                  "categoryId": item.get('categoryId'),
                  'hobbyId': item.get('hobbyId'),
                  'isCheckIn': this.findCheckIn(checkInResults, item.get('hobbyId'))
                });
              });

              this.setData({
                myHobbies: this.hobbies,
              });

            }, error: (error) => {
              console.log("error: " + error.code + " " + error.message);
            }
          });

        }
      },
      error: (error) => {
        console.log("error: " + error.code + " " + error.message);
      }
    });
  },
  openCheckIn: function (e) {
    let hobby = e.currentTarget.dataset.hobby;
    wx.navigateTo({
      url: "../checkIn/checkIn?hobby=" + hobby,
    });
  }, checkIn: function (e) {
    let hobbyId = e.currentTarget.dataset.hobbyid;
    if (this.myHobbiesCheckIn(hobbyId)) {
      wx.showToast({
        title: '已经打过卡了',
        icon: 'success',
        duration: 2000
      });
      console.log('已经打过卡了');
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
      if (checkInResults[j].get('hobbyId') === hobbyId)
        return true;
    }
    return false;
  }
});
