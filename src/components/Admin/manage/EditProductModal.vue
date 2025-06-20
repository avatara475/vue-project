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
                  Edit Product
                </h3>
                <div class="mt-4 space-y-4">
                  <div>
                    <label for="title" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Title</label>
                    <input
                      type="text"
                      id="title"
                      v-model="form.title"
                      class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                      :class="{ 'border-red-500': errors.title }"
                    />
                    <p v-if="errors.title" class="mt-1 text-sm text-red-600">{{ errors.title }}</p>
                  </div>
                  
                  <div>
                    <label for="image" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Product Image</label>
                    <!-- <input
                      type="file"
                      id="image"
                      accept="image/*"
                      @change="handleImageUpload"
                      class="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 dark:file:bg-gray-600 dark:file:text-gray-200"
                    /> -->

                    <input
                    type="file"
                    id="image"
                    accept=".jpg,.jpeg"
                    @change="handleImageUpload"
                    class="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 dark:file:bg-gray-600 dark:file:text-gray-200"
                    directory="false"        
                    multiple="false"
                    />
                    <p v-if="errors.image" class="mt-1 text-sm text-red-600">{{ errors.image }}</p>
                    <div class="mt-2 flex items-center space-x-4">
                      <img v-if="imagePreview" :src="imagePreview" class="h-20 w-20 object-cover rounded-md" alt="New preview">
                      <img v-if="!imagePreview && currentImage" :src="'data:image/jpeg;base64,' + currentImage" class="h-20 w-20 object-cover rounded-md" alt="Current image">
                      <!-- <img v-if="!imagePreview && currentImage" :src="currentImage.startsWith('data:') ? currentImage : `data:image/svg+xml;base64,${currentImage}`" > -->
                    </div>
                  </div>
                  
                  <div>
                    <label for="description" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Description</label>
                    <textarea
                      id="description"
                      v-model="form.description"
                      rows="3"
                      class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                      :class="{ 'border-red-500': errors.description }"
                    ></textarea>
                    <p v-if="errors.description" class="mt-1 text-sm text-red-600">{{ errors.description }}</p>
                  </div>
                  
                  <div>
                    <label for="price" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Price</label>
                    <input
                      type="number"
                      id="price"
                      v-model="form.price"
                      @keydown="preventInvalidChars"
                      min="0"
                      step="0.01"
                      class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                      :class="{ 'border-red-500': errors.price }"
                    />
                    <p v-if="errors.price" class="mt-1 text-sm text-red-600">{{ errors.price }}</p>
                  </div>
                  
                  <div>
                    <label for="category" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Category</label>
                    <select
                      id="category"
                      v-model="form.category"
                      class="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                      :class="{ 'border-red-500': errors.category }"
                    >
                      <option value="Electronics">Electronics</option>
                      <option value="Clothes">Clothes</option>
                      <option value="Furniture">Furniture</option>
                      <option value="Books">Books</option>
                    </select>
                    <p v-if="errors.category" class="mt-1 text-sm text-red-600">{{ errors.category }}</p>
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
              <span v-if="!isSubmitting">Update Product</span>
              <span v-else class="flex items-center">
                <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Updating...
              </span>
            </button>
            <button
              type="button"
              @click="close"
              class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm dark:bg-gray-600 dark:text-white dark:border-gray-500"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>
<!-- 
<script setup>
import { ref } from 'vue'
import axios from 'axios'
import { useToast } from 'vue-toastification'
import * as yup from 'yup'

const toast = useToast()
const isOpen = ref(false)
const isSubmitting = ref(false)
const imagePreview = ref(null)
const currentImage = ref('')
const productId = ref(null)

const form = ref({
  title: '',
  image: '',
  description: '',
  price: '',
  category: ''
})

const errors = ref({})

const schema = yup.object().shape({
  title: yup.string().required('Title is required'),
  image: yup.string().required('Image is required'),
  description: yup.string().required('Description is required'),
  price: yup.number()
    .typeError('Price must be a number')
    .positive('Price must be positive')
    .required('Price is required'),
  category: yup.string()
    .oneOf(['Electronics', 'Clothes', 'Furniture', 'Books'], 'Invalid category')
    .required('Category is required')
})

