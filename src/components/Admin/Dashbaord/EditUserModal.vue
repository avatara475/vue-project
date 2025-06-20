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
              <div class="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 sm:mx-0 sm:h-10 sm:w-10">
                <svg class="h-6 w-6 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </div>
              <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                <h3 class="text-lg leading-6 font-medium text-gray-900 dark:text-white">
                  Edit User
                </h3>
                <div class="mt-4 space-y-4">
                  <div>
                    <label for="name" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Name</label>
                    <input
                      type="text"
                      id="name"
                      v-model="form.name"
                      class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    />
                  </div>
                  <div>
                    <label for="role" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Role</label>
                    <select
                      id="role"
                      v-model="form.role"
                      class="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    >
                      <!-- <option value="superadmin" v-show="isSuperAdmin">Super Admin</option> -->
                      <option value="admin">Admin</option>
                      <option value="user">User</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="bg-gray-50 dark:bg-gray-700 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <button
              type="button"
              @click="saveChanges"
              :disabled="isSaving"
              class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span v-if="!isSaving">Save</span>
              <span v-else class="flex items-center">
                <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Saving...
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
import { ref,computed } from 'vue'
import axios from 'axios'
import { useToast } from 'vue-toastification'
import api from '@/api'

const toast = useToast()
const isOpen = ref(false)
const isSaving = ref(false)
const userId = ref(null)

const form = ref({
  name: '',
  role: 'user'
})

const emit = defineEmits(['saved'])

const open = (user) => {
  userId.value = user.id
  form.value = {
    name: user.name,
    role: user.role
  }
  isOpen.value = true
}

const close = () => {
  isOpen.value = false
}

const isSuperAdmin = computed(() => localStorage.getItem('userRole') === 'superadmin');

const saveChanges = async () => {
  try {
    isSaving.value = true
    const token = localStorage.getItem('authToken')
    
    // await axios.put(`http://192.168.1.22:3000/api/auth/user/${userId.value}`, {
    //   name: form.value.name,
    //   role: form.value.role
    // }, {
    //   headers: {
    //     'Authorization': `Bearer ${token}`
    //   }
    // })
    await api.put(`/auth/user/${userId.value}`,{
      name: form.value.name,
      role: form.value.role
    })
    
    toast.success('User updated successfully')

    // If editing current user's own role, trigger immediate update
    if (userId.value === localStorage.getItem('userId')) {
      localStorage.setItem('userRole', form.value.role)
      // window.dispatchEvent(new StorageEvent('storage', {
      //   key: 'userRole',
      //   newValue: form.value.role
      // }))

      window.dispatchEvent(new StorageEvent('storage', {
      key: 'forceLogout',
      newValue: 'true',
      storageArea: localStorage,
    }));
    }

    emit('saved')
    close()
  } catch (error) {
    toast.error(error.response?.data?.message || 'Failed to update user')
    console.error('Error updating user:', error)
  } finally {
    isSaving.value = false
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