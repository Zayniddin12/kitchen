import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";
import HomeRoutes from "@/modules/Home/home.routes";
import Inbox from "@/modules/Document/document.routes";
import Monitoring from "@/modules/Monitoring/monitoring.routes";
import Settings from "@/modules/Settings/router";
import Warehouse from "@/modules/WarehouseBases/warehouse-bases.routes";
import KitchenWarehouse from "@/modules/KitchenWarehouse/kitchen-warehouse.routes";
import Kitchen from "@/modules/Kitchen/kitchen.routes";
import Users from "@/modules/Users/users.routes";
import AuthRoutes from "@/modules/Auth/auth.routes";
import tokenManager from "@/utils/token.manager";

const routes: RouteRecordRaw[] = [
  ...HomeRoutes,
  ...AuthRoutes,
  ...Inbox,
  ...Monitoring,
  ...Settings,
  ...Warehouse,
  ...KitchenWarehouse,
  ...Kitchen,
  ...Users,

  {
    path: "/:pathMatch(.*)*",
    name: "notFound",
    component: () => import("@/components/errors/404.vue"),
    meta: { layout: "ErrorLayout" },
  },
];


const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

router.beforeEach(async (to: any, _, next) => {
  if (!to.meta.layout) to.meta.layout = "MainLayout";

  if (to.meta.layout === "MainLayout") {
    if (!tokenManager.getAccessToken()) next({ name: "login" });
  }
  next();
});


router.afterEach((to: any) => {
  const DEFAULT_TITLE = "KITCHEN";
  document.title = to.meta.title || DEFAULT_TITLE;
});

export default router;
