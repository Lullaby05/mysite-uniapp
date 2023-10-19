<template>
	<view class="comment-box">
		<view class="comment-header">
			<view class="comment-header-logo">
				<image :src="commentData.author.avatar" mode="aspectFill"></image>
			</view>
			<view class="comment-header-info">
				<view class="title" v-if="!commentData.is_reply">
					{{ commentData.author.author_name }}
				</view>
				<view class="title" v-else>
					{{ commentData.author.author_name }}
					<text class="reply-text">回复</text>
					{{ commentData.to }}
				</view>
				<view class="">
					<uni-dateformat :date="commentData.create_time" format="yyyy-MM-dd hh:mm:ss"></uni-dateformat>
				</view>
			</view>
		</view>
		<!-- 评论内容展示 -->
		<view class="comment-content">
			<view class="">
				{{ commentData.comment_content }}
			</view>
			<view class="comment-info">
				<view class="comment-button" @click="commentReply({comment:commentData, isReply})">
					回复
				</view>
			</view>
			<!-- 子回复展示 -->
			<view class="comment-reply-list" v-for="item in commentData.replyArr" :key="item.comment_id">
				<CommentBox :isReply="true" :commentData="item" @commentReply="commentReply"></CommentBox>
			</view>
		</view>
	</view>
</template>

<script>
	import CommentBox from '@/components/CommentBox/CommentBox.vue'
	export default {
		name:"CommentBox",
		props: {
			commentData: Object,
			isReply: {
				type: Boolean,
				default: false
			}
		},
		data() {
			return {
				
			};
		},
		methods: {
			commentReply(data) {
				if(data.isReply) {
					data.comment.reply_id = data.comment.comment_id
					data.comment.comment_id = this.commentData.comment_id
				}
				// 向articleDetail发送的时候只有一次
				this.$emit('commentReply', data)
			}
		}
	}
</script>

<style scoped lang="scss">
@import 'css/CommentBox.scss'
</style>