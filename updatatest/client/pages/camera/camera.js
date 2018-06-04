// pages/camera/camera.js
var constants = require('../../vendor/wafer2-client-sdk/lib/constants.js');
var SESSION_KEY = 'weapp_session_' + constants.WX_SESSION_MAGIC_ID;
var util = require('../../utils/util.js')
Page({
  /**
   * 页面的初始数据
   */
  data: {
    tempFilePaths: '/images/icon/icon_camera.png ',
    focus: 'false',
    textAreaValue: '',
    pic_list: '',
    question_id: '',
    skey: '',
    btn_state: 'true',
  },

  onLoad: function () {
    var that = this
    var question_id = wx.getStorageSync('question_id')
    var temp = wx.getStorageSync(SESSION_KEY)
    console.log(question_id)
    that.setData({
      question_id: question_id,
      skey: temp.skey,
    })
  },

  bindButtonTap: function () {
    this.setData({
      focus: true
    })
  },
  /**
   * 提交表格
   */
  formSubmit: function (e) {
    var that = this
    if (that.data.btn_state) {
      console.log('start formSubmit...')
      console.log(e.detail.value.mark);
      that.setData({
        pic_list: that.data.tempFilePaths,
        textAreaValue: e.detail.value.mark,
        btn_state: false,
      })
      console.log(that.data.pic_list)
      if (that.data.pic_list == '/images/icon/icon_camera.png' ||
        e.detail.value.mark == '') {
        util.showModel('提示', '请完善信息');
        that.setData({
          btn_state: true,
        })
      } else {
        wx.uploadFile({
          url: 'https://wudnq2cw.qcloud.la/weapp/help',
          filePath: that.data.pic_list,
          name: 'file',
          header: {
            "content-type": "multipart/form-data"
          },
          formData: {
            skey: that.data.skey,
            comments: that.data.textAreaValue,
            questionID: that.data.question_id,
          },
          success: function (res) {
            console.log(res)
            if (res.statusCode == '200') {
              console.log("任务post成功")
              wx.showToast({
                title: '提交成功',
                icon: 'success',
                mask: true,
                complete: function () {
                  setTimeout(function () {
                    wx.reLaunch({
                      url: '/pages/my/my'
                    })
                  }, 2000)
                }
              })
            } else if (res.statusCode == '413') {
              console.log("图片大小过大")
              util.showModel('提示', '上传图片不能大于1M')
              that.setData({
                btn_state: true,
              })
            }
            else {
              console.log("任务post失败")
              util.showModel('error', '提交失败')
              that.setData({
                btn_state: true,
              })
            }
          },
          fail: function (res) {
            console.log("任务post失败")
            util.showModel('error', '提交失败！')
            that.setData({
              btn_state: true,
            })
          },
        })
      }
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
      sizeType: ['compressed'],
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