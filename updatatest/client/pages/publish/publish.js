// pages/publish/publish.js
var constants = require('../../vendor/wafer2-client-sdk/lib/constants.js');
var SESSION_KEY = 'weapp_session_' + constants.WX_SESSION_MAGIC_ID;

Page({
  data: {
    userInfo: {
      // avatarUrl: "https://wx.qlogo.cn/mmopen/vi_32/8wia9K3Z9baKviaRHibq47d4gZPiakzKYx1ylySrpwfBMmkkiaDJQ68CsmFcVD08NAfib5peVmhDTIQ1ZmeRLUDCs7dg/132",
      // nickName: "伊利丹",
    },
    skey: '',
    publish: {},
    hasLocation: 'false',
    location: {},
    address: '',
    goldsNumber: '10',
    goldsNumMin: '0',
    goldsNumMax: '50',
    gold: "100",
  },
  onLoad: function () {
    var that = this
    var temp = wx.getStorageSync(SESSION_KEY)
    that.setData({
      userInfo: temp.userinfo,
      skey: temp.skey,
    })
    console.log(wx.getStorageSync(SESSION_KEY))
  },

  add_gold: function (e) {
    console.log(e.userInfo.gold)
  },

  formSubmit: function (e) {
    var that = this
    console.log(e.detail.value);
    console.log(that.data.location.address);
    if (that.data.location.address == undefined
      || e.detail.value.title == ''
      || e.detail.value.description == '') {
      wx.showToast({
        title: '请完善信息',
        icon: 'loading',
        duration: 2000
      })
    }
    else {
      wx.request({
        url: 'https://wudnq2cw.qcloud.la/weapp/task/',
        data: {
          skey: that.data.skey,
          title: e.detail.value.title,
          description: e.detail.value.description,
          adress: that.data.location.address,
          latitude: that.data.location.latitude,
          longitude: that.data.location.longitude,
          gold: that.data.goldsNumber,
        },
        header: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        method: 'post',
        dataType: 'json',
        responseType: 'text',

        success: function (res) {
          if (res.data.code == '0') {
            console.log("任务post成功")
            console.log(res.data)
            wx.showToast({
              title: '发布成功',
              icon: 'success',
              duration: 2000,
              complete: function () {
                setTimeout(function () {
                  wx.reLaunch({
                    url: '/pages/my/my'
                  })
                }, 2000)
              }
            })
          }
          else{
            console.log("任务post失败")
            wx.showToast({
              title: '发布失败',
              icon: 'loading',
              duration: 2000,
            })
          }
        },

        fail: function (res) {
          console.log("任务post失败")
          wx.showToast({
            title: '发布失败',
            icon: 'loading',
            duration: 2000,
          })
        },
        complete: function (res) { },
      })
    }
    // wx.switchTab({
    //   url: '/pages/my/my',
    // })
  },
  /**
   * 打开腾讯位置
   */
  chooseLocation: function (e) {
    console.log(e)
    var that = this
    wx.chooseLocation({
      success: function (res) {
        console.log(res)
        that.setData({
          hasLocation: true,
          location: {
            address: res.address + res.name,
            longitude: res.longitude,
            latitude: res.latitude
          }
        })
      },
      fail: function () {
        // fail
      },
      complete: function () {
        // complete
      }
    })
  },
  numJianTap: function () {
    var that = this
    if (that.data.goldsNumber > 5) {
      var tempgolds = that.data.goldsNumber;
      tempgolds--;
      that.setData({
        goldsNumber: tempgolds
      })
    } else
      wx.showToast({
        title: '赏金必须',
        icon: 'loading',
        duration: 2000
      })
  },
  numJiaTap: function () {
    var that = this

    if (that.data.goldsNumber < that.data.gold) {
      var tempgolds = that.data.goldsNumber;
      tempgolds++;
      that.setData({
        goldsNumber: tempgolds
      })
    } else
      wx.showToast({
        title: '金钱不足',
        icon: 'loading',
        duration: 2000
      })
  },
  clearData: function()
  {
    
  }
})