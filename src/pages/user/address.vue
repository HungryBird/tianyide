<template>
  <div>
    <headers title="我的收货地址" showBack="true" rightTxt="添加" @rightClick="rightClick('add')"></headers>
    <div class="row-center margin-top-50 color-999" v-if="lists.length === 0">您未添加收获地址~</div>
    <div class="row-between back-fff border-bottom-eee padding-t-b-10 padding-l-r-10" v-for="(item, i) in lists" :key="i" v-else>
      <div class="imgBox"><img src="../../../static/images/position.png" class="icon"></div>
      <div class="grow column" style="width: 70%">
        <div class="row-state">
          <span class="color-333">{{item.name}}</span>
          <span class="color-999 font14 margin-left-5">{{api.formatString(item.phone, 3, 4)}}</span>
        </div>
        <span class="font14 color-999 address">{{item.addres}}</span>
      </div>
      <span class="right" @click="rightClick('edit', item)">编辑</span>
    </div>
  </div>
</template>

<script>
  import headers from '../components/headers.vue'
  import api from '../common/api.js'
  export default {
    data () {
      return {
        api: api,
        lists: []
      }
    },
    components: { headers },
    created () {
      api.sendReq('/customer/user/commodity_address', null).then(data => {
        if (data) {
          this.lists = data
        }
      })
    },
    methods: {
      rightClick (type, row) {
        this.$router.push({path: '/address/details', query: {type: type, row: row}})
      }
    }
  }
</script>

<style scoped>
  .imgBox{
    width: 10%;
    display: flex;
    justify-content: center;
    align-items: center;
    margin-right: 15px;
  }
  .icon {
    width: 30px;
    height: 30px;
  }
  .address {
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    overflow: hidden;
  }
  .right{
    width: 10%;
    display: inline-block;
    color: #999;
    border-left: 1px solid #eee;
    padding-left: 15px;
    font-size: 0.9375rem;
    margin-left: 15px;
  }
</style>
