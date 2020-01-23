Page({


  data: {
    type: "",
    information: [],
    remindLine: [],
  },

  onLoad: function(options) {
    var that = this

    wx.cloud.callFunction({
      name: 'db',
      data: {
        type: 'getWaitingDetail',
      },
      success: function(res) {
        console.log(res)
        that.setData({
          information: res.result.information,
          remindLine: res.result.remind,
          type: res.result.type
        })
      },
      fail: console.error
    })
  },

  onShow: function() {
    if (typeof this.getTabBar === 'function' &&
      this.getTabBar()) {
      this.getTabBar().setData({
        selected: 1
      })
    }
  },

  onOpenMap() {
    var that = this;
    let latitude = that.data.information.location.latitude
    let longitude = that.data.information.location.longitude
    let name = that.data.information.location.name
    wx.openLocation({
      latitude,
      longitude,
      scale: 15,
      name
    })
  },

})