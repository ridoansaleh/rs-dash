import { createApp } from "vue";
import { createRouter, createWebHashHistory } from "vue-router";
import App from "./App.vue";
import PrimeVue from "primevue/config";
import Login from './pages/login/Login.vue'
import Dashboard from './pages/dashboard/Dashboard.vue'
import NewOrder from './pages/new-order/NewOrder.vue'
import { AUTH_SESSION, PATH } from './constant'

import "primevue/resources/themes/saga-blue/theme.css";
import "primevue/resources/primevue.min.css";
import "primeicons/primeicons.css";
import "primeflex/primeflex.min.css";

const routes = [
  { path: PATH.LOGIN, component: Login },
  { path: PATH.DASHBOARD, component: Dashboard },
  { path: PATH.NEW_ORDER, component: NewOrder },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

router.beforeEach((to) => {
  const isAuthenticated = sessionStorage.getItem(AUTH_SESSION)
  if (to.path !== PATH.LOGIN && !isAuthenticated) {
    return { path: PATH.LOGIN }
  } else if (to.path === PATH.LOGIN && isAuthenticated) {
    return { path: PATH.DASHBOARD }
  }
  return true
})

const app = createApp(App);

app.use(router);
app.use(PrimeVue);
app.mount("#app");
