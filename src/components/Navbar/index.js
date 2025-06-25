import { createRouter, createWebHistory } from "vue-router";
import Home from "../User/HomePage/HomePage.vue";
// import Product from '../User/ProductPage/ProductPage.vue'
import Admin from "../Admin/Dashbaord/Admin.vue";
import Login from "../login.vue";
import Manage from "../Admin/manage/manage.vue";
import Signup from "../signup.vue";

import SuperAdmin from "../SuperAdmin/SuperAdmin.vue";
import ProductManage from "../SuperAdmin/ProductManage.vue";

const routes = [
  {
    path: "/",
    name: "Home",
    component: () => import("../User/HomePage/HomePage.vue"),
    meta: { requiresAuth: true, allowedRoles: ["user"] },
  },
  // {
  //   path: '/product',
  //   name: 'Product',
  //   component: Product,
  //   meta: { requiresAuth: true, allowedRoles: ['user'] }
  // },
  {
    path: "/admin",
    name: "Admin",
    component: () => import("../Admin/Dashbaord/Admin.vue"),
    meta: { requiresAuth: true, allowedRoles: ["admin"] },
  },
  {
    path: "/manage",
    name: "Manage",
    component: () => import("../Admin/manage/manage.vue"),
    meta: { requiresAuth: true, allowedRoles: ["admin"] },
  },
  {
    path: "/super",
    name: "Super",
    component: () => import("../SuperAdmin/SuperAdmin.vue"),
    meta: { requiresAuth: true, allowedRoles: ["superadmin"] },
  },
  {
    path: "/superproduct",
    name: "SuperProduct",
    component: () => import("../SuperAdmin/ProductManage.vue"),
    meta: { requiresAuth: true, allowedRoles: ["superadmin"] },
  },
  {
    path: "/login",
    name: "Login",
    component: () => import("../login.vue"),
    meta: { requiresAuth: false },
  },
  {
    path: "/signup",
    name: "Signup",
    component: () => import("../signup.vue"),
    meta: { requiresAuth: false },
  },

  // {
  //   path: '/:pathMatch(.*)*', // This should be LAST
  //   redirect: (to) => {
  //     const isAuthenticated = !!localStorage.getItem('authToken')
  //     const userRole = localStorage.getItem('userRole')

  //     if (!isAuthenticated) {
  //       return { name: 'Login' }
  //     }

  //     // Redirect to appropriate page based on role
  //     return userRole === 'admin' ? { name: 'Admin' } : { name: 'Home' }
  //   }
  // }
  {
    path: "/:pathMatch(.*)*", // This should be LAST
    redirect: (to) => {
      const isAuthenticated = !!localStorage.getItem("authToken");
      const userRole = localStorage.getItem("userRole");

      if (!isAuthenticated) {
        return { name: "Login" };
      }

      // Redirect to appropriate page based on role
      return userRole === "admin"
        ? { name: "Admin" }
        : userRole === "superadmin"
          ? { name: "Super" }
          : { name: "Home" };
    },
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// Navigation guard
// router.beforeEach((to, from, next) => {
//   const isAuthenticated = !!localStorage.getItem('authToken')
//   const userRole = localStorage.getItem('userRole')

//   // If route requires authentication
//   if (to.meta.requiresAuth) {
//     if (!isAuthenticated) {
//       // Redirect to login if not authenticated
//       return next({ name: 'Login' })
//     }

//     // Check if user has required role
//     if (to.meta.allowedRoles && !to.meta.allowedRoles.includes(userRole)) {
//       // Redirect to appropriate page based on role
//       const redirectPath = userRole === 'admin' ? '/admin' : '/'
//       return next(redirectPath)
//     }
//   }

//   // If user is authenticated and tries to access login page
//   if (to.name === 'Login' && isAuthenticated) {
//     // Redirect to appropriate dashboard based on role
//     const redirectPath = userRole === 'admin' ? '/admin' : '/'
//     return next(redirectPath)
//   }

//   next()
// })

// Update the redirect logic in the navigation guard
// router.beforeEach((to, from, next) => {
//   const isAuthenticated = !!localStorage.getItem('authToken')
//   const userRole = localStorage.getItem('userRole')

//   // If route requires authentication
//   if (to.meta.requiresAuth) {
//     if (!isAuthenticated) {
//       return next({ name: 'Login' })
//     }

//     // Check if user has required role
//     if (to.meta.allowedRoles && !to.meta.allowedRoles.includes(userRole)) {
//       // Redirect to appropriate page based on role
//       const redirectPath = userRole === 'admin' ? '/admin' :
//                          userRole === 'superadmin' ? '/super' : '/'
//       return next(redirectPath)
//     }
//   }

//   // If user is authenticated and tries to access login page
//   if (to.name === 'Login' && isAuthenticated) {
//     // Redirect to appropriate dashboard based on role
//     const redirectPath = userRole === 'admin' ? '/admin' :
//                        userRole === 'superadmin' ? '/super' : '/'
//     return next(redirectPath)
//   }

//   next()
// })

router.beforeEach((to, from, next) => {
  const isAuthenticated = !!localStorage.getItem("authToken");
  const userRole = localStorage.getItem("userRole");

  // If route requires authentication
  if (to.meta.requiresAuth) {
    if (!isAuthenticated) {
      return next({ name: "Login" });
    }

    // Check if user has required role
    if (to.meta.allowedRoles && !to.meta.allowedRoles.includes(userRole)) {
      // Redirect to appropriate page based on role
      const redirectPath =
        userRole === "admin"
          ? "/admin"
          : userRole === "superadmin"
            ? "/super"
            : "/";
      return next(redirectPath);
    }
  }

  // If user is authenticated and tries to access login or signup page
  if ((to.name === "Login" || to.name === "Signup") && isAuthenticated) {
    // Redirect to appropriate dashboard based on role
    const redirectPath =
      userRole === "admin"
        ? "/admin"
        : userRole === "superadmin"
          ? "/super"
          : "/";
    return next(redirectPath);
  }

  next();
});

export default router;
