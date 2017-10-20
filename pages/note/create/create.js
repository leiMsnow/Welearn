const app = getApp();
Page({
  data: {
    hobby: {},
  },
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: '新增记录'
    });
    let hobby = JSON.parse(options.params);    
    this.setData({
      hobby: hobby,
    });
  }
});
