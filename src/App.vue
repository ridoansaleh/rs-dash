<script setup>
import { watch, ref } from "vue"
import { useRoute, useRouter } from "vue-router"
import Menubar from "primevue/menubar";
import { AUTH_SESSION, PATH } from "./constant";

const router = useRouter()
const route = useRoute()
const isAuthenticated = ref(false)

watch(() => route.path, () => {
  const session = sessionStorage.getItem(AUTH_SESSION);
  isAuthenticated.value = !!session
})

const handleLogOut = () => {
  sessionStorage.removeItem(AUTH_SESSION)
  router.push(PATH.LOGIN)
}
</script>

<template>
  <Menubar v-if="isAuthenticated">
    <template #end>
      <div><i class="pi pi-fw pi-power-off cursor-pointer" @click="handleLogOut"></i></div>
    </template>
  </Menubar>
  <div class="app-container">
    <router-view></router-view>
  </div>
</template>

<style>
body {
  margin: 0;
}
.p-menubar {
  height: 42px;
}
.p-menubar-button {
  display: none !important;
}
.app-container {
  padding: 0 10px 40px;
}
</style>
