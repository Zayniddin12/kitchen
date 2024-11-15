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
            doc_type: "memo",
            permissionView: true,
            uniqueKeys: {
                documents: true,
                documentInbox: true
            },
            breadcrumbItemTitle: "Входящие"
        }
    },
    {
        path: "/inbox/:id",
        name: "inbox-id",
        component: () => import("@/modules/Document/pages/OfficeNotes/Inbox/View.vue"),
        meta: {
            title: "Просмотр",
            parentRouteTitle: "Входящие",
            parentRouteUrl: { name: "inbox" }
        }
    },

    // Исходящие
    {
        path: "/outgoing",
        name: "outgoing",
        component: () => import("@/modules/Document/pages/OfficeNotes/Drafts/Index.vue"),
        meta: {
            title: "Исходящие",
            apiUrl: "sent",
            doc_type: "memo",
            permissionView: true,
            breadcrumbItemTitle: "Исходящие"
        }
    },
    {
        path: "/outgoing/:id",
        name: "outgoing-id",
        component: () => import("@/modules/Document/pages/OfficeNotes/Inbox/View.vue"),
        meta: {
            title: "Исходящие",
            parentRouteTitle: "Исходящие",
            parentRouteUrl: { name: "outgoing" }
        }
    },

    // Черновики
    {
        path: "/drafts",
        name: "drafts",
        component: () => import("@/modules/Document/pages/OfficeNotes/Drafts/Index.vue"),
        meta: {
            title: "Черновики",
            doc_type: "memo",
            doc_type_id: 1,
            permissionEdit: true,
            apiUrl: "drafts",
            breadcrumbItemTitle: "Черновики"
        }
    },
    // -------------------------Служебные записки-------------------------------


    // -------------------------Запросы-------------------------------
    // Полученные
    {
        path: "/received",
        name: "received",
        component: () => import("@/modules/Document/pages/OfficeNotes/Drafts/Index.vue"),
        meta: {
            title: "Полученные",
            breadcrumbItemTitle: "Полученные",
            permissionView: true,
            apiUrl: "received",
            hasTabs: true,
        }
    },
    {
        path: "/received/:id",
        name: "received-id",
        component: () => import("@/modules/Document/pages/OfficeNotes/Inbox/View.vue"),
        // component: () => import("@/modules/Document/pages/Requests/Received/View.vue"),
        meta: {
            title: "Просмотр",
            parentRouteTitle: "Полученные",
            parentRouteUrl: { name: "received" },
            hasRejectBtn: true,
            hasAcceptBtn: true,
        }
    },

    // Отправленные
    {
        path: "/sent",
        name: "sent",
        component: () => import("@/modules/Document/pages/OfficeNotes/Drafts/Index.vue"),
        meta: {
            title: "Отправленные",
            breadcrumbItemTitle: "Отправленные",
            permissionView: true,
            apiUrl: "sent",
            hasTabs: true,
        }
    },
    {
        path: "/sent/:id",
        name: "sent-id",
        component: () => import("@/modules/Document/pages/OfficeNotes/Inbox/View.vue"),
        // component: () => import("@/modules/Document/pages/Requests/Sent/View.vue"),
        meta: {
            title: "Просмотр",
            parentRouteTitle: "Отправленные",
            parentRouteUrl: { name: "sent" },
            hasCancelBtn: true,
        }
    },

    // Черновики
    {
        path: "/draft",
        name: "draft",
        component: () => import("@/modules/Document/pages/OfficeNotes/Drafts/Index.vue"),
        meta: {
            title: "Черновики",
            doc_type_id: 2,
            permissionEdit: true,
            apiUrl: "drafts",
            breadcrumbItemTitle: "Черновики"
        }
    },


    // Накладные
    // Входящие
    {
        path: "/invoice-inbox",
        name: "invoice-inbox",
        // component: () => import("@/modules/Document/pages/Invoices/InvoiceInbox/Index.vue"),
        component: () => import("@/modules/Document/pages/Invoices/InvoicesIndex.vue"),
        meta: {
            title: "Входящие",
            breadcrumbItemTitle: "Входящие",
            apiUrl: "received"
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
        // component: () => import("@/modules/Document/pages/Invoices/InvoiceOutgoing/Index.vue"),
        component: () => import("@/modules/Document/pages/Invoices/InvoicesIndex.vue"),
        meta: {
            title: "Исходящие",
            breadcrumbItemTitle: "Исходящие",
            apiUrl: "sent"
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
