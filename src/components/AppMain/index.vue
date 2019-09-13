<template>
  <div class="main">
    <app-link></app-link>
    <router-view></router-view>
  </div>
</template>

<script>
import appLink from "@/components/AppMain/Link.vue";
export default {
  components: {
    "app-link": appLink
  }
};
</script>
