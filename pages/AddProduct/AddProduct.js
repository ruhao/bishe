const util = require('../../utils/util.js')//引入全局变量
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    Productname: '',
    DateOfProduced: '',
    MaturityDate: '',
    weight: '',
    RemainNum: '',
    imgurl: '',
    time: 0,
    touchDot: 0,
    interval: 0,
    flag: true,
    ChangeOrAdd: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (e) {
    if (app.globalData.wareHousenameList.Productname) {
      this.setData({
        Productname: app.globalData.wareHousenameList.Productname,
        DateOfProduced: app.globalData.wareHousenameList.DateOfProduced,
        MaturityDate: app.globalData.wareHousenameList.MaturityDate,
        weight: app.globalData.wareHousenameList.weight,
        RemainNum: app.globalData.wareHousenameList.RemainNum,
        imgurl: app.globalData.wareHousenameList.imgurl
      })
    }
    this.setData({
      ChangeOrAdd: app.globalData.ChangeOrAdd
    })
  },
  formSubmit: function (e) {
    if (this.data.ChangeOrAdd == 'Add'){
      let data = e.detail.value
      data.type = '1' 
      data.AreaOfWarehouse = app.globalData.AreaOfWarehouse
      data.imgurl = this.data.imgurl
      wx.request({
        method: 'POST',
        url: util.Api + '/warehouse/data',
        data: data,
        header: {
          'content-type': 'application/json' // 默认值
        },
        success: function (res) {
          console.log(res)
            // wx.navigateBack({
            //   url: '../AdminChange/AdminChange'
            // })
        }
      })
    } else if (this.data.ChangeOrAdd == 'Change'){
      let data = e.detail.value
      data.type = '1'
      data.imgurl = this.data.imgurl
      data.AreaOfWarehouse = app.globalData.AreaOfWarehouse
      wx.request({
        method: 'PUT',
        url: util.Api + '/warehouse/data/' + app.globalData.wareHousenameList._id,
        data: data,
        header: {
          'content-type': 'application/json' // 默认值
        },
        success: function (res) {
          wx.navigateBack({
            url: '../AdminChange/AdminChange'
          })
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
  Upload: function (e) {
    let that = this
    wx.chooseImage({
      success: function (res) {
        console.log(res)
        var tempFilePaths = res.tempFilePaths
        wx.uploadFile({
          method: 'POST',
          url: util.Api + '/upload/upload', //仅为示例，非真实的接口地址
          filePath: tempFilePaths[0],
          name: 'avatar',
          success: function (data) {
            console.log(123)
            if (tempFilePaths[0].indexOf('wxfile')!=-1){
              let url = 'https://www.laowaicang.com/avatar-' + tempFilePaths[0].split("//")[1]
              that.setData({
                imgurl: url
              })
            }else{
              let url = 'https://www.laowaicang.com/avatar-' + tempFilePaths[0].split("tmp/")[1]
              that.setData({
                imgurl: url
              })
            }
          }
        })
      }
    })
  }
})