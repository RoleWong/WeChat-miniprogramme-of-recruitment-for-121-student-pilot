// miniprogram/pages/waitingResult/waitingResult.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    type: "",
    information:[],
    remindLine: [],
  }, 

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this

    wx.cloud.callFunction({
      name: 'db',
      data: {
        type: 'getWaitingDetail',
      },
      success: function (res) {
        console.log(res)
        that.setData({
          information:res.result.information,
          remindLine:res.result.remind,
          type:res.result.type
        })
      },
      fail: console.error
    })


  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    if (typeof this.getTabBar === 'function' &&
      this.getTabBar()) {
      this.getTabBar().setData({
        selected: 1
      })
    }

  },

})