const app = getApp();
const util = require('../../../utils/util.js');
const checkInBiz = require('../../../biz/checkInBiz.js');

let note = {
    'content': '',
    'image': '',
};
let that;
Page({
    data: {
        hobby: {},
        image: '',
    },
    onLoad: function (options) {
        that = this;
        wx.setNavigationBarTitle({
            title: '新增记录'
        });
        let hobby = JSON.parse(options.params);
        note.hobbyId = hobby.hobbyId;
        note.hobbyName = hobby.hobbyName;
        that.setData({
            hobby: hobby,
        });
    },
    bindSubmit: function (e) {
        let content = e.detail.value.content;
        note.content = content;
        if (that.data.image) {
            checkInBiz.uploadFile(that.data.image,
                function success(url) {
                    note.image = url;
                    checkInBiz.checkIn(that.data.hobby, note,
                        function success() {
                            that.data.hobby.isCheckIn = true;
                            wx.navigateBack();
                        });
                });
        } else {
            wx.showToast({
                title: '选一张照片吧',
                icon: 'success',
                duration: 2000
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
                that.setData({
                    image: res.tempFilePaths,
                });
            }
        });
    }
});