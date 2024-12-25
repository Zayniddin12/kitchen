import { RouteRecordRaw } from "vue-router";
import ProfileSettingsRoutes from "@/modules/Settings/pages/ProfileSettings/profile-settings.routes";
import PositionRoutes from "@/modules/Settings/components/Reference/Position/position.routes";
import RoleRoutes from "@/modules/Settings/components/Reference/Role/role.routes";

export default [...ProfileSettingsRoutes, ...PositionRoutes, ...RoleRoutes, // sidebar start
	{
		path: "/reference",
		name: "reference",
		component: () => import("@/modules/Settings/pages/Reference/index.vue"),
		meta: {
			title: "settings.directories",
			isTranslate: true,
		},
	}, {
		path: "/personnel",
		name: "personnel",
		component: () => import("@/modules/Settings/pages/Personnel/index.vue"),
		meta: {
			title: "settings.log",
			isTranslate: true,
		},
	}, // sidebar end

	// Документы start
	{
		path: "/reference-type-document",
		name: "reference-type-document",
		component: () => import("@/modules/Settings/components/Reference/Document/TypeProduct/TypeDocument.vue"),
		meta: {
			title: "document.typeDoc",
			isTranslate: true,
		},
	}, {
		path: "/reference-vid-document",
		name: "reference-vid-document",
		component: () => import("@/modules/Settings/components/Reference/Document/VidDocument/VidDocument.vue"),
		meta: {
			title: "document.type2",
			isTranslate: true,
		},
	}, // Документы end

	{
		path: "/reference-regional-directorates",
		name: "reference-regional-directorates",
		component: () => import("@/modules/Settings/components/Reference/RegionalDirectorates/RegionalDirectorates.vue"),
		meta: {
			title: "regionalDirectorates.title",
			isTranslate: true,
		},
	},

	{
		path: "/reference-regional-directorates-add",
		name: "reference-regional-directorates-add",
		component: () => import("@/modules/Settings/components/Reference/RegionalDirectorates/RegionalDirectoratesAddEditModal.vue"),
		meta: {
			title: "regionalDirectorates.create",
			isTranslate: true,
		},
	},

	{
		path: "/reference-regional-directorates-detail/:id(\\d+)",
		name: "reference-regional-directorates-edit",
		component: () => import("@/modules/Settings/components/Reference/RegionalDirectorates/RegionalDirectoratesAddEditModal.vue"),
		meta: {
			title: "regionalDirectorates.edit",
			isTranslate: true,
		},
	},

	{
		path: "/reference-regional-directorates-view/:id(\\d+)",
		name: "reference-regional-directorates-view",
		component: () => import("@/modules/Settings/components/Reference/RegionalDirectorates/RegionalDirectoratesShow.vue"),
		meta: {
			title: "regionalDirectorates.show",
			isTranslate: true,
		},
	},

	// Combine

	{
		path: "/reference-combine-nutrition",
		name: "reference-combine-nutrition",
		component: () => import("@/modules/Settings/components/Reference/CombineNutrition/CombineNutritions.vue"),
		meta: {
			title: "combineNutrition.title",
			isTranslate: true,
		},
	},

	{
		path: "/reference-combine-nutrition-add",
		name: "reference-combine-nutrition-add",
		component: () => import("@/modules/Settings/components/Reference/CombineNutrition/CombineNutritionAddEditModal.vue"),
		meta: {
			title: "combineNutrition.create",
			isTranslate: true,
			breadcrumbItemTitle: "method.add",
			breadcrumbItemIsTranslate: true,
		},
	},

	{
		path: "/reference-combine-nutrition-detail/:id(\\d+)",
		name: "reference-combine-nutrition-edit",
		component: () => import("@/modules/Settings/components/Reference/CombineNutrition/CombineNutritionAddEditModal.vue"),
		meta: {
			title: "combineNutrition.edit",
			isTranslate: true,
			breadcrumbItemTitle: "method.edit",
			breadcrumbItemIsTranslate: true,
		},
	},

	{
		path: "/reference-combine-nutrition-view/:id(\\d+)",
		name: "reference-combine-nutrition-view",
		component: () => import("@/modules/Settings/components/Reference/CombineNutrition/CombineNutritionShow.vue"),
		meta: {
			title: "combineNutrition.show",
			isTranslate: true,
			breadcrumbItemTitle: "common.view",
			breadcrumbItemIsTranslate: true,
		},
	},

	// Warehouse bases

	{
		path: "/reference-warehouse-bases",
		name: "reference-warehouse-bases",
		component: () => import("@/modules/Settings/components/Reference/WarehouseBases/WarehouseBases.vue"),
		meta: {
			title: "warehouseBases.title",
			isTranslate: true,
		},
	},

	{
		path: "/reference-warehouse-bases-add",
		name: "reference-warehouse-bases-add",
		component: () => import("@/modules/Settings/components/Reference/WarehouseBases/WarehouseBasesAddEditView.vue"),
		meta: {
			title: "warehouseBases.create",
			isTranslate: true,
			breadcrumbItemTitle: "method.add",
			breadcrumbItemIsTranslate: true,
		},
	},

	{
		path: "/reference-warehouse-bases-detail/:id(\\d+)",
		name: "reference-warehouse-bases-edit",
		component: () => import("@/modules/Settings/components/Reference/WarehouseBases/WarehouseBasesAddEditView.vue"),
		meta: {
			title: "warehouseBases.edit",
			isTranslate: true,
			breadcrumbItemTitle: "method.edit",
			breadcrumbItemIsTranslate: true,
		},
	},

	{
		path: "/reference-warehouse-bases-view/:id(\\d+)",
		name: "reference-warehouse-bases-view",
		component: () => import("@/modules/Settings/components/Reference/WarehouseBases/WarehouseBasesShow.vue"),
		meta: {
			title: "warehouseBases.show",
			isTranslate: true,
			breadcrumbItemTitle: "common.view",
			breadcrumbItemIsTranslate: true,
		},
	},

	// Main Bases

	{
		path: "/reference-main-bases",
		name: "reference-main-bases",
		component: () => import("@/modules/Settings/components/Reference/MainBases/MainBases.vue"),
		meta: {
			title: "baseWarehouses.title",
			isTranslate: true,
		},
	},

	{
		path: "/reference-main-bases-add",
		name: "reference-main-bases-add",
		component: () => import("@/modules/Settings/components/Reference/MainBases/MainBasesAddEditView.vue"),
		meta: {
			title: "baseWarehouses.create",
			isTranslate: true,
			breadcrumbItemTitle: "method.add",
			breadcrumbItemIsTranslate: true,
		},
	},

	{
		path: "/reference-main-bases-detail/:id(\\d+)",
		name: "reference-main-bases-edit",
		component: () => import("@/modules/Settings/components/Reference/MainBases/MainBasesAddEditView.vue"),
		meta: {
			title: "baseWarehouses.edit",
			isTranslate: true,
			breadcrumbItemTitle: "method.edit",
			breadcrumbItemIsTranslate: true,
		},
	},

	{
		path: "/reference-main-bases-view/:id(\\d+)",
		name: "reference-main-bases-view",
		component: () => import("@/modules/Settings/components/Reference/MainBases/MainBasesShow.vue"),
		meta: {
			title: "baseWarehouses.show",
			isTranslate: true,
			breadcrumbItemTitle: "common.view",
			breadcrumbItemIsTranslate: true,
		},
	}, // Kitchen Warehouse

	{
		path: "/reference-kitchen-warehouse",
		name: "reference-kitchen-warehouse",
		component: () => import("@/modules/Settings/components/Reference/KitchenWarehouse/KitchenWarehouses.vue"),
		meta: {
			title: "kitchenWarehouses.title",
			isTranslate: true,
		},
	},

	{
		path: "/reference-kitchen-warehouse-add",
		name: "reference-kitchen-warehouse-add",
		component: () => import("@/modules/Settings/components/Reference/KitchenWarehouse/KitchenWarehousesAddEditView.vue"),
		meta: {
			title: "kitchenWarehouses.create",
			isTranslate: true,
			breadcrumbItemTitle: "method.add",
			breadcrumbItemIsTranslate: true,
		},
	},

	{
		path: "/reference-kitchen-warehouse-detail/:id(\\d+)",
		name: "reference-kitchen-warehouse-edit",
		component: () => import("@/modules/Settings/components/Reference/KitchenWarehouse/KitchenWarehousesAddEditView.vue"),
		meta: {
			title: "kitchenWarehouses.edit",
			isTranslate: true,
			breadcrumbItemTitle: "method.edit",
			breadcrumbItemIsTranslate: true,
		},
	},

	{
		path: "/reference-kitchen-warehouse-view/:id(\\d+)",
		name: "reference-kitchen-warehouse-view",
		component: () => import("@/modules/Settings/components/Reference/KitchenWarehouse/KitchenWarehouseShow.vue"),
		meta: {
			title: "kitchenWarehouses.show",
			isTranslate: true,
			breadcrumbItemTitle: "common.view",
			breadcrumbItemIsTranslate: true,
		},
	},

	// Kitchen Type

	{
		path: "/reference-kitchen-type",
		name: "reference-kitchen-type",
		component: () => import("@/modules/Settings/components/Reference/KitchenType/KitchenType.vue"),
		meta: {
			title: "kitchenType.title",
			isTranslate: true,
		},
	},

	{
		path: "/reference-kitchen-type-add",
		name: "reference-kitchen-type-add",
		component: () => import("@/modules/Settings/components/Reference/KitchenType/KitchenTypeAddEditModal.vue"),
		meta: {
			title: "kitchenType.create",
			isTranslate: true,
			breadcrumbItemTitle: "method.add",
			breadcrumbItemIsTranslate: true,
		},
	},

	{
		path: "/reference-kitchen-type-detail/:id(\\d+)",
		name: "reference-kitchen-type-edit",
		component: () => import("@/modules/Settings/components/Reference/KitchenType/KitchenTypeAddEditModal.vue"),
		meta: {
			title: "kitchenType.edit",
			isTranslate: true,
			breadcrumbItemTitle: "method.edit",
			breadcrumbItemIsTranslate: true,
		},
	},

	{
		path: "/reference-kitchen-type-view/:id(\\d+)",
		name: "reference-kitchen-type-view",
		component: () => import("@/modules/Settings/components/Reference/KitchenType/KitchenTypeShow.vue"),
		meta: {
			title: "kitchenType.show",
			isTranslate: true,
			breadcrumbItemTitle: "common.view",
			breadcrumbItemIsTranslate: true,
		},
	},

	//Suppliers

	{
		path: "/reference-suppliers",
		name: "reference-suppliers",
		component: () => import("@/modules/Settings/components/Reference/Suppliers/Suppliers.vue"),
		meta: {
			title: "suppliers.title",
			isTranslate: true,
		},
	},

	{
		path: "/reference-suppliers-add",
		name: "reference-suppliers-add",
		component: () => import("@/modules/Settings/components/Reference/Suppliers/SuppliersAddEditView.vue"),
		meta: {
			title: "suppliers.create",
			isTranslate: true,
			breadcrumbItemTitle: "method.add",
			breadcrumbItemIsTranslate: true,
		},
	},

	{
		path: "/reference-suppliers-detail/:id(\\d+)",
		name: "reference-suppliers-edit",
		component: () => import("@/modules/Settings/components/Reference/Suppliers/SuppliersAddEditView.vue"),
		meta: {
			title: "suppliers.edit",
			isTranslate: true,
			breadcrumbItemTitle: "method.edit",
			breadcrumbItemIsTranslate: true,
		},
	},

	{
		path: "/reference-suppliers-view/:id(\\d+)",
		name: "reference-suppliers-view",
		component: () => import("@/modules/Settings/components/Reference/Suppliers/SuppliersShow.vue"),
		meta: {
			title: "suppliers.show",
			isTranslate: true,
			breadcrumbItemTitle: "common.view",
			breadcrumbItemIsTranslate: true,
		},
	},

	//Organizations

	{
		path: "/reference-organization",
		name: "reference-organization",
		component: () => import("@/modules/Settings/components/Reference/Organizations/Organizations.vue"),
		meta: {
			title: "organization.title",
			isTranslate: true,
		},
	},

	{
		path: "/reference-organization-add",
		name: "reference-organization-add",
		component: () => import("@/modules/Settings/components/Reference/Organizations/OrganizationsAddEditView.vue"),
		meta: {
			title: "organization.create",
			isTranslate: true,
			breadcrumbItemTitle: "method.add",
			breadcrumbItemIsTranslate: true,
		},
	},

	{
		path: "/reference-organization-detail/:id(\\d+)",
		name: "reference-organization-edit",
		component: () => import("@/modules/Settings/components/Reference/Organizations/OrganizationsAddEditView.vue"),
		meta: {
			title: "organization.edit",
			isTranslate: true,
			breadcrumbItemTitle: "method.edit",
			breadcrumbItemIsTranslate: true,
		},
	},

	{
		path: "/reference-organization-view/:id(\\d+)",
		name: "reference-organization-view",
		component: () => import("@/modules/Settings/components/Reference/Organizations/OrganizationShow.vue"),
		meta: {
			title: "organization.show",
			isTranslate: true,
			breadcrumbItemTitle: "common.view",
			breadcrumbItemIsTranslate: true,
		},
	},

	// Продукты start
	// Типы документов
	{
		path: "/reference-type-product",
		name: "reference-type-product",
		component: () => import("@/modules/Settings/components/Reference/Product/TypeProduct/TypeProduct.vue"),
		meta: {
			title: "typeProduct.title",
			isTranslate: true,
		},
	}, {
		path: "/reference-type-product-create",
		name: "reference-type-product-create",
		component: () => import("@/modules/Settings/components/Reference/Product/TypeProduct/AddEditTypeDoc.vue"),
		meta: {
			title: "typeProduct.create",
			isTranslate: true,
			breadcrumbItemTitle: "method.add",
			breadcrumbItemIsTranslate: true,
		},
	}, {
		path: "/reference-type-product-edit/:id(\\d+)",
		name: "reference-type-product-edit-id",
		component: () => import("@/modules/Settings/components/Reference/Product/TypeProduct/AddEditTypeDoc.vue"),
		meta: {
			title: "typeProduct.edit",
			isTranslate: true,
			breadcrumbItemTitle: "method.edit",
			breadcrumbItemIsTranslate: true,
		},
	}, {
		path: "/reference-type-product-view/:id(\\d+)",
		name: "reference-type-product-view-id",
		component: () => import("@/modules/Settings/components/Reference/Product/TypeProduct/TypeProductShow.vue"),
		meta: {
			title: "typeProduct.show",
			isTranslate: true,
			breadcrumbItemTitle: "common.view",
			breadcrumbItemIsTranslate: true,
		},
	},

	// Виды документов
	{
		path: "/reference-vid-product",
		name: "reference-vid-product",
		component: () => import("@/modules/Settings/components/Reference/Product/VidProduct/ProductVidDocument.vue"),
		meta: {
			title: "vidProduct.title",
			isTranslate: true,
		},
	}, {
		path: "/reference-vid-add",
		name: "reference-vid-add",
		component: () => import("@/modules/Settings/components/Reference/Product/VidProduct/ProductVidDocCreate.vue"),
		meta: {
			title: "vidProduct.create",
			isTranslate: true,
			breadcrumbItemTitle: "method.add",
			breadcrumbItemIsTranslate: true,
		},
	}, {
		path: "/reference-vid-view/:id(\\d+)",
		name: "reference-vid-view-id",
		component: () => import("@/modules/Settings/components/Reference/Product/VidProduct/ProductVidShow.vue"),
		meta: {
			title: "vidProduct.show",
			isTranslate: true,
			breadcrumbItemTitle: "common.view",
		},
	}, {
		path: "/reference-vid-edit/:id(\\d+)",
		name: "reference-vid-edit-id",
		component: () => import("@/modules/Settings/components/Reference/Product/VidProduct/ProductVidDocCreate.vue"),
		meta: {
			title: "vidProduct.edit",
			isTranslate: true,
			breadcrumbItemTitle: "method.edit",
			breadcrumbItemIsTranslate: true,
		},
	}, // Продукты end

	// Рационы и блюда
	// Рационы
	{
		path: "/reference-ration",
		name: "reference-ration",
		component: () => import("@/modules/Settings/components/Reference/RationDishes/Ration/Ration.vue"),
		meta: {
			title: "kitchen.ration",
			isTranslate: true,
		},
	}, {
		path: "/reference-ration-create",
		name: "reference-ration-create",
		component: () => import("@/modules/Settings/components/Reference/RationDishes/Ration/AddEditRation.vue"),
		meta: {
			title: "ration.create",
			isTranslate: true,
			breadcrumbItemTitle: "method.add",
			breadcrumbItemIsTranslate: true,
		},
	}, {
		path: "/reference-ration-edit/:id(\\d+)",
		name: "reference-ration-edit-id",
		component: () => import("@/modules/Settings/components/Reference/RationDishes/Ration/AddEditRation.vue"),
		meta: {
			title: "ration.edit",
			isTranslate: true,
			breadcrumbItemTitle: "method.edit",
			breadcrumbItemIsTranslate: true,
		},
	}, {
		path: "/reference-ration-view/:id(\\d+)",
		name: "reference-ration-view-id",
		component: () => import("@/modules/Settings/components/Reference/RationDishes/Ration/RationShow.vue"),
		meta: {
			title: "ration.show",
			isTranslate: true,
			breadcrumbItemTitle: "common.view",
			breadcrumbItemIsTranslate: true,
		},
	},

	// Блюда start
	{
		path: "/reference-dish",
		name: "reference-dish",
		component: () => import("@/modules/Settings/components/Reference/RationDishes/Dish/Dish.vue"),
		meta: {
			title: "monitoring.dishes",
			isTranslate: true,
		},
	}, {
		path: "/reference-dish-create",
		name: "reference-dish-create",
		component: () => import("@/modules/Settings/components/Reference/RationDishes/Dish/AddEditDish.vue"),
		meta: {
			title: "dishes.create",
			isTranslate: true,
			breadcrumbItemTitle: "method.add",
			breadcrumbItemIsTranslate: true,
		},
	}, {
		path: "/reference-dish-edit/:id",
		name: "reference-dish-id",
		component: () => import("@/modules/Settings/components/Reference/RationDishes/Dish/AddEditDish.vue"),
		meta: {
			title: "dishes.edit",
			isTranslate: true,
			breadcrumbItemTitle: "method.edit",
			breadcrumbItemIsTranslate: true,
		},
	}, {
		path: "/reference-dish-view/:id",
		name: "reference-view-id",
		component: () => import("@/modules/Settings/components/Reference/RationDishes/Dish/DishShow.vue"),
		meta: {
			title: "dishes.show",
			isTranslate: true,
			breadcrumbItemTitle: "common.view",
			breadcrumbItemIsTranslate: true,
		},
	}, // Блюда end
	// Рационы и блюда end

	// Единицы измерения
	{
		path: "/reference-unit",
		name: "reference-unit",
		component: () => import("@/modules/Settings/components/Reference/Unit/Unit.vue"),
		meta: {
			title: "common.unitMeasurement2",
			isTranslate: true,
		},
	}, // Единицы измерения end
] as RouteRecordRaw[];
