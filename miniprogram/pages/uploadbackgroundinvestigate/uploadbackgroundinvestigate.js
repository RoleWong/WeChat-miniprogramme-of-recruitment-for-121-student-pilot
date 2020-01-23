function isEmpty(str) {
  if (str == null || typeof str == "undefined" || str.trim() == "") {
    return false;
  } else {
    return true;
  }
}

Page({

  data: {
    photos: {
      informationtempFilePaths: '',
      certificationtempFilePaths: '',
      confirmationtempFilePaths: ''
    },

    dialogShow: false,
    buttons: [{
      text: '取消'
    }, {
      text: '提交'
    }],
    uploadPhotos: {

    }

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

  },

  onSubmit: function() {

    var a = isEmpty(this.data.photos.informationtempFilePaths)
    var b = isEmpty(this.data.photos.confirmationtempFilePaths)
    var c = isEmpty(this.data.photos.certificationtempFilePaths)

    console.log(a && b && c)

    if (a && b && c) {
      this.setData({
        dialogShow: true
      })
    } else {
      wx.showToast({
        title: '请上传所有页面再提交',
        icon: 'none',
        duration: 1000
      })
    }
  },

  tapDialogButton(e) {
    var that = this
    var tempUploadPhotos = {
      informationtempFilePaths: '',
      certificationtempFilePaths: '',
      confirmationtempFilePaths: ''
    }
    this.setData({
      dialogShow: false,
    });

    if (e.detail.index == '1') {
      wx.showToast({
        title: '背调资料上传中',
        icon:'loading',
        duration:20000
      })
      wx.cloud.callFunction({
        name: 'db',
        data: {
          type: 'getCV'
        },
        success: async function(res) {
          var idcard = res.result.data[0].cv_document.idcard
          var currentPhoto = that.data.photos
          var sum = 0
          for (var index in currentPhoto) {
            var cloudPath = 'backgroundInvestigation/' + idcard + index + currentPhoto[index].match(/\.[^.]+?$/)[0];
            var filePath = 'that.data.photos.' + index
            if (index == 'informationtempFilePaths') {
              var filePath = that.data.photos.informationtempFilePaths
            } else if (index == 'certificationtempFilePaths') {
              var filePath = that.data.photos.certificationtempFilePaths
            } else if (index == 'confirmationtempFilePaths') {
              var filePath = that.data.photos.confirmationtempFilePaths
            }

            await wx.cloud.uploadFile({
              cloudPath: cloudPath,
              filePath: filePath,
            }).then(res => {

              //利用闭包原理，for循环中定义一个函数，并立即传递index进去执行，而不是把变量直接绑定，因为这只会绑定变量index，而非index的值。
              function write(i) {
                tempUploadPhotos[i] = res.fileID
              }
              write(index)

              sum = sum + 1;
              if (sum === 3) {
                //上传完成，继续执行写入数据库操作
                console.log(tempUploadPhotos)
                wx.cloud.callFunction({
                  name: 'db',
                  data: {
                    type: 'writeBackgroundInvestigation',
                    uploadPhotos: tempUploadPhotos
                  },
                  success: async function(res) {
                    console.log('写入背景调查完成', res)

                    wx.redirectTo({
                      url: '../ielts/ielts',
                      success: function(res) {},
                      fail: function(res) {},
                      complete: function(res) {},
                    })

                  },
                  fail: console.error
                })
              }

            }).catch(error => {
              console.log('上传失败', error)
            })
          }

        },
        fail: console.error
      })
    }
  },

  uploadImg: function(e) {
    var type = e.currentTarget.dataset.index
    var that = this;
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success(res) {
        // tempFilePath可以作为img标签的src属性显示图片
        const tempFilePaths = res.tempFilePaths
        if (type === "certification") {
          that.setData({
            'photos.certificationtempFilePaths': tempFilePaths[0],
          });
        } else if (type === "information") {
          that.setData({
            'photos.informationtempFilePaths': tempFilePaths[0],
          });
        } else if (type === "confirmation") {
          that.setData({
            'photos.confirmationtempFilePaths': tempFilePaths[0],
          })
        }
      }
    })
  },
})