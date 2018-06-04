// pages/firstpage/firstpage.js

var util = require('../../utils/util.js')
var wxSearch = require('../../wxSearch/wxSearch.js')
var QQMapWX = require('../../qqmap-wx-jssdk1.0/qqmap-wx-jssdk.js');
var constants = require('../../vendor/wafer2-client-sdk/lib/constants.js');
var SESSION_KEY = 'weapp_session_' + constants.WX_SESSION_MAGIC_ID;
var app = getApp();
var mkey = new QQMapWX({
  key: '7NBBZ-YF4HK-UONJZ-AVJYJ-5Y5V7-XFFU5'
});
Page({
  data: {
    firstlist: [],
    user_info: [],
    distance: [],
    latitude: '',
    longitude: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {
    console.log('onLoading')
    var that = this
    wxSearch.init(that, 43, ['哈尔滨市', '北京市', '广州市', '上海市', '深圳市']);
    wxSearch.initMindKeys(['哈尔滨市道里区中央大街', '北京市海淀区天安门', '广州市天河区海心沙 ', '上海市南京北路']);
    that.getLocation();
    that.getGold();
  },
  /**
   * 得到金币数
   */
  getGold: function () {
    var gold = ''
    var that = this
    var temp = wx.getStorageSync(SESSION_KEY)
    console.log('start getGold...')
    wx.request({
      url: 'https://wudnq2cw.qcloud.la/weapp/querygold/',
      data: {
        skey: temp.skey
      },
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      method: 'POST',
      dataType: 'json',
      responseType: 'text',
      success: function (res) {
        console.log('getGold success...')
        console.log(res.data)
        wx.setStorageSync('gold', res.data.data.msg[0].gold)
      },
      fail: function (res) {
        console.log(res)
      }
    })
  },
  /**
   * 发送城市与经纬换列表信息
   */
  getLocation: function () {
    var that = this
    var obj = []
    wx.getLocation({
      type: 'wgs84',
      success: function (res) {
        that.setData({
          latitude: res.latitude,
          longitude: res.longitude,
        })
        console.log("getLocation...")
        console.log("latitude:" + that.data.latitude)
        console.log("longitude:" + that.data.longitude)
        mkey.reverseGeocoder({
          location: {
            latitude: that.data.latitude,
            longitude: that.data.longitude
          },
          success: function (res) {
            console.log('https://wudnq2cw.qcloud.la/weapp/firstpage/?city=' + res.result.address_component.city + '&latitude=' + that.data.latitude + '&longitude=' + that.data.longitude)
            wx.request({
              url: 'https://wudnq2cw.qcloud.la/weapp/firstpage/',
              data: {
                city: res.result.address_component.city,
                latitude: that.data.latitude,
                longitude: that.data.longitude
              },
              header: {
                'Accept': 'application/json'
              },
              method: 'GET',
              dataType: 'json',
              responseType: 'text',
              success: function (res) {
                console.log(res.data)
                for (var i = 0; i < res.data.data.msg.length; i++) {
                  obj[i] = JSON.parse(res.data.data.msg[i].user_info);
                }
                // var obj = res.data.data.msg[0].user_info
                console.log(obj)
                console.log("经纬GET成功")
                that.setData({
                  firstlist: res.data.data.msg,
                  user_info: obj
                })
                that.getDistance();
                util.showSuccess('刷新成功')
              },
              fail: function (res) {
                console.log("经纬GET失败")
                util.showSuccess('刷新失败')
              },
              complete: function (res) { },
            })
          }
        });
      },
      fail: function (res) {
        console.log(res);
      },
      complete: function (res) {
        console.log(res);
      }
    });
  },
  /**
   * 计算距离
   */
  getDistance: function () {
    var that = this
    var distance = new Array()
    var sum = 0
    console.log('start getDistance')
    console.log(that.data.firstlist.length)
    that.setData({
      distance: []
    })
    for (var i = 0, len = that.data.firstlist.length; i < len; i++) {
      console.log('ready getDistance...')
      mkey.calculateDistance({
        from: {
          latitude: that.data.latitude,
          longitude: that.data.longitude,
        },
        to: [{
          latitude: that.data.firstlist[i].latitude,
          longitude: that.data.firstlist[i].longitude,
        }],
        success: function (res) {
          var setdistance = "distance[" + sum + "]"
          var tempDistance = res.result.elements[0].distance
          console.log(tempDistance);
          if (tempDistance < 1000) {
            distance[sum] = tempDistance + '米'
          } else {
            tempDistance = tempDistance / 1000
            var s = tempDistance + "";
            var str = s.substring(0, s.indexOf(".") + 3);
            distance[sum] = str + '千米'
          }
          that.setData({
            [setdistance]: distance[sum]
          })
        },
        fail: function (res) {
          console.log(res);
        },
        complete: function () {
          sum++
        }
      });
    }
  },
  /**
   * 下拉刷新
   */
  onPullDownRefresh: function () {
    var that = this
    that.getLocation();
    wx.stopPullDownRefresh()
  },
  /**
   * 搜索框请求
   */
  searchRequest: function (e) {
    var searchText = e.data.wxSearchData.value
    console.log('searchText:' + searchText)
    var obj = []
    var that = this
    console.log('start search...')
    if (searchText != '') {
      wx.request({
        url: 'https://wudnq2cw.qcloud.la/weapp/search/',
        method: 'GET',
        data: {
          question: searchText,
        },
        success: function (res) {
          util.showSuccess('成功发送')
          console.log(res.data)
          for (var i = 0; i < res.data.data.msg.length; i++) {
            obj[i] = JSON.parse(res.data.data.msg[i].user_info);
          }
          that.setData({
            firstlist: res.data.data.msg,
            user_info: obj
          })
          that.getDistance();
        },
        fail: function (res) {
          util.showBusy('搜索失败')
          console.log(res)
        }
      })
    }
  },
  /**
   * 搜索框
   */
  wxSearchFn: function (e) {
    var that = this
    wxSearch.wxSearchAddHisKey(that);
    that.searchRequest(that)
  },
  wxSearchInput: function (e) {
    var that = this
    wxSearch.wxSearchInput(e, that);
  },
  wxSerchFocus: function (e) {
    var that = this
    wxSearch.wxSearchFocus(e, that);
  },
  wxSearchBlur: function (e) {
    var that = this
    wxSearch.wxSearchBlur(e, that);
  },
  wxSearchKeyTap: function (e) {
    var that = this
    wxSearch.wxSearchKeyTap(e, that);
  },
  wxSearchDeleteKey: function (e) {
    var that = this
    wxSearch.wxSearchDeleteKey(e, that);
  },
  wxSearchDeleteAll: function (e) {
    var that = this;
    wxSearch.wxSearchDeleteAll(that);
  },
  wxSearchTap: function (e) {
    var that = this
    wxSearch.wxSearchHiddenPancel(that);
  },
  /**
   * 分享页面
   */
  onShareAppMessage: function () {
    return {
      title: '回味小程序',
      desc: '带你寻找记忆中的地方',
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