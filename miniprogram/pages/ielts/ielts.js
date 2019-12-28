Page({

  data: {
    showTopTips: false,
    scoreDate: '2019-07-30',
    testDate: '2019-07-18',
    scoreValid:true,
    isAgree: false,
  },

  formSubmit: function (e) {
    var that = this;
    var form = e.detail.value;
    console.log(form)

    // var that = this;
    // var form = e.detail.value;
    // if (form.name && form.englishScore && form.fatherName && form.fatherTel && form.fatherWork && form.fatherAge && form.height && form.idcard && form.major && form.mobile && form.motherAge && form.motherName && form.motherTel && form.motherWork && form.university && form.weight && this.data.identificationPhoto) {
    //   // if (true) {
    //   if (this.data.isAgree) {
    //     var cloudPath = 'identificationPhoto/' + form.idcard + this.data.identificationPhoto[0].match(/\.[^.]+?$/)[0];
    //     wx.cloud.uploadFile({
    //       cloudPath: cloudPath,
          // filePath: that.data.identificationPhoto[0],
          // success: res => {
          //   console.log(res.fileID);
          //   wx.cloud.callFunction({
          //     name: 'db',
          //     data: {
          //       type: 'writeCV',
          //       form: form,
          //       identificationPhoto: res.fileID
          //     },
          //     success: function (res) {
          //       wx.showToast({
          //         title: '招飞报名成功',
          //         duration: 2000,
          //         icon: 'success'
          //       });

          //       app.globalData.interviewStatus = "first"
          //       wx.switchTab({
          //         url: "../../pages/orderInterview/orderInterview",
          //       })
          //     },
          //     fail: console.error
          //   })
    //       },
    //       fail: err => {
    //         console.log('错误', err)
    //       }
    //     });



    //   } else {
    //     wx.showToast({
    //       title: '请阅读并确认应聘声明',
    //       icon: 'none'
    //     })
    //   }
    // } else {
    //   wx.showToast({
    //     title: '请确保所有项目（除工作经历）已填写！',
    //     icon: 'none'
    //   })
    // }

  },

  formReset: function () {
    console.log('form发生了reset事件')
  },

  bindAgreeChange: function (e) {
    this.setData({
      isAgree: !!e.detail.value.length
    });
  },

  bindTestDateChange: function (e) {
    this.setData({
      testDate: e.detail.value,
    })
  },

  bindScoreDateChange: function (e) {
    this.setData({
      scoreDate: e.detail.value,
    })
    this.validateTestDate(e.detail.value);
  },

  validateTestDate: function (e) {
    var that = this
    wx.cloud.callFunction({
      name: 'date',
      data:{
        type:'ieltsValidate',
        date:e
      },
      success: function (res) {
        console.log(res.result)
        if (res.result){
          that.setData({
            scoreValid:true
          })
        }else{
          that.setData({
            scoreValid: false
          })
        }
      },
      fail: console.error
    })

  },

  onShow: function () {
    if (typeof this.getTabBar === 'function' &&
      this.getTabBar()) {
      this.getTabBar().setData({
        selected: 1
      })
    }

  },
})