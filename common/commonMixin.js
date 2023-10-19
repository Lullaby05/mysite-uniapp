import {
	mapState,
	mapMutations
} from 'vuex'
export default {

	install(Vue) {
		Vue.mixin({
			data() {
				return {

				}
			},
			methods: {
				checkedisLogin() {
					return new Promise((resolve, reject) => {
						if (this.userInfo) {
							resolve()
						} else {
							uni.navigateTo({
								url: "/pages/userInfo/login/login"
							})
						}

					})
				},
				...mapMutations(['updateUserInfo'])
			},
			computed: {
				...mapState(['userInfo'])
			}
		})
	}
}