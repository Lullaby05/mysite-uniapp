'use strict';
const db = uniCloud.database()
exports.main = async (event, context) => {
	const { searchVal } = event
	
	const list = await db.collection('article')
	.aggregate()
	.match({
		title: new RegExp(searchVal) // 模糊查询
	})
	.project({
		content: 0
	})
	.end()
	
	
	//返回数据给客户端
	return {
		code: 0,
		msg: '数据获取成功',
		data: {
			articleList: list.data,
		}
	}
};
