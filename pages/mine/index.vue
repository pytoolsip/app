<template>
	<view class="page">
		<view class="header flex-col">
			<view class="header-button flex-row">
				<uni-icons color="#FFFFFF" class="icon-scan" type="scan" size="22" @click="showScanView" />
				<uni-icons color="#FFFFFF" class="icon-gear-filled" type="gear-filled" size="22" @click="showSettingsView" />
			</view>
			<view class="header-info flex-row" @click="showUserInfo">
				<view class="flex-row">
					<image class="header-info-image header-info-item" :src="userInfo.img"></image>
					<view class="flex-col header-info-item">
						<text class="header-info-name">{{userInfo.name}}</text>
						<text class="header-info-email">{{userInfo.email}}</text>
					</view>
				</view>
				<uni-icons class="icon-arrowright header-info-item" type="arrowright" color="#FFFFFF" size="22" />
			</view>
		</view>
		<view class="body">
			<view class="flex-row">
				<view class="content-item">
					<uni-icons class="icon-paperplane" type="paperplane" color="#333333" size="18" />
					<text>我的发布</text>
				</view>
				<uni-icons class="icon-arrowright content-item" type="arrowright" color="#333333" size="18" />
			</view>
			<view class="flex-row">
				<view class="content-item">
					<uni-icons class="icon-star" type="star" color="#333333" size="18" />
					<text>我的收藏</text>
				</view>
				<uni-icons class="icon-arrowright content-item" type="arrowright" color="#333333" size="18" />
			</view>
			<view class="flex-row">
				<view class="content-item">
					<uni-icons class="icon-chat" type="chat" color="#333333" size="18" />
					<text>我的评论</text>
				</view>
				<uni-icons class="icon-arrowright content-item" type="arrowright" color="#333333" size="18" />
			</view>
		</view>
	</view>
</template>

<script>
	import uniIcons from "../../components/uni-icons.vue";
	
	export default {
		components: {
			uniIcons,
		},
		data() {
			return {
				isLogined: false,
				userInfo: {
					name: "梦心DH",
					email: "jdreamheart@163.com",
					img: "../../static/img/logo.png",
				},
			}
		},
		onLoad() {
			// 监听登录回调事件  
			uni.$on("WS_LoginSuccess", this.onLoginSuccess);
			// // 请求用户数据
			// getApp().globalData.AppSocket.request("ReqUserInfo", {
			// 	startId: startId,
			// }, function(status, data){
			// 	if (status == "success") {
			// 		// if (data.isReLogin) {
			// 		// 	// 弹出登录页面
			// 		// 	return;
			// 		// }
			// 		// 更新用户信息
			// 		this.userInfo = data.userInfo;
			// 	}
			// });
		},
		onUnload() {
			uni.$off("WS_LoginSuccess", this.onLoginSuccess);
		},
		methods: {
			onLoginSuccess(data) {
				if (data.code == 0) {
					this.isLogined = true;
					this.userInfo = data.userInfo;
				}
			},
			showScanView(e) {
				uni.scanCode({
					onlyFromCamera: true,
					scanType: ["qrCode"],
					success: (data)=>{
						var result = data.result;
						console.log("scanCode:", result);
						if (typeof(result) == "string") {
							if (result.search(/^LoginWebKey:/) != -1) {
								if (!this.isLogined) {
									// 弹出登录页面
									return;
								}
								var key = result.split(/^LoginWebKey:/)[1];
								getApp().globalData.AppSocket.request("LoginWeb", {
									login_md5: key,
								}, function(status, data){
									if (status == "success") {
										if (data.isReLogin) {
											// 弹出登录页面
											return;
										}
										// 弹出登录成功的提示
										
									}
								});
								
							}
						}
					}
				});
			},
			showSettingsView(e) {
				
			},
			showUserInfo(e) {
				if (!this.isLogined) {
					// 跳转登录界面
				} else {
					// 跳转玩家信息界面，并请求玩家信息
				}
			}
		}
	}
</script>

<style>
	/* #ifndef APP-PLUS */
	page {
		width: 100%;
		min-height: 100%;
		display: flex;
	}
	/* #endif */
	.page {
		width: 100%;
		min-height: 100%;
	}
	.flex-row {
		display: flex;
		flex-direction: row;
	}
	.flex-col {
		display: flex;
		flex-direction: column;
	}
	.header {
		align-items: center;
		justify-content: space-between;
		height: 200px;
		color: #FFFFFF;
		background-color: #000000;
	}
	
	.header-button {
		align-items: center;
		/* #ifdef APP-PLUS */
		justify-content: flex-end;
		/* #endif */
		/* #ifndef APP-PLUS */
		justify-content: center;
		/* #endif */
		margin-top: 20px;
		width: 100%;
	}
	
	.header-button uni-icons {
		padding-left: 6px;
		padding-right: 6px;
	}
	
	.header-info {
		justify-content: space-between;
		width: 100%;
		margin-bottom: 20px;
	}
	
	.header-info .header-info-item:first-child {
		margin-left: 20px;
	}
	
	.header-info .header-info-item:last-child {
		margin-right: 20px;
	}
	
	.header-info-item {
		align-self: center;
		margin: 6px;
	}
	
	.header-info-image {
		width: 54px;
		height: 54px;
		border-radius: 50%;
		border: 2px #FFFFFF solid;
	}
	
	.header-info-name {
		font-size: 20px;
	}
	
	.header-info-email {
		font-size: 12px;
		color: #F1F1F1;
	}
	
	.body {
		margin-top: 20px;
	}

	.body .flex-row {
		align-items: center;
		justify-content: space-between;
		height: 50px;
		font-size: 16px;
	}
	
	.body .flex-row .content-item:first-child {
		padding-left: 10px;
	}
	
	.body .flex-row .content-item:last-child {
		padding-right: 10px;
	}
	
	.content-item uni-icons {
		margin-right: 4px;
	}
	
	.content-space {
		margin: 40px 0px;
	}
	
</style>
