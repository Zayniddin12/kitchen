import { RouteRecordRaw } from "vue-router";

export default [
  // -------------------------Служебные записки-------------------------------
  // Входящие
  {
    path: "/inbox",
    name: "inbox",
    component: () => import("@/modules/Document/pages/OfficeNotes/Index.vue"),
    meta: {
      title: "document.incoming",
      isTranslate: true,
      parentRouteTitle: "document.memos",
      parentRouteIsTranslate: true,
      apiUrl: "received",
      doc_type: "memo",
      permissionView: true,
      uniqueKeys: {
        documents: true,
        documentInbox: true,
      },
      breadcrumbItemTitle: "document.incoming",
      breadcrumbItemIsTranslate: true,
    },
  },
  {
    path: "/inbox/:id",
    name: "inbox-id",
    component: () => import("@/modules/Document/pages/OfficeNotes/View.vue"),
    meta: {
      title: "document.memo.title",
      isTranslate: true,
      parentRouteTitle: "document.incoming",
      parentRouteIsTranslate: true,
      documentTitle: "document.memos",
      documentTitleIsTranslate: true,
      parentRouteUrl: { name: "inbox" },
    },
  },

  // Исходящие
  {
    path: "/outgoing",
    name: "outgoing",
    component: () => import("@/modules/Document/pages/OfficeNotes/Index.vue"),
    meta: {
      title: "document.outgoing",
      isTranslate: true,
      parentRouteTitle: "document.memos",
      parentRouteIsTranslate: true,
      apiUrl: "sent",
      doc_type: "memo",
      permissionView: true,
      breadcrumbItemTitle: "document.outgoing",
      breadcrumbItemIsTranslate: true,
    },
  },
  {
    path: "/outgoing/:id",
    name: "outgoing-id",
    component: () => import("@/modules/Document/pages/OfficeNotes/View.vue"),
    meta: {
      title: "document.memo.title",
      isTranslate: true,
      parentRouteTitle: "document.outgoing",
      parentRouteIsTranslate: true,
      parentRouteUrl: { name: "outgoing" },
      documentTitle: "document.memos",
      documentTitleIsTranslate: true,
    },
  },

  // Черновики
  {
    path: "/drafts",
    name: "drafts",
    component: () => import("@/modules/Document/pages/OfficeNotes/Index.vue"),
    meta: {
      title: "document.drafts",
      isTranslate: true,
      parentRouteTitle: "document.memos",
      parentRouteIsTranslate: true,
      doc_type: "memo",
      doc_type_id: 1,
      permissionEdit: true,
      apiUrl: "drafts",
      breadcrumbItemTitle: "document.drafts",
      breadcrumbItemIsTranslate: true,
    },
  },
  // -------------------------Служебные записки-------------------------------


  // -------------------------Запросы-------------------------------
  // Полученные
  {
    path: "/received",
    name: "received",
    component: () => import("@/modules/Document/pages/OfficeNotes/Index.vue"),
    meta: {
      title: "document.received",
      isTranslate: true,
      breadcrumbItemTitle: "document.received",
      breadcrumbItemIsTranslate: true,
      parentRouteTitle: "document.requests",
      parentRouteIsTranslate: true,
      permissionView: true,
      apiUrl: "received",
      hasTabs: true,
    },
  },
  {
    path: "/received/:id",
    name: "received-id",
    component: () => import("@/modules/Document/pages/OfficeNotes/View.vue"),
    meta: {
      title: "document.freeRequest.title",
      isTranslate: true,
      parentRouteTitle: "document.received",
      parentRouteIsTranslate: true,
      documentTitle: "document.requests",
      documentTitleIsTranslate: true,
      parentRouteUrl: { name: "received" },
      hasRejectBtn: true,
      hasAcceptBtn: true,
    },
  },

  // Отправленные
  {
    path: "/sent",
    name: "sent",
    component: () => import("@/modules/Document/pages/OfficeNotes/Index.vue"),
    meta: {
      title: "document.sent",
      isTranslate: true,
      parentRouteTitle: "document.requests",
      parentRouteIsTranslate: true,
      breadcrumbItemTitle: "document.sent",
      breadcrumbItemIsTranslate: true,
      permissionView: true,
      apiUrl: "sent",
      hasTabs: true,
    },
  },
  {
    path: "/sent/:id",
    name: "sent-id",
    component: () => import("@/modules/Document/pages/OfficeNotes/View.vue"),
    meta: {
      title: "document.freeRequest.title",
      isTranslate: true,
      parentRouteTitle: "document.sent",
      parentRouteIsTranslate: true,
      documentTitle: "document.requests",
      documentTitleIsTranslate: true,
      parentRouteUrl: { name: "sent" },
      hasCancelBtn: true,
    },
  },

  // Черновики
  {
    path: "/draft",
    name: "draft",
    component: () => import("@/modules/Document/pages/OfficeNotes/Index.vue"),
    meta: {
      title: "document.drafts",
      isTranslate: true,
      parentRouteTitle: "document.requests",
      parentRouteIsTranslate: true,
      doc_type_id: 2,
      permissionEdit: true,
      apiUrl: "drafts",
      breadcrumbItemTitle: "document.drafts",
      breadcrumbItemIsTranslate: true,
    },
  },


  // Накладные
  // Входящие
  {
    path: "/invoice-inbox",
    name: "invoice-inbox",
    component: () => import("@/modules/Document/pages/Invoices/InvoicesIndex.vue"),
    meta: {
      title: "document.incoming",
      isTranslate: true,
      breadcrumbItemTitle: "document.incoming",
      breadcrumbItemIsTranslate: true,
      apiUrl: "received",
    },
  },
  {
    path: "/invoice-inbox/:id",
    name: "invoice-inbox-id",
    component: () => import("@/modules/Document/pages/Invoices/InvoicesShow.vue"),
    meta: {
      parentRouteTitle: "document.incoming",
      parentRouteIsTranslate: true,
      parentRouteUrl: { name: "invoice-inbox" },
      title: "common.view",
      isTranslate: true,
      documentTitle: "document.memos",
      documentTitleIsTranslate: true,
      hasRejectBtn: true,
      hasAcceptBtn: true,
    },
  },

  // Исходящие
  {
    path: "/invoice-outgoing",
    name: "invoice-outgoing",
    component: () => import("@/modules/Document/pages/Invoices/InvoicesIndex.vue"),
    meta: {
      title: "document.outgoing",
      isTranslate: true,
      breadcrumbItemTitle: "document.outgoing",
      breadcrumbItemIsTranslate: true,
      apiUrl: "sent",
    },
  },
  {
    path: "/invoice-outgoing/:id",
    name: "invoice-outgoing-id",
    component: () => import("@/modules/Document/pages/Invoices/InvoicesShow.vue"),
    meta: {
      parentRouteTitle: "document.outgoing",
      parentRouteIsTranslate: true,
      parentRouteUrl: { name: "invoice-outgoing" },
      title: "common.view",
      isTranslate: true,
    },
  },
  // -------------------------Запросы-------------------------------

  //acts
  {
    path: "/acts",
    name: "acts",
    component: () => import("@/modules/Document/pages/Acts/Index.vue"),
    meta: {
      title: "document.act.title2",
      isTranslate: true,
    },
  },
  {
    path: "/acts/:id",
    name: "acts-id",
    component: () => import("@/modules/Document/pages/Acts/View.vue"),
    meta: {
      title: "common.view",
      isTranslate: true,
    },
  },

  // Contracts
  {
    path: "/contracts",
    name: "contracts",
    component: () => import("@/modules/Document/pages/Contracts/Index.vue"),
    meta: {
      title: "document.contract",
      isTranslate: true,
    },
  },
  {
    path: "/contracts-create",
    name: "contracts-create",
    component: () => import("@/modules/Document/pages/Contracts/Create.vue"),
    meta: {
      title: "method.add",
      isTranslate: true,
    },
  },
  {
    path: "/contracts-view/:id",
    name: "contracts-view-view",
    component: () => import("@/modules/Document/pages/Contracts/View.vue"),
    meta: {
      title: "common.view",
      isTranslate: true,
    },
  },
] as RouteRecordRaw[];
