// pages/answer/answer.js
var constants = require('../../vendor/wafer2-client-sdk/lib/constants.js');
var SESSION_KEY = 'weapp_session_' + constants.WX_SESSION_MAGIC_ID;
var util = require('../../utils/util.js')
Page({
  data: {
    dataSrc: {},
    master_userInfo: {},
    master_question: {},
    comments_userInfo: {},
    comments_answer: {},
    openID: '',
  },

  onLoad: function (options) {
    var that = this
    var commentsobj = []
    var masterobj = []
    var temp = wx.getStorageSync(SESSION_KEY)
    that.setData({
      openID: temp.userinfo.openId
    })
    try {
      wx.setStorageSync('question_id', options.question_id)
    } catch (e) {
    }
    console.log("options.question_id:" + options.question_id)
    wx.request({
      url: 'https://wudnq2cw.qcloud.la/weapp/secondpage/',
      method: 'GET',
      data: {
        questionID: options.question_id,
      },
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      success: function (res) {
        for (var i = 0; i < res.data.data.msg.answer.length; i++) {
          commentsobj[i] = JSON.parse(res.data.data.msg.answer[i].user_info);
        }
        masterobj = JSON.parse(res.data.data.msg.user_info);
        that.setData({
          master_userInfo: masterobj,
          master_question: res.data.data.msg.question,
          comments_userInfo: commentsobj,
          comments_answer: res.data.data.msg.answer,
        });
      }
    })
  },

  goToCamera: function () {
    var that = this
    if (that.data.master_userInfo.openId != that.data.openID) {
      wx.navigateTo({
        url: '/pages/camera/camera',
      });
    } else {
      util.showBusy('这任务就是你的')
    }
  },

  backToFirstPage: function () {
    wx.switchTab({
      url: '/pages/firstpage/firstpage',
    })
  },

  biggerphoto: function (event) {
    var srcList = new Array();
    var src = event.currentTarget.dataset.src;//获取data-src
    var imgList = event.currentTarget.dataset.list;//获取data-list
    srcList = imgList.split(',');
    wx.previewImage({
      current: src, // 当前显示图片的http链接
      urls: srcList // 需要预览的图片http链接列表
    })
  },
  openMap: function () {
    var that = this
    wx.openLocation({
      latitude: Number(that.data.master_question[0].latitude),
      longitude: Number(that.data.master_question[0].longitude),
      scale: 28
    })
  },
  addGold: function () {
  wx.showModal({
    title: '点赞',
    content: '觉得这问题很赞，花1金币能使他的问题更快地被完成',
    cancelText: '不就看看',
    confirmText:'花得值',
    success: function(res){
      if (res.confirm) {
        console.log('用户点击确定')
        // wx.request({
        //   url: '',
        // })
        util.showSuccess('替他/她/它感谢你了啦！')
      } else if (res.cancel) {
        console.log('用户点击取消')
      }
    }
  })

  }
})