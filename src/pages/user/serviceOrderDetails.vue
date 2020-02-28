<template>
  <div>
    <headers title="服务详情" showBack="true"></headers>
    <scroller
      ref="scroller"
      lock-x
      height="-100"
      use-pulldown
      :pulldown-config="pulldownConfig"
      @on-pulldown-loading="pulldownLoad">
      <div>
        <!-- 业务员信息 -->
        <div class="padding-l-r-15 padding-t-b-20 back-fff" v-if="salesman.status">
          <div class="row-between padding-bottom-10">
            <img :src="api.basePath + salesman.data.portraitUrl" class="headImg"/>
            <div class="grow margin-left-20">
              <p class="font18">{{salesman.data.name}}</p>
              <p>{{salesman.data.phone}}</p>
            </div>
            <a :href="'tel:' + salesman.data.phone"><img src="../../../static/images/phone.png" class="phoneIcon"></a>
          </div>
          <div class="border-top-eee padding-t-b-10" v-if="order.score || order.evaluate">
            <rater v-model="order.score" active-color="#ffac38" :font-size="15" disabled></rater>
            <span class="color-999 font14 margin-top-5">评价：{{order.evaluate}}</span>
          </div>
        </div>

        <!-- 服务信息 -->
        <!--<group v-if="order.serviceStatus === 0" v-for="item in service" :key="item.id">
          <cell :title="item.text"></cell>
          <cell-form-preview :list="item.childrenFw"></cell-form-preview>
        </group>-->
        <group v-if="order.serviceStatus === 1">
          <cell title="服务套餐信息"></cell>
          <cell-form-preview :list="service" style="display: none;"></cell-form-preview>

          <div class="weui-cell vux-cell-form-preview">
            <div class="weui-form-preview__bd">
              <div class="weui-form-preview__item" v-for="(item, index) in service" :key="'s' + index">
                <label class="weui-form-preview__label">{{item.onePrice}}/{{item.name}}</label>
                <span class="weui-form-preview__value">{{item.size}}/{{item.price}}</span>
              </div>
            </div>
          </div>

        </group>
        <div class="back-fff padding-l-r-15 padding-t-b-5 margin-top-10">
          <div class="row-end" v-if="order.price">
            <!-- <span class="color-999 font14" v-if="order.price < historyPrice">原价:</span>
            <span class="color-d81e06 font18" style="color: #877978;font-size: 1rem;" v-if="order.price < historyPrice">￥{{historyPrice}} &nbsp;&nbsp;</span> -->
            <span class="color-999 font14">现价:</span>
            <span class="color-d81e06 font18">￥{{order.price}}</span>
            <span class="color-999 font14">已支付:</span>
            <span class="color-d81e06 font18">￥{{order.deposit}}</span>
            <span class="color-999 font14">未支付:</span>
            <span class="color-d81e06 font18">￥{{order.balancePayment}}</span>
          </div>
          <!-- <button>支付定金</button> -->
          <div class="row-end color-999 font14">
            <span>备注：{{order.note ? order.note : '无'}}</span>
          </div>
        </div>

        <!-- 订单信息 -->
        <div class="margin-top-10 back-fff padding-t-b-10 padding-l-r-15" style="margin-bottom: 60px">
          <div class="row-state">
            <img src="../../../static/images/order.png" class="icon">
            <span class="color-333">订单详情</span>
          </div>
          <div class="margin-top-15">
            <div>
              <span class="leftSpan">下单用户</span>
              <span class="color-999">{{order.name}}</span>
            </div>
            <div class="margin-top-15">
              <span class="leftSpan">联系电话</span>
              <span class="color-999">{{order.phone}}</span>
            </div>
            <div class="margin-top-15 row-between">
              <span class="leftSpan">订单号</span>
              <span class="color-999 grow">{{order.number}}</span>
              <span class="color-ffac38" @click="copy">复制</span>
            </div>
            <div class="margin-top-15">
              <span class="leftSpan">下单时间</span>
              <span class="color-999">{{api.dateFormat(order.createtime)}}</span>
            </div>
            <div class="margin-top-15" v-if="bottom.functionCode === 'show_tailMoney' || bottom.functionCode === 'show_deposit'">
              <span class="leftSpan">订金</span>
              <span class="color-999">{{parseFloat(order.deposit).toFixed(2)}}元</span>
            </div>
            <div class="margin-top-15">
              <span class="leftSpan">预约服务费</span>
              <span class="color-999">{{parseFloat(order.servicePrice).toFixed(2)}}元</span>
            </div>
          </div>
        </div>
      </div>
    </scroller>

    <!-- 底部信息 -->
    <div class="fixed">
      <span class="color-999 font15" v-if="bottom.functionCode === 'show_text'">{{bottom.text}}</span>
      <span class="back-ffac38 color-fff bomBtn" v-if="bottom.functionCode === 'show_FuKuan'" @click="pay">支付服务套餐</span>
      <span class="back-ffac38 color-fff bomBtn" v-if="bottom.functionCode === 'show_tailMoney'" @click="pay">支付尾款</span>
      <span class="back-ffac38 color-fff bomBtn" v-if="bottom.functionCode === 'show_deposit'" @click="pay">支付订金</span>
      <span class="back-ffac38 color-fff bomBtn" v-if="bottom.functionCode === 'show_PingJia'" @click="goEvaluate">评价</span>
      <div class="row-state" style="width: 100%" v-if="bottom.functionCode === 'show_QueRen'">
        <span class="back-ffac38 color-fff bomBtn width-50" @click="serviceComplete">确认服务已完成</span>
        <span class="back-e0e0e0 color-a9a9a9 bomBtn width-50" @click="orderRights">订单维权</span>
      </div>
    </div>
  </div>
