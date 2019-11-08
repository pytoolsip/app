<template>
	<view>
		<image class="" v-if="options.thumbnail" :src="options.thumbnail"></image>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				options: {},
			}
		},
		methods: {
			
		},
		onLoad(options) {
			// 更新标题
			uni.setNavigationBarTitle({
				title: options.title,
			});
			// 保存数据
			this.options = options;
		}
	}
</script>

<style>

</style>
