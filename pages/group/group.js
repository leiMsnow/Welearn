const app = getApp();

const tabs = ['今日动态', '全部动态'];

Page({
  data: {
    selectedTab: '0',
    tabs: tabs
  },
  onLoad: function () {

  },
  switchTab: function (e) {
    let selectedTab = (e.currentTarget.id);
    if (selectedTab !== this.selectedTab) {
      this.setData({
        selectedTab: selectedTab,
      });


    }
  },
  onReachBottom: function () {
    console.log('onReachBottom');
  }
});
