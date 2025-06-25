<template>
  <nav
    class="bg-white shadow-lg"
    v-if="isAuthenticated && !errorStore.has403Error"
  >
    <div class="max-w-6xl mx-auto px-4">
      <div class="flex justify-between">
        <!-- Website Logo -->
        <div>
          <router-link
            to="/"
            class="flex items-center py-4 px-2 text-gray-700 hover:text-gray-900"
          >
            <img
              src="../../assets/admin.png"
              alt=""
              class="w-10 rounded-full"
            />
          </router-link>
        </div>

        <!-- Primary Navbar items -->
        <div class="hidden md:flex items-center space-x-1">
          <!-- Show Home for all authenticated users -->
          <router-link
            v-if="userRole === 'user'"
            to="/"
            class="py-4 px-2 text-gray-500 font-semibold hover:text-blue-500 transition duration-300"
            active-class="text-blue-500 border-b-4 border-blue-500"
            >Home</router-link
          >

          <!-- Show Product only for user role -->
          <!-- <router-link 
            v-if="userRole === 'user'"
            to="/product" 
            class="py-4 px-2 text-gray-500 font-semibold hover:text-blue-500 transition duration-300"
            active-class="text-blue-500 border-b-4 border-blue-500"
          >Product</router-link> -->

          <!-- Show Admin only for admin role -->
          <router-link
            v-if="userRole === 'admin'"
            to="/admin"
            class="py-4 px-2 text-gray-500 font-semibold hover:text-blue-500 transition duration-300"
            active-class="text-blue-500 border-b-4 border-blue-500"
            >Dashboard</router-link
          >

          <router-link
            v-if="userRole === 'admin'"
            to="/manage"
            class="py-4 px-2 text-gray-500 font-semibold hover:text-blue-500 transition duration-300"
            active-class="text-blue-500 border-b-4 border-blue-500"
            >Manage</router-link
          >

          <router-link
            v-if="userRole === 'superadmin'"
            to="/super"
            class="py-4 px-2 text-gray-500 font-semibold hover:text-blue-500 transition duration-300"
            active-class="text-blue-500 border-b-4 border-blue-500"
            >Super Admin</router-link
          >

          <router-link
            v-if="userRole === 'superadmin'"
            to="/superproduct"
            class="py-4 px-2 text-gray-500 font-semibold hover:text-blue-500 transition duration-300"
            active-class="text-blue-500 border-b-4 border-blue-500"
            >Manage</router-link
          >
        </div>

        <!-- Secondary Navbar items -->
        <div class="hidden md:flex items-center space-x-3">
          <!-- Theme toggle button -->
          <button
            @click="themeStore.toggleTheme"
            class="p-2 rounded-full focus:outline-none"
            aria-label="Toggle dark mode"
          >
            <svg
              v-if="themeStore.isDark"
              xmlns="http://www.w3.org/2000/svg"
              class="h-6 w-6 text-yellow-300"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
              />
            </svg>
            <svg
              v-else
              xmlns="http://www.w3.org/2000/svg"
              class="h-6 w-6 text-gray-700"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
              />
            </svg>
          </button>
          <button
            @click="logout"
            class="py-2 px-2 font-medium text-gray-500 rounded hover:bg-blue-500 hover:text-white transition duration-300"
          >
            Log Out
          </button>
        </div>

        <!-- Mobile menu button -->
        <div class="md:hidden flex items-center">
          <button class="outline-none mobile-menu-button" @click="toggleMenu">
            <svg
              class="w-6 h-6 text-gray-500 hover:text-blue-500"
              :class="{ hidden: isOpen, block: !isOpen }"
              fill="none"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path d="M4 6h16M4 12h16M4 18h16"></path>
            </svg>
            <svg
              class="w-6 h-6 text-gray-500 hover:text-blue-500"
              :class="{ hidden: !isOpen, block: isOpen }"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M6 18L18 6M6 6l12 12"
              ></path>
            </svg>
          </button>
        </div>
      </div>
    </div>

    <!-- Mobile menu -->
    <div class="mobile-menu md:hidden" :class="{ hidden: !isOpen }">
      <!-- Show Home for all authenticated users -->
      <router-link
        v-if="userRole === 'user'"
        to="/"
        class="block py-2 px-4 text-sm hover:bg-gray-200 text-gray-950"
        active-class="bg-blue-500 text-white"
        >Home</router-link
      >

      <!-- Show Product only for user role -->
      <!-- <router-link 
        v-if="userRole === 'user'"
        to="/product" 
        class="block py-2 px-4 text-sm hover:bg-gray-200 text-gray-950"
        active-class="bg-blue-500 text-white"
      >Product</router-link> -->

      <!-- Show Admin only for admin role -->
      <router-link
        v-if="userRole === 'admin'"
        to="/admin"
        class="block py-2 px-4 text-sm hover:bg-gray-200 text-gray-950"
        active-class="bg-blue-500 text-white"
        >Dashboard</router-link
      >

      <router-link
        v-if="userRole === 'admin'"
        to="/manage"
        class="block py-2 px-4 text-sm hover:bg-gray-200 text-gray-950"
        active-class="bg-blue-500 text-white"
        >Manage</router-link
      >

      <router-link
        v-if="userRole === 'superadmin'"
        to="/super"
        class="block py-2 px-4 text-sm hover:bg-gray-200 text-gray-950"
        active-class="bg-blue-500 text-white"
        >Super Admin</router-link
      >

      <router-link
        v-if="userRole === 'superadmin'"
        to="/superproduct"
        class="block py-2 px-4 text-sm hover:bg-gray-200 text-gray-950"
        active-class="bg-blue-500 text-white"
        >Manage</router-link
      >

      <div class="border-t border-gray-200 pt-2 pb-2">
        <button
          @click="logout"
          class="block py-2 px-4 text-sm hover:bg-gray-200 text-gray-950"
        >
          Log Out
        </button>
      </div>
    </div>
  </nav>
