import VueRouter from 'vue-router'

import home from './components/tabbar/home.vue'
import member from './components/tabbar/member.vue'
import search from './components/tabbar/search.vue'
import shopcart from './components/tabbar/shop-cart.vue'
import newslist from './components/news/newslist.vue'
import newsdetail from './components/news/newsdetail.vue'

var router = new VueRouter({
    routes: [
        { path: '/', redirect: '/home' },
        { path: '/home', component: home },
        { path: '/member', component: member },
        { path: '/search', component: search },
        { path: '/shopcart', component: shopcart },
        { path: '/home/newslist', component: newslist },
        { path: '/home/newsdetail', component: newsdetail }
    ],
    linkActiveClass: 'mui-active'
})
export default router