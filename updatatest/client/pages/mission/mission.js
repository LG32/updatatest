// pages/mission/mission.js
var constants = require('../../vendor/wafer2-client-sdk/lib/constants.js');
var SESSION_KEY = 'weapp_session_' + constants.WX_SESSION_MAGIC_ID;
Page({
  data: {
    mission_title: {},
    userInfo: {},
    mission_userInfo: {},
    mission: {},
    gold: "0",
    tips: '',
    newAnswer: {},
    mission_state: {},
  },

  onLoad: function (options) {
    var that = this
    var temp = wx.getStorageSync(SESSION_KEY)
    var gold = wx.getStorageSync('gold')
    that.setData({
      userInfo: temp.userinfo,
      gold: gold,
      mission_state: options.mission_state,
    })
    /**
     * 我发布的任务
     */
    if (options.mission_state == 1) {
      var title = '我发布的任务'
      var myMission = wx.getStorageSync('myMission')
      var obj = []
      for (var i = 0; i < myMission.question.length; i++) {
        obj[i] = JSON.parse(myMission.user_info);
      }
      that.newMessage()
      that.setData({
        mission_title: title,
        mission: myMission.question,
        mission_userInfo: obj,
        tips: '你还未发过任务。'
      })
    }
    /**
     * 未完成的任务
     */
    if (options.mission_state == 2) {
      var title = '未完成的任务'
      var unMission = wx.getStorageSync('unMission')
      var obj = []
      for (var i = 0; i < unMission.question_userInfo.length; i++) {
        obj[i] = JSON.parse(unMission.question_userInfo[i][0].user_info);
      }
      that.setData({
        mission_title: title,
        mission: unMission.question,
        mission_userInfo: obj,
        tips: '没有未完成的任务，赶紧去接任务吧！'
      })
    }
    /**
     * 我帮助过的任务
     */
    if (options.mission_state == 3) {
      var title = '我帮助过的任务'
      var finishedMission = wx.getStorageSync('finishedMission')
      var obj = []
      for (var i = 0; i < finishedMission.question_userInfo.length; i++) {
        obj[i] = JSON.parse(finishedMission.question_userInfo[i][0].user_info);
      }
      that.setData({
        mission_title: title,
        mission: finishedMission.question,
        mission_userInfo: obj,
        tips: '尚没有帮助过别人...'
      })
    }
  },
  /**
   * 新信息
   */
  newMessage: function () {
    var that = this
    var oldMission = wx.getStorageSync('oldMission')
    var newMission = wx.getStorageSync('myMission')
    var newAnswer = []
    console.log(oldMission)
    if (oldMission == '') {
      for (var i = 0; i < newMission.question.length; i++) {
        newAnswer[i] = newMission.question[i].answerSum - 0
      }
    } else {
      for (var i = 0; i < newMission.question.length; i++) {
        newAnswer[i] = newMission.question[i].answerSum - oldMission.question[i].answerSum
      }
    }
    that.setData({
      newAnswer: newAnswer,
    })
    wx.setStorageSync('oldMission', newMission)
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
})