// pages/my/my.js
Page({
  data: {
    userInfo: {
      avatarUrl: "https://wx.qlogo.cn/mmopen/vi_32/8wia9K3Z9baKviaRHibq47d4gZPiakzKYx1ylySrpwfBMmkkiaDJQ68CsmFcVD08NAfib5peVmhDTIQ1ZmeRLUDCs7dg/132",
      nickName: "伊利丹",
      gold: "100"
    },
  },


  onLoad: function (options) {

  },
  onShareAppMessage: function () {
    return {
      title: '回味小程序',
      desc: '带你寻找记忆中的地方',
      path: '/pages/index/index?id=123',
      success: function (res) {
        console.log(res)
        // console.log
      },
      fail: function (res) {
        // 分享失败
        console.log(res)
      }
    }
  }
})