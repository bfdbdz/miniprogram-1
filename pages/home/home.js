// pages/home/home.js
const app = getApp()
const accessToken = app.getLatestAccessToken();

Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		latitude: 0,
		longitude: 0,
		speed: 0,
		markers: [],
		currentTime: '',
		roleURL: ''
	},

	//创建定时器
	createLocationTimer() {
		this.getLocationAndSpeed()
		this.timer = setInterval(() => {
			this.getLocationAndSpeed()
			this.getCurrentTime()
		}, 60000) // 60000毫秒 = 1分钟
	},

	// 销毁定时器
	clearLocationTimer() {
		clearInterval(this.timer)
	},

	// 获取当前时间
	getCurrentTime() {
		let time = new Date();

		// 提取时和分
		let hours = time.getHours();
		let minutes = time.getMinutes();

		// 将时间格式化为字符串
		this.setData({
			currentTime: `${hours}:${minutes.toString().padStart(2, '0')}`
		})

		console.log("时间", time)
		console.log(hours)
		console.log(minutes)
		console.log(this.data.currentTime)
	},

	// 请求定位权限
	requestLocationPermission() {
		//用户之前是否已经授权过
		wx.authorize({
			scope: 'scope.userLocation',
			success: () => {
				console.log('Authorize success')
				this.getLocation()
			},
			fail: (err) => {
				console.log('Authorize error:', err)
				wx.showModal({
					title: '定位权限请求',
					content: '进行乘车需要获取您的位置信息,请授权后再使用',
					showCancel: true,
					confirmText: '确定',
					cancelText: '拒绝',
					confirmColor: '#6587b5',
					success: function (res) {
						if (res.confirm) {
							this.getLocation()
						} else if (res.cancel) {
							wx.showToast({
								icon: 'none',
								title: '您拒绝了定位授权，我们无法为您提供服务',
								duration: 1000,
								mask: true
							})
						}
					}
				})
			}
		})
	},

	// 获取用户位置和速度
	getLocationAndSpeed() {
		wx.getLocation({
			type: 'gcj02', // 返回可以用于 wx.openLocation 的坐标
			success: (res) => {
				console.log("获取位置", res)
				this.setData({
					latitude: res.latitude,
					longitude: res.longitude,
					speed: res.speed,
					markers: [{
						id: 0,
						latitude: res.latitude,
						longitude: res.longitude,
						width: 20,
						height: 30
					}]
				})
				console.log("纬度", this.data.latitude)
				console.log("经度", this.data.longitude)
				console.log("速度", this.data.speed)
				console.log("markers", this.data.markers)
				this.moveMapToCenter()
				this.uploadLocationAndSpeed(res.latitude, res.longitude, res.speed, this.data.currentTime)
			},
			fail: (err) => {
				console.error('获取位置信息失败:', err)
				wx.showModal({
					title: '获取位置信息失败',
					content: JSON.stringify(err),
					showCancel: false
				})
			}
		})
	},

	// 将定位在页面中心展示
	moveMapToCenter() {
		this.mapContext = wx.createMapContext('myMap')
		this.mapContext.moveToLocation()
	},

	//判断用户上传的url
	sendRequest() {
		const userRole = app.globalData.userInfo.userInfo.role
		console.log("角色", userRole)
		console.log("token", app.globalData.userInfo.userInfo)

		if (userRole == 0) {
			this.setData({
				roleURL: 'http://localhost:8080/passenger/location'
			})
		} else if (userRole == 1) {
			this.setData({
				roleURL: 'http://localhost:8080/driver/location'
			})
		}
		console.log("设定的url", this.data.roleURL)
	},

	// 上传用户定位和速度
	uploadLocationAndSpeed(latitude, longitude, speed, time) {
		this.sendRequest()
		wx.request({
			url: this.data.roleURL, //补全地址
			header: {
				'Authorization': app.globalData.userInfo.userInfo.token
			},
			method: 'POST',
			data: {
				latitude,
				longitude,
				speed,
				time
			},
			success: (res) => {
				console.log('上传成功:', res.data)
				// 请求判断结果
				this.onTheBus()
			},
			fail: (err) => {
				console.error('上传失败:', err)
				wx.showToast({
					title: '请求失败，请检查网络',
					icon: 'error',
					mask: true,
					duration: 1000
				})
			}
		})
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad(options) {
		this.createLocationTimer() //页面加载时创建定时器
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
		this.clearLocationTimer() // 页面销毁时清除定时器
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