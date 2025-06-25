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
    <ReusableTable
      :data="products"
      :columns="productColumns"
      :loading="loading"
      :error="error"
      :current-page="currentPage"
      :total-pages="totalPages"
      :total-items="totalProducts"
      :items-per-page="itemsPerPage"
      @edit="editProduct"
      @delete="deleteProduct"
      @prev-page="prevPage"
      @next-page="nextPage"
      @page-change="goToPage"
      @items-per-page-change="handleItemsPerPageChange"
    />


   <ProductModal 
   ref="addModal" 
   mode="add" 
   @product-added="fetchProducts" 
   />

   <ProductModal 
   ref="editModal" 
   mode="edit" 
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
import { ref, onMounted, computed,h } from 'vue';
import { useToast } from 'vue-toastification';
import { debounce } from 'lodash';
import ConfirmationModal from '../Dashbaord/ConfirmationModal.vue';
import ReusableTable from '@/ReusableTable.vue';
import ProductModal from './ProductModal.vue';
import api from '@/api';

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


const productColumns = [
  {
    key: 'image',
    label: 'Image',
    customRender: (props) => {
      // If no image data, return a placeholder
      if (!props.value) {
        return h('div', { 
          class: 'w-10 h-10 bg-gray-200 rounded flex items-center justify-center' 
        }, [
          h('svg', { 
            class: 'w-6 h-6 text-gray-400', 
            fill: 'none', 
            stroke: 'currentColor', 
            viewBox: '0 0 24 24' 
          }, [
            h('path', { 
              'stroke-linecap': 'round', 
              'stroke-linejoin': 'round', 
              'stroke-width': '2', 
              d: 'M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z' 
            })
          ])
        ]);
      }

      // Check if the value is already a data URL (starts with 'data:image')
      const src = props.value.startsWith('data:image') 
        ? props.value 
        : `data:image/jpeg;base64,${props.value}`;

      return h('img', {
        src: src,
        class: 'w-10 h-10 object-cover rounded',
        alt: 'Product image',
        onError: (e) => {
          e.target.style.display = 'none';
          const fallback = document.createElement('div');
          fallback.className = 'w-full h-full bg-gray-200 rounded flex items-center justify-center';
          fallback.innerHTML = '<svg class="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>';
          e.target.parentNode.appendChild(fallback);
        }
      });
    },
    sortable: false
  },
  {
    key: 'title',
    label: 'Title',
    fontWeight: true,
    textColor: 'text-gray-900 dark:text-white',
    sortable: true
  },
  {
    key: 'description',
    label: 'Description',
    hiddenClass: 'hidden sm:table-cell',
    nowrap: false,
    sortable: true
  },
  {
    key: 'price',
    label: 'Price',
    nowrap: true,
    format: (value) => `$${value}`,
    sortable: true
  },
  {
    key: 'category',
    label: 'Category',
    nowrap: true,
    customRender: (props) => h('span', {
      class: 'px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
    }, props.value),
    sortable: true
  }
];

const editProduct = (product) => {
  editModal.value.open(product);
};

const deleteProduct = (productId) => {
  productToDelete.value = productId;
  deleteModal.value.open();
};

const preventInvalidChars = (e) => {
  if (['e', 'E', '+', '-'].includes(e.key)) {
    e.preventDefault();
  }
};

// Debounced search function
const debouncedSearch = debounce(() => {
  currentPage.value = 1;
  fetchProducts();
}, 500);

const fetchProducts = async () => {
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

    if (minPrice.value) {
      params.minPrice = minPrice.value;
    }
    if (maxPrice.value) {
      params.maxPrice = maxPrice.value;
    }

    const response = await api.get('/products/get', { params });
    console.log("API Response:", response);
    products.value = response.products || response.data?.products ;
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
  currentPage.value = 1;
  fetchProducts();
};

const resetFilters = () => {
  searchQuery.value = '';
  minPrice.value = '';
  maxPrice.value = '';
  currentPage.value = 1;
  fetchProducts();
};

const handleItemsPerPageChange = (newValue) => {
  itemsPerPage.value = newValue;
  currentPage.value = 1;
  fetchProducts();
};

const openAddModal = () => {
  addModal.value.open();
};

const confirmDelete = async () => {
  try {
    await api.delete(`/products/product/${productToDelete.value}`);
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
