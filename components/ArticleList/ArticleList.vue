<template>
	<swiper class="swiper-container" :current="activeIndex" @change="changeActiveIndex">
		<swiper-item v-for="(item, index) in labelList" :key="item._id">
			<view class="swiper-item uni-bg-red">
				<ListItem :loadData="loadData[index]" :articleList="articleData[index]" @loadMore="loadMoreData"></ListItem>
			</view>
		</swiper-item>
	</swiper>
</template>

<script>
	export default {
		name:"ArticleList",
		props: {
			labelList: Array,
			activeIndex: Number
		},
		data() {
			return {
				articleData: {},
				loadData: {},
				pageSize: 6
			};
		},
		created() {
			this.labelList.length && this._getArticleList(this.activeIndex)
		},
		watch: {
			labelList(newValue, oldValue) {
				if(JSON.stringify(newValue) === JSON.stringify(oldValue)) return
				this.articleData = {}
				this.loadData = {}
				this._getArticleList(this.activeIndex)
			}
		},
		methods: {
			changeActiveIndex(e) {
				const index = e.detail.current
				this.$emit('changeActiveIndex', index)
				if(!this.articleData[index] || !this.articleData[index].length) {
					this._getArticleList(index)
				}
			},
			// 获取数据
			async _getArticleList(index) {
				// 指定每一个标签下的页数信息
				if(!this.loadData[index]) {
					this.loadData[index] = {
						page: 1,
						loading: 'loading',
						total: 0
					}
				}
				
				const { name: classify } = this.labelList[index]
				const { articleList, total } = await this.$http.get_article_list({ 
					classify,
					page: this.loadData[index].page,
					pageSize: this.pageSize
				})
				
				let oldList = this.articleData[index] || [] // 追加每一次请求数据结果
				oldList.push(...articleList)
				
				this.$set(this.articleData, index, oldList)
				this.loadData[index].total = total
			},
			// 到底加载更多内容
			loadMoreData() {
				if(this.articleData[this.activeIndex].length === this.loadData[this.activeIndex].total) {
					this.loadData[this.activeIndex] = {
						...this.loadData[this.activeIndex],
						loading: 'noMore' 
					}
					this.$forceUpdate()
					return
				}
				
				this.loadData[this.activeIndex].page++ 
				this._getArticleList(this.activeIndex)
			}
		}
	}
</script>

<style scoped lang="scss">
.swiper-container {
	height: 100%;
	.swiper-item {
		height: 100%;
		overflow: hidden;
	}
}
</style>