// pages/mission/mission.js
var constants = require('../../vendor/wafer2-client-sdk/lib/constants.js');
var SESSION_KEY = 'weapp_session_' + constants.WX_SESSION_MAGIC_ID;
Page({
  data: {
    mission_title: {
    },
    userInfo: {},
    mission_userInfo: {},
    mission: {},
    gold: "100",
  },

  onLoad: function (options) {
    var that = this
    var temp = wx.getStorageSync(SESSION_KEY)
    that.setData({
      userInfo: temp.userinfo,
    })
    /**
     * 我发布的任务
     */
    if (options.mission_state == 1) {
      var title = '我发布的任务'
      var myMission = wx.getStorageSync('myMission')
      var obj = []
      console.log('myMission:' + myMission.question.length)
      for (var i = 0; i < myMission.question.length; i++) {
        obj[i] = JSON.parse(myMission.user_info);
      }
      that.setData({
        mission_title: title,
        mission: myMission.question,
        mission_userInfo: obj,
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
      })
    }
  },

})