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
		return [{
			title: t("navigation.home"),
			route: "/",
			icon: "smart-home",
		}, {
			title: t("document.title1"),
			icon: "document",
			unique: "document",
			children: [{
				title: t("document.memos"),
				icon: "record",
				children: [{
					title: t("document.incoming"),
					route: "/inbox",
				}, {
					title: t("document.outgoing"),
					route: "/outgoing",
				}, {
					title: t("document.drafts"),
					route: "/drafts",
				}],
			}, {
				title: t("document.requests"),
				icon: "record2",
				children: [{
					title: t("document.received"),
					route: "/received",
				}, {
					title: t("document.sent"),
					route: "/sent",
				}, {
					title: t("document.drafts"),
					route: "/draft",
				}],
			}, {
				title: t("document.overhead2"),
				icon: "invoice",
				children: [{
					title: t("document.incoming"),
					route: "/invoice-inbox",
				}, {
					title: t("document.outgoing"),
					route: "/invoice-outgoing",
				}],
			}, {
				title: t("document.act.title2"),
				icon: "document",
				route: "/acts",
			}, {
				title: t("document.contract"),
				icon: "contract",
				route: "/contracts",
			}],
		}, {
			title: t("monitoring.title"),
			icon: "monitoring",
			unique: "monitoring",
			children: [{
				title: t("monitoring.remainingGoods"),
				icon: "box",
				route: "/monitoring/remaining-goods",
			}, {
				title: t("monitoring.kitchenReport"),
				icon: "kitchen",
				route: "/monitoring/kitchen-report",
			}],
		}, {
			title: t("warehouseBases.title"),
			icon: "building-warehouse",
			unique: "building-warehouse",
			children: warehouseBasesStore.managementBasesMenu,
		}, {
			title: t("kitchenWarehouse.title"),
			icon: "building-warehouse",
			unique: "warehouse",
			children: kitchenWarehouse.dynamicState,
		}, {
			title: t("kitchen.title"),
			icon: "kitchen",
			unique: "kitchen",
			children: kitchenStore.departments,
		}, {
			title: t("users.title"),
			icon: "users",
			unique: "users",
			children: [{
				title: t("users.personalDatabase"),
				icon: "record",
				route: "/personal-database",
			}, {
				title: t("users.visitors"),
				icon: "derictory",
				route: "/visitors",
			}],
		},
			{
				title: t("settings.directories"),
				icon: "record",
				route: "/reference",
			},
			{
			title: t("common.settings"),
			icon: "settings",
			unique: "settings",
			route: "/profile-settings/profile",
		}];
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