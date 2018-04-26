// pages/map/map.js
var qcloud = require('../../vendor/wafer2-client-sdk/index')
var config = require('../../config')
var util = require('../../utils/util.js')

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
    markers: [{
      id: 1,
      latitude: 45.720028,
      longitude: 126.646675,
      name: '哈理工'
    }],
    covers: [{
      latitude: 45.720028,
      longitude: 126.646675,
      iconPath: '/image/location.png'
    }]
  },

  onReady: function (e) {
    this.mapCtx = wx.createMapContext('myMap')
  },

  getJinWei: function () {
    var that = this
    wx.getLocation({
      success: function (res) {
        var mlatitude = res.latitude
        var mlongitude = res.longitude
        var mspeed = res.speed
        var maccuracy = res.accuracy

        that.setData({
          message: true,
          latitude: '纬度为:' + mlatitude,
          longitude: '经度为:' + mlongitude
        })
        console.log('纬度为:' + mlatitude)
        console.log('经度为:' + mlongitude)
      },
    })
  },

  getCenterLocation: function () {
    var mlatitude = 0;
    var mlongitude = 0;

    this.mapCtx.getCenterLocation({
      success: function (res) {
        mlatitude = res.latitude
        mlongitude = res.longitude
        console.log('纬度为:' + mlatitude)
        console.log('经度为:' + mlongitude)
      }
    })

    this.mapCtx.translateMarker({
      markerId: 2,
      autoRotate: false,
      duration: 1000,
      destination: {
        latitude: mlatitude,
        longitude: mlongitude,
      },
      animationEnd() {
        console.log('animation end')
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
  }

  
})