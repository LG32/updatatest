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
  },
  // goToIndex: function () {
  //   wx.switchTab({
  //     url: '/pages/firstpage/firstpage',
  //   });
  // },
  onLoad: function (e) {
    var that = this
    // wx.setNavigationBarTitle({
    //   title: wx.getStorageSync('mallName')
    // })
    // app.getUserInfo(function (userInfo) {
    //   that.setData({
    //     userInfo: userInfo
    //   })
    // })
    // 查看是否授权
    // wx.getSetting({
    //   success: function (res) {
    //     if (res.authSetting['scope.userInfo']) {
    //       // 已经授权，可以直接调用 getUserInfo 获取头像昵称
    //       app.getUserInfo(function (userInfo) {
    //         that.setData({
    //           userInfo: userInfo
    //         })
    //         console.log(userInfo)
    //       })
    //     }
    //   }
    // })
    console.log(wx.getStorageSync(SESSION_KEY))
  },
  // 用户登录示例
  login: function () {
    if (this.data.logged) return
    console.log('正在登录')
    var that = this

    // 调用登录接口
    qcloud.login({
      success(result) {
        if (result) {
          console.log('登录成功')
          that.setData({
            userInfo: result,
            logged: true
          })
        } else {
          // 如果不是首次登录，不会返回用户信息，请求用户信息接口获取
          qcloud.request({
            url: config.service.requestUrl,
            login: true,
            success(result) {
              console.log('登录成功')
              that.setData({
                userInfo: result.data.data,
                logged: true
              })
            },
            fail(error) {
              console.log('request fail', error)
            }
          })
        }
      },
      fail(error) {
        console.log('登录失败', error)
      }
    })
  },

  bindGetUserInfo: function (e) {
    if (this.data.logged) {
      wx.switchTab({
        url: '/pages/firstpage/firstpage',
      });
      return;
    }
    console.log('bind开始')
    var that = this;
    var userInfo = e.detail.userInfo;

    // 查看是否授权
    wx.getSetting({
      success: function (res) {
        if (res.authSetting['scope.userInfo']) {
          //console.log(res.authSetting['scope.userInfo']);
          console.log('getSetting success')
          // 检查登录是否过期
          wx.checkSession({
            success: function () {
              console.log('bind getSetting success')
              // 登录态未过期
              that.setData({
                userInfo: userInfo,
                logged: true
              })
              wx.switchTab({
                url: '/pages/firstpage/firstpage',
              });
            },
            fail: function () {
              console.log('bind getSetting fail')
              // qcloud.clearSession();
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
    wx.login({
      success: function (loginResult) {
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
            console.log('登录失败', error)
          }
        });
      },
      fail: function (loginError) {
        console.log('登录失败', loginError)
      },
    });

  },
  // bindGetUserInfo: function (e) {
  //   console.log(e.detail.userInfo)
  // },
  onShow: function () {

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
})

