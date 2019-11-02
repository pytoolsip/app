<template>
	<view class="follow-item" v-if="options.name" @click="click">
		<view class="follow-header follow-space-between">
			<view class="flex-row">
				<image class="follow-image" v-if="options.pic" :src="options.pic" @click="headClick"></image>
				<view class="flex-row follow-user-info">
					<text>{{options.name}}</text>
				</view>
			</view>
			<view class="flex-row follow-label" :class="options.isFollowed ? 'followed-label' : ''" @click="follow">
				<text>{{options.followLabel}}</text>
			</view>
		</view>
		<view class="follow-body">
			<media-item :options="options.content" @click="mediaClick" v-if="options.isMedia"></media-item>
			<text class="follow-content" v-if="options.isText">{{options.content}}</text>
		</view>
		<view class="follow-footer">
			<view class="follow-info flex-row">
				<text class="info-text">{{options.followCountLabel}}&nbsp;{{options.followCount}}</text>
				<text class="info-text">·</text>
				<text class="info-text">{{options.articleCountLabel}}&nbsp;{{options.articleCount}}</text>
				<text class="info-text">·</text>
				<text class="info-text">{{options.toolCountLabel}}&nbsp;{{options.toolCount}}</text>
			</view>
		</view>
	</view>
</template>

<script>
	import mediaItem from "./media-item.vue";
	
	export default {
		components: {
			mediaItem,
		},
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
				this.$emit("click");
			},
			follow() {
				this.$emit("follow");
			},
			headClick() {
				this.$emit("headClick");
			},
			mediaClick() {
				this.$emit("mediaClick");
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
	
	.follow-item {
		display: flex;
		flex-direction: column;
		padding: 20upx 30upx;
		background-color: #FFFFFF;
		border-bottom: 6px #E9E9E9 solid;
	}
	
	.follow-header {
		color: #333333;
		font-size: 15px;
		line-height: 24px;
	}
	
	.follow-image {
		width: 28px;
		height: 28px;
		border: 2px #E9E9E9 solid;
		border-radius: 50%;
	}
	
	.follow-label {
		color: #007AFF;
		font-size: 14px;
		padding: 0px 12px;
		border: 1px #007AFF solid;
		border-radius: 20px;
	}
	
	.followed-label {
		color: #686868;
		padding: 4px;
		border: none;
		border-radius: 0;
	}
	
	.follow-body {
		color: #686868;
		font-size: 14px;
	}
	
	.follow-content {
		line-height: 20px;
		color: #686868;
		font-size: 14px;
		padding: 4px;
		display: -webkit-box;
		overflow: hidden;
		text-overflow: ellipsis;
		-webkit-line-clamp: 3;
		-webkit-box-orient: vertical;
	}
	
	.follow-footer {
		font-size: 10px;
		color: #868686;
		margin-top: 6px;
	}
	
	.follow-space-between {
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: space-between;
	}
	
	.follow-user-info text {
		padding: 12upx;
	}
	
	.follow-info > .info-text {
		padding-left: 4upx;
		padding-right: 4upx;
	}

</style>
