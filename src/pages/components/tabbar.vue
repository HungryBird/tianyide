<template>
  <div>
    <div class="flex">
      <div class="center" @click="jumpTo('mall')">
        <img src="../../../static/images/mall.png">
        <span>商城</span>
      </div>
      <div class="center" @click="jumpTo('production')">
        <img src="../../../static/images/template.png">
        <span>制作</span>
      </div>
      <div class="center" @click="jumpTo('mv')">
        <img src="../../../static/images/mv.png">
        <span>MV</span>
      </div>
      <div class="center" @click="jumpTo('user')">
        <img src="../../../static/images/user.png">
        <span>个人</span>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    methods: {
      jumpTo (path) {
        this.$router.push(`/${path}`)
      }
    }
  }
</script>

<style scoped>
  .flex{
    display: flex;
    background: #ffac38;
    padding: 10px 0;
  }
  .center{
    width: 25%;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
  }
  .center img{
    width: 2rem;
  }
  .center span{
    color: white;
    font-size: 0.8rem;
  }
</style>
