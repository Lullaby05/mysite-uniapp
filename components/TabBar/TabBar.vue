<template>
	<view class="tab">
		<!-- 滚动区域 -->
		<scroll-view scroll-x="true" class="tab-scroll" :scroll-into-view="currentIndex" :scroll-with-animation="true">
			<view class="tab-scroll-box">
				<view :id="`item${index}`" :class="{active: activeIndex === index}" class="tab-scroll-item" v-for="(item, index) in labelList" :key="index" @click="changeActiveIndex(index)">
					{{ item.name }}
				</view>
				<!-- 图标部分 -->
			</view>
		</scroll-view>
		<view class="tab-icon">
			<uni-icons type="gear" size="26" color="666" @click="goLabelAdmin"></uni-icons>
		</view>
	</view>
</template>

<script>
	export default {
		name:"TabBar",
		props: {
			labelList: Array,
			activeIndex: Number
		},
		watch: {
			activeIndex(index) {
				this.currentIndex = `item${index}`
			}
		},
		data() {
			return {
				currentIndex: `item0`
			};
		},
		methods: {
			// 跳转到标签管理界面
			async goLabelAdmin() {
				await this.checkedisLogin()
				uni.navigateTo({
					url: '/pages/labelAdmin/labelAdmin'
				})
			},
			changeActiveIndex(index) {
				this.$emit('changeActiveIndex', index)
			}
		}
	}
</script>

<style scoped lang="scss">
@import 'css/TabBar.scss'
</style>