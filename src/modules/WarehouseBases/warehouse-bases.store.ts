import { defineStore } from "pinia";
import { computed, ref } from "vue";
import { useSettingsStore } from "@/modules/Settings/store";

interface ProductType {
    id: number;
    name: string;
}

interface DistrictType {
    id: number,
    name: string,
    products?: ProductType[]
}

export const useWarehouseBasesStore = defineStore("warehouseBasesStore", () => {
    const settingsStore = useSettingsStore();

    const bases = ref<Map<number, Record<string, any>[]>>(new Map);

    const getBases = async (management_id: number) => {
        if (bases.value.has(management_id)) return;

        await settingsStore.GET_WAREHOUSE_BASES_LIST({ per_page: 100, management_id });

        bases.value.set(management_id, settingsStore.wareHouseList.bases);
    };

    const districts = ref<Record<string, any>>([]);

    const getDistricts = () => {
        settingsStore.regional.managements.forEach(async (item: any) => {
            await getBases(item.id);

            const activeBase = bases.value.get(item.id);

            if (activeBase && activeBase.length > 0 && !districts.value.find((el:any) => el.id === item.id)) districts.value.push({
                id: item.id,
                title: item.name,
                icon: "building-warehouse",
                children: activeBase.map(el => {
                    return {
                        id: el.id,
                        title: el.name,
                        route: `/warehouse/${item.id}/${el.id}`
                    };
                })
            });
        });
    };

    const product = ref<DistrictType | null>(null);
    const district = ref<DistrictType | null>(null);

    const getProduct = (district_id: number, product_id: number) => {

        console.log(districts.value);

        district.value = districts.value.find(el => el.id === district_id) ?? null;

        if (!district.value) return;


        if (district.value.products) {
            product.value = district.value.products.find((el) => el.id === product_id) ?? null;
        } else {
            product.value = null;

        }
    };

    return {
        districts,
        district,
        product,
        getProduct,
        getDistricts
    };
});