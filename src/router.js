import Vue from "vue";
import Router from "vue-router";
import Login from "@/views/login/index.vue";
import Layout from "@/components/Layout.vue";
import Home from "@/views/home";
import Member from "@/views/member";
import Supplier from "@/views/supplier";
import Goods from "@/views/goods";
import Staff from "@/views/staff";

Vue.use(Router);

export default new Router({
  // mode: "hash",
  // base: process.env.BASE_URL,
  routes: [
    {
      path: "/login",
      name: "login",
      component: Login
    },
    {
      path: "/",
      redirect: "/home/"
    },
    {
      path: "/home/",
      component: Layout,
      children: [
        {
          path: "",
          component: Home
        }
      ]
    },

    {
      path: "/member",
      component: Layout,
      children: [
        {
          path: "/",
          component: Member,
          meta: { title: "会员管理" }
        }
      ]
    },
    {
      path: "/staff",
      component: Layout,
      children: [
        {
          path: "/",
          component: Staff,
          meta: { title: "员工管理" }
        }
      ]
    },
    {
      path: "/supplier",
      component: Layout,
      children: [
        {
          path: "/",
          component: Supplier,
          meta: { title: "供应商管理" }
        }
      ]
    },
    {
      path: "/goods",
      component: Layout,
      children: [
        {
          path: "/",
          component: Goods,
          meta: { title: "商品管理" }
        }
      ]
    }
  ]
});
