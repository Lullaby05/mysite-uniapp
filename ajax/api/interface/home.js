import ajax from '../../http.js'

export const get_label_list = data => ajax({
	name: 'get_label_list',
	data
})

export const get_article_list = data => ajax({
	name: 'get_article_list',
	data
})

export const update_save_like = data => ajax({
	name: 'update_save_like',
	data
})

export const get_search_data = data => ajax({
	name: 'get_search_data',
	data
})

export const update_label_ids = data => ajax({
	name: 'update_label_ids',
	data
})

export const get_article_detail = data => ajax({
	name: 'get_article_detail',
	data
})

export const update_comment = data => ajax({
	name: 'update_comment',
	data
})

export const get_comments = data => ajax({
	name: 'get_comments',
	data
})