Page({
  GoToLogistics:function(e){
    wx.navigateTo({
      url: '../Logistics/Logistics'
    })
  },
  GoToInventory:function(e){
    wx.navigateTo({
      url: '../InventoryList/InventoryList'
    })
  }
})