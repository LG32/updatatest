let QQMapWX = require('../qqmap-wx-jssdk1.0/qqmap-wx-jssdk.js');
let mkey = new QQMapWX({
  key: '7NBBZ-YF4HK-UONJZ-AVJYJ-5Y5V7-XFFU5'
});

const formatTime = date => {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const hour = date.getHours();
  const minute = date.getMinutes();
  const second = date.getSeconds();

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
};

const formatNumber = n => {
  n = n.toString();
  return n[1] ? n : '0' + n
};



// 显示繁忙提示
var showBusy = text => wx.showToast({
  title: text,
  icon: 'loading',
  duration: 5000
});

// 显示成功提示
var showSuccess = text => wx.showToast({
  title: text,
  icon: 'success',
  duration: 3000
});

// 显示失败提示
var showModel = (title, content) => {
  wx.hideToast();
  wx.showModal({
    title,
    content: JSON.stringify(content),
    showCancel: false
  })
};

let getCityByLL = (latitude, longitude, cb) => {

  mkey.reverseGeocoder({
    location: {
      latitude: latitude,
      longitude: longitude
    },

    success: function (res) {
      let city = res.result.address_component.city;
      cb(city, latitude, longitude)
    },

    fail: function (res) {
      console.log("经纬GET失败", res);
    },
  })
};

module.exports = {formatTime, showBusy, showSuccess, showModel, getCityByLL};

