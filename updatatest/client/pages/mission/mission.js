// pages/mission/mission.js
Page({

  data: {
    mission_title: {
    },
    userInfo: {
      avatarUrl: "https://wx.qlogo.cn/mmopen/vi_32/8wia9K3Z9baKviaRHibq47d4gZPiakzKYx1ylySrpwfBMmkkiaDJQ68CsmFcVD08NAfib5peVmhDTIQ1ZmeRLUDCs7dg/132",
      nickName: "伊利丹",
      gold: "100",
      my_mission: "5",
      unfinish_mission: "3",
      finish_mission: "2"
    },
    question: {}
  },

  onLoad: function (options) {
    var that = this
    /**
     * 我发布的任务
     */
    if (options.mission_state == 1) {
      var title = '我发布的任务 '
      wx.request({
        url: 'http://127.0.0.1/testdata/LG32.json',
        method: 'GET',
        data: {},
        header: {
          'Accept': 'application/json'
        },
        success: function (res) {
          that.setData({
            question: res.data.data.question,
            mission_title: title
          });
          console.log(res.data.data.question)
        }
      })
    }

    /**
     * 未完成的任务
     */
    if (options.mission_state == 2) {
      var title = '未完成的任务'
      wx.request({
        url: 'http://127.0.0.1/testdata/LG32.json',
        method: 'GET',
        data: {},
        header: {
          'Accept': 'application/json'
        },
        success: function (res) {
          that.setData({
            question: res.data.data.question,
            mission_title: title

          });

          console.log(res.data.data.question)
        }
      })
    }

    /**
     * 我帮助过的任务
     */
    if (options.mission_state == 3) {
      var title = '我帮助过的任务'
      wx.request({
        url: 'http://127.0.0.1/testdata/LG32.json',
        method: 'GET',
        data: {},
        header: {
          'Accept': 'application/json'
        },
        success: function (res) {
          that.setData({
            question: res.data.data.question,
            mission_title: title

          });
          console.log(res.data.data.question)
        }
      })
    }
  },

})