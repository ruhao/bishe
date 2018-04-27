const util = require('../../utils/util.js')//引入全局变量
const app = getApp()
Page({
  data: {
    username: '',
    password: '',
    IsRememberPassword: ['checkbox1'],
    InformationFeedback: ''
  },
  onLoad: function () {
    let that = this
    wx.getStorage({
      key: 'user',
      success: function (res) {
        console.log(1)
        that.setData({
          username: res.data.reg,
          password: res.data.password
        })
      }
    })
  },
  GetNmae: function (e) {//获取账号
    this.setData({
      username: e.detail.value
    })
  },
  GetPassword: function (e) {//获取密码
    this.setData({
      password: e.detail.value
    })
  },
  Login: function (e) {
    let that = this//this指向问题
    if (this.data.username) {//判断是不是输入账号
      wx.request({//访问数据接口
        method: 'POST',
        url: util.Api + '/admin/list',
        data: {
          reg: that.data.username//搜索条件
        },
        header: {
          'content-type': 'application/x-www-form-urlencoded' // 默认值
        },
        success: function (res) {
          if (res.data.rows.length > 0) {//访问的账号是否纯在
            if (res.data.rows[0].password == that.data.password) {//如果账号存在，密码进行匹配
              if (res.data.rows[0].workarea == 'administrator'){
                app.globalData.username = 'administrator'
              }
              if (that.data.IsRememberPassword.length > 0) {//面登入操作
                let obj ={
                  reg: that.data.username,
                  password: that.data.password
                }
                wx.setStorage({//如果一切成立那么进行记住密码减少操作
                  key: "user",
                  data: obj,
                  success: function(){
                    wx.navigateTo({
                      url: '../Choose/Choose'
                    })
                  }
                })
              }else{
                wx.navigateTo({
                  url:'../Choose/Choose'
                })
              }
            } else {
              that.setData({
                InformationFeedback: '密码错误'
              })
            }
          } else {
            that.setData({
              InformationFeedback: '该账号不存在'
            })
          }
        }
      })
    } else {
      that.setData({
        InformationFeedback: '用户名不能为空'
      })
    }
  },
  checkboxChange: function (e) {//检测checkbox是不是打勾
    this.setData({
      IsRememberPassword: e.detail.value
    })
  }
})