// pages/camera/camera.js
let constants = require('../../vendor/wafer2-client-sdk/lib/constants.js');
let SESSION_KEY = 'weapp_session_' + constants.WX_SESSION_MAGIC_ID;
let util = require('../../utils/util.js');
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
    let that = this;
    let question_id = wx.getStorageSync('question_id');
    let temp = wx.getStorageSync(SESSION_KEY);
    console.log('question_id' ,question_id);
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
    let that = this;
    if (that.data.btn_state) {
      console.log('start formSubmit...');
      console.log(e.detail.value.mark);
      that.setData({
        pic_list: that.data.tempFilePaths,
        textAreaValue: e.detail.value.mark,
        btn_state: false,
      });
      console.log('pic_list', that.data.pic_list);
      if (that.data.pic_list === '/images/icon/icon_camera.png' ||
        e.detail.value.mark === '') {
        util.showModel('提示', '请完善信息');
        that.setData({
          btn_state: true,
        })
      } else {
        let timestamp = new Date().getTime();
        console.log('timestamp', timestamp);
        timestamp = timestamp.toString();
        console.log('timestamp', timestamp);

        wx.cloud.uploadFile({
          cloudPath: timestamp, // 上传至云端的路径
          filePath: that.data.pic_list, // 小程序临时文件路径
          success: res => {
            // 返回文件 ID
            console.log(res.fileID);
            that.updataImg(res.fileID);
          },
          fail: res => {
            console.log(res);
          },
        });
      }
    }
  },

  updataImg: function (fileID) {
    let that = this;
    let temp = wx.getStorageSync(SESSION_KEY);

    wx.cloud.callFunction({
      name: 'help',
      data: {
        imgId: fileID,
        comments: that.data.textAreaValue,
        questionId: that.data.question_id,
        userInfo: temp.userInfo,
      },

      success: function (res) {
        // if (res.statusCode === '200') {
          console.log("任务post成功", res);
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
        // } else if (res.statusCode === '413') {
        //   console.log("图片大小过大");
        //   util.showModel('提示', '上传图片不能大于1M');
        //   that.setData({
        //     btn_state: true,
        //   })
        // }
        // else {
        //   console.log("任务post失败");
        //   util.showModel('error', '提交失败');
        //   that.setData({
        //     btn_state: true,
        //   })
        // }
      },
      fail: function (res) {
        console.log("任务post失败");
        util.showModel('error', '提交失败！');
        that.setData({
          btn_state: true,
        })
      },
    })
  },

  chooseimage: function () {
    let that = this;
    wx.showActionSheet({
      itemList: ['从相册中选择', '拍照'],
      itemColor: "#CED63A",
      success: function (res) {
        if (!res.cancel) {
          if (res.tapIndex === 0) {
            that.chooseWxImage('album')
          } else if (res.tapIndex === 1) {
            that.chooseWxImage('camera')
          }
        }
      }
    })
  },

  chooseWxImage: function (type) {
    let that = this;
    wx.chooseImage({
      sizeType: ['compressed'],
      sourceType: [type],
      success: function (res) {
        console.log('chooseWxImage', res);
        that.setData({
          tempFilePaths: res.tempFilePaths[0],
        })
      }
    })
  },
  /**
   * 分享页面
   */
  onShareAppMessage: function () {
    return {
      title: '看哪小程序',
      desc: '你想看哪，我帮你',
      path: '/pages/start/start?id=123',
      success: function (res) {
        console.log(res)
      },
      fail: function (res) {
        // 分享失败
        console.log(res)
      }
    }
  },
});
