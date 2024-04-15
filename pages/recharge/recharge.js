// pages/recharge/recharge.js
const app = getApp()

Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		options: [5, 10, 20, 40, 50, 80],
		selected: null,
		userInfo:app.globalData.userInfo.userInfo
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad(options) {
	},

	handleMoneyClick(e) {
		const index = e.currentTarget.dataset.index;
		this.setData({
			selected: index,
		});
	},

	rechargeConfirm() {
		// console.log("充值的金额",this.data.options[this.data.selected])
		wx.request({
			url: 'http://192.168.202.155:8080/passenger/payment?money='+this.data.options[this.data.selected],
			method: 'PUT',
			// data: {
				
			// },
			header: {
				// 'content-type': 'application/json',
				'Authorization': this.data.userInfo.token
			},
			success: (res) => {
				console.log("充值金额", this.data.options[this.data.selected])
				if (res.statusCode === 200) {
					if (res.data.code === 200) {
						// console.log(res)
						// this.getNewMoney()
						wx.showToast({
							icon: 'none',
							title: '充值成功！即将跳转至余额页',
							mask: true,
							duration: 2000
						});
						setTimeout(() => {
							wx.navigateBack()
						}, 2000); //2秒后跳转
					}
				}
			},
			fail: (err) => {
				console.log("连接失败", err)
			}
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