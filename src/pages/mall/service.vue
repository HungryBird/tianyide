<template>
  <div>
    <headers title="预约服务" showBack="true" fixed="true"></headers>
    <div style="height: 3rem"></div>
    <!--<group v-for="item in options" :key="item.id">-->
      <!--<cell :title="item.text"></cell>-->
      <!--<cell-form-preview :list="item.childrenFw"></cell-form-preview>-->
    <!--</group>-->

    <div class="weui-cells__title">服务流程</div>
    <div>
      <div class="xuanfu" id="moveDiv"
             @mousedown="down" @touchstart="down"
             @mousemove="move" @touchmove="move"
             @mouseup="end" @touchend="end"
             >
        <vo-basic :data="chartData" nodeContent="text"></vo-basic>
      </div>
    </div>

    <!--<group  v-for="(item, i) in options" :key="i">
      <cell :title="item.text" is-link :border-intent="false" :arrow-direction="index === i ? 'up' : 'down'" @click.native="index = i"></cell>
      <template v-if="index === i">
        <cell-form-preview :border-intent="false" :list="item.childrenFw"></cell-form-preview>
      </template>
    </group>-->
    <group  v-for="(item, i) in options" :key="i">
      <cell :title="item.text" is-link :arrow-direction="'up'" @click.native="menuIdFlag('menuId_'+i)"></cell>
      <div :id="'menuId_'+i" style="display: none;">
        <template>
          <cell-form-preview :list="item.childrenFw"></cell-form-preview>
        </template>
      </div>
    </group>

    <div style="height: 5rem"></div>

    <div class="fixed">
      <!--<div class="row-end padding-l-r-15 padding-t-b-5 back-fff">-->
        <!--<span class="color-333 margin-top-5">小计￥</span>-->
        <!--<span class="color-d81e06 font24">{{price}}</span>-->
      <!--</div>-->
      <div class="btnFix">
        <div class="width-50 back-fff text-center">
          <span class="color-333 font14">小计￥</span>
          <span class="color-d81e06 font20">{{parseFloat(price).toFixed(2)}}</span>
        </div>
        <div class="width-50 color-fff text-center" @click="showHideOnBlur = !showHideOnBlur">预约服务</div>
      </div>
    </div>

    <x-dialog v-model="showHideOnBlur" class="dialog-demo" hide-on-blur>
      <div class="padding-t-b-10 padding-l-r-10">
        <group title="请填写您的信息" label-width="3.5em" label-margin-right="1em">
          <x-input title="姓名" v-model="name"></x-input>
          <x-input title="手机号" v-model="phone"></x-input>
        </group>
        <x-button class="margin-top-10" :gradients="['#ffac38', '#ffac38']" @click.native="pay">支付</x-button>
      </div>
    </x-dialog>
  </div>
</template>

<script>
  import headers from '../components/headers.vue'
  import api from '../common/api.js'
  import { CellFormPreview, Group, Cell, XDialog, XInput, XButton } from 'vux'
  import { VoBasic } from 'vue-orgchart'
  export default {
    data () {
      return {
        showHideOnBlur: false,
        name: '',
        phone: '',
        index: 0,
        chartData: {},
        options: [],
        price: 0,
        flags: false,
        position: { x: 0, y: 0 },
        nx: '',
        ny: '',
        dx: '',
        dy: '',
        xPum: '',
        yPum: ''
      }
    },
    components: { headers, CellFormPreview, Group, Cell, VoBasic, XDialog, XInput, XButton },
    created () {
      api.sendReq('/customer/service', null).then(data => {
        if (data) {
          this.chartData = data.liucheng
          this.price = data.jiage.name
          let newData = JSON.parse(JSON.stringify(data.fuwu))
          newData.map(v => {
            v.childrenFw.map(k => {
              k.label = k.text
              k.value = parseFloat(k.name).toFixed(2)
            })
          })
          this.options = newData
        }
      })
    },
    methods: {
      menuIdFlag (id) {
        if (document.getElementById(id).style.display === 'none') {
          document.getElementById(id).style = 'display: block;'
        } else {
          document.getElementById(id).style = 'display: none;'
        }
      },
      pay () {
        let params = {
          name: this.name,
          phone: this.phone,
          userIp: api.getCookie('userIp')
        }
        api.sendReq('/customer/user/purchase_service', params, 'POST', true).then(data => {
          if (data) {
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
                document.addEventListener('WeixinJSBridgeReady', api.onBridgeReady('/service/order', doc), false)
              } else if (document.attachEvent) {
                document.attachEvent('WeixinJSBridgeReady', api.onBridgeReady('/service/order', doc))
                document.attachEvent('onWeixinJSBridgeReady', api.onBridgeReady('/service/order', doc))
              }
            } else {
              api.onBridgeReady('/service/order', doc)
            }
          }
        })
      },
      down () {
        let moveDiv = document.getElementById('moveDiv')
        this.flags = true
        let touch
        if (event.touches) {
          touch = event.touches[0]
        } else {
          touch = event
        }
        this.position.x = touch.clientX
        // this.position.y = touch.clientY
        this.dx = moveDiv.offsetLeft
        // this.dy = moveDiv.offsetTop
      },
      move () {
        let moveDiv = document.getElementById('moveDiv')
        if (this.flags) {
          let touch
          if (event.touches) {
            touch = event.touches[0]
          } else {
            touch = event
          }
          this.nx = touch.clientX - this.position.x
          // this.ny = touch.clientY - this.position.y
          this.xPum = this.dx + this.nx
          // this.yPum = this.dy + this.ny
          moveDiv.style.cssText = 'margin-left: ' + this.xPum + 'px;'
          // moveDiv.style.left = this.xPum + 'px'
          // moveDiv.style.top = this.yPum + 'px'
          document.addEventListener('touchmove', function () {
            event.preventDefault()
          }, false)
        }
      },
      end () {
        this.flags = false
      }
    }
  }
</script>

<style scoped>
  .xuanfu {
    /*position: fixed;*/
  }
  .orgchart .node .content {
    width: 100%;
    height: auto;
    font-size: 11px;
    line-height: 18px;
    border: 1px solid #42b983;
    border-radius: 0 0 4px 4px;
    text-align: center;
    background-color: #fff;
    color: #333;
    overflow: hidden;
    text-overflow: ellipsis;
  /* white-space: nowrap; */
    word-wrap: break-word;
    word-break: normal;
  }
  .orgchart .node .title {
    text-align: center;
    font-size: 12px;
    font-weight: 300;
    height: auto;
    line-height: 20px;
    overflow: hidden;
    text-overflow: ellipsis;
    /* white-space: nowrap; */
    background-color: #42b983;
    color: #fff;
    border-radius: 4px 4px 0 0;
    word-wrap: break-word;
    word-break: normal;
  }
  .fixed{
    width: 100%;
    position: fixed;
    bottom: 0;
    left: 0;
  }
  .btnFix{
    height: 3rem;
    line-height: 3rem;
    background: #d81e06;
    display: flex;
    justify-content: flex-start;
  }
</style>
