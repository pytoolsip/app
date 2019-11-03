<template>
	<view class="item item-space-between">
		<view class="item-icon">
			<image class="item-icon-image" v-if="options.pic" :src="options.pic" />
			<uni-badge class="item-icon-badge" v-if="options.count && options.count > 0" :text="options.count" type="error" size="small" />
		</view>
		<view class="item-body flex-col">
			<view class="item-space-between">
				<text class="item-name" v-if="options.name">{{options.name}}</text>
				<text class="item-newest-time" v-if="options.time">{{options.time}}</text>
			</view>
			<view class="item-body-content">
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
		margin-top: 6px;
		width: 50px;
		height: 50px;
		border: 1px #E1E1E1 solid;
		border-radius: 4px;
	}
	
	.item-icon-badge {
		position: absolute;
		top: -4px;
		left: 36px;
	}
	
	.item-body {
		width: calc(100% - 60px);
	}
	
	.item-name {
		font-weight: bold;
	}
	
	.item-newest-time {
		font-size: 10px;
		color: #BCBCBC;
	}
	
	.item-body-content {
	}
	
	.item-info {
		width: 100%;
		height: 30px;
		font-size: 12px;
		color: #989898;
		padding: 2px;
		display: -webkit-box;
		overflow: hidden;
		text-overflow: ellipsis;
		-webkit-line-clamp: 2;
		-webkit-box-orient: vertical;
	}

</style>
