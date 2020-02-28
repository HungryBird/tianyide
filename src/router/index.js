import Vue from 'vue'
import Router from 'vue-router'
import Pages from '@/pages/'

Vue.use(Router)

export default new Router({
  routes: [
    // 商城
    { path: '/', redirect: '/mall' },
    { path: '/mall', name: '商城', component: Pages.Mall.mall },
    { path: '/mall/details', name: '商城', component: Pages.Mall.mallDetails },
    { path: '/service', name: '服务', component: Pages.Mall.service },
    { path: '/order', name: '确认订单', component: Pages.Mall.order },
    { path: '/score', name: '评分', component: Pages.Mall.score },
    { path: '/pay/success', name: '支付成功', component: Pages.Mall.paySuccess },
    // 讣告贴
    { path: '/production', name: '讣告贴模板', component: Pages.Production.production },
    { path: '/basic/info', name: '填写基本信息', component: Pages.Production.basicInfo },
    { path: '/template', name: '模板', component: Pages.Production.template },
    // 个人中心
    { path: '/user', name: '个人中心', component: Pages.User.user },
    { path: '/setting', name: '个人设置', component: Pages.User.setting },
    { path: '/address', name: '收获地址', component: Pages.User.address },
    { path: '/address/details', name: '收获地址', component: Pages.User.addressDetails },
    { path: '/pay/password', name: '支付密码', component: Pages.User.payPassword },
    { path: '/guests', name: '赴邀', component: Pages.User.guests },
    { path: '/comment', name: '留言', component: Pages.User.comment },
    { path: '/cash/money', name: '我的奠金', component: Pages.User.cashMoney },
    { path: '/my/gifts', name: '我的礼物', component: Pages.User.myGifts },
    { path: '/wallet', name: '我的钱包', component: Pages.User.wallet },
    { path: '/withdraw', name: '提现', component: Pages.User.withdraw },
    { path: '/withdraw/history', name: '提现记录', component: Pages.User.withdrawHistory },
    { path: '/qrCode', name: '收款码', component: Pages.User.qrCode },
    { path: '/service/order', name: '服务订单', component: Pages.User.serviceOrder },
    { path: '/service/order/details', name: '服务订单详情', component: Pages.User.serviceOrderDetails },
    { path: '/commodity/order', name: '商品订单', component: Pages.User.commodityOrder },
    { path: '/commodity/details', name: '商品详情', component: Pages.User.commodityDetails },
    { path: '/water/record', name: '消费记录', component: Pages.User.waterRecord },
    { path: '/help', name: '帮助中心', component: Pages.User.help },
    { path: '/help/details', name: '帮助中心详情', component: Pages.User.helpDetails },
    // MV
    { path: '/mv', name: 'Mv', component: Pages.Mv.mv }
  ]
})
