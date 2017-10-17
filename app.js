//app.js
let Bmob = require('utils/bmob.js');
let decryptData = require('utils/decryptData.js');
Bmob.initialize("e39c13caed4c3461ed8042446bc6284f", "6d3d28b40129b56a9f14111e14d77b1f");

App({
  onLaunch: function () {
    wx.getShareInfo({
      withShareTicket: true,
      success: (res) => {
        let openGId = decryptData.decryptData(this.globalData.session_key, res.encryptedData, res.iv);
        let GroupInfo = Bmob.Object.extend('GroupInfo');
        let groupInfo = new GroupInfo();
        groupInfo.set('groupId', openGId);
        groupInfo.save(null, {
          success: (res) => {
            console.log("add groupInfo success: ");
          }, error: (res, error) => {
            console.log("add groupInfo  error: " + error.code + " " + error.message);
          }
        });
      }
    });
  },
  globalData: {
    userInfo: {
      'openId': 'oYmIJ0WrP-9rUOlqmtwqzG1txV1M',
      'nickName': '🍭张小雷',
      'avatarUrl': "https://wx.qlogo.cn/mmopen/vi_32/PiajxSqBRaEIBNZGSVMZ3vMmY9VeLibgt8xSSkic8ibczuibib5ngNbHVB4O1GerEjqZ9LJCCIPcKG0LaYLyYOdaic9bw/0",
    },
    Bmob: Bmob,
    session_key: '',
    appName: '养个好习惯'
  }
});