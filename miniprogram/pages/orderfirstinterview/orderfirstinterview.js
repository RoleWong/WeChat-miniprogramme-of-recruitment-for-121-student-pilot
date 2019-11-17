// miniprogram/pages/orderfirstinterview/orderfirstinterview.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    interview:{},
    pickOne:''

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this;

    wx.cloud.callFunction({
      name: 'db',
      data: {
        type: 'getInterview',
        session: 'first',
      },
      success: function (res) {
        that.setData({
          interview: res.result.data,
        });
        console.log(that.data.interview);

      },
      fail: console.error
    })

  },

  radioChange: function (e) {
    this.setData({
      pickOne: e.detail.value,
    });
  },
 
  onSubmit:function(){
    var that = this;
    wx.cloud.callFunction({
      name: 'db',
      data: {
        type: 'confirmInterview',
        session: 'first',
        pick: that.data.pickOne,
      },
      success: function (res) {
   
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