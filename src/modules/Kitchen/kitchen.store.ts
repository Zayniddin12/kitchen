import { defineStore } from "pinia";
import { computed, ref } from "vue";
import $axios from "@/plugins/axios/axios";
import { useLayoutStore } from "@/navigation/index";
import { useSettingsStore } from "@/modules/Settings/store";


enum PARTS {
    MENU = "menu",
    SALES = "sales",
}

type PartsType = PARTS.MENU | PARTS.SALES;

interface PartType {
    id: PartsType;
    name: string;
}

interface Params {
    search?: string | null;
    page?: number;
    per_page?: number;
    is_paid: number | string;
    base_id: number | string;
}

interface Part2Type {
    id: PartsType;
    name: string;
    department_id: number;
    department_name: string;
}

interface DepartmentType {
    name: string;
    id: number;
    parts: PartType[];
}

interface KitchenType {
    id: number;
    name: string;
    kitchen_count: number;
}

export const useKitchenStore = defineStore("kitchenStore", () => {
    const settingsStore = useSettingsStore();

    const departments = ref<DepartmentType[]>([]);
    const kitchenType = ref<KitchenType[] | []>([]);

    const GET_KITCHEN_TYPE = async (params: Params) => {
        const { data } = await $axios.get("/kitchen-types/list-by-base", { params });

        kitchenType.value = data.data && data.data.kitchen_types;
    };

    const GET_KITCHEN_LIST = async () => {
        await settingsStore.GET_REGIONAL({per_page: 100});

        if (settingsStore.regional && settingsStore.regional.managements) {
            departments.value = settingsStore.regional.managements.map(item => {
                const newItem = {} as Record<string, any>;
                newItem.title = item.name;
                newItem.icon = "building-warehouse";
                newItem.id = item.id;

                newItem.children = [
                    {
                        id: "menu",
                        title: "Меню",
                        route: `/kitchen/${item.id}/menu`
                    },
                    {
                        id: "sales",
                        title: "Продажи",
                        route: `/kitchen/${item.id}/sales`
                    }
                ];

                return newItem;
            });
        }


    };

    // const kitchenMenu = computed(() => {
    //   if (!departments.value.length) return [];
    //
    //   return departments.value.map(item => {
    //     const newItem = {} as Record<string, any>;
    //     newItem.title = item.name;
    //     newItem.icon = "building-warehouse";
    //     newItem.id = item.id;
    //
    //     newItem.children = [
    //       {
    //         id: "menu",
    //         title: "Меню",
    //       },
    //       {
    //         id: "sales",
    //         title: "Продажи",
    //       },
    //     ];
    //     console.log(newItem, "newItem");
    //
    //     return newItem;
    //   });
    // });

    const part = ref<Part2Type | null>(null);

    const activeMenuPart = computed(() => {
        return part.value?.id === PARTS.MENU;
    });

    const activeSalesPart = computed(() => {
        return part.value?.id === PARTS.SALES;
    });

    const fetchPart = (department_id: number, part_name: string) => {
        if (!departments.value.length) return;

        const department =
            departments.value.find(el => el.id == department_id) ?? null;

        if (!department) return;

        const activePart = department.children.find(el => el.id === part_name) ?? null;
        if (!activePart) return;
        ``;

        part.value = {
            ...activePart,
            ...{
                department_id: department.id,
                department_name: department.title
            }
        };
    };
    return {
        GET_KITCHEN_LIST,
        GET_KITCHEN_TYPE,
        departments,
        kitchenType,
        // fetchDepartments,
        // kitchenMenu,
        fetchPart,
        part,
        activeMenuPart,
        activeSalesPart
    };
});
