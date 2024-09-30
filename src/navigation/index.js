export const menuItems = [
  {
    title: "Главная",
    route: "/home",
    icon: "smart-home",
  },
  {
    title: "Документы",
    icon: "document",
    children: [
      {
        title: "Служебные записки",
        icon: "record",
        children: [
          {
            title: "Входящие",
            route: "/inbox",
          },
          {
            title: "Исходящие",
            route: "/outgoing",
          },
          {
            title: "Черновики",
            route: "/drafts",
          },
        ],
      },
      {
        title: "Запросы",
        icon: "record2",
        children: [
          {
            title: "Полученные",
            route: '/received'
          },
          {
            title: "Отправленные",
            route: "/sent"
          },
          {
            title: "Черновики",
            route: '/draft'
          },
        ],
      },
      {
        title: "Накладные",
        icon: "invoice",
        children: [
          {
            title: "Входящие",
            route: '/invoice-inbox'
          },
          {
            title: "Исходящие",
            route: '/invoice-outgoing'
          },
        ],
      },
      {
        title: "Акты",
        icon: "document",
        route: "/acts",
      },
      {
        title: "Контракты",
        icon: "contract",
        route: "/contracts",
      },
      {
        title: "Накладные",
        icon: "invoice",
        route: "/invoices",
      },
    ],
  },
  {
    title: "Мониторинг",
    icon: "monitoring",
    children: [
      {
        title: "Остатка товаров",
        icon: "box",
        route: "/monitoring/remaining-goods",
      },
      {
        title: "Отчет о кухне",
        icon: "kitchen",
        route: "/monitoring/kitchen-report",
      },
    ],
  },
  {
    title: "Базы складов",
    icon: "building-warehouse",
    children: [
      {
        title: "Зарафшан",
        icon: "building-warehouse",
        children: [
          {
            title: "Мясной склад",
            route: "/warehouse/1/1"
          },
          {
            title: "Овощной склад",
            route: "/warehouse/1/2"
          },
          {
            title: "Рисовый склад",
            route: "/warehouse/1/3"
          },
        ],
      },
      {
        title: "Навои",
        icon: "building-warehouse",
        children: [
          {
            title: "Мясной склад",
            route: "/warehouse/2/1"
          },
          {
            title: "Овощной склад",
            route: "/warehouse/2/2"
          },
          {
            title: "Рисовый склад",
            route: "/warehouse/2/3"
          },
        ],
      },
      {
        title: "Учкудук",
        icon: "building-warehouse",
        children: [
          {
            title: "Мясной склад",
            route: "/warehouse/3/1"
          },
          {
            title: "Овощной склад",
            route: "/warehouse/3/2"
          },
          {
            title: "Рисовый склад",
            route: "/warehouse/3/3"
          },
        ],
      },
      {
        title: "Нуробод",
        icon: "building-warehouse",
        children: [
          {
            title: "Мясной склад",
            route: "/warehouse/4/1"
          },
          {
            title: "Овощной склад",
            route: "/warehouse/4/2"
          },
          {
            title: "Рисовый склад",
            route: "/warehouse/4/3"
          },
        ],
      },
      {
        title: "Зафаробод",
        icon: "building-warehouse",
        children: [
          {
            title: "Мясной склад",
            route: "/warehouse/5/1"
          },
          {
            title: "Овощной склад",
            route: "/warehouse/5/2"
          },
          {
            title: "Рисовый склад",
            route: "/warehouse/5/3"
          },
        ],
      },
    ],
  },
  {
    title: "Склад кухни",
    icon: "building-warehouse",
    children: [
      {
        title: "Зарафшан",
        icon: "building-warehouse",
        route: "zarafshon",
      },
      {
        title: "Навои",
        icon: "building-warehouse",
        route: "navoi",
      },
      {
        title: "Учкудук",
        icon: "building-warehouse",
        route: "uchquduq",
      },
      {
        title: "Нуробод",
        icon: "building-warehouse",
        route: "nurobod",
      },
      {
        title: "Зафаробод",
        icon: "building-warehouse",
        route: "zafarobod",
      },
    ],
  },
  {
    title: "Кухня",
    icon: "kitchen",
    children: [
      {
        title: "Меню",
        icon: "building-warehouse",
        children: [
          {
            title: "Зарафшан",
          },
          {
            title: "Навои",
          },
          {
            title: "Учкудук",
          },
          {
            title: "Нуробод",
          },
          {
            title: "Зафаробод",
          },
        ],
      },
      {
        title: "Продажи",
        icon: "building-warehouse",
        children: [
          {
            title: "Зарафшан",
          },
          {
            title: "Навои",
          },
          {
            title: "Учкудук",
          },
          {
            title: "Нуробод",
          },
          {
            title: "Зафаробод",
          },
        ],
      },
    ],
  },
  {
    title: "Настройки",
    icon: "settings",
    children: [
      {
        title: "Справочники",
        icon: "record",
        route: '/reference'
      },
      {
        title: "Связь справочников",
        icon: "derictory",
        route: '/directory'
      },
      {
        title: "Кадры",
        icon: "users",
        route: '/personnel'
      },
    ],
  },
];
