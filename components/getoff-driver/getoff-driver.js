// components/getoff-driver/getoff-driver.js
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
		options: {
			'长安校区':0, 
			'国际医学中心':0, 
			'紫薇':0, 
			'高新':0, 
			'劳动南路':0, 
			'友谊校区':0},
			optionsKeys: ['长安校区','国际医学中心','紫薇','高新','劳动南路','友谊校区'],
			userInfo:app.globalData.userInfo.userInfo
	},

	lifetimes:{
		attached() {
		
		// console.log("getoff司机页面",this.data.options.['长安校区'])
		// 监听 WebSocket 连接打开事件
		wx.onSocketOpen((res) => {
			console.log('WebSocket连接已打开-getoff页面');
		});
		// 监听 WebSocket 接受到服务器的消息事件
		wx.onSocketMessage((res) => {
			// console.log('收到服务器数据：', res.data);
				let data = JSON.parse(res.data)
				console.log('收到服务器数据：', data)
				//下车站点人数消息
				if(data.type == 3){
					this.setData({
						'options.长安校区' : data.message['changan'],
						'options.国际医学中心':data.message['guojiyi'],
						'options.紫薇':data.message['ziwei'],
						'options.高新':data.message['gaoxin'],
						'options.劳动南路':data.message['laodong'],
						'options.友谊校区':data.message['youyi']
					})
				}
		});

		// 监听 WebSocket 连接错误事件
		wx.onSocketError((res) => {
			console.error('WebSocket连接发生错误-getoff：', res.errMsg);
		});

		// 监听 WebSocket 连接关闭事件
		wx.onSocketClose((res) => {
			console.log('WebSocket连接已关闭-getoff');
		});
	},
	updated(){
		this.getStop()
	}
	},



  /**
   * 组件的方法列表
   */
  methods: {
		getStop(){
			console.log("获取一次stop")
			wx.request({
				url: 'http://localhost:8080/driver/stop',
				method:'GET',
				header:{
					'Authorization': this.data.userInfo.token
				},
				success:(res)=>{
					console.log('下车站点人数',res.data)
					this.setData({
						'options.长安校区' : res.data.data.changan,
						'options.国际医学中心':res.data.data.guojiyi,
						'options.紫薇':res.data.data.ziwei,
						'options.高新':res.data.data.gaoxin,
						'options.劳动南路':res.data.data.laodong,
						'options.友谊校区':res.data.data.youyi
					})
				}
			})
		}

  }
})