<template>
  <div>
    <headers :showBack="true" title="提现"></headers>
    <group label-width="4.5em" label-margin-right="2em" label-align="right">
      <x-input title="提现金额" type="number" placeholder="提现金额" v-model="money"></x-input>
    </group>
    <div class="row-center margin-top-20">
      <div class="width-90">
        <x-button class="back-ffac38 color-fff" @click.native="withdraw">提现</x-button>
      </div>
    </div>
  </div>
</template>

<script>
  import headers from '../components/headers.vue'
  import api from '../common/api.js'
  import { Group, XInput, XButton } from 'vux'
  export default {
    data () {
      return {
        money: '',
        wallet: parseFloat(api.getCookie('wallet')).toFixed(2)
      }
    },
    components: {headers, Group, XInput, XButton},
    methods: {
      withdraw () {
        if (!this.money) return this.$vux.toast.text('请输入提现金额')
        api.sendReq('/customer/user/withdrawal', {money: this.money}, 'POST').then(data => {
          if (data) {
            this.$vux.toast.text('提现成功')
            let result = parseFloat(api.getCookie('wallet')).toFixed(2) - parseFloat(this.money).toFixed(2)
            api.setCookie('wallet', result)
            this.$router.go(-1)
          }
        })
      }
    }
  }
</script>

<style scoped>

</style>
