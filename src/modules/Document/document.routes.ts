import { RouteRecordRaw } from "vue-router";

export default [
    // -------------------------Служебные записки-------------------------------
    // Входящие
    {
        path: "/inbox",
        name: "inbox",
        component: () => import("@/modules/Document/pages/OfficeNotes/Drafts/Index.vue"),
        meta: {
            title: "Входящие",
            apiUrl: "received",
            uniqueKeys: {
                documents: true,
                documentInbox: true
            }
        }
    },
    {
        path: "/inbox/:id",
        name: "inbox-id",
        component: () => import("@/modules/Document/pages/OfficeNotes/Inbox/View.vue"),
        meta: {
            title: "Просмотр"
        }
    },

    // Исходящие
    {
        path: "/outgoing",
        name: "outgoing",
        component: () => import("@/modules/Document/pages/OfficeNotes/Drafts/Index.vue"),
        meta: {
            title: "Исходящие",
            apiUrl: "sent"
        }
    },
    {
        path: "/outgoing/:id",
        name: "outgoing-id",
        component: () => import("@/modules/Document/pages/OfficeNotes/Outgoing/View.vue"),
        meta: {
            title: "Просмотр"
        }
    },

    // Черновики
    {
        path: "/drafts",
        name: "drafts",
        component: () => import("@/modules/Document/pages/OfficeNotes/Drafts/Index.vue"),
        meta: {
            title: "Черновики",
            apiUrl: "drafts"
        }
    },
    // -------------------------Служебные записки-------------------------------


    // -------------------------Запросы-------------------------------
    // Полученные
    {
        path: "/received",
        name: "received",
        component: () => import("@/modules/Document/pages/Requests/Received/Index.vue"),
        meta: {
            title: "Полученные"
        }
    },
    {
        path: "/received/:id",
        name: "received-id",
        component: () => import("@/modules/Document/pages/Requests/Received/View.vue"),
        meta: {
            title: "Просмотр"
        }
    },

    // Отправленные
    {
        path: "/sent",
        name: "sent",
        component: () => import("@/modules/Document/pages/Requests/Sent/Index.vue"),
        meta: {
            title: "Отправленные"
        }
    },
    {
        path: "/sent/:id",
        name: "sent-id",
        component: () => import("@/modules/Document/pages/Requests/Sent/View.vue"),
        meta: {
            title: "Просмотр"
        }
    },

    // Черновики
    {
        path: "/draft",
        name: "draft",
        component: () => import("@/modules/Document/pages/Requests/Drafts/Index.vue"),
        meta: {
            title: "Черновики"
        }
    },


    // Накладные
    // Входящие
    {
        path: "/invoice-inbox",
        name: "invoice-inbox",
        component: () => import("@/modules/Document/pages/Invoices/InvoiceInbox/Index.vue"),
        meta: {
            title: "Входящие"
        }
    },
    {
        path: "/invoice-inbox/:id",
        name: "invoice-inbox-id",
        component: () => import("@/modules/Document/pages/Invoices/InvoiceInbox/View.vue"),
        meta: {
            title: "Просмотр"
        }
    },

    // Исходящие
    {
        path: "/invoice-outgoing",
        name: "invoice-outgoing",
        component: () => import("@/modules/Document/pages/Invoices/InvoiceOutgoing/Index.vue"),
        meta: {
            title: "Исходящие",
        }
    },
    {
        path: "/invoice-outgoing/:id",
        name: "invoice-outgoing-id",
        component: () => import("@/modules/Document/pages/Invoices/InvoiceOutgoing/View.vue"),
        meta: {
            title: "Исходящие"
        }
    },
    // -------------------------Запросы-------------------------------

    //acts
    {
        path: "/acts",
        name: "acts",
        component: () => import("@/modules/Document/pages/Acts/Index.vue"),
        meta: {
            title: "Акты"
        }
    },
    {
        path: "/acts/:id",
        name: "acts-id",
        component: () => import("@/modules/Document/pages/Acts/View.vue"),
        meta: {
            title: "Просмотр"
        }
    },

    // Contracts
    {
        path: "/contracts",
        name: "contracts",
        component: () => import("@/modules/Document/pages/Contracts/Index.vue"),
        meta: {
            title: "Контракты"
        }
    },
    {
        path: "/contracts-create",
        name: "contracts-create",
        component: () => import("@/modules/Document/pages/Contracts/Create.vue"),
        meta: {
            title: "Добавить"
        }
    },
    {
        path: "/contracts-view/:id",
        name: "contracts-view-view",
        component: () => import("@/modules/Document/pages/Contracts/View.vue"),
        meta: {
            title: "Просмотр"
        }
    }
] as RouteRecordRaw[];
