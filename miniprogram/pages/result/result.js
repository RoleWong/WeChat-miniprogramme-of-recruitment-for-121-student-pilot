// miniprogram/pages/result/result.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: { 
    type:'',
    src:'',
    dialogShow: false,
    buttons: [{
      text: '暂不'
    }, {
      text: '确认' 
    }],
    submitShow:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (app.globalData.type === 'success'){
      this.setData({
        type: app.globalData.type,
        src:"cloud://pilot121-pztvw.7069-pilot121-pztvw-1300593603/img/success.jpg",
        status:'waiting'
      })
      console.log(this.data.type)
    }
    if (app.globalData.type === 'failed') {
      this.setData({
        type: app.globalData.type,
        src: "cloud://pilot121-pztvw.7069-pilot121-pztvw-1300593603/img/failed.jpg"
      })
      console.log(this.data.type)
    }
    if (app.globalData.type === 'pass') {
      this.setData({
        type: app.globalData.type,
        src: "cloud://pilot121-pztvw.7069-pilot121-pztvw-1300593603/img/success.jpg"
      })
      console.log(this.data.type)
    } 
    wx.cloud.callFunction({
      name: 'db',
      data: {
        type: 'getStatus'
      },
      success: (res)=> {
        console.log(res.result.data[0].offerAddress)
        if (!res.result.data[0].offerAddress){
          this.setData({
            submitShow:true
          })
        }
      },
      fail: console.error
    })
    
  },
  onSubmit: function () {
    this.setData({
      dialogShow:true
    })
  },

  onShowChooseAddress(e){
    var that = this
    wx.chooseAddress({
      success(res) {
        wx.cloud.callFunction({
          name: 'db',
          data: {
            type: 'writeAddress',
            address:res
          },
          success: (res)=> {
            console.log(res)
            wx.showToast({
              title: '提交成功',
              icon: 'success'
            })
            that.setData({
              submitShow: false
            })
          },
          fail: console.error
        })
      }
    })
  },

  tapDialogButton(e) {
   
    this.setData({
      dialogShow: false,
    });
    var that = this;

    if(this.status=='pass'){
      wx.showToast({
        title: '您已成功确认，无需再次点击',
      })
      return;
    }

    if (e.detail.index == '1') {
      wx.cloud.callFunction({
        name: 'db',
        data: {
          type: 'confirmOffer'
        },
        success: function (res) {
          console.log(res)
          wx.showToast({
            title: '确认接受成功',
            icon:'success'
          })
          that.setData({
            type:'pass'
          })
          console.log(that.data.type)
          
        },
        fail: console.error
      })
    }
  },
})