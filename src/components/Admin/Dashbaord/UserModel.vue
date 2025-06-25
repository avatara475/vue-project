<template>
  <transition name="fade">
    <div v-if="isOpen" class="fixed inset-0 z-50 overflow-y-auto">
      <div class="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
        
        <div class="inline-block align-bottom bg-white dark:bg-gray-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div class="px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div class="sm:flex sm:items-start">
              <div class="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full" :class="mode === 'add' ? 'bg-green-100' : 'bg-blue-100'">
                <svg class="h-6 w-6" :class="mode === 'add' ? 'text-green-600' : 'text-blue-600'" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path v-if="mode === 'add'" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </div>
              <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                <h3 class="text-lg leading-6 font-medium text-gray-900 dark:text-white">
                  {{ mode === 'add' ? 'Add New User' : 'Edit User' }}
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

                  <!-- Email field (only for add mode) -->
                  <div v-if="mode === 'add'">
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

                  <!-- Password field (only for add mode) -->
                  <div v-if="mode === 'add'">
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

                  <!-- Role field (only for edit mode) -->
                  <div v-if="mode === 'edit'">
                    <label for="role" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Role</label>
                    <select
                      id="role"
                      v-model="form.role"
                      @blur="handleBlur('role')"
                      class="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                      :class="{ 'border-red-500': errors.role }"
                    >
                      <!-- <option value="superadmin" v-show="isSuperAdmin">Super Admin</option> -->
                      <option value="admin">Admin</option>
                      <option value="user">User</option>
                    </select>
                    <p v-if="errors.role" class="mt-1 text-sm text-red-600">{{ errors.role }}</p>
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
              class="lg:ml-3 md:ml-3 w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 focus:outline-none focus:ring-2 focus:ring-offset-2 sm:w-auto sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed" 
              :class="mode === 'add' ? 'bg-green-600 hover:bg-green-700' : 'bg-blue-600 hover:bg-blue-700'"
            >
              <span v-if="!isSubmitting">{{ mode === 'add' ? 'Add User' : 'Save Changes' }}</span>
              <span v-else class="flex items-center">
                <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                {{ mode === 'add' ? 'Adding...' : 'Saving...' }}
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
import { ref, watch, computed } from 'vue'
import { useToast } from 'vue-toastification'
import * as yup from 'yup'
import api from '@/api'

const props = defineProps({
  mode: {
    type: String,
    required: true,
    validator: (value) => ['add', 'edit'].includes(value)
  }
})

const toast = useToast()
const isOpen = ref(false)
const isSubmitting = ref(false)
const showPassword = ref(false)
const userId = ref(null)

const form = ref({
  name: '',
  email: '',
  password: '',
  role: 'user'
})

const errors = ref({})
const touched = ref({
  name: false,
  email: false,
  password: false,
  role: false
})

// Computed property for schema based on mode
const schema = computed(() => {
  const baseSchema = {
    name: yup.string().required('Name is required')
  }

  if (props.mode === 'add') {
    return yup.object().shape({
      ...baseSchema,
      email: yup.string().email('Invalid email').required('Email is required'),
      password: yup.string()
        .min(6, 'Password must be at least 6 characters')
        .required('Password is required')
    })
  }

  // Edit mode schema
  return yup.object().shape({
    ...baseSchema,
    role: yup.string()
      .oneOf(['admin', 'user'], 'Invalid role')
      .required('Role is required')
  })
})

// Watch for changes and validate touched fields
watch(() => form.value.name, () => {
  if (touched.value.name) validateField('name')
})

watch(() => form.value.email, () => {
  if (touched.value.email) validateField('email')
})

watch(() => form.value.password, () => {
  if (touched.value.password) validateField('password')
})

watch(() => form.value.role, () => {
  if (touched.value.role) validateField('role')
})

const togglePasswordVisibility = () => {
  showPassword.value = !showPassword.value
}

const validateField = async (field) => {
  try {
    await yup.reach(schema.value, field).validate(form.value[field])
    errors.value[field] = ''
  } catch (err) {
    errors.value[field] = err.message
  }
}

const validateForm = async () => {
  try {
    await schema.value.validate(form.value, { abortEarly: false })
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

const emit = defineEmits(['user-added', 'user-updated'])

const open = (user = null) => {
  if (props.mode === 'edit' && user) {
    userId.value = user.id
    form.value = {
      name: user.name,
      role: user.role,
      // Clear these fields in edit mode
      email: '',
      password: ''
    }
    // In edit mode, don't mark fields as touched initially
    touched.value = {
      name: false,
      email: false,
      password: false,
      role: false
    }
  } else {
    resetForm()
    // In add mode, mark all fields as touched for immediate validation
    if (props.mode === 'add') {
      touched.value = {
        name: true,
        email: true,
        password: true,
        role: true
      }
    }
  }
  isOpen.value = true
}

const close = () => {
  isOpen.value = false
  resetForm()
}

const resetForm = () => {
  form.value = {
    name: '',
    email: '',
    password: '',
    role: 'user'
  }
  errors.value = {}
  touched.value = {
    name: false,
    email: false,
    password: false,
    role: false
  }
  showPassword.value = false
}

const isSuperAdmin = computed(() => localStorage.getItem('userRole') === 'superadmin')

const submitForm = async () => {
  // Mark all fields as touched on submit
  Object.keys(touched.value).forEach(key => {
    touched.value[key] = true
  })
  
  const isValid = await validateForm()
  if (!isValid) return
  
  try {
    isSubmitting.value = true
    
    if (props.mode === 'add') {
      // Add user
      await api.post('/auth/register', {
        name: form.value.name,
        email: form.value.email,
        password: form.value.password
      })
      toast.success('User added successfully')
      emit('user-added')
    } else {
      // Edit user
      await api.put(`/auth/user/${userId.value}`, {
        name: form.value.name,
        role: form.value.role
      })
      toast.success('User updated successfully')

      // If editing current user's own role, trigger immediate update
      if (userId.value === localStorage.getItem('userId')) {
        localStorage.setItem('userRole', form.value.role)
        window.dispatchEvent(new StorageEvent('storage', {
          key: 'forceLogout',
          newValue: 'true',
          storageArea: localStorage,
        }))
      }

      emit('user-updated')
    }
    
    close()
  } catch (error) {
    toast.error(error.response?.data?.message || `Failed to ${props.mode === 'add' ? 'add' : 'update'} user`)
    console.error(`Error ${props.mode === 'add' ? 'adding' : 'updating'} user:`, error)
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