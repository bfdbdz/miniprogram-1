// components/getoff-passenger/getoff-passenger.js
const app = getApp()

Component({
	/**
	 * 组件的属性列表
	 */
	properties: {

	},

	/**
	 * 组件的初始数据
	 */
	data: {
		userInfo: app.globalData.userInfo.userInfo,
		options: ['长安校区', '国际医学中心', '紫薇', '高新', '劳动南路', '友谊校区'],
		selected: null
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
				url: 'http://192.168.119.155:8080/passenger/stationName?stationName='+stationChoice,
				method: 'PUT',
				header: {
					'Authorization': this.data.userInfo.token
				},
				success: (res) => {
					console.log("下车站点", this.data.options[this.data.selected])
					if (res.statusCode === 200) {
						if (res.data.code === 200) {
							console.log(res)
							wx.showToast({
								icon: 'none',
								title: '选择成功！',
								mask: true,
								duration: 2000
							});
						}
					}
				},
				fail: (err) => {
					console.log("连接失败", err)
				}
			})
		},

		rselect() {
			this.data.userInfo.stationName = null
		},
	}
})