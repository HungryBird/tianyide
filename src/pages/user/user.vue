<template>
  <div class="wrapper">
    <img src="../../../static/images/back.png" class="backIcon" @click="goBack">
    <div class="back-ffac38 padding-top-20 padding-bottom-30 padding-l-r-15 color-fff row-center column">
      <div style="height: 3rem"></div>
      <img :src="userInfo.headimgurl" class="headImg" @click="jumpTo('setting')">
      <span v-if="userInfo.nickname">{{userInfo.nickname}} (id:{{userInfo.id}})</span>
    </div>
    <div class="padding-l-r-20 back-fff">
      <div class="row-between padding-t-b-20">
        <div class="row-center column width-25" @click="jumpTo('wallet')">
          <img src="../../../static/images/wallet.png" class="itemIcon">
          <span>钱包</span>
        </div>
        <div class="row-center column width-25" @click="jumpTo('comment')">
          <img src="../../../static/images/comment.png" class="itemIcon">
          <span>留言</span>
        </div>
        <div class="row-center column width-25" @click="jumpTo('guests')">
          <img src="../../../static/images/fuyao.png" class="itemIcon">
          <span>赴邀</span>
        </div>
        <div class="row-center column width-25" @click="jumpTo('production', 'user')">
          <img src="../../../static/images/template_yellow.png" class="itemIcon">
          <span>制作</span>
        </div>
      </div>
    </div>
    <group>
      <cell title="我的奠金" link="/cash/money"></cell>
      <cell title="我的礼物" link="/my/gifts"></cell>
      <cell title="服务订单" link="/service/order"></cell>
      <cell title="商品订单" link="/commodity/order"></cell>
      <cell title="消费记录" link="/water/record"></cell>
      <cell title="帮助中心" link="/help"></cell>
    </group>
  </div>
</template>

<script>
  import api from '../common/api.js'
  import { Cell, Group } from 'vux'
  export default {
    data () {
      return {
        userInfo: {},
        isBack: false
      }
    },
    components: { Cell, Group },
    mounted () {
      api.sendReq('/customer/user/user_msg', null).then(data => {
        if (data) {
          api.setCookie('userId', data.id)
          api.setCookie('wallet', data.wallet)
          api.setCookie('nickname', data.nickname)
          api.setCookie('headimgurl', data.headimgurl)
          this.userInfo = data
        }
      })
    },
    methods: {
      goBack () {
        if (api.getCookie('isLogin') === 'true') {
          api.setCookie('isLogin', 'false')
          this.$router.push('/mall')
        } else {
          this.$router.go(-1)
        }
      },
      jumpTo (path, data) {
        this.$router.push(`/${path}?data=${data}`)
      }
    }
  }
</script>

<style scoped>
  .wrapper{
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
  }
  .backIcon {
    width: 2.5rem;
    position: absolute;
    top: 0.3rem;
    left: 10px;
  }
  .headImg {
    width: 4rem;
    height: 4rem;
    border-radius: 50%;
  }
  .itemIcon {
    width: 2rem;
    height: 2rem;
  }
</style>
