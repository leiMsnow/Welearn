//logs.js

const tabs = ['我的小组', '全部小组'];
Page({
  data: {
    selectedTab: tabs[0],
    tabs: tabs
  },
  onLoad: function () {

  },
  switchTab: function (e) {
    let selectedTab = (e.currentTarget.id);
    this.setData({
      selectedTab: selectedTab,
    });
  }
});
