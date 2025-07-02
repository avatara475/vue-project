<template>
  <div class="container mx-auto px-4 py-8">
    <h1 class="text-3xl font-bold text-center mb-8">Our Products</h1>
    <div class="mb-3">
      <UserInfoModal btitle="Show User Info" title="User Information" />
    </div>

    <!-- Search and Filter Controls -->
    <div class="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
      <div class="flex flex-col sm:flex-row gap-4 w-full">
        <!-- Search Input -->
        <div class="relative flex-grow">
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
            class="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            placeholder="Search products..."
          />
        </div>

        <!-- Price Range Filter -->
        <div class="flex items-center space-x-2">
          <input
            v-model="minPrice"
            type="number"
            min="0"
            @keydown="preventInvalidChars"
            placeholder="Min"
            class="w-20 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          />
          <span class="text-gray-500">to</span>
          <input
            v-model="maxPrice"
            type="number"
            min="0"
            @keydown="preventInvalidChars"
            placeholder="Max"
            class="w-20 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          />
          <motion.button
           :whileHover="{ scale: 1.025 }"
            @click="applyPriceFilter"
            class="px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
          >
            Filter
          </motion.button>
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="text-center">
      <div
        class="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"
      ></div>
      <p class="mt-2 text-gray-600">Loading products...</p>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="p-4 bg-red-100 text-red-700 rounded text-center">
      {{ error }}
    </div>

    <!-- Products Grid -->
    <div v-else>
      <div
        class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
        v-if="products.length"
      >
        <motion.div
          v-for="product in products"
          :whileHover="{scale:1.05}"
          :initial="{ y: 20, opacity: 0 }"
          :animate="{ y: 0, opacity: 1 }"
          :key="product.id"
          class="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
        >
          <!-- Product Image -->
          <div class="h-48 bg-gray-200 overflow-hidden">
            <img
              v-if="product.image"
              :src="
                product.image.startsWith('http')
                  ? product.image
                  : `data:image/jpeg;base64,${product.image}`
              "
              :alt="product.title"
              class="w-full h-full object-cover"
            />
            <div v-else class="w-full h-full flex items-center justify-center text-gray-400">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-12 w-12"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>
          </div>

          <!-- Product Details -->
          <div class="p-4">
            <h3 class="text-lg font-semibold text-gray-800 mb-1 truncate">
              {{ product.title }}
            </h3>
            <p class="text-gray-600 text-sm mb-2 line-clamp-2">
              {{ product.description }}
            </p>
            <div class="flex justify-between items-center">
              <span class="text-lg font-bold text-blue-600">${{ product.price }}</span>
              <span class="px-2 py-1 text-xs font-semibold bg-blue-100 text-blue-800 rounded-full">
                {{ product.category }}
              </span>
            </div>
            <!-- <button 
              @click="addToCart(product)"
              class="mt-3 w-full py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Add to Cart
            </button> -->
          </div>
        </motion.div>
      </div>
      <div v-else class="text-center">No Product Available</div>

      <!-- Pagination -->
      <motion.div
        :initial="{ opacity: 0 }"
        :animate="{ opacity: 1 }"
        :transition="{ delay: 0.5, duration: 0.3 }"
        class="mt-8 bg-gray-50 dark:bg-gray-700 px-4 py-3 flex items-center justify-between border-t border-gray-200 dark:border-gray-600 sm:px-6"
      >
        <div class="flex-1 flex justify-between sm:hidden">
          <button
            @click="prevPage"
            :disabled="currentPage === 1"
            class="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 dark:bg-gray-600 dark:text-white dark:border-gray-500"
          >
            Previous
          </button>
          <button
            @click="nextPage"
            :disabled="currentPage === totalPages"
            class="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 dark:bg-gray-600 dark:text-white dark:border-gray-500"
          >
            Next
          </button>
        </div>
        <div class="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
          <div class="flex items-center space-x-2">
            <p class="text-sm text-gray-700 dark:text-gray-300">Show</p>
            <select
              v-model="itemsPerPage"
              @change="handleItemsPerPageChange"
              class="block w-20 pl-1 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md dark:bg-gray-600 dark:text-white dark:border-gray-500"
            >
              <option v-for="option in itemsPerPageOptions" :key="option" :value="option">
                {{ option }}
              </option>
            </select>
            <p class="text-sm text-gray-700 dark:text-gray-300">items per page</p>
          </div>
          <div>
            <p class="text-sm text-gray-700 dark:text-gray-300">
              Showing
              <span class="font-medium">{{ (currentPage - 1) * itemsPerPage + 1 }}</span>
              to
              <span class="font-medium">{{
                Math.min(currentPage * itemsPerPage, totalProducts)
              }}</span>
              of <span class="font-medium">{{ totalProducts }}</span> results
            </p>
          </div>
          <div>
            <nav
              class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
              aria-label="Pagination"
            >
              <button
                @click="prevPage"
                :disabled="currentPage === 1"
                class="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 dark:bg-gray-600 dark:text-white dark:border-gray-500 disabled:opacity-50"
              >
                <span class="sr-only">Previous</span>
                <svg
                  class="h-5 w-5"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path
                    fill-rule="evenodd"
                    d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                    clip-rule="evenodd"
                  />
                </svg>
              </button>
              <button
                v-for="page in visiblePages"
                :key="page"
                @click="goToPage(page)"
                :class="[
                  page === currentPage
                    ? 'bg-blue-50 border-blue-500 text-blue-600 dark:bg-blue-800 dark:text-white'
                    : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50 dark:bg-gray-600 dark:text-gray-300',
                  'relative inline-flex items-center px-4 py-2 border text-sm font-medium',
                ]"
              >
                {{ page }}
              </button>
              <button
                @click="nextPage"
                :disabled="currentPage === totalPages"
                class="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 dark:bg-gray-600 dark:text-white dark:border-gray-500 disabled:opacity-50"
              >
                <span class="sr-only">Next</span>
                <svg
                  class="h-5 w-5"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path
                    fill-rule="evenodd"
                    d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                    clip-rule="evenodd"
                  />
                </svg>
              </button>
            </nav>
          </div>
        </div>
      </motion.div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import { debounce } from "lodash";
