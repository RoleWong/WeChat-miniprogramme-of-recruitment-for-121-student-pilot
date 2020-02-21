Page({
  data: {
    id: '',
    name: '',
    avatar:'',
    adminShow: false
  },
  onLoad() {
    wx.cloud.callFunction({
        name: 'db',
        data: {
          type: 'getStaffInfo'
        },
      })
      .then(res => {
        let staffInfo = res.result.data[0]
        console.log(staffInfo)
        if (staffInfo) {
          this.setData({
            id: staffInfo.id,
            name: staffInfo.name,
            avatar:staffInfo.avatar,
            adminShow: true
          })
        }
      })
      .catch(console.error)
  },
  onShow: function() {
    if (typeof this.getTabBar === 'function' &&
      this.getTabBar()) {
      this.getTabBar().setData({
        selected: 2
      })
    }
  },
  onChangeToYiqin(){
    wx.navigateToMiniProgram({
      appId: 'wxb032bc789053daf4',
      path: 'pages/index/home/main?navigate_uri=%2Fpages%2Fwebview%2Fmain%3Fsrc%3Dhttps%253A%252F%252Ffeiyan.wecity.qq.com%252Fwuhan%252Fdist%252Findex.html%2523%252Ffeiyan-more-tools%253F_scope%253Dsnsapi_base%2526channel%253DAAEswZXBJg8_KOYeStL6xKT6&channel=AAEswZXBJg8_KOYeStL6xKT6',
      success(res) {
        // 打开成功
        console.log('changeSuccess')
      },
      fail(res){
        console.log(res)
      }
    })
  },
  onChange(e) {
    let index = e.currentTarget.dataset.index
    let url = `../${index}/${index}`
    wx.navigateTo({
      url,
    })
  }
})