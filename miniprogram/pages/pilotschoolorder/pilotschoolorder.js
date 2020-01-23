Page({

  /**
   * 页面的初始数据
   */
  data: {
    interview: {},
    pickOne: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this;

    wx.cloud.callFunction({
      name: 'db',
      data: {
        type: 'getPilot',
      },
      success: function(res) {
        that.setData({
          interview:res.result.data
        })
        console.log(that.data.interview)

      },
      fail: console.error
    })

  },

  radioChange: function(e) {
    this.setData({
      pickOne: e.detail.value,
    });
  },

  onSubmit: function() {
    var that = this;
    wx.cloud.callFunction({
      name: 'db',
      data: {
        type: 'confirmInterview',
        session: 'pilotschool',
        pick: that.data.pickOne,
      },
      success: function(res) {
        wx.showToast({
          title: '预约成功',
        })
        const url = "../../pages/waitingResult/waitingResult"
        wx.switchTab({
          url
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
})