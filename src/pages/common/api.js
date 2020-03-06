import axios from 'axios'
import qs from 'qs'
import _myThis from '@/main.js'
import { dateFormat } from 'vux'

let api = {
  // basePath: 'http://192.168.1.13:8080/heaven',
  basePath: 'http://tianyinde.com',
  // basePath: 'http://192.168.31.116/heaven',
  sendReq (url, params, methods = 'GET', json, load = true) {
    try {
      if (load) {
        _myThis.$vux.loading.show({
          text: 'Loading...'
        })
      }
    } catch (e) {
      console.log(e)
    }
    let options = {
      method: methods,
      url: `${api.basePath}${url}`,
      params: params
    }
    if (methods === 'POST') {
      options.headers = {
        'Content-type': json ? 'application/json; charset=UTF-8' : 'application/x-www-form-urlencoded'
      }
      options.data = json ? params : qs.stringify(params)
    }
    return axios(options).then(data => {
      _myThis.$vux.loading.hide()
      if (data.status === 200) {
        let res = data.data
        if (res.code === 0) {
          return res.data ? res.data : res.msg
        } else {
          _myThis.$vux.toast.text(res.msg)
        }
      }
    }).catch(e => {
      _myThis.$vux.loading.hide()
      if (e.response) {
        if (e.response.status === 444) {
          window.localStorage.clear()
          _myThis.$vux.confirm.show({
            title: '提示',
            content: '登录过期，请重新登录',
            onCancel () {
              _myThis.$vux.confirm.hide()
            },
            onConfirm () {
              localStorage.setItem('isLogin', 'true')
              let url = window.location.href
              window.location.href = 'http://tianyinde.com/wechat/wechat_login?callbackUrl=' + encodeURIComponent(url)
            }
          })
        }
      } else {
        _myThis.$vux.toast.text(e)
      }
    })
  },
  setCookie (name, value) {
    localStorage.setItem(name, value)
  },
  getCookie (name) {
    return localStorage.getItem(name)
  },
  formatString (str, frontLen, endLen) {
    let len = str.length - frontLen - endLen
    let xing = ''
    for (let i = 0; i < len; i++) {
      xing += '*'
    }
    return str.substr(0, frontLen) + xing + str.substr(str.length - endLen)
  },
  // file 转 base64
  getFileBase64 (file, callback) {
    let reader = new FileReader()
    reader.readAsDataURL(file) // 读出 base64
    reader.onloadend = function () {
      // 图片的 base64 格式, 可以直接当成 img 的 src 属性值
      let dataURL = reader.result
      if (callback != null && typeof callback === 'function') {
        callback(dataURL)
      } else {
        callback()
      }
    }
  },
  // 格式化时间
  dateFormat (value) {
    return dateFormat(value, 'YYYY-MM-DD HH:mm:ss')
  },
  /**
   * 公共支付
   * */
  onBridgeReady (path, data, callback) {
    /* global WeixinJSBridge */
    WeixinJSBridge.invoke('getBrandWCPayRequest', data, function (res) {
      let msg = ''
      if (res.err_msg === 'get_brand_wcpay_request:ok') {
        msg = '支付成功'
        // 支付成功后跳转的页面
      } else if (res.err_msg === 'get_brand_wcpay_request:cancel') {
        msg = '支付取消'
      } else if (res.err_msg === 'get_brand_wcpay_request:fail') {
        msg = '支付失败'
        WeixinJSBridge.call('closeWindow')
      }// 使用以上方式判断前端返回,微信团队郑重提示：res.err_msg将在用户支付成功后返回ok,但并不保证它绝对可靠。
      if (path) {
        _myThis.$vux.confirm.show({
          title: '提示',
          content: msg,
          cancelText: '返回',
          confirmText: '查看订单',
          onCancel () {
            _myThis.$router.go(-1)
          },
          onConfirm () {
            _myThis.$router.push({path: path})
          }
        })
      } else {
        _myThis.$vux.toast.text(msg)
        if (callback) callback(msg)
      }
    })
  }

}

export default api
