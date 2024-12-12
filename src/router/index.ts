import {
  createRouter,
  createWebHistory,
  RouteLocationNormalized,
  RouteLocationNormalizedGeneric,
  RouteRecordRaw,
} from "vue-router";
import HomeRoutes from "@/modules/Home/home.routes";
import Inbox from "@/modules/Document/document.routes";
import Monitoring from "@/modules/Monitoring/monitoring.routes";
import Settings from "@/modules/Settings/settings.routes";
import Warehouse from "@/modules/WarehouseBases/warehouse-bases.routes";
import KitchenWarehouse from "@/modules/KitchenWarehouse/kitchen-warehouse.routes";
import Kitchen from "@/modules/Kitchen/kitchen.routes";
import Users from "@/modules/Users/users.routes";
import AuthRoutes from "@/modules/Auth/auth.routes";
import tokenManager from "@/utils/token.manager";
import { useI18n } from "vue-i18n";
import localization from "@/localization";
import { setDocumentTitle } from "@/utils/helper";

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


const index = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

index.beforeEach(async (to: any, _, next) => {
  if (!to.meta.layout) to.meta.layout = "MainLayout";

  if (to.meta.layout === "MainLayout") {
    if (!tokenManager.getAccessToken()) next({ name: "login" });
  }
  next();
});


index.afterEach((to: RouteLocationNormalized) => {
  const { t } = localization.global;
  const { title, isTranslate } = to.meta;

  if (title) setDocumentTitle(isTranslate ? t(title) : title);
  else setDocumentTitle(t("title"));
});

export default index;
