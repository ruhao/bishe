const util = require('../../utils/util.js')//引入全局变量
const app = getApp()
Page({
  data: {
    IsLoadDown: '',
    Percentage: '',
    ppWidth: '0',
    downloadTask: '',
    url: '',
    imgurl:''
  },
  onLoad: function (e) {
  },
  Download: function (e) {
    let that = this
    this.setData({
      Percentage: '下载中'
    })
    this.data.downloadTask = wx.downloadFile({
      url: util.Api + '/avatar-work.xlsx', //仅为示例，并非真实的资源
      success: function (res) {
        var tempFilePaths = res.tempFilePath
        wx.saveFile({
          tempFilePath: tempFilePaths,
          success: function (res) {
            that.setData({
              url: res.savedFilePath
            })
            var savedFilePath = res.savedFilePath
          }
        })
      }
    })
    this.data.downloadTask.onProgressUpdate((res) => {
      let PPlength = res.progress * 0.8
      that.setData({
        ppWidth: PPlength
      })
      if (res.progress == 100) {
        that.setData({
          Percentage: '下载完成'
        })
      }
    })
  },
  OpenDownload: function (e) {
    wx.downloadFile({
      url: this.data.url,
      success: function (res) {
        var filePath = res.tempFilePath
        wx.openDocument({
          filePath: filePath,
          success: function (res) {
            console.log('打开文档成功')
          }
        })
      }
    })
  },
  Upload: function (e) {
    let that=this
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
            let url = 'https://www.laowaicang.com/avatar-'+tempFilePaths[0].split("tmp/")[1]
            console.log(url)
            that.setData({
              imgurl:url
            })
            //do something
          }
        })
      }
    })
  }
})
