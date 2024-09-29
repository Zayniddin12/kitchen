import { defineStore } from "pinia";
import { ref } from "vue";
import { computed } from "vue";

interface DistrictType {
  id: number;
  name: string;
}

export const useDistrictStore = defineStore("districtStore", () => {
  const districts = computed<DistrictType[]>(() => {
    return [
      {
        id: 1,
        name: "КП РУ Зарафшон",
      },
      {
        id: 2,
        name: "КП РУ Навои",
      },
      {
        id: 3,
        name: "КП РУ Нуробод",
      },
      {
        id: 4,
        name: "КП РУ Учкудук",
      },
      {
        id: 5,
        name: "КП РУ Зафаробод",
      },
    ];
  });

  const district = ref<DistrictType | null>(null);

  const getDistrict = (id: number) => {
    district.value = districts.value.find(el => el.id === id) ?? null;
  };

  return {
    districts,
    district,
    getDistrict,
  };
});
