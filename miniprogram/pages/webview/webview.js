var app = getApp()
Page({
  data: {
    webURL:''
  },

  onLoad: function (options) {
    this.setData({
      webURL: app.globalData.webURL
    })
  }
})