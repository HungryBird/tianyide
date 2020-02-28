<template>
  <div>
    <headers :showBack="true" title="个人设置"></headers>
    <group>
      <cell title="头像" is-link>
        <div>
          <img :src="data.headimgurl" class="headerImg">
        </div>
      </cell>
      <cell title="昵称" :value="data.nickname" is-link></cell>
      <cell title="收货地址" value="修改/添加" link="/address"></cell>
      <cell title="支付密码" link="/pay/password"></cell>
    </group>
  </div>
</template>

<script>
  import headers from '../components/headers.vue'
  import api from '../common/api.js'
  import { Cell, Group } from 'vux'
  export default {
    data () {
      return {
        data: {}
      }
    },
    components: { headers, Cell, Group },
    created () {
      this.data.nickname = api.getCookie('nickname')
      this.data.headimgurl = api.getCookie('headimgurl')
    }
  }
</script>

<style scoped>
  .headerImg{
    width: 3rem;
    height: 3rem;
    border-radius: 50%;
    display: inherit;
  }
</style>
