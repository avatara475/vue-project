<template>
  <div class="container mx-auto px-4 py-12">
    <!-- 403 Forbidden Message -->
    <div
      v-if="forbiddenError"
      class="forbidden-message bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md text-center"
    >
      <h1 class="text-2xl font-bold text-red-600 mb-4">403 Forbidden</h1>
      <p class="text-gray-600 dark:text-gray-300 mb-6">
        You don't have permission to access this resource.
      </p>
    </div>

    <!-- Main Content -->
    <div v-else>
      <div class="flex flex-col sm:flex-row gap-4 mb-6">
        <!-- Total Admins Card -->
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6 flex-1 min-w-[250px]">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-500 dark:text-gray-400">Total Admins</p>
              <p class="text-2xl font-semibold text-gray-900 dark:text-white">
                {{ totalAdmin }}
              </p>
            </div>
            <motion.div
            :whileHover="{rotateY: '180deg', scale: 1.1}"
            class="p-3 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-200"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                />
              </svg>
            </motion.div>
          </div>
        </div>

        <!-- Total Users Card -->
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6 flex-1 min-w-[250px]">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-500 dark:text-gray-400">Total Users</p>
              <p class="text-2xl font-semibold text-gray-900 dark:text-white">
                {{ totalUsers }}
              </p>
            </div>
            <motion.div
            :whileHover="{rotateY: '180deg', scale: 1.1}"
              class="p-3 rounded-full bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-200"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
            </motion.div>
          </div>
        </div>
      </div>

      <div class="mb-3 flex justify-between">
        <UserInfoModal btitle="Show SuperAdmin Info" title="SuperAdmin Information" />

        <motion.button
          :whileHover="{scale:'1.025'}"
          @click="openAddModal"
          class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Add New User
        </motion.button>
      </div>
      <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h1 class="text-2xl font-bold text-blue-600">Admin Management</h1>

        <div class="flex flex-col sm:flex-row gap-4 w-full sm:w-auto items-end sm:items-center">
          <!-- Search Input -->
          <div class="relative flex-grow min-w-[200px]">
            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg class="h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fill-rule="evenodd"
                  d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                  clip-rule="evenodd"
                />
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
        </div>
      </div>

      <!-- Main Table -->
      <ReusableTable
        :data="admins"
        :columns="adminColumns"
        :loading="loading"
        :error="error"
        :current-page="currentPage"
        :total-pages="totalPages"
        :total-items="totalUsersCount"
        :items-per-page="itemsPerPage"
        @edit="editAdmin"
        @delete="deleteAdmin"
        @prev-page="prevPage"
        @next-page="nextPage"
        @page-change="goToPage"
        @items-per-page-change="handleItemsPerPageChange"
      />
    </div>

    <ConfirmationModal
      ref="deleteModal"
      title="Delete"
      message="Are you sure you want to delete ? This action cannot be undone."
      confirmText="Delete "
      @confirm="confirmDelete"
    />

    <UserModal ref="addUserModal" mode="add" @user-added="fetchAdmins" />
    <UserModal ref="editUserModal" mode="edit" @user-updated="fetchAdmins" />
  </div>
</template>

<script setup>
import { ref, onMounted, computed, h } from "vue";
import { useErrorStore } from "@/stores/error";
import { debounce } from "lodash";
import ConfirmationModal from "../Admin/Dashbaord/ConfirmationModal.vue";
import UserInfoModal from "../User/HomePage/UserInfoModal.vue";
import ReusableTable from "@/ReusableTable.vue";
import api from "@/api";
import UserModal from "../Admin/Dashbaord/UserModel.vue";
import { motion } from "motion-v";

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
const searchQuery = ref("");

const addUserModal = ref(null);
const editUserModal = ref(null);
const deleteModal = ref(null);
const adminToDelete = ref(null);

const adminColumns = [
  {
    key: "name",
    label: "Name",
    fontWeight: true,
    textColor: "text-gray-900 dark:text-white",
  },
  {
    key: "email",
    label: "Email",
    nowrap: true,
  },
  {
    key: "role",
    label: "Role",
    nowrap: true,
    customRender: (props) =>
      h(
        "span",
        {
          class: {
            "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200":
              props.value === "admin",
            "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200": props.value === "user",
            "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200":
              props.value === "superadmin",
          },
          class: "px-2 inline-flex text-xs leading-5 font-semibold rounded-full",
        },
        props.value
      ),
  },
];

const handleApiError = (err) => {
  if (err.response?.status === 403) {
    forbiddenError.value = true;
    errorStore.set403Error(true);
    return true;
  }

  error.value = err.response?.data?.message || err.message || "An error occurred";
  console.error("API Error:", err);
  return false;
};

const openAddModal = () => {
  addUserModal.value.open();
};

const deleteAdmin = (adminId) => {
  adminToDelete.value = adminId;
  deleteModal.value.open();
};

const confirmDelete = async () => {
  try {
    await api.delete(`/auth/user/${adminToDelete.value}`);
    await fetchAdmins();
  } catch (err) {
    if (!handleApiError(err)) {
      error.value = err.response?.data?.message || err.message || "Failed to delete admin";
    }
  } finally {
    adminToDelete.value = null;
  }
};

const fetchAdmins = async () => {
  try {
    loading.value = true;
    error.value = null;

    const params = {
      page: currentPage.value,
      limit: itemsPerPage.value,
    };

    if (searchQuery.value) {
      params.search = searchQuery.value.trim();
    }

    const response = await api.get("/auth/superadmin/getadmins", { params });

    admins.value = response.users;
    totalAdmin.value = response.users.filter((admin) => admin.role === "admin").length;
    totalUsers.value = response.users.filter((user) => user.role === "user").length;
    totalUsersCount.value = response.totalusers || 0;
    totalPages.value = Math.ceil(totalUsersCount.value / itemsPerPage.value);
  } catch (err) {
    handleApiError(err);
  } finally {
    loading.value = false;
  }
};

const handleItemsPerPageChange = (newValue) => {
  itemsPerPage.value = newValue;
  currentPage.value = 1;
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
  editUserModal.value.open(admin);
};

// Debounced search function
const debouncedSearch = debounce(() => {
  currentPage.value = 1;
  fetchAdmins();
}, 500);

onMounted(() => {
  fetchAdmins();
});
</script>
