/*
权限校验
beforeEach(to,from,next)
*/

import router from "./router";
import { getUserInfo } from "@/api/login.js";
import store from '@/store'

router.beforeEach((to, from, next) => {
  //1.获取token
  const token = store.state.user.token
  if (!token) {
    //如果没有获取到token
    //要访问非登录页面
    if (to.path !== "/login") {
      next({
        path: "/login"
      });
    } else {
      //请求登录页面
      next();
    }
  } else {
    //获取到token
    if (to.path === "/login") {
      next();
    } else {
      const userInfo = store.state.user.user;
      if (userInfo) {
        //如果获取到用户信息，则跳转到目标路由
       // console.log('有获取到')
        next();
      } else {
        store.dispatch('GetUserInfo').then(res => {
        //  console.log('没有获取到')
          if (res.flag) {
            next()
          } else {
            next({
              path: "/login"
            })
          }
        })
      }
    }
  }
});
