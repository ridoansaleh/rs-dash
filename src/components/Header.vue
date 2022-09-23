<script setup lang="ts">
import Menubar from "primevue/menubar";

defineProps({
  isAuthenticated: Boolean,
});
defineEmits(["logout"]);
</script>

<template>
  <Menubar v-if="isAuthenticated">
    <template #end>
      <div>
        <i
          class="pi pi-fw pi-power-off cursor-pointer"
          @click="$emit('logout')"
        ></i>
      </div>
    </template>
  </Menubar>
</template>

<style>
.p-menubar {
  height: 42px;
  display: flex;
  justify-content: center;
}
.p-menubar-button {
  display: none !important;
}
.p-menubar-end {
  width: 100vw;
  max-width: var(--max-screen-width);
  display: flex;
  justify-content: flex-end;
  margin-left: unset !important;
}
</style>
