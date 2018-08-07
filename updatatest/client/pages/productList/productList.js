var app = getApp();
Page({
  data: {
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
      key: 1,
      value: "智能排序"
    }, {
      key: 2,
      value: "距离最近"
    }, {
      key: 3,
      value: "日期最近"
    }, {
      key: 4,
      value: "回答最多"
    }, {
      key: 5,
      value: "金币最多"
    }],
    districtChioceIcon: "/images/icon-go-black.png",
    sortingChioceIcon: "/images/icon-go-black.png",
    chioceDistrict: false,
    chioceSorting: false,
    chioceFilter: false,
    activeDistrictParentIndex: 0,
    activeDistrictChildrenIndex: -1,
    activeDistrictName: "热门区域",
    scrollTop: 0,
    scrollIntoView: 0,
    activeSortingIndex: -1,
    activeSortingName: "综合排序"
  },
  onLoad: function(options) {

  },

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
            districtChioceIcon: "/images/icon-go-black.png",
            sortingChioceIcon: "/images/icon-go-black.png",
            chioceDistrict: false,
            chioceSorting: false,
            chioceFilter: false,
          });
        } else {
          this.setData({
            districtChioceIcon: "/images/icon-down-black.png",
            sortingChioceIcon: "/images/icon-go-black.png",
            chioceDistrict: true,
            chioceSorting: false,
            chioceFilter: false,
          });
        }
        break;
      case "2":
        if (this.data.chioceSorting) {
          this.setData({
            districtChioceIcon: "/images/icon-go-black.png",
            sortingChioceIcon: "/images/icon-go-black.png",
            chioceDistrict: false,
            chioceSorting: false,
            chioceFilter: false,
          });
        } else {
          this.setData({
            districtChioceIcon: "/images/icon-go-black.png",
            sortingChioceIcon: "/images/icon-down-black.png",
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
      districtChioceIcon: "/images/icon-go-black.png",
      sortingChioceIcon: "/images/icon-go-black.png",
      chioceDistrict: false,
      chioceSorting: false,
      chioceFilter: false,
    });
  },
 
  selectDistrictParent: function(e) {
    console.log(e)
    this.setData({
      activeDistrictParentIndex: e.currentTarget.dataset.index,
      activeDistrictName: this.data.districtList[e.currentTarget.dataset.index].district_name,
      activeDistrictChildrenIndex: 0,
      scrollTop: 0,
      scrollIntoView: 0
    })
  },
  selectDistrictChildren: function(e) {
    var index = e.currentTarget.dataset.index;
    var parentIndex = this.data.activeDistrictParentIndex == -1 ? 0 : this.data.activeDistrictParentIndex;
    console.log(e)
    if (index < 0) {
      this.setData({
        activeDistrictName: this.data.districtList[parentIndex].district_name
      })
    } else {
      this.setData({
        activeDistrictName: this.data.children_list[parentIndex].list[index].district_name
      })
    }
    this.setData({
      districtChioceIcon: "/images/icon-go-black.png",
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
    this.setData({
      sortingChioceIcon: "/images/icon-go-black.png",
      chioceSorting: false,
      activeSortingIndex: index,
      activeSortingName: this.data.sortingList[index].value,
      productList: [],
      pageIndex: 1,
      loadOver: false,
      isLoading: true
    })
    //this.getProductList();
  },
  //筛选
  selectFilter: function(e) {
    var index = e.currentTarget.dataset.index;
    var _filterList = this.data.filterList;
    _filterList[index].selected = !_filterList[index].selected;
    this.setData({
      filterList: _filterList
    })
  },
  resetFilter: function() {
    var _filterList = this.data.filterList;
    _filterList.forEach(function(e) {
      e.selected = false;
    })
    this.setData({
      filterList: _filterList
    })
  },
  filterButtonClick: function() {
    this.setData({
      chioceFilter: false,
      productList: [],
      pageIndex: 1,
      loadOver: false,
      isLoading: true
    })
    //this.getProductList();
  },
})