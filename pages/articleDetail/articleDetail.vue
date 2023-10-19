<template>
	<view class="article-detail-container">
		<view class="detail-title">
			{{ articleData.title }}
		</view>
		<view class="detail-header">
			<view class="detail-logo">
				<image :src="articleData.author.avatar" mode="aspectFill"></image>
			</view>
			<view class="detail-header-content">
				<view class="detail-header-content-title">
					{{ articleData.author.author_name }}
				</view>
				<view class="detail-header-content-info">
					<text>{{ articleData.create_time }}</text>
					<text>{{ articleData.browse_count }} 浏览</text>
					<text>{{ articleData.thumbs_up_count }} 赞</text>
				</view>
			</view>
			<button type="default" class="detail-header-button" @click="_followAuthor">
				{{ isFollowAuthor?'取消关注':'关注' }}
			</button>
		</view>
		<view class="detail-content-container">
			<view class="detail-html">
				<u-parse :content="content"></u-parse>
			</view>
			<!-- 评论内容部分 -->
			<view class="detail-comment">
				<view class="comment-title">
					最新评论
				</view>
				<view class="comment-content-container" v-for="item in commentList" :key="item._id">
					<CommentBox :commentData="item" @commentReply="commentReply"></CommentBox>
				</view>
				<view v-if="commentList.length" class="no-data">
					暂无评论
				</view>
			</view>
		</view>
		
		<!-- 评论输入组件 -->
		<view class="detail-bottom">
			<view class="input-container" @click="openMaskerComment">
				<text>谈谈你的看法</text>
				<uni-icons type="compose" size="16" color="#f07373"></uni-icons>
			</view>
			<view class="detail-bottom-icons">
				<view class="detail-bottom-icon-box" @click="goCommentPage">
					<uni-icons type="chat" size="22" color="#f07373"></uni-icons>
				</view>
				<SaveLikes class="detail-bottom-icon-box" size="22" :item="articleData"></SaveLikes>
<!-- 				<view class="detail-bottom-icon-box">
					<uni-icons type="heart" size="22" color="#f07373"></uni-icons>
				</view> -->
				<view class="detail-bottom-icon-box">
					<uni-icons :type="isCompliments ? 'hand-up-filled' : 'hand-up'" size="22" color="#f07373" @click="_updateCompliments"></uni-icons>
				</view>
			</view>
		</view>
		<!-- 评论组件 -->
		<CommentMasker :showPopup="showPopup" @closePopupMasker="showPopup=$event" @sendCommentData="sendCommentData"></CommentMasker>
	</view>
</template>

<script>
	import marked from 'marked'
	import uParse from '@/components/u-parse/u-parse.vue'
	export default {
		components: {
			uParse
		},
		onLoad(...options) {
			this.articleData = this.$Router.currentRoute.query
			// 文章详情获取
			this._getArticleDetail()
			// 获取评论列表
			this._getCommentList()
		},
		data() {
			return {
				articleData: null,
				showPopup: false,
				commentList: [],
				replyData: {}
			}
		},
		methods: {
			async _getArticleDetail() {
				const data = await this.$http.get_article_detail({
					article_id: this.articleData._id
				})

				this.articleData = data
			},
			async openMaskerComment() {
				await this.checkedisLogin()
				this.showPopup = true
			},
			async sendCommentData(content) {
				const { msg } = await this.$http.update_comment({
					userId: this.userInfo._id,
					articleId: this.articleData._id,
					content,
					...this.replyData
				})
				uni.showToast({
					title: msg,
					icon: 'none'
				})
				this.showPopup = false
				// 修改评论成功后，数据更新
				this.replyData = {}
				this._getCommentList()
			},
			async _getCommentList() {
				const listArr = await this.$http.get_comments({
					articleId: this.articleData._id,
				})
				this.commentList = listArr
			},
			// 处理回复事件函数
			commentReply(data) {
				this.replyData = {
					comment_id: data.comment.comment_id,
					is_reply: data.isReply
				}
				data.comment.reply_id && (this.replyData.reply_id = data.comment.reply_id)
				this.openMaskerComment()
			},
			// 改变用户关注作者的状态
			async _followAuthor() {
				await this.checkedisLogin()
				const { msg } = await this.$http.update_follow_author({
					authorId: this.articleData.author.id,
					userId: this.userInfo._id
				})
				// 显示弹窗
				uni.showToast({
					title: msg
				})
				// 改变store里面的用户存储状态
				let followIds = [...this.userInfo.author_likes_ids]
				if(followIds.includes(this.articleData.author.id)) {
					followIds = followIds.filter(item => item !== this.articleData.author.id)
				} else {
					followIds.push(this.articleData.author.id)
				}
				this.updateUserInfo({
					...this.userInfo,
					author_likes_ids: followIds 
				})
				uni.$emit('updateFollowAuthor')
			},
			// 改变点赞
			async _updateCompliments() {
				const { msg } = await this.$http.update_compliments({
					articleId: this.articleData._id,
					userId: this.userInfo._id
				})
				uni.showToast({
					title: msg,
					icon: 'none'
				})
				// 改变用户点赞数组
				let thumbsArr = [...this.userInfo.thumbs_up_article_ids]
				if(thumbsArr.includes(this.articleData._id)) {
					thumbsArr = thumbsArr.filter(item => item !== this.articleData._id)
					this.articleData.thumbs_up_count -= 1
				} else {
					thumbsArr.push(this.articleData._id)
					this.articleData.thumbs_up_count += 1
				}
				this.updateUserInfo({
					...this.userInfo,
					thumbs_up_article_ids: thumbsArr 
				})
			},
			// 跳转到评论页面
			goCommentPage() {
				uni.navigateTo({
					url: `/pages/commentList/commentList?articleId=${this.articleData._id}`
				})
			}
		},
		computed: {
			content() {
				try {
					return marked.parse(this.articleData.content)
				} catch(e) {
					return null
				}
			},
			// 是否关注作者
			isFollowAuthor() {
				try {
					return this.userInfo && this.userInfo.author_likes_ids.includes(this.articleData.author.id)
				} catch(e) {
					return false
				}
			},
			// 是否对文章进行点赞
			isCompliments() {
				try {
					console.log(this.articleData._id);
					return this.userInfo && this.userInfo.thumbs_up_article_ids.includes(this.articleData._id)
				} catch(e) {
					return false
				}
			}
		}
	}
</script>

<style scoped lang="scss">
@import 'css/articleDetail.scss';
</style>