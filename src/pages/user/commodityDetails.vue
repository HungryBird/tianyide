<template>
  <div>
    <headers title="订单详情" showBack="true"></headers>
    <div class="back-fff border-radius-10 padding-t-b-10 padding-l-r-15 row-state">
      <img src="../../../static/images/position.png" class="leftIcon">
      <div class="column">
        <div class="row-state">
          <span>{{dataInfo.name}}</span>
          <span class="color-999 font14 margin-left-5">{{dataInfo.phone}}</span>
        </div>
        <span class="address font14">{{dataInfo.addres}}</span>
      </div>
      <!--<x-icon type="ios-arrow-right" size="30"></x-icon>-->
    </div>
    <div class="margin-top-10 back-fff padding-t-b-10">
      <div class="item padding-l-r-10">
        <img :src="api.basePath + dataInfo.commodityImage" class="leftImg">
        <span class="title">{{dataInfo.commodityTitle}}</span>
        <span>￥{{parseFloat(dataInfo.commodityPrice).toFixed(2)}}</span>
      </div>
      <div class="row-between border-top-eee padding-top-10 padding-l-r-10">
        <span class="color-333 font15">实付款</span>
        <span class="color-ffac38">￥{{parseFloat(dataInfo.commodityPrice).toFixed(2)}}</span>
      </div>
    </div>
    <div class="margin-top-10 back-fff padding-t-b-10 padding-l-r-10">
      <span class="tip">物流信息</span>
      <div class="font15 margin-top-15">
        <div class="padding-left-10 margin-top-5 row-between">
          <span class="color-666 margin-right-10">快递名称：</span>
          <span class="color-666 grow">{{dataInfo.expressName}}</span>
        </div>
        <div class="padding-left-10 margin-top-5 row-between">
          <span class="color-666 margin-right-10">快递单号：</span>
          <span class="color-666 grow">{{dataInfo.expressNumber}}</span>
          <span class="color-ffac38">复制</span>
        </div>
        <div class="padding-left-10 margin-top-5 row-between">
          <span class="color-666 margin-right-10">发货时间：</span>
          <span class="color-666 grow">{{dataInfo.expressTime}}</span>
        </div>
      </div>
    </div>
    <div class="margin-top-10 back-fff padding-t-b-10 padding-l-r-10">
      <span class="tip">订单信息</span>
      <div class="font15 margin-top-15">
        <div class="padding-left-10 row-between">
          <span class="color-666 margin-right-10">订单编号：</span>
          <span class="color-666 grow">{{dataInfo.number}}</span>
          <span class="color-ffac38" @click="copy">复制</span>
        </div>
        <div class="padding-left-10 margin-top-5 row-between">
          <span class="color-666 margin-right-10">创建时间：</span>
          <span class="color-666 grow">{{api.dateFormat(dataInfo.createtime)}}</span>
        </div>
      </div>
    </div>
    <div class="fixed" v-if="dataInfo.payStatus === 0">
      <div class="row-end padding-l-r-10 padding-t-b-10">
        <span class="btn" v-if="dataInfo.payStatus === 0" @click="pay">支付</span>
        <!--<span class="btn" v-if="dataInfo.status === 1">评价</span>-->
      </div>
    </div>
  </div>
</template>

<script>
  import headers from '../components/headers.vue'
  import api from '../common/api.js'
  export default {
    data () {
      return {
        api: api,
        dataInfo: {}
      }
    },
    components: { headers },
    created () {
      api.sendReq('/customer/user/commodity_orders_id', {id: this.$route.query.id}).then(data => {
        if (data) {
          this.dataInfo = data
        }
      })
    },
    methods: {
      copy () {
        let _this = this
        this.$copyText(this.order.number).then(e => {
          _this.$vux.toast.text('复制成功')
        }, e => {
          _this.$vux.toast.text('复制失败')
        })
      },
      pay () {
        let params = {
          id: this.$route.query.id,
          userIp: api.getCookie('userIp')
        }
        api.sendReq('/customer/user/purchase_commodity_order', params, 'POST', true).then(data => {
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
    }
  }
</script>

<style scoped>
  .vux-x-icon {
    fill: #dbdbdb;
  }
  .leftIcon{
    width: 2rem;
    height: 2rem;
    margin-right: 10px;
  }
  .address{
    color: #333;
    display: inline-block;
    line-height: 18px;
  }
  .item {
    display: flex;
    justify-content: space-between;
    font-size: 15px;
    padding-bottom: 10px;
  }
  .leftImg {
    width: 6.25rem;
    height: 6.25rem;
  }
  .title {
    flex-grow: 1;
    width: 40%;
    height: 50px;
    margin: 0 10px;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
  }
  .tip {
    border-left: 2px solid #ffac38;
    padding-left: 5px;
    color: #333;
    font-size: 0.9375rem;
  }
  .fixed {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    background: white;
    width: 100%;
    border-top: 1px solid #eee;
  }
  .btn {
    border: 1px solid #ffac38;
    border-radius: 20px;
    padding: 3px 25px;
    color: #ffac38;
    font-size: 0.875rem;
    margin-left: 10px;
  }
</style>
