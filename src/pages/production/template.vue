<template>
  <div>
    <headers title="模板" showBack="true" fixed="true" v-if="type !== 'share'"></headers>

    <!--<div :style="{height: (iframeHeight-44) + 'px', width: '100%', position: 'relative'}">-->
      <!--<div class="fixIcon" @click="toggleIframe('up')" v-if="iframeIconShow && type === 'user'"><img src="../../../static/images/downIcon.png"></div>-->
      <!--<div class="fixIcon" @click="toggleIframe('down')" v-if="iframeIconShow && type === 'user'" style="top: inherit; bottom: 10%"><img src="../../../static/images/upIcon.png" ></div>-->
      <!--<div class="iframeZZ" v-if="type !== 'user'" id="iframe"></div>-->

    <iframe :src="iframeSrc" class="iframe" id="iframe" :style="{height: (iframeHeight-44) + 'px'}"></iframe>

      <!--<iframe :src="api.basePath + item" class="iframe" :style="{height: iframeHeight + 'px'}" v-for="(item, index) in dataInfo.moduleList" :key="item.id" v-if="iframeIndex === index"></iframe>-->
    <!--</div>-->

    <img src="../../../static/images/music.png" id="musicIcon" :class="{go: rotate}" :style="{top: type === 'share'?'10px':'55px'}" @click="stopPlay">
    <audio :src="api.basePath + musicPath" loop="loop" id="music"></audio>

    <!-- 选择公共模板的时候 -->
    <div v-if="type === 'system'" class="systemFixed" @click="makeNow">立即制作</div>

    <!-- 选择自己的模板的时候 -->
    <div v-if="type === 'user'" class="userFixed">
      <div class="row-state width-60">
        <div class="column row-center width-33" @click="delTemplate">
          <img src="../../../static/images/del.png" class="bomIcon">
          <p class="color-515151 font14">删除</p>
        </div>
        <div class="column row-center width-33" @click="musicShow = true">
          <img src="../../../static/images/note.png" class="bomIcon">
          <span class="color-515151 font14">音乐</span>
        </div>
        <div class="column row-center width-33" @click="preview">
          <img src="../../../static/images/preview.png" class="bomIcon">
          <span class="color-515151 font14">分享</span>
        </div>
      </div>
      <div class="back-d81e06 color-fff width-40 row-center" @click="saveTemplate">保存</div>
    </div>

    <!-- 分享模板 -->
    <div v-if="type === 'share'">
      <!-- 奠金/礼物信息滚动 -->
      <div class="fixedLeft top">
        <ul class="con" :class="{anim: animate === true}">
          <li v-for='item in giftsList' v-html="item"></li>
        </ul>
      </div>
      <!-- 评论信息滚动 -->
      <div class="fixedLeft">
        <ul class="con" :class="{anim: animate === true}">
          <li v-for='item in commentList' v-html="item"></li>
        </ul>
      </div>
      <!-- 右边按钮 -->
      <div class="fixedRight">
        <div class="imgBox" @click="showToast = !showToast"><img src="../../../static/images/logo.png" class="icon"></div>
        <div class="imgBox margin-top-5" @click="$vux.toast.text('点击右上角分享')"><img src="../../../static/images/share.png" class="icon"></div>
        <div class="imgBox margin-t-b-5" @click="showModal('money')"><img src="../../../static/images/moneyIcon.png" class="icon"></div>
        <div class="imgBox margin-t-b-5" @click="showModal('invite')"><img src="../../../static/images/invite.png" class="icon"></div>
        <div class="imgBox margin-t-b-5" @click="gifShow = !gifShow"><img src="../../../static/images/gif.png" class="icon"></div>
        <div class="imgBox" @click="$router.push('/user')"><img src="../../../static/images/share_user.png" class="icon"></div>
      </div>
      <!-- 二维码弹框 -->
      <x-dialog v-model="showToast" class="dialog-demo" hide-on-blur>
        <div style="padding:15px;">
          <qrcode value="https://vux.li?x-page=demo_qrcode" type="img"></qrcode>
        </div>
      </x-dialog>
      <!-- 底部发表评论 -->
      <div class="fixed">
        <div class="row-between padding-t-b-5 padding-l-r-10">
          <input type="text" class="input" placeholder="发表评论..." v-model="comment">
          <div class="width-40 row-between">
            <span class="bomBtn" @click="expressionShow = !expressionShow">表情</span>
            <span class="bomBtn" @click="send">发送</span>
          </div>
        </div>
        <!-- 表情弹框 -->
        <div class="row-center" v-if="expressionShow">
          <div class="row">
            <img :src="'static/images/wechatIcon/' + i + '.gif'" v-for="(n, i) in 104" :key="i" class="margin-l-r-5" @click="selectEmotion(i)">
          </div>
        </div>
        <!-- 礼物展示 -->
        <div class="giftShowBox">
          <img :src="item.path" v-for="(item, i) in imgs" :key="i" v-if="giftsCode === item.code && giftAnimer" class="giftImg">
        </div>
      </div>
    </div>

    <!-- 奠金/邀约 弹框 -->
    <popup v-model="popupShow" is-transparent>
      <div class="popupBj">
        <group v-if="popupType === 'money'">
          <x-input title="宾客姓名" placeholder="宾客姓名" v-model="moneyForm.name"></x-input>
          <x-input title="奠金金额" type="number" placeholder="奠金金额" v-model="moneyForm.money"></x-input>
          <x-textarea title="缅怀留言" placeholder="缅怀留言" v-model="moneyForm.note"></x-textarea>
        </group>
        <group v-else>
          <x-input title="宾客姓名" placeholder="宾客姓名" v-model="toinviteForm.name"></x-input>
          <x-input title="联系电话" type="tel" placeholder="联系电话" v-model="toinviteForm.phone"></x-input>
          <x-input title="赴邀人数" type="number" placeholder="赴邀人数" v-model="toinviteForm.number"></x-input>
        </group>
        <div style="padding:20px 15px;">
          <x-button type="default" :gradients="['#ffac38', '#ffac38']" @click.native="submitSave">确定</x-button>
          <x-button @click.native="popupShow = false">取消</x-button>
        </div>
      </div>
    </popup>
    <!-- 礼物弹框 -->
    <popup v-model="gifShow" is-transparent>
      <div class="gifBox">
        <img :src="item.path" class="gifIcon" v-for="(item, i) in imgs" :key="i" @click="gifSelect(item.code, item.name)">
      </div>
    </popup>
    <!-- 音乐列表弹框 -->
    <popup v-model="musicShow" position="bottom" height="70%" should-scroll-top-on-show>
      <group>
        <radio title="title" :options="musicOptions" v-model="musicValue"></radio>
      </group>
      <div style="padding: 15px;">
        <x-button @click.native="selectMusic" plain type="primary">保存</x-button>
      </div>
    </popup>
    <!-- 分享弹框 -->
    <popup v-model="shareShow" height="220px" is-transparent>
      <div style="width: 95%;background-color:#fff;height:200px;margin:0 auto;border-radius:5px;padding-top:10px;">
        <group>
          <x-input title="标题" v-model="shareTitle"></x-input>
          <x-input title="描述" v-model="shareDest"></x-input>
        </group>
        <div style="padding:20px 15px;">
          <x-button @click.native="sendShare">分享</x-button>
        </div>
      </div>
    </popup>
  </div>
