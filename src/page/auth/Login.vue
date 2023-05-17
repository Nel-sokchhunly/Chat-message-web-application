<template>
  <main
    class="p-4 h-full w-full flex flex-col items-center justify-center space-y-8"
  >
    <!-- header -->
    <div class="flex justify-center items-center space-x-4">
      <img src="icon/chat-high-quality.png" height="72" width="72" />
    </div>

    <!-- login form -->
    <FormKit
      v-if="formState === FormState.login"
      type="form"
      submit-label="Login"
      @submit="handleLogin"
      :actions="false"
      class="flex"
      :classes="{
        message: 'mt-4 text-sm text-red-600'
      }"
    >
      <FormKit
        type="text"
        label="Email"
        v-model="email"
        placeholder="enter your kit email"
        :validation="[
          ['required'],
          ['matches', /^[A-Za-z0-9._%+-]+@kit\.edu\.kh$/]
        ]"
        validation-visibility="blur"
        :validation-messages="{
          matches: 'email must be KIT email'
        }"
        :classes="{
          outer: 'mb-5 w-[300px]',
          label: 'block mb-1 font-bold text-sm',
          inner:
            'max-w-md border border-gray-400 rounded-lg mb-1 overflow-hidden focus-within:border-blue-500',
          input:
            'w-full h-10 px-3 border-none text-base text-gray-700 placeholder-gray-400',
          help: 'text-sm text-gray-500',
          message: 'text-sm text-red-600'
        }"
      />
      <FormKit
        type="password"
        label="Password"
        min="8"
        max="20"
        v-model="password"
        placeholder="enter your password"
        validation="required|length:8,20"
        validation-visibility="blur"
        :validation-messages="{
          matches:
            'Password must contain at least one number, one uppercase,\n one lowercase, and one special character'
        }"
        :classes="{
          outer: 'mb-5 w-[300px]',
          label: 'block mb-1 font-bold text-sm',
          inner:
            'max-w-md border border-gray-400 rounded-lg mb-1 overflow-hidden focus-within:border-blue-500',
          input:
            'w-full h-10 px-3 border-none text-base text-gray-700 placeholder-gray-400',
          help: 'text-xs text-gray-500',
          message: 'text-sm text-red-600'
        }"
      />

      <!-- submit button -->
      <button type="submit" class="mt-6 w-[200px]" :disabled="isRequestingApi">
        <div
          v-if="!isRequestingApi"
          class="w-full py-4 bg-secondary text-center text-gray-900 font-bold rounded cursor-pointer"
        >
          Login
        </div>
        <span v-else
          ><div
            type="button"
            class="w-full inline-flex justify-center items-center px-8 py-4 font-bold leading-6 rounded-md text-gray-900 bg-opacity-50 bg-primary hover:bg-alt-primary transition ease-in-out duration-150 cursor-not-allowed"
            disabled
          >
            <svg
              class="animate-spin -ml-1 mr-3 h-5 w-5 text-gray-900"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                class="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                stroke-width="4"
              ></circle>
              <path
                class="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>

            Loading...
          </div></span
        >
      </button>
    </FormKit>
    <!-- signup form -->
    <FormKit
      type="form"
      submit-label="Signup"
      :actions="false"
      @submit="handleSignup"
      class="flex"
      :classes="{
        message: 'mt-4 text-sm text-red-600'
      }"
      v-if="formState === FormState.signup"
    >
      <!-- email -->
      <FormKit
        type="text"
        label="Email"
        v-model="email"
        placeholder="enter your kit email"
        :validation="[
          ['required'],
          ['matches', /^[A-Za-z0-9._%+-]+@kit\.edu\.kh$/]
        ]"
        validation-visibility="blur"
        :validation-messages="{
          matches: 'email must be KIT email'
        }"
        :classes="{
          outer: 'mb-5 w-[300px]',
          label: 'block mb-1 font-bold text-sm',
          inner:
            'max-w-md border border-gray-400 rounded-lg mb-1 overflow-hidden focus-within:border-blue-500',
          input:
            'w-full h-10 px-3 border-none text-base text-gray-700 placeholder-gray-400',
          help: 'text-sm text-gray-500',
          message: 'text-sm text-red-600'
        }"
      />

      <!-- password -->
      <FormKit
        type="password"
        label="Password"
        name="password"
        min="8"
        max="20"
        v-model="password"
        placeholder="enter your password"
        validation="required|length:8,20"
        validation-visibility="blur"
        :validation-messages="{
          matches:
            'Password must contain at least one number, one uppercase,\n one lowercase, and one special character'
        }"
        :classes="{
          outer: 'mb-5 w-[300px]',
          label: 'block mb-1 font-bold text-sm',
          inner:
            'max-w-md border border-gray-400 rounded-lg mb-1 overflow-hidden focus-within:border-blue-500',
          input:
            'w-full h-10 px-3 border-none text-base text-gray-700 placeholder-gray-400',
          help: 'text-xs text-gray-500',
          message: 'text-sm text-red-600'
        }"
      />
      <!-- confirm password -->
      <FormKit
        type="password"
        label="Confirm Password"
        name="password_confirm"
        min="8"
        max="20"
        placeholder="enter your password"
        validation="required|confirm"
        validation-visibility="blur"
        :classes="{
          outer: 'mb-5 w-[300px]',
          label: 'block mb-1 font-bold text-sm',
          inner:
            'max-w-md border border-gray-400 rounded-lg mb-1 overflow-hidden focus-within:border-blue-500',
          input:
            'w-full h-10 px-3 border-none text-base text-gray-700 placeholder-gray-400',
          help: 'text-xs text-gray-500',
          message: 'text-sm text-red-600'
        }"
      />

      <!-- submit button -->
      <button type="submit" class="mt-6 w-[200px]" :disabled="isRequestingApi">
        <div
          v-if="!isRequestingApi"
          class="w-full py-4 bg-secondary text-center text-gray-900 font-bold rounded cursor-pointer"
        >
          Signup
        </div>
        <span v-else
          ><div
            type="button"
            class="w-full inline-flex justify-center items-center px-8 py-4 font-bold leading-6 rounded-md text-gray-900 bg-opacity-50 bg-primary hover:bg-alt-primary transition ease-in-out duration-150 cursor-not-allowed"
            disabled
          >
            <svg
              class="animate-spin -ml-1 mr-3 h-5 w-5 text-gray-900"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                class="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                stroke-width="4"
              ></circle>
              <path
                class="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>

            Loading...
          </div></span
        >
      </button>
    </FormKit>

    <!-- switch form -->
    <div v-if="formState === FormState.login">
      Don't have an account?
      <button
        @click="handleSwitchingFormState(FormState.signup)"
        class="font-medium text-primary"
      >
        Signup
      </button>
    </div>
    <div v-if="formState === FormState.signup">
      Already have an account?
      <button
        @click="handleSwitchingFormState(FormState.login)"
        class="font-medium text-primary"
      >
        Login
      </button>
    </div>
  </main>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { FormState, SignupForm } from '../../types/auth';
import { Login, Signup } from '../../helpers/auth';

const formState = ref<FormState>(FormState.login);

// form inputs
const email = ref<string>('');
const password = ref<string>('');

const isRequestingApi = ref(false);

const handleSwitchingFormState = (state: FormState) => {
  email.value = '';
  password.value = '';

  formState.value = state;
};

const handleLogin = async () => {
  if (!email && !password) return;

  isRequestingApi.value = true;

  await Login({
    email: email.value as string,
    password: password.value as string
  });
};

const handleSignup = async () => {
  if (!email && !password) return;
  isRequestingApi.value = true;

  const username = email.value.substring(0, email.value.lastIndexOf('@'));

  const formData: SignupForm = {
    username,
    email: email.value,
    password: password.value,
    passwordConfirm: password.value
  };

  const result: any = await Signup(formData);

  console.log('====================================');
  console.log(result);
  console.log('====================================');

  isRequestingApi.value = false;
};
</script>

<style>
.formkit-form {
  width: inherit !important;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
</style>
