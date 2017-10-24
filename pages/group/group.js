const app = getApp();
const util = require('../../utils/util.js');
const tabs = ['今日动态', '全部动态'];

let todayList = [{
  'nickName': app.globalData.userInfo.nickName,
  'avatarUrl': app.globalData.userInfo.avatarUrl,
  'hobbyName': '英语',
  'conDays': 5,
  'time': util.formatDay(),
  'noteUrl': 'http://bmob-cdn-14630.b0.upaiyun.com/2017/10/23/af8b694a404b33058072d91327e7f856.jpg'
},
{
  'nickName': app.globalData.userInfo.nickName,
  'avatarUrl': app.globalData.userInfo.avatarUrl,
  'hobbyName': '英语',
  'conDays': 5,
  'time': util.formatDay(),
  'noteUrl': 'http://bmob-cdn-14630.b0.upaiyun.com/2017/10/23/af8b694a404b33058072d91327e7f856.jpg',
  'noteContent': '打卡'
}
];

let allList = [{
  'nickName': app.globalData.userInfo.nickName,
  'avatarUrl': app.globalData.userInfo.avatarUrl,
  'hobbyName': '英语',
  'conDays': 5,
  'time': util.formatDay(),
  'noteUrl': 'http://bmob-cdn-14630.b0.upaiyun.com/2017/10/23/af8b694a404b33058072d91327e7f856.jpg'
},
{
  'nickName': app.globalData.userInfo.nickName,
  'avatarUrl': app.globalData.userInfo.avatarUrl,
  'hobbyName': '英语',
  'conDays': 5,
  'time': util.formatDay(),
  'noteUrl': 'http://bmob-cdn-14630.b0.upaiyun.com/2017/10/23/af8b694a404b33058072d91327e7f856.jpg',
  'noteContent': '打卡'
},
{
  'nickName': app.globalData.userInfo.nickName,
  'avatarUrl': app.globalData.userInfo.avatarUrl,
  'hobbyName': '英语',
  'conDays': 5,
  'time': util.formatDay(),
  'noteUrl': 'http://bmob-cdn-14630.b0.upaiyun.com/2017/10/23/af8b694a404b33058072d91327e7f856.jpg',
  'noteContent': '打卡'
}
];

Page({
  data: {
    selectedTab: '0',
    tabs: tabs,
    noteList: todayList
  },
  onLoad: function () {

  },
  switchTab: function (e) {
    let selectedTab = (e.currentTarget.id);
    if (selectedTab !== this.selectedTab) {
      this.setData({
        selectedTab: selectedTab,
        noteList: selectedTab === '0' ? todayList : allList,
      });
    }
  },
  onReachBottom: function () {
    if (selectedTab !== '0') {
      console.log('onReachBottom');
    }
  },
  previewImg: function (e) {
    var url = [];
    url.push(e.target.dataset.url);
    wx.previewImage({
      urls: url,
    });
  }
});
