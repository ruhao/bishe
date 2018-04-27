const util = require('../../utils/util.js')//引入全局变量
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    WarehouseList: [],
    time: 0,
    touchDot: 0,
    interval: 0,
    flag: true,
    userwork: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getData()
  },
  getData: function (e) {
    let data = {
      type: "2"
    }
    let that = this
    wx.request({
      method: 'POST',
      url: util.Api + '/warehouse/list',
      data: data,
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        that.setData({
          WarehouseList: res.data.rows
        })
      }
    })
  },
  GoToGoodslist: function (e) {
    app.globalData.AreaOfWarehouse = e.currentTarget.dataset.areaofwarehouse
    app.globalData.warehousename = e.currentTarget.dataset.warehousename
    if (app.globalData.username == 'administrator'){
      wx.navigateTo({
        url: '../AdminChange/AdminChange'
      })
    }else{
      wx.navigateTo({
        url: '../GoodsList/GoodsList'
      })
    }

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
        url: '../Logistics/Logistics'
      })
    }
    clearInterval(this.data.interval); // 清除setInterval
    this.data.time = 0
  }
})