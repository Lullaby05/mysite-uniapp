'use strict';
const db = uniCloud.database()

const dbcmd = db.command
exports.main = async (event, context) => {
	const { userId, articleId } = event
	
	// 获取用户数据表集合
	const userInfo = await db.collection('user').doc(userId).get();
	
	const articleIds = userInfo.data[0].article_likes_ids
	let articleArr = null
	
	let msg = null
	
	// 判断数据表的指定数据里面是否收藏了这个文章
	if(articleIds.includes(articleId)) {
		// 删除操作
		articleArr = dbcmd.pull(articleId)
		msg = '取消收藏'
	} else {
		// 添加操作
		articleArr = dbcmd.addToSet(articleId)
		msg = '收藏成功'
	}
	
	await db.collection('user').doc(userId).update({
		article_likes_ids: articleArr
	})
	
	const updateUser = await db.collection('user').doc(userId).get()
	
	//返回数据给客户端
	return {
		code: 0,
		data: {
			msg,
			newUserInfo: updateUser.data[0]
		}
	}
};
