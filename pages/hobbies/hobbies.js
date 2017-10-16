const app = getApp();

Page({
    data: {
        emptyText: ' 这里什么也没有',
        allHobbies: [],
    },
    onLoad: function() {
        this.myHobbies = [];
        wx.getStorage({
            key: 'myHobbies',
            success: (res) => {
                console.log("getStorage-myHobbies" + res.data);
                if (!res.data || res.data.length === 0) {
                    this.getMyHobbies();
                } else {
                    this.myHobbies = res.data;
                    this.getAllHobbies();
                }
            },
            fail: (error) => {
                console.log('getStorage-myHobbies-error: ' + error.errMsg);
                this.getMyHobbies();
            }
        });
    },
    getAllHobbies: function() {
        var hobbies = app.globalData.Bmob.Object.extend("Hobbies");
        var query = new app.globalData.Bmob.Query(hobbies);
        query.equalTo('isEnable', true);
        query.find({
            success: (results) => {
                var filterHobbies = [];
                var hobbiesCategory = results.filter((category) => {
                    return category.get("categoryId") === 0;
                });
                hobbiesCategory.forEach((category) => {
                    var hobby = { id: "", name: "", open: false, hobbies: [] };
                    hobby.id = category.get("hobbyId");
                    hobby.name = category.get("name");
                    results.forEach((result) => {
                        if (result.get("categoryId") === category.get("hobbyId")) {
                            hobby.hobbies.push({
                                'added': this.isAdded(result.get('hobbyId')),
                                'item': result
                            });
                        }
                    });
                    filterHobbies.push(hobby);
                });

                this.setData({
                    allHobbies: filterHobbies
                });
            },
            error: function(result, error) {
                console.log("查询失败");
            }
        });
    },
    backHome: function() {
        wx.switchTab({
            url: "../index/index",
        });
    },
    kindToggle: function(e) {
        var id = e.currentTarget.id;
        var list = this.data.allHobbies;
        for (var i = 0, len = list.length; i < len; i++) {
            if (list[i].id == id) {
                list[i].open = !list[i].open;
            } else {
                list[i].open = false;
            }
        }
        this.setData({
            allHobbies: list
        });
    },
    addHobby: function(e) {
        let hobby = e.currentTarget.dataset.hobby;
        let added = hobby.added;
        if (added === 'ed') {
            return;
        }
        let item = hobby.item;
        let UserHobbies = app.globalData.Bmob.Object.extend('UserHobbies');
        let myHobby = new UserHobbies();
        myHobby.set('openId', app.globalData.userInfo.openId);
        myHobby.set('hobbyName', item.name);
        myHobby.set('hobbyId', item.hobbyId);
        myHobby.set('categoryId', item.categoryId);
        myHobby.save(null, {
            success: (result) => {
                console.log("addHobby - 添加成功");
                this.myHobbies.push(result);
                wx.setStorage({
                    key: "myHobbies",
                    data: this.myHobbies,
                    success: (res) => {
                        wx.setStorage({
                            key: "newHobby",
                            data: "newHobby",
                            success: () => {
                                wx.switchTab({
                                    url: '../index/index',
                                });
                            }
                        });
                    }
                });
            },
            error: (result, error) => {
                console.log("error: " + error.code + " " + error.message);
            }
        });
    },
    getMyHobbies: function() {
        // 查询习惯信息
        let UserHobbies = app.globalData.Bmob.Object.extend('UserHobbies');
        let query = new app.globalData.Bmob.Query(UserHobbies);
        query.equalTo('openId', app.globalData.userInfo.openId);
        query.find({
            success: (results) => {
                console.log("getMyHobbies-count: " + results.length);
                if (results.length > 0) {
                    wx.setStorage({
                        key: "myHobbies",
                        data: results,
                        success: (res) => {
                            console.log("setStorage-myHobbies-success");
                        }
                    });

                    wx.getStorage({
                        key: "myHobbies",
                        success: (res) => {
                            console.log("getStorage-myHobbies-success");
                            this.myHobbies = (res.data);
                            this.getAllHobbies();
                        }
                    });

                }
            },
            error: (error) => {
                console.log("error: " + error.code + " " + error.message);
                this.getAllHobbies();
            }
        });
    },
    isAdded: function(hobbyId) {
        let i = this.myHobbies.length;
        while (i--) {
            if (this.myHobbies[i].hobbyId === hobbyId) {
                return 'ed';
            }
        }
        return '';
    }
});