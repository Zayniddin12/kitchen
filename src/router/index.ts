import { createRouter, createWebHistory } from "vue-router";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  scrollBehavior() {
    return { x: 0, y: 0 };
  },
  routes: [
    {
      path: "/",
      redirect: () => {

        return { name: "home" };
      },
    },
    {
      path: "/home",
      name: "home",
      component: () => import("@/modules/Home/index.vue"),
      meta: {
        layout: "MainLayout",
        breadcrumb: [
          {
            label: "home",
            isActionable: false,
          },
        ],

      },
    },
    {
      path: "/login",
      name: "login",
      component: import("../views/Login.vue"),
      meta: { layout: "LoginLayout" },

    },
    {
      path: "/:pathMatch(.*)*",
      component: import("../components/errors/404.vue"),
      meta: { layout: "ErrorLayout" },
    },

  ],
});

export default router;
