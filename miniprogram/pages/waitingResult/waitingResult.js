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
    this.onLoad()
  },

  onOpenMap() {
    var that = this;
    //打开地图必须用浮点型的经纬度，后台系统录入或新增时，会将经纬度变成string
    let latitude = parseFloat(that.data.information.location.latitude)
    let longitude = parseFloat(that.data.information.location.longitude)
    let name = that.data.information.location.name
    console.log('openmap', latitude)
    wx.openLocation({
      latitude,
      longitude,
      scale: 15,
      name
    })
  },

})