</template>

<script>
  import headers from '../components/headers.vue'
  import api from '../common/api.js'
  import { Rater, CellFormPreview, Group, Cell, Scroller } from 'vux'
  import service from '../mall/service'
  export default {
    data () {
      return {
        api: api,
        order: {},
        salesman: {},
        service: [],
        bottom: {},
        historyPrice: 0,
        pulldownConfig: {
          content: '下拉刷新',
          height: 40,
          autoRefresh: false,
          downContent: '下拉刷新',
          upContent: '释放后刷新',
          loadingContent: '正在刷新...',
          clsPrefix: 'xs-plugin-pulldown-'
        }
      }
    },
    components: { headers, Rater, CellFormPreview, Group, Cell, Scroller },
    mounted () {
      this.$nextTick(() => {
        this.$refs.scroller.reset({top: 0})
      })
      this.getServiceInfo()
    },
    methods: {
      pulldownLoad () {
        this.getServiceInfo()
      },
      getServiceInfo () {
        const obj = {id: this.$route.query.id};
        api.sendReq('/customer/user/service_orders_id', obj).then(data => {
          if (data) {
            this.order = data.order
            this.salesman = data.salesman
            this.bottom = data.bottom
            /* 服务信息 */
            let newData = JSON.parse(JSON.stringify(data.service))
            if (this.order.serviceStatus === 1) {
              /* 服务信息 */
              let serviceList = new Array()
              let serviceMap = new Map()
              for (let i = 0; i < newData.length; i++) {
                let sortId = newData[i].sort
                if (serviceList.indexOf(sortId) === -1) {
                  serviceList.push(sortId)
                  let setMap = {'name': newData[i].text, 'size': 1, 'price': newData[i].name, 'onePrice': newData[i].name}
                  serviceMap.set(sortId, setMap)
                } else {
                  let getMap = serviceMap.get(sortId)
                  getMap.size = (getMap.size += 1)
                  getMap.price = parseFloat(getMap.price) + parseFloat(newData[i].name)
                  serviceMap.set(sortId, getMap)
                }
              }
              let setServie = new Array()
              for (let i = 0; i < serviceList.length; i++) {
                this.historyPrice += parseFloat(serviceMap.get(serviceList[i]).price)
                setServie.push(serviceMap.get(serviceList[i]))
              }
              this.service = setServie
            }
            // if (this.order.serviceStatus === 0) {
            //   newData.map(v => {
            //     v.childrenFw.map(k => {
            //       k.label = k.text
            //       k.value = parseFloat(k.name).toFixed(2)
            //     })
            //   })
            // } else {
            //   newData.map(v => {
            //     v.label = v.text
            //     v.value = parseFloat(v.name).toFixed(2)
            //   })
            // }
            // this.service = newData
            // this.$refs.scroller.donePulldown()
            // this.scrollerStatus.pullupStatus = 'default'
          }
        })
      },
      copy () {
        let _this = this
        this.$copyText(this.order.number).then(e => {
          _this.$vux.toast.text('复制成功')
        }, e => {
          _this.$vux.toast.text('复制失败')
        })
      },
      goEvaluate () {
        this.$router.push({path: '/score', query: {id: this.$route.query.id}})
      },
      pay () {
        const payType = {
          show_tailMoney: 1,
          show_deposit: 0,
          show_FuKuan: 2,
        }
        let params = {
          serviceId: this.$route.query.id,
          userIp: api.getCookie('userIp'),
          payType: payType[this.bottom.functionCode]
        }
        const self = this;
        api.sendReq('/customer/user/purchase_service_meal', params, 'POST', true).then(data => {
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
      serviceComplete () {
        api.sendReq(`/customer/user/ok_service_order?serviceId=${this.$route.query.id}`, null, 'POST').then(data => {
          if (data) {
            this.$vux.toast.text('服务已确认')
          }
        })
      },
      orderRights () {
        api.sendReq('/customer/user/service_order_wq', null).then(data => {
          if (data) {
            this.$vux.confirm.show({
              title: '提示',
              content: data.text,
              onConfirm () {
                this.$vux.confirm.hide()
              }
            })
          }
        })
      }
    }
  }
</script>

<style scoped>
  .headImg{
    width: 3.5rem;
    height: 3.5rem;
    border-radius: 1.75rem;
  }
  .phoneIcon {
    width: 2.5rem;
    height: 2.5rem;
  }
  .icon{
    width: 1.5rem;
    height: 1.5rem;
    margin-right: 5px;
  }
  .title {
    color: #333;
    font-weight: normal;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    overflow: hidden;
  }
  .des{
    display: inline-block;
    border-radius: 5px;
    padding: 5px 8px;
    background: #f5f5f5;
    margin-top: 5px;
  }
  .leftSpan{
    width: 30%;
    display: inline-block;
    text-align: right;
    color: #333;
    margin-right: 10px;
  }
  .fixed {
    width: 100%;
    height: 3.125rem;
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    background: white;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .bomBtn {
    width: 100%;
    height: 100%;
    display: inline-block;
    text-align: center;
    line-height: 3.125rem;
  }
</style>
