<template>
  <div class="container mx-auto px-4 py-12">
    <!-- 403 Forbidden Message -->
    <div v-if="forbiddenError" class="forbidden-message bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md text-center">
      <h1 class="text-2xl font-bold text-red-600 mb-4">403 Forbidden</h1>
      <p class="text-gray-600 dark:text-gray-300 mb-6">You don't have permission to access this resource.</p>
    </div>

    <!-- Main Content -->
    <div v-else>
      <div class="flex flex-col sm:flex-row gap-4 mb-6">
        <!-- Total Admins Card -->
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6 flex-1 min-w-[250px]">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-500 dark:text-gray-400">Total Admins</p>
              <p class="text-2xl font-semibold text-gray-900 dark:text-white">{{ totalAdmin }}</p>
            </div>
            <div class="p-3 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-200">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
          </div>
        </div>

        <!-- Total Users Card -->
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6 flex-1 min-w-[250px]">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-500 dark:text-gray-400">Total Users</p>
              <p class="text-2xl font-semibold text-gray-900 dark:text-white">{{ totalUsers }}</p>
            </div>
            <div class="p-3 rounded-full bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-200">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      <div class="mb-3 flex justify-between">
            <UserInfoModal
            btitle="Show SuperAdmin Info"
            title="SuperAdmin Information"/>

            <button
        @click="openAddModal"
        class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        Add New User
      </button>
      </div>
      <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h1 class="text-2xl font-bold text-blue-600">Admin Management</h1>

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
              @input="debouncedSearch"
              type="text"
              class="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              placeholder="Search users..."
            />
          </div>
          
          <!-- Add Admin Button -->
          <!-- <button
            @click="openAddModal"
            class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Add New Admin
          </button> -->
        </div>
      </div>
      
      <div class="bg-white dark:bg-gray-800 shadow-md rounded-lg overflow-hidden">
        <div v-if="loading" class="p-8 text-center">
          <div class="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
          <p class="mt-2 text-gray-600 dark:text-gray-300">Loading admins...</p>
        </div>
        
        <div v-else-if="error" class="p-4 bg-red-100 text-red-700 rounded">
          {{ error }}
        </div>
        
        <div v-else>
          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700" v-if="admins.length">
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
                <tr v-for="admin in admins" :key="admin.id" class="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{{ admin.id }}</td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">{{ admin.name }}</td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{{ admin.email }}</td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <span 
                      :class="{
                        'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200': admin.role === 'admin',
                        'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200': admin.role === 'user',
                        'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200': admin.role === 'superadmin'
                      }" 
                      class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full"
                    >
                      {{ admin.role }}
                    </span>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button 
                      @click="editAdmin(admin)"
                      class="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300 mr-4"
                    >
                      Edit
                    </button>
                    <button 
                      @click="deleteAdmin(admin.id)"
                      class="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
            <table v-else class="text-white text-center ml-[40%]">
            No data available
          </table>
          </div>
          
          <!-- Pagination -->
          <div class="bg-gray-50 dark:bg-gray-700 px-2 sm:px-4 py-3 flex flex-col sm:flex-row items-center justify-between gap-2 sm:gap-0 border-t border-gray-200 dark:border-gray-600">
            <!-- Mobile Pagination -->
            <div class="flex-1 flex justify-between sm:hidden w-full">
              <button 
                @click="prevPage"
                :disabled="currentPage === 1"
                class="relative inline-flex items-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 dark:bg-gray-600 dark:text-white dark:border-gray-500 disabled:opacity-50"
              >
                Previous
              </button>
              <span class="text-sm text-gray-700 dark:text-gray-300 mx-2 self-center">
                Page {{ currentPage }} of {{ totalPages }}
              </span>
              <button 
                @click="nextPage"
                :disabled="currentPage === totalPages"
                class="relative inline-flex items-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 dark:bg-gray-600 dark:text-white dark:border-gray-500 disabled:opacity-50"
              >
                Next
              </button>
            </div>
            
            <!-- Desktop Pagination -->
            <div class="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between w-full">
              <div class="flex items-center space-x-2">
                <p class="text-sm text-gray-700 dark:text-gray-300">
                  Show
                </p>
                <select
                  v-model="itemsPerPage"
                  @change="handleItemsPerPageChange"
                  class="block w-20 pl-3 pr-8 py-1 text-sm border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 rounded-md dark:bg-gray-600 dark:text-white dark:border-gray-500"
                >
                  <option v-for="option in itemsPerPageOptions" :key="option" :value="option">
                    {{ option }}
                  </option>
                </select>
                <p class="text-sm text-gray-700 dark:text-gray-300">
                  per page
                </p>
              </div>
              <div>
                <p class="text-sm text-gray-700 dark:text-gray-300">
                  Showing <span class="font-medium">{{ (currentPage - 1) * itemsPerPage + 1 }}</span>
                  to <span class="font-medium">{{ Math.min(currentPage * itemsPerPage, totalUsersCount) }}</span>
                  of <span class="font-medium">{{ totalUsersCount }}</span>
                </p>
              </div>
              <div>
                <nav class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                  <button
                    @click="prevPage"
                    :disabled="currentPage === 1"
                    class="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 dark:bg-gray-600 dark:text-white dark:border-gray-500 disabled:opacity-50"
                  >
                    <span class="sr-only">Previous</span>
                    <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <path fill-rule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clip-rule="evenodd" />
                    </svg>
                  </button>
                  <template v-for="page in visiblePages" :key="page">
                    <button
                      v-if="Math.abs(page - currentPage) <= 2 || page === 1 || page === totalPages"
                      @click="goToPage(page)"
                      :class="[page === currentPage ? 'bg-blue-50 border-blue-500 text-blue-600 dark:bg-blue-800 dark:text-white' : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50 dark:bg-gray-600 dark:text-gray-300', 'relative inline-flex items-center px-4 py-2 border text-sm font-medium']"
                    >
                      {{ page }}
                    </button>
                    <span 
                      v-else-if="Math.abs(page - currentPage) === 3" 
                      class="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 dark:bg-gray-600 dark:text-gray-300"
                    >
                      ...
                    </span>
                  </template>
                  <button
                    @click="nextPage"
                    :disabled="currentPage === totalPages"
                    class="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 dark:bg-gray-600 dark:text-white dark:border-gray-500 disabled:opacity-50"
                  >
                    <span class="sr-only">Next</span>
                    <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd" />
                    </svg>
                  </button>
                </nav>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <ConfirmationModal
      ref="deleteModal"
      title="Delete"
      message="Are you sure you want to delete ? This action cannot be undone."
      confirmText="Delete "
      @confirm="confirmDelete"
    />

    <EditAdminModal 
      ref="editModal" 
      @saved="fetchAdmins" 
    />

    <!-- <AddAdminModal
      ref="addModal"
      @admin-added="fetchAdmins"
    /> -->

     <AddUserModal
      ref="addModal"
      @user-added="fetchAdmins"
    />
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useErrorStore } from '@/stores/error';
import axios from 'axios';
import { useRouter } from 'vue-router';
import { debounce } from 'lodash';
import ConfirmationModal from '../Admin/Dashbaord/ConfirmationModal.vue';
import EditAdminModal from '../Admin/Dashbaord/EditUserModal.vue';
import UserInfoModal from '../User/HomePage/UserInfoModal.vue';
import api from '@/api'
import AddUserModal from '../Admin/Dashbaord/AddUserModal.vue';
// import AddAdminModal from '../Admin/Dashbaord/AddUserModal.vue';

