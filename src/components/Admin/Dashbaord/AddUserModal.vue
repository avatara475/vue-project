<template>
  <transition name="fade">
    <div v-if="isOpen" class="fixed inset-0 z-50 overflow-y-auto">
      <div class="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <!-- Background overlay -->
        <!-- <div class="fixed inset-0 transition-opacity" aria-hidden="true">
          <div class="absolute inset-0 bg-gray-500 opacity-75"></div>
        </div> -->

        <!-- Modal container -->
        <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
        
        <div class="inline-block align-bottom bg-white dark:bg-gray-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div class="px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div class="sm:flex sm:items-start">
              <div class="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-green-100 sm:mx-0 sm:h-10 sm:w-10">
                <svg class="h-6 w-6 text-green-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </div>
              <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                <h3 class="text-lg leading-6 font-medium text-gray-900 dark:text-white">
                  Add New User
                </h3>
                <div class="mt-4 space-y-4">
                  <div>
                    <label for="name" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Name</label>
                    <input
                      type="text"
                      id="name"
                      v-model="form.name"
                      @blur="handleBlur('name')"
                      class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                      :class="{ 'border-red-500': errors.name }"
                    />
                    <p v-if="errors.name" class="mt-1 text-sm text-red-600">{{ errors.name }}</p>
                  </div>
                  <div>
                    <label for="email" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Email</label>
                    <input
                      type="email"
                      id="email"
                      v-model="form.email"
                      @blur="handleBlur('email')"
                      class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                      :class="{ 'border-red-500': errors.email }"
                    />
                    <p v-if="errors.email" class="mt-1 text-sm text-red-600">{{ errors.email }}</p>
                  </div>
                  <div>
                    <label for="password" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Password</label>
                    <div class="relative mt-1">
                    <input
                      :type="showPassword ? 'text' : 'password'"
                      id="password"
                      v-model="form.password"
                      @blur="handleBlur('password')"
                      class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                      :class="{ 'border-red-500': errors.password }"
                    />
                    <button
                type="button"
                class="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-500"
                @click="togglePasswordVisibility"
              >
                <svg
                  class="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    :d="showPassword ? 'M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21' : 'M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z'"
                  />
                </svg>
              </button>
                    </div>
                    <p v-if="errors.password" class="mt-1 text-sm text-red-600">{{ errors.password }}</p>
                  </div>

                </div>
              </div>
            </div>
          </div>
          <div class="bg-gray-50 dark:bg-gray-700 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <button
              type="button"
              @click="submitForm"
              :disabled="isSubmitting"
              class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span v-if="!isSubmitting">Add User</span>
              <span v-else class="flex items-center">
                <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Adding...
              </span>
            </button>
            <button
              type="button"
              @click="close"
              class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm dark:bg-gray-600 dark:text-white dark:border-gray-500"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script setup>
import { ref, watch } from 'vue'
import axios from 'axios'
import { useToast } from 'vue-toastification'
import * as yup from 'yup'
import api from '@/api'

const toast = useToast()
const isOpen = ref(false)
const isSubmitting = ref(false)
const showPassword = ref(false);

const form = ref({
  name: '',
  email: '',
  password: ''
})

const errors = ref({})
const touched = ref({
  name: false,
  email: false,
  password: false
})

const schema = yup.object().shape({
  name: yup.string().required('Name is required'),
  email: yup.string().email('Invalid email').required('Email is required'),
  password: yup.string()
    .min(6, 'Password must be at least 6 characters')
    .required('Password is required'),
})

// Watch for changes and validate
watch(() => form.value.name, () => {
  if (touched.value.name) validateField('name')
})

watch(() => form.value.email, () => {
  if (touched.value.email) validateField('email')
})

watch(() => form.value.password, () => {
  if (touched.value.password) validateField('password')
})

const togglePasswordVisibility = () => {
  showPassword.value = !showPassword.value;
};

const validateField = async (field) => {
  try {
    await yup.reach(schema, field).validate(form.value[field])
    errors.value[field] = ''
  } catch (err) {
    errors.value[field] = err.message
  }
}

const validateForm = async () => {
  try {
    await schema.validate(form.value, { abortEarly: false })
    errors.value = {}
    return true
  } catch (err) {
    err.inner.forEach(error => {
      errors.value[error.path] = error.message
    })
    return false
  }
}

const handleBlur = (field) => {
  touched.value[field] = true
  validateField(field)
}

const emit = defineEmits(['user-added'])

const open = () => {
  resetForm()
  isOpen.value = true
}

const close = () => {
  isOpen.value = false
}

const resetForm = () => {
  form.value = {
    name: '',
    email: '',
    password: ''
  }
  errors.value = {}
  touched.value = {
    name: false,
    email: false,
    password: false
  }
}

const submitForm = async () => {
  // Mark all fields as touched on submit
  touched.value = {
    name: true,
    email: true,
    password: true
  }
  
  const isValid = await validateForm()
  if (!isValid) return
  
  try {
    isSubmitting.value = true
    
    const token = localStorage.getItem('authToken')
    // const response = await axios.post('http://192.168.1.22:3000/api/auth/register', form.value, {
    //   headers: {
    //     'Authorization': `Bearer ${token}`
    //   }
    // })

    const response = await api.post('/auth/register',form.value)
    
    toast.success('User added successfully')
    emit('user-added')
    close()
  } catch (error) {
    if (error.response) {
      toast.error(error.response?.message || 'Failed to add user')
    } else {
      toast.error('Network error occurred')
      console.error('Error adding user:', error)
    }
  } finally {
    isSubmitting.value = false
  }
}

defineExpose({ open, close })
</script>

<style scoped>
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
</style>