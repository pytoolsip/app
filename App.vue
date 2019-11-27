<script>
	import {BaseWS} from "static/js/ws.js";
	var createAppWS = function() {
		var appUrl = "ws://localhost:8000/wsapp";
		var ws = new BaseWS("pytoolsip_app_", appUrl, {
			"pytoolsip_app_id" : uni.getStorageSync("pytoolsip_app_id"),
		});
		// 请求登陆ID
		ws.onOpen = function() {
			ws.request("ReqAppID", {});
		}
		// 关闭socket
		ws.onClose = function() {
			ws.active();
		}
		ws.register("WS_onUpdateCtx", function(status, data){
			// 保存appID
			var idKey = ws.getBaseName("id");
			if (idKey in data) {
				uni.setStorageSync(idKey, data[idKey]);
			}
			// 保存公钥
			var publicKey = ws.getBaseName("public_key");
			if (publicKey in data) {
				uni.setStorageSync(publicKey, data[publicKey]);
			}
			// 保存token
			var tokenKey = ws.getBaseName("token");
			if (tokenKey in data) {
				uni.setStorageSync(tokenKey, data[tokenKey]);
			}
		});
		ws.register("RespLoginWeb", function(status, data){
			if (status == "success") {
				// 处理登陆网页成功的消息
			}
		});
		ws.register("RespLogin", function(status, data){
			if (status == "success") {
				// 处理登陆成功的消息
				uni.$emit("WS_LoginSuccess", data);
			}
		});
		return ws;
	};
	// 定时器ID
	export default {
		globalData: {
			AppSocket: null,
		},
		onLaunch: function() {
			console.log("App onLaunch.");
			getApp().globalData.AppSocket = createAppWS(); // 创建WebSocket
		},
		onShow: function() {
			console.log("App onShow.");
			getApp().globalData.AppSocket.activeLoop(60000); // 每隔60秒校验WebSocket
		},
		onHide: function() {
			console.log("App onHide.");
			getApp().globalData.AppSocket.stopActiveLoop(); // 停止校验WebSocket的定时器
		},
		onUnload: function() {
			console.log("App onUnload.");
			getApp().globalData.AppSocket.close(); // 关闭WebSocket
			getApp().globalData.AppSocket = null;
			// 保存当前时间戳
			var now = new Date();
			uni.setStorageSync("pytoolsip_app_last_time", now.getTime());
		},
	}
</script>

<style>
	/*每个页面公共css */
</style>
