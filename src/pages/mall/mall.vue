<template>
  <div>
    <tabbar></tabbar>
    <scroller
      ref="scroller"
      lock-x
      use-pullup
      v-model="scrollerStatus"
      :pullup-config="pullupConfig"
      @on-pullup-loading="pullupLoad">
      <div class="margin-top-15 margin-bottom-50">
        <div class="row-wrap padding-l-r-10">
          <div class="width-50 margin-bottom-15 overflow-hidden" v-for="(item, i) in lists" :key="i" @click="jumpTo('/mall/details', item)">
            <div class="border-eee margin-l-r-5">
              <img :src="api.basePath + item.mainImage" class="mallImg">
              <div class="padding-t-b-10 padding-l-r-10">
                <h4 class="title">{{item.title}}</h4>
                <!--<p class="description font15 color-999">描述</p>-->
                <div class="row-between">
                  <span class="color-d81e06">￥{{item.price}}</span>
                  <img src="../../../static/images/shopping.png" class="catIcon">
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </scroller>
    <div class="fixed">
      <div class="width-90">
        <x-button class="back-ffac38 color-fff" @click.native="jumpTo('/service')">我要服务</x-button>
      </div>
    </div>
  </div>
</template>

<script>
  import tabbar from '../components/tabbar.vue'
  import headers from '../components/headers.vue'
  import api from '../common/api.js'
  import { XButton, Scroller } from 'vux'
  export default {
    data () {
      return {
        api: api,
        page: 1,
        lists: [],
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
    components: { tabbar, headers, XButton, Scroller },
    methods: {
      pullupLoad () {
        if (this.page < this.totalPage) {
          this.page++
          this.getCommodityList(this.page)
        }
      },
      getCommodityList (page) {
        api.sendReq('/customer/commodity', {page: page}).then(data => {
          if (data) {
            this.totalPage = data.totalPage
            this.lists = this.lists.concat(data.list)
            this.$refs.scroller.reset()
            this.scrollerStatus.pullupStatus = 'default'
          }
        })
      },
      jumpTo (path, row) {
        if (row) {
          api.setCookie('mallInfo', JSON.stringify(row))
        }
        this.$router.push({path: path})
      },
      login () {
        if (api.getCookie('userId')) return
        window.location.href = 'http://tianyinde.com/wechat/wechat_login?callbackUrl=http://tianyinde.com/web/index.html%23/user'
      }
    },
    mounted () {
      this.$nextTick(() => {
        this.$refs.scroller.reset()
      })
      this.getCommodityList(this.page)
    }
  }
</script>

<style scoped>
  .mallImg{
    width: 100%;
    height: 9rem;
    display: inherit;
  }
  .catIcon{
    width: 1.5rem;
    height: 1.5rem;
  }
  .title {
    color: #333;
    font-weight: normal;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    overflow: hidden;
  }
  .description {
    width: 100%;
    overflow: hidden;
    text-overflow:ellipsis;
    white-space: nowrap;
  }
  .fixed {
    position: fixed;
    width: 100%;
    bottom: 1rem;
    display: flex;
    align-items: center;
    justify-content: center;
  }
</style>
