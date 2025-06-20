<template>
  <div class="container mx-auto px-4 py-4 sm:py-8">
    <!-- Header with Search/Filter and Add Button -->
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
      <h1 class="text-xl sm:text-2xl font-bold text-blue-600">Product Management</h1>
      
      <div class="flex flex-col sm:flex-row gap-4 w-full sm:w-auto items-end sm:items-center">
        <!-- Search and Filter Row -->
        <div class="flex flex-col xs:flex-row gap-2 w-full sm:w-auto">
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
              placeholder="Search products..."
            />
          </div>

          <!-- Price Range Filter - Stacked on mobile -->
          <div class="flex flex-col xs:flex-row items-center gap-2">
            <div class="flex items-center gap-2">
              <input
                v-model="minPrice"
                type="number"
                min="0"
                @keydown="preventInvalidChars"
                placeholder="Min"
                class="w-20 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
              <span class="text-gray-500 hidden xs:inline">to</span>
              <input
                v-model="maxPrice"
                type="number"
                min="0"
                @keydown="preventInvalidChars"
                placeholder="Max"
                class="w-20 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
            </div>
            <button
              @click="applyPriceFilter"
              class="px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm w-full xs:w-auto"
            >
              Filter
            </button>
          </div>
        </div>
        
        <!-- Add Product Button -->
        <button
          @click="openAddModal"
          class="px-3 py-2 sm:px-4 sm:py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base w-full sm:w-auto"
        >
          Add Product
        </button>
      </div>
    </div>

    <!-- Main Content Area -->
    <div class="bg-white dark:bg-gray-800 shadow-md rounded-lg overflow-hidden">
      <!-- Loading State -->
      <div v-if="loading" class="p-8 text-center">
        <div class="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
        <p class="mt-2 text-gray-600 dark:text-gray-300">Loading products...</p>
      </div>
      
      <!-- Error State -->
      <div v-else-if="error" class="p-4 bg-red-100 text-red-700 rounded">
        {{ error }}
      </div>
      
      <!-- Product Table -->
      <div v-else>
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700" v-if="products.length">
            <thead class="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th scope="col" class="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">ID</th>
                <th scope="col" class="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Title</th>
                <th scope="col" class="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider hidden sm:table-cell">Description</th>
                <th scope="col" class="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Price</th>
                <th scope="col" class="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider hidden xs:table-cell">Category</th>
                <th scope="col" class="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              <tr v-for="product in products" :key="product.id" class="hover:bg-gray-50 dark:hover:bg-gray-700" >
                <td class="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{{ product.id }}</td>
                <td class="px-4 sm:px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">{{ product.title }}</td>
                <td class="px-4 sm:px-6 py-4 text-sm text-gray-500 dark:text-gray-300 max-w-xs truncate hidden sm:table-cell">{{ product.description }}</td>
                <td class="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">${{ product.price }}</td>
                <td class="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300 hidden xs:table-cell">
                  <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                    {{ product.category }}
                  </span>
                </td>
                <td class="px-4 sm:px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button 
                    @click="editProduct(product)"
                    class="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300 mr-2 sm:mr-4"
                  >
                    Edit
                  </button>
                  <button 
                    @click="deleteProduct(product.id)"
                    class="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                  >
                    Delete
                  </button>
                </td>
              </tr>
              
            </tbody>
          </table>
          <table v-else class="text-white text-center ml-[40%]">
            No product available
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
                to <span class="font-medium">{{ Math.min(currentPage * itemsPerPage, totalProducts) }}</span>
                of <span class="font-medium">{{ totalProducts }}</span>
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

    <!-- Modals (unchanged) -->
    <AddProductModal 
      ref="addModal" 
      @product-added="fetchProducts" 
    />
    <EditProductModal 
      ref="editModal" 
      @product-updated="fetchProducts" 
    />
    <ConfirmationModal
      ref="deleteModal"
      title="Delete Product"
      message="Are you sure you want to delete this product? This action cannot be undone."
      confirmText="Delete Product"
      @confirm="confirmDelete"
    />
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import axios from 'axios';
import { useToast } from 'vue-toastification';
import { debounce } from 'lodash';
import ConfirmationModal from '../Dashbaord/ConfirmationModal.vue';
import AddProductModal from './AddProductModal.vue';
import EditProductModal from './EditProductModal.vue';
import api from '@/api'

const toast = useToast();
const products = ref([]);
const loading = ref(true);
const error = ref(null);
const currentPage = ref(1);
const itemsPerPage = ref(10);
const totalProducts = ref(0);
const totalPages = ref(1);
const itemsPerPageOptions = [5, 10, 20, 30, 50];

const addModal = ref(null);
const editModal = ref(null);
const deleteModal = ref(null);
const productToDelete = ref(null);

// Search and filter variables
const searchQuery = ref('');
const minPrice = ref('');
const maxPrice = ref('');

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
  if (['e', 'E', '+', '-'].includes(e.key)) {
    e.preventDefault();
  }
};

// Debounced search function
const debouncedSearch = debounce(() => {
  currentPage.value = 1; // Reset to first page when searching
  fetchProducts();
}, 500);

const fetchProducts = async () => {
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

    // Add price filters if they exist
    if (minPrice.value) {
      params.minPrice = minPrice.value;
    }
    if (maxPrice.value) {
      params.maxPrice = maxPrice.value;
    }

    // const response = await axios.get('http://192.168.1.22:3000/api/products/get', {
    //   params,
    //   headers: {
    //     'Authorization': `Bearer ${token}`
    //   }
    // });

    const response = await api.get('/products/get', { params })
    
    products.value = response.products;
    totalProducts.value = response.totalProducts;
    totalPages.value = Math.ceil(response.totalProducts / itemsPerPage.value);
  } catch (err) {
    error.value = err.response?.message || err.message || 'Failed to fetch products';
    console.error('Error fetching products:', err);
  } finally {
    loading.value = false;
  }
};

const applyPriceFilter = () => {
  currentPage.value = 1; // Reset to first page when applying filters
  fetchProducts();
};

const resetFilters = () => {
  searchQuery.value = '';
  minPrice.value = '';
  maxPrice.value = '';
  currentPage.value = 1;
  fetchProducts();
};

const handleItemsPerPageChange = () => {
  currentPage.value = 1; // Reset to first page when changing items per page
  fetchProducts();
};

const openAddModal = () => {
  addModal.value.open();
};

const editProduct = (product) => {
  editModal.value.open(product);
};

const deleteProduct = (productId) => {
  productToDelete.value = productId;
  deleteModal.value.open();
};

const confirmDelete = async () => {
  try {
    const token = localStorage.getItem('authToken');
    // await axios.delete(`http://192.168.1.22:3000/api/products/product/${productToDelete.value}`, {
    //   headers: {
    //     'Authorization': `Bearer ${token}`
    //   }
    // });

    await api.delete(`/products/product/${productToDelete.value}`)
    
    toast.success('Product deleted successfully');
    await fetchProducts();
  } catch (err) {
    toast.error(err.response?.message || 'Failed to delete product');
    console.error('Error deleting product:', err);
  } finally {
    productToDelete.value = null;
  }
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

onMounted(() => {
  fetchProducts();
});
</script>