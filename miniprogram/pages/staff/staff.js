Page({

  data: {
    staffInfo:{},
    amount:{
      interview:'计算中',
      pyhicalcheck:'计算中',
      pilotschool:'计算中'
    }, 
    maskShow:true
  },

  onLoad: function (options) {
    wx.showLoading({
      title: '身份验证中',
    })
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
            staffInfo: staffInfo,
            maskShow:false
          })
          wx.hideLoading()
        }else{
          console.log('!staff')
          wx.switchTab({
            url: '../index/index',
          })
        }
      })
      .catch(console.error)

    wx.cloud.callFunction({
      name: 'db',
      data: {
        type: 'getProcessAmount'
      },
    })
      .then(res => {
        console.log(res.result)
        this.setData({
          amount: res.result
        })
      })
      .catch(console.error)
  },

  onChange(e) {
    let index = e.currentTarget.dataset.index
    let type = e.currentTarget.dataset.type
    console.log(index,type)
    let url = `../${index}/${index}?type=${type}`
    wx.navigateTo({
      url,
    })
  },

  onBack(){
    wx.switchTab({
      url: '../tools/tools',
    })
  },

})