const emit = defineEmits(['product-updated'])

const open = (product) => {
  productId.value = product.id
  currentImage.value = product.image
  form.value = {
    title: product.title,
    image: product.image,
    description: product.description,
    price: product.price,
    category: product.category
  }
  isOpen.value = true
}

const close = () => {
  isOpen.value = false
  resetForm()
}

const resetForm = () => {
  form.value = {
    title: '',
    image: '',
    description: '',
    price: '',
    category: ''
  }
  imagePreview.value = null
  currentImage.value = ''
  productId.value = null
  errors.value = {}
}

const preventInvalidChars = (e) => {
  if (['e', 'E', '+', '-'].includes(e.key)) {
    e.preventDefault();
  }
};

const handleImageUpload = (event) => {
  const file = event.target.files[0]
  
  // Reset previous state
  imagePreview.value = null
  form.value.image = ''
  errors.value.image = ''
  
  if (!file) return

  // Check if it's a folder (file.type will be empty for folders)
  if (!file.type) {
    errors.value.image = 'Folders cannot be uploaded'
    event.target.value = '' // Clear the input
    return
  }
  
  // Validate file size
  if (file.size > 50 * 1024) { // 50kb
    errors.value.image = 'File size must be less than 50kb'
    return
  }
  
  // Check for valid JPG/JPEG
  if (!['image/jpeg', 'image/jpg'].includes(file.type.toLowerCase())) {
    errors.value.image = 'Only JPG/JPEG images are allowed'
    event.target.value = '' // Clear the input
    return
  }

  const reader = new FileReader()
  reader.onload = (e) => {
    imagePreview.value = e.target.result
    form.value.image = e.target.result.split(',')[1] // Get base64 part
  }
  reader.onerror = () => {
    errors.value.image = 'Error reading file'
    event.target.value = '' // Clear the input
  }
  reader.readAsDataURL(file)
}

const submitForm = async () => {
  try {
    isSubmitting.value = true
    errors.value = {}
      // Additional manual validation before schema
    if (errors.value.image) {
      throw new Error('Image validation failed')
    }
    
    // Validate form (image is optional in edit)
    await schema.validate(form.value, { abortEarly: false })
    
    // Prepare payload
    const payload = {
      title: form.value.title,
      description: form.value.description,
      price: parseFloat(form.value.price),
      category: form.value.category
    }
    
    // Include image only if it was changed
    if (form.value.image !== currentImage.value) {
      payload.image = form.value.image
    }
    
    // Make API call
    const token = localStorage.getItem('authToken')
    await axios.put(`http://192.168.1.14:3000/api/products/product/${productId.value}`, payload, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    })
    
    toast.success('Product updated successfully')
    emit('product-updated')
    close()
  } catch (error) {
    if (error.inner) {
      // Yup validation errors
      error.inner.forEach(err => {
        errors.value[err.path] = err.message
      })
    } else if (error.response) {
      // API error response
      toast.error(error.response.data?.message || 'Failed to update product')
    } else {
      // Network error
      toast.error('Network error occurred')
      console.error('Error updating product:', error)
    }
  } finally {
    isSubmitting.value = false
  }
}

defineExpose({ open, close })
</script> -->

<script setup>
import { ref, watch } from 'vue'
import axios from 'axios'
import { useToast } from 'vue-toastification'
import * as yup from 'yup'
import api from '@/api'

const toast = useToast()
const isOpen = ref(false)
const isSubmitting = ref(false)
const imagePreview = ref(null)
const currentImage = ref('')
const productId = ref(null)

const form = ref({
  title: '',
  image: '',
  description: '',
  price: '',
  category: ''
})

const errors = ref({})
const touched = ref({
  title: false,
  image: false,
  description: false,
  price: false,
  category: false
})

