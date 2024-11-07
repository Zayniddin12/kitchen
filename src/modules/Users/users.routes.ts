import { RouteRecordRaw } from "vue-router";

export default [
    //------------------------------База кадров------------------------------
    {
        path: "/personal-database",
        name: "personal-database",
        component: () => import("@/modules/Users/pages/PersonnelDatabase/Index.vue"),
        meta: {
            title: "База кадров"
        }
    },
    {
        path: "/personal-database-create",
        name: "personal-database-create",
        component: () => import("@/modules/Users/components/PersonalDatabase/Create.vue"),
        meta: {
            title: "База кадров"
        }
    },
    {
        path: "/personal-database-create-form",
        name: "personal-database-create-form",
        component: () => import("@/modules/Users/components/PersonalDatabase/AddEdit.vue"),
        meta: {
            title: "База кадров"
        }
    },
    {
        path: "/personal-database-edit-form/:id",
        name: "personal-database-edit-form-id",
        component: () => import("@/modules/Users/components/PersonalDatabase/AddEdit.vue"),
        meta: {
            title: "Редактировать"
        }
    },
    {
        path: "/personal-database-view/:id",
        name: "personal-database-view",
        component: () => import("@/modules/Users/components/PersonalDatabase/View.vue"),
        meta: {
            title: "Просмотр"
        }
    },

    //------------------------------Посетители----------------------------
    {
        path: "/visitors",
        name: "visitors",
        component: () => import("@/modules/Users/pages/Visitors/Index.vue"),
        meta: {
            title: "Посетители"
        }
    },
    {
        path: "/visitors-create",
        name: "visitors-create",
        component: () => import("@/modules/Users/components/Visitors/Create.vue"),
        meta: {
            title: "Добавить"
        }
    },
    {
        path: "/visitors-create-form",
        name: "visitors-create-form",
        component: () => import("@/modules/Users/components/Visitors/AddEdit.vue"),
        meta: {
            title: "Добавить"
        }
    },
    {
        path: "/visitors-edit-form/:id",
        name: "visitors-edit-form-id",
        component: () => import("@/modules/Users/components/Visitors/AddEdit.vue"),
        meta: {
            title: "Редактировать"
        }
    },
    {
        path: "/visitors-view/:id",
        name: "visitors-view-id",
        component: () => import("@/modules/Users/components/Visitors/View.vue"),
        meta: {
            title: "Просмотр"
        }
    }
] as RouteRecordRaw[];
