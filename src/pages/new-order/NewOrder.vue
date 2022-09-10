<script setup>
import { ref, reactive, computed, watch } from "vue";
import { useRouter } from "vue-router";
import InputText from "primevue/inputtext";
import Dropdown from "primevue/dropdown";
import InputNumber from "primevue/inputnumber";
import Button from "primevue/button";
import Dialog from "primevue/dialog";
import Breadcrumb from "primevue/breadcrumb";
import appServices from "../../appServices";
import { PATH, AUTH_SESSION } from "../../constant";
import { initialOrder, countryList, provinceList, cityList, paymentTypeList } from "./data";

const convertToKeyValue = (arr = []) => {
  return arr.map((d) => ({ name: d, code: d }));
};

const router = useRouter();

const formData = reactive(initialOrder);
const isValid = reactive({
  consigneeName: true,
  consigneeAddress: true,
  consigneeCity: true,
  consigneeCountry: true,
  consigneePostalCode: true,
  consigneeProvince: true,
  consigneeNumber: true,
  height: true,
  weight: true,
  length: true,
  width: true,
  paymentType: true,
});
const isSubmitting = ref(false);
const isLoading = ref(false);
const isServerError = ref(false);
const isSuccess = ref(false);
const countries = ref(countryList);

const provinces = computed(() => {
  let list = [];
  if (!formData.consigneeCountry) {
    list = provinceList.SG;
  }
  list = provinceList[formData.consigneeCountry];
  return convertToKeyValue(list);
});

const cities = computed(() => {
  let list = [];
  if (!formData.consigneeProvince) {
    list = cityList.Singapore;
  }
  list = cityList[formData.consigneeProvince];
  return convertToKeyValue(list);
});
const paymentTypes = ref(convertToKeyValue(paymentTypeList));

const dashboard = {
  icon: "pi pi-table",
  to: PATH.DASHBOARD,
};

const menuItems = [
  { label: "Dashboard", to: PATH.DASHBOARD },
  { label: "New Order", to: PATH.NEW_ORDER },
];

const onFieldBlur = (field) => {
  isValid[field] = ![null, ""].includes(formData[field]);
};

watch(
  () => formData.consigneeCountry,
  (newCountry) => {
    if (newCountry.trim() !== "") {
      formData.consigneeProvince = "";
      formData.consigneeCity = "";
    }
  }
);

watch(
  [
    () => formData.consigneeCountry,
    () => formData.consigneeProvince,
    () => formData.consigneeCity,
  ],
  ([newCountry, newProvince, newCity]) => {
    if (isSubmitting.value) return;
    isValid.consigneeCountry = newCountry.trim() !== "";
    isValid.consigneeProvince = newProvince.trim() !== "";
    isValid.consigneeCity = newCity.trim() !== "";
  }
);

watch([() => formData.paymentType], ([newPaymentType]) => {
  if (isSubmitting.value) return;
  isValid.paymentType = newPaymentType.trim() !== "";
});

const handleFormSubmit = () => {
  let isFieldValid = {};
  for (const field in formData) {
    isValid[field] = ![null, ""].includes(formData[field]);
    isFieldValid[field] = ![null, ""].includes(formData[field]);
  }
  const validStatuses = Object.values(isFieldValid);
  if (validStatuses.some((valid) => valid === false)) return;
  isLoading.value = true;
  isSubmitting.value = true;
  const session = sessionStorage.getItem(AUTH_SESSION);
  appServices
    .createrOrder(
      {
        ...formData,
        consigneePostalCode: String(formData.consigneePostalCode),
        consigneeNumber: String(formData.consigneeNumber),
      },
      session
    )
    .then(() => {
      isSuccess.value = true;
    })
    .catch(() => {
      isServerError.value = true;
    })
    .finally(() => {
      if (!isServerError.value) {
        for (const field in formData) {
          formData[field] = initialOrder[field];
        }
      }
      isLoading.value = false;
    });
};

const handleCloseSuccess = () => {
  isSuccess.value = false;
  isSubmitting.value = false;
};
</script>

