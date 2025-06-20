<template>

  <div class="container mx-auto px-4 py-12" >

    <!-- 403 Forbidden Message -->
    <div v-if="forbiddenError" class="forbidden-message bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md text-center">
      <h1 class="text-2xl font-bold text-red-600 mb-4">403 Forbidden</h1>
      <p class="text-gray-600 dark:text-gray-300 mb-6">You don't have permission to access this resource.</p>
      <!-- <button 
        @click="forbiddenError = true"
        class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        Go Back
      </button> -->
    </div>

    <!-- Main Content (only shown when no 403 error) -->
    <div v-else>
      <div class="flex flex-col sm:flex-row gap-4 mb-6">
  <!-- Total Users Card -->
  <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6 flex-1 min-w-[250px]">
    <div class="flex items-center justify-between">
      <div>
        <p class="text-sm font-medium text-gray-500 dark:text-gray-400">Total Users</p>
        <p class="text-2xl font-semibold text-gray-900 dark:text-white">{{ users.length }}</p>
      </div>
      <div class="p-3 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-200">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      </div>
    </div>
  </div>

  <!-- Total Products Card -->
  <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6 flex-1 min-w-[250px]">
    <div class="flex items-center justify-between">
      <div>
        <p class="text-sm font-medium text-gray-500 dark:text-gray-400">Total Products</p>
        <p class="text-2xl font-semibold text-gray-900 dark:text-white">{{ products}}</p>
      </div>
      <div class="p-3 rounded-full bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-200">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
        </svg>
      </div>
    </div>
  </div>
