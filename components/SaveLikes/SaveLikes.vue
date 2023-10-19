<template>
	<view class="save-icons" @click.stop="_changeSaveStatus">
		<uni-icons color="#ff6600" :type="isSave ? 'heart-filled' : 'heart'" :size="size" ></uni-icons>
	</view>
</template>

<script>
	export default {
		name:"SaveLikes",
		props: {
			item: Object,
			size: {
				type: String,
				default: '20'
			}
		},
		data() {
			return {
				
			};
		},
		computed:{
			
			isSave() {
				try {
					return this.userInfo && this.userInfo.article_likes_ids.includes(this.item._id)
				} catch(e) {
					return false
				}
			}
		},
		methods: {
			async _changeSaveStatus() {
				// 判断是否登录
				await this.checkedisLogin()
				const { msg, newUserInfo } = await this.$http.update_save_like({
					articleId: this.item._id,
					userId: this.userInfo._id
				})
				uni.showToast({
					title: msg,
					icon: 'none'
				})
				
				this.updateUserInfo({
					...this.userInfo,
					...newUserInfo
				})
				uni.$emit('updateArticle')
			}
		}
	}
</script>

<style lang="scss">

</style>