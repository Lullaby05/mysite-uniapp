<template>
	<view class="label-container">
		<view class="label-box">
			<view class="label-header">
				<view class="label-title">
					我的标签
				</view>
				<view class="label-edit" @click="changeEditStatus">
					{{ isEdit ? '完成' : '编辑' }}
				</view>
			</view>
			<view class="label-content">
				<view class="label-content-item" v-for="(item) in selfLabelList" :key="item._id">
					{{ item.name }}
					<uni-icons @click="deleteLabelItem(item)" v-if="isEdit" class="icon-close" type="clear" size="20" color="red"></uni-icons>
				</view>
				<view v-if="!selfLabelList.length" class="no-data">
					当前没有数据
				</view>
			</view>
		</view>
		
		<!-- 标签推荐的结构 -->
		<view class="label-box">
			<view class="label-header">
				<view class="label-title">
					标签推荐
				</view>
			</view>
			<view class="label-content">
				<view @click="changeSelfLabelList(item)" class="label-content-item" v-for="(item) in recommendLabelList" :key="item._id">
					{{ item.name }}
				</view>
				<view v-if="!recommendLabelList.length" class="no-data">
					当前没有数据
				</view>
			</view>
		</view> 
	</view>
</template>

<script>
	import { mapState } from 'vuex'
	export default {
		data() {
			return {
				isEdit: false,
				labelIds: []
			};
		},
		methods: {
			changeEditStatus() {
				this.isEdit && this._updateLabel()
				this.isEdit = !this.isEdit
			},
			async _updateLabel() {
				// userInfo._id ids => []
				const label_ids = this.selfLabelList.map(item => item._id)
				const { msg } = await this.$http.update_label_ids({
					userId: this.userInfo._id,
					label_ids
				})
				uni.showToast({
					title: msg
				})
				this.updateUserInfo({
					...this.userInfo, label_ids
				})
			},
			changeSelfLabelList(item) {
				if(!this.isEdit) return
				this.labelIds.push(item._id)
			},
			deleteLabelItem(item) {
				this.labelIds = this.labelIds.filter(id => id !== item._id)
			}
		},
		watch: {
			userInfo: {
				handler(newVal, oldVal) {
					this.labelIds = this.userInfo.label_ids || []
				},
				immediate: true
			}
		},
		computed: {
			selfLabelList() {
				return this.labelList.filter(item => this.labelIds.includes(item._id))
			},
			recommendLabelList() {
				return this.labelList.filter(item => !this.labelIds.includes(item._id) && item._id)
			},
			...mapState(['labelList'])
		}
	}
</script>

<style scoped lang="scss">
@import 'css/labelAdmin.scss'
</style>
