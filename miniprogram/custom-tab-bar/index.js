Component({

  data: {
    selected: 0,
    color: "#7A7E83",
    selectedColor: "#a91f51",
    list: [{
        pagePath: "../../pages/index/index",
        text: "招飞介绍",
        iconPath: "../images/tabbar-icon/article.png",
        selectedIconPath: "../images/tabbar-icon/article-active.png", 
      },
      {
        pagePath: "../../pages/apply/apply", 
        text: "申请流程",
        iconPath: "../images/tabbar-icon/apply.png",
        selectedIconPath: "../images/tabbar-icon/apply-active.png",
      },
      {
        pagePath: "../../pages/tools/tools",
        text: "身体自检",
        iconPath: "../images/tabbar-icon/tools.png",
        selectedIconPath: "../images/tabbar-icon/tools-active.png",
      }
    ]
  },
  attached() {},
  methods: {
    switchTab(e) {
      var app = getApp();
      var that = this;
      const data = e.currentTarget.dataset
      const index = data.index
      console.log('切换至', index)
      if (index == 1) {
        wx.cloud.callFunction({
          name: 'db',
          data: {
            type: 'getStatusCode'
          },
          success: function(res) {
            var statusCode = res.result
            console.log('得到的状态码', statusCode);
            if (statusCode == 666) {
              const url = "../../pages/apply/apply"
              wx.navigateTo({
                url
              })
            }
            if (statusCode == 0) {
              const url = "../../pages/cv/cv"
              wx.switchTab({
                url
              })
            }
            if (statusCode == 1) {
              const url = "../../pages/order/order"
              app.globalData.orderStatus = "firstinterview"
              wx.switchTab({
                url
              })
            }
            if (statusCode == 2) {
              const url = "../../pages/waitingResult/waitingResult"
              wx.switchTab({
                url
              })
            }
            if (statusCode == 3) {
              const url = "../../pages/order/order"
              app.globalData.orderStatus = "firstphysicalcheck"
              wx.switchTab({
                url
              })
            }
            if (statusCode == 4) {
              const url = "../../pages/waitingResult/waitingResult"
              wx.switchTab({
                url
              })
            }
            if (statusCode == 5) {
              const url = "../../pages/order/order"
              app.globalData.orderStatus = "secondinterview"
              wx.switchTab({
                url
              })
            }
            if (statusCode == 6) {
              const url = "../../pages/waitingResult/waitingResult"
              wx.switchTab({
                url
              })
            }
            if (statusCode == 7) {
              const url = "../../pages/order/order"
              app.globalData.orderStatus = "secondphysicalcheck"
              wx.switchTab({
                url
              })
            }
            if (statusCode == 8) {
              const url = "../../pages/waitingResult/waitingResult"
              wx.switchTab({
                url
              })
            }
            if (statusCode == 9) {
              const url = "../../pages/uploadbackgroundinvestigate/uploadbackgroundinvestigate"
              wx.navigateTo({
                url
              })
            }
            if (statusCode == 10) {
              const url = "../../pages/ielts/ielts"
              wx.navigateTo({
                url
              })
            }
            if (statusCode == 11) {
              const url = "../../pages/order/order"
              app.globalData.orderStatus = "finalinterview"
              wx.switchTab({
                url
              })
            }
            if (statusCode == 12) {
              const url = "../../pages/waitingResult/waitingResult"
              wx.switchTab({
                url
              })
            }
            if (statusCode == 13) {
              const url = "../../pages/pilotschoolorder/pilotschoolorder"
              wx.navigateTo({
                url
              })
            }
            if (statusCode == 14) {
              const url = "../../pages/waitingResult/waitingResult"
              wx.switchTab({
                url
              })
            }
            if (statusCode == 15) {
              const url = "../../pages/result/result"
              app.globalData.type = "success"
              wx.navigateTo({
                url
              })
            }
            if (statusCode == 16) {
              const url = "../../pages/result/result"
              app.globalData.type = "pass"
              wx.navigateTo({
                url
              })
            }
            if (statusCode == 555) {
              const url = "../../pages/result/result"
              app.globalData.type = "failed"
              wx.navigateTo({
                url
              })
            }
            
            that.setData({
              selected: data.index
            })
          },
          fail: console.error
        })

      } else {
        const url = data.path
        wx.switchTab({
          url
        })
      }
      this.setData({
        selected: data.index
      })
    }
  }
})