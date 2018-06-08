//login.js
//获取应用实例
var qcloud = require('../../vendor/wafer2-client-sdk/index.js')
var config = require('../../config.js')
var constants = require('../../vendor/wafer2-client-sdk/lib/constants.js');
var SESSION_KEY = 'weapp_session_' + constants.WX_SESSION_MAGIC_ID;
var app = getApp();

Page({
  data: {
    remind: '加载中',
    angle: 0,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    userInfo: {},
    showLoading: '',
  },

  onLoad: function (e) {
    var temp = wx.getStorageSync(SESSION_KEY)
    var that = this
    that.setData({
      userInfo: temp.userinfo,
    })
  },
  bindGetUserInfo: function (e) {
    var that = this;
    that.setData({
      showLoading: 'true'
    })
    console.log('start bindGetUserInfo')
    var userInfo = e.detail.userInfo;
    // 查看是否授权
    wx.getSetting({
      success: function (res) {
        if (res.authSetting['scope.userInfo']) {
          // 检查登录是否过期
          wx.checkSession({
            success: function () {
              var temp = wx.getStorageSync(SESSION_KEY)
              console.log('bind checkSetting success')
              console.log(temp)
              // 登录态未过期
              console.log(userInfo)
              that.setData({
                userInfo: userInfo,
                logged: true
              })
              if (temp == '') {
                //登录态未过期，但本地无用户信息
                console.log('本地数据获取失败')
                var options = {
                  encryptedData: e.detail.encryptedData,
                  iv: e.detail.iv,
                  userInfo: userInfo
                }
                that.doLogin(options)
              } else {
                console.log('本地数据获取成功')
                wx.switchTab({
                  url: '/pages/firstpage/firstpage',
                });
              }
            },
            fail: function () {
              console.log('bind checkSetting fail')
              qcloud.clearSession();
              // 登录态已过期，需重新登录
              var options = {
                encryptedData: e.detail.encryptedData,
                iv: e.detail.iv,
                userInfo: userInfo
              }
              that.doLogin(options);
            },
          });
        } else {
          console.log('未授权')
          wx.showModal({
            title: '授权提示',
            content: '小程序需要您的微信授权才能使用哦~ 错过授权页面的处理方法：删除小程序->重新搜索进入->点击授权按钮'
          })
        }
      },
      fail: function () {
        console.log('getSetting fail')
      }
    });
  },

  doLogin: function (options) {
    var that = this;
    console.log('doLogin')
    console.log(options)
    wx.login({
      success: function (loginResult) {
        console.log('login success')
        console.log(loginResult)
        var loginParams = {
          code: loginResult.code,
          encryptedData: options.encryptedData,
          iv: options.iv,
        }
        qcloud.requestLogin({
          loginParams, success(e) {
            console.log('成功')
            that.setData({
              userInfo: options.userInfo,
              logged: true
            })
            console.log(options)
            wx.switchTab({
              url: '/pages/firstpage/firstpage',
            });
          },
          fail(error) {
            console.log('requestLogin登录失败', error)
            wx.showModal({
              title: '登录提示',
              content: '登录失败，网络状态似乎不太好',
              showCancel: false,
              success: function (res) {
                if (res.confirm) {
                  console.log('用户点击确定')
                  that.setData({
                    showLoading: ''
                  })
                } 
              }
            })
          }
        });
      },
      fail: function (loginError) {
        console.log('Login登录失败', loginError)
      },
    });
  },
  onReady: function () {
    var that = this;
    setTimeout(function () {
      that.setData({
        remind: ''
      });
    }, 1000);
    wx.onAccelerometerChange(function (res) {
      var angle = -(res.x * 30).toFixed(1);
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
      path: '/pages/index/index?id=123',
      success: function (res) {
        console.log(res)
      },
      fail: function (res) {
        // 分享失败
        console.log(res)
      }
    }
  }
})

