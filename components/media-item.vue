<template>
	<view class="media-item" hover-class="media-item-hover" v-if="options.title" @click="click">
		<view class="media-header">
			<text>{{options.title}}</text>
		</view>
		<view class="media-body">
			<view class="media-content">
				<text>{{options.description}}</text>
			</view>
			<image class="media-image" v-if="options.thumbnail" :src="options.thumbnail"></image>
		</view>
		<view class="media-footer media-info">
			<view class="media-info flex-row">
				<text class="info-text">{{options.type}}</text>
				<text class="info-text">·</text>
				<text class="info-text">{{options.author}}</text>
				<text class="info-text">·</text>
				<text class="info-text">{{options.time}}</text>
				<text class="info-text">·</text>
				<text class="info-text">{{options.countLabel}}&nbsp;{{options.count}}</text>
				<!-- 是否收藏信息 -->
				<text class="info-text" v-if="options.collection">·</text>
				<text class="info-text" v-if="options.collection">{{options.collection}}</text>
			</view>
		</view>
		<view class="media-item-line" style="position: absolute;"></view>
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
	}
	
	.media-item-hover{
	    background-color: #eee;
	}
	
	.media-header {
		color: #333333;
		font-size: 16px;
		line-height: 24px;
		font-weight: bold;
	}
	
	.media-body {
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: space-between;
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
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: space-between;
		font-size: 10px;
		color: #868686;
		margin-top: 6px;
	}
	
	.media-info > .info-text {
		padding-left: 4upx;
		padding-right: 4upx;
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
