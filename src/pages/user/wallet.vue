<template>
  <div>
    <headers showBack="true" title="我的钱包"></headers>
    <div class="back-ffac38 padding-l-r-20 padding-top-30 padding-bottom-20 color-fff">
      <span>账户余额</span>
      <div><span class="font40">{{parseFloat(wallet).toFixed(2)}}</span></div>
    </div>
    <group>
      <cell title="提现" is-link link="/withdraw">
        <img slot="icon" src="../../../static/images/tixian.png" class="icon">
      </cell>
      <cell title="收款码" is-link @click.native="onClick">
        <img slot="icon" src="../../../static/images/qrCode.png" class="icon">
      </cell>
    </group>
    <group label-width="4.5em" label-margin-right="2em" label-align="right">
      <cell title="提现记录" link="/withdraw/history"></cell>
    </group>

    <confirm
      v-model="confirmShow"
      show-input
      title="提现金额"
      @on-confirm="onClick">
    </confirm>
  </div>
</template>

<script>
  import headers from '../components/headers.vue'
  import api from '../common/api.js'
  import { Cell, Group } from 'vux'
  export default {
    data () {
      return {
        confirmShow: false,
        wallet: api.getCookie('wallet'),
        isHasPay: false
      }
    },
    components: { headers, Cell, Group },
    created () {
      api.sendReq('/customer/user/flag_paypwd', null, 'POST').then(data => {
        if (data) {
          this.isHasPay = data
        }
      })
    },
    methods: {
      onClick () {
        let _this = this
        if (this.isHasPay) {
          this.$router.push('/qrCode')
        } else {
          this.$vux.confirm.show({
            title: '提示',
            content: '请先设置支付密码！',
            onCancel () {
              _this.$vux.confirm.hide()
            },
            onConfirm () {
              _this.$router.push('/pay/password')
            }
          })
        }
      }
    }
  }
</script>

<style scoped>
  .icon{
    width: 1.5rem;
    height: 1.5rem;
    display: inherit;
    margin-right: 5px;
  }
</style>
