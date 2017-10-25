const app = getApp();
const checkInBiz = require('../../biz/checkInBiz.js');
const util = require('../../utils/util.js');
const tabs = ['今日动态', '全部动态'];

let todayList = [];
let allList = [];

let currentPage = 0;
let that;

Page({
    data: {
        selectedTab: '0',
        tabs: tabs,
        noteList: todayList
    },
    onLoad: function() {
        that = this;
        that.getAllCheckIn();
    },
    switchTab: function(e) {
        let selectedTab = (e.currentTarget.id);
        if (selectedTab !== that.data.selectedTab) {
            that.setData({
                selectedTab: selectedTab,
                noteList: selectedTab === '0' ? todayList : allList,
            });
        }
    },
    onReachBottom: function() {
        if (that.data.selectedTab !== '0') {
            console.log('onReachBottom');
        }
    },
    previewImg: function(e) {
        var url = [];
        url.push(e.target.dataset.url);
        wx.previewImage({
            urls: url,
        });
    },
    getAllCheckIn: function() {
        checkInBiz.getAllCheckIn(currentPage,
            function success(list1, list2) {
                todayList = list1;
                allList = list2;
                currentPage++;
                that.setData({
                    noteList: that.data.selectedTab === '0' ? todayList : allList,
                });
            },
            function fail() {

            });
    }
});