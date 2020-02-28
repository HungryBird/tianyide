<template>
  <div>
    <headers title="赴邀" showBack="true"></headers>
    <tab
      :line-width=2
      active-color='#ffac38'
      custom-bar-width="150px">
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
      <div>
        <div class="row-center color-999 margin-top-50" v-if="lists.length === 0">没有相关记录~</div>
        <div class="padding-l-r-20 margin-top-10 back-fff" v-else>
          <div class="border-bottom-eee padding-t-b-10" v-for="(item, i) in lists" :key="i">
            <div class="row-between">
              <span class="color-ffac38">{{item.name}}</span>
              <span class="color-999 font14">{{item.phone}}</span>
            </div>
            <div class="row-between font14 color-999 margin-top-5">
              <span>赴邀人数：{{item.number}}</span>
              <p>{{api.dateFormat(item.createtime)}}</p>
            </div>
          </div>
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
    mounted () {
      this.$nextTick(() => {
        this.$refs.scroller.reset()
      })
      this.onItemClick('fasong')
    },
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
        api.sendReq('/customer/user/viteservice_list', params).then(data => {
          if (data) {
            this.totalPage = data.totalPage
            this.lists = this.lists.concat(data.list)
            this.$refs.scroller.reset()
            this.scrollerStatus.pullupStatus = 'default'
          }
        })
      }
    }
  }
</script>

<style scoped>

</style>
