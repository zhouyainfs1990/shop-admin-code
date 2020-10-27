// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import MyTable from './components/MyTable'
import router from './router'

// 引入样式重置
import "./assets/css/reset.css"

// 引入 封装axios

import http from "./utils/http"

import store from "./store"

// 引入插件
import ElementUI from 'element-ui';
// 引入插件
import 'element-ui/lib/theme-chalk/index.css';

import qs from "qs"

import API from "./API"
Vue.prototype.$api = API
// 安装插件
Vue.use(ElementUI);

// 添加到原型上
Vue.prototype.$http = http
Vue.prototype.$qs = qs
Vue.prototype.$domain = "http://localhost:3000";
Vue.config.productionTip = false
Vue.component("my-table",MyTable)
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
