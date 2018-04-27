const app = getApp()
const util = require('../../utils/util.js')
Page({
  data: {
    GoodsList: [],
    time: 0,
    touchDot: 0,
    interval: 0,
    flag: true,
    // IsLoadDown:'ReadyLoad',
    progress: '',
    GoodLists: [],
    MORE: 'MORE'
  },
  onLoad: function () {
    let obj = {
      SerialNumber: getApp().globalData.ContentDetail,//引入全局变量
      limit: 300
    }
    this.GetData(obj)
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
        console.log(res)
        res.data = res.data.rows
        let GoodsNUmber = res.data.length
        let arr = []

        for (let i = 0; i < GoodsNUmber; i++) {
          if (res.data[i].ProductName.length > 0) {
            //数据的更改与转换
            let brr = res.data[i].ProductName
            arr = brr.split('/').slice(0, 2)
            res.data[i].ProductName = res.data[i].ProductName.split('/')
            res.data[i].ProductType = res.data[i].ProductType.split('/')
            res.data[i].ProductImage = res.data[i].ProductImage.split('/')
            res.data[i].ProductContentCN = res.data[i].ProductContentCN.split('/')
            let ii = res.data[i].ProductImage.length
            for (let j = 0; j < ii; j++) {
              res.data[i].ProductImage[j] = util.Api + "/" + res.data[i].ProductImage[j]
            }
          }
          res.data[i].OrderTime = res.data[i].OrderTime.replace("T", "   ");
          res.data[i].DeliveryTime = res.data[i].DeliveryTime.replace("T", "   ");
          res.data[i].ArrivalTime = res.data[i].ArrivalTime.replace("T", "   ");
          res.data[i].InspectionDone = res.data[i].InspectionDone.replace("T", "   ");
          res.data[i].TaxTime = res.data[i].TaxTime.replace("T", "   ");
          res.data[i].ReleaseTime = res.data[i].ReleaseTime.replace("T", "   ");
          res.data[i].StorageTime = res.data[i].StorageTime.replace("T", "   ");
          res.data[i].CIQTime = res.data[i].CIQTime.replace("T", "   ");
        }
        that.setData({
          GoodsLists: arr
        })
        that.setData({
          GoodsList: res.data
        })
        that.setData({
          url: that.data.GoodsList[0].InspectionDonePDF
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
        url: '../Logistics/Logistics'
      })
    }
    clearInterval(this.data.interval); // 清除setInterval
    this.data.time = 0
  },
  // Download: function (e) {
  //   let that = this
  //   this.setData({
  //     IsLoadDown: 'loading'
  //   })
  //   this.data.downloadTask = wx.downloadFile({
  //     url: that.data.GoodsList[0].InspectionDonePDF, //仅为示例，并非真实的资源
  //     success: function (res) {
  //       var tempFilePaths = res.tempFilePath
  //       wx.saveFile({
  //         tempFilePath: tempFilePaths,
  //         success: function (res) {
  //           that.setData({
  //             url: that.data.GoodsList[0].InspectionDonePDF
  //           })
  //           var savedFilePath = res.savedFilePath
  //         }
  //       })
  //     }
  //   })
  //   this.data.downloadTask.onProgressUpdate((res) => {
  //     let PPlength = res.progress * 0.8
  //     that.setData({
  //       ppWidth: PPlength,
  //       progress: res.progress
  //     })
  //     if (res.progress=='100'){
  //       that.setData({
  //         IsLoadDown: 'open'
  //       })
  //     }
  //   })
  // }, 
  OpenDownload: function (e) {
    console.log(this.data.url)
    wx.downloadFile({
      url: this.data.url,
      success: function (res) {
        console.log(res)
        var filePath = res.tempFilePath
        wx.openDocument({
          filePath: filePath,
          success: function (res) {
            console.log('filePath')
          }
        })
      }
    })
  },
  GetMore: function () {
    this.setData({
      GoodsLists: this.data.GoodsList[0].ProductName,
      MORE: ''
    })
  }
})