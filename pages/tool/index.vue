<template>
	<view class="page">
		<view class="header">
			<view class="header-title">
				<view class="input-search flex-row" @click="onSearch">
					<uni-icons color="#ABABAB" class="icon-search" type="search" size="18" />
					<text>搜索工具</text>
				</view>
			</view>
			<view class="tab-bar" @click="onGoTop">
				<view>
					<view v-for="(tab,idx) in tabList" :key="tab.id" :id="tab.id" :data-current="idx" @click="onTabTap" class="tab-item">
						<text class="tab-item-title" :class="tabIdx==idx ? 'tab-item-title-active' : ''">{{tab.name}}</text>
					</view>
				</view>
				<picker class="category-picker tab-item" :range="category.list" @change="onChangeCategory">
					<uni-icons color="#686868" class="icon-arrowdown" type="arrowdown" size="14" />
					<text>{{category.list[category.index]}}</text>
				</picker>
			</view>
		</view>
		<view class="line-h" v-if="isShowTabBarLine"></view>
		<swiper :current="tabIdx" :duration="300" @change="onTabChange" :style="{height: contentHeight, marginTop: contentMarginTop}">
			<swiper-item class="flex-row" v-for="(data,idx) in dataList" :key="idx">
				<!-- #ifdef APP-NVUE -->
				<list class="scroll-v" enableBackToTop="true" scroll-y loadmoreoffset="15" @loadmore="loadMore(idx)" @scroll="onScroll" :scroll-top="data.scrollTop.current" scroll-with-animation="true">
					<refresh class="refresh" @refresh="onRefresh(idx)" @pullingdown="onPullingDown" :display="data.isRefreshing ? 'show' : 'hide'">
						<div class="refresh-view">
							<uni-icons color="#363636" class="icon-refresh" type="refresh" size="18" :style="{width: (data.isRefreshing || data.isPulling) ? 0: '30px'}" />
							<loading-indicator class="loading-icon" animating="true" v-if="data.isRefreshing"></loading-indicator>
							<text class="loading-text">{{data.refreshText}}</text>
						</div>
					</refresh>
					<cell v-for="item in data.items" :key="item.id">
						<media-item :options="item" @click="showDetail(item)"></media-item>
					</cell>
					<cell class="loading-more" v-if="data.isLoading || data.items.length > dataLenLimit">
						<text class="loading-more-text">{{data.loadingText}}</text>
					</cell>
				</list>
				<!-- #endif -->
				<!-- #ifndef APP-NVUE -->
				<scroll-view class="scroll-v" enableBackToTop="true" scroll-y @scrolltolower="loadMore(idx)" @scroll="onScroll" :scroll-top="data.scrollTop.current" scroll-with-animation="true">
					<view v-for="item in data.items" :key="item.id">
						<media-item :options="item" @click="showDetail(item)"></media-item>
					</view>
					<view class="loading-more" v-if="data.isLoading || data.length > dataLenLimit">
						<text class="loading-more-text">{{data.loadingText}}</text>
					</view>
				</scroll-view>
				<!-- #endif -->
			</swiper-item>
		</swiper>
	</view>
</template>

