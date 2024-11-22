import { RouteRecordRaw } from "vue-router";

export default [
    //------------------------------База кадров------------------------------
    {
        path: "/personal-database",
        name: "personal-database",
        component: () => import("@/modules/Users/pages/Users.vue"),
        meta: {
            title: "База кадров",
            hasTabs: true
        }
    },
    {
        path: "/personal-database-fetch",
        name: "personal-database-fetch",
        component: () => import("@/modules/Users/pages/UserFetch.vue"),
        meta: {
            parentRouteTitle: "База кадров",
            parentRouteUrl: { name: "personal-database" },
            title: "База кадров"
        }
    },
    {
        path: "/personal-database-create",
        name: "personal-database-create",
        component: () => import("@/modules/Users/pages/PersonnelDatabase/PersonnelDatabaseAddEdit.vue"),
        meta: {
            title: "База кадров"
        }
    },
    {
        path: "/personal-database-edit/:id(\\d+)",
        name: "personal-database-edit",
        component: () => import("@/modules/Users/pages/PersonnelDatabase/PersonnelDatabaseAddEdit.vue"),
        meta: {
            title: "Редактировать"
        }
    },
    {
        path: "/personal-database-show/:id(\\d+)",
        name: "personal-database-id",
        component: () => import("@/modules/Users/pages/User.vue"),
        meta: {
            parentRouteTitle: "База кадров",
            parentRouteUrl: { name: "personal-database" },
            title: "Просмотр"
        }
    },

    //------------------------------Посетители----------------------------
    {
        path: "/visitors",
        name: "visitors",
        component: () => import("@/modules/Users/pages/Users.vue"),
        meta: {
            title: "Посетители"
        }
    },
    {
        path: "/visitors-fetch",
        name: "visitors-fetch",
        component: () => import("@/modules/Users/pages/UserFetch.vue"),
        meta: {
            parentRouteTitle: "Посетители",
            parentRouteUrl: { name: "visitors" },
            title: "Добавить"
        }
    },
    {
        path: "/visitors-create",
        name: "visitors-create",
        component: () => import("@/modules/Users/pages/Visitors/VisitorsAddEdit.vue"),
        meta: {
            title: "Добавить"
        }
    },
    {
        path: "/visitors-edit/:id(\\d+)",
        name: "visitors-edit",
        component: () => import("@/modules/Users/pages/Visitors/VisitorsAddEdit.vue"),
        meta: {
            title: "Редактировать"
        }
    },
    {
        path: "/visitors-show/:id(\\d+)",
        name: "visitors-id",
        component: () => import("@/modules/Users/pages/User.vue"),
        meta: {
            title: "Просмотр",
            parentRouteTitle: "Посетители",
            parentRouteUrl: { name: "visitors" }
        }
    }
] as RouteRecordRaw[];
