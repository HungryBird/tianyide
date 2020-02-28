<template>
  <div>
    <headers title="流水记录" showBack="true"></headers>
    <scroller
      ref="scroller"
      lock-x
      use-pullup
      v-model="scrollerStatus"
      :pullup-config="pullupConfig"
      @on-pullup-loading="pullupLoad">
      <div>
        <div class="color-999 row-center margin-top-50" v-if="lists.length === 0">没有相关记录~</div>
        <div class="margin-top-15" v-for="(item, i) in lists" :key="i" v-else>
          <div class="back-fff padding-l-r-15 padding-top-10">
            <div class="row-between padding-bottom-10">
              <div class="width-60">
                <p class="color-333 font15">{{item.typeName}}</p>
                <p class="font14 color-999">金额：<span :class="[item.symbol === '+'?'color-d81e06':'color-999']">{{item.symbol}} {{item.money}}元</span></p>
                <p class="color-999 font14">时间：{{api.dateFormat(item.createtime)}}</p>
              </div>
              <img src="../../../static/images/down.png" :class="['downIcon', {'up': item.isShow}]" @click="item.isShow = !item.isShow">
            </div>
            <div class="border-top-eee color-999 padding-t-b-10" v-if="item.isShow">
              <p class="font14">备注：{{item.note}}</p>
            </div>
          </div>
        </div>
      </div>
    </scroller>
  </div>
</template>

<script>
  import headers from '../components/headers.vue'
  import api from '../common/api.js'
  import { Scroller } from 'vux'
  export default {
    data () {
      return {
        api: api,
        isShow: false,
        page: 1,
        lists: [],
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
    components: { headers, Scroller },
    methods: {
      pullupLoad () {
        if (this.page < this.totalPage) {
          this.page++
          this.getList()
        }
      },
      getList () {
        api.sendReq('/customer/user/user_flowing', {page: this.page}).then(data => {
          if (data) {
            let newData = JSON.parse(JSON.stringify(data))
            newData.list.map(v => {
              v.isShow = false
            })
            this.totalPage = data.totalPage
            this.lists = this.lists.concat(newData.list)
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
      this.getList()
    }
  }
</script>

<style scoped>
  .downIcon{
    width: 1.5rem;
    height: 1.5rem;
    transition-duration: 0.5s
  }
  .up{
    transform: rotate(180deg)
  }
</style>
