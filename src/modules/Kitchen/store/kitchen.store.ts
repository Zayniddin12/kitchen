import { defineStore } from "pinia";
import { computed, ref } from "vue";

interface PartType {
    name: string;
    id: number;
}

interface Part2Type {
    id: number;
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
                        id: 1,
                        name: "Меню"
                    },
                    {
                        id: 2,
                        name: "Продажи"
                    }
                ]
            },
            {
                id: 2,
                name: "Навои",
                parts: [
                    {
                        id: 1,
                        name: "Меню"
                    },
                    {
                        id: 2,
                        name: "Продажи"
                    }
                ]
            },
            {
                id: 3,
                name: "Учкудук",
                parts: [
                    {
                        id: 1,
                        name: "Меню"
                    },
                    {
                        id: 2,
                        name: "Продажи"
                    }
                ]
            },
            {
                id: 4,
                name: "Нуробод",
                parts: [
                    {
                        id: 1,
                        name: "Меню"
                    },
                    {
                        id: 2,
                        name: "Продажи"
                    }
                ]
            },
            {
                id: 5,
                name: "Зафаробод",
                parts: [
                    {
                        id: 1,
                        name: "Меню"
                    },
                    {
                        id: 2,
                        name: "Продажи"
                    }
                ]
            }
        ];
    };

    const kitchenMenu = computed(() => {
        if(!departments.value.length) return [];

        return departments.value.map((item) => {
            const newItem = {};
            newItem.title = item.name;
            newItem.icon = "building-warehouse";

            newItem.children = item.parts.map(part => {
                const newPart = {};
                newPart.title = part.name;
                newPart.route = `/kitchen/${item.id}/${part.id}`;

                return newPart;
            });

            return newItem;
        })
    })

    const part = ref<Part2Type | null>(null);

    const fetchPart = (department_id: number, part_id: number) => {
        if (!departments.value.length) return;

        const department = departments.value.find(el => el.id === department_id) ?? null;

        if (!department) return;

        const activePart = department.parts.find(el => el.id === part_id) ?? null;

        if (!activePart) return;

        part.value = {
            ...activePart,
            ...{
                department_id: department.id,
                department_name: department.name
            }
        };
    };

    return {
        departments,
        fetchDepartments,
        kitchenMenu,
        fetchPart,
        part
    };
});