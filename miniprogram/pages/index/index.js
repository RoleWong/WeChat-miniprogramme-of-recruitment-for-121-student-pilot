var app = getApp();

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
    ],
    welcome:'您好'

  },
  onTapSwiper:function(e){
    console.log(e.currentTarget.dataset.index)

  },
  onLoad: function(options) {
    let date = new Date();
    let hours = date.getHours()
    console.log(hours)
    if(hours<7 || hours>18){
      this.setData({
        welcome:'晚上好'
      })
    }else if(hours < 12){
      this.setData({
        welcome: '早上好'
      })
    } else if (hours < 19) {
      this.setData({
        welcome: '下午好'
      })
    }else{
      this.setData({
        welcome: '晚上好'
      })
    }
  },

  onShowWeb(e){
    console.log(e.currentTarget.dataset.content)
    let type = e.currentTarget.dataset.content
    if(type==='jianzhang'){
      app.globalData.webURL = "http://mp.weixin.qq.com/s?__biz=MzI0MTM1OTg4Mw==&mid=100000152&idx=1&sn=88a3e260a51103301c7f2676a1deaae2&chksm=690d8cfc5e7a05ea988b272e1f28a3c013d31e06d1338d38e1f5d0fb0e64c7e21f18417c1f41#rd"
    }
    if (type === 'tijian') {
      app.globalData.webURL = "http://mp.weixin.qq.com/s?__biz=MzI0MTM1OTg4Mw==&mid=100000152&idx=2&sn=835a671473ddae37bd9498671ca88bbe&chksm=690d8cfc5e7a05ea3a429bf1b452a4c15df8c91313cb28affd4e67750c4e88c66dc66249abd3#rd"
    }
    if (type === 'liucheng') {
      app.globalData.webURL = "http://mp.weixin.qq.com/s?__biz=MzI0MTM1OTg4Mw==&mid=100000152&idx=4&sn=92efaebef22d19ae32a0aaee3c3a3967&chksm=690d8cfc5e7a05eafecb17bbf3ca31842a3e2b749509dec3c2d7e3cf3b140341f93e9114b78b#rd"
    }
    if (type === 'fenxiang') {
      app.globalData.webURL = "http://mp.weixin.qq.com/s?__biz=MzI0MTM1OTg4Mw==&mid=100000152&idx=3&sn=453a108ef9d3569c85211ba1390bf562&chksm=690d8cfc5e7a05ea57c7b1626f740208008cfe8c951a89eff7bb048426675d2b45c987368636#rd"
    }
    if (type === 'tijiandui') {
      app.globalData.webURL = "http://mp.weixin.qq.com/s?__biz=MzI0MTM1OTg4Mw==&mid=100000152&idx=5&sn=ea16fe7a0207645b46ec5d4c6f0cf176&chksm=690d8cfc5e7a05ea7fc17631741d4d7a3458e84aa1e036128d7cdc37fed7aef28bfc2a887653#rd"
    }
    wx.navigateTo({
      url: '../webview/webview',
    })
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