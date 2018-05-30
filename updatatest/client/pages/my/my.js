// pages/my/my.js
var constants = require('../../vendor/wafer2-client-sdk/lib/constants.js');
var SESSION_KEY = 'weapp_session_' + constants.WX_SESSION_MAGIC_ID;
Page({
  data: {
    userInfo: {},
    skey: '',
    gold: "100",
    newMesSum: '0',
    myMesSum: '',
    myMission: {},
  },


  onLoad: function (options) {
    var that = this
    var temp = wx.getStorageSync(SESSION_KEY)
    that.setData({
      skey: temp.skey,
      userInfo: temp.userinfo,
    })
    that.getMyMission()
    that.getUnMission()
    that.getFinishedMission()
  },

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
        console.log('start getNewMesSum...')
        that.getNewMesSum()
      },
      fail: function (res) {
        console.log('getMyMission fail...')
        console.log(res)
      }
    })
  },

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
      method: 'post',
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

  getNewMesSum: function () {
    var that = this
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
    for (var i = 0; i < that.data.myMission.length; i++) {
      myMesSum = myMesSum + that.data.myMission[i].answerSum
    }
    that.setData({
      myMesSum: myMesSum
    })
  },

  qianDao: function(){
    var myDate = new Date();
    var nowDate = myDate.getFullYear + myDate.getMonth + myDate.getDay
    var that = this
    var lastDate = wx.getStorageSync('date')
    console.log('start qianDao...')
    console.log(nowDate)
  }
})