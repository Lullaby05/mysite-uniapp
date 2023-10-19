<template>
	<view class="code-container">
		<view class="vCode-btn" @click="getForm">
			{{ runTime ? `${time}秒后重新获取` : '获取验证码' }}
		</view>
		
	</view>
</template>

<script>
	export default {
		name:"SendCode",
		data() {
			return {
				timeId: null,
				time: 60,
				runTime: false
			};
		},
		methods: {
			getForm() {
				if(this.runTime) return
				this.$emit('getForm', this._sendCode)
			},
			async _sendCode(form) {
				// 获取form表单 单独验证phone
				const { phone } = await form.validateField(['phone'])
				this.runTime = true
				this.timeRunning() // 开启倒计时
				// 发送数据请求云函数
				const { mobileCode, msg } = await this.$http.get_code({ phone })
				uni.showToast({
					title: msg,
					icon: "none"
				})
				this.$emit('setCurrentCode', mobileCode)
			},
			timeRunning() {
				this.timeId = setInterval(() => {
					if(this.time === 1) {
						clearInterval(this.timeId)
						this.timeId = null
						this.runTime = false
						this.time = 60
						return
					}
					this.time--
				}, 1000)
			}
		},
		beforeDestroy() {
			clearInterval(this.timeId)
			this.timeId = null
			this.runTime = false
			this.time = 60
		}
	}
</script>

<style lang="scss">
.code-container {
	flex-shrink: 0;
	margin-right: 20rpx;
	.vCode-btn {
		background-color: $base-color;
		color: #ffffff;
		padding: 20rpx;
		border-radius: 10rpx;
		opacity: .8;
	}
}
</style>