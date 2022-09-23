<script setup lang="ts">
import { watch, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import MenuHeader from "./components/Header.vue";
import { AUTH_SESSION, PATH } from "./constant";

const router = useRouter();
const route = useRoute();
const isAuthenticated = ref(false);

watch(
  () => route.path,
  () => {
    const session = sessionStorage.getItem(AUTH_SESSION);
    isAuthenticated.value = !!session;
  }
);

const handleLogOut = () => {
  sessionStorage.removeItem(AUTH_SESSION);
  router.push(PATH.LOGIN);
};
</script>

<template>
  <MenuHeader :is-authenticated="isAuthenticated" @logout="handleLogOut" />
  <div class="app-container">
    <router-view></router-view>
  </div>
</template>

<style>
:root {
  --max-screen-width: 768px;
}
body {
  margin: 0;
}
.app-container {
  min-width: 280px;
  padding: 0 10px 40px;
}
input[type="number"]::-webkit-inner-spin-button,
input[type="number"]::-webkit-outer-spin-button {
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
}
</style>
