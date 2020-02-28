<template>
   <div>
     <headers title="礼物" showBack="true"></headers>
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
       <div>
         <div class="row-center color-999 margin-top-50" v-if="lists.length === 0">没有相关记录~</div>
         <div class="margin-top-15" v-else v-for="(item, i) in lists" :key="i">
           <div class="margin-top-10 margin-l-r-10">
             <div class="back-fff radius padding-l-r-10 padding-t-b-10">
               <div class="font15">
                 <div class="row-between">
                   <div class="row-state">
                     <img src="../../../static/images/gif.png" class="giftIcon">
                     <span class="color-666 font16">{{item.giftName}}</span>
                   </div>
                   <span class="color-ffac38">{{item.price}}</span>
                 </div>
                 <p class="margin-top-10 color-999">订单号:{{item.orderName}}</p>
               </div>
             </div>
             <div class="back-ffac38 color-fff row-between font14 padding-l-r-10 padding-t-b-3">
               <span>{{item.name}}赠送</span>
               <span>{{api.dateFormat(item.createtime)}}</span>
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
        api.sendReq('/customer/user/gift_list', params).then(data => {
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
  .giftIcon{
    width: 2rem;
    height: 2rem;
    margin-right: 5px;
  }
  .radius {
    border-top-left-radius: 10px;
    border-top-right-radius: 10px;
  }
</style>
