<script setup>
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import DataTable from "primevue/datatable";
import Column from "primevue/column";
import Button from "primevue/button";
import appServices from "../../appServices";
import { AUTH_SESSION, PATH } from "../../constant";

const router = useRouter();
const orders = ref([]);
const isLoading = ref(true);

onMounted(() => {
  const session = sessionStorage.getItem(AUTH_SESSION);
  appServices
    .getOrders(session)
    .then((res) => {
      if (res.data.data?.length > 0) {
        orders.value = res.data.data;
      }
    })
    .catch(console.log)
    .finally(() => {
        isLoading.value = false
    });
});

const handleAddOrderClick = () => {
  router.push(PATH.NEW_ORDER);
};
</script>

<template>
  <div class="dashboard-container flex flex-column">
    <h2 class="text-3xl text-blue-500">Dashboard</h2>
    <Button
      label="Add Order"
      @click="handleAddOrderClick"
      class="p-button-secondary w-max my-4"
    />
    <DataTable :value="orders" responsiveLayout="scroll" :paginator="orders.length > 5" :rows="5">
      <Column field="ConsigneeName" header="Consignee Name"></Column>
      <Column field="ConsigneeAddress" header="Consignee Address"></Column>
      <Column field="ConsigneeCity" header="Consignee City"></Column>
      <Column field="ConsigneeCountry" header="Consignee Country"></Column>
      <Column
        field="ConsigneePostalCode"
        header="Consignee PostalCode"
      ></Column>
      <Column field="ConsigneeProvince" header="Consignee Province"></Column>
      <Column field="ConsigneeNumber" header="Consignee Number"></Column>
      <Column field="Height" header="Height"></Column>
      <Column field="Weight" header="Weight"></Column>
      <Column field="Length" header="Length"></Column>
      <Column field="Width" header="Width"></Column>
      <Column field="PaymentType" header="Payment Type"></Column>
      <template v-if="orders.length === 0" #footer>
        <div class="flex justify-content-center">{{ isLoading ? "Loading..." : "No data" }}</div>
      </template>
    </DataTable>
  </div>
</template>

<style scoped>
.dashboard-container {
  max-width: var(--max-screen-width);
  margin: auto;
  min-height: calc(100vh - 100px);
}
</style>
