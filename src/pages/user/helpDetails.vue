<template>
  <div>
    <headers :showBack="true" title="常见问题"></headers>
    <span class="title">Q: {{row.title}}</span>
    <div class="con">
      <span class="color-999 font15">{{row.text}}</span>
    </div>
  </div>
</template>

<script>
  import headers from '../components/headers.vue'
  export default {
    data () {
      return {
        row: this.$route.query.row
      }
    },
    components: { headers }
  }
</script>

<style scoped>
  .title{
    width: 100%;
    display: inline-block;
    padding: 0.3rem 0;
    text-indent: 1rem;
    color: #ffac38;
    font-size: 1rem;
    background-color: white;
  }
  .con{
    width: 100%;
    margin-top: 1rem;
    background-color: white;
  }
  .con span{
    display: inline-block;
    padding: 10px;
    line-height: 1.7rem;
  }
</style>
