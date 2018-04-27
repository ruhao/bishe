const util = require('../../utils/util.js')
const app = getApp()
Page({
  data: {
    IsDeliveryTime: ['查看所有', '已发货'],
    IsInspectionDone: ['已发货的批次', '已报检'],
    IsStorageTime: ['已报检的批次', '已入库'],
    IsDeliveryTimeIndex: 0,
    IsInspectionDoneIndex: 0,
    IsStorageTimeIndex: 0,
    ProductType: '',
    ShowData: [],
    DeliveryTime: '',
    InspectionDone: '',
    StorageTime: '',
    Isaccomplish:'否',
    time: 0,
    touchDot: 0,
    interval: 0,
    flag: true
  },
  onLoad: function () {
    let fliter = {
      DeliveryTime: this.data.DeliveryTime,
      InspectionDone: this.data.InspectionDone,
      StorageTime: this.data.StorageTime,
      Isaccomplish: this.data.Isaccomplish
    }
    this.GetData(fliter)
  },
  GetData: function (data) {
    let that = this
    wx.request({
      method: 'POST',
      url: util.Api + '/xlsx/list',
      data: data,
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        res.data = res.data.rows
        that.setData({
          ShowData: res.data
        })
      }
    })
  },
  Getsearch: function (e) { //获取要搜索的内容
    this.setData({
      ProductType: e.detail.value
    })
  },
  SearchType: function (e) { //进行搜索
    let fliter = {
      DeliveryTime: this.data.DeliveryTime,
      InspectionDone: this.data.InspectionDone,
      StorageTime: this.data.StorageTime,
      Isaccomplish: this.data.Isaccomplish,
      ProductType: this.data.ProductType
    }
    this.GetData(fliter)
  },
  IsStorageTimeIndex: function (e) { //改变是不是入库数据进行帅选
    if (e.detail.value == '1') {
      if (this.data.IsInspectionDoneIndex == '1') {
        this.setData({
          IsStorageTimeIndex: e.detail.value
        })
        this.ChangeFliter(e.detail.value, 'StorageTime')
      }
    }
    if (e.detail.value == '0') {
      this.setData({
        IsStorageTimeIndex: e.detail.value
      })
      this.ChangeFliter(e.detail.value, 'StorageTime')
    }
  },
  ChangeIsInspectionDone: function (e) { //改变是否报检数据进行帅选
    if (e.detail.value == '1') {
      if (this.data.IsDeliveryTimeIndex == '1') {
        this.setData({
          IsInspectionDoneIndex: e.detail.value
        })
        this.ChangeFliter(e.detail.value, 'InspectionDone')
      }
    }
    if (e.detail.value == '0') {
      if (this.data.IsStorageTimeIndex == '0') {
        this.setData({
          IsInspectionDoneIndex: e.detail.value
        })
        this.ChangeFliter(e.detail.value, 'InspectionDone')
      }
    }
  },
  ChangeIsDeliveryTime: function (e) { //改变是否发货数据进行帅选
    if (e.detail.value == '0') {
        this.setData({
          IsDeliveryTimeIndex: e.detail.value
        })
        this.ChangeFliter(e.detail.value, 'DeliveryTime')
      }
    if (e.detail.value == '1') {
      this.setData({
        IsDeliveryTimeIndex: e.detail.value
      })
      this.ChangeFliter(e.detail.value)
    }
  },
  ChangeFliter: function (index, value) {
    if (index == '1') {
      if ('DeliveryTime' == value) {
        this.setData({
          DeliveryTime: '2'
        })
      } else if ('InspectionDone' == value) {
        this.setData({
          InspectionDone: '2'
        })
      } else if ('StorageTime' == value) {
        this.setData({
          StorageTime: '2'
        })
      }
    } else {
      if ('DeliveryTime' == value) {
        this.setData({
          DeliveryTime: ''
        })
      } else if ('InspectionDone' == value) {
        this.setData({
          InspectionDone: ''
        })
      } else if ('StorageTime' == value) {
        this.setData({
          StorageTime: ''
        })
      }
    }
    let fliter = {
      DeliveryTime: this.data.DeliveryTime,
      InspectionDone: this.data.InspectionDone,
      StorageTime: this.data.StorageTime,
      Isaccomplish: this.data.Isaccomplish
    }
    this.GetData(fliter)
  },
  GoToDetail: function (e) {
    app.globalData.ContentDetail = e.currentTarget.dataset.content
    wx.navigateTo({
      url: '../LogisticsDetail/LogisticsDetail'
    })
  },
  touchStart: function (e) {
    this.setData({
      touchDot: e.touches[0].pageX // 获取触摸时的原点
    })
    // 使用js计时器记录时间 
    let count = 0
    let that = this
    this.data.interval = setInterval(function () {
      count++
      that.setData({
        time: count
      })
    }, 100);
  },
  touchEnd: function (e) {
    var touchMove = e.changedTouches[0].pageX;
    if (touchMove - this.data.touchDot >= 120 && this.data.time < 10 && this.data.flag == true) {
      this.data.flag = false;
      //执行切换页面的方法
      wx.navigateBack({
        url: '../Choose/Choose'
      })
    }
    clearInterval(this.data.interval); // 清除setInterval
    this.data.time = 0
  }
})