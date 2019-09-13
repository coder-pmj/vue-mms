<template>
  <div>
    <app-header></app-header>
    <app-navbar></app-navbar>
    <app-main></app-main>
  </div>
</template>
<script>
import AppHeader from "@/components/AppHeader";
import AppNavBar from "@/components/AppNavBar";
import AppMain from "@/components/AppMain";

export default {
  components: {
    "app-header": AppHeader,
    "app-navbar": AppNavBar,
    "app-main": AppMain
  },
  /* provide() {
    //依赖注入，在AppHeader组件中接收
    return {
      getMap: this.getMap,
      obj: {
        name: "彭明久"
      }
    };
  }, */
  methods: {
    /* //测试依赖注入的方法
    getMap() {
      console.log("getMap");
    } */
  }
};
</script>

<style scoped>
.header {
  position: absolute;
  top: 0px;
  left: 0px;
  right: 0px;
  line-height: 50px;
  background-color: #2d3a4b;
}
.navBar {
  position: absolute;
  width: 230px;
  top: 50px;
  left: 0px;
  bottom: 0px;
  background-color: #545c64;
  overflow-y: auto; /* 设置滚动条 */
}
.main {
  position: absolute;
  top: 50px;
  left: 230px;
  right: 0px;
  bottom: 0px;
  padding: 10px;
  overflow-y: auto;
}
</style>
