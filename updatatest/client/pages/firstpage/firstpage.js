// pages/firstpage/firstpage.js

let util = require('../../utils/util.js')
let wxSearch = require('../../wxSearch/wxSearch.js')
let QQMapWX = require('../../qqmap-wx-jssdk1.0/qqmap-wx-jssdk.js');
let constants = require('../../vendor/wafer2-client-sdk/lib/constants.js');
let SESSION_KEY = 'weapp_session_' + constants.WX_SESSION_MAGIC_ID;
let app = getApp();
let mkey = new QQMapWX({
    key: '7NBBZ-YF4HK-UONJZ-AVJYJ-5Y5V7-XFFU5'
});
let close_icon_white = "../../images/icon-go-white.png";
let select_icon_white = "../../images/icon-down-white.png";
let close_icon_black = '../../images/icon-go-black.png';
let select_icon_black = '../../images/icon-down-black.png';

Page({
    data: {
        firstlist: [],
        user_info: [],
        distance: [],
        latitude: '',
        longitude: '',
        title_text: '',
        autoplay: true,
        interval: 3000,
        duration: 1000,
        banners: [{
            businessId: 1,
            picUrl: "../../images/more/banners_zhinan.png",
        }, {
            business: 2,
            picUrl: "../../images/more/banners_guanghuo.png",
        }, {
            business: 3,
            picUrl: "../../images/more/guanggao.png",
        },],
        typeID: 0,
        isLoading: true,
        loadOver: false,
        children_list: [{
            list: [{
                district_name: "广州"
            }, {
                district_name: "北京"
            }, {
                district_name: "上海"
            }, {
                district_name: "深圳"
            }],
        }, {
            list: [{
                district_name: "广州塔"
            }, {
                district_name: "东方明珠"
            }, {
                district_name: "故宫"
            }],
        }, {
            list: [{
                district_name: "长城"
            }, {
                district_name: "兵马俑"
            }, {
                district_name: "故宫"
            }, {
                district_name: "山海关"
            }, {
                district_name: "黄鹤楼"
            }, {
                district_name: "潼关"
            }]
        }, {
            list: [{
                district_name: "西安"
            }, {
                district_name: "南京"
            }, {
                district_name: "开封"
            }, {
                district_name: "洛阳"
            }, {
                district_name: "武汉"
            }, {
                district_name: "成都"
            }, {
                district_name: "济南"
            }]
        }, {
            list: [{
                district_name: "云龙雪山"
            }, {
                district_name: "长白山"
            }, {
                district_name: "九寨沟"
            }, {
                district_name: "三亚"
            }]
        }],

        districtList: [{
            district_name: "一线城市",
        }, {
            district_name: "热门景点",
        }, {
            district_name: "名胜古迹"
        }, {
            district_name: "千年古城"
        }, {
            district_name: "锦绣河山"
        }],

        sortingList: [{
            value: "综合排序"
        }, {
            value: "距离最近"
        }, {
            value: "日期最近"
        }, {
            value: "回答最多"
        }, {
            value: "金币最多"
        }],
        districtChioceIcon: close_icon_white,
        sortingChioceIcon: close_icon_black,
        chioceDistrict: false,
        chioceSorting: false,
        chioceFilter: false,
        activeDistrictParentIndex: 0,
        activeDistrictChildrenIndex: -1,
        activeDistrictName: "热门区域",
        scrollTop: 0,
        scrollIntoView: 0,
        activeSortingIndex: -1,
        activeSortingName: "综合排序",
        urlNum: -1,
        searchUrl: [{
            url: "search"
        }, {
            url: "firstpageanswer"
        }, {
            url: "firstpagedate"
        }],
        searchDistrict: '',
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function () {
        console.log('onLoading');
        let that = this;
        wxSearch.init(that, 43, ['哈尔滨市', '北京市', '广州市', '上海市', '深圳市']);
        wxSearch.initMindKeys(['哈尔滨市道里区中央大街', '北京市海淀区天安门', '广州市天河区海心沙 ', '上海市南京北路']);
        that.getLocation();
        that.getGold();
    },
    /**
     * 得到金币数
     */
    getGold: function () {
        wx.cloud.callFunction({
            name: 'querygold',
            data: {},

            success: function (res) {
                console.log('getGold success...', res);
                wx.setStorageSync('gold', res.result.data)
            },
            fail: function (res) {
                console.log(res)
            }
        });
    },
    /**
     * 发送城市与经纬换列表信息
     */
    getLocation: function () {
        let that = this;

        wx.getLocation({
            type: 'wgs84',

            success: function (res) {
                that.setData({
                    latitude: res.latitude,
                    longitude: res.longitude,
                });
                util.getCityByLL(res.latitude, res.longitude, that.getFirstpageInfo)
            },

            fail: function (res) {
                console.log(res);
            },

            complete: function (res) {
                console.log(res);
            }
        });
    },

    getFirstpageInfo: function (city, latitude, longitude) {
        let obj;
        let that = this;

      wx.cloud.callFunction({
            name: 'firstpage',
            data: {
                city: city,
                latitude: latitude,
                longitude: longitude
            },

            success: function (res) {
                console.log(res);
                // for (let i = 0; i < res.data.data.msg.length; i++) {
                //     obj[i] = JSON.parse(res.data.data.msg[i].user_info);
                // }
                // console.log(obj);
                // console.log("经纬GET成功");
                that.setData({
                    firstlist: res.result.data,
                    user_info: obj,
                    title_text: city,
                });
                that.getDistance();
                that.simpleDescription();
                util.showSuccess('刷新成功')
            },
        });
    },

    /**
     * 计算距离
     */
    getDistance: function () {
        let that = this
        let distance = new Array()
        let sum = 0
        let len = that.data.firstlist.length
        let a = 0
        console.log('start getDistance')
        that.setData({
            distance: []
        })
        do {
            mkey.calculateDistance({
                from: {
                    latitude: that.data.latitude,
                    longitude: that.data.longitude,
                },
                to: [{
                    latitude: that.data.firstlist[a].latitude,
                    longitude: that.data.firstlist[a].longitude,
                }],
                success: function (res) {
                    console.log(res)
                    let toLat = res.result.elements[0].to.lat
                    let toLng = res.result.elements[0].to.lng
                    let tempDistance = res.result.elements[0].distance
                    console.log(tempDistance);
                    for (let i = 0; i < len; i++) {
                        if (that.data.firstlist[i].latitude == toLat) {
                            if (that.data.firstlist[i].longitude == toLng) {
                                sum = i
                                let setdistance = "distance[" + sum + "]"
                                let setListDistance = "firstlist[" + sum + "].distance"
                                console.log(sum)
                                if (tempDistance < 1000) {
                                    distance[sum] = tempDistance + '米'
                                } else {
                                    tempDistance = tempDistance / 1000
                                    let s = tempDistance + "";
                                    let str = s.substring(0, s.indexOf(".") + 3);
                                    distance[sum] = str + '千米'
                                }
                                that.setData({
                                    [setdistance]: distance[sum],
                                    [setListDistance]: res.result.elements[0].distance,
                                })
                            }
                        }
                    }
                },
                fail: function (res) {
                    console.log(res);
                },
            });
            a++
        } while (a < len)
    },
    /**
     * 下拉刷新
     */
    onPullDownRefresh: function () {
        let that = this
        that.setData({
            urlNum: 0,
            searchDistrict: that.data.title_text
        })
        that.searchInformationRequest()
        wx.stopPullDownRefresh()
    },
    /**
     * 搜索框请求
     */
    searchRequest: function (e) {
        let searchText = e.data.wxSearchData.value
        let that = this
        console.log('start search...')
        console.log(e.data)
        if (searchText != '') {
            that.setData({
                urlNum: 0,
                searchDistrict: searchText,
                activeSortingName: "综合排序",
                activeSortingIdex: 0,
            })
            that.searchInformationRequest()
        }
    },
    /**
     * 搜索请求
     */
    searchInformationRequest: function () {
        let obj = []
        let that = this
        let urlNum = that.data.urlNum
        let searchUrl = that.data.searchUrl[urlNum].url
        wx.request({
            url: 'https://800321007.littlemonster.xyz/weapp/' + searchUrl + '/',
            method: 'GET',
            data: {
                question: that.data.searchDistrict,
            },
            success: function (res) {
                console.log(res.data)
                for (let i = 0; i < res.data.data.msg.length; i++) {
                    obj[i] = JSON.parse(res.data.data.msg[i].user_info);
                }
                that.setData({
                    firstlist: res.data.data.msg,
                    user_info: obj,
                    title_text: that.data.searchDistrict
                })
                that.getDistance();
            },
            fail: function (res) {
                util.showBusy('搜索失败')
                console.log(res)
            }
        })
    },
    /**
     * 简要化描述
     */
    simpleDescription: function () {
        let that = this
        for (let i = 0; i < that.data.firstlist.length; i++) {
            if (that.data.firstlist[i].description.length > 60) {
                let tempStr = that.data.firstlist[i].description.substr(0, 60)
                let str = tempStr + '......'
                console.log(str)
                let newStr = "firstlist[" + i + "].description"
                that.setData({
                    [newStr]: str
                })
            }
        }
    },
    /**
     * 轮播图事件处理
     */
    swiperchange: function (e) {
        //console.log(e.detail.current)
        this.setData({
            swiperCurrent: e.detail.current
        })
    },
    /**
     * 搜索框
     */
    wxSearchFn: function (e) {
        let that = this
        wxSearch.wxSearchAddHisKey(that);
        that.searchRequest(that)
    },
    wxSearchInput: function (e) {
        let that = this
        wxSearch.wxSearchInput(e, that);
    },
    wxSerchFocus: function (e) {
        let that = this
        wxSearch.wxSearchFocus(e, that);
    },
    wxSearchBlur: function (e) {
        let that = this
        wxSearch.wxSearchBlur(e, that);
    },
    wxSearchKeyTap: function (e) {
        let that = this
        wxSearch.wxSearchKeyTap(e, that);
    },
    wxSearchDeleteKey: function (e) {
        let that = this
        wxSearch.wxSearchDeleteKey(e, that);
    },
    wxSearchDeleteAll: function (e) {
        let that = this;
        wxSearch.wxSearchDeleteAll(that);
    },
    wxSearchTap: function (e) {
        let that = this
        wxSearch.wxSearchHiddenPancel(that);
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

    /**
     * 下拉菜单
     */
    onReachBottom: function () {
        if (!this.data.loadOver) {
            this.setData({
                pageIndex: this.data.pageIndex + 1,
                isLoading: true,
                loadOver: false
            })
            //this.getProductList();
        }
    },
    //条件选择
    choiceItem: function (e) {
        switch (e.currentTarget.dataset.item) {
            case "1":
                if (this.data.chioceDistrict) {
                    this.setData({
                        districtChioceIcon: close_icon_white,
                        sortingChioceIcon: close_icon_black,
                        chioceDistrict: false,
                        chioceSorting: false,
                        chioceFilter: false,
                    });
                } else {
                    this.setData({
                        districtChioceIcon: select_icon_white,
                        sortingChioceIcon: close_icon_black,
                        chioceDistrict: true,
                        chioceSorting: false,
                        chioceFilter: false,
                    });
                }
                break;
            case "2":
                if (this.data.chioceSorting) {
                    this.setData({
                        districtChioceIcon: close_icon_white,
                        sortingChioceIcon: close_icon_black,
                        chioceDistrict: false,
                        chioceSorting: false,
                        chioceFilter: false,
                    });
                } else {
                    this.setData({
                        districtChioceIcon: close_icon_white,
                        sortingChioceIcon: select_icon_black,
                        chioceDistrict: false,
                        chioceSorting: true,
                        chioceFilter: false,
                    });
                }
                break;
        }
    },
    hideAllChioce: function () {
        this.setData({
            districtChioceIcon: close_icon_white,
            sortingChioceIcon: close_icon_black,
            chioceDistrict: false,
            chioceSorting: false,
            chioceFilter: false,
        });
    },

    selectDistrictParent: function (e) {
        console.log(e)
        this.setData({
            activeDistrictParentIndex: e.currentTarget.dataset.index,
            activeDistrictChildrenIndex: 0,
            scrollTop: 0,
            scrollIntoView: 0
        })
    },

    selectDistrictChildren: function (e) {
        let that = this
        let index = e.currentTarget.dataset.index;
        let parentIndex = that.data.activeDistrictParentIndex == -1 ? 0 : that.data.activeDistrictParentIndex;
        if (index >= 0) {
            let district_name = that.data.children_list[parentIndex].list[index].district_name
            that.setData({
                urlNum: 0,
                searchDistrict: district_name,
            })
            that.searchInformationRequest()
        }
        that.setData({
            districtChioceIcon: close_icon_white,
            chioceDistrict: false,
            activeDistrictChildrenIndex: index,
            productList: [],
            pageIndex: 1,
            loadOver: false,
            isLoading: true
        })
        //this.getProductList();
    },

    //综合排序
    selectSorting: function (e) {
        let index = e.currentTarget.dataset.index;
        let that = this
        that.setData({
            sortingChioceIcon: close_icon_black,
            chioceSorting: false,
            activeSortingIndex: index,
            activeSortingName: that.data.sortingList[index].value,
            productList: [],
            pageIndex: 1,
            loadOver: false,
            isLoading: true
        })
        switch (index) {
            case 0:
                that.setData({
                    urlNum: 0,
                    searchDistrict: that.data.title_text,
                })
                that.searchInformationRequest()
                break
            case 1:
                let a = that.data.firstlist
                let b = that.data.distance
                let c = that.data.user_info
                for (let i = 0; i < a.length; i++) {
                    for (let j = i; j < a.length; j++) {
                        if (a[i].distance > a[j].distance) {
                            let tempa = a[j]
                            a[j] = a[i]
                            a[i] = tempa
                            let tempb = b[j]
                            b[j] = b[i]
                            b[i] = tempb
                            let tempc = c[j]
                            c[j] = c[i]
                            c[i] = tempc
                        }
                    }
                }
                that.setData({
                    firstlist: a,
                    distance: b,
                    user_info: c,
                })
                break
            case 2:
                that.setData({
                    urlNum: 2,
                    searchDistrict: that.data.title_text,
                })
                that.searchInformationRequest()
                break
            case 3:
                console.log(that.data.title_text)
                that.setData({
                    urlNum: 1,
                    searchDistrict: that.data.title_text,
                })
                that.searchInformationRequest()
                break
            case 4:
                that.setData({
                    urlNum: 0,
                    searchDistrict: that.data.title_text,
                })
                that.searchInformationRequest()
                break
        }
    },

    bannersActivity: function () {
        wx.showModal({
            title: '提示',
            content: '官方活动正准备中',
            cancelText: '了解了',
            confirmText: '很期待',
            success: function (res) {
                if (res.confirm) {
                    console.log('用户点击确定')
                } else if (res.cancel) {
                    console.log('用户点击取消')
                }
            }
        })
    },

    chioceDistrictFlag: function () {
        this.setData({
            chioceDistrict: false
        })
    },

    chioceSortingFlag: function () {
        this.setData({
            chioceSorting: false
        })
    }

})
