// miniprogram/pages/eyes/eyes.js
Page({

  data: {
    quguangArray: ["近视", "远视", "屈光正常"],
    isOrNo: ["能", "不能"],
    leftQuguangIndex: 0,
    rightQuguangIndex: 0,
    leftOneSeeIndex: 0,
    rightOneSeeIndex: 0,
    reasonListTotal: [],
    pass:false,
    failed:false,
    buttonText:'立即检测'
  },

  onLoad: function(options) {


  },

  bindLeftQuguangPickerChange(e) {
    this.setData({
      leftQuguangIndex: e.detail.value
    })
  },

  bindLeftOnePickerChange(e) {
    if (e.detail.value == 1) {
      wx.showToast({
        title: '无法裸眼识别1.0C字表开口方向，请选择近视或远视。',
        icon: 'none',
        duration: 3000
      })
      this.setData({
        leftQuguangIndex: 0
      })
    } else {
      this.setData({
        leftOneSeeIndex: e.detail.value
      })
    }
  },

  bindRightQuguangPickerChange(e) {
    this.setData({
      rightQuguangIndex: e.detail.value
    })

  },

  bindRightOnePickerChange(e) {

    if (e.detail.value == 1) {
      wx.showToast({
        title: '无法裸眼识别1.0C字表开口方向，请选择近视或远视。',
        icon: 'none',
        duration: 3000
      })
      this.setData({
        rightQuguangIndex: 0
      })
    } else {
      this.setData({
        rightOneSeeIndex: e.detail.value
      })
    }
  },

  formSubmit(e) {
    this.setData({
      buttonText:'再次检测'
    })
    let reasonList = []
    var that = this
    let eyeData = e.detail.value
    console.log(eyeData)

    eyeData.getLeftStatus = function() {
      if (this.leftjinshi) {
        if (this.leftjinshi + (this.leftsanguang / 2) > 450) {
          reasonList.push(`左眼屈光度超标。标准近视度数（等效球镜）不大于450，您的数据为${this.leftjinshi + (this.leftsanguang / 2)}。`)
        }
        if (this.leftsanguang > 200) {
          reasonList.push(`左眼散光度数超标。标准散光度数不大于200，您的数据为${this.leftsanguang}。`)
        }
        return ['jinshi', -(this.leftjinshi + (this.leftsanguang / 2))]
      } else if (this.leftyuanshi) {
        if (this.leftyuanshi + (this.leftsanguang / 2) > 300) {
          reasonList.push(`左眼屈光度超标。标准远视度数（等效球镜）不大于300，您的数据为${this.leftyuanshi + (this.leftsanguang / 2)}。`)
        }
        if (this.leftsanguang > 200) {
          reasonList.push(`左眼散光度数超标。标准散光度数不大于200，您的数据为${this.leftsanguang}。`)
        }
        return ['yuanshi', this.leftyuanshi + (this.leftsanguang / 2)]
      } else if (that.data.leftQuguangIndex == 2 && that.data.leftOneSeeIndex == 0) {
        return ['zhengchang', 0]
      } else {
        wx.showToast({
          title: '判断错误，请尝试重新输入',
        })
      }
    }

    eyeData.getRightStatus = function() {
      if (this.rightjinshi) {
        if (this.rightjinshi + (this.rightsanguang / 2) > 450) {
          reasonList.push(`右眼屈光度超标。标准近视度数（等效球镜）不大于450，您的数据为${this.rightjinshi + (this.rightsanguang / 2)}。`)
        }
        if (this.rightsanguang > 200) {
          reasonList.push(`右眼散光度数超标。标准散光度数不大于200，您的数据为${this.rightsanguang}。`)
        }
        return ['jinshi', -(this.rightjinshi + (this.rightsanguang / 2))]
      } else if (this.rightyuanshi) {
        if (this.rightyuanshi + (this.rightsanguang / 2) > 300) {
          reasonList.push(`右眼屈光度超标。标准远视度数（等效球镜）不大于300，您的数据为${this.rightyuanshi + (this.rightsanguang / 2)}。`)
        }
        if (this.rightsanguang > 200) {
          reasonList.push(`右眼散光度数超标。标准散光度数不大于200，您的数据为${this.rightsanguang}。`)
        }
        return ['yuanshi', this.rightyuanshi + (this.rightsanguang / 2)]
      } else if (that.data.rightQuguangIndex == 2 && that.data.rightOneSeeIndex == 0) {
        return ['zhengchang', 0]
      } else {
        wx.showToast({
          title: '判断错误，请尝试重新输入',
        })
      }
    }

    let balance = Math.abs(eyeData.getLeftStatus()[1]-eyeData.getRightStatus()[1])
    if(balance>250){
      reasonList.push(`屈光参差超标。标准屈光参差不大于250，您的数据为${balance}。`)
    }
    console.log('屈光参差',balance)
    if(reasonList.length === 0){
      that.setData({
        pass:true,
        failed:false
      })
      wx.showToast({
        title: '检测通过',
      })
    }else{
      that.setData({
        failed: true,
        pass:false,
        reasonListTotal: reasonList
      })
      wx.showToast({
        title: '抱歉，您的数据不符合要求。',
        icon:'none'
      })
    }
  },

  onShowPicture(e) {
    wx.showLoading({
      title: '加载中',
      mask: true,
    })
    let type = e.currentTarget.dataset.index
    let url = ''
    if (type === "c") {
      url = "cloud://pilot121-pztvw.7069-pilot121-pztvw-1300593603/img/c.jpg"
    }
    console.log(url)
    wx.previewImage({
      current: 'cloud://pilot121-pztvw.7069-pilot121-pztvw-1300593603/img/c.jpg',
      urls: ["cloud://pilot121-pztvw.7069-pilot121-pztvw-1300593603/img/c.jpg"],
      success: () => {
        wx.hideLoading()
      }
    })
  },

  onShareAppMessage: function (res) {
    
    return {
      title: '民航招飞眼科自检工具'
    }
  }
})