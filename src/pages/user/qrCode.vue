<template>
  <div>
    <headers title="收款码" showBack="true"></headers>
    <load-more :show-loading="false" tip="微信收款码" background-color="#fbf9fe"></load-more>
    <div class="center">
      <input id="wechat" name="wechat" @change="update" ref="wechat" type="file" style="display: none"/>
      <img v-if="wechatImg" :src="wechatImg" width="200" height="200" @click="fileopen()">
      <div v-else class="upload" @click="fileopen()"><img src="../../../static/images/addIcon.png" width="50"></div>
    </div>
    <div class="margin-top-30 row-center">
      <div class="width-90">
        <x-button class="back-ffac38 color-fff" type="warn" @click.native="uploadSub">提交</x-button>
      </div>
    </div>
    <confirm v-model="confirmShow"
             show-input
             title="支付密码"
             :input-attrs="{type: 'password'}"
             @on-confirm="onConfirm">
    </confirm>
  </div>
</template>

<script>
  import headers from '../components/headers.vue'
  import api from '../common/api.js'
  import { LoadMore, XButton, Confirm } from 'vux'
  export default {
    data () {
      return {
        confirmShow: false,
        wechatImg: '',
        file: '',
        fileName: '',
        fileSize: '',
        fileType: ''
      }
    },
    components: { headers, LoadMore, XButton, Confirm },
    methods: {
      update () {
        let _this = this
        let inputDOM = this.$refs.wechat
        // 通过DOM取文件数据
        this.file = inputDOM.files[0]
        api.getFileBase64(this.file, e => {
          _this.wechatImg = e
        })
        if (inputDOM.files[0] === undefined) {
          this.fileName = ''
          this.fileSize = ''
          this.fileType = ''
        } else {
          this.fileName = this.file.name
          if (this.file.size / 1024 < 1000) {
            this.fileSize = (this.file.size / 1024).toFixed(2) + 'kb'
          } else if (this.file.size / 1024 > 1000) {
            this.fileSize = ((this.file.size / 1024) / 1024).toFixed(2) + 'MB'
          }
          this.fileType = this.file.type
        }
      },
      fileopen () {
        let fileSelect = document.getElementById('wechat')
        fileSelect.click()
      },
      uploadSub () {
        if (!this.wechatImg) return this.$vux.toast.text('请先上传微信收款码')
        this.confirmShow = !this.confirmShow
      },
      onConfirm (val) {
        if (!val) {
          return this.$vux.toast.text('请输入支付密码')
        }
        this.$vux.loading.show({
          text: 'Loading...'
        })
        let _this = this
        let formData = new FormData()
        formData.append('payPassword', val)
        formData.append('wechat_image', this.file)
        let xhr = new XMLHttpRequest()
        xhr.open('post', `${api.basePath}/customer/user/wechat_withdrawal`)
        xhr.send(formData)
        xhr.onreadystatechange = function () {
          _this.$vux.loading.hide()
          if (xhr.readyState === 4 && xhr.status === 200) {
            _this.text = xhr
            let res = JSON.parse(xhr.response)
            if (res.code === 0) {
              _this.$vux.toast.text('上传成功')
              _this.$router.go(-1)
            } else {
              _this.$vux.toast.text(res.msg || '请求失败')
            }
          }
        }
      }
    }
  }
</script>

<style scoped>
  .center{
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
  }
  .upload{
    background: #fbfdff;
    border: 1px dashed #c0ccda;
    border-radius: 6px;
    box-sizing: border-box;
    width: 200px;
    height: 200px;
    font-size: 80px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #8c939d;
  }
</style>
