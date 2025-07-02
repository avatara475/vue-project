<template>
  <transition name="fade">
    <div v-if="isOpen" class="fixed inset-0 z-50 overflow-y-auto">
      <div
        class="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0"
      >
        <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true"
          >&#8203;</span
        >

        <div
          class="inline-block align-bottom bg-white dark:bg-gray-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full"
        >
          <div class="px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div class="sm:flex sm:items-start">
              <div
                class="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full"
                :class="mode === 'add' ? 'bg-green-100' : 'bg-blue-100'"
              >
                <svg
                  class="h-6 w-6"
                  :class="mode === 'add' ? 'text-green-600' : 'text-blue-600'"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    v-if="mode === 'add'"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                  />
                  <path
                    v-else
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                  />
                </svg>
              </div>
              <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                <h3 class="text-lg leading-6 font-medium text-gray-900 dark:text-white">
                  {{ mode === "add" ? "Add New Product" : "Edit Product" }}
                </h3>
                <div class="mt-4 space-y-4">
                  <div>
                    <label
                      for="title"
                      class="block text-sm font-medium text-gray-700 dark:text-gray-300"
                      >Title</label
                    >
                    <input
                      type="text"
                      id="title"
                      v-model="form.title"
                      @blur="handleBlur('title')"
                      class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                      :class="{ 'border-red-500': errors.title }"
                    />
                    <p v-if="errors.title" class="mt-1 text-sm text-red-600">
                      {{ errors.title }}
                    </p>
                  </div>

                  <div>
                    <label
                      for="image"
                      class="block text-sm font-medium text-gray-700 dark:text-gray-300"
                      >Product Image</label
                    >
                    <input
                      type="file"
                      id="image"
                      accept="image/jpeg, image/jpg"
                      @change="handleImageUpload"
                      class="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 dark:file:bg-gray-600 dark:file:text-gray-200"
                      directory="false"
                      multiple="false"
                    />
                    <p v-if="errors.image" class="mt-1 text-sm text-red-600">
                      {{ errors.image }}
                    </p>
                    <div class="mt-2 flex items-center space-x-4">
                      <img
                        v-if="imagePreview"
                        :src="imagePreview"
                        class="h-20 w-20 object-cover rounded-md"
                        alt="New preview"
                      />
                      <img
                        v-if="!imagePreview && currentImage"
                        :src="'data:image/jpeg;base64,' + currentImage"
                        class="h-20 w-20 object-cover rounded-md"
                        alt="Current image"
                      />
                    </div>
                  </div>

                  <div>
                    <label
                      for="description"
                      class="block text-sm font-medium text-gray-700 dark:text-gray-300"
                      >Description</label
                    >
                    <textarea
                      id="description"
                      v-model="form.description"
                      @blur="handleBlur('description')"
                      rows="3"
                      class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                      :class="{ 'border-red-500': errors.description }"
                    ></textarea>
                    <p v-if="errors.description" class="mt-1 text-sm text-red-600">
                      {{ errors.description }}
                    </p>
                  </div>

                  <div>
                    <label
                      for="price"
                      class="block text-sm font-medium text-gray-700 dark:text-gray-300"
                      >Price</label
                    >
                    <input
                      type="number"
                      id="price"
                      v-model="form.price"
                      @blur="handleBlur('price')"
                      @keydown="preventInvalidChars"
                      min="0"
                      step="0.01"
                      class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                      :class="{ 'border-red-500': errors.price }"
                    />
                    <p v-if="errors.price" class="mt-1 text-sm text-red-600">
                      {{ errors.price }}
                    </p>
                  </div>

                  <div>
                    <label
                      for="category"
                      class="block text-sm font-medium text-gray-700 dark:text-gray-300"
                      >Category</label
                    >
                    <select
                      id="category"
                      v-model="form.category"
                      @blur="handleBlur('category')"
                      class="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                      :class="{ 'border-red-500': errors.category }"
                    >
                      <option v-if="mode === 'add'" value="">Select a category</option>
                      <option value="Electronics">Electronics</option>
                      <option value="Clothes">Clothes</option>
                      <option value="Furniture">Furniture</option>
                      <option value="Books">Books</option>
                    </select>
                    <p v-if="errors.category" class="mt-1 text-sm text-red-600">
                      {{ errors.category }}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="bg-gray-50 dark:bg-gray-700 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <motion.button
              type="button"
              :whileHover="{scale:'1.025'}"
              @click="submitForm"
              :disabled="isSubmitting"
              class="lg:ml-3 md:ml-3 w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 focus:outline-none focus:ring-2 focus:ring-offset-2 sm:w-auto sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed"
              :class="
                mode === 'add' ? 'bg-green-600 hover:bg-green-700' : 'bg-blue-600 hover:bg-blue-700'
              "
            >
              <span v-if="!isSubmitting">{{
                mode === "add" ? "Add Product" : "Update Product"
              }}</span>
              <span v-else class="flex items-center">
                <svg
                  class="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    class="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    stroke-width="4"
                  ></circle>
                  <path
                    class="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                {{ mode === "add" ? "Adding..." : "Updating..." }}
              </span>
            </motion.button>
            <motion.button
              type="button"
              :whileHover="{scale:'1.025'}"
              @click="close"
              class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm dark:bg-gray-600 dark:text-white dark:border-gray-500"
            >
              Cancel
            </motion.button>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script setup>
