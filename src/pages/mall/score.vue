<template>
  <div>
    <headers title="发表评价" showBack="true"></headers>
    <div class="margin-l-r-10">
      <div class="back-fff padding-t-b-10 padding-l-r-15 row-state" v-if="orderInfo.salesman.status">
        <img :src="api.basePath + orderInfo.salesman.data.portraitUrl" class="headerImg">
        <div class="column">
          <span class="color-333">{{orderInfo.salesman.data.name}}</span>
          <span class="color-999 font14">{{orderInfo.salesman.data.phone}}</span>
        </div>
      </div>
      <div class="back-fff margin-top-15 padding-l-r-15 padding-bottom-20">
        <div class="padding-t-b-20 row-center">
          <rater :max="5" v-model="rater" :font-size="35"></rater>
        </div>
        <textarea rows="5" class="textarea" placeholder="亲，服务如何，您是否还满意？" v-model="evaluate"></textarea>
      </div>
      <div class="margin-top-30">
        <x-button class="back-ffac38 color-fff" @click.native="submitCom">提交</x-button>
      </div>
    </div>
  </div>
</template>

<script>
  import headers from '../components/headers.vue'
  import { Rater, XButton } from 'vux'
  import api from '../common/api.js'
  export default {
    data () {
      return {
        api: api,
        rater: 0,
        evaluate: '',
        orderInfo: {}
      }
    },
    components: { headers, Rater, XButton },
    methods: {
      submitCom () {
        let params = {
          serviceId: this.$route.query.id,
          score: this.rater,
          evaluate: this.evaluate
        }
        api.sendReq('/customer/user/evaluate_service_order', params, 'POST').then(data => {
          if (data) {
            this.$vux.toast.text('评价成功~')
            this.$router.go(-1)
          }
        })
      }
    },
    created () {
      api.sendReq('/customer/user/service_orders_id', {id: this.$route.query.id}).then(data => {
        if (data) {
          this.orderInfo = data
        }
      })
    }
  }
</script>

<style scoped>
  .headerImg{
    width: 3rem;
    height: 3rem;
    border-radius: 50%;
    margin-right: 10px;
  }
  .textarea {
    width: 90%;
    padding: 8px 5%;
    font-size: 1rem;
    background:none;
    outline:none;
    border: 2px solid #e6e4e4;
    color: #333;
  }
</style>
