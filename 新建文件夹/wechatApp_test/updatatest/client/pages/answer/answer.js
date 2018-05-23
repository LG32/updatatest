// pages/answer/answer.js

Page({
  data: {
    dataSrc: {},
    master: {},
    comments: {},
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
    console.log("options.question_id:" + options.question_id)
    wx.request({
      url: 'http://127.0.0.1/testdata/' + options.question_id + '.json',
      method: 'GET',
      data: {},
      header: {
        'Accept': 'application/json'
      },
      success: function (res) {
        that.setData({
          master: res.data.data.master,
          comments: res.data.data.comments
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
      latitude: Number(that.data.master[0].latitude),
      longitude: Number(that.data.master[0].longitude),
      scale: 28
    })
  }
})