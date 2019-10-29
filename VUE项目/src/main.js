import Vue from 'vue'

import VueRouter from 'vue-router'

import VueResource from 'vue-resource'

import moment from 'moment'

Vue.use(VueRouter)

// 这里配置全局根路径
// Vue.http.options.root = '/'


import router from './router.js'

import MintUI from 'mint-ui'
import 'mint-ui/lib/style.css'

import './lib/MUI/css/mui.css'
import './lib/MUI/css/icons-extra.css'

Vue.use(MintUI)

import app from './App.vue'

// 定义全局过滤器
Vue.filter('dataFormat',function(dataStr,pattent = 'YYYY-MM-DD HH:mm:ss'){
    return moment(dataStr).format(pattent)
})

var vm = new Vue({
    el: "#app",
    render: c => c(app),
    router
})



