'use strict';
exports.main = async (event, context) => {
	const {
		phone
	} = event;

	// 创建一个随机数
	const currentNumber = Math.random().toString().substr(2, 6)

	try {
		const res = await uniCloud.sendSms({
			appid: '__UNI__EACAC29', // mainfest.json中进行获取
			smsKey: '4459205b8518455c9056a29d82f117dc',
			smsSecret: 'e03a3554c4a54914179dd9634841d8df',
			phone,
			templateId: '12333', // 获取的短信模版
			data: {
				code: currentNumber,
				expMinute: '1',
			}
		})
		// 调用成功，请注意这时不代表发送成功
		return {
			code: 0,
			data: {
				mobileCode: currentNumber,
				msg: "请在手机注意查收验证码",
			}
		}
	} catch (err) {
		return {
			code: 1,
			msg: '短信验证码发送失败'
		}
	}

};