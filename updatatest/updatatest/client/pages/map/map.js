// pages/map/map.js
var qcloud = require('../../vendor/wafer2-client-sdk/index')
var config = require('../../config')
var util = require('../../utils/util.js')
var wxSearch = require('../../wxSearch/wxSearch.js')
var QQMapWX = require('../../qqmap-wx-jssdk1.0/qqmap-wx-jssdk.js');
var data_map = require('../../data/data_map.js')
var mkey = new QQMapWX({
  key: '7NBBZ-YF4HK-UONJZ-AVJYJ-5Y5V7-XFFU5'
});

Page({

  /**
   * 页面的初始数据
   */
  data: {
    message: false,
    // longitude: {},
    // latitude: {},
    latitude: 45.720028,
    longitude: 126.646675,
    centerX: 126.646675,
    centerY: 45.720028,
    content: "",
    markers: [],
    // markers: [{
    //   id: 1,
    //   latitude: 45.720028,
    //   longitude: 126.646675,
    //   name: '哈理工'
    // },
    // {
    //   id:2,
    //   latitude: 44.720028,
    //   longitude: 126.646675,
    //   name: '榆林'
    // }],
    // covers: [{
    //   latitude: 45.720028,
    //   longitude: 126.646675,
    //   iconPath: '/images/icon/icon_point.png'
    // },
    // {
    //   latitude: 44.720028,
    //   longitude: 126.646675,
    //   iconPath: '/images/icon/icon_point.png'
    // }]
  },

  onReady: function (e) {
    this.mapCtx = wx.createMapContext('myMap')
  },

  onLoad: function () {
    console.log('地图定位！')
    var that = this
    wx.getLocation({
      type: 'gcj02', //返回可以用于wx.openLocation的经纬度
      success: (res) => {
        console.log(res)
        var latitude = res.latitude;
        var longitude = res.longitude;
        var marker = this.createMarker(res);
        this.setData({
          centerX: longitude,
          centerY: latitude,
          markers: this.getMarkers()
        })
      }
    });
    wxSearch.init(that, 43, ['weappdev', '小程序', 'wxParse', 'wxSearch', 'wxNotification']);
    wxSearch.initMindKeys(['weappdev.com', '微信小程序开发', '微信开发', '微信小程序']);
  },

  getJinWei: function () {
    // var that = this
    // wx.getLocation({
    //   success: function (res) {
    //     var mlatitude = res.latitude
    //     var mlongitude = res.longitude
    //     var mspeed = res.speed
    //     var maccuracy = res.accuracy

    //     that.setData({
    //       message: true,
    //       latitude: '纬度为:' + mlatitude,
    //       longitude: '经度为:' + mlongitude
    //     })
    //     console.log('得到经纬')
    //     console.log('纬度为:' + mlatitude)
    //     console.log('经度为:' + mlongitude)
    //   },
    // })
  },

  getCenterLocation: function () {
    var mlatitude = 0;
    var mlongitude = 0;

    this.mapCtx.getCenterLocation({
      success: function (res) {
        mlatitude = res.latitude
        mlongitude = res.longitude
        console.log('getCenterLocation')
        console.log('纬度为:' + mlatitude)
        console.log('经度为:' + mlongitude)
      }
    })

    this.mapCtx.translateMarker({
      markerId: 1,
      autoRotate: false,
      duration: 1000,
      destination: {
        latitude: mlatitude,
        longitude: mlongitude,
      },
      animationEnd() {
        console.log('translateMarker animation end')
      }
    })
  },

  moveToLocation: function () {
    this.mapCtx.moveToLocation()
  },

  translateMarker: function (mlatitude, mlongitude) {
    this.mapCtx.translateMarker({
      markerId: 1,
      autoRotate: false,
      duration: 1000,
      destination: {
        latitude: 45.80216,
        longitude: 126.5358,
      },
      animationEnd() {
        console.log('animation end')
      }
    })
  },

  includePoints: function () {
    this.mapCtx.includePoints({
      padding: [10],
      points: [{
        latitude: 23.10229,
        longitude: 113.3345211,
      }, {
        latitude: 23.00229,
        longitude: 113.3345211,
      }]
    })
  },

  /**
   *搜索地点
   */
  contentInput: function (e) {
    this.setData({
      content: e.detail.value
    })
    console.log(this.data.content);
    mkey.search({
      keyword: this.data.content,
      success: function (res) {
        console.log(res);
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
  distance: function () {
    mkey.calculateDistance({
      to: [{
        latitude: 45.720028,
        longitude: 126.646675,
      }, {
        latitude: 45.80216,
        longitude: 126.5358,
      }],
      success: function (res) {
        console.log(res);
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
   * 搜索推荐
   */
  searchSuggestion: function (e) {
    this.setData({
      content: e.detail.value
    })
    mkey.getSuggestion({
      keyword: this.data.content,
      success: function (res) {
        console.log(res);
      },
      fail: function (res) {
        console.log(res);
      },
      complete: function (res) {
        console.log(res);
      }
    })
  },

  makeMarker: function (e) {

  },

  getMarkers() {
    var markers = [];
    for (var item of data_map) {
      var marker = this.createMarker(item);
      markers.push(marker)
    }
    return markers;
  },

createMarker(point){
  var latitude = point.latitude;
  var longitude = point.longitude; 
  var marker = {
    iconPath: "/images/icon/icon_point.png",
    id: point.id || 0,
    name: point.name || '',
    latitude: latitude,
    longitude: longitude,
    width: 35,
    height: 40
  };
  return marker;
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