</template>

<script>
  import headers from '../components/headers.vue'
  import { XButton, Popup, Group, XInput, XTextarea, Radio, XDialog, Qrcode } from 'vux'
  import api from '../common/api.js'

  let wx = require('weixin-js-sdk')
  let timer1 = null
  let timer2 = null

  export default {
    data () {
      return {
        api: api,
        type: this.$route.query.type,
        id: '',
        showToast: false,
        iframeIconShow: true,
        show: false,
        popupShow: false,
        expressionShow: false,
        gifShow: false,
        giftAnimer: false,
        giftsCode: '',
        shareShow: false,
        shareTitle: '',
        shareDest: '',
        musicShow: false,
        musicPath: '',
        musicValue: '',
        musicPage: 1,
        musicOptions: [],
        popupType: '',
        swiperOption: {
          loop: false,
          direction: 'vertical',
          initialSlide: 0,
          autoHeight: true,
          height: window.innerHeight,
          mousewheel: true,
          mousewheelControl: true
        },
        iframeHeight: 0,
        left_slide_count: 0,
        right_slide_count: 0,
        animate: false,
        rotate: true,
        commentList: [],
        giftsList: [],
        comment: '',
        imgs: [
          {name: '豪车', code: 'vehicle', path: 'static/images/vehicle.png'},
          {name: '蜡烛', code: 'candle', path: 'static/images/candle.png'},
          {name: '别墅', code: 'house', path: 'static/images/house.png'},
          {name: '鲜花', code: 'flower', path: 'static/images/flower.png'},
          {name: '纸马', code: 'horse', path: 'static/images/horse.jpg'},
          {name: '纸钱', code: 'money', path: 'static/images/money.png'}
        ],
        dataInfo: {
          moduleList: []
        },
        iframeSrc: '',
        iframeIndex: 0,
        moneyForm: {
          userIp: api.getCookie('userIp')
        },
        toinviteForm: {}
      }
    },
    components: { headers, XButton, Popup, Group, XInput, XTextarea, Radio, XDialog, Qrcode },
    methods: {
      toggleIframe (type) {
        let that = this
        if (type === 'up') {
          if (that.iframeIndex === that.dataInfo.moduleList.length - 1) return
          that.iframeIndex++
        } else {
          if (that.iframeIndex === 0) return
          that.iframeIndex--
        }
      },
      swiperIframe () {
        let that = this
        let isFlag = false
        let startX, endX, distanceX, startY, endY, distanceY
        let iframe = document.getElementById(`iframe`)
        iframe.addEventListener('touchstart', function (e) {
          console.log(e)
          isFlag = true
          startX = e.targetTouches[0].pageX
          startY = e.targetTouches[0].pageY
        })
        iframe.addEventListener('touchmove', function (e) {
          endX = e.targetTouches[0].pageX
          endY = e.targetTouches[0].pageY
          distanceX = endX - startX
          distanceY = endY - startY
          console.log(distanceX, isFlag, distanceY)
          // if (Math.abs(distanceX) > Math.abs(distanceY) && distanceX > (document.body.clientWidth / COUNT_LIMIT)) { // 向右滑动
          if (distanceY >= 60 && isFlag) { // 向下滑动
            isFlag = false
            if (that.iframeIndex === 0) return
            that.iframeIndex--
            // that.iframeSrc = that.dataInfo.moduleList[that.iframeIndex]
          } else if (distanceY <= -60 && isFlag) { // 向上滑动
            isFlag = false
            if (that.iframeIndex === that.dataInfo.moduleList.length - 1) return
            that.iframeIndex++
            // that.iframeSrc = that.dataInfo.moduleList[that.iframeIndex]
          } else {
            // console.log('点击未滑动')
          }
        })
      },
      scroll () {
        this.animate = true
        setTimeout(() => {
          if (this.commentList.length === 0) return
          this.commentList.push(this.commentList[0])
          this.commentList.shift()
          if (this.giftsList.length === 0) return
          this.giftsList.push(this.giftsList[0])
          this.giftsList.shift()
          this.animate = false
        }, 500)
      },
      showModal (type) {
        this.popupType = type
        this.popupShow = true
      },
      stopPlay () {
        this.rotate = !this.rotate
        let music = document.getElementById('music')
        if (this.rotate) {
          music.play()
        } else {
          music.pause()
        }
      },
      selectEmotion (index) {
        this.comment = this.comment + `[${index}]`
      },
      /* 公共调用支付 */
      pay (data, callback) {
        let doc = {
          appId: data.appId,
          timeStamp: data.timeStamp,
          nonceStr: data.nonceStr,
          package: data.package,
          signType: data.signType,
          paySign: data.paySign
        }
        if (typeof WeixinJSBridge === 'undefined') {
          if (document.addEventListener) {
            document.addEventListener('WeixinJSBridgeReady', api.onBridgeReady(null, doc, callback), false)
          } else if (document.attachEvent) {
            document.attachEvent('WeixinJSBridgeReady', api.onBridgeReady(null, doc, callback))
            document.attachEvent('onWeixinJSBridgeReady', api.onBridgeReady(null, doc, callback))
          }
        } else {
          api.onBridgeReady(null, doc, callback)
        }
      },
      /* 删除模板 */
      delTemplate () {
        let _this = this
        this.$vux.confirm.show({
          title: '你确定要删除该模板吗？',
          content: '已发出的模板会被同步删除',
          onCancel () {
            _this.$vux.confirm.hide()
          },
          onConfirm () {
            api.sendReq(`/customer/user/delete_modul?id=${_this.id}`, null, 'POST').then(data => {
              if (data) {
                _this.$vux.toast.text('删除成功')
                _this.$router.go(-1)
              }
            })
          }
        })
      },
      /* 获取模板音乐列表 */
      getMusicList () {
        api.sendReq('/customer/user/modul_musics', {page: this.musicPage}).then(data => {
          if (data) {
            let newData = JSON.parse(JSON.stringify(data))
            newData.list.map(v => {
              v.key = v.id
              v.value = v.name
            })
            this.musicOptions = newData.list
          }
        })
      },
      /* 修改音乐 */
      selectMusic () {
        let music = document.getElementById('music')
        let params = {
          modulId: this.id,
          musicId: this.musicValue
        }
        api.sendReq('/customer/user/update_modul_music', params, 'POST').then(data => {
          if (data) {
            this.musicShow = !this.musicShow
            this.$vux.toast.text('修改成功')
            music.pause()
            this.musicOptions.map(v => {
              if (v.id === this.musicValue) {
                this.musicPath = v.path
                music.play()
              }
            })
          }
        })
      },
      /* 预览 */
      preview () {
        let url = encodeURIComponent(`http://tianyinde.com/web/index.html#/template?id=${this.id}&type=share`)
        window.location.href = `http://tianyinde.com/customer/share_callback?url=${url}`
      },
      /* 保存模板 */
      saveTemplate () {
        // document.getElementById('iframe').contentWindow.backToPateOneSwiper()
        let modulHtml = document.getElementById('iframe').contentWindow.document.body.innerHTML
        this.$vux.loading.show({
          text: 'Loading...'
        })
        let _this = this
        let formData = new FormData()
        formData.append('mainModulId', this.id)
        formData.append('modulBodyHtml', modulHtml)
        let xhr = new XMLHttpRequest()
        xhr.open('post', `${api.basePath}/customer/user/save_information_modul`)
        xhr.send(formData)
        xhr.onreadystatechange = function () {
          _this.$vux.loading.hide()
          if (xhr.readyState === 4 && xhr.status === 200) {
            let res = JSON.parse(xhr.response)
            if (res.code === 0) {
              _this.$vux.toast.text('保存成功')
            } else {
              _this.$vux.toast.text(res.msg || '请求失败')
            }
          }
        }
      },
      /* 分享 */
      sendShare () {
        // if (!this.shareTitle) {
        //   return this.$vux.toast.text('请输入分享标题')
        // }
        // if (!this.shareDest) {
        //   return this.$vux.toast.text('请输入分享描述')
        // }
        let _this = this
        let url = encodeURIComponent(window.location.href)
        api.sendReq('/customer/wxshare?url=' + url, null, 'POST').then(data => {
          _this.shareShow = false
          if (data) {
            wx.config({
              debug: true,
              appId: data.appid,
              timestamp: data.timestamp,
              nonceStr: data.noncestr,
              signature: data.signature,
              jsApiList: ['onMenuShareAppMessage', 'onMenuShareTimeline']
            })
            wx.ready(function () {
              wx.checkJsApi({
                jsApiList: ['showMenuItems'],
                success: function (res) {
                  wx.showMenuItems({
                    menuList: [
                      'menuItem:share:appMessage', // 发送给朋友
                      'menuItem:share:timeline' // 分享到朋友圈
                    ]
                  })
                }
              })
              // 自定义“分享给朋友”及“分享到QQ”按钮的分享内容
              wx.updateAppMessageShareData({
                title: _this.shareTitle, // 分享标题
                desc: _this.shareDest, // 分享描述
                link: url, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
                imgUrl: 'http://tianyinde.com/statics/images/tyd_logo.png', // 分享图标
                success: function () {
                }
              })
              // 自定义“分享到朋友圈”及“分享到QQ空间”按钮的分享内容
              wx.updateTimelineShareData({
                title: _this.shareTitle, // 分享标题
                desc: _this.shareDest, // 分享描述
                link: url, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
                imgUrl: 'http://tianyinde.com/statics/images/tyd_logo.png', // 分享图标
                success: function () {
                }
              })
            })
          }
        })
      },
      /* 选择礼物支付 */
      gifSelect (code, name) {
        let _this = this
        this.giftsCode = code
        this.gifShow = false
        let parmas = {
          modulId: this.id,
          giftCode: code,
          userIp: api.getCookie('userIp')
        }
        api.sendReq('/customer/user/purchase_giftservice', parmas, 'POST', 'true').then(data => {
          if (data) {
            this.gifShow = false
            this.pay(data, (e) => {
              if (e === '支付成功') {
                _this.giftAnimer = true
                _this.giftsList.push(`我 : 奠礼 ${name}`)
                setTimeout(() => {
                  _this.giftAnimer = false  // 展示礼物动画结束1秒后关闭
                }, 5000)
              }
            })
          }
        })
      },
      /* 发表评论 */
      send () {
        if (!this.comment) return
        this.expressionShow = false
        this.comment = this.comment.replace(new RegExp('\\[', 'g'), '<span>').replace(new RegExp(']', 'g'), '</span>')
        let params = {
          modulId: this.id,
          text: this.comment
        }
        api.sendReq('/customer/user/comment_modul', params, 'POST').then(data => {
          if (data) {
            this.$vux.toast.text('发表成功')
            let comment = this.comment
            let str = comment.replace(new RegExp('<span>', 'g'), '<img src=\'static/images/wechatIcon/').replace(new RegExp('</span>', 'g'), '.gif\'>')
            str = '我 : ' + str
            this.commentList.push(str)
            this.comment = ''
          }
        })
      },
      /* 获取评论列表 */
      getCommentList () {
        api.sendReq('/customer/share_modul_comment', {modulId: this.id}, 'GET', false, false).then(data => {
          if (data) {
            let newData = []
            data.map(v => {
              if (v.includes('<span>')) {
                let newV = v.replace(new RegExp('<span>', 'g'), '<img src=\'static/images/wechatIcon/').replace(new RegExp('</span>', 'g'), '.gif\'>')
                v = newV
              }
              newData.push(v)
            })
            this.commentList = newData
          }
        })
      },
      /* 获取奠金、礼物滚动列表 */
      getGiftsList () {
        api.sendReq('/customer/share_modul_moneyandgift', {modulId: this.id}, 'GET', false, false).then(data => {
          if (data) {
            this.giftsList = data
          }
        })
      },
      /* 获取礼物展示 */
      getGiftShow () {
        api.sendReq('/customer/share_modul_giftcode', {modulId: this.id}, 'GET', false, false).then(data => {
          if (data) {
            this.giftsCode = data
          }
        })
      },
      /* 赴邀/奠金 */
      submitSave () {
        let _this = this
        let url = '/customer/user/toinvite_modul'
        let type = ''
        let params = this.toinviteForm
        if (this.popupType === 'money') {
          url = '/customer/user/purchase_cashmoney'
          type = 'money'
          params = this.moneyForm
        }
        params.modulId = this.id
        api.sendReq(url, params, 'POST', true).then(data => {
          if (data) {
            this.popupShow = false
            if (type === 'money') {
              this.pay(data, (e) => {
                if (e === '支付成功') {
                  _this.giftsList.push(`${params.name} : 奠礼 ￥${params.money}元`)
                }
              })
              this.moneyForm = {}
            } else {
              this.$vux.toast.text('操作成功')
              this.toinviteForm = {}
            }
          }
        })
      },
      /* 立即制作 */
      makeNow () {
        api.sendReq('/customer/user/select_modul', {id: this.id}, 'POST').then(data => {
          if (data) {
            this.type = 'user'
            this.id = data.modulId
            this.iframeSrc = this.iframeSrc + `&status=1`
            this.getMusicList()
          }
        })
      },
      /* 获取主模板下面所有的模板信息 */
      getTemplate () {
        let id = this.$route.query.id
        console.log(this.$route.query.id)
        if (id) {
          this.id = id
          api.sendReq('/customer/share_modul_all_info', {id: this.id}).then(data => {
            if (data) {
              this.dataInfo = data
              this.id = data.id
              this.iframeSrc = api.basePath + data.modulNameAndId + `?timestamp_=${Date.parse(new Date())}`
              this.musicValue = data.musicId
              this.musicPath = data.musicPath
            }
          })
        }
        if (this.$route.query.row) {
          let row = this.$route.query.row
          this.dataInfo = row
          this.id = row.id
          this.iframeSrc = api.basePath + row.modulNameAndId + `?timestamp_=${Date.parse(new Date())}`
          if (this.$route.query.type === 'user') {
            this.iframeSrc = this.iframeSrc + '&status=1'
          }
          this.musicValue = row.musicId
          this.musicPath = row.musicPath
        //   let url = '/customer/system_modul_all_info'
        //   if (this.type === 'user') {
        //     url = '/customer/user/user_modul_all_info'
        //   } else if (this.type === 'share') {
        //     url = '/customer/share_modul_all_info'
        //   }
        }
      }
    },
    mounted () {
      const inputItems = document.querySelectorAll('input')
      inputItems.forEach(function (ele) {
        ele.addEventListener('blur', function () {
          window.scrollTo(0, 0)
        })
      })
      let that = this
      this.iframeHeight = window.innerHeight
      this.getTemplate()
      if (this.type === 'system') {
        window.addEventListener('message', function (event) {
          if (event.data === 'showFalse') {
            that.iframeIconShow = false
          } else {
            that.iframeIconShow = true
          }
        })
      }
      if (this.type === 'share') {
        this.getCommentList()
        this.getGiftsList()
        this.getGiftShow()
        timer1 = setInterval(() => {
          this.getCommentList()
          this.getGiftsList()
        }, 1000 * 60)
        timer2 = setInterval(() => {
          this.getGiftShow()
        }, 3000)
      }
      if (this.type === 'user') {
        this.getMusicList()
      }
      setInterval(this.scroll, 1000)
      setTimeout(() => {
        let music = document.getElementById('music')
        music.play()
      }, 1000)
    },
    destroyed () {
      clearInterval(timer1)
      clearInterval(timer2)
    }
  }
