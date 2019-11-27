<template>
	<view class="page">
		<view class="header" @click="onGoTop" :style="{height: tabBarHeight}">
			<text class="header-title" :style="{fontSize: tabBarFontSize}">消息</text>
			<view class="input-search flex-row" @click="onSearch" :style="{width: searchInputWidth}">
				<uni-icons color="#ABABAB" class="icon-search" type="search" size="18" />
				<text>搜索消息</text>
			</view>
		</view>
		<view class="line-h" v-if="isShowTabBarLine"></view>
		<swiper :style="{height: tabContentHeight}">
			<swiper-item class="flex-row">
			<!-- #ifdef APP-NVUE -->
			<list class="scroll-v" enableBackToTop="true" scroll-y loadmoreoffset="15" @loadmore="loadMore" @scroll="onScroll" :scroll-top="scrollTop.current" scroll-with-animation="true">
				<refresh class="refresh" @refresh="onRefresh" @pullingdown="onPullingDown" :display="isRefreshing ? 'show' : 'hide'">
					<div class="refresh-view">
						<uni-icons color="#363636" class="icon-refresh" type="refresh" size="18" :style="{width: (isRefreshing || isPulling) ? 0: '30px'}" />
						<loading-indicator class="loading-icon" animating="true" v-if="isRefreshing"></loading-indicator>
						<text class="loading-text">{{refreshText}}</text>
					</div>
				</refresh>
				<cell v-for="item in items" :key="item.id">
					<notice-item :options="item" @click="showDetail(item)"></notice-item>
				</cell>
				<cell class="loading-more" v-if="isLoading || items.length > dataLenLimit">
					<text class="loading-more-text">{{loadingText}}</text>
				</cell>
			</list>
			<!-- #endif -->
			<!-- #ifndef APP-NVUE -->
			<scroll-view class="scroll-v" enableBackToTop="true" scroll-y @scrolltolower="loadMore" @scroll="onScroll" :scroll-top="scrollTop.current" scroll-with-animation="true">
				<view v-for="item in items" :key="item.id">
					<notice-item :options="item" @click="showDetail(item)"></notice-item>
				</view>
				<view class="loading-more" v-if="isLoading || length > dataLenLimit">
					<text class="loading-more-text">{{loadingText}}</text>
				</view>
			</scroll-view>
			<!-- #endif -->
			</swiper-item>
		</swiper>
	</view>
</template>