import { ref, watch, computed } from "vue";
import { useToast } from "vue-toastification";
import * as yup from "yup";
import api from "@/api";
import { motion } from 'motion-v'

const props = defineProps({
  mode: {
    type: String,
    required: true,
    validator: (value) => ["add", "edit"].includes(value),
  },
});

const toast = useToast();
const isOpen = ref(false);
const isSubmitting = ref(false);
const imagePreview = ref(null);
const currentImage = ref("");
const productId = ref(null);

const form = ref({
  title: "",
  image: "",
  description: "",
  price: "",
  category: "",
});

const errors = ref({});
const touched = ref({
  title: false,
  image: false,
  description: false,
  price: false,
  category: false,
});

// Computed property for schema based on mode
const schema = computed(() => {
  // Base schema shared by both modes
  const baseSchema = {
    title: yup
      .string()
      .required("Title is required")
      .max(100, "Title must be less than 100 characters"),
    description: yup
      .string()
      .required("Description is required")
      .max(500, "Description must be less than 500 characters"),
    price: yup
      .number()
      .typeError("Price must be a number")
      .positive("Price must be positive")
      .max(1000000, "Price must be less than 1,000,000")
      .required("Price is required"),
    category: yup
      .string()
      .oneOf(["Electronics", "Clothes", "Furniture", "Books"], "Invalid category")
      .required("Category is required"),
  };

  // Add mode specific validation (image is required)
  if (props.mode === "add") {
    return yup.object().shape({
      ...baseSchema,
      image: yup.string().required("Image is required"),
    });
  }

  // Edit mode validation (image is optional)
  return yup.object().shape({
    ...baseSchema,
    image: yup.string(),
  });
});

// Watch for changes and validate touched fields
watch(
  () => form.value.title,
  () => {
    if (touched.value.title) validateField("title");
  }
);

watch(
  () => form.value.image,
  () => {
    if (touched.value.image) validateField("image");
  }
);

watch(
  () => form.value.description,
  () => {
    if (touched.value.description) validateField("description");
  }
);

watch(
  () => form.value.price,
  () => {
    if (touched.value.price) validateField("price");
  }
);

watch(
  () => form.value.category,
  () => {
    if (touched.value.category) validateField("category");
  }
);

const validateField = async (field) => {
  try {
    await yup.reach(schema.value, field).validate(form.value[field]);
    errors.value[field] = "";
  } catch (err) {
    errors.value[field] = err.message;
  }
};

const validateForm = async () => {
  try {
    await schema.value.validate(form.value, { abortEarly: false });
    errors.value = {};
    return true;
  } catch (err) {
    err.inner.forEach((error) => {
      errors.value[error.path] = error.message;
    });
    return false;
  }
};

