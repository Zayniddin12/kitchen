export default [
  // База кадров
  {
    path: "/personal-database",
    name: "personal-database",
    component: () => import("@/modules/Users/pages/PersonnelDatabase/Index.vue"),
    meta: {
      title: 'База кадров',
      layout: "MainLayout",
      breadcrumb: [
        {
          label: "Кадры",
          isActionable: false,
        },
        {
          label: "База кадров",
          isActionable: true,
        },
      ],

    },
  },
  {
    path: "/personal-database-create",
    name: "personal-database-create",
    component: () => import("@/modules/Users/components/PersonalDatabase/Create.vue"),
    meta: {
      title: 'База кадров',
      layout: "MainLayout",
      breadcrumb: [
        {
          label: "Кадры",
          isActionable: false,
        },
        {
          label: "База кадров",
          isActionable: false,
          to: 'personal-database'
        },
        {
          label: "Добавить",
          isActionable: true,
        },
      ],

    },
  },
  {
    path: "/personal-database-create-form",
    name: "personal-database-create-form",
    component: () => import("@/modules/Users/components/PersonalDatabase/AddEdit.vue"),
    meta: {
      title: 'База кадров',
      layout: "MainLayout",
      breadcrumb: [
        {
          label: "Кадры",
          isActionable: false,
        },
        {
          label: "База кадров",
          isActionable: false,
          to: 'personal-database'
        },
        {
          label: "Добавить",
          isActionable: true,
        },
      ],

    },
  },
  {
    path: "/personal-database-edit-form/:id",
    name: "personal-database-edit-form-id",
    component: () => import("@/modules/Users/components/PersonalDatabase/AddEdit.vue"),
    meta: {
      title: 'Редактировать',
      layout: "MainLayout",
      breadcrumb: [
        {
          label: "Кадры",
          isActionable: false,
        },
        {
          label: "База кадров",
          isActionable: false,
          to: 'personal-database'
        },
        {
          label: "Редактировать",
          isActionable: true,
        },
      ],

    },
  },
  {
    path: "/personal-database-view/:id",
    name: "personal-database-view",
    component: () => import("@/modules/Users/components/PersonalDatabase/View.vue"),
    meta: {
      title: 'Просмотр',
      layout: "MainLayout",
      breadcrumb: [
        {
          label: "Кадры",
          isActionable: false,
        },
        {
          label: "База кадров",
          isActionable: false,
          to: 'personal-database'
        },
        {
          label: "Просмотр",
          isActionable: true,
        },
      ],

    },
  },


  // Посетители
  {
    path: "/visitors",
    name: "visitors",
    component: () => import("@/modules/Users/pages/Visitors/Index.vue"),
    meta: {
      title: 'Посетители',
      layout: "MainLayout",
      breadcrumb: [
        {
          label: "Кадры",
          isActionable: false,
        },
        {
          label: "Посетители",
          isActionable: true,
        },
      ],

    },
  },
];
