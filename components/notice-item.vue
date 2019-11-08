<template>
	<view class="item item-space-between" @click="click">
		<view class="item-icon">
			<image class="item-icon-image" v-if="options.pic" :src="options.pic" />
			<uni-badge class="item-icon-badge" v-if="options.count && options.count > 0" :text="options.count" type="error" size="small" />
		</view>
		<view class="item-body flex-col">
			<view class="item-space-between">
				<view class="item-title-text">
					<text class="item-title" v-if="options.title">{{options.title}}</text>
					<text class="item-sub-title" v-if="options.subTitle">[{{options.subTitle}}]</text>
				</view>
				<text class="item-newest-time" v-if="options.time">{{options.time}}</text>
			</view>
			<view class="item-body-content">
				<view class="info-user flex-row">
					<image class="info-user-image" v-if="options.user_pic" :src="options.user_pic"></image>
					<text class="info-user-name" v-if="options.user">{{options.user}}</text>
					<text class="info-op-info" v-if="options.op_info">{{options.op_info}}</text>
				</view>
				<text class="item-info" v-if="options.info">{{options.info}}</text>
			</view>
		</view>
	</view>
</template>

<script>
	import uniBadge from "@/components/uni-badge.vue";
	export default {
		components: {
			uniBadge,
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
	
	.item {
		font-size: 14px;
		padding: 10px;
		background-color: #FFFFFF;
		border-bottom: 1px #E9E9E9 solid;
	}
	
	.item-space-between {
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: space-between;
	}
	
	.item-icon {
		position: relative;
	}
	
	.item-icon-image {
		margin-top: 8px;
		width: 60px;
		height: 45px;
		border: 1px #E1E1E1 solid;
		border-radius: 4px;
	}
	
	.item-icon-badge {
		position: absolute;
		top: -4px;
		left: 44px;
	}
	
	.item-body {
		width: calc(100% - 70px);
	}
	
	.item-title-text {
		width: calc(100% - 30px);
		display: -webkit-box;
		overflow: hidden;
		text-overflow: ellipsis;
		-webkit-line-clamp: 2;
		-webkit-box-orient: vertical;
	}
	
	.item-title {
		font-weight: bold;
	}
	
	.item-sub-title {
		margin-left: 2px;
		font-size: 12px;
	}
	
	.item-newest-time {
		font-size: 10px;
		color: #BCBCBC;
	}
	
	.item-body-content {
		width: 100%;
		height: 30px;
		font-size: 12px;
	}
	
	.info-user {
		margin-top: 2px;
	}
	
	.info-user-image {
		margin-top: 1px;
		width: 12px;
		height: 12px;
		border: 1px #E1E1E1 solid;
		border-radius: 50%;
	}
	
	.info-user-name {
		margin-left: 1px;
		color: #686868;
		font-weight: bold;
	}
	
	.info-op-info {
		margin-left: 4px;
		color: #727272;
	}
	
	.item-info {
		color: #989898;
		display: -webkit-box;
		overflow: hidden;
		text-overflow: ellipsis;
		-webkit-line-clamp: 1;
		-webkit-box-orient: vertical;
	}

</style>