const handleBlur = (field) => {
  touched.value[field] = true;
  validateField(field);
};

const emit = defineEmits(["product-added", "product-updated"]);

const open = (product = null) => {
  if (props.mode === "edit" && product) {
    productId.value = product.id;
    currentImage.value = product.image;
    form.value = {
      title: product.title,
      image: product.image,
      description: product.description,
      price: product.price,
      category: product.category,
    };
    // In edit mode, don't mark fields as touched initially
    touched.value = {
      title: false,
      image: false,
      description: false,
      price: false,
      category: false,
    };
  } else {
    resetForm();
    // In add mode, mark all fields as touched for immediate validation
    if (props.mode === "add") {
      touched.value = {
        title: true,
        image: true,
        description: true,
        price: true,
        category: true,
      };
    }
  }
  isOpen.value = true;
};

const close = () => {
  isOpen.value = false;
  resetForm();
};

const resetForm = () => {
  form.value = {
    title: "",
    image: "",
    description: "",
    price: "",
    category: "",
  };
  imagePreview.value = null;
  currentImage.value = "";
  productId.value = null;
  errors.value = {};
  touched.value = {
    title: false,
    image: false,
    description: false,
    price: false,
    category: false,
  };
};

const preventInvalidChars = (e) => {
  if (["e", "E", "+", "-"].includes(e.key)) {
    e.preventDefault();
  }
};

const handleImageUpload = (event) => {
  const file = event.target.files[0];

  // Reset previous state
  imagePreview.value = null;
  form.value.image = "";
  errors.value.image = "";

  if (!file) return;

  // Check if it's a folder (file.type will be empty for folders)
  if (!file.type) {
    errors.value.image = "Folders cannot be uploaded";
    event.target.value = ""; // Clear the input
    return;
  }

  // Validate file size
  if (file.size > 50 * 1024) {
    // 50kb
    errors.value.image = "File size must be less than 50kb";
    return;
  }

  // Check for valid JPG/JPEG
  if (!["image/jpeg", "image/jpg"].includes(file.type.toLowerCase())) {
    errors.value.image = "Only JPG/JPEG images are allowed";
    event.target.value = ""; // Clear the input
    return;
  }

  const reader = new FileReader();
  reader.onload = (e) => {
    imagePreview.value = e.target.result;
    form.value.image = e.target.result.split(",")[1]; // Get base64 part
    if (touched.value.image) validateField("image");
  };
  reader.onerror = () => {
    errors.value.image = "Error reading file";
    event.target.value = ""; // Clear the input
  };
  reader.readAsDataURL(file);
};

const submitForm = async () => {
  // Mark all fields as touched on submit
  touched.value = {
    title: true,
    image: true,
    description: true,
    price: true,
    category: true,
  };

  const isValid = await validateForm();
  if (!isValid) return;

  try {
    isSubmitting.value = true;

    // Prepare payload
    const payload = {
      title: form.value.title,
      description: form.value.description,
      price: parseFloat(form.value.price),
      category: form.value.category,
    };

    // Include image only if it was changed or we're in add mode
    if (props.mode === "add" || form.value.image !== currentImage.value) {
      payload.image = form.value.image;
    }

    // Make appropriate API call based on mode
    if (props.mode === "add") {
      await api.post("/products/add", payload);
      toast.success("Product added successfully");
      emit("product-added");
    } else {
      await api.put(`/products/product/${productId.value}`, payload);
      toast.success("Product updated successfully");
      emit("product-updated");
    }

    close();
  } catch (error) {
    if (error.response) {
      toast.error(
        error.response?.message || `Failed to ${props.mode === "add" ? "add" : "update"} product`
      );
    } else {
      toast.error("Network error occurred");
      console.error(`Error ${props.mode === "add" ? "adding" : "updating"} product:`, error);
    }
  } finally {
    isSubmitting.value = false;
  }
};

defineExpose({ open, close });
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
