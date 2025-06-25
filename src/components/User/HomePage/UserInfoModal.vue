<template>
  <div>
    <!-- Button to trigger user info modal -->
    <button
      @click="fetchUserData"
      class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition cursor-pointer"
    >
      {{ btitle }}
    </button>

    <!-- User Information Modal -->
    <div
      v-if="showModal"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
    >
      <div class="bg-white rounded-lg shadow-xl w-full max-w-md">
        <!-- Modal header -->
        <div class="flex justify-between items-center border-b p-4">
          <h3 class="text-lg font-semibold text-gray-800">{{ title }}</h3>
          <button @click="closeModal" class="text-gray-500 hover:text-gray-700">
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
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <!-- Modal content -->
        <div class="p-6">
          <div v-if="loading" class="flex justify-center">
            <div
              class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"
            ></div>
          </div>

          <div v-else-if="error" class="text-red-500 text-center">
            {{ error }}
          </div>

          <div v-else-if="user" class="space-y-4">
            <!-- User image -->
            <div class="flex justify-center">
              <div
                class="h-24 w-24 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden"
              >
                <img
                  v-if="user.image && user.image !== 'null'"
                  :src="getImageUrl(user.image)"
                  alt="User image"
                  class="h-full w-full object-cover"
                />
                <span v-else class="text-gray-500 text-4xl">
                  {{ user.name?.charAt(0)?.toUpperCase() ?? "U" }}
                </span>
              </div>
            </div>

            <!-- User name -->
            <div class="text-center">
              <p class="text-xl font-semibold text-gray-900">
                {{ user.name ?? "Unknown User" }}
              </p>
            </div>

            <!-- Edit button - opens update modal -->
            <div class="pt-4">
              <button
                @click="openUpdateModal"
                class="w-full px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition"
              >
                Edit Profile
              </button>
            </div>
          </div>

          <div v-else class="text-gray-500 text-center">
            No user data available
          </div>
        </div>
      </div>
    </div>

    <!-- Update Profile Modal -->
    <div
      v-if="showUpdateModal"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
    >
      <div class="bg-white rounded-lg shadow-xl w-full max-w-md">
        <div class="flex justify-between items-center border-b p-4">
          <h3 class="text-lg font-semibold text-gray-950">Update Profile</h3>
          <button
            @click="closeUpdateModal"
            class="text-gray-500 hover:text-gray-700"
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
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <div class="p-6">
          <form @submit.prevent="handleSubmit">
            <!-- Name Field -->
            <div class="mb-4">
              <label
                class="block text-gray-700 text-sm font-bold mb-2"
                for="name"
              >
                Name
              </label>
              <input
                v-model="updateForm.name"
                @blur="handleBlur('name')"
                @input="handleInput('name')"
                :class="{ 'border-red-500': errors.name }"
                class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="name"
                type="text"
              />
              <p v-if="errors.name" class="text-red-500 text-xs italic">
                {{ errors.name }}
              </p>
            </div>

            <!-- Image Upload -->
            <div class="mb-6">
              <label
                class="block text-gray-700 text-sm font-bold mb-2"
                for="image"
              >
                Profile Image
                <span
                  v-if="user?.image && user.image !== 'null'"
                  class="text-gray-500 font-normal"
                  >(Optional)</span
                >
              </label>
              <div class="flex items-center">
                <div class="mr-4">
                  <div
                    class="h-16 w-16 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden"
                  >
                    <img
                      v-if="updateForm.imagePreview"
                      :src="updateForm.imagePreview"
                      alt="Preview"
                      class="h-full w-full object-cover"
                    />
                    <img
                      v-else-if="user?.image && user.image !== 'null'"
                      :src="getImageUrl(user.image)"
                      alt="Current Profile"
                      class="h-full w-full object-cover"
                    />
                    <span v-else class="text-gray-500 text-xl">
                      {{ updateForm.name?.charAt(0)?.toUpperCase() ?? "U" }}
                    </span>
                  </div>
                </div>
                <div>
                  <input
                    @change="handleImageUpload"
                    class="hidden"
                    ref="fileInput"
                    id="image"
                    type="file"
                    accept="image/jpeg, image/jpg"
                  />
                  <button
                    @click="$refs.fileInput.click()"
                    type="button"
                    class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                  >
                    {{
                      user?.image && user.image !== "null"
                        ? "Change Image"
                        : "Add Image"
                    }}
                  </button>
                  <!-- <button
        v-if="(user?.image && user.image !== 'null') || updateForm.imagePreview"
        @click="removeImage"
        type="button"
        class="ml-2 bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
      >
        Remove
      </button> -->
                  <p class="text-xs text-gray-500 mt-1">
                    JPEG, PNG only (Max 50kb)
                  </p>
                </div>
              </div>
              <p v-if="errors.image" class="text-red-500 text-xs italic mt-1">
                {{ errors.image }}
              </p>
            </div>

            <!-- Form Actions -->
            <div class="flex items-center justify-between">
              <button
                type="button"
                @click="closeUpdateModal"
                class="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              >
                Cancel
              </button>
              <button
                type="submit"
                :disabled="updateLoading"
                class="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline disabled:opacity-50"
              >
                <span v-if="updateLoading">Updating...</span>
                <span v-else>Update Profile</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<!-- <script setup>
