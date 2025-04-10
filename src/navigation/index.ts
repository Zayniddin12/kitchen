import { defineStore } from "pinia";
import { computed, ref } from "vue";
import { useKitchenWarehouseStore } from "@/modules/KitchenWarehouse/kitchen-warehouse.store";
import { useKitchenStore } from "@/modules/Kitchen/kitchen.store";
import { useWarehouseBasesStore } from "@/modules/WarehouseBases/warehouse-bases.store";
import { useI18n } from "vue-i18n";
import { useWorkshopsStore } from "@/modules/WorkShops/workshops.store";

export const useLayoutStore = defineStore("layoutStore", () => {

  const { t } = useI18n();

  const kitchenWarehouse = useKitchenWarehouseStore();
  const kitchenStore = useKitchenStore();
  const warehouseBasesStore = useWarehouseBasesStore();
  const workshopsStore = useWorkshopsStore();

  const currentTheme = ref(localStorage.getItem("currentTheme") || "light");

  const menuItems = computed(() => {
    return [
      {
        title: t("navigation.home"),
        route: "/",
        icon: "smart-home",
        permissions: [
          "admin",
          "super-admin",
          "head-warehouse",
          "accountant-base-warehouse",
        ],
      },
      {
        title: t("monitoring.title"),
        icon: "monitoring",
        unique: "monitoring",
        permissions: [
          "admin",
          "super-admin",
          "director-foundation",
          "deputy-director-foundation",
          "head-management",
          "head-factory",
          "head-warehouse",
          "accountant-base-warehouse",
          "manager-base",
          "merchandiser",
          "freight-forwarder",
        ],
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
          {
            title: t("monitoring.kitchenSalesReport"),
            icon: "kitchen",
            route: "/monitoring/kitchen-sales-report",
          },
        ],
      },
      {
        title: t("document.title1"),
        icon: "document",
        unique: "document",
        permissions: [
          "admin",
          "super-admin",
          "director-foundation",
          "deputy-director-foundation",
          "broker",
          "head-management",
          "head-factory",
          "head-warehouse",
          "accountant-base-warehouse",
          "manager-base",
          "merchandiser",
          "freight-forwarder",
          "head-chef",
          "head-pantry",
          "head-workshop",
          "warehouseman",
        ],
        children: [
          {
            title: t("document.memos"),
            icon: "record",
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
            permissions: ["admin", "warehouseman"],
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
            permissions: ["admin", "head-pantry", "head-workshop", "warehouseman"],
            children: [
              {
                title: t("document.incoming"),
                route: "/invoice-inbox",
                permissions: ["admin", "head-pantry", "head-workshop", "warehouseman"],
              },
              {
                title: t("document.outgoing"),
                route: "/invoice-outgoing",
                permissions: ["admin", "head-pantry", "head-workshop", "warehouseman"],
              },
            ],
          },
          {
            title: t("document.act.title2"),
            icon: "document",
            route: "/acts",
            permissions: ["admin", "director-foundation", "deputy-director-foundation", "warehouseman"],
          },
          {
            title: t("document.contract"),
            icon: "contract",
            route: "/contracts",
            permissions: ["admin", "warehouseman"],
          },
        ],
      },
      {
        title: t("warehouseBases.title"),
        icon: "building-warehouse",
        unique: "building-warehouse",
        children: warehouseBasesStore.managementBasesMenu,
        permissions: [
          "admin",
          "super-admin",
          "director-foundation",
          "deputy-director-foundation",
          "head-management",
          "head-factory",
          "head-warehouse",
          "manager-base",
          "merchandiser",
          "freight-forwarder",
          "accountant-base-warehouse",
          "warehouseman",
        ],
      },
      {
        title: t("Workshops.title"),
        icon: "building-warehouse",
        unique: "building-warehouse",
        children: workshopsStore.managementBasesWorkshopsMenu,
        permissions: [
          "admin",
          "super-admin",
          "director-foundation",
          "deputy-director-foundation",
          "head-management",
          "head-factory",
          "head-warehouse",
          "manager-base",
          "merchandiser",
          "freight-forwarder",
          "accountant-base-warehouse",
          "head-workshop",
        ],
      },
      {
        title: t("Workshops.storageRoom2"),
        icon: "building-warehouse",
        unique: "head-pantry",
        children: workshopsStore.managementBasesWorkshopsMenu,
        permissions: [
          "admin",
          "super-admin",
          "director-foundation",
          "deputy-director-foundation",
          "head-management",
          "head-factory",
          "head-warehouse",
          "manager-base",
          "merchandiser",
          "freight-forwarder",
          "accountant-base-warehouse",
          "head-workshop",
        ],
      },
      {
        title: t("kitchenWarehouse.title"),
        icon: "building-warehouse",
        unique: "warehouse",
        children: kitchenWarehouse.dynamicState,
        permissions: [
          "admin",
          "super-admin",
          "director-foundation",
          "deputy-director-foundation",
          "head-management",
          "head-factory",
          "freight-forwarder",
          "head-chef",
          "head-warehouse",
          "accountant-base-warehouse",
        ],
      },
      {
        title: t("kitchen.title"),
        icon: "kitchen",
        unique: "kitchen",
        children: kitchenStore.departments,
        permissions: [
          "admin",
          "super-admin",
          "director-foundation",
          "deputy-director-foundation",
          "head-management",
          "head-factory",
          "freight-forwarder",
          "head-chef",
          "chef",
          "cashier-llp",
          "cashier-sales",
        ],
      },
      {
        title: t("users.title"),
        icon: "users",
        unique: "users",
        permissions: [
          "admin",
          "super-admin",
          "director-foundation",
          "deputy-director-foundation",
          "hr",
        ],
        children: [
          {
            title: t("users.personalDatabase"),
            icon: "record",
            route: "/personal-database",
          },
          {
            title: t("users.visitors"),
            icon: "derictory",
            route: "/visitors",
          },
        ],
      },
      {
        title: t("settings.directories"),
        icon: "record",
        route: "/reference",
        permissions: [
          "admin",
          "super-admin",
          "director-foundation",
          "deputy-director-foundation",
          "broker",
        ],
      },
      {
        title: t("common.settings"),
        icon: "settings",
        unique: "settings",
        route: "/profile-settings/profile",
        permissions: [
          "admin",
          "super-admin",
          "director-foundation",
          "deputy-director-foundation",
          "broker",
          "head-management",
          "head-factory",
          "head-warehouse",
          "accountant-base-warehouse",
          "manager-base",
          "merchandiser",
          "freight-forwarder",
          "head-chef",
          "chef",
          "cashier-llp",
          "cashier-sales",
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