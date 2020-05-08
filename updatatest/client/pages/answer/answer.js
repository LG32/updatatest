// pages/answer/answer.js
let constants = require('../../vendor/wafer2-client-sdk/lib/constants.js');
let SESSION_KEY = 'weapp_session_' + constants.WX_SESSION_MAGIC_ID;
let util = require('../../utils/util.js');
Page({
    data: {
        dataSrc: {},
        master_userInfo: {},
        master_question: {},
        comments_userInfo: {},
        comments_answer: {},
        best_id: '',
        openID: '',
        power: 0,
        questionId: '',
        question_state: '',
    },

    onLoad: function (options) {
        let that = this;

        let temp = wx.getStorageSync(SESSION_KEY);
        let questions = wx.getStorageSync('questions');
        let question = {};

        for (let i = 0; i < questions.length; i++){
            if (options.question_id === questions[i]._id){
                question = questions[i];
            }
        }

        that.setData({
            openID: temp.userInfo.openId,
            questionId: options.question_id,
            master_question: question,
        });
        try {
            wx.setStorageSync('question_id', options.question_id)
        } catch (e) {
        }
        console.log("options.question_id:" + options.question_id);
        that.loadInfo(options.question_id);
    },

    loadInfo: function (questionId) {
        let that = this;
        let commentsobj = [];
        let masterobj = [];
        let power = 0;
        let master = wx.getStorageSync(SESSION_KEY);

        console.log('questionId', questionId);
        wx.cloud.callFunction({
            name: 'secondpage',
            data: {
                questionId: questionId,
            },
            success: function (res) {
                console.log('secondpage', res);
                let best_id = '';
                let info = res.result.data;
                // for (let i = 0; i < info.length; i++) {
                    // commentsobj[i] = JSON.parse(res.data.data.msg.answer[i].user_info);
                    // if (res.data.data.msg.answer[i].best == 0)
                    //   best_id = i
                // }
                masterobj = master.user_info;
                // if (masterobj && temp.userInfo.openId === masterobj.openId) {
                //     power = 1
                // } else {
                //     power = 0
                // }
                that.setData({
                    master_userInfo: masterobj,
                    commentsobj: info,
                    // master_question: res.data.data.msg.question,
                    // comments_userInfo: commentsobj,
                    // comments_answer: res.data.data.msg.answer,
                    // question_state: res.data.data.msg.question[0].state,
                    // best_id: best_id,
                    power: power,
                });
                that.timeFormat()
            }
        })
    },
    /**
     * 点击最佳按钮
     */
    chooseBest: function (e) {
        let that = this;
        let tempBestID = e.target.dataset.id;
        wx.showModal({
            title: '提示',
            content: '是否采纳该回复为最佳，并结束任务',
            cancelText: '取消',
            confirmText: '决定',
            success: function (res) {
                if (res.confirm) {
                    console.log('用户点击确定');
                    that.theBest(tempBestID);
                    util.showSuccess('任务完成')
                } else if (res.cancel) {
                    console.log('用户点击取消')
                }
            }
        })
    },
    /**
     * 采纳为最佳
     */
    theBest: function (tempBestID) {
        let that = this;
        let bestAnswerID = that.data.comments_answer[tempBestID].answerID;
        wx.request({
            url: 'https://800321007.littlemonster.xyz/weapp/finishtask/',
            data: {
                questionId: that.data.questionId,
                bestAnswerID: bestAnswerID,
            },
            header: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            method: 'post',
            dataType: 'json',
            responseType: 'text',
            success: function (res) {
                console.log('the Best success...');
                console.log(res.data);
                if (res.data.data.msg[0].mes === 0) {
                    that.setData({
                        question_state: 0,
                        best_id: tempBestID,
                    })
                }
            },
            fail: function (res) {
                console.log('the Best fail...');
                console.log(res)
            }
        })
    },
    /**
     * 我帮你拍按钮
     */
    goToCamera: function () {
        let that = this;
        that.acceptask();
        // if (that.data.master_question[0].state === 1) {
        //     if (that.data.master_userInfo.openId !== that.data.openID) {
                // wx.navigateTo({
                //     url: '/pages/camera/camera',
                // });
            // }
        // }

        // wx.request({
        //   url: 'https://800321007.littlemonster.xyz/weapp/queryaccept/',
        //   method: 'POST',
        //   data: {
        //     questionId: that.data.questionId,
        //   },
        //   header: {
        //     "Content-Type": "application/x-www-form-urlencoded"
        //   },
        //   success: function (res) {
        //     console.log(res.data.data.msg);
        //     if (res.data.data.msg === 0) {
        //       wx.showModal({
        //         title: '提示',
        //         content: '是否接下该任务',
        //         cancelText: '取消',
        //         confirmText: '接下',
        //         success: function (res) {
        //           if (res.confirm) {
        //             console.log('用户点击确定');
        //             that.acceptask()
        //     } else if (res.cancel) {
        //       console.log('用户点击取消')
        //     }
        //   }
        // })
        // } else if (res.data.data.msg === 1) {
        //   wx.navigateTo({
        //     url: '/pages/camera/camera',
        //   });
        //         // }
        //       }
        //     })
        //   } else {
        //     util.showBusy('这任务就是你的')
        //   }
        // } else {
        //   util.showModel('提示', '任务已被完成了')
        // }
    },

    /**
     * 接任务
     */
    acceptask: function () {
        let that = this;

        wx.cloud.callFunction({
            name: 'accepttask',
            data: {
                questionId: that.data.questionId,
            },

            success: function (res) {
                wx.navigateTo({
                    url: '/pages/camera/camera',
                });
            },

            fail: function (res) {
                console.log(res)
            }
        });
    },

    /**
     * 残忍拒绝按钮
     */
    backToFirstPage: function () {
        wx.switchTab({
            url: '/pages/firstpage/firstpage',
        })
    },
    /**
     * 点击大图
     */
    biggerphoto: function (event) {
        let srcList = new Array();
        let src = event.currentTarget.dataset.src;//获取data-src
        let imgList = event.currentTarget.dataset.list;//获取data-list
        srcList = imgList.split(',');
        wx.previewImage({
            current: src, // 当前显示图片的http链接
            urls: srcList // 需要预览的图片http链接列表
        })
    },
    /**
     * 跳转至地图
     */
    openMap: function () {
        let that = this;
        wx.openLocation({
            latitude: Number(that.data.master_question.latitude),
            longitude: Number(that.data.master_question.longitude),
            scale: 28
        })
    },
    /**
     * 点赞
     */
    addGold: function () {
        let that = this;
        if (that.data.master_question[0].state === 0) {
            util.showModel('提示', '任务已结束，你来晚了')
        } else {
            wx.showModal({
                title: '点赞',
                content: '觉得这问题很赞，花1金币能使他的问题更快地被完成',
                cancelText: '不就看看',
                confirmText: '花得值',
                success: function (res) {
                    if (res.confirm) {
                        console.log('用户点击确定')
                        wx.request({
                            url: 'https://800321007.littlemonster.xyz/weapp/approve/',
                            data: {
                                questionId: that.data.questionId,
                            },
                            header: {
                                "Content-Type": "application/x-www-form-urlencoded"
                            },
                            method: 'post',
                            dataType: 'json',
                            responseType: 'text',
                            success: function (res) {
                                console.log('addGold success...')
                                console.log(res.data)
                                let gold = "master_question[" + 0 + "].questionGold"
                                that.setData({
                                    [gold]: res.data.data.msg.questionGold
                                })
                                wx.setStorageSync('gold', res.data.data.msg.gold)
                            },
                            fail: function (res) {
                                console.log('addGold fail...')
                                console.log(res)
                            }
                        })
                        util.showSuccess('替他/她/它感谢你了啦！')
                    } else if (res.cancel) {
                        console.log('用户点击取消')
                    }
                }
            })
        }
    },
    /**
     * 时间格式
     */
    timeFormat: function () {
        let that = this
        let tempTime = ''
        console.log('start timeformat...')
        for (let i = 0; i < that.data.comments_answer.length; i++) {
            let tempDate = "comments_answer[" + i + "].answerTime"
            tempTime = that.data.comments_answer[i].answerTime.substr(0, 10)
            console.log(tempTime)
            that.setData({
                [tempDate]: tempTime
            })
        }
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
                // 分享失败
                console.log(res)
            }
        }
    },
})
