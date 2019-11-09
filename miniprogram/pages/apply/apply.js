Page({

  /**
   * 页面的初始数据
   */
  data: {
    beginApply:true,
    
 

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  ifAgreeCheckboxChange: function (e) {
    if(e.detail.value == "1"){
      this.setData({
        beginApply:false,
      })
      }
    else {
      this.setData({
        beginApply: true,
      })
    }
  },

  onUserinfo:function(event){
    console.log(event.detail.userInfo);
    wx.cloud.callFunction({
      // 云函数名称
      name: 'db',
      // 传给云函数的参数
      data: {
        nickName: event.detail.userInfo.nickName,
        gender: event.detail.userInfo.gender,
        avatarUrl: event.detail.userInfo.avatarUrl,
        language: event.detail.userInfo.language,
        city: event.detail.userInfo.city,
        province: event.detail.userInfo.province,
        type: 'register'
      },
      success: function (res) {
        console.log('注册、更新信息成功');
        wx.switchTab({
          url: '../cv/cv',
        })
      },
      fail: console.error
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    

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

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})