<script>
	import uniIcons from "../../components/uni-icons.vue";
	import mediaItem from "../../components/media-item.vue";
	
	// 起始Tab下标
	const START_TAB_INDEX = 1;
	
	// 缓存每页最多
	const MAX_CACHE_DATA_LENGTH = 60;
	
	export default {
		components: {
			uniIcons,
			mediaItem,
		},
		data() {
			return {
				tabIdx: -1,
				tabList: [
					{
						name: "我的",
						id: "mine",
					},
					{
						name: "最新",
						id: "newest",
					},
				],
				dataList: [],
				dataLenLimit: 8, // 显示加载提示的数据长度限制
				category: {
					list: ["所有工具", "开发工具", "产品工具", "娱乐工具"],
					keys: ["all", "develop", "product", "entertainment"],
					index: 0,
				},
			}
		},
		computed: {
			isShowTabBarLine() {
				let activeData = this.dataList[this.tabIdx];
				let scrollTop = activeData && activeData.scrollTop.old || 0;
				if (scrollTop > 20) {
					return true;
				}
				return false;
			},
			contentHeight() {
				return "calc(100% - 86px)";
			},
			contentMarginTop() {
				let newTop = 20;
				let activeData = this.dataList[this.tabIdx];
				let scrollTop = activeData && activeData.scrollTop.old || 0;
				if (scrollTop > 20) {
					return "0px";
				}
				return newTop - scrollTop + "px";
			}
		},
		onLoad() {
			// 初始化信息列表
			this.tabList.forEach((tab, index) => {
				this.dataList.push({
					items: [],
					isLoading: false,
					loadingText: "加载更多...",
					isInTheEnd: false,
					isPulling: false,
					refreshFlag: false,
					isRefreshing: false,
					refreshText: "已刷新",
					navigateFlag: false,
					scrollTop: {
						count: 0,
						old: 0,
						current: 0,
					},
				});
			});
			// 切换Tab
			this.switchTab(START_TAB_INDEX);
		},
		methods: {
			// 点击搜索按钮
			onSearch(e) {
				
			},
			// 点击切换类别
			onChangeCategory(e) {
				
			},
			// 滚动tab内容
			onScroll(e) {
				let activeData = this.dataList[this.tabIdx];
				activeData.scrollTop.old = e.target.scrollTop || e.detail.scrollTop;
			},
			onGoTop(e) {
				let activeData = this.dataList[this.tabIdx];
				activeData.scrollTop.count ++;
				setTimeout(() => {
					if (activeData.scrollTop.count > 1) {
						activeData.scrollTop.current = activeData.scrollTop.old;
						this.$nextTick(function() {
							activeData.scrollTop.current = 0;
						});
					}
					activeData.scrollTop.count = 0;
				}, 300);
			},
			// 加载tab数据
			loadTabData(index) {
				let activeData = this.dataList[index];
				if (activeData.isInTheEnd || activeData.isLoading) {
					return;
				}
				// 标记正在加载
				activeData.isLoading = true;
				activeData.loadingText = "正在加载...";
				// 获取请求参数
				var startId = -1;
				if (activeData.items.length > 0) {
					startId = activeData.items[activeData.items.length - 1].id;
				}
				// 请求数据
				getApp().globalData.AppSocket.request("ReqTools", {
					startId: startId,
					category: this.category.keys[this.category.index],
				}, function(status, data){
					if (status == "success") {
						for (let i = 0; i < data.items.length; i++) {
							activeData.items.push(data.items[i]);
						}
						// 标记加载完成
						activeData.isLoading = false;
						if (data.isInTheEnd) {
							activeData.isInTheEnd = true;
							activeData.loadingText = "已经到最底了~";
						} else {
							activeData.loadingText = "加载更多...";
						}
					}
				});
			},
			// 切换tab
			switchTab(index) {
				// 判断将要切换的tab是否有数据，没有的话，先请求数据
				if (this.dataList[index].items.length === 0) {
					this.loadTabData(index);
				}
				// 判断要切换的tab是否为当前tab
				if (this.tabIdx === index) {
				    return;
				}
				// 清除原tab的缓存数据
				let activeData = this.dataList[this.tabIdx];
				if (this.tabIdx >= 0 && activeData.items.length > MAX_CACHE_DATA_LENGTH) {
					activeData.items.length = MAX_CACHE_DATA_LENGTH;
				}
				// 更新当前tab下标
				this.tabIdx = index;
			},
			// 点击tab
			onTabTap(e) {
				this.switchTab(e.target.dataset.current || e.currentTarget.dataset.current);
			},
			// 响应tab更改
			onTabChange(e) {
				this.switchTab(e.target.current || e.detail.current);
			},
			// 加载更多
			loadMore(e) {
				this.loadTabData(this.tabIdx);
			},
			// 刷新tab数据
			refreshTabData(index) {
				let activeData = this.dataList[index];
				if (activeData.isRefreshing) {
					return;
				}
				// 标记正在刷新
				activeData.isRefreshing = true;
				activeData.refreshText = "正在刷新...";
				// 获取请求参数
				var endId = -1;
				if (activeData.items.length > 0) {
					endId = activeData.items[0].id;
				}
				// 请求数据
				getApp().globalData.AppSocket.request("ReqTools", {
					endId: endId,
					category: this.category.keys[this.category.index],
				}, function(status, data){
					if (status == "success") {
						for (let i = data.items.length - 1; i >= 0; i--) {
							activeData.items.unshift(data.items[i]);
						}
						// 标记完成刷新
						activeData.isRefreshing = false;
						activeData.refreshText = "已刷新";
						// 重置拉取状态
						activeData.isPulling = true;
						activeData.refreshFlag = false;
						setTimeout(() => { // Fix ios和Android 动画时间相反问题
							activeData.isPulling = false;
						}, 500);
					}
				});
			},
			// 刷新tab
			onRefresh(e) {
				let activeData = this.dataList[this.tabIdx];
				if (!activeData.refreshFlag) {
					return;
				}
				// 刷新tab数据
				this.refreshTabData(this.tabIdx);
			},
			onPullingDown(e) {
				let activeData = this.dataList[this.tabIdx];
				if (activeData.isRefreshing || activeData.isPulling) {
					return;
				}
				if (Math.abs(e.pullingDistance) > Math.abs(e.viewHeight)) {
					activeData.refreshFlag = true;
					activeData.refreshText = "释放立即刷新";
				} else {
					activeData.refreshFlag = false;
					activeData.refreshText = "下拉可以刷新";
				}
			},
			showDetail(e) {
				
			},
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
	/* Tab 顶部栏 */
	.header {
		width: 100%;
		margin-top: 20px;
	}
	.header-title {
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: center;
	}
	.input-search {
		width: 94%;
		color: #ABABAB;
		font-size: 14px;
		border: 1px #CDCDCD solid;
		border-radius: 4px;
		padding: 2px;
	}
	.tab-bar {
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: space-between;
		width: 100%;
		margin-top: 10px;
	}
	.tab-item {
		/* #ifndef APP-PLUS */
		display: inline-block;
		/* #endif */
		flex-wrap: nowrap;
		padding-left: 10px;
		padding-right: 10px;
	}
	.tab-item-title {
		/* #ifndef APP-PLUS */
		display: inline-block;
		/* #endif */
		color: #686868;
		font-size: 18px;
		flex-wrap: nowrap;
		/* #ifndef APP-PLUS */
		white-space: nowrap;
		/* #endif */
		padding-bottom: 2px;
	}
	.tab-item-title-active {
		color: #007AFF;
		font-size: 20px;
		font-weight: bold;
		border-bottom: 2px #007AFF solid;
	}
	.category-picker {
		font-size: 12px;
		color: #686868;
	}
	.line-h {
	    height: 1upx;
	    background-color: #E1E1E1;
	}
	/* Tab 内容 */
	.scroll-v {
		display: flex;
		/* #ifndef MP-ALIPAY */
		flex-direction: column;
		/* #endif */
		width: 100%;
	}
	.loading-more {
	    align-items: center;
	    justify-content: center;
	    text-align: center;
	}
	.loading-more-text {
	    font-size: 12px;
	    color: #969696;
		padding-bottom: 10px;
	}
	
</style>