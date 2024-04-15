// pages/mine/mine.js
const app = getApp()

Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		userInfo: app.globalData.userInfo.userInfo,
		role: ''
	},

	logout() {
		// 清空本地缓存
		wx.clearStorageSync();

		//清空全局数据
		app.globalData.userInfo = {}
		console.log(app.globalData.userInfo)
	
		// 断开webSocket连接
		wx.closeSocket()

		// 返回登录页
		wx.reLaunch({
			url: '/pages/login/login',
		})
		console.log("退出登录")
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad(options) {
		console.log("个人信息",app.globalData.userInfo.userInfo)
		if (this.data.userInfo.role == 0) {
			this.setData({
				role: "乘客"
			})
		} else if (this.data.userInfo.role == 1) {
			this.setData({
				role: "司机"
			})
		}
	},
	
	toSetting(){
		wx.navigateTo({
			url: '/pages/setting/setting',
		})
	},

	toWallet(){
		wx.navigateTo({
			url: '/pages/wallet/wallet',
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