const schema = yup.object().shape({
  title: yup.string().required('Title is required'),
  description: yup.string().required('Description is required'),
  price: yup.number()
    .typeError('Price must be a number')
    .positive('Price must be positive')
    .required('Price is required'),
  category: yup.string()
    .oneOf(['Electronics', 'Clothes', 'Furniture', 'Books'], 'Invalid category')
    .required('Category is required')
})

// Watch for changes and validate touched fields
watch(() => form.value.title, () => {
  if (touched.value.title) validateField('title')
})

watch(() => form.value.description, () => {
  if (touched.value.description) validateField('description')
})

watch(() => form.value.price, () => {
  if (touched.value.price) validateField('price')
})

watch(() => form.value.category, () => {
  if (touched.value.category) validateField('category')
})

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

const emit = defineEmits(['product-updated'])

const open = (product) => {
  productId.value = product.id
  currentImage.value = product.image
  form.value = {
    title: product.title,
    image: product.image,
    description: product.description,
    price: product.price,
    category: product.category
  }
  isOpen.value = true
}

const close = () => {
  isOpen.value = false
  resetForm()
}

const resetForm = () => {
  form.value = {
    title: '',
    image: '',
    description: '',
    price: '',
    category: ''
  }
  imagePreview.value = null
  currentImage.value = ''
  productId.value = null
  errors.value = {}
  touched.value = {
    title: false,
    image: false,
    description: false,
    price: false,
    category: false
  }
}

const preventInvalidChars = (e) => {
  if (['e', 'E', '+', '-'].includes(e.key)) {
    e.preventDefault();
  }
};

const handleImageUpload = (event) => {
  const file = event.target.files[0]
  
  // Reset previous state
  imagePreview.value = null
  form.value.image = ''
  errors.value.image = ''
  
  if (!file) return

  // Check if it's a folder (file.type will be empty for folders)
  if (!file.type) {
    errors.value.image = 'Folders cannot be uploaded'
    event.target.value = '' // Clear the input
    return
  }
  
  // Validate file size
  if (file.size > 50 * 1024) { // 50kb
    errors.value.image = 'File size must be less than 50kb'
    return
  }
  
  // Check for valid JPG/JPEG
  if (!['image/jpeg', 'image/jpg'].includes(file.type.toLowerCase())) {
    errors.value.image = 'Only JPG/JPEG images are allowed'
    event.target.value = '' // Clear the input
    return
  }

  const reader = new FileReader()
  reader.onload = (e) => {
    imagePreview.value = e.target.result
    form.value.image = e.target.result.split(',')[1] // Get base64 part
    if (touched.value.image) validateField('image')
  }
  reader.onerror = () => {
    errors.value.image = 'Error reading file'
    event.target.value = '' // Clear the input
  }
  reader.readAsDataURL(file)
}

const submitForm = async () => {
  // Mark all fields as touched on submit
  touched.value = {
    title: true,
    image: true,
    description: true,
    price: true,
    category: true
  }
  
  const isValid = await validateForm()
  if (!isValid) return
  
  try {
    isSubmitting.value = true
    
    // Prepare payload
    const payload = {
      title: form.value.title,
      description: form.value.description,
      price: parseFloat(form.value.price),
      category: form.value.category
    }
    
    // Include image only if it was changed
    if (form.value.image !== currentImage.value) {
      payload.image = form.value.image
    }
    
    // Make API call
    const token = localStorage.getItem('authToken')
    // await axios.put(`http://192.168.1.22:3000/api/products/product/${productId.value}`, payload, {
    //   headers: {
    //     'Authorization': `Bearer ${token}`,
    //     'Content-Type': 'application/json'
    //   }
    // })

    await api.put(`products/product/${productId.value}`,payload)
    
    toast.success('Product updated successfully')
    emit('product-updated')
    close()
  } catch (error) {
    if (error.response) {
      // API error response
      toast.error(error.response?.message || 'Failed to update product')
    } else {
      // Network error
      toast.error('Network error occurred')
      console.error('Error updating product:', error)
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