 Page({

  data: {
    optionType:'',
    firstInterview: {},
    secondInterview: {},
    finalInterview: {},
    headRemind1: '面试场次管理',
    showApplyNewSession: false,
    qiwei: [{
      text: '拉起企微'
    }],
    newSessionShow: false,
    editSessionShow: false,
    date: '2020-05-01',
    time: '09:00',
    typeArray_interview: ['初面', '领导面', '终审考核'],
    typeArray_physicalCheck: ['上站初检', '上站复检'],
    typeIndex: 0,
    editSession: {
      original: {},
      latest: {}
    },
    currentAction: 0, //1:录入新增；2：更新；初始为0,
    needUpdateId: '',
    error: '',
    showActionsheet: false,
    groups: [{
        text: '编辑信息',
        value: 1
      },
      {
        text: '下线场次',
        type: 'warn',
        value: 2
      }
    ],
    currentActionSheetAction_id: '',
    currentActionSheetAction_sessionType: '',
    deleteShow: false,
    deleteButtons: [{
      text: '取消'
    }, {
      text: '确定下线'
    }],
    amountTab: {},
    sliderPicture: ""
  },

  openActionsheet: function(e) {
    console.log('谁按得', e.currentTarget.dataset.index, e.currentTarget.dataset.type)
    this.setData({
      showActionsheet: true,
      currentActionSheetAction_id: e.currentTarget.dataset.index,
      currentActionSheetAction_sessionType: e.currentTarget.dataset.type,

    })
  },
  closeActionsheet: function() {
    this.setData({
      showActionsheet: false
    })
  },
  btnActionsheetClick(e) {
    console.log('按了谁', e.detail.value)
    if (e.detail.value === 1) {
      this.onOpenEdit()
      wx.showLoading({
        title: '加载中',
      })
    }
    if (e.detail.value === 2) {
      // this.onDeleteSession()
      this.setData({
        deleteShow: true
      })
    }
    this.closeActionsheet()
  },

  tapDeleteButton(e) {
    this.setData({
      deleteShow: false,
    });
    if (e.detail.index === 1) {
      this.onDeleteSession()
    }

  },

  onLoad: function(options) {
    console.log(options.type)
    if (options.type === 'interview') {
      this.setData({
        sliderPicture: "cloud://pilot121-pztvw.7069-pilot121-pztvw-1300593603/img/interviewAdminSlider.jpg",
        optionType:'interview'
      })
    }
    if (options.type === 'physicalcheck') {
      this.setData({
        sliderPicture: "cloud://pilot121-pztvw.7069-pilot121-pztvw-1300593603/img/physicalCheckAdminSlider.jpg",
        optionType:'physicalcheck'
      })
    }
    if (options.type === 'pilotschool') {
      this.setData({
        sliderPicture: "cloud://pilot121-pztvw.7069-pilot121-pztvw-1300593603/img/pilotSchoolAdminSlider.jpg",
        optionType:'pilotschool'
      })
    }
    this.refreshList(options.type)
    
  },

  tapApplyNewSession() {
    console.log('弹窗')
    this.setData({
      showApplyNewSession: true
    })
  },
  tapDialogButtonRight() {
    wx.showToast({
      title: '抱歉，暂不支持直接跳转。',
      icon: 'none'
    })
    this.setData({
      showApplyNewSession: false
    })
  },

  onShowMask() {
    this.setData({
      newSessionShow: true,
      currentAction: 1
    })
  },
  onCloseMask() {
    this.setData({
      newSessionShow: false,
      editSessionShow: false
    })
  },

  onDeleteSession() {
    //删除场次
    let sessionId = this.data.currentActionSheetAction_id
    let type = this.data.currentActionSheetAction_sessionType
    var that = this
    wx.cloud.callFunction({
      name: 'db',
      data: {
        type: 'deleteSession',
        _id: sessionId,
        sessionType: type
      },
      success: function(res) {
        console.log(res)
        if (res.result[0] === 0) {
          that.setData({
            error: res.result[1]
          })
        } else {
          wx.showToast({
            title: '下线成功！',
          })
          that.refreshList()
        }

      },
      fail: console.error
    })
  },

  onOpenEdit() {
    var that = this
    this.setData({
      editSessionShow: true,
      currentAction: 2
    })
    let sessionId = this.data.currentActionSheetAction_id
    let type = this.data.currentActionSheetAction_sessionType
    wx.cloud.callFunction({
      name: 'db',
      data: {
        type: 'getOriginalSessionData',
        id: sessionId,
        sessionType: type
      },
      success: function(res) {
        console.log(res.result)
        that.setData({
          'editSession.original': res.result[0].data[0],
          date: res.result[0].data[0].txdate,
          time: res.result[0].data[0].txtime,
          typeIndex: res.result[2],
          needUpdateId: sessionId
        })
        wx.hideLoading()
      },
      fail: console.error
    })

  },
  bindDateChange(e) {
    this.setData({
      date: e.detail.value,
    })
  },
  bindTimeChange(e) {
    this.setData({
      time: e.detail.value,
    })
  },
  bindTypeChange(e) {
    this.setData({
      typeIndex: e.detail.value
    })
  },
  refreshList(e) {
    var that = this
    console.log('test', e, this.data.optionType)
    if (e === "interview" || e === "physicalcheck" || e === "pilotschool"){
      var controlType = e
    }else{
      var controlType = this.data.optionType
    }
    if (controlType === "interview") {
      //获取面试场次列表
      wx.cloud.callFunction({
        name: 'db',
        data: {
          type: 'getAllInterview'
        },
        success: function(res) {
          console.log(res.result)
          that.setData({
            firstInterview: res.result[0].data,
            secondInterview: res.result[1].data,
            finalInterview: res.result[2].data,
            'amountTab.first': res.result[3],
            'amountTab.second': res.result[4],
            'amountTab.final': res.result[5]
          });
          wx.stopPullDownRefresh()
        },
        fail: console.error
      })
    } else if (controlType === "physicalcheck") {
      //获取体检场次列表
      wx.cloud.callFunction({
        name: 'db',
        data: {
          type: 'getAllPhysicalCheck'
        },
        success: function(res) {
          console.log(res.result)
          that.setData({
            firstInterview: res.result[0].data,
            secondInterview: res.result[1].data,
            'amountTab.first': res.result[2],
            'amountTab.second': res.result[3],
            'amountTab.total': res.result[4]
          });
          wx.stopPullDownRefresh()
        },
        fail: console.error
      })
    } else if (controlType === "pilotschool"){
      wx.cloud.callFunction({
        name: 'db',
        data: {
          type: 'getAllPilotSchool'
        },
        success: function (res) {
          console.log(res.result)
          that.setData({
            firstInterview: res.result[0].data,
            'amountTab.domestic': res.result[1],
            'amountTab.foreign': res.result[2],
            'amountTab.total': res.result[3]
          });
          wx.stopPullDownRefresh()
        },
        fail: console.error
      })
    }

  },
  formSubmit(e) {
    var that = this
    console.log(e.detail.value)
    let formData = e.detail.value
    if (!formData.address || !formData.place || !formData.liaisonOfficer || !formData.latitude || !formData.longitude || !formData.addressName) {
      this.setData({
        error: '请完整填写所有内容'
      })
    } else {
      let time = `${formData.time}:00`
      let stringDate = `${formData.date} ${time}`
      console.log(stringDate)
      let dateDate = stringDate.replace(/-/g, "/")
      let date = new Date(dateDate)
      console.log(date)
      if (this.data.optionType === 'interview') {
        wx.cloud.callFunction({
            name: 'db',
            data: {
              type: 'addSession',
              currentAction: that.data.currentAction,
              sessionType: that.data.typeArray_interview[formData.type],
              needUpdateId: that.data.needUpdateId,
              content: {
                address: formData.address,
                applicants: 0,
                city: formData.city,
                date: date,
                place: formData.place,
                liaisonOfficer: formData.liaisonOfficer,
                location: {
                  latitude: formData.latitude,
                  longitude: formData.longitude,
                  name: formData.addressName
                }
              }
            },
          }).then(res => {
            console.log(res.result)
            this.setData({
              newSessionShow: false,
              editSessionShow: false
            });
            wx.showToast({
              title: '录入成功',
            })
            this.refreshList()

          })
          .catch(console.error)
      } else if (this.data.optionType === 'physicalcheck') {
        wx.cloud.callFunction({
            name: 'db',
            data: {
              type: 'addSession',
              currentAction: that.data.currentAction,
              sessionType: that.data.typeArray_physicalCheck[formData.type],
              needUpdateId: that.data.needUpdateId,
              content: {
                address: formData.address,
                applicants: 0,
                city: formData.city,
                date: date,
                place: formData.place,
                liaisonOfficer: formData.liaisonOfficer,
                location: {
                  latitude: formData.latitude,
                  longitude: formData.longitude,
                  name: formData.addressName
                }
              }
            },
          }).then(res => {
            console.log(res.result)
            this.setData({
              newSessionShow: false,
              editSessionShow: false
            });
            wx.showToast({
              title: '录入成功',
            })
            this.refreshList()

          })
          .catch(console.error)
      }else{
        wx.cloud.callFunction({
          name: 'db',
          data: {
            type: 'addSession',
            currentAction: that.data.currentAction,
            needUpdateId: that.data.needUpdateId,
            sessionType: '航校面试',
            content: {
              address: formData.address,
              applicants: 0,
              city: formData.city,
              date: date,
              place: formData.place,
              liaisonOfficer: formData.liaisonOfficer,
              type:formData.type,
              location: {
                latitude: formData.latitude,
                longitude: formData.longitude,
                name: formData.addressName
              },
              schoolname:formData.schoolname,
              schooladdress:formData.schooladdress
            }
          },
        }).then(res => {
          console.log(res.result)
          this.setData({
            newSessionShow: false,
            editSessionShow: false
          });
          wx.showToast({
            title: '录入成功',
          })
          this.refreshList()

        })
          .catch(console.error)
      }

    }

  },

  onPullDownRefresh: function() {
    this.refreshList()
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