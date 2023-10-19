<template>
	<view class="login-container">
		<image src="../../../static/img/login_bg.png" class="banner-bg" mode=""></image>
		<!-- 导航 -->
		<view class="login-nav" >
			<view class="nav-item" @click="changeLoginType('account')" :class="{'active' : type === 'account'}">
				账号登陆
			</view>
			<view class="nav-item" @click="changeLoginType('mobile')" :class="{'active' : type !== 'account'}">
				手机登录
			</view>
		</view>
		<!-- 表单部分 -->
		<uni-forms class="form" ref="form" :modelValue="formData">
			<view class="" v-if="type === 'account'">
				<uni-forms-item label="账号" name="loginName">
					<input placeholder="请输入账号" v-model="formData.loginName" placeholder-class="placeholder" class="form-input" type="text" value="" />
				</uni-forms-item>
				<uni-forms-item label="密码" name="password">
					<uni-easyinput placeholder="请输入密码" v-model="formData.password" placeholder-class="placeholder" class="form-input" type="password" value=""  :input-border="false"></uni-easyinput>
					<!-- <input placeholder="请输入密码" v-model="formData.password" placeholder-class="placeholder" class="form-input" type="password" value="" /> -->
				</uni-forms-item>
			</view>
			<view class="" v-else>
				<uni-forms-item label="手机号" name="phone">
					<input placeholder="请输入手机号" v-model="formData.phone" placeholder-class="placeholder" class="form-input" type="number" value="" />
				</uni-forms-item>
				<uni-forms-item label="验证码" name="vCode">
					<input placeholder="请输入验证码" v-model="formData.vCode" placeholder-class="placeholder" class="form-input" type="text" value="" />
					<SendCode @getForm="getForm" class="code-component" @setCurrentCode="returnCode=$event"></SendCode>
				</uni-forms-item>
			</view>
			
			<button class="login-btn" @click="_userLoginSubmit">立即登录</button>
		</uni-forms>
		
		<view class="footer-select-container">
			<text>注册</text>
			<text>忘记密码</text>
		</view>
	</view>
</template>

<script>
	import { mapMutations } from 'vuex'
	export default {
		onReady() {
			this.$refs.form.setRules(this.userRules)
		},
		data() {
			return {
				type: 'account',
				formData: {
					loginName: '',
					password: '',
					phone: '',
					vCode: ''
				},
				returnCode: null
			}
		},
		methods: {
			async _userLoginSubmit() {
				const res = await this.$refs.form.submit()
				// 发送数据到后台
				this._sendUserInfo({
					...res, 
					type: this.type
				})
			},
			changeLoginType(type) {
				this.type = type
				this.$refs.form.clearValidate([])
			},
			// 发送数据给后端并登录
			async _sendUserInfo(data) {
				const userInfo = await this.$http.user_login(data)
				if(userInfo) {
					// 使用store进行存储
					this.updateUserInfo(userInfo)
					uni.showToast({
						title: '用户登陆成功',
						icon: 'none'
					})
					setTimeout(() => {
						// #ifdef H5
						uni.switchTab({
							url: '/pages/index/index'
						})
						// #endif
						// #ifndef H5
						uni.navigateBack()
						// #endif
					}, 1500)
				}
			},
			// 向验证码组件发送form表单
			getForm(cb){
				cb && cb(this.$refs.form)
			},
			...mapMutations(['updateUserInfo'])
		}
	}
</script>

<style lang="scss">
	page {
		background-color: #f5f5f5;
	}
</style>
<style scoped lang="scss">
@import 'css/login.scss'
</style>
