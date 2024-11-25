import { defineStore } from "pinia";
import { computed, ref } from "vue";
import $axios from "@/plugins/axios/axios";
import { useLayoutStore } from "@/navigation/index";
import { useSettingsStore } from "@/modules/Settings/store";


enum PARTS {
  MENU = "free-kitchen",
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
  is_paid?: number | string | null;
  management_id?: number | string;
  kitchen_type_id?: string | number;
}

interface Part2Type {
  id: PartsType;
  name: string;
  department_id: number;
  department_name: string;
  kitchen_vid?: string;
  kitchen_type: string;
}

interface DepartmentType {
  name: string;
  id: number;
  parts: PartType[];
}

interface KitchenVid {
  id: number;
  name: string;
  kitchen_count: number;
}

interface KitchenType {
  id: number;
  name: string;
  kitchen_capacity: number;
}

export const useKitchenStore = defineStore("kitchenStore", () => {
  const departments = ref<DepartmentType[]>([]);
  const kitchenVid = ref<KitchenVid[] | []>([]);
  const kitchenType = ref<KitchenType[] | []>([]);
  const layoutStore = useLayoutStore();

  // KITCHEN CREATE

  const CREATE_KITCHEN = async (payload: any) => {
    const { data } = await $axios.post("/kitchen-sales/menu", payload);

    return data;
  };

  const CREATE_KITCHEN_ELEMENT = async ({ id, payload }: { id: string, payload: any }) => {
    const { data } = await $axios.post(`/kitchen-sales/menu/${id}/add-element`, payload);

    return data;
  };

  const GET_KITCHEN_VID = async (params: Params) => {
    const { data } = await $axios.get("/kitchen-types/list-by-base", { params });

    kitchenVid.value = data.data && data.data.kitchen_types;
  };

  const GET_KITCHEN_TYPE = async (params: Params) => {
    const { data } = await $axios.get("/kitchen-warehouses/list", { params });

    kitchenType.value = data.data && data.data.kitchen_warehouses;
  };

  const GET_KITCHEN_LIST = async (params?: Params) => {
    const { data } = await $axios.get("/managements", { params });

    if (data.data && data.data.managements) {
      // departments.value = data.data && data.data.bases;
      departments.value = data.data.managements.map(item => {
        const newItem = {} as Record<string, any>;
        newItem.title = item.name;
        newItem.icon = "building-warehouse";
        newItem.id = item.id;

        newItem.children = [
          {
            id: "free-kitchen",
            title: "Бесплатная кухня",
            route: `/kitchen/${item.id}/free-kitchen`,
          },
          {
            id: "sales",
            title: "Продажи",
            route: `/kitchen/${item.id}/sales`,
          },
        ];

        return newItem;
      });

      layoutStore.menuItems.forEach(el => {
        if (el.unique == "kitchen") {
          el.children = departments.value;
        }
      });
    }


  };

  const part = ref<Part2Type | null>(null);

  const activeMenuPart = computed(() => {
    return part.value?.id === PARTS.MENU;
  });

  const activeSalesPart = computed(() => {
    return part.value?.id === PARTS.SALES;
  });

  const fetchPart2 = (kitchen_vid_id: number | string) => {
    console.log(kitchenVid.value, "kitchen_vid");
    if (!kitchenVid.value.length) return;

    const kitchen_vid =
      kitchenVid.value.find(el => el.id == kitchen_vid_id) ?? null;

    if (!kitchen_vid) return;

    part.value = {
      ...part.value,
      ...{
        kitchen_vid: kitchen_vid.name,
      },
    };
  };

  const fetchPart3 = (kitchen_type_id: number | string) => {

    if (!kitchenType.value.length) return;

    const kitchen_type =
      kitchenType.value.find(el => el.id == kitchen_type_id) ?? null;

    if (!kitchen_type) return;

    part.value = {
      ...part.value,
      ...{
        kitchen_type: kitchen_type.name,
      },
    };
  };

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
        department_name: department.title,
      },
    };
  };
  return {
    CREATE_KITCHEN,
    CREATE_KITCHEN_ELEMENT,
    GET_KITCHEN_LIST,
    GET_KITCHEN_VID,
    GET_KITCHEN_TYPE,
    departments,
    kitchenType,
    kitchenVid,
    // fetchDepartments,
    // kitchenMenu,
    fetchPart,
    fetchPart2,
    fetchPart3,
    part,
    activeMenuPart,
    activeSalesPart,
  };
});
