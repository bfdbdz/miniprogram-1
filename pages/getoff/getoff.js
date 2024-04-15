// pages/getoff/getoff.js
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

	/**
	 * 生命周期函数--监听页面初次渲染完成
	 */
	onReady() {

	},

	/**
	 * 生命周期函数--监听页面显示
	 */
	onShow() {
		this.setData({
			userInfo:app.globalData.userInfo.userInfo
		})
		this.setData({
			'getoff-passenger.userInfo':this.data.userInfo
		})
		console.log("切换到下车站点",this.data.userInfo)
		const getoffDriver = this.selectComponent('#driver')
		if(this.data.userInfo.role == 1){
			getoffDriver.getStop()
		}
		// console.log("缓存中的信息",info)
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