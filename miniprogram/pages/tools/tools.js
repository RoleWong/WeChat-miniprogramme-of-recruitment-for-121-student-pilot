Page({
  data: {
  },
  onShow: function () {
    if (typeof this.getTabBar === 'function' &&
      this.getTabBar()) {
      this.getTabBar().setData({
        selected: 2
      })
    }
  },
  onChange(e){
    let index = e.currentTarget.dataset.index
    let url=`../${index}/${index}`
    wx.navigateTo({
      url,
    })
  }
})