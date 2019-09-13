import Vue from "vue";
import Element from "element-ui";
import "element-ui/lib/theme-chalk/index.css";
import App from "./App.vue";
import router from "./router";
import store from '@/store'

//权限拦截---路由
import "./permission";

Vue.use(Element);
Vue.config.productionTip = process.env.NODE_ENV === "production";

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
