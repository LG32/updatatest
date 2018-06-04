// pages/my/my.js
var util = require('../../utils/util.js')
var constants = require('../../vendor/wafer2-client-sdk/lib/constants.js');
var SESSION_KEY = 'weapp_session_' + constants.WX_SESSION_MAGIC_ID;
Page({
  data: {
    userInfo: {},
    skey: '',
    gold: "0",
    newMesSum: '0',
    myMesSum: '',
    myMission: {},
  },
  onLoad: function (options) {
    var that = this
    var temp = wx.getStorageSync(SESSION_KEY)
    var gold = wx.getStorageSync('gold')
    that.setData({
      skey: temp.skey,
      userInfo: temp.userinfo,
      gold: gold,
    })
    that.getMyMission()
    that.getUnMission()
    that.getFinishedMission()
  },
  /**
   * 我发布的任务
   */
  getMyMission: function () {
    var that = this
    wx.request({
      url: 'https://wudnq2cw.qcloud.la/weapp/myrelease/',
      data: {
        skey: that.data.skey
      },
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      method: 'post',
      dataType: 'json',
      responseType: 'text',
      success: function (res) {
        console.log('getMyMission success...')
        console.log(res.data.data.msg)
        that.setData({
          myMission: res.data.data.msg
        })
        wx.setStorageSync('myMission', res.data.data.msg)
        that.getNewMesSum()
        // util.showSuccess('刷新成功')
      },
      fail: function (res) {
        console.log('getMyMission fail...')
        console.log(res)
        // util.showSuccess('刷新失败')
      }
    })
  },
  /**
   * 未完成的任务
   */
  getUnMission: function () {
    var that = this
    wx.request({
      url: 'https://wudnq2cw.qcloud.la/weapp/unfinished/',
      data: {
        skey: that.data.skey
      },
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      method: 'post',
      dataType: 'json',
      responseType: 'text',
      success: function (res) {
        console.log('getUnMission success...')
        console.log(res.data.data.msg)
        wx.setStorageSync('unMission', res.data.data.msg)
      },
      fail: function (res) {
        console.log('getUnMission fail...')
        console.log(res)
      }
    })
  },
  /**
   * 我帮助过的任务
   */
  getFinishedMission: function () {
    var that = this
    wx.request({
      url: 'https://wudnq2cw.qcloud.la/weapp/helped/',
      data: {
        skey: that.data.skey
      },
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      method: 'POST',
      dataType: 'json',
      responseType: 'text',
      success: function (res) {
        console.log('getFinishedMission success...')
        console.log(res.data.data.msg)
        wx.setStorageSync('finishedMission', res.data.data.msg)
      },
      fail: function (res) {
        console.log('getFinishedMission fail...')
        console.log(res)
      }
    })
  },
  /**
   * 是否有新数据
   */
  getNewMesSum: function () {
    var that = this
    console.log('start getNewMesSum...')
    that.getMyMesSum()
    var oldMesSum = 0
    oldMesSum = wx.getStorageSync('MESSUM')
    if (oldMesSum == undefined) {
      oldMesSum = 0
    } else {
      var newMesSum = that.data.myMesSum - oldMesSum
    }
    that.setData({
      newMesSum: newMesSum
    })
    wx.setStorageSync('MESSUM', that.data.myMesSum)
  },

  getMyMesSum: function () {
    var that = this
    var myMesSum = 0
    console.log('start getMyMesSum...')
    for (var i = 0; i < that.data.myMission.question.length; i++) {
      myMesSum = myMesSum + that.data.myMission.question[i].answerSum
    }
    that.setData({
      myMesSum: myMesSum
    })
  },
  /**
   * 每日签到
   */
  qianDao: function () {
    var that = this
    wx.request({
      url: 'https://wudnq2cw.qcloud.la/weapp/sign/',
      data: {
        skey: that.data.skey
      },
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      method: 'POST',
      dataType: 'json',
      responseType: 'text',
      success: function (res) {
        console.log('qian dao success...')
        console.log(res)
        util.showSuccess(res.data.data.msg[0].mes)
        that.setData({
          gold: res.data.data.msg[0].gold
        })
        wx.setStorageSync('gold', that.data.gold)
      },
      fail: function (res) {
        console.log('qian dao fail...')
        console.log(res)
        util.showModel('提示', '签到失败');
      }
    })
  },
  /**
   * 分享
   */
  onShareAppMessage: function () {
    return {
      title: '回味小程序',
      desc: '带你寻找记忆中的地方',
      path: '/pages/index/index?id=123',
      success: function (res) {
        console.log(res)
      },
      fail: function (res) {
        console.log(res)
      }
    }
  },
  /**
   * 下拉刷新
   */
  onPullDownRefresh: function () {
    var that = this
    that.getMyMission()
    that.getUnMission()
    that.getFinishedMission()
    wx.stopPullDownRefresh()
  },
})