import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/pages/Login'
import Layout from '@/pages/Layout'
import Index from '@/pages/Index'
const Menu =  ()=>import('@/pages/Menu') 
const Role = ()=>import("@/pages/Role")
const User = ()=>import("@/pages/User")
const Cate = ()=>import("@/pages/Cate")
const Specs = ()=>import("@/pages/Specs")
const Goods = ()=>import("@/pages/Goods")
Vue.use(Router)
const router = new Router({
  routes: [
    {
      path:"/login",
      component:Login
    },
    {
      path: '/',
      component: Layout,
      children:[{
        path:"index",
        component:Index
      },{
        path:"menu",
        component:Menu
      },{
        path:"role",
        component:Role
      },{
        path:"category",
        component:Cate
      },{
        path:"specs",
        component:Specs
      },{
        path:"user",
        component:User
      },{
        path:"goods",
        component:Goods
      },{
        path:"*",
        redirect:"/index"
      }]
    },
  ]
})

router.beforeEach((to,from,next)=>{
  // 获取token 来判断是否登录
  let token = localStorage.getItem("token");
  let menus_url = JSON.parse(localStorage.getItem("info")).menus_url;
  console.log(menus_url)
  if(token){
    // 已登录
    if(to.path=="/login"){
      next(false);
    }else{
      // 已登录的情况
      // 查看当前目的地址是否是后台允许访问的地址
      let flag = menus_url.find(item=>to.path==item);
      // console.log(flag);

      // 是就正常跳转，不是就取消导航
      if(flag){
        next();
      }else{
        next(false);
      }
      
    }
  }else{
    if(to.path=="/login"){
      next();
    }else{
      next("/login");
    }
  }
})

export default router
