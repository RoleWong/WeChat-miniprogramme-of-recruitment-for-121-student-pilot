Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabbarList: [{
        text: "招飞介绍",
        iconPath: "../../images/tabbar-icon/article.png",
        selectedIconPath: "../../images/tabbar-icon/article-active.png",
      },
      {
        text: "申请流程",
        iconPath: "../../images/tabbar-icon/apply.png",
        selectedIconPath: "../../images/tabbar-icon/apply-active.png",
      },
      {
        text: "自检工具",
        iconPath: "../../images/tabbar-icon/tools.png",
        selectedIconPath: "../../images/tabbar-icon/tools-active.png",
      }
    ]

  },

  // tabChange(e) {
  //   console.log('tab change', e.detail.index);
  //   if (e.detail.index == 1) {
  //     wx.switchTab({
  //       url: '../apply/apply',
  //     });
  //   }
  //   if (e.detail.index == 2) {
  //     wx.switchTab({
  //       url: '../tools/tools',
  //     });
  //   }
  // },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    if (typeof this.getTabBar === 'function' &&
      this.getTabBar()) {
      this.getTabBar().setData({
        selected: 0
      })
    }

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})