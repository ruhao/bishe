const util = require('../../utils/util.js')//引入全局变量
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    ProductList: [],
    title: '',
    index: 0,
    id: [],
    ids: [],
    show: '',
    search: '',
    time: 0,
    touchDot: 0,
    interval: 0,
    flag: true,
    Productname: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      title: app.globalData.warehousename
    })
    this.getData()
  },
  GetUpdate:function(e){
    this.getData()
  },
  getData: function (e) {
    let data = {
      AreaOfWarehouse: app.globalData.AreaOfWarehouse,
      type: '1',
      limit: 300
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
        let ii = res.data.rows.length
        let arr1 = []
        for (let i = 0; i < ii; i++) {
          let obj = {
            name: res.data.rows[i]._id
          }
          arr1.push(obj)
        }
        that.setData({
          ProductList: res.data.rows,
          id: arr1
        })
      }
    })
  },
  checkboxChange: function (e) {
    this.setData({
      ids: e.detail.value
    })
  },
  Alldelete: function (e) {
    app.globalData.wareHousenameList = ''
    if (this.data.ids.length > 0) {
      this.setData({
        show: 'open'
      })
    }
  },
  SureDelete: function (e) {
    let that = this
    wx.request({//访问数据接口
      method: 'POST',
      url: util.Api + '/warehouse/deletes',
      data: {
        ids: this.data.ids.toString()//搜索条件
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded' // 默认值
      },
      success: function (res) {
        that.setData({
          show: ''
        })
        that.getData()
      }
    })
  },
  CancelDelete: function (e) {
    this.setData({
      show: ''
    })
  },
  UpdateContent: function (e) {
    app.globalData.wareHousenameList = ''
    this.setData({
      search: 'open'
    })
  },
  Getsearch: function (e) {
    this.setData({
      Productname: e.detail.value
    })
  },
  addNew:function(e){
    app.globalData.wareHousenameList = ''
    app.globalData.ChangeOrAdd = 'Add'
    wx.navigateTo({
      url: '../AddProduct/AddProduct'
    })
  },
  SearchType: function (e) {
    if (this.data.Productname) {
      let that = this
      let data = {
        Productname: this.data.Productname
      }
      wx.request({
        method: 'POST',
        url: util.Api + '/warehouse/list',
        data: data,
        header: {
          'content-type': 'application/json' // 默认值
        },
        success: function (res) {
          app.globalData.wareHousenameList = res.data.rows[0]
          app.globalData.ChangeOrAdd = 'Change'
          that.setData({
            search: ''
          })
          wx.navigateTo({
            url: '../AddProduct/AddProduct'
          })
        }
      })
    }else{
      let that = this
      wx.showModal({
        content: '请输入搜索的信息',
        success: function (res) {
          if (res.confirm) {
            that.setData({
              search: ''
            })
          } else if (res.cancel) {
            that.setData({
              search: ''
            })
          }
        }
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
  },
})