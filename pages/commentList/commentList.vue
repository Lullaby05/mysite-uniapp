<template>
	<view class="">
		<view class="comment-content-container" v-for="item in commentList" :key="item.comment_id">
			<CommentBox @commentReply="commentReply" :commentData="item"></CommentBox>
		</view>
		<uni-load-more :content-text="{
			contentdown: '上拉加载更多',
			contentrefresh: '正在加载...',
			contentnomore: '没有更多评论了'
		}" v-if="commentList.length===0 || commentList.length>5" :status="loading"></uni-load-more>
		<!-- 评论组件 -->
		<CommentMasker :showPopup="showPopup" @closePopupMasker="showPopup=$event" @sendCommentData="sendCommentData"></CommentMasker>
	</view>
</template>

<script>
	export default {
		onLoad(props) {
			this.articleId = props.articleId
			this._getCommentList()
		},
		onReachBottom() {
			if(this.loading === 'noMore') {
				return
			}
			this.page++
			this._getCommentList()
		},
		data() {
			return {
				articleId: '',
				commentList: [],
				page: 1,
				pageSize: 5,
				loading: 'loading',
				showPopup: false,
				replyData: {}
			}
		},
		methods: {
			async _getCommentList() {
				const list = await this.$http.get_comments({
					articleId: this.articleId,
					page: this.page,
					pageSize: this.pageSize
				})
				
				if(list.length === 0) {
					this.loading = 'noMore'
					return
				}
				
				let oldList = JSON.parse(JSON.stringify(this.commentList))
				oldList.push(...list)
				this.commentList = oldList
			},
			commentReply(data) {
				this.replyData = {
					comment_id: data.comment.comment_id,
					is_reply: data.isReply
				}
				data.comment.reply_id && (this.replyData.reply_id = data.comment.reply_id)
				this.openMaskerComment()
			},
			async openMaskerComment() {
				await this.checkedisLogin()
				this.showPopup = true
			},
			async sendCommentData(content) {
				const { msg } = await this.$http.update_comment({
					userId: this.userInfo._id,
					articleId: this.articleId,
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
				this.page = 1;
				this.commentList = []
				this.loading = 'loading'
				this._getCommentList()
			}
		}
	}
</script>

<style lang="scss" scoped>
.comment-content-container {
	padding: 0 30rpx;
	border-bottom: 1px solid #eee;
}
</style>
