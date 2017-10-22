const app = getApp();
let hobbyBiz = require('../../biz/hobbyBiz.js');
let that;
Page({
    data: {
        emptyText: ' 这里什么也没有',
        allHobbies: [],
    },
    onLoad: function() {
        that = this;
        that.myHobbies = [];
        wx.getStorage({
            key: 'myHobbies',
            success: (res) => {
                console.log("getStorage-myHobbies-count: " + res.data.length);
                if (!res.data || res.data.length === 0) {
                    that.getMyHobbies();
                } else {
                    that.myHobbies = res.data;
                    that.getHobbies();
                }
            },
            fail: (error) => {
                console.log('getStorage-myHobbies-error: ' + error.errMsg);
                that.getMyHobbies();
            }
        });
    },
    backHome: function() {
        app.routerTab();
    },
    getHobbies: function() {
        hobbyBiz.getHobbies(function success(results) {
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
                            'added': that.isAdded(result.get('hobbyId')),
                            'item': result
                        });
                    }
                });
                filterHobbies.push(hobby);
            });

            that.setData({
                allHobbies: filterHobbies
            });
        });
    },
    kindToggle: function(e) {
        var id = e.currentTarget.id;
        var list = that.data.allHobbies;
        for (var i = 0, len = list.length; i < len; i++) {
            if (list[i].id == id) {
                list[i].open = !list[i].open;
            } else {
                list[i].open = false;
            }
        }
        that.setData({
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
        hobbyBiz.addHobby(item, function success(result) {
            that.myHobbies.push(result);
            that.saveMyHobbies(function callback() {
                that.saveNewHobbyState(function callback() {
                    app.routerTab();
                });
            });
        });
    },
    saveNewHobbyState: function(callback) {
        wx.setStorage({
            key: "newHobby",
            data: "newHobby",
            success: () => {
                if (callback)
                    callback();
            }
        });
    },
    saveMyHobbies: function(callback) {
        wx.setStorage({
            key: "myHobbies",
            data: that.myHobbies,
            success: (res) => {
                if (callback) {
                    callback();
                }
            }
        });
    },
    getMyHobbies: function() {
        hobbyBiz.getMyHobbies(function success(results) {
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
                        that.myHobbies = (res.data);
                        that.getHobbies();
                    }
                });
                that.saveNewHobbyState();
            } else {
                that.getHobbies();
            }
        }, function fail() {
            that.getHobbies();
        });
    },
    isAdded: function(hobbyId) {
        let i = that.myHobbies.length;
        while (i--) {
            if (that.myHobbies[i].hobbyId === hobbyId) {
                return 'ed';
            }
        }
        return '';
    }
});