var app = getApp();

Page({

  data: {
    showTopTips: false,
 
    birthDate: '1996-01-01',
    graduatedDate: '2020-06',
    entryDate: '2016-09',



    region: ['广东省', '深圳市', '南山区'],
    customItem: '全部',

    politicalStatus: ['群众', '中共党员', '中共预备党员', '共青团员', '民革党员', '民盟盟员', '民建会员', '民进会员', '农工党党员', '致公党党员', '九三学社社员', '台盟盟员', '无党派人士', ],
    politicalStatusIndex: 0,

    education: ['大学本科', '硕士研究生', '博士研究生'],
    educationIndex: 0,

    englishLevel: ['CET-4', 'CET-6', 'IELTS', 'TOFEL'],
    englishLevelIndex: 0,

    isAgree: false,
    identificationPhoto: '',
    uploadButton: '上传证件照'
  },

  formSubmit: function(e) {
    var that = this;
    var form = e.detail.value;
    if (form.name && form.englishScore && form.fatherName && form.fatherTel && form.fatherWork && form.fatherAge && form.height && form.idcard && form.major && form.mobile && form.motherAge && form.motherName && form.motherTel && form.motherWork && form.university && form.weight && this.data.identificationPhoto) {
    // if (true) {
      if (this.data.isAgree) { 
        var cloudPath = 'identificationPhoto/' + form.idcard + this.data.identificationPhoto[0].match(/\.[^.]+?$/)[0];
        wx.cloud.uploadFile({
          cloudPath: cloudPath,
          filePath: that.data.identificationPhoto[0],
          success: res => {
            console.log(res.fileID);
            wx.cloud.callFunction({
              name: 'db',
              data: {
                type: 'writeCV',
                form: form,
                identificationPhoto: res.fileID
              },
              success: function(res) {
                wx.showToast({
                  title: '招飞报名成功',
                  duration: 2000,
                  icon: 'success'
                });
      
                app.globalData.interviewStatus = "first"
                wx.switchTab({
                  url: "../../pages/orderInterview/orderInterview",
                })
              },
              fail: console.error
            })
          },
          fail: err => {
            console.log('错误', err)
          }
        });



      } else {
        wx.showToast({
          title: '请阅读并确认应聘声明',
          icon: 'none'
        })
      }
    } else {
      wx.showToast({
        title: '请确保所有项目（除工作经历）已填写！',
        icon: 'none'
      })
    }

  },
  formReset: function() {
    console.log('form发生了reset事件')
  },

  onChooseImage: function() {
    var that = this;
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album'],
      success(res) {
        // tempFilePath可以作为img标签的src属性显示图片
        const identificationPhoto = res.tempFilePaths
        that.setData({
          identificationPhoto: identificationPhoto,
          uploadButton: '更新证件照'
        });
        console.log(that.data.identificationPhoto);
      }
    })
  },

  bindBirthDateChange: function(e) {
    this.setData({
      birthDate: e.detail.value,
    })
  },

  bindEntryDateChange: function(e) {
    this.setData({
      entryDate: e.detail.value,
    })
  },

  bindGraduateChange: function(e) {
    this.setData({
      graduatedDate: e.detail.value,
    })
  },

  bindTimeChange: function(e) {
    this.setData({
      time: e.detail.value
    })
  },
  bindCountryCodeChange: function(e) {

    this.setData({
      countryCodeIndex: e.detail.value
    })
  },
  bindPoliticalStatusChange: function(e) {

    this.setData({
      politicalStatusIndex: e.detail.value
    })
  },
  bindEducationChange: function(e) {

    this.setData({
      educationIndex: e.detail.value
    })
  },
  bindEnglishLevelChange: function(e) {

    this.setData({
      englishLevelIndex: e.detail.value
    })
  },
  bindRegionChange: function(e) {
    this.setData({
      region: e.detail.value
    })
  },
  bindAgreeChange: function(e) {
    this.setData({
      isAgree: !!e.detail.value.length
    });
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