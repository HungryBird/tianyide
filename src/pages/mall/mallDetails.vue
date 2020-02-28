<template>
  <div>
    <headers title="商品详情" showBack="true" fixed="true"></headers>
    <div style="height: 3rem;"></div>
    <swiper :list="swiperList"></swiper>
    <div class="padding-l-r-15 padding-t-b-10 back-fff">
      <div class="row-between margin-bottom-5" style="align-items: flex-start">
        <h3 class="title">{{row.title}}</h3>
        <!--<div class="row-center column">-->
          <!--<img src="../../assets/images/shopping.png" class="shareIcon">-->
          <!--<span class="font12 color-999">分享</span>-->
        <!--</div>-->
      </div>
      <span class="color-d81e06 font20">￥{{row.price}}</span>
    </div>
    <div class="back-fff margin-top-10" style="margin-bottom: 3rem">
      <div class="border-bottom-eee padding-t-b-15 text-center color-333">商品详情</div>
      <div class="padding-t-b-15 padding-l-r-10" v-html="row.text"></div>
    </div>
    <div class="fixed" @click="showHideOnBlur = !showHideOnBlur">立即购买</div>

    <x-dialog v-model="showHideOnBlur" class="dialog-demo" hide-on-blur>
      <div class="padding-l-r-10 padding-t-b-10">
        <div class="row-center" v-if="addressList.length === 0" @click="$router.push('/address/details')">
          <p class="color-999">未添加收货地址! <span class="color-ffac38">去添加</span></p>
        </div>
        <div v-else>
          <div class="row-state border-bottom-eee padding-t-b-10" v-for="(item, index) in addressList" :key="index" @click="select(index)">
            <check-icon :value.sync="item.selected"></check-icon>
            <div class="column margin-left-10">
              <span class="color-333 font15">{{item.name}}</span>
              <span class="color-999 font14">{{item.address}}</span>
            </div>
          </div>
          <x-button class="margin-top-10" :gradients="['#ffac38', '#ffac38']" @click.native="pay">支付</x-button>
        </div>
      </div>
    </x-dialog>
  </div>
</template>

<script>
  import headers from '../components/headers.vue'
  import api from '../common/api'
  import { Swiper, XDialog, CheckIcon, XButton } from 'vux'
  export default {
    data () {
      return {
        showHideOnBlur: false,
        addressList: [],
        swiperList: [],
        row: ''
      }
    },
    components: { headers, Swiper, XDialog, CheckIcon, XButton },
    methods: {
      select (index) {
        this.addressList[index].selected = !this.addressList[index].selected
      },
      pay () {
        let addressId = ''
        this.addressList.map(v => {
          if (v.selected) {
            addressId = v.id
          }
        })
        let params = {
          commodityId: this.row.id,
          addressId: addressId,
          userIp: api.getCookie('userIp')
        }
        api.sendReq('/customer/user/purchase_commodity', params, 'POST', true).then(data => {
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
                document.addEventListener('WeixinJSBridgeReady', api.onBridgeReady('/commodity/order', doc), false)
              } else if (document.attachEvent) {
                document.attachEvent('WeixinJSBridgeReady', api.onBridgeReady('/commodity/order', doc))
                document.attachEvent('onWeixinJSBridgeReady', api.onBridgeReady('/commodity/order', doc))
              }
            } else {
              api.onBridgeReady('/commodity/order', doc)
            }
          }
        })
      }
    },
    mounted () {
      api.sendReq('/customer/user/commodity_address', null).then(data => {
        if (data) {
          let newData = JSON.parse(JSON.stringify(data))
          newData.map(v => {
            v.selected = false
          })
          this.addressList = newData
        }
      })
      this.row = JSON.parse(api.getCookie('mallInfo'))
      if (this.row.secondImages) {
        let imgList = this.row.secondImages.split(',')
        imgList.map(v => {
          this.swiperList.push({img: api.basePath + v})
        })
      }
      let note = this.row.text
      if (note.includes('src')) {
        let img = new RegExp('src="', 'g')
        note = this.row.text.replace(img, 'src="' + api.basePath)
      }
      this.row.text = note
    }
  }
</script>

<style scoped>
  .title{
    /*width: 90%;*/
    font-weight: normal;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    overflow: hidden;
  }
  .shareIcon {
    width: 1.5rem;
    height: 1.5rem;
    margin-bottom: 5px;
  }
  .fixed {
    width: 100%;
    position: fixed;
    bottom: 0;
    left: 0;
    background: #ffac38;
    color: white;
    text-align: center;
    height: 3rem;
    line-height: 3rem;
  }
</style>
