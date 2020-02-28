<template>
   <div>
     <headers title="奠金" showBack="true"></headers>
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
         <div class="margin-bottom-10 padding-l-r-10 padding-t-b-10 row-between back-fff" v-for="(item, i) in lists" :key="i" v-else>
           <div class="color-999 font15 column">
             <span>用户：{{item.name}}</span>
             <span>订单号：{{item.orderNumber}}</span>
             <span>创建时间：{{api.dateFormat(item.createtime)}}</span>
           </div>
           <p class="color-d81e06 font20">￥{{parseFloat(item.money).toFixed(2)}}</p>
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
        api.sendReq('/customer/user/cashmoney_list', params).then(data => {
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

</style>
