<template>
  <div>
    <headers title="我的留言" showBack="true"></headers>
    <tab :line-width="1" custom-bar-width="60px" active-color="#ffac38">
      <tab-item selected @on-item-click="onItemClick('fasong')">我的</tab-item>
      <tab-item @on-item-click="onItemClick('shoudao')">收到的</tab-item>
    </tab>
    <scroller
      ref="scroller"
      lock-x
      use-pullup
      v-model="scrollerStatus"
      :pullup-config="pullupConfig"
      @on-pullup-loading="pullupLoad">
      <div class="margin-top-15">
        <div class="row-center color-999" v-if="lists.length === 0">没有相关记录~</div>
        <div class="box" v-for="(item, i) in lists" :key="i" v-else>
          <div class="row-between">
            <span class="color-ffac38">{{item.name}}</span>
            <span class="color-999">{{api.dateFormat(item.createtime)}}</span>
          </div>
          <p class="color-999 font14">{{item.note}}</p>
        </div>
      </div>
    </scroller>
  </div>
</template>

<script>
  import headers from '../components/headers.vue'
  import { Tab, TabItem, Scroller } from 'vux'
  import api from '../common/api.js'
  export default {
    data () {
      return {
        api: api,
        type: '',
        lists: [],
        page: 1,
        totalPage: 1,
        pullupConfig: {
          content: '',
          pullUpHeight: 60,
          height: 40,
          autoRefresh: true,
          downContent: '',
          upContent: '',
          loadingContent: ''
        }
      }
    },
    components: { headers, Tab, TabItem, Scroller },
    methods: {
      pullupLoad () {
        if (this.page < this.totalPage) {
          this.page++
          this.onItemClick(this.type)
        }
      },
      onItemClick (type) {
        this.type = type
        let params = {
          type: type,
          page: this.page
        }
        api.sendReq('/customer/user/comment_list', params).then(data => {
          if (data) {
            this.totalPage = data.totalPage
            this.lists = this.lists.concat(data.list)
            this.$refs.scroller.reset()
            this.scrollerStatus.pullupStatus = 'default'
          }
        })
      }
    },
    mounted () {
      this.$nextTick(() => {
        this.$refs.scroller.reset()
      })
      this.onItemClick('fasong')
    }
  }
</script>

<style scoped>
  .box{
    padding: 10px 15px;
    background: white;
  }
</style>
