import ajax from '../../http.js'

// 用户登录
export const user_login = data => ajax({
	name: 'user_login',
	data
})

// 发送验证码
export const get_code = data => ajax({
	name: 'get_code',
	data
})

export const update_follow_author = data => ajax({
	name: 'update_follow_author',
	data
})

export const update_compliments = data => ajax({
	name: 'update_compliments',
	data
})

// 获取收藏文章
export const get_follow_article = data => ajax({
	name: 'get_follow_article',
	data
})

// 获取关注的作者
export const get_follow_author = data => ajax({
	name: 'get_follow_author',
	data
})

// 获取用户发布的文章
export const get_my_article = data => ajax({
	name: 'get_my_article',
	data
})

// 提交反馈意见
export const update_feedback = data => ajax({
	name: 'update_feedback',
	data
})

// 更改用户头像
export const update_user_avatar = data => ajax({
	name: 'update_user_avatar',
	data
})