</div>
      <div class="mb-3">
            <UserInfoModal
            btitle="Show Admin Info"
            title="Admin Information"/>
      </div>
        <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold text-blue-600 ">User Management</h1>
      <button
        @click="openAddModal"
        class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        Add New User
      </button>
    </div>
    
    <div class="bg-white dark:bg-gray-800 shadow-md rounded-lg overflow-hidden">
      <div v-if="loading" class="p-8 text-center">
        <div class="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
        <p class="mt-2 text-gray-600 dark:text-gray-300">Loading users...</p>
      </div>
      
      <div v-else-if="error" class="p-4 bg-red-100 text-red-700 rounded">
        {{ error }}
      </div>
      
      <div v-else>
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700" v-if="users.length">
            <thead class="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">ID</th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Name</th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Email</th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Role</th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              <tr v-for="user in users" :key="user.id" class="hover:bg-gray-50 dark:hover:bg-gray-700">
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{{ user.id }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">{{ user.name }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{{ user.email }}</td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span 
                    :class="{
                      'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200': user.role === 'admin',
                      'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200': user.role === 'user'
                    }" 
                    class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full"
                  >
                    {{ user.role }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                 <button 
                    @click="editUser(user)"
                    class="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300 mr-4"
                  >
                    Edit
                  </button>
                  <button 
                    @click="deleteUser(user.id)"
                    class="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
          <table v-else class="text-white text-center ml-[40%]">
            No User available
          </table>
        </div>
        
        <!-- <div class="bg-gray-50 dark:bg-gray-700 px-4 py-3 flex items-center justify-between border-t border-gray-200 dark:border-gray-600 sm:px-6">
          <div class="flex-1 flex justify-between sm:hidden">
            <button 
              @click="prevPage"
              :disabled="currentPage === 1"
              class="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            >
              Previous
            </button>
            <button 
              @click="nextPage"
              :disabled="currentPage * itemsPerPage >= users.length"
              class="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            >
              Next
            </button>
          </div>
        </div> -->
      </div>
    </div>
  </div>
  </div>
    <ConfirmationModal
    ref="deleteModal"
    title="Delete User"
    message="Are you sure you want to delete this user? This action cannot be undone."
    confirmText="Delete User"
    @confirm="confirmDelete"
  />

   <EditUserModal 
    ref="editModal" 
    @saved="fetchUsers" 
  />

      <AddUserModal
      ref="addModal"
      @user-added="fetchUsers"
    />
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router';
import ConfirmationModal from './ConfirmationModal.vue'
import EditUserModal from './EditUserModal.vue'
import AddUserModal from './AddUserModal.vue'
import { useErrorStore } from '@/stores/error';
import UserInfoModal from '../../User/HomePage/UserInfoModal.vue'
import api from '@/api'
import { useAuthStore } from '@/stores/auth';

const router = useRouter();
const users = ref([]);
const products = ref();
const loading = ref(true);
const error = ref(null);
const currentPage = ref(1);
const itemsPerPage = 10;
const forbiddenError = ref(false);
const errorStore = useErrorStore();
const authStore = useAuthStore();

const addModal = ref(null)
const editModal = ref(null)
const deleteModal = ref(null)
const userToDelete = ref(null)

// Handle API errors including 403 redirect
const handleApiError = (err) => {
  if (err.response?.status === 403) {
    // Redirect to 403 page
    forbiddenError.value = true;
    errorStore.set403Error(true);

    // Force redirect to home if role changed
    const userRole = localStorage.getItem('userRole');
    if (userRole !== 'admin') {
      router.push('/');
    }

    return true; // Indicate that we handled a 403
  }
  
  // For other errors, set the error message
  error.value = err.response?.data?.message || err.message || 'An error occurred';
  console.error('API Error:', err);
  return false;
};

// const handleApiError = (err) => {
//   if (err.response?.status === 403) {
//     const userRole = localStorage.getItem('userRole');
//     const apiRole = err.response?.currentUserRole; // Assuming API returns this
//     console.log(apiRole)
//     // Check if roles match but still got 403
//     const roleMismatch = apiRole && userRole !== apiRole;
    
//     errorStore.set403Error(true, err.config.url, roleMismatch);
    
//     if (userRole !== 'admin') {
//       router.push('/');
//     }
//     return true;
//   }
  
//   error.value = err.response?.data?.message || err.message || 'An error occurred';
//   return false;
// };

// Inside <script setup>
const handleStorageChange = (event) => {
  if (event.key === 'userRole') {
    const newRole = event.newValue;
    if (newRole !== 'admin') {
      // If the user is no longer an admin, redirect to home
      router.push('/');
    }
  }
};

const openAddModal = () => {
  addModal.value.open()
}

const deleteUser = (userId) => {
  userToDelete.value = userId
  deleteModal.value.open()
}

const confirmDelete = async () => {
  try {
    const token = localStorage.getItem('authToken')
    // await axios.delete(`http://192.168.1.22:3000/api/auth/user/${userToDelete.value}`, {
    //   headers: {
    //     'Authorization': `Bearer ${token}`
    //   }
    // })

    await api.delete(`auth/user/${userToDelete.value}`)
    
    await fetchUsers()
    console.log('User deleted successfully')
  } catch (err) {
    if (!handleApiError(err)) {
      // Only show error message if it wasn't a 403
      error.value = err.response?.message || err.message || 'Failed to delete user'
    }
  } finally {
    userToDelete.value = null
  }
}

const fetchUsers = async () => {
  try {
    loading.value = true;
    error.value = null;
    
    // const response = await axios.get('http://192.168.1.22:3000/api/auth/users', {
    //   headers: {
    //     'Authorization': `Bearer ${token}`
    //   }
    // });

    const response = await api.get('/auth/users');
    
    users.value = response;
  } catch (err) {
    handleApiError(err);
  } finally {
    loading.value = false;
  }
};


const fetchProducts = async () => {
  try {
    loading.value = true;
    error.value = null;
    
    const token = localStorage.getItem('authToken');
    // const response = await axios.get('http://192.168.1.22:3000/api/products/get?page=1&limit=1', {
    //   headers: {
    //     'Authorization': `Bearer ${token}`
    //   }
    // });
    const response = await api.get('/products/get?page=1&limit=1');
    
    products.value = response.totalProducts;
  } catch (err) {
    handleApiError(err);
  } finally {
    loading.value = false;
  }
};


const editUser = (user) => {
  editModal.value.open(user)
}

const nextPage = () => {
  currentPage.value++;
};

const prevPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--;
  }
};

onMounted(() => {
  window.addEventListener('storage', handleStorageChange);
  fetchUsers();
  fetchProducts();
});

onUnmounted(() => {
  window.removeEventListener('storage', handleStorageChange);
});
</script>