import { ref } from 'vue'
import axios from 'axios'
import * as yup from 'yup'
import { useToast } from 'vue-toastification'

const props = defineProps({
  btitle: {
    type: String,
    default: 'Show Info'
  },
  title: {
    type: String,
    default: 'Information'
  }
})

const touchedFields = ref({
  name: false,
  image: false
})

const toast = useToast()
// Helper function to determine image URL
const getImageUrl = (image) => {
  return image.startsWith('http') ? image : `data:image/jpeg;base64,${image}`
}

// User info modal state
const showModal = ref(false)
const loading = ref(false)
const user = ref(null)
const error = ref(null)

// Update modal state
const showUpdateModal = ref(false)
const updateLoading = ref(false)
const fileInput = ref(null)
const errors = ref({})

// Form schema validation
// const schema = yup.object().shape({
//   name: yup.string()
//     .required('Name is required')
//     .min(2, 'Name must be at least 2 characters')
//     .max(50, 'Name must not exceed 50 characters'),
//   image: yup.mixed()
//     .test('fileSize', 'File too large (max 2MB)', (value) => {
//       if (!value) return true // image is optional
//       return value.size <= 2 * 1024 * 1024 // 2MB
//     })
//     .test('fileType', 'Unsupported file format (only JPEG/PNG)', (value) => {
//       if (!value) return true // image is optional
//       return ['image/jpeg', 'image/png', 'image/jpg'].includes(value.type)
//     })
// })

const schema = yup.object().shape({
  name: yup.string()
    .required('Name is required')
    .min(2, 'Name must be at least 2 characters')
    .max(50, 'Name must not exceed 50 characters'),
  image: yup.mixed()
    .test('fileSize', 'File too large (max 50kb)', function(value) {
      if (!value) return true // image is optional
      return value.size <= 50 * 1024 // 50kb
    })
    .test('fileType', 'Unsupported file format (only JPEG/PNG)', function(value) {
      if (!value) return true // image is optional
      return ['image/jpeg', 'image/png', 'image/jpg'].includes(value.type)
    })
    .nullable() // Make the image field completely optional
})

const updateForm = ref({
  name: '',
  image: null,
  imageBase64: null,
  imagePreview: null
})

