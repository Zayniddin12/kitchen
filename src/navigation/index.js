export const menuItems = [
  {
    title: "Главная",
    route: "/home",
    icon: 'smart-home.svg',
  },
  {
    title: "Документы",
    route: "/",
    icon: "document.svg",
    children: [
      {
        title: "Документы",
        route: "/",
        icon: "document.svg",
      },
      {
        title: "Запросы",
        route: "/",
        icon: "document.svg",
      },
      {
        title: "Накладные",
        route: "/",
        icon: "document.svg",
      },
      {
        title: "Акты",
        route: "/",
        icon: "document.svg",
      },
      {
        title: "Контракты",
        route: "/",
        icon: "document.svg",
      },
    ]
  },
  {
    title: "Мониторинг",
    route: "/",
    icon: "monitoring.svg",
  },
  {
    title: "Базы складов",
    route: "/",
    icon: "building-warehouse.svg",
  },
  {
    title: "Склад кухни",
    route: "/",
    icon: "building-warehouse.svg",
  },
  {
    title: "Настройки",
    route: "/",
    icon: "settings.svg",
  },
]