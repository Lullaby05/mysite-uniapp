export default ({ name, data = { } }) => {
	// 返回promise
	return new Promise((resolve, reject) => {
		const loading = data.isLoading
		data.isLoading && delete data.isLoading
		!loading && uni.showLoading({
			title: '加载中 '
		})
		// 调用云函数
		uniCloud.callFunction({
			name, // 云函数名字
			data, // 参数
			success({result}) {
				if(result.code === 0) { // 请求成功
					resolve(result.data)
				} else { // 请求成功但无数据
					uni.showToast({
						icon: 'none',
						title: result.msg
					})
				}
			},
			// 报错
			fail(err) {
				reject(err)
			},
			// 完成状态，关闭弹窗
			complete() {
				!loading && uni.hideLoading()
			}
		})
	})
}