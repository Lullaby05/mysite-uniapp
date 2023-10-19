'use strict';
const db = uniCloud.database()
const dbCmd = db.command
exports.main = async (event, context) => {
	const { userId } = event
	
	const userInfo = await db.collection('user').doc(userId).get()
	const article_ids = userInfo.data[0].article_ids
	
	const articleList = await db.collection('article')
	.aggregate()
	.project({
		content:0,
		comments:0
	})
	.match({
		id: dbCmd.in(article_ids)
	})
	.end()
	
	//返回数据给客户端
	return {
		code: 0,
		msg: '数据请求成功',
		data: articleList.data
	}
};
