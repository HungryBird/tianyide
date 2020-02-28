<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
  export default {
    name: 'app'
  }
</script>

<style lang="less">
@import '~vux/src/styles/reset.less';
@import 'pages/common/comment.css';

body {
  background-color: #f8f8f8;
}
</style>
