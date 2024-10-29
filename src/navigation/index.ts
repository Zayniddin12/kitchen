import { defineStore } from "pinia";
import { computed, ref } from "vue";
import { useKitchenWarehouseStore } from "@/modules/KitchenWarehouse/store";
import { useKitchenStore } from "@/modules/Kitchen/store/kitchen.store";

export const useLayoutStore = defineStore("layoutStore", () => {

  const kitchenWarehouse = useKitchenWarehouseStore();
  const kitchenStore = useKitchenStore();

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
        children: [
          {
            title: "Зарафшан",
            icon: "building-warehouse",
            children: [
              {
                title: "Мясной склад",
                route: "/warehouse/1/1",
              },
              {
                title: "Овощной склад",
                route: "/warehouse/1/2",
              },
              {
                title: "Рисовый склад",
                route: "/warehouse/1/3",
              },
            ],
          },
          {
            title: "Навои",
            icon: "building-warehouse",
            children: [
              {
                title: "Мясной склад",
                route: "/warehouse/2/1",
              },
              {
                title: "Овощной склад",
                route: "/warehouse/2/2",
              },
              {
                title: "Рисовый склад",
                route: "/warehouse/2/3",
              },
            ],
          },
          {
            title: "Учкудук",
            icon: "building-warehouse",
            children: [
              {
                title: "Мясной склад",
                route: "/warehouse/3/1",
              },
              {
                title: "Овощной склад",
                route: "/warehouse/3/2",
              },
              {
                title: "Рисовый склад",
                route: "/warehouse/3/3",
              },
            ],
          },
          {
            title: "Нуробод",
            icon: "building-warehouse",
            children: [
              {
                title: "Мясной склад",
                route: "/warehouse/4/1",
              },
              {
                title: "Овощной склад",
                route: "/warehouse/4/2",
              },
              {
                title: "Рисовый склад",
                route: "/warehouse/4/3",
              },
            ],
          },
          {
            title: "Зафаробод",
            icon: "building-warehouse",
            children: [
              {
                title: "Мясной склад",
                route: "/warehouse/5/1",
              },
              {
                title: "Овощной склад",
                route: "/warehouse/5/2",
              },
              {
                title: "Рисовый склад",
                route: "/warehouse/5/3",
              },
            ],
          },
        ],
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
        children: kitchenStore.kitchenMenu,
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
            title: "Логи",
            icon: "users",
            route: "/personnel",
          },
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