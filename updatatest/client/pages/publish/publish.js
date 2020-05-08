// pages/publish/publish.js
let constants = require('../../vendor/wafer2-client-sdk/lib/constants.js');
let SESSION_KEY = 'weapp_session_' + constants.WX_SESSION_MAGIC_ID;
let util = require('../../utils/util.js')

Page({
    data: {
        userInfo: {},
        skey: '',
        publish: {},
        hasLocation: 'false',
        location: {},
        address: '',
        goldsNumber: 10,
        goldsNumMin: 5,
        goldsNumMax: 25,
        gold: "",
    },
    onLoad: function () {
        let that = this
        let temp = wx.getStorageSync(SESSION_KEY)
        let gold = wx.getStorageSync('gold')
        that.setData({
            userInfo: temp.userInfo,
            skey: temp.skey,
            gold: gold,
        })
    },

    add_gold: function (e) {
        console.log(e.userInfo.gold)
    },
    /**
     * 提交表单
     */
    formSubmit: function (e) {
        let that = this;
        console.log('start formSubmit', e);

        if (that.data.location.address === undefined
            || e.detail.value.title === ''
            || e.detail.value.description === '') {
            util.showModel('提示', '请完善信息');
            return 0;
        }

        wx.showModal({
            title: '提示',
            content: '是否发布任务',
            success: function (res) {
                if (res.confirm) {
                    that.setData({
                        info: {
                            title: e.detail.value.title,
                            description: e.detail.value.description,
                            address: that.data.location.address,
                            latitude: that.data.location.latitude,
                            longitude: that.data.location.longitude,
                            gold: that.data.goldsNumber,
                        },
                    });
                    util.getCityByLL(that.data.location.latitude,
                        that.data.location.longitude, that.updateTaskInfo)
                }
            }
        })
    },

    updateTaskInfo: function (city) {
        let that = this;
        let info = that.data.info;
        let temp = wx.getStorageSync(SESSION_KEY);

        wx.cloud.callFunction({
            name: 'task',
            data: {
                title: info.title,
                description: info.description,
                address: info.address,
                latitude: info.latitude,
                longitude: info.longitude,
                gold: info.goldsNumber,
                city: city,
                userInfo: temp.userInfo,
            },

            success: function (res) {
                // if (res.data.code !== '0') {
                //     console.log("任务post失败");
                //     util.showModel('error', '发布失败');
                //     return 0;
                // }

                console.log("任务post成功");
                console.log(res);
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
                });
                // wx.setStorageSync('gold', res.data.data.msg[0].gold)
            },
            fail: function (res) {
                console.log("任务post失败");
                util.showModel('error', '发布失败')
            },
        });
    },

    /**
     * 打开腾讯位置
     */
    chooseLocation: function (e) {
        let that = this;
        wx.chooseLocation({
            success: function (res) {
                console.log(res);
                that.setData({
                    hasLocation: true,
                    location: {
                        address: res.address + res.name,
                        longitude: res.longitude,
                        latitude: res.latitude
                    }
                })
            },
        })
    },
    /**
     * 减少赏金
     */
    numJianTap: function () {
        let that = this
        if (that.data.goldsNumber > that.data.goldsNumMin) {
            let tempgolds = that.data.goldsNumber;
            tempgolds--;
            that.setData({
                goldsNumber: tempgolds
            })
        } else
            util.showModel('提示', '抠门可不太好哦！')
    },
    /**
     * 增加赏金
     */
    numJiaTap: function () {
        let that = this
        if (that.data.goldsNumber < that.data.gold && that.data.goldsNumber < that.data.goldsNumMax) {
            let tempgolds = that.data.goldsNumber;
            tempgolds++;
            that.setData({
                goldsNumber: tempgolds
            })
        } else
            util.showModel('提示', '赏金已达最大值！')
    },
    /**
     * 分享页面
     */
    onShareAppMessage: function () {
        return {
            title: '看哪小程序',
            desc: '你想看哪，我帮你',
            path: '/pages/start/start?id=123',
            success: function (res) {
                console.log(res)
            },
            fail: function (res) {
                console.log(res)
            }
        }
    }
})
