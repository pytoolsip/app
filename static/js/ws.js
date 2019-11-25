// 基础WebSocket
var BaseWS = function(name, url, ctx = {}) {
    this._baseName = name;
    this._ws = null;
	this._url = url;
    this._ctx = ctx; // 上下文内容
    this._listeners = {}; // 消息监听表
    this._listenerIndex = 0; // 消息监听下标
    this._activeInterval = null; // 定时监测socket状态的定时器ID
    this._respCallbackMap = {}; // 请求回调函数表
    this._respCallbackIndex = 0; // 请求回调下标
    this.init();
};
BaseWS.prototype.newListenerIndex = function() {
    this._listenerIndex ++;
    return this._listenerIndex;
};
BaseWS.prototype.newRespCallbackIndex = function() {
    this._respCallbackIndex = this._respCallbackIndex % 10000 + 1;
    return this._respCallbackIndex;
};
BaseWS.prototype.getBaseName = function(suffix = "") {
    return this._baseName + suffix;
};
BaseWS.prototype.init = function() {
    // 初始化webSocket
    var self = this;
	// 初始化websocket
    self.initWS();
    // 注册基本事件
    self.register("WS_onUpdateCtx", function(status, data){
        for (let key in data) {
            self._ctx[key] = data[key];
        }
    });
    self.register("WS_onError", function(status, data){
        console.error(data);
    });
};
BaseWS.prototype.initWS = function() {
    // 初始化webSocket
    var self = this;
    self._ws = uni.connectSocket({
		url : this._url,
		complete: ()=> {}
	});
    self._ws.onOpen(function() {
        if (self.hasOwnProperty("onOpen")) {
            self.onOpen(self);
        }
    });
    self._ws.onClose(function() {
        if (self.hasOwnProperty("onClose")) {
            self.onClose(self);
        }
    });
    self._ws.onMessage(function(e) {
        var data = JSON.parse(e.data);
        if (data.hasOwnProperty("resp") && data.hasOwnProperty("status") && data.hasOwnProperty("msg")) {
            var respName = data["resp"];
            // 检测请求回调
            if (self._respCallbackMap.hasOwnProperty(respName)) {
                self._respCallbackMap[respName](data["status"], data["msg"]);
                delete self._respCallbackMap[respName]; // 回调后，移除相应函数
            }
            // 检测监听回调
            if (self._listeners.hasOwnProperty(respName)) {
                for (fid in self._listeners[respName]) {
                    self._listeners[respName][fid](data["status"], data["msg"]);
                }
            }
        }
    });
};
BaseWS.prototype.isvalid = function() {
    return this._ws != null;
};
BaseWS.prototype.isclose = function() {
    if (!this.isvalid()) {
        return false;
    }
    return this._ws.readyState == this._ws.CLOSING || this._ws.readyState == this._ws.CLOSED;
};
BaseWS.prototype.isopen = function() {
    if (!this.isvalid()) {
        return false;
    }
    return this._ws.readyState == this._ws.OPEN;
};
BaseWS.prototype.close = function() {
    if (this.isopen()) {
        this._ws.close();
        return
    }
};
BaseWS.prototype.active = function() {
	if (this.isclose()) {
		this.initWS();
	}
};
BaseWS.prototype.activeLoop = function(duration) {
    var self = this;
    self.stopActiveLoop();
	self._activeInterval = setInterval(function(){
        self.active();
    }, duration);
};
BaseWS.prototype.stopActiveLoop = function() {
    var self = this;
    if (self._activeInterval != null) {
        clearInterval(self._activeInterval);
        self._activeInterval = null;
    }
};
BaseWS.prototype.request = function(reqFuncName, msg, respFunc = null) {
    var self = this;
    if (!self.isopen()) {
        console.log("request failed!");
        return
    }
    // 缓存回调函数，在onmessage中进行处理
    var respFuncName = "";
    if (typeof respFunc == "function") {
        respFuncName = String(self.newRespCallbackIndex());
        self._respCallbackMap[respFuncName] = respFunc;
    }
    // 发送消息
    self._ws.send({
		"data" : JSON.stringify({
			"req": reqFuncName,
			"ctx": self._ctx,
			"msg": msg,
			"resp": respFuncName,
		}),
	});
};
BaseWS.prototype.register = function(name, func) {
    var self = this;
    if (!self._listeners.hasOwnProperty(name)) {
        self._listeners[name] = {};
    }
    var idx = self.newListenerIndex();
    self._listeners[name][idx] = func;
    return idx;
};
BaseWS.prototype.unregister = function(listenerId) {
    var self = this;
    for(var name in self._listeners) {
        // 移除指定函数
        if (self._listeners[name].hasOwnProperty(listenerId)) {
            delete self._listeners[name][listenerId];
            return true;
        }
    }
    return false;
};

// 导出变量
export {
	BaseWS
}