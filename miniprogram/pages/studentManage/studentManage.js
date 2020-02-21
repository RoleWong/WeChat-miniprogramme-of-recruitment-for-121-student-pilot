Page({

  data: {
    optionType: '', //暂时用interview开发，后期使用GET到的type数据,
    sliderPicture: "",
    pilotschool: {

    },
    interview: {
      firstinterview: [],
      secondinterview: [],
      finalinterview: []
    },
    physicalcheck: {
      firstphysicalcheck: [],
      secondphysicalcheck: []
    },
    pilotschool: [],
    offer: [],
    failed: [],
    amount: {
      offer: '计算中',
      failed: '计算中',
      process: '计算中'
    },
    detailsShow: false,
    details_content: [],
    politicalStatus: ['群众', '中共党员', '中共预备党员', '共青团员', '民革党员', '民盟盟员', '民建会员', '民进会员', '农工党党员', '致公党党员', '九三学社社员', '台盟盟员', '无党派人士'],
    education: ['大学本科', '硕士研究生', '博士研究生'],
    englishLevel: ['CET-4', 'CET-6', 'IELTS', 'TOFEL'],
    showActionsheet: false,
    groups: [{
        text: '查看详情',
        value: 1
      },
      {
        text: '通过该步骤',
        value: 2
      },
      {
        text: '放弃',
        type: 'warn',
        value: 3
      }
    ],
    currentActionType: '',
    confirmShow: false,
    giveupShow: false,
    confirmButtons: [{
      text: '取消'
    }, {
      text: '通过'
    }],
    giveupButtons: [{
      text: '取消'
    }, {
      text: '放弃'
    }],
  },

  onShow(options) {
    this.setData({
      optionType: options.type
    })
    this.onLoad()
  },

  onLoad: function(options) {
    //  这里最后要接通GET到的type数据
    if (options.type === 'interview') {
      this.setData({
        sliderPicture: "cloud://pilot121-pztvw.7069-pilot121-pztvw-1300593603/img/interviewStudentAdminSlider.jpg",
        optionType: options.type
      })
    } else if (options.type === 'physicalcheck') {
      this.setData({
        sliderPicture: "cloud://pilot121-pztvw.7069-pilot121-pztvw-1300593603/img/physicalcheckStudentAdminSlider.jpg",
        optionType: options.type
      })
    } else if (options.type === 'pilotschool') {
      this.setData({
        sliderPicture: "cloud://pilot121-pztvw.7069-pilot121-pztvw-1300593603/img/pilotschoolStudentAdminSlider.jpg",
        optionType: options.type
      })
    } else if (options.type === 'offer') {
      this.setData({
        sliderPicture: "cloud://pilot121-pztvw.7069-pilot121-pztvw-1300593603/img/passStudentAdminSlider.jpg",
        optionType: options.type
      })
    } else if (options.type === 'failed') {
      this.setData({
        sliderPicture: "cloud://pilot121-pztvw.7069-pilot121-pztvw-1300593603/img/failedStudentAdminSlider.jpg",
        optionType: options.type
      })
    }
    this.refreshList()
  },
  onChange(e) {
    let index = e.currentTarget.dataset.index
    let type = e.currentTarget.dataset.type
    let url = `../${index}/${index}?type=${type}`
    wx.navigateTo({
      url,
    })
  },
  refreshList() {
    var that = this

    wx.cloud.callFunction({
        name: 'db',
        data: {
          type: 'getStudentList',
          needtype: that.data.optionType
        },
      })
      .then(res => {
        console.log(res.result)
        if (that.data.optionType === 'interview') {
          //本区域赋值全部替换使用数组解构
          const [firstinterview, secondinterview, finalinterview, amountProcess, amountOffer, amountFailed] = res.result
          that.setData({
            'interview.firstinterview': firstinterview,
            'interview.secondinterview': secondinterview,
            'interview.finalinterview': finalinterview,
            'amount.offer': amountOffer,
            'amount.failed': amountFailed,
            'amount.process': amountProcess
          })
        } else if (that.data.optionType === 'physicalcheck') {
          const [firstphysicalcheck, secondphysicalcheck, amountProcess, amountOffer, amountFailed] = res.result
          that.setData({
            'physicalcheck.firstphysicalcheck': firstphysicalcheck,
            'physicalcheck.secondphysicalcheck': secondphysicalcheck,
            'amount.offer': amountOffer,
            'amount.failed': amountFailed,
            'amount.process': amountProcess
          })
        } else if (that.data.optionType === 'pilotschool') {
          const [pilotschool, amountProcess, amountOffer, amountFailed] = res.result
          that.setData({
            pilotschool: pilotschool,
            'amount.offer': amountOffer,
            'amount.failed': amountFailed,
            'amount.process': amountProcess
          })
        } else if (that.data.optionType === 'offer') {
          const [offer, amountProcess, amountOffer, amountFailed] = res.result
          that.setData({
            offer: offer,
            'amount.offer': amountOffer,
            'amount.failed': amountFailed,
            'amount.process': amountProcess
          })
        } else if (that.data.optionType === 'failed') {
          const [failed, amountProcess, amountOffer, amountFailed] = res.result
          that.setData({
            failed: failed,
            'amount.offer': amountOffer,
            'amount.failed': amountFailed,
            'amount.process': amountProcess
          })
        }

        wx.stopPullDownRefresh()
      })
      .catch(console.error)
  },
  onCloseMask() {
    this.setData({
      detailsShow: false
    })
  },
  onTouchItem(e) {
    let dataarray = []
    dataarray.push(e.currentTarget.dataset.index)
    console.log(dataarray)
    this.setData({
      details_content: dataarray,
      showActionsheet: true,
      currentActionType: e.currentTarget.dataset.type
    })
  },
  tapConfirmButton(e) {
    this.setData({
      confirmShow: false
    });
    if (e.detail.index === 1) {
      this.passProcess()
    }
  },
  tapGiveupButton(e) {
    this.setData({
      giveupShow: false
    });
    if (e.detail.index === 1) {
      this.failedProcess()
    }

  },
  btnActionsheetClick(e) {
    if (e.detail.value === 1) {
      this.showDetails()
    }
    if (e.detail.value === 2) {
      this.setData({
        confirmShow: true,
        showActionsheet: false
      });
    }
    if (e.detail.value === 3) {
      this.setData({
        giveupShow: true,
        showActionsheet: false
      });
    }
  },
  showDetails(e) {
    this.setData({
      detailsShow: true,
      showActionsheet: false
    })
  },
  onTouchDetails(e) {
    let dataarray = []
    dataarray.push(e.currentTarget.dataset.index)
    console.log(dataarray)
    this.setData({
      details_content: dataarray,
      detailsShow: true
    })
  },
  passProcess() {
    var that = this
    console.log('pass')
    wx.cloud.callFunction({
      name: 'db',
      data: {
        type: 'passProcess',
        openid: that.data.details_content[0].openid,
        sessionType: that.data.currentActionType,
        sessionId: that.data.details_content[0].session._id
      },
      success: function(res) {
        console.log(res) 
        wx.showToast({
          title: '已通过',
        })
        that.refreshList()
      },
      fail: console.error
    })
  },
  failedProcess() {
    var that = this
    console.log('failed')
    wx.cloud.callFunction({
      name: 'db',
      data: {
        type: 'failedProcess',
        openid: that.data.details_content[0].openid,
        sessionType: that.data.currentActionType,
        sessionId: that.data.details_content[0].session._id
      },
      success: function(res) {
        console.log(res) 
        wx.showToast({
          title: '已放弃',
        })
        that.refreshList()
      },
      fail: console.error
    })
  },
  onPreviewImage(e) {
    console.log('preview', e.currentTarget.dataset.src)
    let current = e.currentTarget.dataset.src
    wx.previewImage({
      current,
      urls: [current],
    })
  },
  onPullDownRefresh() {
    this.refreshList()
  }
})