<template>
	<view class="item" @click="click">
		<view class="header">
			<view class="header-time" v-if="options.time">{{options.time}}</view>
		</view>
		<view class="body">
			<view class="body-target" v-if="options.target">{{options.target}}</view>
			<view class="body-pre-content" v-if="options.preContent">{{options.preContent}}</view>
			<view class="body-content" v-if="options.content">{{options.content}}</view>
			<view class="body-ext-content" v-if="options.extContent">{{options.extContent}}</view>
		</view>
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
	
	.header {
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: flex-end;
		width: 100%;
	}

</style>
