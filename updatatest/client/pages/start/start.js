//login.js
//获取应用实例
let constants = require('../../vendor/wafer2-client-sdk/lib/constants.js');
let SESSION_KEY = 'weapp_session_' + constants.WX_SESSION_MAGIC_ID;
let app = getApp();

Page({
  data: {
    remind: '加载中',
    angle: 0,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    userInfo: {},
    showLoading: '',
  },

  onLoad: function (e) {
    let temp = wx.getStorageSync(SESSION_KEY);
    let that = this;
    that.setData({
      userInfo: temp.userInfo,
    })
  },

  checkGetSetting: function () {
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              console.log('获取用户信息成功！', res);
              wx.setStorageSync(SESSION_KEY, res);
            },
            fail: res => {
              console.log('获取用户信息失败！');
            }
          })
        }
      },
      fail: res => {
        console.log('未授权');
      }
    })
  },

  bindGetUserInfo: function (e) {
    let that = this;
    that.checkGetSetting();
    wx.cloud.callFunction({
      name: 'login',
      data: {
      },
      success: res => {
        wx.switchTab({
              url: '/pages/firstpage/firstpage',
        });
      },
      fail: res => {
        console.log(res);
      },
    })
  },

  onReady: function () {
    let that = this;
    setTimeout(function () {
      that.setData({
        remind: ''
      });
    }, 1000);
    wx.onAccelerometerChange(function (res) {
      let angle = -(res.x * 30).toFixed(1);
      if (angle > 14) { angle = 14; }
      else if (angle < -14) { angle = -14; }
      if (that.data.angle !== angle) {
        that.setData({
          angle: angle
        });
      }
    });
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
  }
});