</template>

<!-- <script setup>
import { ref, computed, watch,onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth'; // Assuming you're using Pinia
import { useToast } from 'vue-toastification';
import { useThemeStore } from '@/stores/theme'
import { useErrorStore } from '@/stores/error'; // Add this import
import axios from 'axios';



const themeStore = useThemeStore()
const errorStore = useErrorStore(); // Add this line

const router = useRouter();
const authStore = useAuthStore();
const isOpen = ref(false);
const toast = useToast()
const user = ref()

// Reactive properties
const isAuthenticated = computed(() => authStore.isAuthenticated);
const userRole = computed(() => authStore.userRole);

// Watch for route changes to close mobile menu
watch(() => router.currentRoute.value, () => {
  isOpen.value = false;
});

const fetchUserData = async () => {
  try {
    const userId = localStorage.getItem('userId')
    if (!userId) throw new Error('User ID not found')
    
    const response = await axios.get(`http://192.168.1.14:3000/api/auth/user/${userId}`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('authToken')}`
      }
    })
    
    
    // user.value = Array.isArray(response.data) ? response.data[0] : response.data
    // Extract user data from response
    const userData = Array.isArray(response.data) ? response.data[0] : response.data;
    console.log('User data:', userData);

    // Store the user role in localStorage
    if (userData && userData.role) {
      localStorage.setItem('userRole', userData.role);
      console.log('Role stored:', userData.role);
    } else {
      throw new Error('Role not found in response');
    }

    // Store the complete user data if needed
    user.value = userData;
  } catch (err) {
    console.error('Fetch error:', err)
  }
}

const toggleMenu = () => {
  isOpen.value = !isOpen.value;
};

function logout() {
  authStore.logout();
  router.push('/login');
  toast.warning("User LogOut..")
}
onMounted(() => {
  fetchUserData();
});
</script> -->

<script setup>
import { ref, computed, watch, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "@/stores/auth";
import { useToast } from "vue-toastification";
import { useThemeStore } from "@/stores/theme";
import { useErrorStore } from "@/stores/error";
import axios from "axios";

const themeStore = useThemeStore();
const errorStore = useErrorStore();
const router = useRouter();
const authStore = useAuthStore();
const isOpen = ref(false);
const toast = useToast();
const user = ref();

// Reactive properties
const isAuthenticated = computed(() => authStore.isAuthenticated);
const userRole = computed(() => authStore.userRole);

// Define role routes
const roleRoutes = {
  user: ["/"],
  admin: ["/admin", "/manage"],
  superadmin: ["/super", "/superproduct"],
};

// // Handle role changes and redirect
// const handleRoleChange = (newRole) => {
//   const currentRoute = router.currentRoute.value.path;
//   if (!roleRoutes[newRole]?.some(route => currentRoute.startsWith(route))) {
//     router.push(roleRoutes[newRole]?.[0] || '/');
//   }
// };

// Enhanced role change handler
const handleRoleChange = (newRole) => {
  const currentRoute = router.currentRoute.value.path;
  const allowedRoutes = roleRoutes[newRole] || [];

  // Check if current route is allowed for new role
  const isRouteAllowed = allowedRoutes.some((route) =>
    currentRoute.startsWith(route),
  );

  if (!isRouteAllowed) {
    const redirectPath = allowedRoutes[0] || "/";
    router.push(redirectPath);
  }
};

// Watch for 403 errors from any page
// watch(
//   () => errorStore.has403Error,
//   (hasError) => {
//     if (hasError) {
//       // If roles match but still got 403, force logout
//       if (!errorStore.roleMismatch) {
//         authStore.logout();
//         router.push('/login');
//       }
//       errorStore.reset403Error();
//     }
//   },
//   { immediate: true }
// );

// // Watch for role changes
// watch(userRole, (newRole) => {
//   if (newRole) {
//     handleRoleChange(newRole);
//   }
// });

// Watch for role changes more effectively
watch(
  userRole,
  (newRole, oldRole) => {
    if (newRole && newRole !== oldRole) {
      handleRoleChange(newRole);
    }
  },
  { immediate: true },
);

// Watch for route changes to close mobile menu
watch(
  () => router.currentRoute.value,
  () => {
    isOpen.value = false;
  },
);

// const fetchUserData = async () => {
//   try {
//     const userId = localStorage.getItem('userId');
//     if (!userId) throw new Error('User ID not found');

//     const response = await axios.get(`http://192.168.1.22:3000/api/auth/user/${userId}`, {
//       headers: {
//         'Authorization': `Bearer ${localStorage.getItem('authToken')}`
//       }
//     });

//     const userData = Array.isArray(response.data) ? response.data[0] : response.data;
//     console.log('User data:', userData);

//     if (userData?.role) {
//       // Use authStore to update role instead of directly modifying localStorage
//       authStore.setRole(userData.role);

//       // Handle the route change immediately
//       handleRoleChange(userData.role);
//     }

//     user.value = userData;
//   } catch (err) {
//     console.error('Fetch error:', err);
//     if (err.response?.status === 401) {
//       authStore.logout();
//     }
//   }
// };

// const fetchUserData = async () => {
//   try {
//     const userId = localStorage.getItem('userId');
//     if (!userId) throw new Error('User ID not found');

//     const response = await axios.get(`http://192.168.1.22:3000/api/auth/user/${userId}`, {
//       headers: {
//         'Authorization': `Bearer ${localStorage.getItem('authToken')}`
//       }
//     });

//     const userData = Array.isArray(response.data) ? response.data[0] : response.data;

//     if (userData?.role) {
//       authStore.setRole(userData.role);
//       handleRoleChange(userData.role);
//     }

//     user.value = userData;
//   } catch (err) {
//     console.error('Fetch error:', err);
//     if (err.response?.status === 401) {
//       authStore.logout();
//     }
//   }
// };

const fetchUserData = async () => {
  try {
    const userId = localStorage.getItem("userId");
    if (!userId) throw new Error("User ID not found");

    const response = await axios.get(
      `https://productmanagement-98nw.onrender.com/api/auth/user/${userId}`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      },
    );

    const userData = Array.isArray(response.data)
      ? response.data[0]
      : response.data;
    const localStorageRole = localStorage.getItem("userRole");

    if (userData?.role) {
      // Update role in store
      authStore.setRole(userData.role);

      // Critical check: If roles match but errorStore shows 403
      if (userData.role === localStorageRole && errorStore.has403Error) {
        console.warn("Role matches but 403 detected - forcing logout");
        authStore.logout();
        router.push("/login");
        return;
      }
    }
  } catch (err) {
    console.error("Fetch error:", err);
    if (err.response?.status === 401 || err.response?.status === 403) {
      authStore.logout();
    }
  }
};

// Watch for 403 errors from any component
watch(
  () => errorStore.has403Error,
  (hasError) => {
    if (hasError) {
      // Re-fetch user data to verify role consistency
      fetchUserData();
    }
  },
);

const toggleMenu = () => {
  isOpen.value = !isOpen.value;
};

function logout() {
  authStore.logout();
  router.push("/login");
  toast.warning("User LogOut..");
}

onMounted(() => {
  fetchUserData();

  // Listen for storage changes from other tabs
  window.addEventListener("storage", (event) => {
    if (event.key === "userRole") {
      authStore.setRole(event.newValue);
    }
  });
});
</script>
