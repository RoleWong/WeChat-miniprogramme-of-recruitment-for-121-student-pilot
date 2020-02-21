let chooseList_body = []
let chooseList_family = []
Page({

  data: {

    checkboxItems_body: [{
        name: '精神或意识障碍',
        value: '0',
        remind: '不应有精神或意识障碍。'
      },
      {
        name: '癫痫或抽搐 ',
        value: '1',
        remind: '不应有癫痫或抽搐。'
      },
      {
        name: '晕厥或眩晕',
        value: '2',
        remind: '不应有晕厥或眩晕历史。'
      },
      {
        name: '经常或严重的头痛',
        value: '3',
        remind: '经常或严重的头痛可能会被淘汰。'
      },
      {
        name: '头颅外伤',
        value: '4',
        remind: '不应有头颅外伤。'
      },
      {
        name: '睡眠不良',
        value: '5',
        remind: '睡眠不良情况不能太过于频繁。'
      },
      {
        name: '物质依赖或滥用',
        value: '6',
        remind: '不应有物质依赖或滥用情况。'
      },
      {
        name: '心前区不适或心脏病',
        value: '7',
        remind: '不应有心前区不适或心脏病记录。'
      },
      {
        name: '高血压或低血压',
        value: '8',
        remind: '建议使用“循环系统自检”模块判断自身血压情况。'
      },
      {
        name: '哮喘或肺部疾病',
        value: '9',
        remind: '不应有哮喘或肺部疾病。'
      },
      {
        name: '胃肠疾病',
        value: '10',
        remind: '不应有严重胃肠疾病。'
      },
      {
        name: '糖尿病',
        value: '11',
        remind: '不应有糖尿病。'
      },
      {
        name: '过敏性疾病',
        value: '12',
        remind: '建议咨询航医或招飞工作人员自身过敏性疾病是否符合。'
      },
      {
        name: '气胸',
        value: '13',
        remind: '不应有气胸。'
      },
      {
        name: '胆道结石或胆系疾病',
        value: '14',
        remind: '不应有胆道结石或胆系疾病。'
      },
      {
        name: '泌尿系结石或血尿 ',
        value: '15',
        remind: '不应有泌尿系结石或血尿。'
      },
      {
        name: '良恶性肿瘤及治愈后',
        value: '16',
        remind: '不应有良恶性肿瘤，治愈后也不符合标准。'
      },
      {
        name: '目前使用药物',
        value: '17',
        remind: '部分短期药物可接受，建议咨询航医或招飞工作人员。'
      },
      {
        name: '各种手术或外伤史 ',
        value: '18',
        remind: '建议咨询航医或招飞工作人员自身手术或外伤史是否符合。'
      },
      {
        name: '腰背四肢关节痛',
        value: '19',
        remind: '不应有频繁腰背四肢关节痛。'
      },
      {
        name: '妇产科疾病 ',
        value: '20',
        remind: '女性不应有妇产科疾病。'
      },
      {
        name: '听力下降或耳鸣 ',
        value: '21',
        remind: '若对自己听力不放心，可前往医院进行电测听。听力要求可查阅首页招飞标准。平时注意少带耳机，保护听力。'
      },
      {
        name: '视觉障碍或眼部疾病',
        value: '22',
        remind: '不应有视觉障碍或眼部疾病（标准内进远视可接受）。'
      },
    ],
    checkboxItems_family: [{
      name: '心血管疾病',
      value: '0'
    },
    {
      name: '糖尿病',
      value: '1'
    },
    {
      name: '癫痫',
      value: '2'
    },
    {
      name: '精神病',
      value: '3',
      remind: '三代内直系亲戚若有心血管疾病可能会导致不通过。'
    }
    ],
    reasonListTotal: [],
    pass: false,
    failed: false,
    buttonText: '立即检测'
  },

  checkboxChange_body: function(e) {
    console.log('checkbox发生change事件，携带value值为：', e.detail.value);
    this.chooseList_body = e.detail.value
  },

  checkboxChange_family(e){
    console.log('checkbox发生change事件，携带value值为：', e.detail.value);
    this.chooseList_family = e.detail.value
  },

  formSubmit(e) {
    this.setData({
      buttonText: '再次检测'
    })
    let chooseBody = this.chooseList_body
    let chooseFamily = this.chooseList_family
    let reasonList = []
    var that = this

    //for循环判断身体情况
    console.log('身体情况原始数据', chooseBody)
    var checkboxItems_body = this.data.checkboxItems_body
    for (var i = 0, lenI = checkboxItems_body.length; i < lenI; ++i) {
      checkboxItems_body[i].checked = false;
      for (var j = 0, lenJ = chooseBody.length; j < lenJ; ++j) {
        if (checkboxItems_body[i].value == chooseBody[j]) {
          checkboxItems_body[i].checked = true;
          reasonList.push(checkboxItems_body[i].remind)
          break;
        }
      }
    }
    console.log('身体情况判断结束', checkboxItems_body)

    //for循环判断家族病史
    console.log('家族情况原始数据', chooseFamily)
    var checkboxItems_family = this.data.checkboxItems_family
    for (var i = 0, lenI = checkboxItems_family.length; i < lenI; ++i) {
      checkboxItems_family[i].checked = false;
      for (var j = 0, lenJ = chooseFamily.length; j < lenJ; ++j) {
        if (checkboxItems_family[i].value == chooseFamily[j]) {
          checkboxItems_family[i].checked = true;
          reasonList.push(`三代内直系亲戚若有${checkboxItems_family[i].name}可能会导致不通过。`)
          break;
        }
      }
    }
    console.log('家族情况判断结束', checkboxItems_family)

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
        title: '请浏览给出的建议',
        icon: 'none'
      })
    }
  },

  onLoad() {
    this.chooseList_body = []
    this.chooseList_family = []
  },

  onShowPicture(e) {
    wx.showLoading({
      title: '加载中',
      mask: true,
    })
    let type = e.currentTarget.dataset.index
    let url = ''
    if (type === "tijian") {
      url = "cloud://pilot121-pztvw.7069-pilot121-pztvw-1300593603/img/tijianxinxi.png"
    }
    console.log(url)
    wx.previewImage({
      current: 'cloud://pilot121-pztvw.7069-pilot121-pztvw-1300593603/img/tijianxinxi.png',
      urls: ["cloud://pilot121-pztvw.7069-pilot121-pztvw-1300593603/img/tijianxinxi.png"],
      success: () => {
        wx.hideLoading()
      }
    })
  },

  onShareAppMessage: function() {

  }
})