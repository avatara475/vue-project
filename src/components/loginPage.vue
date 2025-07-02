<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-md">
      <div>
        <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">Login</h2>
      </div>
      <form class="mt-8 space-y-6" @submit.prevent="handleSubmit">
        <div class="rounded-md space-y-4">
          <div>
            <label for="email" class="block text-sm font-medium text-gray-700">Email address</label>
            <input
              id="email"
              v-model="form.email"
              name="email"
              type="email"
              @blur="handleBlur('email')"
              autocomplete="email"
              class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-gray-950"
              :class="{ 'border-red-500': errors.email }"
            />
            <p v-if="errors.email" class="mt-1 text-sm text-red-600">
              {{ errors.email }}
            </p>
          </div>

          <div>
            <label for="password" class="block text-sm font-medium text-gray-700">Password</label>
            <div class="relative mt-1">
              <input
                id="password"
                v-model="form.password"
                name="password"
                @blur="handleBlur('password')"
                :type="showPassword ? 'text' : 'password'"
                autocomplete="current-password"
                class="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-gray-950 pr-10"
                :class="{ 'border-red-500': errors.password }"
              />
              <button
                type="button"
                class="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-500"
                @click="togglePasswordVisibility"
              >
                <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    :d="
                      showPassword
                        ? 'M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21'
                        : 'M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z'
                    "
                  />
                </svg>
              </button>
            </div>
            <p v-if="errors.password" class="mt-1 text-sm text-red-600">
              {{ errors.password }}
            </p>
          </div>
        </div>

        <div>
          <button
            type="submit"
            :disabled="isSubmitting"
            class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span v-if="!isSubmitting">Login</span>
            <span v-else class="flex items-center">
              <svg
                class="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
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
              Login...
            </span>
          </button>
          <div class="text-center mt-1">
            <span class="text-gray-800"
              >Don't Have An Account?<router-link to="/signup" class="text-blue-600 ml-2"
                >Signup</router-link
              >
            </span>
          </div>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from "vue";
import * as yup from "yup";
import { useRouter } from "vue-router";
import { useAuthStore } from "@/stores/auth";
import { useToast } from "vue-toastification";
import axios from "axios";
import api from "@/api";

const authStore = useAuthStore();
const toast = useToast();
const router = useRouter();
const showPassword = ref(false);

// Form state
const form = ref({
  email: "",
  password: "",
  rememberMe: false,
});

// Track touched fields
const touched = ref({
  email: false,
  password: false,
});

// Validation errors
const errors = ref({});
const isSubmitting = ref(false);

// Validation schema
const schema = yup.object().shape({
  email: yup.string().email("Please enter a valid email address").required("Email is required"),
  password: yup
    .string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
});

// Watch for changes and validate
watch(
  () => form.value.email,
  () => {
    if (touched.value.email) validateField("email");
  }
);

watch(
  () => form.value.password,
  () => {
    if (touched.value.password) validateField("password");
  }
);

const togglePasswordVisibility = () => {
  showPassword.value = !showPassword.value;
};

const handleBlur = (field) => {
  touched.value[field] = true;
  validateField(field);
};

const validateField = async (field) => {
  try {
    await yup.reach(schema, field).validate(form.value[field]);
    errors.value[field] = "";
  } catch (err) {
    errors.value[field] = err.message;
  }
};

const validateForm = async () => {
  try {
    await schema.validate(form.value, { abortEarly: false });
    errors.value = {};
    return true;
  } catch (err) {
    err.inner.forEach((error) => {
      errors.value[error.path] = error.message;
    });
    return false;
  }
};

// Form submission handler
const handleSubmit = async () => {
  // Mark all fields as touched on submit
  touched.value = {
    email: true,
    password: true,
  };

  const isValid = await validateForm();
  if (!isValid) return;

  isSubmitting.value = true;
  errors.value = {};

  try {
    // API call with Axios
    const response = await api.post("/auth/login", {
      email: form.value.email,
      password: form.value.password,
    });

    // Store authentication state
    authStore.login(response);
    localStorage.setItem("authToken", response.token);
    localStorage.setItem("userRole", response.user.role);
    localStorage.setItem("userId", response.user.id);

    // Show success message
    toast.success(response.message || "Login successful");

    // Redirect based on role
    const redirectPath = response.user.role === "admin" ? "/admin" : "/";
    router.push(redirectPath);
  } catch (err) {
    if (err.response) {
      // Axios error response
      const errorMessage = err.response.data?.message || "Login failed";
      toast.error(errorMessage);
    } else {
      // Network or other errors
      toast.error(err.message || "An error occurred during login");
    }
  } finally {
    isSubmitting.value = false;
  }
};
</script>
