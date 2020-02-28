<template>
    <div>
      <headers title="提现记录" showBack="true"></headers>
      <div class="row-center color-999 margin-top-50" v-if="lists.list.length === 0">没有相关记录~</div>
      <div v-else>
        <div class="margin-top-10 padding-l-r-10 padding-t-b-10 back-fff column" v-for="(item, i) in lists.list" :key="i">
          <div class="row-between">
            <span>金额：<span class="color-ffac38">{{item.money}}</span></span>
            <span :class="[item.status === 'tongguo' ? 'color-ffac38' : item.status === 'shenqing' ? 'color-999' : 'color-d81e06']">{{item.status === 'shenqing' ? '申请中' : item.status === 'tongguo' ? '提现成功' : '提现失败'}}</span>
          </div>
          <span class="color-999">{{api.dateFormat(item.createtime)}}</span>
          <span class="color-999 font14 border-top-eee padding-top-5">备注：{{item.note}}</span>
        </div>
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
        lists: [],
        page: 1
      }
    },
    components: { headers },
    created () {
      api.sendReq('/customer/user/user_withdrawal', {page: this.page}, 'POST').then(data => {
        if (data) {
          this.lists = data
        }
      })
    }
  }
</script>

<style scoped>

</style>
