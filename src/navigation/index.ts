import { defineStore } from "pinia";
import { computed, ref } from "vue";
import { useKitchenWarehouseStore } from "@/modules/KitchenWarehouse/kitchen-warehouse.store";
import { useKitchenStore } from "@/modules/Kitchen/kitchen.store";
import { useWarehouseBasesStore } from "@/modules/WarehouseBases/warehouse-bases.store";
import { useI18n } from "vue-i18n";

export const useLayoutStore = defineStore("layoutStore", () => {

  const { t } = useI18n();

  const kitchenWarehouse = useKitchenWarehouseStore();
  const kitchenStore = useKitchenStore();
  const warehouseBasesStore = useWarehouseBasesStore();

  const currentTheme = ref(localStorage.getItem("currentTheme") || "light");

  const menuItems = computed(() => {
    return [
      {
        title: t("navigation.home"),
        route: "/",
        icon: "smart-home",
        permissions: ["admin"],
      },
      {
        title: t("document.title1"),
        icon: "document",
        unique: "document",
        permissions: ["admin"],
        children: [
          {
            title: t("document.memos"),
            icon: "record",
            permissions: ["admin"],
            children: [
              {
                title: t("document.incoming"),
                route: "/inbox",
              },
              {
                title: t("document.outgoing"),
                route: "/outgoing",
              },
              {
                title: t("document.drafts"),
                route: "/drafts",
              },
            ],
          },
          {
            title: t("document.requests"),
            icon: "record2",
            permissions: ["admin"],
            children: [
              {
                title: t("document.received"),
                route: "/received",
              },
              {
                title: t("document.sent"),
                route: "/sent",
              },
              {
                title: t("document.drafts"),
                route: "/draft",
              },
            ],
          },
          {
            title: t("document.overhead2"),
            icon: "invoice",
            permissions: ["admin"],
            children: [
              {
                title: t("document.incoming"),
                route: "/invoice-inbox",
                permissions: ["admin"],
              },
              {
                title: t("document.outgoing"),
                route: "/invoice-outgoing",
                permissions: ["admin"],
              },
            ],
          },
          {
            title: t("document.act.title2"),
            icon: "document",
            route: "/acts",
            permissions: ["admin"],
          },
          {
            title: t("document.contract"),
            icon: "contract",
            route: "/contracts",
            permissions: ["admin"],
          },
        ],
      },
      {
        title: t("monitoring.title"),
        icon: "monitoring",
        unique: "monitoring",
        permissions: ["admin"],
        children: [
          {
            title: t("monitoring.remainingGoods"),
            icon: "box",
            route: "/monitoring/remaining-goods",
          },
          {
            title: t("monitoring.kitchenReport"),
            icon: "kitchen",
            route: "/monitoring/kitchen-report",
          },
        ],
      },
      {
        title: t("warehouseBases.title"),
        icon: "building-warehouse",
        unique: "building-warehouse",
        children: warehouseBasesStore.managementBasesMenu,
        permissions: ["admin"],
      },
      {
        title: t("kitchenWarehouse.title"),
        icon: "building-warehouse",
        unique: "warehouse",
        children: kitchenWarehouse.dynamicState,
        permissions: ["admin"],
      },
      {
        title: t("kitchen.title"),
        icon: "kitchen",
        unique: "kitchen",
        children: kitchenStore.departments,
        permissions: ["admin"],
      },
      {
        title: t("users.title"),
        icon: "users",
        unique: "users",
        permissions: ["admin"],
        children: [
          {
            title: t("users.personalDatabase"),
            icon: "record",
            route: "/personal-database",
            permissions: ["admin"],
          },
          {
            title: t("users.visitors"),
            icon: "derictory",
            route: "/visitors",
            permissions: ["admin"],
          },
        ],
      },
      {
        title: t("settings.directories"),
        icon: "record",
        route: "/reference",
        permissions: ["admin"],
      },
      {
        title: t("common.settings"),
        icon: "settings",
        unique: "settings",
        route: "/profile-settings/profile",
        permissions: ["admin"],
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