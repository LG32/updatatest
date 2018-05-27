// pages/firstpage/firstpage.js

var util = require('../../utils/util.js')
var wxSearch = require('../../wxSearch/wxSearch.js')
var QQMapWX = require('../../qqmap-wx-jssdk1.0/qqmap-wx-jssdk.js');
var app = getApp();
var mkey = new QQMapWX({
  key: '7NBBZ-YF4HK-UONJZ-AVJYJ-5Y5V7-XFFU5'
});
Page({
  data: {
    feed: [],
    feed_length: 0,
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
    // that.getData();
    wxSearch.init(that, 43, ['哈尔滨市', '北京市', '广州市', '上海市', '深圳市']);
    wxSearch.initMindKeys(['哈尔滨市道里区中央大街', '北京市海淀区天安门', '广州市天河区海心沙 ', '上海市南京北路']);
    that.getLocation();
  },

  getData: function () {
    var feed = util.getQuestions();
    console.log("getQuestions...");
    var feed_data = feed.data;
    this.setData({
      feed: feed_data,
      feed_length: feed_data.length
    });
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
              },
              fail: function (res) {
                console.log("经纬GET失败")
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
  getDistance: function () {
    var that = this
    var distance = new Array()
    var sum = 0
    console.log('start getDistance')
    console.log(that.data.firstlist.length)
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
          console.log(res.result.elements[0].distance);
          distance[sum] = res.result.elements[0].distance
          console.log(sum)
          console.log(setdistance)
          that.setData({
            [setdistance]: distance[sum]
          })
        },
        fail: function (res) {
          console.log(res);
        },
        complete: function(){
          sum++
        }
      });
    }
  },
  /**
   * 搜索框
   */
  wxSearchFn: function (e) {
    var that = this
    wxSearch.wxSearchAddHisKey(that);
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
  }
})