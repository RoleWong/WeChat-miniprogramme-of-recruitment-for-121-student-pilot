// miniprogram/pages/cycle/cycle.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    reasonListTotal: [],
    pass: false,
    failed: false,
    buttonText: '立即检测'
  },


  onLoad: function(options) {

  },

  formSubmit(e) {
    this.setData({
      buttonText: '再次检测'
    })
    console.log(e)
    let reasonList = []
    var that = this
    let cycleData = e.detail.value
    cycleData.test = function(){
      if (this.xinxueguanjibing.length === 0){
        reasonList.push('不能有任何心血管系统疾病（史）。')
      }
      if (this.shuzhangya > 90 || this.shuzhangya < 60){
        reasonList.push(`血压-舒张压数据不符合要求。应在60mmHg至90mmHg范围内，您的舒张压为${this.shuzhangya}。`)
      }
      if (this.shousuoya > 140 || this.shousuoya < 90) {
        reasonList.push(`血压-收缩压数据不符合要求。应在90mmHg至140mmHg范围内，您的收缩压为${this.shousuoya}。`)
      }
      if(this.xinlv>110 || this.xinlv < 50){
        reasonList.push(`心率数据不符合要求。应在50次/分至110次/分范围内，您的心率为${this.xinlv}。`)
      }
    }
    cycleData.test()
    if (reasonList.length === 0) {
      that.setData({
        pass: true,
        failed: false
      })
      wx.showToast({
        title: '检测通过',
      })
    } else {
      that.setData({
        failed: true,
        pass: false,
        reasonListTotal: reasonList
      })
      wx.showToast({
        title: '抱歉，您的数据不符合要求。',
        icon: 'none'
      })
    }
  },


  onShareAppMessage: function() {

  }
})