let chooseList = []
Page({

  /**
   * 页面的初始数据
   */
  data: {

    checkboxItems: [{
        name: '下肢静脉曲张：呈结节或囊袋状膨胀。伴有静脉壁变薄或溃疡、湿疹、水肿及皮肤色素沉着。',
        value: '0',
      remind:'不应有重度下肢静脉曲张，若仅为轻度（静脉壁未变薄且皮肤色泽正常）由航医判断。'
      },
      {
        name: '精索静脉曲张：正常站立可触及阴囊内曲张之静脉。',
        value: '1',
        remind: '不应有重度精索静脉曲张，若仅为轻度（局部触不到曲张之静脉）由航医判断。'
      },
      {
        name: '腋臭：在裸露状态下，1M外可闻及臭味。',
        value: '2',
        remind: '不应有重度腋臭，若仅为轻度（1M内可闻到）由航医判断。'
      },
      {
        name: '近期有手术史或有扭伤、撞伤等症状还未完全痊愈。',
        value: '3',
        remind: '近期不应做过手术，且未因运动等因素，使身体受伤。'
      }
    ],
    reasonListTotal: [],
    pass: false,
    failed: false,
    buttonText: '立即检测',
    bmi: 0
  },

  checkboxChange: function(e) {
    console.log('checkbox发生change事件，携带value值为：', e.detail.value);
    this.chooseList = e.detail.value
  },

  formSubmit(e) {
    this.setData({
      buttonText: '再次检测'
    })
    let chooseJibing = this.chooseList
    let bodyData = e.detail.value
    console.log('外科原始数据', bodyData, chooseJibing)
    let reasonList = []
    var that = this

    //判断BMI数据
    bodyData.test = function() {
      let weight = this.weight
      let height = this.height / 100
      let bmi = weight / (height * height)
      if (bmi > 24 || bmi < 18.5) {
        reasonList.push(`BMI指数超标。标准范围18.5~24，您的BMI为${bmi.toFixed(2)}。请确保体型均称、肌肉发达，无赘肉脂肪堆积，并注意减肥。`)
      } else {
        that.setData({
          bmi: bmi.toFixed(2)
        })
      }
      if(height > 1.86 || height < 1.7){
        reasonList.push(`身高不符合标准，范围为170CM—186CM。`)
      }
    }
    bodyData.test()

    //for循环判断外科病症
    var checkboxItems = this.data.checkboxItems
    for (var i = 0, lenI = checkboxItems.length; i < lenI; ++i) {
      checkboxItems[i].checked = false;
      for (var j = 0, lenJ = chooseJibing.length; j < lenJ; ++j) {
        if (checkboxItems[i].value == chooseJibing[j]) {
          checkboxItems[i].checked = true;
          reasonList.push(checkboxItems[i].remind)
          break;
        }
      }
    }
    console.log('外科病症判断结束',checkboxItems)

    //通过reasonlist判断是否符合标准
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

  onLoad(){
    this.chooseList=[]
  },

  onShareAppMessage: function() {

  }
})