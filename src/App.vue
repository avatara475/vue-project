<script setup>
import Navbar from "./components/Navbar/NavbarPage.vue";
import Footer from "./components/FooterPage.vue";

import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();
const isRouterReady = ref(false);

onMounted(() => {
  // Check initial auth state
  const token = localStorage.getItem("authToken");
  const role = localStorage.getItem("userRole");

  if (!token && router.currentRoute.value.meta.requiresAuth) {
    router.push("/login");
  }

  isRouterReady.value = true;
});
</script>

<template>
  <div>
    <Navbar/>
    <router-view v-if="isRouterReady" />
    <Footer/>
  </div>
</template>