<script>
	import uniIcons from "../../components/uni-icons.vue";
	import noticeItem from "../../components/notice-item.vue";
	
	export default {
		components: {
			uniIcons,
			noticeItem,
		},
		data() {
			return {
				items: [],
				isLoading: false,
				loadingText: "加载更多...",
				isInTheEnd: false,
				isPulling: false,
				refreshFlag: false,
				isRefreshing: false,
				refreshText: "已刷新",
				scrollTop: {
					count: 0,
					old: 0,
					current: 0,
				},
				dataLenLimit: 8, // 显示加载提示的数据长度限制
			}
		},
		computed: {
			tabBarHeight() {
				let newHeight = 80;
				let scrollTop = this.scrollTop.old || 0;
				if (scrollTop > 48) {
					newHeight -= 48;
				} else {
					newHeight -= scrollTop;
				}
				return newHeight + "px";
			},
			tabBarFontSize() {
				let newSize = 36;
				let scrollTop = this.scrollTop.old || 0;
				if (scrollTop > 48) {
					newSize -= 16;
				} else {
					newSize -= Math.floor(scrollTop/3);
				}
				return newSize + "px";
			},
			isShowTabBarLine() {
				let scrollTop = this.scrollTop.old || 0;
				if (scrollTop > 48) {
					return true;
				}
				return false;
			},
			tabContentHeight() {
				let newHeight = 100;
				let scrollTop = this.scrollTop.old || 0;
				if (scrollTop > 48) {
					newHeight -= 48;
				} else {
					newHeight -= scrollTop;
				}
				return "calc(100% - "+ newHeight +"px)";
			},
			searchInputWidth() {
				let newWidth = 280;
				let scrollTop = this.scrollTop.old || 0;
				if (scrollTop > 96) {
					newWidth -= 192;
				} else {
					newWidth -= 2 * scrollTop;
				}
				return newWidth + "px";
			}
		},
		onLoad() {
			this.loadTabData();
		},
		methods: {
			// 点击搜索按钮
			onSearch(e) {
				
			},
			// 滚动tab内容
			onScroll(e) {
				this.scrollTop.old = e.target.scrollTop || e.detail.scrollTop;
			},
			onGoTop(e) {
				this.scrollTop.count ++;
				setTimeout(() => {
					if (this.scrollTop.count > 1) {
						this.scrollTop.current = this.scrollTop.old;
						this.$nextTick(function() {
							this.scrollTop.current = 0;
						});
					}
					this.scrollTop.count = 0;
				}, 300);
			},
			// 加载tab数据
			loadTabData() {
				if (this.isInTheEnd || this.isLoading) {
					return;
				}
				// 标记正在加载
				this.isLoading = true;
				this.loadingText = "正在加载...";
				// 获取请求参数
				var startId = -1;
				if (this.items.length > 0) {
					startId = this.items[this.items.length - 1].id;
				}
				// 请求数据
				getApp().globalData.AppSocket.request("ReqLatestNotices", {
					startId: startId,
				}, function(status, data){
					if (status == "success") {
						for (let i = 0; i < data.items.length; i++) {
							this.items.push(data.items[i]);
						}
						// 标记加载完成
						this.isLoading = false;
						if (data.isInTheEnd) {
							this.isInTheEnd = true;
							this.loadingText = "已经到最底了~";
						} else {
							this.loadingText = "加载更多...";
						}
					}
				});
			},
			// 加载更多
			loadMore(e) {
				this.loadTabData();
			},
			// 刷新tab数据
			refreshTabData() {
				if (this.isRefreshing) {
					return;
				}
				// 标记正在刷新
				this.isRefreshing = true;
				this.refreshText = "正在刷新...";
				// 获取请求参数
				var endId = -1;
				if (this.items.length > 0) {
					endId = this.items[0].id;
				}
				// 请求数据
				getApp().globalData.AppSocket.request("ReqLatestNotices", {
					endId: endId,
				}, function(status, data){
					if (status == "success") {
						for (let i = data.items.length - 1; i >= 0; i--) {
							this.items.unshift(data.items[i]);
						}
						// 标记完成刷新
						this.isRefreshing = false;
						this.refreshText = "已刷新";
						// 重置拉取状态
						this.isPulling = true;
						this.refreshFlag = false;
						setTimeout(() => { // Fix ios和Android 动画时间相反问题
							this.isPulling = false;
						}, 500);
					}
				});
			},
			// 刷新tab
			onRefresh(e) {
				if (!this.refreshFlag) {
					return;
				}
				// 刷新tab数据
				this.refreshTabData();
			},
			onPullingDown(e) {
				if (this.isRefreshing || this.isPulling) {
					return;
				}
				if (Math.abs(e.pullingDistance) > Math.abs(e.viewHeight)) {
					this.refreshFlag = true;
					this.refreshText = "释放立即刷新";
				} else {
					this.refreshFlag = false;
					this.refreshText = "下拉可以刷新";
				}
			},
			showDetail(e) {
				uni.navigateTo({
					url: "./notice_detail/notice_detail?title=" + e.title + "&thumbnail=" + e.pic,
				});
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
	/* 顶部栏 */
	.header {
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: space-between;
		width: 100%;
		margin-top: 20px;
	}
	.header-title {
		font-weight: bold;
		margin-left: 10px;
	}
	.input-search {
		color: #ABABAB;
		font-size: 14px;
		border: 1px #CDCDCD solid;
		border-radius: 4px;
		padding: 2px;
		margin-right: 10px;
	}
	.line-h {
		height: 1upx;
		background-color: #E1E1E1;
	}
	/* 内容 */
	.content {
		height: 100%;
		background-color: #4CD964;
	}
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