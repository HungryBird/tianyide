<template>
  <div>
    <headers title="商品订单" showBack="true"></headers>
    <tab
      bar-active-color="#ffac38"
      active-color="#ffac38"
      :line-width="1"
      v-model="activeIndex"
      prevent-default
      @on-before-index-change="switchTabItem">
      <tab-item selected>全部</tab-item>
      <tab-item>待支付</tab-item>
      <tab-item>待发货</tab-item>
      <tab-item>已发货</tab-item>
      <tab-item>已退款</tab-item>
    </tab>
    <div class="padding-l-r-10 padding-bottom-10">
      <div class="color-999 text-center margin-top-50" v-if="lists.length === 0">-- 没有相关订单 --</div>
      <div class="margin-top-10 back-fff border-radius-10 padding-l-r-10 padding-t-b-10" v-for="item in lists" :key="item.id" v-else @click="goCommodity(item.id)">
        <div class="item">
          <img :src="api.basePath + item.commodityImage" class="leftImg">
          <span class="title">{{item.commodityTitle}}</span>
          <span>￥{{parseFloat(item.commodityPrice).toFixed(2)}}</span>
        </div>
        <span class="rightTxt">{{item.statusStr}}</span>
      </div>
    </div>
  </div>
</template>

<script>
  import headers from '../components/headers.vue'
  import { Tab, TabItem } from 'vux'
  import api from '../common/api'
  export default {
    data () {
      return {
        activeIndex: 0,
        api: api,
        lists: []
      }
    },
    components: { headers, Tab, TabItem },
    methods: {
      switchTabItem (index) {
        this.activeIndex = index
        api.sendReq('/customer/user/commodity_orders', {type: index}).then(data => {
          if (data) {
            let newData = JSON.parse(JSON.stringify(data))
            newData.map(v => {
              if (v.payStatus === 0) {
                v.statusStr = '待支付'
              } else if (v.status === 2) {
                v.statusStr = '已退款'
              } else if (v.expressStatus === 0) {
                v.statusStr = '待发货'
              } else if (v.expressStatus === 1) {
                v.statusStr = '已发货'
              }
            })
            this.lists = newData
          }
        })
      },
      goCommodity (id) {
        this.$router.push({path: '/commodity/details', query: {id: id}})
      }
    },
    mounted () {
      this.switchTabItem(0)
    }
  }
</script>

<style scoped>
  .item {
    display: flex;
    justify-content: space-between;
    font-size: 15px;
  }
  .leftImg {
    width: 5rem;
    height: 5rem;
  }
  .title {
    flex-grow: 1;
    width: 40%;
    height: 50px;
    margin: 0 10px;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
  }
  .rightTxt {
    display: flex;
    justify-content: flex-end;
    color: #ffac38;
  }
</style>
