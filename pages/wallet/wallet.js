// pages/wallet/wallet.js
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
		userInfo:app.globalData.userInfo.userInfo
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {

	},

	recharge(){
		wx.navigateTo({
			url: '/pages/recharge/recharge',
		})
	},

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
		this.getNewMoney()
	},
	
	//获取最新余额
	getNewMoney(){
		wx.request({
			url: 'http://192.168.202.155:8080/passenger/current',
			method: 'GET',
			header: {
				'content-type': 'application/json',
				'Authorization': app.globalData.userInfo.userInfo.token
			},
			success: (res) => {
				if (res.statusCode === 200) {
					if (res.data.code === 200) {
						console.log("获取充值后余额", res)
						const newUserInfo = {
							money: res.data.data.money
						}
						const userInfoPast = app.globalData.userInfo.userInfo
						const userInfo = {
							...userInfoPast,
							...newUserInfo
						}
						console.log("更新后的余额信息", userInfo)
						this.setData({
							userInfo:userInfo
						})
						//更新本地存储
						wx.setStorage({
							key: 'userInfo',
							userInfo
						})
						//更新全局数据
						app.globalData.userInfo = {
							userInfo
						}
						console.log("全局数据余额更新成功？", app.globalData.userInfo.userInfo)
					}else{
						console.log("充值失败")
						wx.showToast({
							icon: 'none',
							title: res.data.data.message,
							mask: true,
							duration: 2000
						});
					}
				}
			},
			fail: (err) => {
				//请求失败
				console.log("获取最新余额失败", err);
			}
		})
	},

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})