import UserInfoModal from "./UserInfoModal.vue";
import api from "@/api"; // Import your API middleware
import { motion } from 'motion-v'

const products = ref([]);
const loading = ref(true);
const error = ref(null);
const currentPage = ref(1);
const itemsPerPage = ref(5);
const totalProducts = ref(0);
const totalPages = ref(1);
const itemsPerPageOptions = [5, 10, 20, 30, 50];

// Search and filter variables
const searchQuery = ref("");
const minPrice = ref("");
const maxPrice = ref("");

// Debounced search function
const debouncedSearch = debounce(() => {
  currentPage.value = 1; // Reset to first page when searching
  fetchProducts();
}, 500);

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1 },
};

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

const preventInvalidChars = (e) => {
  if (["e", "E", "+", "-"].includes(e.key)) {
    e.preventDefault();
  }
};

const fetchProducts = async () => {
  try {
    loading.value = true;
    error.value = null;

    const params = {
      page: currentPage.value,
      limit: itemsPerPage.value,
    };

    // Add search query if exists
    if (searchQuery.value) {
      params.search = searchQuery.value.trim();
    }

    // Add price filters if they exist
    if (minPrice.value) {
      params.minPrice = minPrice.value;
    }
    if (maxPrice.value) {
      params.maxPrice = maxPrice.value;
    }

    // Using the API middleware instead of direct axios call
    const response = await api.get("/products/get", { params });

    products.value = response.products || [];
    totalProducts.value = response.totalProducts || 0;
    totalPages.value = Math.ceil(totalProducts.value / itemsPerPage.value) || 1;
  } catch (err) {
    // Error is already handled by the API middleware interceptor
    // But you can still access it here if needed
    error.value = err.message || "Failed to fetch products";
    console.error("Error fetching products:", err);
  } finally {
    loading.value = false;
  }
};

const applyPriceFilter = () => {
  currentPage.value = 1; // Reset to first page when applying filters
  fetchProducts();
};

const handleItemsPerPageChange = () => {
  currentPage.value = 1; // Reset to first page when changing items per page
  fetchProducts();
};

const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++;
    fetchProducts();
  }
};

const prevPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--;
    fetchProducts();
  }
};

const goToPage = (page) => {
  if (page !== currentPage.value) {
    currentPage.value = page;
    fetchProducts();
  }
};

const addToCart = (product) => {
  // Implement your cart functionality here
  console.log("Added to cart:", product);
};

onMounted(() => {
  fetchProducts();
});
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
