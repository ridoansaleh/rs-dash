<script setup>
import { ref, reactive, computed, watch } from "vue";
import { useRouter } from "vue-router";
import InputText from "primevue/inputtext";
import Dropdown from "primevue/dropdown";
import Button from "primevue/button";
import Dialog from "primevue/dialog";
import Breadcrumb from "primevue/breadcrumb";
import appServices from "../../appServices";
import { PATH, AUTH_SESSION } from "../../constant";
import Order from './Order'
import {
  countryList,
  provinceList,
  cityList,
  paymentTypeList,
} from "./data";

const toKeyValue = (arr = []) => arr.map((d) => ({ name: d, code: d }));

const router = useRouter();
const order = new Order()
const formData = reactive(order.initialValues);
const isValid = reactive(order.initialValidation);
const isLoading = ref(false);
const isServerError = ref(false);
const isSuccess = ref(false);
const countries = ref(countryList);

const provinces = computed(() => {
  let list = provinceList[formData.consigneeCountry];
  return toKeyValue(list);
});

const cities = computed(() => {
  let list = cityList[formData.consigneeProvince];
  return toKeyValue(list);
});
const paymentTypes = ref(toKeyValue(paymentTypeList));

const dashboard = {
  icon: "pi pi-table",
  to: PATH.DASHBOARD,
};

const menuItems = [
  { label: "Dashboard", to: PATH.DASHBOARD },
  { label: "New Order", to: PATH.NEW_ORDER },
];

watch(() => formData.consigneeCountry, (newVal, prevVal) => {
  formData.consigneeProvince = provinces.value.length === 1 ? provinces.value[0].name : ""
  formData.consigneeCity = ""
  if (prevVal && newVal !== "") {
    isValid.consigneeProvince = validateValue(formData.consigneeProvince)
    isValid.consigneeCity = validateValue(formData.consigneeCity)
  }
})

watch(() => formData.consigneeProvince, (newVal) => {
  formData.consigneeCity = cities.value.length === 1 ? cities.value[0].name : ""
  if (newVal !== "") {
    isValid.consigneeCity = validateValue(formData.consigneeCity)
  }
})

const validateValue = (value) => {
  if (typeof value === "number") return value > 0;
  return ![null, ""].includes(value);
};

const onFieldChange = (field) => {
  isValid[field] = validateValue(formData[field]);
};

const scrollUpOnError = () => {
  setTimeout(() => {
    document.querySelector('.p-invalid').scrollIntoView({
      behavior: 'smooth'
    });
  }, 500)
}

const handleFormSubmit = () => {
  for (const field in formData) {
    isValid[field] = validateValue(formData[field]);
  }
  const validStatuses = Object.values(isValid);
  if (validStatuses.some((valid) => valid === false)) return scrollUpOnError()
  isLoading.value = true;
  const session = sessionStorage.getItem(AUTH_SESSION);
  appServices
    .createOrder(
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
          formData[field] = order.initialValues[field];
        }
      }
      isLoading.value = false;
    });
};
</script>

