<template>
  <div>
    <headers showBack="true" title="选择模板"></headers>
    <tab active-color="#ffac38">
      <tab-item :selected="sysSelected" @on-item-click="onItemClick('system')">公共模板</tab-item>
      <tab-item :selected="userSelected" @on-item-click="onItemClick('user')">我的模板</tab-item>
    </tab>
    <scroller
      ref="scroller"
      lock-x
      use-pullup
      v-model="scrollerStatus"
      :pullup-config="pullupConfig"
      @on-pullup-loading="pullupLoad">
      <div class="box">
        <div class="item" v-for="item in list" :key="item.id">
          <iframe class="iframe" :src="api.basePath + item.modulNameAndId + '?timestamp_=' + Date.parse(new Date())" frameborder="0"></iframe>
          <div class="itemDiv" @click="jumpTo(item)"></div>
        </div>
      </div>
    </scroller>
  </div>
</template>

<script>
  import headers from '../components/headers.vue'
  import api from '../common/api.js'
  import { Tab, TabItem, Scroller } from 'vux'
  export default {
    data () {
      return {
        api: api,
        sysSelected: false,
        userSelected: false,
        list: [],
        type: 'system',
        page: 1,
        totalPage: 1,
        pullupConfig: {
          content: '',
          pullUpHeight: 60,
          height: 40,
          autoRefresh: true,
          downContent: '',
          upContent: '',
          loadingContent: ''
        }
      }
    },
    components: { headers, Tab, TabItem, Scroller },
    methods: {
      jumpTo (row) {
        this.$router.push({path: '/template', query: {row: row, type: this.type}})
      },
      pullupLoad () {
        if (this.page < this.totalPage) {
          this.page++
          this.onItemClick(this.type)
        }
      },
      onItemClick (type) {
        this.type = type
        this.list = []
        let url = '/customer/system_moduls'
        if (type === 'user') {
          url = '/customer/user/user_moduls'
        }
        api.sendReq(url, {page: this.page}).then(data => {
          if (data) {
            this.totalPage = data.totalPage
            this.list = this.list.concat(data.list)
            this.$refs.scroller.reset()
            this.scrollerStatus.pullupStatus = 'default'
          }
        })
      }
    },
    mounted () {
      this.$nextTick(() => {
        this.$refs.scroller.reset()
      })
      let data = this.$route.query.data
      if (data) {
        this.userSelected = true
        this.onItemClick('user')
      } else {
        this.sysSelected = true
        this.onItemClick('system')
      }
    }
  }
</script>

<style scoped>
  .box{
    margin: 15px;
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
  }
  .item{
    width: 100%;
    height: 25rem;
    margin-bottom: 4%;
    position: relative;
    overflow: hidden;
  }
  .iframe {
    width: 100%;
    height: 25rem;
  }
  .itemDiv {
    width: 100%;
    height: 100%;
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
  }
</style>
