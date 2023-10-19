<template>
	<view class="home-container">
		<NavBar></NavBar>
		<!-- 选项卡 -->
		<TabBar :activeIndex="activeIndex" :labelList="labelList" @changeActiveIndex="changeActiveIndex"></TabBar>
		<ArticleList class="list-container" :activeIndex="activeIndex" :labelList="labelList" @changeActiveIndex="changeActiveIndex"></ArticleList>
	</view>
</template>

<script>
	import { mapState, mapMutations } from 'vuex'
	export default {
		onLoad() {
			this._initLabelList()
		},
		data() {
			return {
				activeIndex: 0,
			}
		},
		methods: {
			async _initLabelList() {
				if(this.labelList.length) return
				const labelList = await this.$http.get_label_list()
				this.setLabelList([ { name: '全部' }, ...labelList])
			},
			changeActiveIndex(index) {
				this.activeIndex = index
			},
			...mapMutations(['setLabelList'])
		},
		computed: {
			labelList() {
				if(this.userInfo) {
					this.activeIndex = 0
					return [
						...this.$store.state.labelList.slice(0, 1), 
						...this.$store.state.labelList.filter(item => this.userInfo.label_ids.includes(item._id))
						]
				} else {
					return this.$store.state.labelList
				}
			}
		}
	}
</script>

<style lang="scss">
	page {
		display: flex;
		height: 100%;
	}
	.home-container {
		flex: 1;
		overflow: hidden;
		box-sizing: border-box;
		@include flex(flex-start, column);
		align-items: inherit;
	}
	.list-container {
		flex: 1;
		box-sizing: border-box;
	}
</style>