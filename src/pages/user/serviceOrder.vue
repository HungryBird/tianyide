<template>
  <div>
    <div style="position: fixed;width: 100%;top: 0px;">
      <headers title="服务订单" showBack="true"></headers>
      <tab :line-width=2 active-color='#ffac38'>
        <tab-item selected @on-item-click="onItemClick(0)">进行中</tab-item>
        <tab-item @on-item-click="onItemClick(1)">已完成</tab-item>
      </tab>
    </div>


    <div style="margin-top: 110px;">
      <div class="margin-top-20 back-fff padding-l-r-15 padding-t-b-10" v-for="(item, i) in lists" :key="i" v-if="lists.length > 0" @click="goServiceDetails(item.id)">
        <div class="row-between border-bottom-eee padding-bottom-10">
          <span class="font15 color-333">{{item.number}}</span>
          <div class="row-state">
            <span :class="['state', type === 0 ? 'ing' : 'done']">{{type === 0 ? '进行中' : '已完成'}}</span>
            <img src="../../../static/images/go.png" class="goIcon">
          </div>
        </div>

        <div class="padding-top-15 column">
          <span class="color-999 font14">订单服务费(元)</span>
          <span class="font26">{{parseFloat(item.servicePrice).toFixed(2)}}</span>
        </div>
        <div class="margin-top-10 row-end">
          <span class="btn" v-if="item.status === 1 && (item.score == null || item.score == 0)" @click="evaluate(item.id)">评价</span>
        </div>
      </div>
    </div>

    <div class="row-center margin-top-50 color-999" v-if="lists.length === 0">-- 没有相关订单 --</div>
  </div>
</template>

<script>
  import headers from '../components/headers.vue'
  import api from '../common/api.js'
  import { Tab, TabItem } from 'vux'
  export default {
    data () {
      return {
        type: 0,
        lists: []
      }
    },
    components: { headers, Tab, TabItem },
    methods: {
      onItemClick (type) {
        this.type = type
        api.sendReq('/customer/user/service_orders', {type: type}).then(data => {
          if (data) {
            this.lists = data
          }
        })
      },
      goServiceDetails (id) {
        this.$router.push({path: '/service/order/details', query: {id: id}})
      },
      evaluate (id) {
        this.$router.push({path: '/score', query: {id: id}})
      }
    },
    mounted () {
      this.onItemClick(this.type)
    }
  }
</script>

<style scoped>
  .state {
    display: inline-block;
    padding: 5px 10px;
    border-radius: 10px;
    font-size: 12px;
    line-height: 12px;
  }
  .ing {
    color: #ffac38;
    background: #fff1c2;
  }
  .done {
    color: #999999;
    background: #f5f5f5;
  }
  .goIcon {
    width: 30px;
    height: 30px;
  }
  .btn {
    display: inline-block;
    border: 1px solid #ffac38;
    color: #ffac38;
    border-radius: 20px;
    padding: 3px 20px;
    font-size: 0.875rem
  }
</style>
