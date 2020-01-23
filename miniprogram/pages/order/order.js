Page({

  /**
   * 页面的初始数据
   */
  data: {
    interview: {},
    pickOne: '',
    interviewStatus: '', 
    headRemind1: '',
    headRemind2: ''


  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this;
    var app = getApp();

    this.setData({
      orderStatus: app.globalData.orderStatus,
    })



    if (app.globalData.orderStatus === 'firstinterview') {
      this.setData({
        headRemind1: '恭喜，您已报名成功！',
        headRemind2: '现在请选择一个合适的初面场次。'
      });
    } else if (app.globalData.orderStatus === 'secondinterview') {
      this.setData({
        headRemind1: '恭喜，您已通过上站体检！',
        headRemind2: '现在请选择一个合适的领导面试场次。'
      });
    } else if (app.globalData.orderStatus === 'finalinterview') {
      this.setData({
        headRemind1: '您的招飞流程即将完成！',
        headRemind2: '现在请选择一个合适的终审考核场次。'
      });
    } else if (app.globalData.orderStatus === 'firstphysicalcheck') {
      this.setData({
        headRemind1: '请选择您的上站体检（初检）场次',
        headRemind2: '体检全程需要二至三天，以下时间为第一天。'
      });
    } else if (app.globalData.orderStatus === 'secondphysicalcheck') {
      this.setData({
        headRemind1: '请选择您的上站体检（复检）场次',
        headRemind2: '体检全程需要二至三天，以下时间为第一天。'
      });
    }


    wx.cloud.callFunction({
      name: 'db',
      data: {
        type: 'getInterview',
        session: that.data.orderStatus,
      },
      success: function(res) {
        that.setData({
          interview: res.result.data,
        });
        console.log(that.data.interview);

      },
      fail: console.error
    })

  },

  radioChange: function(e) {
    this.setData({
      pickOne: e.detail.value,
    });
  },

  onSubmit: function() {
    var that = this;
    wx.cloud.callFunction({
      name: 'db',
      data: {
        type: 'confirmInterview',
        session: that.data.orderStatus,
        pick: that.data.pickOne,
      },
      success: function(res) {
        wx.showToast({
          title: '预约成功',
        })
        const url = "../../pages/waitingResult/waitingResult"
        wx.switchTab({
          url
        })
      },
      fail: console.error
    })
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