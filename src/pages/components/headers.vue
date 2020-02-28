<template>
    <div>
        <div :class="['header', fixed?'fixed':'']">
          <div @click="goback" v-if="showBack" class="imgBox">
            <img src="../../../static/images/back.png" class="backIcon">
          </div>
          <span class="title">{{title}}</span>
          <span class="rightTxt" @click="rightClick">{{rightTxt}}</span>
        </div>
        <!--<div style="height: 3rem" v-if="fixed"></div>-->
    </div>
</template>

<script>
    import { XHeader } from 'vux'
    export default {
      props: ['title', 'showBack', 'fixed', 'rightTxt'],
      components: { XHeader },
      methods: {
        goback () {
          this.$router.go(-1)
        },
        rightClick () {
          this.$emit('rightClick')
        }
      }
    }
</script>

<style scoped>
  .header{
    display: flex;
    background: #ffac38;
    text-align: center;
    color: white;
    position: relative;
    height: 3rem;
    align-items: center;
    justify-content: center;
  }
  .fixed{
    width: 100%;
    position: fixed;
    top: 0;
    left: 0;
    z-index: 9999;
  }
  .imgBox {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-left: 10px;
    position: absolute;
    left: 0;
    top: 0.3rem;
  }
  .backIcon {
    width: 2.5rem;
  }
  .title {
    font-size: 1.2rem;
  }
  .rightTxt {
    position: absolute;
    right: 10px;
    top: 0.7rem;
  }
</style>
