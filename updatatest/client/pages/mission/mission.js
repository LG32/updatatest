// pages/mission/mission.js
let constants = require('../../vendor/wafer2-client-sdk/lib/constants.js');
let SESSION_KEY = 'weapp_session_' + constants.WX_SESSION_MAGIC_ID;
Page({
  data: {
    mission_title: '',
    userInfo: {},
    mission_userInfo: {},
    mission: {},
    gold: "0",
    tips: '',
    newAnswer: {},
    mission_state: {},
  },

  onLoad: function (options) {
    console.log('onload:', options.mission_state);
    let that = this;
    let temp = wx.getStorageSync(SESSION_KEY);
    let gold = wx.getStorageSync('gold');
    that.setData({
      userInfo: temp.userInfo,
      gold: gold,
      mission_state: options.mission_state,
    });
    /**
     * 我发布的任务
     */
    if (options.mission_state === '1') {
      let title = '我发布的任务';
      let myMission = wx.getStorageSync('myMission');
      // let obj = [];
      // for (let i = 0; i < myMission.question.length; i++) {
      //   obj[i] = JSON.parse(myMission.user_info);
      // }
      // that.newMessage();
      that.setData({
        mission_title: title,
        mission: myMission,
        // mission_userInfo: obj,
        tips: '你还未发过任务。'
      })
    }
    /**
     * 未完成的任务
     */
    if (options.mission_state === "2") {
      let title = '未完成的任务';
      let unMission = wx.getStorageSync('unMission');
      // let obj = [];
      // for (let i = 0; i < unMission.question_userInfo.length; i++) {
      //   obj[i] = JSON.parse(unMission.question_userInfo[i][0].user_info);
      // }
      that.setData({
        mission_title: title,
        mission: unMission,
        // mission_userInfo: obj,
        tips: '没有未完成的任务，赶紧去接任务吧！'
      })
    }
    /**
     * 我帮助过的任务
     */
    if (options.mission_state === "3") {
      let title = '我帮助过的任务';
      let finishedMission = wx.getStorageSync('finishedMission');
      // let obj = [];
      // for (let i = 0; i < finishedMission.question_userInfo.length; i++) {
      //   obj[i] = JSON.parse(finishedMission.question_userInfo[i][0].user_info);
      // }
      that.setData({
        mission_title: title,
        mission: finishedMission,
        // mission_userInfo: obj,
        tips: '尚没有帮助过别人...'
      })
    }
  },
  /**
   * 新信息
   */
  newMessage: function () {
    let that = this;
    let oldMission = wx.getStorageSync('oldMission');
    let newMission = wx.getStorageSync('myMission');
    let newAnswer = [];
    console.log(oldMission);
    if (oldMission === '') {
      for (let i = 0; i < newMission.question.length; i++) {
        newAnswer[i] = newMission.question[i].answerSum - 0
      }
    } else {
      for (let i = 0; i < newMission.question.length; i++) {
        newAnswer[i] = newMission.question[i].answerSum - oldMission.question[i].answerSum
      }
    }
    that.setData({
      newAnswer: newAnswer,
    });
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
});