const router = useRouter();
const admins = ref([]);
const totalAdmin = ref(0);
const totalUsers = ref(0);
const totalUsersCount = ref(0);
const loading = ref(true);
const error = ref(null);
const forbiddenError = ref(false);
const errorStore = useErrorStore();

// Pagination variables
const currentPage = ref(1);
const itemsPerPage = ref(10);
const totalPages = ref(1);
const itemsPerPageOptions = [5, 10, 20, 30, 50];
const searchQuery = ref('');

const addModal = ref(null);
const editModal = ref(null);
const deleteModal = ref(null);
const adminToDelete = ref(null);

const visiblePages = computed(() => {
  const maxVisiblePages = 5;
  const pages = [];
  let startPage = Math.max(1, currentPage.value - Math.floor(maxVisiblePages / 2));
  let endPage = startPage + maxVisiblePages - 1;
  
  if (endPage > totalPages.value) {
    endPage = totalPages.value;
    startPage = Math.max(1, endPage - maxVisiblePages + 1);
  }
  
  for (let i = startPage; i <= endPage; i++) {
    pages.push(i);
  }
  
  return pages;
});

// const handleUserUpdated = (updatedUser) => {
//   // If the updated user is the current user, refresh data
//   if (updatedUser.id === localStorage.getItem('userId')) {
//     // This will trigger the role change handling
//     authStore.setRole(updatedUser.role);
//   }
  
