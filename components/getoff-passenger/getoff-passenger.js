// components/getoff-passenger/getoff-passenger.js
const app = getApp()

Component({
	// options: {
	// 	watch: {
	// 		'properties.userInfo.stationName': function (newVal, oldVal) {
	// 			this.onUserInfoChange()
	// 			console.log('stationName改变from', oldVal, 'to', newVal)
	// 		},
	// 		'properties.userInfo.driverId': function (newVal, oldVal) {
	// 			this.onUserInfoChange()
	// 			console.log('driverId改变from', oldVal, 'to', newVal)
	// 		},
	// 	}
	// },
	lifetimes:{
		attached(){
			this.onUserInfoChange()
		}
	},

	/**
	 * 组件的属性列表
	 */
	properties: {
		userInfo: app.globalData.userInfo.userInfo
	},

	/**
	 * 组件的初始数据
	 */
	data: {
		options: ['长安校区', '国际医学中心', '紫薇', '高新', '劳动南路', '友谊校区'],
		selected: null,
		showNoBus: true,
		showContainer: false
	},

	/**
	 * 组件的方法列表
	 */
	methods: {
		handleStationClick(e) {
			const index = e.currentTarget.dataset.index;
			this.setData({
				selected: index,
			});
		},

		stationConfirm() {
			var stationChoice
			switch (this.data.selected) {
				case 0:
					stationChoice = 'changan'
					break;
				case 1:
					stationChoice = 'guojiyi'
					break;
				case 2:
					stationChoice = 'ziwei'
					break;
				case 3:
					stationChoice = 'gaoxin'
					break;
				case 4:
					stationChoice = 'laodong'
					break;
				case 5:
					stationChoice = 'youyi'
					break;
				default:
					console.log('未选择站点')
					wx.showToast({
						title: '请选择下车站点',
						icon: 'none',
						mask: 'true',
						duration: 1000
					})
					break;
			}
			wx.request({
				url: 'http://localhost:8080/passenger/stationName?stationName=' + stationChoice,
				method: 'PUT',
				header: {
					'Authorization': this.properties.userInfo.token
				},
				success: (res) => {
					console.log("下车站点", this.data.options[this.data.selected])
					if (res.statusCode === 200) {
						if (res.data.code === 200) {
							// console.log(res)
							const newUserInfo = {
								stationName: stationChoice,
							}
							const userInfoPast = app.globalData.userInfo.userInfo
							const userInfo = {
								...userInfoPast,
								...newUserInfo
							}
							console.log("更新后的用户信息", userInfo)
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
							wx.showToast({
								icon: 'none',
								title: '选择成功！',
								mask: true,
								duration: 2000
							});
							setTimeout(() => {
								this.setData({
									showNoBus: false,
									showContainer: false
								})
							}, 2000);
						}
					}
				},
				fail: (err) => {
					console.log("连接失败", err)
				}
			})
		},

		rselect() {
			this.setData({
				showNoBus: false,
				showContainer: true
			})
		},

		//用户匹配到司机时、选择下车站点时，userInfo发生改变组件显示发生变化
		onUserInfoChange() {

			console.log(this.properties.userInfo.driverId)
			if (app.globalData.userInfo.driverId == 0) {
				// 未匹配到司机, 显示 noBus 组件
				this.setData({
					showNoBus: true,
					showContainer: false
				})
			} else if (app.globalData.userInfo.stationName == null) {
				// 已匹配到司机, 但未选择下车站点, 显示 container 组件
				this.setData({
					showNoBus: false,
					showContainer: true
				})
			} else {
				// 已选择下车站点, 显示 successContainer 组件
				this.setData({
					showNoBus: false,
					showContainer: false
				})
			}
		}
	}
})