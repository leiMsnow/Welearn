const app = getApp();
const util = require('../../../utils/util.js');

Page({
  data: {
    hobby: {},
    imageList: [],
    image: ''
  },
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: '新增记录'
    });
    let hobby = JSON.parse(options.params);
    this.setData({
      hobby: hobby,
    });
  },
  bindSubmit: function (e) {
    let content = e.detail.value.content;
    if (util.isEmpty(content)) {
      wx.showToast({
        title: '写点什么吧',
        icon: 'success',
        duration: 2000,
      });
    }
  },
  chooseImage: function () {
    wx.chooseImage({
      count: 1, // 默认9
      sizeType: ['compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: (res) => {
        console.log('chooseImage: ' + res.tempFilePaths);
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        let tempFilePaths = [];
        tempFilePaths.push(res.tempFilePaths);
        this.setData({
          imageList: tempFilePaths,
          image: res.tempFilePaths,
        });
      }
    });
  }
});