// Fetch user data with axios
const fetchUserData = async () => {
  loading.value = true
  error.value = null
  user.value = null
  showModal.value = true
  
  try {
    const userId = localStorage.getItem('userId')
    if (!userId) throw new Error('User ID not found')
    
    const response = await axios.get(`http://192.168.1.22:3000/api/auth/user/${userId}`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('authToken')}`
      }
    })
    
    user.value = Array.isArray(response.data) ? response.data[0] : response.data
  } catch (err) {
    error.value = err.response?.data?.message || err.message || 'Error fetching user data'
    console.error('Fetch error:', err)
  } finally {
    loading.value = false
  }
}

// Handle input event (typing)
const handleInput = async (fieldName) => {
  // Only validate if the field has been touched (blurred at least once)
  if (touchedFields.value[fieldName]) {
    await validateField(fieldName);
  }
};

// Handle blur event
const handleBlur = async (fieldName) => {
  touchedFields.value[fieldName] = true;
  await validateField(fieldName);
};

// Validate a single field
const validateField = async (fieldName) => {
  try {
    await schema.validateAt(fieldName, updateForm.value);
    errors.value[fieldName] = '';
  } catch (err) {
    errors.value[fieldName] = err.message;
  }
};


// Open update modal and initialize form
const openUpdateModal = () => {
  showUpdateModal.value = true
  updateForm.value = {
    name: user.value?.name || '',
    image: null,
    imageBase64: null,
    imagePreview: null // Start with no preview to show current image
  }
  errors.value = {}
  // Reset touched fields when opening modal
  touchedFields.value = {
    name: false,
    image: false
  }
}

// Handle image upload and convert to Base64
const handleImageUpload = (e) => {
  const file = e.target.files[0]
  errors.value.image = null

  if (!file) return

  // Validate file type
  if (!file.type.match('image.*')) {
    errors.value.image = 'Only image files are allowed'
    return
  }

  // Validate file size
  if (file.size > 50 * 1024) { // 50kb
    errors.value.image = 'File size must be less than 50kb'
    return
  }

  // Create preview
  const reader = new FileReader()
  reader.onload = (e) => {
    updateForm.value.imagePreview = e.target.result
  }
  reader.readAsDataURL(file)

  // Convert to Base64 for submission
  const base64Reader = new FileReader()
  base64Reader.onload = (e) => {
    const base64String = e.target.result
    updateForm.value.imageBase64 = base64String.split(',')[1] // Remove data URL prefix
    updateForm.value.image = file // Keep file reference for validation
  }
  base64Reader.readAsDataURL(file)
}

// Remove image
const removeImage = () => {
  updateForm.value.image = null
  updateForm.value.imageBase64 = 'null'
  updateForm.value.imagePreview = null
}


const handleSubmit = async () => {
  errors.value = {}
  updateLoading.value = true
  
  try {
    // Validate form (name only, image is optional)
    await schema.validate(updateForm.value, { abortEarly: false })
    
    const userId = localStorage.getItem('userId')
    const token = localStorage.getItem('authToken')
    
    if (!userId) throw new Error('User ID not found')
    if (!token) throw new Error('Authentication token not found')

    // Prepare payload - only include image if it was changed
    const payload = {
      name: updateForm.value.name
    }

    // Only include image in payload if it was changed
    if (updateForm.value.imageBase64 !== null) {
      payload.image = updateForm.value.imageBase64 || 'null'
    }

    const response = await axios.put(
      `http://192.168.1.22:3000/api/auth/updateprofile/${userId}`,
      payload,
      {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }
    )

    // Update local user data
    user.value = {
      ...user.value,
      name: updateForm.value.name,
      // Only update image if it was changed
      ...(updateForm.value.imageBase64 !== null && {
        image: updateForm.value.imageBase64 || 'null'
      })
    }

    closeUpdateModal()
    toast.success('Profile updated successfully!')
    
  } catch (err) {
    if (err.name === 'ValidationError') {
      err.inner.forEach((error) => {
        errors.value[error.path] = error.message
      })
    } else {
      const errorMsg = err.response?.data?.message || err.message || 'Error updating profile'
      toast.error(errorMsg)
      console.error('Update error:', err)
    }
  } finally {
    updateLoading.value = false
  }
}

// Close modals
const closeModal = () => {
  showModal.value = false
}

const closeUpdateModal = () => {
  showUpdateModal.value = false
}
</script> -->

<script setup>
import { ref } from "vue";
import * as yup from "yup";
import { useToast } from "vue-toastification";
import api from "@/api"; // Import the API middleware

const props = defineProps({
  btitle: {
    type: String,
    default: "Show Info",
  },
  title: {
    type: String,
    default: "Information",
  },
});

const touchedFields = ref({
  name: false,
  image: false,
});

const toast = useToast();

// Helper function to determine image URL
const getImageUrl = (image) => {
  return image.startsWith("http") ? image : `data:image/jpeg;base64,${image}`;
};

// User info modal state
const showModal = ref(false);
const loading = ref(false);
const user = ref(null);
const error = ref(null);

// Update modal state
const showUpdateModal = ref(false);
const updateLoading = ref(false);
const fileInput = ref(null);
const errors = ref({});

