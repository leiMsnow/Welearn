const app = getApp();

Page({
  data: {
    emptyText: ' 这里什么也没有',
    hobbies: [],
  },
  onLoad: function () {
    this.getHobbies();
  },
  getHobbies: function () {
    var hobbies = app.globalData.Bmob.Object.extend("Hobbies");
    var query = new app.globalData.Bmob.Query(hobbies);
    query.find({
      success: (results) => {

        var filterHobbies = [];
        var hobbiesCategory = results.filter(function (category) {
          return category.get("categoryId") === 0;
        });
        hobbiesCategory.forEach(function (category) {
          var hobby = { id: "", name: "", open: false, hobbies: [] };
          hobby.id = category.get("hobbyId");
          hobby.name = category.get("name");
          results.forEach(function (result) {
            if (result.get("categoryId") === category.get("hobbyId")) {
              hobby.hobbies.push(result);
            }
          });
          filterHobbies.push(hobby);
        });

        this.setData({
          hobbies: filterHobbies
        });
      },
      error: function (result, error) {
        console.log("查询失败");
      }
    });
  }, backHome: function () {
    wx.switchTab({
      url: "../index/index",
    });
  },
  kindToggle: function (e) {
    var id = e.currentTarget.id;
    var list = this.data.hobbies;
    for (var i = 0, len = list.length; i < len; i++) {
      if (list[i].id == id) {
        list[i].open = !list[i].open;
      } else {
        list[i].open = false;
      }
    }
    this.setData({
      hobbies: list
    });
  },
  addHobby: function (e) {
    let hobby = e.currentTarget.dataset.hobby;
    wx.setStorage({
      key: "addHobby",
      data: hobby,
      success: (res) => {
        wx.switchTab({
          url: '../index/index',
        });
      }
    });
  }
})
