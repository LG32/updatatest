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
    }, ],
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
    districtChioceIcon: "../../images/icon-go-black.png",
    sortingChioceIcon: "../../images/icon-go-black.png",
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
  onLoad: function() {
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
  getGold: function() {
    var gold = ''
    var that = this
    var temp = wx.getStorageSync(SESSION_KEY)
    console.log('start getGold...')
    wx.request({
      url: 'https://800321007.littlemonster.xyz/weapp/querygold/',
      data: {
        skey: temp.skey
      },
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      method: 'POST',
      dataType: 'json',
      responseType: 'text',
      success: function(res) {
        console.log('getGold success...')
        console.log(res.data)
        wx.setStorageSync('gold', res.data.data.msg[0].gold)
      },
      fail: function(res) {
        console.log(res)
      }
    })
  },
  /**
   * 发送城市与经纬换列表信息
   */
  getLocation: function() {
    var that = this
    var obj = []
    wx.getLocation({
      type: 'wgs84',
      success: function(res) {
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
          success: function(res) {
            var city = res.result.address_component.city
            wx.request({
              url: 'https://800321007.littlemonster.xyz/weapp/firstpage/',
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
              success: function(res) {
                console.log(res.data)
                for (var i = 0; i < res.data.data.msg.length; i++) {
                  obj[i] = JSON.parse(res.data.data.msg[i].user_info);
                }
                // var obj = res.data.data.msg[0].user_info
                console.log(obj)
                console.log("经纬GET成功")
                that.setData({
                  firstlist: res.data.data.msg,
                  user_info: obj,
                  title_text: city,
                })
                that.getDistance();
                that.simpleDescription();
                util.showSuccess('刷新成功')
              },
              fail: function(res) {
                console.log("经纬GET失败")
                util.showSuccess('刷新失败')
              },
              complete: function(res) {},
            })
          }
        });
      },
      fail: function(res) {
        console.log(res);
      },
      complete: function(res) {
        console.log(res);
      }
    });
  },
  /**
   * 计算距离
   */
  getDistance: function() {
    var that = this
    var distance = new Array()
    var sum = 0
    var len = that.data.firstlist.length
    var a = 0
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
        success: function(res) {
          console.log(res)
          var toLat = res.result.elements[0].to.lat
          var toLng = res.result.elements[0].to.lng
          var tempDistance = res.result.elements[0].distance
          console.log(tempDistance);
          for (var i = 0; i < len; i++) {
            if (that.data.firstlist[i].latitude == toLat) {
              if (that.data.firstlist[i].longitude == toLng) {
                sum = i
                var setdistance = "distance[" + sum + "]"
                var setListDistance = "firstlist[" + sum + "].distance"
                console.log(sum)
                if (tempDistance < 1000) {
                  distance[sum] = tempDistance + '米'
                } else {
                  tempDistance = tempDistance / 1000
                  var s = tempDistance + "";
                  var str = s.substring(0, s.indexOf(".") + 3);
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
        fail: function(res) {
          console.log(res);
        },
      });
      a++
    } while (a < len)
  },
  /**
   * 下拉刷新
   */
  onPullDownRefresh: function() {
    var that = this
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
  searchRequest: function(e) {
    var searchText = e.data.wxSearchData.value
    var that = this
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
  searchInformationRequest: function() {
    var obj = []
    var that = this
    var urlNum = that.data.urlNum
    var searchUrl = that.data.searchUrl[urlNum].url
    wx.request({
      url: 'https://800321007.littlemonster.xyz/weapp/' + searchUrl + '/',
      method: 'GET',
      data: {
        question: that.data.searchDistrict,
      },
      success: function(res) {
        console.log(res.data)
        for (var i = 0; i < res.data.data.msg.length; i++) {
          obj[i] = JSON.parse(res.data.data.msg[i].user_info);
        }
        that.setData({
          firstlist: res.data.data.msg,
          user_info: obj,
          title_text: that.data.searchDistrict
        })
        that.getDistance();
      },
      fail: function(res) {
        util.showBusy('搜索失败')
        console.log(res)
      }
    })
  },
  /**
   * 简要化描述
   */
  simpleDescription: function() {
    var that = this
    for (var i = 0; i < that.data.firstlist.length; i++) {
      if (that.data.firstlist[i].description.length > 60) {
        var tempStr = that.data.firstlist[i].description.substr(0, 60)
        var str = tempStr + '......'
        console.log(str)
        var newStr = "firstlist[" + i + "].description"
        that.setData({
          [newStr]: str
        })
      }
    }
  },
  /**
   * 轮播图事件处理
   */
  swiperchange: function(e) {
    //console.log(e.detail.current)
    this.setData({
      swiperCurrent: e.detail.current
    })
  },
  /**
   * 搜索框
   */
  wxSearchFn: function(e) {
    var that = this
    wxSearch.wxSearchAddHisKey(that);
    that.searchRequest(that)
  },
  wxSearchInput: function(e) {
    var that = this
    wxSearch.wxSearchInput(e, that);
  },
  wxSerchFocus: function(e) {
    var that = this
    wxSearch.wxSearchFocus(e, that);
  },
  wxSearchBlur: function(e) {
    var that = this
    wxSearch.wxSearchBlur(e, that);
  },
  wxSearchKeyTap: function(e) {
    var that = this
    wxSearch.wxSearchKeyTap(e, that);
  },
  wxSearchDeleteKey: function(e) {
    var that = this
    wxSearch.wxSearchDeleteKey(e, that);
  },
  wxSearchDeleteAll: function(e) {
    var that = this;
    wxSearch.wxSearchDeleteAll(that);
  },
  wxSearchTap: function(e) {
    var that = this
    wxSearch.wxSearchHiddenPancel(that);
  },
  /**
   * 分享页面
   */
  onShareAppMessage: function() {
    return {
      title: '看哪小程序',
      desc: '你想看哪，我帮你',
      path: '/pages/start/start?id=123',
      success: function(res) {
        console.log(res)
      },
      fail: function(res) {
        // 分享失败
        console.log(res)
      }
    }
  },

  /**
   * 下拉菜单
   */
  onReachBottom: function() {
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
  choiceItem: function(e) {
    switch (e.currentTarget.dataset.item) {
      case "1":
        if (this.data.chioceDistrict) {
          this.setData({
            districtChioceIcon: "../../images/icon-go-black.png",
            sortingChioceIcon: "../../images/icon-go-black.png",
            chioceDistrict: false,
            chioceSorting: false,
            chioceFilter: false,
          });
        } else {
          this.setData({
            districtChioceIcon: "../../images/icon-down-black.png",
            sortingChioceIcon: "../../images/icon-go-black.png",
            chioceDistrict: true,
            chioceSorting: false,
            chioceFilter: false,
          });
        }
        break;
      case "2":
        if (this.data.chioceSorting) {
          this.setData({
            districtChioceIcon: "../../images/icon-go-black.png",
            sortingChioceIcon: "../../images/icon-go-black.png",
            chioceDistrict: false,
            chioceSorting: false,
            chioceFilter: false,
          });
        } else {
          this.setData({
            districtChioceIcon: "../../images/icon-go-black.png",
            sortingChioceIcon: "../../images/icon-down-black.png",
            chioceDistrict: false,
            chioceSorting: true,
            chioceFilter: false,
          });
        }
        break;
    }
  },
  hideAllChioce: function() {
    this.setData({
      districtChioceIcon: "../../images/icon-go-black.png",
      sortingChioceIcon: "../../images/icon-go-black.png",
      chioceDistrict: false,
      chioceSorting: false,
      chioceFilter: false,
    });
  },

  selectDistrictParent: function(e) {
    console.log(e)
    this.setData({
      activeDistrictParentIndex: e.currentTarget.dataset.index,
      activeDistrictChildrenIndex: 0,
      scrollTop: 0,
      scrollIntoView: 0
    })
  },

  selectDistrictChildren: function(e) {
    var that = this
    var index = e.currentTarget.dataset.index;
    var parentIndex = that.data.activeDistrictParentIndex == -1 ? 0 : that.data.activeDistrictParentIndex;
    if (index >= 0) {
      var district_name = that.data.children_list[parentIndex].list[index].district_name
      that.setData({
        urlNum: 0,
        searchDistrict: district_name,
      })
      that.searchInformationRequest()
    }
    that.setData({
      districtChioceIcon: "../../images/icon-go-black.png",
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
  selectSorting: function(e) {
    var index = e.currentTarget.dataset.index;
    var that = this
    that.setData({
      sortingChioceIcon: "../../images/icon-go-black.png",
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
        var a = that.data.firstlist
        var b = that.data.distance
        var c = that.data.user_info
        for (var i = 0; i < a.length; i++) {
          for (var j = i; j < a.length; j++) {
            if (a[i].distance > a[j].distance) {
              var tempa = a[j]
              a[j] = a[i]
              a[i] = tempa
              var tempb = b[j]
              b[j] = b[i]
              b[i] = tempb
              var tempc = c[j]
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

  bannersActivity: function() {
    wx.showModal({
      title: '提示',
      content: '官方活动正准备中',
      cancelText: '了解了',
      confirmText: '很期待',
      success: function(res) {
        if (res.confirm) {
          console.log('用户点击确定')
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },

  chioceDistrictFlag: function(){
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