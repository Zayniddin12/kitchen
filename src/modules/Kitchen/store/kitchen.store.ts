import { defineStore } from "pinia";
import { computed, ref } from "vue";

enum PARTS {
  MENU = "menu",
  SALES = "sales",
}

type PartsType = PARTS.MENU | PARTS.SALES;

interface PartType {
  id: PartsType;
  name: string;
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

export const useKitchenStore = defineStore("kitchenStore", () => {
  const departments = ref<DepartmentType[]>([]);

  const fetchDepartments = () => {
    departments.value = [
      {
        id: 1,
        name: "Зарафшан",
        parts: [
          {
            id: PARTS.MENU,
            name: "Меню",
          },
          {
            id: PARTS.SALES,
            name: "Продажи",
          },
        ],
      },
      {
        id: 2,
        name: "Навои",
        parts: [
          {
            id: PARTS.MENU,
            name: "Меню",
          },
          {
            id: PARTS.SALES,
            name: "Продажи",
          },
        ],
      },
      {
        id: 3,
        name: "Учкудук",
        parts: [
          {
            id: PARTS.MENU,
            name: "Меню",
          },
          {
            id: PARTS.SALES,
            name: "Продажи",
          },
        ],
      },
      {
        id: 4,
        name: "Нуробод",
        parts: [
          {
            id: PARTS.MENU,
            name: "Меню",
          },
          {
            id: PARTS.SALES,
            name: "Продажи",
          },
        ],
      },
      {
        id: 5,
        name: "Зафаробод",
        parts: [
          {
            id: PARTS.MENU,
            name: "Меню",
          },
          {
            id: PARTS.SALES,
            name: "Продажи",
          },
        ],
      },
    ];
  };

  const kitchenMenu = computed(() => {
    if (!departments.value.length) return [];

    return departments.value.map((item) => {
      const newItem = {} as Record<string, any>;
      newItem.title = item.name;
      newItem.icon = "building-warehouse";

      newItem.children = item.parts.map(part => {
        const newPart = {} as Record<string, any>;
        newPart.title = part.name;
        newPart.route = `/kitchen/${item.id}/${part.id}`;

        return newPart;
      });

      return newItem;
    });
  });

  const part = ref<Part2Type | null>(null);

  const activeMenuPart = computed(() => {
    return part.value?.id === PARTS.MENU;
  });

  const activeSalesPart = computed(() => {
    return part.value?.id === PARTS.SALES;
  });

  const fetchPart = (department_id: number, part_name: string) => {
    if (!departments.value.length) return;

    const department = departments.value.find(el => el.id === department_id) ?? null;

    if (!department) return;

    const activePart = department.parts.find(el => el.id === part_name) ?? null;

    if (!activePart) return;

    part.value = {
      ...activePart,
      ...{
        department_id: department.id,
        department_name: department.name,
      },
    };
  };


  return {
    departments,
    fetchDepartments,
    kitchenMenu,
    fetchPart,
    part,
    activeMenuPart,
    activeSalesPart,
  };
});