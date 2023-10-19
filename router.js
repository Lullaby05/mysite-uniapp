import {RouterMount,createRouter} from 'uni-simple-router';
import state from 'store/state.js'

const loginPages = [
	'/pages/follow/follow', 
	'/pages/myArticle/myArticle',
	'/pages/feedback/feedback'
	]

const router = createRouter({
	platform: process.env.VUE_APP_PLATFORM,  
	routes: [...ROUTES]
});
//全局路由前置守卫
router.beforeEach((to, from, next) => {
	if(loginPages.includes(to.path) && !state.userInfo) {
		next({
			name: 'login',
			NAVTYPE: 'push' // 保留历史记录栈
		})
	} else {
		next();
	}
});

export {
	router,
	RouterMount
}