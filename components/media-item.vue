<template>
	<view class="media-item" hover-class="media-item-hover" v-if="options.title" @click="click">
		<view class="media-header">
			<text class="media-header-title">{{options.title}}</text>
			<view class="flex-row" v-if="options.subTitle">
				[<text class="media-header-subtitle">{{options.subTitle}}</text>]
			</view>
		</view>
		<view class="media-body media-space-between">
			<view class="media-content">
				<text>{{options.description}}</text>
			</view>
			<image class="media-image" v-if="options.thumbnail" :src="options.thumbnail"></image>
		</view>
		<view class="media-footer media-space-between" v-if="options.author">
			<view class="media-info flex-row">
				<image class="info-text info-image" v-if="options.author_pic" :src="options.author_pic"></image>
				<text class="info-text" v-if="options.author">{{options.author}}</text>
				<text class="info-text" v-if="options.author">·</text>
				<text class="info-text" v-if="options.time">{{options.time}}</text>
				<text class="info-text" v-if="options.time">·</text>
				<text class="info-text" v-if="options.countLabel&&options.count">{{options.countLabel}}&nbsp;{{options.count}}</text>
				<text class="info-text" v-if="options.countLabel">·</text>
				<text class="info-text" v-if="options.type">{{options.type}}</text>
				<!-- 是否收藏信息 -->
				<text class="info-text" v-if="options.collection">·</text>
				<text class="info-text" v-if="options.collection">{{options.collection}}</text>
			</view>
		</view>
		<view class="media-item-line" style="position: absolute;" v-if="options.line"></view>
	</view>
</template>

<script>
	export default {
		props: {
			options: {
				type: Object,
				default: function(e) {
					return {}
				}
			}
		},
		methods: {
			click() {
				this.$emit('click');
			},
		}
	}
</script>

<style>
	.flex-row {
		display: flex;
		flex-direction: row;
	}
	
	.flex-col {
		display: flex;
		flex-direction: column;
	}
	
	.media-item {
		display: flex;
		position: relative;
		flex-direction: column;
		padding: 20upx 30upx;
		background-color: #FFFFFF;
	}
	
	.media-item-hover{
	    background-color: #F1F1F1;
	}
	
	.media-header {
		color: #333333;
		font-size: 16px;
		line-height: 24px;
	}
	
	.media-header-title{
		font-weight: bold;
		display: -webkit-box;
		overflow: hidden;
		text-overflow: ellipsis;
		-webkit-line-clamp: 2;
		-webkit-box-orient: vertical;
	}
	
	.media-header-subtitle {
		font-size: 14px;
		display: -webkit-box;
		overflow: hidden;
		text-overflow: ellipsis;
		-webkit-line-clamp: 1;
		-webkit-box-orient: vertical;
	}
	
	.media-body {
		margin-top: 4px;
	}
	
	.media-content {
		width: calc(100% - 80px);
		line-height: 20px;
		font-size: 12px;
		display: -webkit-box;
		overflow: hidden;
		text-overflow: ellipsis;
		-webkit-line-clamp: 3;
		-webkit-box-orient: vertical;
	}
	
	.media-type {
		color: #868686;
		font-weight: bold;
	}
	
	.media-image {
		width: 80px;
		height: 60px;
		margin-left: 4px;
		border: 1px #E1E1E1 solid;
		border-radius: 6px;
	}
	
	.media-footer {
		font-size: 10px;
		color: #868686;
		margin-top: 6px;
	}
	
	.media-space-between {
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: space-between;
	}
	
	.media-info > .info-text {
		padding-left: 4upx;
		padding-right: 4upx;
	}
	
	.media-info > .info-image {
		width: 12px;
		height: 12px;
		border: 1px #E1E1E1 solid;
		border-radius: 50%;
	}
	
	.media-item-line {
		position: absolute;
		left: 30upx;
		right: 30upx;
		bottom: 0;
		height: 1upx;
		background-color: #EAEAEA;
	}
</style>
