// pages/my/my.js
let util = require('../../utils/util.js');
let constants = require('../../vendor/wafer2-client-sdk/lib/constants.js');
let SESSION_KEY = 'weapp_session_' + constants.WX_SESSION_MAGIC_ID;
Page({
  data: {
    userInfo: {},
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
    let that = this;
    let temp = wx.getStorageSync(SESSION_KEY);
    let gold = wx.getStorageSync('gold');
    let signUpDate = wx.getStorageSync('signUpDate');
    let myDate = new Date();
    let nowDate = myDate.getFullYear().toString() + myDate.getMonth().toString() + myDate.getDate().toString()
    let flag = 0;
    if (nowDate === signUpDate) {
      flag = 1
    }else{
      flag = 0
    }
    that.setData({
      userInfo: temp.userInfo,
      gold: gold,
      signUpDate: signUpDate,
      flag: flag,
    });
    that.getMyMission();
    that.getUnMission();
    that.getFinishedMission();
    that.sexIs()
  },
  /**
   * 我发布的任务
   */
  getMyMission: function() {
    let that = this;
    let oldMission = wx.getStorageSync('oldMission');

    wx.cloud.callFunction({
      name: 'myrelease',
      data: {
      },
      success: function(res) {
        console.log('getMyMission success...', res);
        that.setData({
          myMission: res.result.data,
          oldMission: oldMission
        });
        wx.setStorageSync('myMission', res.result.data);
        wx.setStorageSync("oldMission", that.data.oldMission);
        // that.getNewMesSum()
      },
      fail: function(res) {
        console.log('getMyMission fail...');
        console.log(res)
        // util.showSuccess('刷新失败')
      }
    });
  },
  /**
   * 未完成的任务
   */
  getUnMission: function() {
    wx.cloud.callFunction({
      name: 'unfinished',
      data: {},
      success: function(res) {
        console.log();
        console.log('getUnMission success...', res);
        wx.setStorageSync('unMission', res.result.data)
      },
      fail: function(res) {
        console.log('getUnMission fail...', res);
      }
    });
  },
  /**
   * 我帮助过的任务
   */
  getFinishedMission: function() {
    wx.cloud.callFunction({
      name: 'helped',
      data: {},
      success: function(res) {
        console.log('getFinishedMission success...', res.result.data);
        wx.setStorageSync('finishedMission', res.result.data[0])
      },
      fail: function(res) {
        console.log('getFinishedMission fail...');
        console.log(res)
      }
    });
  },
  /**
   * 是否有新数据
   */
  getNewMesSum: function() {
    let that = this;
    console.log('start getNewMesSum...');
    that.getMyMesSum();
    let oldMesSum = 0;
    oldMesSum = wx.getStorageSync('MESSUM');
    if (oldMesSum === undefined) {
      oldMesSum = 0
    } else {
      let newMesSum = that.data.myMesSum - oldMesSum
    }
    that.setData({
      newMesSum: newMesSum
    });
    wx.setStorageSync('MESSUM', that.data.myMesSum)
  },

  getMyMesSum: function() {
    let that = this;
    let myMesSum = 0;
    console.log('start getMyMesSum...');
    for (let i = 0; i < that.data.myMission.length; i++) {
      myMesSum = myMesSum + that.data.myMission[i].answerSum
    }
    that.setData({
      myMesSum: myMesSum
    })
  },
  /**
   * 每日签到
   */
  qianDao: function() {
    let that = this;
    let myDate = new Date();
    let signUpDate = myDate.getFullYear().toString() + myDate.getMonth().toString() + myDate.getDate().toString()
    console.log(signUpDate);
    wx.setStorageSync("signUpDate", signUpDate);
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
        console.log('qian dao success...');
        console.log(res);
        util.showSuccess(res.data.data.msg[0].mes);
        that.setData({
          gold: res.data.data.msg[0].gold,
          flag: 1
        });
        wx.setStorageSync('gold', that.data.gold)
      },
      fail: function(res) {
        console.log('qian dao fail...');
        console.log(res);
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
    let that = this;
    that.getMyMission();
    that.getUnMission();
    that.getFinishedMission();
    wx.stopPullDownRefresh()
  },
  /**
   * 判断性别
   */
  sexIs: function() {
    let that = this;
    let sex = '';
    if (that.data.userInfo.gender === 1) {
      sex = 'Gentleman'
    }
    if (that.data.userInfo.gender === 2) {
      sex = 'Madam'
    }
    that.setData({
      sex: sex
    })
  },
});
