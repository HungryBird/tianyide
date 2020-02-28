<template>
  <div>
    <headers title="支付成功"></headers>
    <div class="padding-top-30 back-fff padding-bottom-20 row-center column">
      <img src="../../../static/images/success.png" width="167" height="128">
      <span class="color-333 margin-t-b-20 font20">支付成功！</span>
      <div class="row-state">
        <span class="backBtn" @click="$router.go(-3)">返回商城</span>
        <span class="backBtn" @click="$router.push('/my/order')">查看列表</span>
      </div>
    </div>
  </div>
</template>

<script>
  import headers from '../components/headers.vue'
  export default {
    components: { headers }
  }
</script>

<style scoped>
  .backBtn {
    display: inline-block;
    background: #ffac38;
    color: white;
    padding: 8px 20px;
    border-radius: 50px;
    margin: 0 10px;
  }
</style>
