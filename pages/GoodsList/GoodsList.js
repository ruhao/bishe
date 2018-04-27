const util = require('../../utils/util.js')//引入全局变量
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    GoodsList:[],
    name:'',
    time: 0,
    touchDot: 0,
    interval: 0,
    flag: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getData()
    this.setData({
      name: app.globalData.warehousename
    })
  },
  getData: function (e) {
    let data = {
      AreaOfWarehouse: app.globalData.AreaOfWarehouse,
      type: '1'
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
        console.log(res.data.rows)
        that.setData({
          GoodsList: res.data.rows
        })
      }
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
        url: '../InventoryList/InventoryList'
      })
    }
    clearInterval(this.data.interval); // 清除setInterval
    this.data.time = 0
  }
})