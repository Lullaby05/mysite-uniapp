export default {
	install(Vue) {
		Vue.mixin({
			data() {
				return {
					mobileReg: /^1[345789]\d{9}$/,
					userRules: {
						loginName: {
							rules: [
								{ required: true, "errorMessage": '账户名不能为空' },
								{ validateFunction: this.validateLoginName }
							]
						},
						password: {
							rules: [
								{ required: true, 'errorMessage': '密码不能为空' }
							]
						},
						phone: {
							rules: [
								{ required: true, "errorMessage": '手机号不能为空' },
								{ validateFunction: this.validatePhone }
							]
						},
						vCode: {
							rules: [
								{ required: true, "errorMessage": '验证码不能为空' },
								{ validateFunction: this.validateCode }
							]
						}
					}
				}
			},
			methods: {
				validateLoginName(rule, val, data, callback) {
					switch(true) {
						case val.length < 6 : {
							callback('用户名长度不正确')
							break
						}
						default: {
							return true
						}
					}
				},
				validatePhone(rule, val, data, callback) {
					switch(true) {
						case !this.mobileReg.test(val) : {
							callback('手机号码格式不正确')
							break
						}
						default: {
							return true
						}
					}
				},
				// 验证验证码
				validateCode(rule, val, data, callback) {
					switch(true) {
						case val !== this.returnCode: {
							callback('请输入正确的验证码')
							break
						}
						default: {
							return true
						}
					}
				}
			}
		})
	}
}