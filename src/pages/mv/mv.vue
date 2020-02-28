<template>
  <div class="wrapper">
    <headers title="MV" showBack="true"></headers>
    <scroller
      ref="scroller"
      lock-x
      use-pullup
      v-model="scrollerStatus"
      :pullup-config="pullupConfig"
      @on-pullup-loading="pullupLoad">
      <div class="padding-l-r-10 padding-bottom-20">
        <div class="margin-top-10" v-for="(item, i) in lists" :key="i">
          <div class="video" @click="videoPaly(i)">
            <video
              controls
              webkit-playsinline
              playsinline="true"
              preload="none"
              :poster="videoImg"
              :src="item.path"
              style="width: 100%;" :id="'video' + i">
            </video>
            <!--<img src="../../../static/images/video.png" class="videoImg" v-if="item.isVideoIcon">-->
          </div>
          <div class="column margin-top-5">
            <span class="font15 color-333">{{item.title}}</span>
            <span class="font14 color-999">{{item.note}}</span>
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
        },
        index: 0,
        videoImg: 'static/images/payImg.jpg'
      }
    },
    components: { headers, Scroller },
    methods: {
      pullupLoad () {
        if (this.page < this.totalPage) {
          this.page++
          this.getVideoList()
        }
      },
      getVideoList () {
        api.sendReq('/customer/video_mv', {page: this.page}).then(data => {
          if (data) {
            let newData = JSON.parse(JSON.stringify(data))
            if (newData.totalCount > 0) {
              newData.list.map(v => {
                v.isVideoIcon = true
                v.path = api.basePath + v.path
              })
            }
            this.totalPage = data.totalPage
            this.lists = this.lists.concat(newData.list)
            this.$refs.scroller.reset()
            this.scrollerStatus.pullupStatus = 'default'
          }
        })
      },
      videoPaly (index) {
        this.index = index
        let video = document.getElementById(`video${index}`)
        if (this.lists[index].isVideoIcon) {
          this.lists[index].isVideoIcon = false
          video.play()
        } else {
          this.lists[index].isVideoIcon = true
          video.pause()
        }
      }
    },
    mounted () {
      this.getVideoList()
      this.$nextTick(() => {
        this.$refs.scroller.reset()
      })
      let that = this
      let video = document.getElementById(`video${this.index}`)
      video.addEventListener('ended', function () {
        that.lists[that.index].isVideoIcon = true
        video.load()
      })
    },
    watch: {
      index (val) {
        let that = this
        let video = document.getElementById(`video${val}`)
        video.addEventListener('ended', function () {
          that.lists[val].isVideoIcon = true
          video.load()
        })
      }
    }
  }
</script>

<style scoped>
  .wrapper{
    position: absolute;
    background-color: white;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
  }
  .video{
    width: 100%;
    height: 200px;
    overflow: hidden;
    border-radius: 10px;
    position: relative;
  }
  .videoImg {
    width: 50px;
    height: 50px;
    position: absolute;
    top: 50%;
    margin-top: -25px;
    left: 50%;
    margin-left: -25px;
  }
</style>
