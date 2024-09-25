import { createRouter, createWebHistory } from "vue-router";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
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
  ],
});

export default router;
