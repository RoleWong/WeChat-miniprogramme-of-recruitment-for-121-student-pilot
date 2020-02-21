var app = getApp()

Page({

  data: {
    showTopTips: false,
    scoreDate: '2019-07-30',
    testDate: '2019-07-18',
    scoreValid: true,
    isAgree: false,
    jumpDialogShow: false,
    jumpButtons: [{
      text: '取消'
    }, { 
      text: '跳过'
    }],
    confirmDialogShow: false,
    confirmButtons: [{
      text: '取消'
    }, {
      text: '提交'
    }],
    ielts: {},
    error: ''
  },

  formSubmit: function(e) {
    var that = this;
    var form = e.detail.value;
    console.log(form)

    if ((form.TRFN).length === 18) {
      if (this.data.isAgree) {
        this.setData({
          confirmDialogShow: true,
          ielts: e.detail.value
        })
      } else {
      
        that.setData({
          error:'请阅读并确认雅思成绩提交声明'
        })
      }
    } else {
  
      that.setData({
        error: '请确保TRFN(Test Report Form Number)已正确输入！'
      })
    }
  },

  tapConfirmDialogButton(e) {

    var that = this
    this.setData({
      confirmDialogShow: false,
    });

    if (e.detail.index == '1') {
      wx.cloud.callFunction({
        name: 'db',
        data: {
          type: 'writeIELTS',
          form: that.data.ielts
        },
        success: function(res) {
          wx.showToast({
            title: '雅思提交成功',
            duration: 2000,
            icon: 'success'
          });

          //跳转至终审考核页面
          app.globalData.orderStatus = "finalinterview"
          wx.switchTab({
            url: "../../pages/order/order",
          })
        },
        fail: console.error
      })
    }
  },

  onJump: function() {
    this.setData({
      jumpDialogShow: true
    })
  },

  tapJumpDialogButton(e) {

    var that = this
    this.setData({
      jumpDialogShow: false,
    });

    if (e.detail.index == '1') {
      console.log('jump')
      wx.cloud.callFunction({
        name: 'db',
        data: {
          type: 'jumpIELTS',
        },
        success: function(res) {
          //跳转至终审考核页面
          app.globalData.orderStatus = "finalinterview"
          wx.switchTab({
            url: "../../pages/order/order",
          })
        },
        fail: console.error
      })
    }
  },

  bindAgreeChange: function(e) {
    this.setData({
      isAgree: !!e.detail.value.length
    });
  },

  bindTestDateChange: function(e) {
    this.setData({
      testDate: e.detail.value,
    })
  },

  bindScoreDateChange: function(e) {
    this.setData({
      scoreDate: e.detail.value,
    })
    this.validateTestDate(e.detail.value);
  },

  validateTestDate: function(e) {
    var that = this
    wx.cloud.callFunction({
      name: 'date',
      data: {
        type: 'ieltsValidate',
        date: e
      },
      success: function(res) {
        console.log(res.result)
        if (res.result) {
          that.setData({
            scoreValid: true
          })
        } else {
          that.setData({
            scoreValid: false
          })
        }
      },
      fail: console.error
    })

  },
})