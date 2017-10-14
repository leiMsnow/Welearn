//index.js
//获取应用实例
const app = getApp();

Page({
  data: {
    emptyText: ' 去[领养]一个好习惯吧',
    userInfo: app.globalData.userInfo,
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
      myHobby.set('openid', app.globalData.openid);
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
    let UserHobbies = app.globalData.Bmob.Object.extend('UserHobbies');
    let query = new app.globalData.Bmob.Query(UserHobbies);
    query.equalTo('openid', app.globalData.openid);
    query.find({
      success: (results) => {
        console.log("getMyHobbies共查询到 " + results.length + " 条记录");
        if (results.length > 0) {
          results.forEach((item) => {
            this.hobbies.push({
              "hobbyName": item.get("hobbyName"),
              "categoryId": item.get('categoryId'),
              'hobbyId': item.get('hobbyId')
            });
          });
          this.setData({
            myHobbies: this.hobbies,
          });
        }
      },
      error: (error) => {
        console.log("error: " + error.code + " " + error.message);
      }
    });
  }

});
