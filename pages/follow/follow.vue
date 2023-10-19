<template>
	<view class="follow-container">
		<view class="follow-tab">
			<view class="follow-tab-box">
				<view class="follow-tab-item" :class="{active: currentIndex === 0}" @click="currentIndex=0">
					文章
				</view>
				<view class="follow-tab-item" :class="{active: currentIndex === 1}" @click="currentIndex=1">
					作者
				</view>
			</view>
		</view>
		<!-- 内容区域 -->
		<view class="follow-list-container">
			<swiper class="follow-list-swiper" :current="currentIndex" @change="currentIndex=$event.detail.current">
				<swiper-item :class="{'no-data': articleDataNone}">
					<!-- 文章列表组件 -->
					{{ articleDataNone && '暂无收藏文章' }}
					<ListItem v-if="!articleDataNone" :articleList="articleList" :isShowLoadMore="false"></ListItem>
				</swiper-item>
				<swiper-item :class="{'no-data': authorDataNone}">
					{{ authorDataNone && '暂无关注作者' }}
					<AuthorList v-if="!authorDataNone" :authorList="authorList"></AuthorList>
				</swiper-item>
			</swiper>
		</view>
	</view>
</template>

<script>
	export default {
		onLoad() {
			// #ifdef MP-WEIXIN
			if(!this.$store.state.userInfo) {
				uni.redirectTo({
					url: '/pages/userInfo/login/login'
				})
				return 
			}
			// #endif
			uni.$on('updateArticle', () => {
				this._getFollowArticle('noLoading')
			})
			uni.$on('updateFollowAuthor', () => {
				this._getAuhtorList('noLoading')
			})
			this._getFollowArticle()
			this._getAuhtorList()
		},
		data() {
			return {
				currentIndex: 0,
				articleList: [],
				articleDataNone: '',
				authorList: [],
				authorDataNone: ''
			};
		},
		methods: {
			// 获取收藏文章
			async _getFollowArticle(isLoading) {
				const list = await this.$http.get_follow_article({
					userId: this.userInfo._id,
					isLoading
				})
				if(!list.length) {
					this.articleDataNone = true
				} else {
					this.articleDataNone = ''
				}
				this.articleList = list
			},
			// 关注的作者列表
			async _getAuhtorList(isLoading) {
				const list = await this.$http.get_follow_author({
					userId: this.userInfo._id,
					isLoading
				})
				if(!list.length) {
					this.authorDataNone = true
				} else {
					this.authorDataNone = ''
				}
				this.authorList = list
			}
		}
	}
</script>

<style lang="scss">
@import 'css/follow.scss'
</style>
