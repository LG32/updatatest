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
    oldMission: {},
    sex: '',
    flag: '',
    signUpDate: ''
  },
  onLoad: function(options) {
    var that = this
    var temp = wx.getStorageSync(SESSION_KEY)
    var gold = wx.getStorageSync('gold')
    var signUpDate = wx.getStorageSync('signUpDate')
    var myDate = new Date()
    var nowDate = myDate.getFullYear().toString() + myDate.getMonth().toString() + myDate.getDate().toString()
    var flag = 0
    if (nowDate == signUpDate) {
      flag = 1
    }else{
      flag = 0
    }
    that.setData({
      skey: temp.skey,
      userInfo: temp.userInfo,
      gold: gold,
      signUpDate: signUpDate,
      flag: flag,
    })
    that.getMyMission()
    that.getUnMission()
    that.getFinishedMission()
    that.sexIs()
  },
  /**
   * 我发布的任务
   */
  getMyMission: function() {
    var that = this
    var oldMission = wx.getStorageSync('oldMission')
    wx.request({
      url: 'https://800321007.littlemonster.xyz/weapp/myrelease/',
      data: {
        skey: that.data.skey
      },
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      method: 'post',
      dataType: 'json',
      responseType: 'text',
      success: function(res) {
        console.log('getMyMission success...')
        console.log(res.data.data.msg)
        that.setData({
          myMission: res.data.data.msg,
          oldMission: oldMission
        })
        wx.setStorageSync('myMission', res.data.data.msg)
        wx.setStorageSync("oldMission", that.data.oldMission)
        that.getNewMesSum()
      },
      fail: function(res) {
        console.log('getMyMission fail...')
        console.log(res)
        // util.showSuccess('刷新失败')
      }
    })
  },
  /**
   * 未完成的任务
   */
  getUnMission: function() {
    var that = this
    wx.request({
      url: 'https://800321007.littlemonster.xyz/weapp/unfinished/',
      data: {
        skey: that.data.skey
      },
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      method: 'post',
      dataType: 'json',
      responseType: 'text',
      success: function(res) {
        console.log('getUnMission success...')
        console.log(res.data.data.msg)
        wx.setStorageSync('unMission', res.data.data.msg)
      },
      fail: function(res) {
        console.log('getUnMission fail...')
        console.log(res)
      }
    })
  },
  /**
   * 我帮助过的任务
   */
  getFinishedMission: function() {
    var that = this
    wx.request({
      url: 'https://800321007.littlemonster.xyz/weapp/helped/',
      data: {
        skey: that.data.skey
      },
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      method: 'POST',
      dataType: 'json',
      responseType: 'text',
      success: function(res) {
        console.log('getFinishedMission success...')
        console.log(res.data.data.msg)
        wx.setStorageSync('finishedMission', res.data.data.msg)
      },
      fail: function(res) {
        console.log('getFinishedMission fail...')
        console.log(res)
      }
    })
  },
  /**
   * 是否有新数据
   */
  getNewMesSum: function() {
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

  getMyMesSum: function() {
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
  qianDao: function() {
    var that = this
    var myDate = new Date()
    var signUpDate = myDate.getFullYear().toString() + myDate.getMonth().toString() + myDate.getDate().toString()
    console.log(signUpDate)
    wx.setStorageSync("signUpDate", signUpDate)
    wx.request({
      url: 'https://800321007.littlemonster.xyz/weapp/sign/',
      data: {
        skey: that.data.skey
      },
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      method: 'POST',
      dataType: 'json',
      responseType: 'text',
      success: function(res) {
        console.log('qian dao success...')
        console.log(res)
        util.showSuccess(res.data.data.msg[0].mes)
        that.setData({
          gold: res.data.data.msg[0].gold,
          flag: 1
        })
        wx.setStorageSync('gold', that.data.gold)
      },
      fail: function(res) {
        console.log('qian dao fail...')
        console.log(res)
        util.showModel('提示', '签到失败');
      }
    })
  },
  /**
   * 分享页面
   */
  onShareAppMessage: function() {
    return {
      title: '看哪小程序',
      desc: '你想看哪，我帮你',
      path: '/pages/start/start?id=123',
      success: function(res) {
        console.log(res)
      },
      fail: function(res) {
        // 分享失败
        console.log(res)
      }
    }
  },
  /**
   * 下拉刷新
   */
  onPullDownRefresh: function() {
    var that = this
    that.getMyMission()
    that.getUnMission()
    that.getFinishedMission()
    wx.stopPullDownRefresh()
  },
  /**
   * 判断性别
   */
  sexIs: function() {
    var that = this
    var sex = ''
    if (that.data.userInfo.gender == 1) {
      sex = 'Gentleman'
    }
    if (that.data.userInfo.gender == 2) {
      sex = 'Madam'
    }
    that.setData({
      sex: sex
    })
  },
})
