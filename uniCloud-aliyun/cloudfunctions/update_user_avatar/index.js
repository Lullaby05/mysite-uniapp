'use strict';
const db = uniCloud.database()

exports.main = async (event, context) => {
	const { filePath, userId } = event
	
	// 更新用户头像
	const user = await db.collection('user').doc(userId).get()
	const oldUrl = user.data[0].avatar
	
	// 判断之前的用户头像是否存在，存在则删除
	try {
		await uniCloud.deleteFile({
			fileList: [oldUrl]
		})
	} catch(e) {
		console.log(e);
	}
	
	await db.collection('user').doc(userId).update({
		avatar: filePath
	})
	
	// 更新文章作者头像
	const id = user.data[0].id
	await db.collection('article').where({
		'author.id': id
	}).update({
		'author.avatar': filePath
	})
	
	//返回数据给客户端
	return {
		code: 0,
		data: {
			msg: '修改头像成功'
		}
	}
};
