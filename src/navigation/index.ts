import { defineStore } from "pinia";
import { computed, ref } from "vue";
import { useKitchenWarehouseStore } from "@/modules/KitchenWarehouse/kitchen-warehouse.store";
import { useKitchenStore } from "@/modules/Kitchen/kitchen.store";
import { useWarehouseBasesStore } from "@/modules/WarehouseBases/warehouse-bases.store";

export const useLayoutStore = defineStore("layoutStore", () => {

  const kitchenWarehouse = useKitchenWarehouseStore();
  const kitchenStore = useKitchenStore();
  const warehouseBasesStore = useWarehouseBasesStore();

  const currentTheme = ref(localStorage.getItem("currentTheme") || "light");

  const menuItems = computed(() => {
    return [
      {
        title: "Главная",
        route: "/",
        icon: "smart-home",
      },
      {
        title: "Документы",
        icon: "document",
        unique: "document",
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
                route: "/received",
              },
              {
                title: "Отправленные",
                route: "/sent",
              },
              {
                title: "Черновики",
                route: "/draft",
              },
            ],
          },
          {
            title: "Накладные",
            icon: "invoice",
            children: [
              {
                title: "Входящие",
                route: "/invoice-inbox",
              },
              {
                title: "Исходящие",
                route: "/invoice-outgoing",
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
        ],
      },
      {
        title: "Мониторинг",
        icon: "monitoring",
        unique: "monitoring",
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
        unique: "building-warehouse",
        children: warehouseBasesStore.managementBasesMenu,
      },
      {
        title: "Склад кухни",
        icon: "building-warehouse",
        unique: "warehouse",
        children: kitchenWarehouse.dynamicState,
      },
      {
        title: "Кухня",
        icon: "kitchen",
        unique: "kitchen",
        children: kitchenStore.departments,
      },
      {
        title: "Кадры",
        icon: "users",
        unique: "users",
        children: [
          {
            title: "База кадров",
            icon: "record",
            route: "/personal-database",
          },
          {
            title: "Посетители",
            icon: "derictory",
            route: "/visitors",
          },
        ],
      },
      {
        title: "Настройки",
        icon: "settings",
        unique: "settings",
        children: [
          {
            title: "Справочники",
            icon: "record",
            route: "/reference",
          },
          {
            title: "Календарь",
            icon: "calendar-2"
          },
          {
            title: "Логи системы",
            icon: "log",
            route: "/personnel",
          },
          {
            title: "Настройки профиля",
            icon: "user",
            route: "/profile-settings/profile"
          }
        ],
      },
    ];
  });

  const changeTheme = (newTheme: string) => {
    currentTheme.value = newTheme;
    localStorage.setItem("currentTheme", currentTheme.value);
  };

  return {
    menuItems,

    changeTheme,
    currentTheme,
  };
});