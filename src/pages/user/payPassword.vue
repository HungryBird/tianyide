<template>
  <div>
    <headers :showBack="true" title="支付密码"></headers>
    <group label-width="4.5em" label-margin-right="2em" label-align="right">
      <x-input title="旧密码" type="password" placeholder="旧密码" v-model="oldPaw" v-if="isHasPay"></x-input>
      <x-input title="支付密码" type="password" placeholder="支付密码" v-model="password"></x-input>
      <x-input title="确认密码" type="password" placeholder="确认密码" v-model="confirmPwd"></x-input>
    </group>
    <div class="row-center margin-top-20">
      <div class="width-90">
        <x-button class="back-ffac38 color-fff" @click.native="setPwd">提交</x-button>
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
        oldPaw: '',
        password: '',
        confirmPwd: '',
        isHasPay: false
      }
    },
    components: { headers, Group, XInput, XButton },
    created () {
      api.sendReq('/customer/user/flag_paypwd', null, 'POST').then(data => {
        if (data) {
          this.isHasPay = data
        }
      })
    },
    methods: {
      setPwd () {
        let rag = /^\d{6}$/
        if (this.isHasPay && !this.oldPaw) {
          return this.$vux.toast.text('请输入旧密码')
        }
        if (!this.password || !this.confirmPwd) {
          return this.$vux.toast.text('请输入密码')
        } else if (this.password !== this.confirmPwd) {
          return this.$vux.toast.text('两次密码不一致')
        }
        if (!rag.test(this.confirmPwd) || !rag.test(this.password)) {
          return this.$vux.toast.text('请输入6位数字密码')
        }
        let url = '/customer/user/set_paypwd'
        let params = {
          payPassword: this.password,
          payPasswordTwo: this.confirmPwd
        }
        if (this.isHasPay) {
          url = '/customer/user/update_paypwd'
          params.payPassword = this.oldPaw
          params.newPayPassword = this.confirmPwd
          delete params.payPasswordTwo
        }
        api.sendReq(url, params, 'POST', true).then(data => {
          if (data) {
            this.$vux.toast.text('设置成功')
            this.$router.go(-1)
          }
        })
      }
    }
  }
</script>

<style scoped>

</style>
