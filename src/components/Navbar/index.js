import { createRouter, createWebHistory } from "vue-router";

const routes = [
  {
    path: "/",
    name: "Home",
    component: () => import("../User/HomePage/HomePage.vue"),
    meta: { requiresAuth: true, allowedRoles: ["user"] },
  },
  {
    path: "/admin",
    name: "Admin",
    component: () => import("../Admin/Dashbaord/AdminPage.vue"),
    meta: { requiresAuth: true, allowedRoles: ["admin"] },
  },
  {
    path: "/manage",
    name: "Manage",
    component: () => import("../Admin/manage/managePage.vue"),
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
    component: () => import("../loginPage.vue"),
    meta: { requiresAuth: false },
  },
  {
    path: "/signup",
    name: "Signup",
    component: () => import("../signupPage.vue"),
    meta: { requiresAuth: false },
  },
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
        userRole === "admin" ? "/admin" : userRole === "superadmin" ? "/super" : "/";
      return next(redirectPath);
    }
  }

  // If user is authenticated and tries to access login or signup page
  if ((to.name === "Login" || to.name === "Signup") && isAuthenticated) {
    // Redirect to appropriate dashboard based on role
    const redirectPath =
      userRole === "admin" ? "/admin" : userRole === "superadmin" ? "/super" : "/";
    return next(redirectPath);
  }

  next();
});

export default router;
