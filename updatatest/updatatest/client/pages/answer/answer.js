// pages/answer/answer.js

Page({
  data: {
    dataSrc: {},
    master_userInfo: {},
    master_question: {},
    comments_userInfo: {},
    comments_answer: {},
  },
  goToCamera: function () {
    wx.navigateTo({
      url: '/pages/camera/camera',
    });
  },
  backToFirstPage: function () {
    wx.switchTab({
      url: '/pages/firstpage/firstpage',
    })
  },
  onLoad: function (options) {
    var that = this
    var commentsobj = []
    var masterobj = []
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
  onShareAppMessage: function () {
    return {
      title: '回味小程序',
      desc: '带你寻找记忆中的地方',
      path: '/pages/index/index?id=123',
      success: function (res) {
        console.log(res)
        // console.log
      },
      fail: function (res) {
        // 分享失败
        console.log(res)
      }
    }
  },
  // addGold: function () {
  //   var that = this

  // }
})