<template>
  <div class="neworder-container flex flex-column 1bg-orange-500">
    <h2 class="text-3xl text-blue-500">New Order Page</h2>
    <Breadcrumb class="mb-6" :home="dashboard" :model="menuItems" />
    <form @submit="handleFormSubmit" class="grid">
      <div class="field col-12 lg:col-6">
        <label id="ConsigneeName">Consignee Name</label>
        <InputText
          id="ConsigneeName"
          placeholder="Consignee Name"
          v-model="formData.consigneeName"
          @blur="() => onFieldBlur('consigneeName')"
          aria-describedby="consignee-name-help"
          :class="{ 'w-full': true, 'p-invalid': !isValid.consigneeName }"
        />
        <small
          v-if="!isValid.consigneeName"
          id="consignee-name-help"
          class="p-error"
          >Consignee Name is required</small
        >
      </div>
      <div class="field col-12 lg:col-6">
        <label id="ConsigneeAddress">Consignee Address</label>
        <InputText
          id="ConsigneeAddress"
          placeholder="Consignee Address"
          v-model="formData.consigneeAddress"
          @blur="() => onFieldBlur('consigneeAddress')"
          aria-describedby="consignee-address-help"
          :class="{ 'w-full': true, 'p-invalid': !isValid.consigneeAddress }"
        />
        <small
          v-if="!isValid.consigneeAddress"
          id="consignee-address-help"
          class="p-error"
          >Consignee Address is required</small
        >
      </div>
      <div class="field col-12 lg:col-6">
        <label id="ConsigneeCountry">Consignee Country</label>
        <Dropdown
          id="ConsigneeCountry"
          v-model="formData.consigneeCountry"
          :options="countries"
          optionLabel="name"
          optionValue="code"
          placeholder="Select a Consignee Country"
          aria-describedby="consignee-country-help"
          :class="{ 'w-full': true, 'p-invalid': !isValid.consigneeCountry }"
        />
        <small
          v-if="!isValid.consigneeCountry"
          id="consignee-country-help"
          class="p-error"
          >Consignee Country is required</small
        >
      </div>
      <div class="field col-12 lg:col-6">
        <label id="ConsigneeProvince">Consignee Province</label>
        <Dropdown
          id="ConsigneeProvince"
          v-model="formData.consigneeProvince"
          :options="provinces"
          optionLabel="name"
          optionValue="code"
          placeholder="Select a Consignee Province"
          aria-describedby="consignee-province-help"
          :class="{ 'w-full': true, 'p-invalid': !isValid.consigneeProvince }"
        />
        <small
          v-if="!isValid.consigneeProvince"
          id="consignee-province-help"
          class="p-error"
          >Consignee Province is required</small
        >
      </div>
      <div class="field col-12 lg:col-6">
        <label id="ConsigneeCity">Consignee City</label>
        <Dropdown
          id="ConsigneeCity"
          v-model="formData.consigneeCity"
          :options="cities"
          optionLabel="name"
          optionValue="code"
          placeholder="Select a Consignee City"
          aria-describedby="consignee-city-help"
          :class="{ 'w-full': true, 'p-invalid': !isValid.consigneeCity }"
        />
        <small
          v-if="!isValid.consigneeCity"
          id="consignee-city-help"
          class="p-error"
          >Consignee City is required</small
        >
      </div>
      <div class="field col-12 lg:col-6">
        <label id="ConsigneePostalCode">Consignee Postal Code</label>
        <InputNumber
          inputId="ConsigneePostalCode"
          v-model="formData.consigneePostalCode"
          mode="decimal"
          :useGrouping="false"
          :input-props="{ onblur: () => onFieldBlur('consigneePostalCode') }"
          placeholder="Consignee Postal Code"
          aria-describedby="consignee-postalcode-help"
          :class="{ 'w-full': true, 'p-invalid': !isValid.consigneePostalCode }"
        />
        <small
          v-if="!isValid.consigneePostalCode"
          id="consignee-postalcode-help"
          class="p-error"
          >Consignee Postal Code is required</small
        >
      </div>
      <div class="field col-12 lg:col-6">
        <label id="ConsigneeNumber">Consignee Number</label>
        <InputNumber
          inputId="ConsigneeNumber"
          v-model="formData.consigneeNumber"
          mode="decimal"
          :useGrouping="false"
          :input-props="{ onblur: () => onFieldBlur('consigneeNumber') }"
          placeholder="Consignee Number"
          aria-describedby="consignee-number-help"
          :class="{ 'w-full': true, 'p-invalid': !isValid.consigneeNumber }"
        />
        <small
          v-if="!isValid.consigneeNumber"
          id="consignee-number-help"
          class="p-error"
          >Consignee Number is required</small
        >
      </div>
      <div class="field col-12 lg:col-6">
        <label id="height">Height</label>
        <InputNumber
          inputId="height"
          v-model="formData.height"
          mode="decimal"
          :useGrouping="false"
          :input-props="{ onblur: () => onFieldBlur('height') }"
          placeholder="Height"
          aria-describedby="height-help"
          :class="{ 'w-full': true, 'p-invalid': !isValid.height }"
        />
        <small v-if="!isValid.height" id="height-help" class="p-error"
          >Height is required</small
        >
      </div>
      <div class="field col-12 lg:col-6">
        <label id="weight">Weight</label>
        <InputNumber
          inputId="weight"
          v-model="formData.weight"
          mode="decimal"
          :useGrouping="false"
          :input-props="{ onblur: () => onFieldBlur('weight') }"
          placeholder="Weight"
          aria-describedby="weight-help"
          :class="{ 'w-full': true, 'p-invalid': !isValid.weight }"
        />
        <small v-if="!isValid.weight" id="weight-help" class="p-error"
          >Weight is required</small
        >
      </div>
      <div class="field col-12 lg:col-6">
        <label id="length">Length</label>
        <InputNumber
          inputId="length"
          v-model="formData.length"
          mode="decimal"
          :useGrouping="false"
          :input-props="{ onblur: () => onFieldBlur('length') }"
          placeholder="Length"
          aria-describedby="length-help"
          :class="{ 'w-full': true, 'p-invalid': !isValid.length }"
        />
        <small v-if="!isValid.length" id="length-help" class="p-error"
          >Length is required</small
        >
      </div>
      <div class="field col-12 lg:col-6">
        <label id="width">Width</label>
        <InputNumber
          inputId="width"
          v-model="formData.width"
          mode="decimal"
          :useGrouping="false"
          :input-props="{ onblur: () => onFieldBlur('width') }"
          placeholder="Width"
          aria-describedby="width-help"
          :class="{ 'w-full': true, 'p-invalid': !isValid.width }"
        />
        <small v-if="!isValid.width" id="width-help" class="p-error"
          >Width is required</small
        >
      </div>
      <div class="field col-12 lg:col-6">
        <label id="PaymentType">Payment Type</label>
        <Dropdown
          id="PaymentType"
          v-model="formData.paymentType"
          :options="paymentTypes"
          optionLabel="name"
          optionValue="code"
          placeholder="Select a Payment Type"
          aria-describedby="payment-type-help"
          :class="{ 'w-full': true, 'p-invalid': !isValid.paymentType }"
        />
        <small
          v-if="!isValid.paymentType"
          id="payment-type-help"
          class="p-error"
          >Payment Type is required</small
        >
      </div>
      <div class="col-12 lg:flex lg:flex lg:justify-content-end">
        <Button
          type="submit"
          :loading="isLoading"
          class="col-12 lg:col-4"
          label="Save"
        />
      </div>
    </form>
    <Dialog
      header="Done"
      v-model:visible="isSuccess"
      :breakpoints="{ '960px': '75vw', '640px': '90vw' }"
      :style="{ width: '50vw' }"
    >
      <p>
        Successfully created an order. Would you like to create another OR go
        back to Dashboard?
      </p>
      <template #footer>
        <div class="flex">
          <Button
            label="Yes, create another"
            icon="pi pi-times"
            @click="handleCloseSuccess"
            class="p-button-text"
          />
          <Button
            label="Go to Dashboard"
            icon="pi pi-check"
            @click="() => router.push(PATH.DASHBOARD)"
            class=""
            autofocus
          />
        </div>
      </template>
    </Dialog>
    <Dialog
      header="Error"
      v-model:visible="isServerError"
      :breakpoints="{ '960px': '75vw', '640px': '90vw' }"
      :style="{ width: '50vw' }"
    >
      <p>There is an error from the server. Please re-try later!</p>
    </Dialog>
  </div>
</template>

<style scoped>
.neworder-container {
  max-width: 768px;
  margin: auto;
  min-height: calc(100vh - 100px);
}
</style>
