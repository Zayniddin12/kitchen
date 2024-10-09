import { defineStore } from "pinia";
import { ref } from "vue";

interface ProductType {
  id: number;
  name: string;
}

interface DistrictType {
  id: number,
  name: string,
  products?: ProductType[]
}

export const useDistrictStore = defineStore("districtStore", () => {
  const districts = ref<DistrictType[]>([
    {
      id: 1,
      name: "Зарафшан",
      products: [
        {
          id: 1,
          name: "Мясной склад",
        },
        {
          id: 2,
          name: "Овощной склад",
        },
        {
          id: 3,
          name: "Рисовый склад",
        },
      ],
    },
    {
      id: 2,
      name: "Навои",
      products: [
        {
          id: 1,
          name: "Мясной склад",
        },
        {
          id: 2,
          name: "Овощной склад",
        },
        {
          id: 3,
          name: "Рисовый склад",
        },
      ],
    },
    {
      id: 3,
      name: "Учкудук",
      products: [
        {
          id: 1,
          name: "Мясной склад",
        },
        {
          id: 2,
          name: "Овощной склад",
        },
        {
          id: 3,
          name: "Рисовый склад",
        },
      ],
    },
    {
      id: 4,
      name: "Нуробод",
      products: [
        {
          id: 1,
          name: "Мясной склад",
        },
        {
          id: 2,
          name: "Овощной склад",
        },
        {
          id: 3,
          name: "Рисовый склад",
        },
      ],
    },
    {
      id: 5,
      name: "Зафаробод",
      products: [
        {
          id: 1,
          name: "Мясной склад",
        },
        {
          id: 2,
          name: "Овощной склад",
        },
        {
          id: 3,
          name: "Рисовый склад",
        },
      ],
    },
  ]);
  const product = ref<DistrictType | null>(null);
  const district = ref<DistrictType | null>(null);

  const getProduct = (district_id: number, product_id: number) => {

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
  };
});