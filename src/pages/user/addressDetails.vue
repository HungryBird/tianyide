<template>
  <div>
    <headers :title="(type === 'add' ? '添加' : '编辑') + '收货地址'" showBack="true" rightTxt="保存" @rightClick="rightClick"></headers>
    <group label-width="4.5em" label-margin-right="1em">
      <x-input title="收货人" v-model="form.name"></x-input>
      <x-input title="手机号码" v-model="form.phone" type="tel" :max="11"></x-input>
      <x-address title="所在地区" placeholder="请选择" raw-value v-model="area" :list="ChinaAddressV4Data" @on-hide="addressHide" @on-shadow-change="addressChange" value-text-align="left"></x-address>
      <x-textarea v-model="address" placeholder="详细地址：如道路、门牌号、小区、楼栋号、单元室等" :show-counter="false" :rows="3"></x-textarea>
    </group>
    <!--<div class="margin-top-30 row-center" v-if="type === 'edit'">-->
      <!--<div class="width-90">-->
        <!--<x-button class="back-ffac38 color-fff" @click.native="delAddress">删除</x-button>-->
      <!--</div>-->
    <!--</div>-->
  </div>
</template>

<script>
  import headers from '../components/headers.vue'
  import api from '../common/api.js'
  import { XAddress, ChinaAddressV4Data, XInput, XTextarea, Group, XButton } from 'vux'
  export default {
    data () {
      return {
        type: this.$route.query.type,
        ChinaAddressV4Data: ChinaAddressV4Data,
        area: [],
        address: '',
        form: {},
        temporary: []
      }
    },
    components: { headers, XAddress, XInput, XTextarea, Group, XButton },
    methods: {
      addressHide (str) {
        if (str) {
          this.area = JSON.parse(JSON.stringify(this.temporary))
        }
      },
      addressChange (ids, names) {
        this.temporary = names
      },
      rightClick () {
        if (!this.form.name) {
          this.$vux.toast.text('收货人不能为空')
        } else if (!this.form.phone) {
          this.$vux.toast.text('手机号码不能为空')
        } else if (this.area.length === 0) {
          this.$vux.toast.text('请选择收货地区')
        } else if (!this.address) {
          this.$vux.toast.text('请输入详细地址')
        } else {
          let url = '/customer/user/add_commodity_address'
          if (this.type === 'edit') {
            url = '/customer/user/update_commodity_address'
          }
          this.form.address = this.area.join('-') + '-' + this.address
          api.sendReq(url, this.form, 'POST', true).then(data => {
            if (data) {
              this.$vux.toast.text('添加成功')
              this.$router.go(-1)
            }
          })
        }
      }
    },
    mounted () {
      let row = this.$route.query.row
      if (row) {
        this.form.name = row.name
        this.form.phone = row.phone
        if (row.addres.includes('-')) {
          let address = row.addres.split('-')
          this.area = [address[0], address[1], address[2]]
          this.address = address[3]
        } else {
          this.address = row.addres
        }
      }
    }
  }
</script>

<style scoped>

</style>
