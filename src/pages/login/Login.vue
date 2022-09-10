<script setup>
import { ref, reactive } from "vue";
import { useRouter } from "vue-router";
import InputText from "primevue/inputtext";
import Button from "primevue/button";
import Dialog from 'primevue/dialog';
import appServices from "../../appServices";
import { PATH, AUTH_SESSION } from "../../constant";

const router = useRouter();

const formData = reactive({
  username: "",
  password: ""
})
const isValid = reactive({
  username: true,
  password: true
})
const showPassword = ref(false);
const isLoading = ref(false);
const isServerError = ref(false)

const onFieldBlur = () => {
  isValid[field] = formData[field] !== ""
}

const togglePassword = () => {
  showPassword.value = !showPassword.value;
};

const handleFormSubmit = () => {
  if (formData.username === "") isValid.username = false;
  if (formData.password === "") isValid.password = false;
  if (formData.username === "" || formData.password === "") return;
  isLoading.value = true;
  appServices
    .login(formData)
    .then((res) => {
      sessionStorage.setItem(AUTH_SESSION, res.data.session)
      router.push(PATH.DASHBOARD);
    })
    .catch(() => {
      isServerError.value = true
    })
    .finally(() => {
      isLoading.value = false;
    });
};
</script>

<template>
  <div
    class="login-container flex flex-column justify-content-center bg-orange-1500"
  >
    <h2>Please login!</h2>
    <form @submit="handleFormSubmit" class="flex flex-column">
      <div class="col-12">
        <div class="p-inputgroup">
          <span class="p-inputgroup-addon">
            <i class="pi pi-user"></i>
          </span>
          <InputText
            placeholder="Username"
            v-model.trim="formData.username"
            @blur="() => onFieldBlur('username')"
            aria-describedby="username-help"
            :class="{ 'p-invalid': !isValid.username }"
          />
        </div>
        <small v-if="!isValid.username" id="username-help" class="p-error"
          >Username is required</small
        >
      </div>
      <div class="col-12">
        <div class="p-inputgroup">
          <span class="p-inputgroup-addon">
            <i class="pi pi-lock"></i>
          </span>
          <InputText
            :type="showPassword ? 'text' : 'password'"
            placeholder="Password"
            v-model.trim="formData.password"
            @blur="() => onFieldBlur('password')"
            aria-describedby="password-help"
            :class="{ 'p-invalid': !isValid.password }"
          />
          <span class="p-inputgroup-addon" @click="togglePassword">
            <i
              :class="{
                pi: true,
                'pi-eye': showPassword === false,
                'pi-eye-slash': showPassword === true,
              }"
            ></i>
          </span>
        </div>
        <small v-if="!isValid.password" id="password-help" class="p-error"
          >Password is required</small
        >
      </div>
      <div class="col-12 mt-4">
        <Button
          type="submit"
          :loading="isLoading"
          class="col-12"
          label="Login"
        />
      </div>
    </form>
    <Dialog
      header="Error"
      v-model:visible="isServerError"
      :breakpoints="{ '960px': '75vw', '640px': '90vw' }"
      :style="{ width: '50vw' }"
    >
      <p>
        There is an error from the server. Please re-try later!
      </p>
    </Dialog>
  </div>
</template>

<style scoped>
.login-container {
  max-width: 400px;
  margin: auto;
  height: calc(100vh - 100px);
}
</style>
