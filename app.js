// app.js
App({
	globalData: {
		userInfo: {}
	},

	onLaunch() {
		// 展示本地存储能力
		const logs = wx.getStorageSync('logs') || []
		logs.unshift(Date.now())
		wx.setStorageSync('logs', logs)

		// 清除 access_token 和 access_token_expired_time
		this.clearAccessTokenCache();

		this.checkAccessToken();

		this.getUserInfo()

		// this.initWebSocket()
	},

	getLatestAccessToken() {
		return wx.getStorageSync('access_token');
	},

	clearAccessTokenCache() {
		wx.removeStorageSync('access_token');
		wx.removeStorageSync('access_token_expired_time');
	},

	// 检查 access_token 是否过期
	checkAccessToken() {
		const accessToken = wx.getStorageSync('access_token');
		const accessTokenExpiredTime = wx.getStorageSync('access_token_expired_time');
		if (!accessToken || Date.now() > accessTokenExpiredTime) {
			// access_token 已经过期,需要重新获取
			this.getAccessToken();
		}
	},

	//重新获取 access_token 
	getAccessToken() {
		wx.request({
			url: 'https://api.weixin.qq.com/cgi-bin/token',
			data: {
				grant_type: 'client_credential',
				appid: 'wxdceadcbf12aae11f',
				secret: '3d968d11208ede44cefe42864fd8e3df'
			},
			success: (res) => {
				if (res.data.access_token) {
					// 将 access_token 和过期时间保存到本地存储中
					wx.setStorageSync('access_token', res.data.access_token);
					wx.setStorageSync('access_token_expired_time', Date.now() + (res.data.expires_in - 200) * 1000);
					console.log("new_access_token", res.data.access_token)
				} else {
					console.error('获取 access_token 失败:', res.data);
				}
			},
			fail: (err) => {
				console.error('获取 access_token 请求失败:', err);
			}
		});
	},

	//获取用户信息
	//用户进入这个页面时肯定已经登录，所以本地缓存一定有用户信息
	getUserInfo() {
		// 从本地缓存中读取用户信息
		const userInfo = wx.getStorageSync('userInfo')
		if (userInfo) {
			// 如果本地缓存中有用户信息,则将其保存到全局数据中
			this.globalData.userInfo = userInfo
			console.log("app userInfo已有", this.globalData.userInfo)
		} else {
			// 如果本地缓存中没有用户信息,则等待下次更新时再读取
			this.waitForUserInfoUpdate()
		}

	},

	// 每隔 5 秒检查一次本地缓存,看是否有用户信息更新
	waitForUserInfoUpdate() {
		// 每隔 5 秒检查一次本地缓存,看是否有用户信息更新
		this.checkUserInfoTimer = setInterval(() => {
			const userInfo = wx.getStorageSync('userInfo')
			if (userInfo) {
				// 如果本地缓存中有用户信息,则将其保存到全局数据中
				this.globalData.userInfo = userInfo
				// 停止定时器
				clearInterval(this.checkUserInfoTimer)
				console.log("app userInfo更新", this.globalData.userInfo)
			}
		}, 5000);
	},

	// initWebSocket() {
	// 	wx.connectSocket({
	// 		url: 'wss://localhost:8080/websocket',
	// 		header: {
	// 			'content-type': 'application/json'
	// 		},
	// 		method: 'GET'
	// 	})

	// 	wx.onSocketOpen((res) => {
	// 		console.log('WebSocket连接已打开')
	// 	})

	// 	wx.onSocketMessage((res) => {
	// 		console.log('收到服务器数据：', res.data)
	// 		// 在这里处理收到的消息
	// 	})

	// 	wx.onSocketError((res) => {
	// 		console.error('WebSocket连接发生错误：', res.errMsg)
	// 	})

	// 	wx.onSocketClose((res) => {
	// 		console.log('WebSocket连接已关闭')
	// 	})
	// }

})
