<template>
	<div>
		<view class="tabbar">
			<view v-for="(tab,idx) in tabBarList" :key="tab.id" :id="tab.id" :data-current="idx" @click="ontabtap" class="uni-tab-item">
				<text class="uni-tab-item-title" :class="tabIndex==idx ? 'uni-tab-item-title-active' : ''">{{tab.name}}</text>
			</view>
		</view>
		<swiper :current="tabIndex" class="swiper-box" style="flex: 1;" :duration="300" @change="ontabchange">
			<swiper-item class="swiper-item" v-for="(tab,idx) in newsList" :key="idx">
				<!-- #ifdef APP-NVUE -->
				<list class="scroll-v list" enableBackToTop="true" scroll-y loadmoreoffset="15" @loadmore="loadMore(idx)">
					<refresh class="refresh" @refresh="onrefresh(idx)" @pullingdown="onpullingdown" :display="tab.refreshing ? 'show' : 'hide'">
						<div class="refresh-view">
							<image class="refresh-icon" :src="refreshIcon" :style="{width: (tab.refreshing || pulling) ? 0: '30px'}" :class="{'refresh-icon-active': tab.refreshFlag}"></image>
							<loading-indicator class="loading-icon" animating="true" v-if="tab.refreshing"></loading-indicator>
							<text class="loading-text">{{tab.refreshText}}</text>
						</div>
					</refresh>
					<cell v-for="(newsitem,index2) in tab.data" :key="newsitem.id">
						<media-item :options="newsitem" @close="close(idx,index2)" @click="goDetail(newsitem)"></media-item>
					</cell>
					<cell class="loading-more" v-if="tab.isLoading || tab.data.length > 4">
						<text class="loading-more-text">{{tab.loadingText}}</text>
					</cell>
				</list>
				<!-- #endif -->
				<!-- #ifndef APP-NVUE -->
				<scroll-view class="scroll-v list" enableBackToTop="true" scroll-y @scrolltolower="loadMore(idx)">
					<view v-for="(newsitem,index2) in tab.data" :key="newsitem.id">
						<media-item :options="newsitem" @close="close(idx,index2)" @click="goDetail(newsitem)"></media-item>
					</view>
					<view class="loading-more" v-if="tab.isLoading || tab.data.length > 4">
						<text class="loading-more-text">{{tab.loadingText}}</text>
					</view>
				</scroll-view>
				<!-- #endif -->
			</swiper-item>
		</swiper>
		<view class="content">
			<image class="logo" src="/static/img/logo.png"></image>
			<view class="text-area">
				<text class="title">{{title}}</text>
			</view>
		</view>
	</div>
</template>

<script>
	export default {
		data() {
			return {
				title: 'PyToolsIP-首页',
				tabIndex: 0,
				tabBarList: [
					{
						name: "关注",
						id: "follow",
					},
					{
						name: "推荐",
						id: "recommend",
					},
				]
			}
		},
		onLoad() {

		},
		methods: {
			ontabtap(e) {
				
			},
			ontabchange(e) {
				
			},
			loadMore(e) {
				
			},
		}
	}
</script>

<style>
	.tabbar {
		height: 40px;
		width: 100%;
		margin-top: 22px;
		border: 1px black solid;
	}
	
	.content {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
	}

	.logo {
		height: 200rpx;
		width: 200rpx;
		margin-top: 200rpx;
		margin-left: auto;
		margin-right: auto;
		margin-bottom: 50rpx;
	}

	.text-area {
		display: flex;
		justify-content: center;
	}

	.title {
		font-size: 36rpx;
		color: #8f8f94;
	}
	
	
	.uni-tab-item {
		/* #ifndef APP-PLUS */
		display: inline-block;
		/* #endif */
		flex-wrap: nowrap;
		padding-left: 12px;
		padding-right: 12px;
	}
	
	.uni-tab-item-title {
		color: #333333;
		font-size: 28px;
		height: 36px;
		flex-wrap: nowrap;
		/* #ifndef APP-PLUS */
		white-space: nowrap;
		/* #endif */
	}

	.uni-tab-item-title-active {
		color: #007AFF;
		border-bottom: 1px #007AFF solid;
	}
</style>