//   // Refresh your user list or other relevant data
//   fetchUsers();
// };

// Debounced search function
const debouncedSearch = debounce(() => {
  currentPage.value = 1; // Reset to first page when searching
  fetchAdmins();
}, 500);

const formatDate = (dateString) => {
  const options = { year: 'numeric', month: 'short', day: 'numeric' };
  return new Date(dateString).toLocaleDateString(undefined, options);
};

const handleApiError = (err) => {
  if (err.response?.status === 403) {
    forbiddenError.value = true;
    errorStore.set403Error(true);
    return true;
  }
  
  error.value = err.response?.data?.message || err.message || 'An error occurred';
  console.error('API Error:', err);
  return false;
};

const openAddModal = () => {
  addModal.value.open();
};

const deleteAdmin = (adminId) => {
  adminToDelete.value = adminId;
  deleteModal.value.open();
};

const confirmDelete = async () => {
  try {
    const token = localStorage.getItem('authToken');
    // await axios.delete(`http://192.168.1.22:3000/api/auth/user/${adminToDelete.value}`, {
    //   headers: {
    //     'Authorization': `Bearer ${token}`
    //   }
    // });

    await api.delete(`/auth/user/${adminToDelete.value}`);
    
    await fetchAdmins();
  } catch (err) {
    if (!handleApiError(err)) {
      error.value = err.response?.data?.message || err.message || 'Failed to delete admin';
    }
  } finally {
    adminToDelete.value = null;
  }
};

const fetchAdmins = async () => {
  try {
    loading.value = true;
    error.value = null;
    
    const token = localStorage.getItem('authToken');
    const params = {
      page: currentPage.value,
      limit: itemsPerPage.value,
    };

    // Add search query if exists
    if (searchQuery.value) {
      params.search = searchQuery.value.trim();
    }

    // const response = await axios.get('http://192.168.1.22:3000/api/auth/superadmin/getadmins', {
    //   params,
    //   headers: {
    //     'Authorization': `Bearer ${token}`
    //   }
    // });

    const response = await api.get('/auth/superadmin/getadmins',{params})
    
    admins.value = response.users;
    totalAdmin.value = response.users.filter(admin => admin.role === 'admin').length;
    totalUsers.value = response.users.filter(user => user.role === 'user').length;
    totalUsersCount.value = response.totalusers || 0;
    totalPages.value = Math.ceil(totalUsersCount.value / itemsPerPage.value);
  } catch (err) {
    handleApiError(err);
  } finally {
    loading.value = false;
  }
};

const handleItemsPerPageChange = () => {
  currentPage.value = 1; // Reset to first page when changing items per page
  fetchAdmins();
};

const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++;
    fetchAdmins();
  }
};

const prevPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--;
    fetchAdmins();
  }
};

const goToPage = (page) => {
  if (page !== currentPage.value) {
    currentPage.value = page;
    fetchAdmins();
  }
};

const editAdmin = (admin) => {
  editModal.value.open(admin);
};

onMounted(() => {
  fetchAdmins();
});
</script>