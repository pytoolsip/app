<script>
	import {BaseWS} from "static/js/ws.js";
	var createAppWS = function() {
		var appUrl = "ws://localhost:8000/wsapp";
		var ws = new BaseWS("pytoolsip_app_", appUrl, {
			"pytoolsip_app_id" : uni.getStorageSync("pytoolsip_app_id"),
		});
		// 请求登陆ID
		ws.onOpen = function() {
			ws.request("Login", {}, "RespLogin");
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
		ws.register("RespUserInfo", function(status, data){
			if (status == "success") {
				// 处理获取用户信息的消息
				uni.$emit("WS_GetUserInfo", data);
			}
		});
		return ws;
	};
	var _APP_SOCKET = null;
	var _APP_SOCKET_INTERVAL = -1;
	export default {
		onLaunch: function() {
			console.log("App onLaunch");
			_APP_SOCKET = createAppWS();
		},
		onShow: function() {
			console.log("App onShow");
			_APP_SOCKET_INTERVAL = setInterval(function(){
				_APP_SOCKET.active();
			}, 60000); // 每隔60秒校验WebSocket
		},
		onHide: function() {
			console.log("App onHide");
			clearInterval(_APP_SOCKET_INTERVAL);
		}
	}
</script>

<style>
	/*每个页面公共css */
</style>
