<template>
  <div class="container mx-auto px-4 py-12">
    <!-- 403 Forbidden Message -->
    <div v-if="forbiddenError" class="forbidden-message bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md text-center">
      <h1 class="text-2xl font-bold text-red-600 mb-4">403 Forbidden</h1>
      <p class="text-gray-600 dark:text-gray-300 mb-6">You don't have permission to access this resource.</p>
    </div>

    <!-- Main Content (only shown when no 403 error) -->
    <div v-else>
      <div class="flex flex-col sm:flex-row gap-4 mb-6">
        <!-- Total Users Card -->
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6 flex-1 min-w-[250px]">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-500 dark:text-gray-400">Total Users</p>
              <p class="text-2xl font-semibold text-gray-900 dark:text-white">{{ totaluser }}</p>
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
              <p class="text-2xl font-semibold text-gray-900 dark:text-white">{{ products }}</p>
            </div>
            <div class="p-3 rounded-full bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-200">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
          </div>
        </div>
      </div>
      
      <div class="mb-3 flex  justify-between">
        <UserInfoModal
          btitle="Show Admin Info"
          title="Admin Information"/>

          <button
          @click="openAddModal"
          class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Add New User
        </button>
      </div>
      
      <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h1 class="text-2xl font-bold text-blue-600">User Management</h1>

        <div class="flex flex-col sm:flex-row gap-4 w-full sm:w-auto items-end sm:items-center">
          <!-- Search Input -->
          <div class="relative flex-grow min-w-[200px]">
            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg class="h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clip-rule="evenodd" />
              </svg>
            </div>
            <input
              v-model="searchQuery"
              @input="handleSearch"
              type="text"
              class="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              placeholder="Search users..."
            />
          </div>
          
        </div>
      </div>
      
      
      <!-- Reusable Table Component -->
      <ReusableTable
        :data="users"
        :columns="columns"
        :loading="loading"
        :error="error"
        :current-page="currentPage"
        :total-pages="totalPages"
        :total-items="totaluser"
        :items-per-page="itemsPerPage"
        :items-per-page-options="[5, 10, 20, 30, 50]"
        show-pagination
        show-actions
        show-edit
        show-delete
        @edit="editUser"
        @delete="deleteUser"
        @prev-page="prevPage"
        @next-page="nextPage"
        @page-change="goToPage"
        @items-per-page-change="changeItemsPerPage"
      />
      
      <ConfirmationModal
        ref="deleteModal"
        title="Delete User"
        message="Are you sure you want to delete this user? This action cannot be undone."
        confirmText="Delete User"
        @confirm="confirmDelete"
      />

      <UserModal ref="addUserModal" mode="add" @user-added="fetchUsers" />
      <UserModal ref="editUserModal" mode="edit" @user-updated="fetchUsers" />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed,h } from 'vue';
import { useRouter } from 'vue-router';
import ConfirmationModal from './ConfirmationModal.vue';
import { useErrorStore } from '@/stores/error';
import UserInfoModal from '../../User/HomePage/UserInfoModal.vue';
import api from '@/api';
import { useAuthStore } from '@/stores/auth';
import UserModal from './UserModel.vue';
import ReusableTable from '@/ReusableTable.vue';

const router = useRouter();
const users = ref([]);
const products = ref();
const loading = ref(true);
const error = ref(null);
const currentPage = ref(1);
const itemsPerPage = ref(10);
const totalPages = ref(1);
const forbiddenError = ref(false);
const errorStore = useErrorStore();
const authStore = useAuthStore();
const totaluser = ref();
const searchQuery = ref('');
const searchTimeout = ref(null);

const columns = ref([
  { key: 'name', label: 'Name', sortable: true },
  { key: 'email', label: 'Email', sortable: true },
  { 
    key: 'role', 
    label: 'Role', 
    sortable: true,
    customRender: ({ value, item }) => {
      return h('span', {
        class: {
          'px-2 inline-flex text-xs leading-5 font-semibold rounded-full': true,
          'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200': value === 'admin',
          'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200': value === 'user'
        }
      }, value);
    }
  }
]);

const addUserModal = ref(null);
const editUserModal = ref(null);
const deleteModal = ref(null);
const userToDelete = ref(null);

const editUser = (user) => {
  editUserModal.value.open(user);
};

const deleteUser = (userId) => {
  userToDelete.value = userId;
  deleteModal.value.open();
};

const handleApiError = (err) => {
  if (err.response?.status === 403) {
    forbiddenError.value = true;
    errorStore.set403Error(true);

    const userRole = localStorage.getItem('userRole');
    if (userRole !== 'admin') {
      router.push('/');
    }

    return true;
  }
  
  error.value = err.response?.data?.message || err.message || 'An error occurred';
  console.error('API Error:', err);
  return false;
};

const handleStorageChange = (event) => {
  if (event.key === 'userRole') {
    const newRole = event.newValue;
    if (newRole !== 'admin') {
      router.push('/');
    }
  }
};

const openAddModal = () => {
  addUserModal.value.open();
};

const confirmDelete = async () => {
  try {
    await api.delete(`auth/user/${userToDelete.value}`);
    await fetchUsers();
    console.log('User deleted successfully');
  } catch (err) {
    if (!handleApiError(err)) {
      error.value = err.response?.message || err.message || 'Failed to delete user';
    }
  } finally {
    userToDelete.value = null;
  }
};

const handleSearch = () => {
  clearTimeout(searchTimeout.value);
  searchTimeout.value = setTimeout(() => {
    currentPage.value = 1;
    fetchUsers();
  }, 500);
};

const fetchUsers = async () => {
  try {
    loading.value = true;
    error.value = null;
    
    const params = {
      search: searchQuery.value.trim(),
      page: currentPage.value,
      limit: itemsPerPage.value
    };

    const response = await api.get('/auth/users', { params });
    
    users.value = response.users;
    totaluser.value = response.totalusers;
    totalPages.value = Math.ceil(response.totalusers / itemsPerPage.value);
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
    
    const response = await api.get('/products/get?page=1&limit=1');
    products.value = response.totalProducts;
  } catch (err) {
    handleApiError(err);
  } finally {
    loading.value = false;
  }
};

const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++;
    fetchUsers();
  }
};

const prevPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--;
    fetchUsers();
  }
};

const goToPage = (page) => {
  currentPage.value = page;
  fetchUsers();
};

const changeItemsPerPage = (newSize) => {
  itemsPerPage.value = parseInt(newSize);
  currentPage.value = 1;
  fetchUsers();
};

onMounted(() => {
  window.addEventListener('storage', handleStorageChange);
  fetchUsers();
  fetchProducts();
});

onUnmounted(() => {
  window.removeEventListener('storage', handleStorageChange);
  clearTimeout(searchTimeout.value);
});
</script>