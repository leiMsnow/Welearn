const app = getApp();

let that;
Page({
  data: {
    bg:'http://bmob-cdn-14630.b0.upaiyun.com/2017/10/23/3fbf44be40b27c21801f85327c9a7a66.jpg',
    userInfo: app.globalData.userInfo,
    myHobbies:[
      {
        'title':'习惯',
        'count':'0个'
      },
      {
        'title':'坚持',
        'count':'0天'
      },
      {
        'title':'照片',
        'count':'0张'
      }
    ]
  },
  onLoad: function () {
    that = this;
    wx.setNavigationBarTitle({
      title: '我的信息'
    });
  }
});
