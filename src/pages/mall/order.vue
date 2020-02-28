<template>
  <div>
    <headers title="确认订单" showBack="true"></headers>
    <div class="margin-t-b-15 margin-l-r-15">
      <div class="back-fff border-radius-10 padding-t-b-10 padding-l-r-15 row-between" v-if="address.phone && address.name">
        <img src="../../../static/images/position.png" class="leftIcon">
        <div>
          <div class="row-state">
            <span>你的名字</span>
            <span class="color-999 font14 margin-left-5">18022228888</span>
          </div>
          <span class="address font14">广西壮族自治区南宁市西乡塘区明秀西路明秀小学</span>
        </div>
        <x-icon type="ios-arrow-right" size="30"></x-icon>
      </div>
      <div v-else class="row-center back-fff padding-t-b-20">
        <div class="row-state">
          <img src="../../../static/images/add.png" class="addIcon">
          <span class="color-333">添加收货地址</span>
        </div>
      </div>

    </div>
    <div class="fixed">
      <div class="row-end">
        <span>合计：</span>
        <span class="color-d81e06 font20">￥218.00</span>
        <span class="btn font15" @click="submitOrder">提交订单</span>
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
        address: {}
      }
    },
    components: { headers },
    methods: {
      submitOrder () {
        let params = this.address
        params.userId = parseInt(api.getCookie('userId'))
        api.sendReq('/customer/user/purchase_service', params, 'POST').then(data => {
          if (data) {
            this.$vux.toast.text('支付成功')
            this.$router.push('/score')
          }
        })
      }
    },
    mounted () {
      api.sendReq('/customer/user/commodity_address', null).then(data => {
        if (data) {
          this.address.name = data[0].name
          this.address.phone = data[0].phone
        }
      })
    }
  }
</script>

<style scoped>
  .vux-x-icon {
    fill: #dbdbdb;
  }
  .leftIcon{
    width: 2rem;
    height: 2rem;
    margin-right: 10px;
  }
  .address{
    color: #333;
    display: inline-block;
    line-height: 18px;
  }

  .leftImg{
    width: 5rem;
    height: 5rem;
    margin-right: 10px;
  }
  .row {
    display: flex;
    justify-content: flex-start;
  }


  .input{
    background:none;
    outline:none;
    border:0px;
    font-size: 1rem;
    color: #999;
    width: 60%;
  }
  .input::-webkit-input-placeholder {
    color: #999;
  }
  .fixed{
    position: fixed;
    width: 100%;
    background: white;
    bottom: 0;
    left: 0;
    padding: 10px 0;
  }
  .btn{
    display: inline-block;
    padding: 8px 20px;
    border-radius: 20px;
    color: white;
    background: #d81e06;
    margin: 0 15px;
  }
  .addIcon {
    width: 20px;
    height: 20px;
    margin-right: 5px;
  }
</style>
