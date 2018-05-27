// pages/camera/camera.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tempFilePaths: '/images/icon/icon_camera.png ',
    focus: 'false',
    textAreaValue: '',
    pic_list: {},
  },

  bindButtonTap: function () {
    this.setData({
      focus: true
    })
  },

  formSubmit: function (e) {
    var that = this
    console.log(e.detail.value);
    that.setData({
      pic_list: that.data.tempFilePaths,
    })
    if (that.data.pic_list == '/images/icon/icon_camera.png' ||
      e.detail.value.mark == '') {
      wx.showToast({
        title: '请完善信息',
        icon: 'loading',
        duration: 2000
      })
    } else {
      wx.request({
        url: 'https://wudnq2cw.qcloud.la/weapp/help/',
        data: {
          skey: that.data.skey,
          description: e.detail.value.mark,
          pic_list: that.data.Pic_list,
        },
        header: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        method: 'post',
        dataType: 'json',
        responseType: 'text',

        success: function (res) {
          if (res.data.code == '0') {
            console.log("任务post成功")
            console.log(res.data)
            wx.showToast({
              title: '提交成功',
              icon: 'success',
              duration: 2000,
              complete: function () {
                setTimeout(function () {
                  wx.reLaunch({
                    url: '/pages/my/my'
                  })
                }, 2000)
              }
            })
          }
          else {
            console.log("任务post失败")
            wx.showToast({
              title: '提交失败',
              icon: 'loading',
              duration: 2000,
            })
          }
        },

        fail: function (res) {
          console.log("任务post失败")
          wx.showToast({
            title: '提交失败',
            icon: 'loading',
            duration: 2000,
          })
        },
      })
    }
  },
  chooseimage: function () {
    var that = this;
    wx.showActionSheet({
      itemList: ['从相册中选择', '拍照'],
      itemColor: "#CED63A",
      success: function (res) {
        if (!res.cancel) {
          if (res.tapIndex == 0) {
            that.chooseWxImage('album')
          } else if (res.tapIndex == 1) {
            that.chooseWxImage('camera')
          }
        }
      }
    })

  },
  chooseWxImage: function (type) {
    var that = this;
    wx.chooseImage({
      sizeType: ['original', 'compressed'],
      sourceType: [type],
      success: function (res) {
        console.log(res);
        that.setData({
          tempFilePaths: res.tempFilePaths[0],
        })
      }
    })
  }
})