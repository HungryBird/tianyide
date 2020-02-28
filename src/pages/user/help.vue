<template>
  <div>
    <headers :showBack="true" title="帮助"></headers>
    <scroller
      ref="scroller"
      lock-x
      use-pullup
      v-model="scrollerStatus"
      :pullup-config="pullupConfig"
      @on-pullup-loading="pullupLoad">
      <div>
        <group>
          <cell :title="item.title" v-for="(item, i) in lists" :key="i" is-link @click.native="goDetails(item)"></cell>
        </group>
      </div>
    </scroller>
  </div>
</template>

<script>
  import headers from '../components/headers.vue'
  import api from '../common/api.js'
  import { Group, Cell, Scroller } from 'vux'
  export default {
    data () {
      return {
        tabActive: 0,
        text: '',
        phone: '',
        lists: [],
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
    components: { headers, Group, Cell, Scroller },
    mounted () {
      this.$nextTick(() => {
        this.$refs.scroller.reset()
      })
      this.getList()
    },
    methods: {
      pullupLoad () {
        if (this.page < this.totalPage) {
          this.page++
          this.getList()
        }
      },
      getList () {
        api.sendReq('/customer/help_msg', {page: this.page}).then(data => {
          if (data) {
            this.totalPage = data.totalPage
            this.lists = this.lists.concat(data.list)
            this.$refs.scroller.reset()
            this.scrollerStatus.pullupStatus = 'default'
          }
        })
      },
      switchTabItem (index) {
        this.tabActive = index
      },
      goDetails (row) {
        this.$router.push({path: '/help/details', query: {row: row}})
      }
    }
  }
</script>

<style scoped>

</style>
