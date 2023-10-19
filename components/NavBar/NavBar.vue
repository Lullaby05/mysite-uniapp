<template>
	<view class="nav-bar">
		<view class="nav-bar-top">
			<!-- 处理app和小程序导航栏 -->
			<view :style="{height: statusHeight + 'rpx'}"></view>
			
			<!-- 当组件作为搜索界面时，展示回退按钮 -->
			<view @click="returnArticleList" class="return-icon" :style="{top: statusHeight + 'rpx'}" v-if="isSearch">
				<uni-icons type="back" size="22" color="#fff" ></uni-icons>
			</view>
			
			<view class="nav-bar-content" :style="{marginRight: marginRight + 'rpx', marginLeft: isSearch ? '20rpx': ''}" @click="goSearchPage">
				<uni-icons type="search" color="#999"></uni-icons>
				<view v-if="!isSearch" class="nav-bar-search-text">
					输入文章标题进行搜索
				</view>
				<input v-else class="search-input" v-model.trim="searchVal" type="text" placeholder="输入文章标题进行搜索" confirm-type="search" @confirm="changeInput">
			</view>
		</view>
		<view :style="{height: statusHeight + 80 + 'rpx'}"></view>
	</view>
</template>

<script>
	export default {
		name:"NavBar",
		props: {
			isSearch: {
				type: Boolean,
				default: false
			},
			parentVal: String
		},
		created() {
			this.getSystemInfo();
		},
		data() {
			return {
				statusHeight: 20,
				marginRight: 0
			};
		},
		methods: {
			getSystemInfo() {
				const systemInfo = uni.getSystemInfoSync()
				this.statusHeight = systemInfo.statusBarHeight * 2 || this.statusHeight
				// #ifdef MP-WEIXIN
				const menuButtonInfo = uni.getMenuButtonBoundingClientRect()
				this.statusHeight = menuButtonInfo.top * 2
				this.marginRight = menuButtonInfo.width * 2
				// #endif
			},
			// 跳转到搜索界面
			goSearchPage() {
				if(this.isSearch) return
				uni.navigateTo({
					url: '/pages/search/search'
				})
			},
			// 返回文章列表界面
			returnArticleList() {
				// #ifdef H5
				uni.switchTab({
					url: '../../pages/index/index'
				})
				// #endif
				// #ifndef H5
				uni.navigateBack()
				// #endif
			},
			// 通知父组件进行搜索内容的查询
			changeInput() {
				this.$emit('sendSearchData')
			}
		},
		computed: {
			searchVal: {
				get() {
					return this.parentVal
				},
				set(val) {
					this.$emit('updateVal', val)
					if(!val) {
						this.$emit('sendSearchData')
					}
				}
			}
		}
	}
</script>

<style scoped lang="scss">
@import 'css/NavBar.scss';
</style>