// Form schema validation
const schema = yup.object().shape({
  name: yup
    .string()
    .required("Name is required")
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name must not exceed 50 characters"),
  image: yup
    .mixed()
    .test("fileSize", "File too large (max 50kb)", function (value) {
      if (!value) return true; // image is optional
      return value.size <= 50 * 1024; // 50kb
    })
    .test(
      "fileType",
      "Unsupported file format (only JPEG/PNG)",
      function (value) {
        if (!value) return true; // image is optional
        return ["image/jpeg", "image/png", "image/jpg"].includes(value.type);
      },
    )
    .nullable(), // Make the image field completely optional
});

const updateForm = ref({
  name: "",
  image: null,
  imageBase64: null,
  imagePreview: null,
});

// Fetch user data using API middleware
const fetchUserData = async () => {
  loading.value = true;
  error.value = null;
  user.value = null;
  showModal.value = true;

  try {
    const userId = localStorage.getItem("userId");
    if (!userId) throw new Error("User ID not found");

    const response = await api.get(`/auth/user/${userId}`);
    user.value = Array.isArray(response) ? response[0] : response;
  } catch (err) {
    error.value = err.message || "Error fetching user data";
    console.error("Fetch error:", err);
  } finally {
    loading.value = false;
  }
};

// Handle input event (typing)
const handleInput = async (fieldName) => {
  if (touchedFields.value[fieldName]) {
    await validateField(fieldName);
  }
};

// Handle blur event
const handleBlur = async (fieldName) => {
  touchedFields.value[fieldName] = true;
  await validateField(fieldName);
};

// Validate a single field
const validateField = async (fieldName) => {
  try {
    await schema.validateAt(fieldName, updateForm.value);
    errors.value[fieldName] = "";
  } catch (err) {
    errors.value[fieldName] = err.message;
  }
};

// Open update modal and initialize form
const openUpdateModal = () => {
  showUpdateModal.value = true;
  updateForm.value = {
    name: user.value?.name || "",
    image: null,
    imageBase64: null,
    imagePreview: null,
  };
  errors.value = {};
  // Reset touched fields when opening modal
  touchedFields.value = {
    name: false,
    image: false,
  };
};

// Handle image upload and convert to Base64
const handleImageUpload = (e) => {
  const file = e.target.files[0];
  errors.value.image = null;

  if (!file) return;

  // Validate file type
  if (!file.type.match("image.*")) {
    errors.value.image = "Only image files are allowed";
    return;
  }

  // Validate file size
  if (file.size > 50 * 1024) {
    // 50kb
    errors.value.image = "File size must be less than 50kb";
    return;
  }

  // Create preview
  const reader = new FileReader();
  reader.onload = (e) => {
    updateForm.value.imagePreview = e.target.result;
  };
  reader.readAsDataURL(file);

  // Convert to Base64 for submission
  const base64Reader = new FileReader();
  base64Reader.onload = (e) => {
    const base64String = e.target.result;
    updateForm.value.imageBase64 = base64String.split(",")[1]; // Remove data URL prefix
    updateForm.value.image = file; // Keep file reference for validation
  };
  base64Reader.readAsDataURL(file);
};

// Remove image
const removeImage = () => {
  updateForm.value.image = null;
  updateForm.value.imageBase64 = "null";
  updateForm.value.imagePreview = null;
};

// Handle form submission using API middleware
const handleSubmit = async () => {
  errors.value = {};
  updateLoading.value = true;

  try {
    await schema.validate(updateForm.value, { abortEarly: false });
    const userId = localStorage.getItem("userId");

    if (!userId) throw new Error("User ID not found");

    const payload = {
      name: updateForm.value.name,
    };

    if (updateForm.value.imageBase64 !== null) {
      payload.image = updateForm.value.imageBase64 || "null";
    }

    const response = await api.put(`/auth/updateprofile/${userId}`, payload);

    user.value = {
      ...user.value,
      name: updateForm.value.name,
      ...(updateForm.value.imageBase64 !== null && {
        image: updateForm.value.imageBase64 || "null",
      }),
    };

    closeUpdateModal();
    toast.success("Profile updated successfully!");
  } catch (err) {
    if (err.name === "ValidationError") {
      err.inner.forEach((error) => {
        errors.value[error.path] = error.message;
      });
    } else {
      const errorMsg = err.message || "Error updating profile";
      toast.error(errorMsg);
      console.error("Update error:", err);
    }
  } finally {
    updateLoading.value = false;
  }
};

// Close modals
const closeModal = () => {
  showModal.value = false;
};

const closeUpdateModal = () => {
  showUpdateModal.value = false;
};
</script>