</script>
<style scoped>
  .iframeZZ {
    position: absolute;
    width: 100%;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
  }
  .fixIcon {
    width: 100%;
    position: absolute;
    display: flex;
    align-items: center;
    justify-content: center;
    left: 0;
    top: 10%;
    z-index: 9;
  }
  .fixIcon img{
    width: 3rem;
    height: 3rem;
  }
  .iframe{
    width: 100%;
    border: none;
    overflow: hidden;
  }
  #musicIcon {
    width: 30px;
    height: 30px;
    position: fixed;
    /*top: 55px;*/
    right: 10px;
    z-index: 99;
  }
  .go {
    transition-duration: 1s;
    animation: rotate 3s linear infinite;
  }
  @keyframes rotate {
    from {transform: rotate(0deg)}
    to {transform: rotate(360deg)}
  }
  .fixed {
    width: 100%;
    position: fixed;
    bottom: 0;
    left: 0;
    background-color: rgba(0, 0, 0, 0.4);
    z-index: 99;
  }
  .input {
    border: 1px solid #eee;
    border-radius: 4px;
    height: 1.5rem;
    padding-left: 10px;
    outline:none;
    color: #5d5c5c;
    width: 50%;
  }
  .bomBtn {
    width: 45%;
    height: 1.6rem;
    line-height: 1.6rem;
    text-align: center;
    background-color: #ffac38;
    color: white;
    display: inline-block;
    border-radius: 5px;
    font-size: 14px;
  }
  .fixedRight {
    position: fixed;
    bottom: 3rem;
    right: 10px;
    z-index: 99;
    display: flex;
    flex-direction: column;
  }
  .imgBox {
    width: 35px;
    height: 35px;
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .icon {
    width: 30px;
    height: 30px;
  }
  .top {
    height: 60px !important;
    top: 3.5rem;
  }
  .top .anim {
    margin-top: -30px !important;
  }
  .fixedLeft {
    width: 60%;
    height: 150px;
    overflow: hidden;
    position: fixed;
    left: 10px;
    bottom: 3rem;
    z-index: 99;
  }
  .anim{
    transition: all 0.5s;
  }
  .con li{
    list-style: none;
    line-height: 30px;
    min-height: 30px;
    max-height: 60px;
    color: #fff;
    font-size: 14px;
    background-color: rgba(0, 0, 0, .2);
  }
  .popupBj{
    width: 95%;
    background-color:#fff;
    margin:0 auto;
    border-radius:5px;
    padding-top:10px;
  }
  .row {
    height: 110px;
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: flex-start;
    background-color: #F6F6F6;
    padding: 10px 0;
    overflow-y: scroll;
  }
  .gifBox {
    background: white;
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: flex-start;
    padding: 10px 0;
  }
  .gifIcon {
    width: 50px;
    height: 50px;
    margin: 0 5px 5px;
  }
  .systemFixed {
    width: 100%;
    position: fixed;
    left: 0;
    bottom: 0;
    right: 0;
    z-index: 99999999;
    background: #ffac38;
    color: white;
    text-align: center;
    height: 2.75rem;
    line-height: 2.75rem;
  }
  .userFixed {
    width: 100%;
    position: fixed;
    display: flex;
    justify-content: flex-start;
    left: 0;
    bottom: 0;
    right: 0;
    z-index: 9;
    background: white;
    color: white;
    height: 2.75rem;
  }
  .bomIcon {
    width: 1.5rem;
    height: 1.5rem;
  }
  .giftShowBox {
    display: flex;
    justify-content: center;
    position: fixed;
    width: 100%;
    top: 50%;
    margin-top: -50px;
  }
  .giftImg {
    width: 100px;
    height: 100px;
    animation: gifAni 5s
  }
  @keyframes gifAni {
    50% {transform: scale(1.5, 1.5)}
  }
</style>