<template>
  <div class="neworder-container flex flex-column">
    <h2 class="text-3xl text-blue-500">New Order</h2>
    <Breadcrumb class="mb-6" :home="dashboard" :model="menuItems" />
    <form @submit.prevent="handleFormSubmit" class="grid" autocomplete="off" novalidate>
      <div class="field col-12 md:col-6">
        <label for="ConsigneeName">Consignee Name</label>
        <InputText
          id="ConsigneeName"
          v-model.trim="formData.consigneeName"
          @input="() => onFieldChange('consigneeName')"
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
      <div class="field col-12 md:col-6">
        <label for="ConsigneeAddress">Consignee Address</label>
        <InputText
          id="ConsigneeAddress"
          v-model.trim="formData.consigneeAddress"
          @input="() => onFieldChange('consigneeAddress')"
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
      <div class="field col-12 md:col-6">
        <label for="ConsigneeCountry">Consignee Country</label>
        <Dropdown
          id="ConsigneeCountry"
          v-model="formData.consigneeCountry"
          :options="countries"
          @change="() => onFieldChange('consigneeCountry')"
          optionLabel="name"
          optionValue="code"
          placeholder="Select"
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
      <div class="field col-12 md:col-6">
        <label for="ConsigneeProvince">Consignee Province</label>
        <Dropdown
          id="ConsigneeProvince"
          v-model="formData.consigneeProvince"
          :options="provinces"
          @change="() => onFieldChange('consigneeProvince')"
          optionLabel="name"
          optionValue="code"
          placeholder="Select"
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
      <div class="field col-12 md:col-6">
        <label for="ConsigneeCity">Consignee City</label>
        <Dropdown
          id="ConsigneeCity"
          v-model="formData.consigneeCity"
          :options="cities"
          @change="() => onFieldChange('consigneeCity')"
          optionLabel="name"
          optionValue="code"
          placeholder="Select"
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
      <div class="field col-12 md:col-6">
        <label for="ConsigneePostalCode">Consignee Postal Code</label>
        <InputText
          id="ConsigneePostalCode"
          type="number"
          v-model.number="formData.consigneePostalCode"
          @input="() => onFieldChange('consigneePostalCode')"
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
      <div class="field col-12 md:col-6">
        <label for="ConsigneeNumber">Consignee Number</label>
        <InputText
          id="ConsigneeNumber"
          type="number"
          v-model.number="formData.consigneeNumber"
          @input="() => onFieldChange('consigneeNumber')"
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
      <div class="field col-12 md:col-6">
        <label for="height">Height</label>
        <InputText
          id="height"
          type="number"
          v-model.number="formData.height"
          @input="() => onFieldChange('height')"
          aria-describedby="height-help"
          :class="{ 'w-full': true, 'p-invalid': !isValid.height }"
        />
        <small v-if="!isValid.height" id="height-help" class="p-error"
          >Height is required</small
        >
      </div>
      <div class="field col-12 md:col-6">
        <label for="weight">Weight</label>
        <InputText
          id="weight"
          type="number"
          v-model.number="formData.weight"
          @input="() => onFieldChange('weight')"
          aria-describedby="weight-help"
          :class="{ 'w-full': true, 'p-invalid': !isValid.weight }"
        />
        <small v-if="!isValid.weight" id="weight-help" class="p-error"
          >Weight is required</small
        >
      </div>
      <div class="field col-12 md:col-6">
        <label id="length">Length</label>
        <InputText
          id="length"
          type="number"
          v-model.number="formData.length"
          @input="() => onFieldChange('length')"
          aria-describedby="length-help"
          :class="{ 'w-full': true, 'p-invalid': !isValid.length }"
        />
        <small v-if="!isValid.length" id="length-help" class="p-error"
          >Length is required</small
        >
      </div>
      <div class="field col-12 md:col-6">
        <label id="width">Width</label>
        <InputText
          id="width"
          type="number"
          v-model.number="formData.width"
          @input="() => onFieldChange('width')"
          aria-describedby="width-help"
          :class="{ 'w-full': true, 'p-invalid': !isValid.width }"
        />
        <small v-if="!isValid.width" id="width-help" class="p-error"
          >Width is required</small
        >
      </div>
      <div class="field col-12 md:col-6">
        <label for="PaymentType">Payment Type</label>
        <Dropdown
          id="PaymentType"
          v-model="formData.paymentType"
          :options="paymentTypes"
          @change="() => onFieldChange('paymentType')"
          optionLabel="name"
          optionValue="code"
          placeholder="Select"
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
      <div class="col-12 md:flex md:justify-content-end">
        <Button
          type="submit"
          :loading="isLoading"
          class="col-12 md:col-4"
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
            @click="isSuccess = false"
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
      <p>The server has returned an error. Please re-try later!</p>
    </Dialog>
  </div>
</template>

<style scoped>
.neworder-container {
  max-width: var(--max-screen-width);
  margin: auto;
  min-height: calc(100vh - 100px);
}
</style>
