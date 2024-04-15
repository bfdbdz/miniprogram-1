// pages/home/home.js
const app = getApp()
// const accessToken = app.getLatestAccessToken();

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
		this.getCurrentTime()
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
			url: this.data.roleURL,
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
		setTimeout(() =>{
			this.createLocationTimer() //页面加载时创建定时器
		},5000)
		this.getLogUserInfo() //获取已登录用户信息
		this.handleWebSocketMessage = this.handleWebSocketMessage.bind(this)
		app.$on('socketMessage',this.handleWebSocketMessage)
	},

	//获取用户钱包余额、默认下车站点和匹配司机id
	getLogUserInfo() {
		wx.request({
			url: 'http://localhost:8080/passenger/current',
			method: 'GET',
			header: {
				'content-type': 'application/json',
				'Authorization': app.globalData.userInfo.userInfo.token
			},
			success: (res) => {
				if (res.statusCode === 200) {
					if (res.data.code === 200) {
						console.log("获取当前登录用户信息", res)
						const newUserInfo = {
							stationName: res.data.data.stationName,
							driverId: res.data.data.driverId,
							money: res.data.data.money
						}
						const userInfoPast = app.globalData.userInfo.userInfo
						const userInfo = {
							...userInfoPast,
							...newUserInfo
						}
						console.log("更新的用户信息", newUserInfo)
						console.log("旧用户信息",userInfoPast)
						//更新本地存储
						wx.setStorage({
							key: 'userInfo',
							userInfo
						})
						//更新全局数据
						app.globalData.userInfo = {
							userInfo
						}
						console.log("全局数据更新成功？", app.globalData.userInfo.userInfo)
					}
				}
			},
			fail: (err) => {
				//请求失败
				console.log("获取当前登录用户信息失败", err);
			}
		})
	},

	//监听后端人车拟合消息
	registerWebSocketListener() {

		// 监听 WebSocket 连接打开事件
		// wx.onSocketOpen((res) => {
		// 	console.log('WebSocket连接已打开-home页面');
		// });

		// 监听 WebSocket 接受到服务器的消息事件
		// wx.onSocketMessage((res) => {
		// 	// console.log('收到服务器数据：', res.data);
		// 		let data = JSON.parse(res.data)
		// 		console.log('收到服务器数据：', data)
		// 		//人车拟合消息
		// 		if(data.type == 1){
		// 			// this.globalData.passengerStatus = 'on'
		// 			this.handleWebSocketMessage(data);
		// 		}
		// });

		// // 监听 WebSocket 连接错误事件
		// wx.onSocketError((res) => {
		// 	console.error('WebSocket连接发生错误：', res.errMsg);
		// });

		// // 监听 WebSocket 连接关闭事件
		// wx.onSocketClose((res) => {
		// 	console.log('WebSocket连接已关闭');
		// });
	},

	handleWebSocketMessage(message) {
		console.log('收到的消息：', message);
		app.globalData.passengerStatus='on'
		this.clearLocationTimer() //人车拟合成功，停止上传数据
		this.getDriverId()//更新用户信息中driberId
		wx.showModal({
			title: '提示',
			content: '已识别到您在车上并自动为您进行扣费，请选择下车站点',
			showCancel:'false',
			complete: (res) => {
				if (res.confirm) {
					wx.switchTab({
						url: '../getoff/getoff',
					})
				}
			}
		})
	},

	getDriverId(){
		wx.request({
			url: 'http://localhost:8080/passenger/current',
			method: 'GET',
			header: {
				'content-type': 'application/json',
				'Authorization': app.globalData.userInfo.userInfo.token
			},
			success: (res) => {
				if (res.statusCode === 200) {
					if (res.data.code === 200) {
						console.log("获取用户匹配司机id", res)
						const newUserInfo = {
							driverId: res.data.data.driverId
						}
						const userInfoPast = app.globalData.userInfo.userInfo
						const userInfo = {
							...userInfoPast,
							...newUserInfo
						}
						console.log("更新后的匹配信息", userInfo)
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
						console.log("全局数据driverId更新成功？", app.globalData.userInfo.userInfo)
					}
				}
			},
			fail: (err) => {
				//请求失败
				console.log("获取匹配信息失败", err);
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