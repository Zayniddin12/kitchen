<script
  setup
  lang="ts"
>
import { useRoute } from "vue-router";
import { computed, ref, watchEffect } from "vue";
import AppSelect from "@/components/ui/form/app-select/AppSelect.vue";
import AppInput from "@/components/ui/form/app-input/AppInput.vue";
import useBreadcrumb from "@/components/ui/app-breadcrumb/useBreadcrumb";
import { useKitchenStore } from "@/modules/Kitchen/kitchen.store";

const route = useRoute();

const { setBreadCrumb } = useBreadcrumb();

const kitchenStore = useKitchenStore();


const num = ref(1);

const tableData = ([
  {
    id: 1,
    ingredients: "Картофель",
    quantity: 80,
    unit_measurement: "кг",
    sum: "22 000 сум",
  },
  {
    id: 2,
    ingredients: "Картофель",
    quantity: 80,
    unit_measurement: "кг",
    sum: "22 000 сум",
  },
  {
    id: 3,
    ingredients: "Картофель",
    quantity: 80,
    unit_measurement: "кг",
    sum: "22 000 сум",
  },
  {
    id: 4,
    ingredients: "Картофель",
    quantity: 80,
    unit_measurement: "кг",
    sum: "22 000 сум",
  },
]);

const title = computed(() => route.meta.title ?? "");

const setBreadCrumbFn = () => {
  kitchenStore.fetchPart(+route.params.department_id, route.params.part_name as string);

  if (!kitchenStore.part) return;

  setBreadCrumb([
    {
      label: "Кухня",
    },
    {
      label: kitchenStore.part.name,
    },
    {
      label: kitchenStore.part.department_name,
      to: { name: "KitchenIndex" },
    },
    {
      label: "Лагерь",
      to: { name: "KitchenShowIndex" },
    },
    {
      label: "Паҳлавон",
      to: { name: "KitchenShowChildIndex" },
    },
    {
      label: title.value,
      isActionable: true,
    },
  ]);
};

watchEffect(() => {
  setBreadCrumbFn();
});

</script>

<template>
  <section>
    <div>
      <h1
        v-if="title"
        class="mb-6 text-[32px] text-[#000D24] font-semibold	block"
      >
        {{ title }}
      </h1>

      <div class="bg-[#FFFFFF] min-h-[65vh] border border-[#E2E6F3] rounded-[24px] p-[24px]">

        <div class="flex items-center gap-4 w-[70%]">
          <AppSelect
            class="w-full"
            label="Рацион"
            label-class="text-[#A8AAAE] text-[12px] font-medium"
            placeholder="Выберите рацион"
          />
          <AppInput
            class="w-full"
            placeholder="Введите количество порций"
            label="Порция"
            label-class="text-[#A8AAAE] text-[12px] font-medium"
          />
        </div>

        <div class="mb-[24px]">
          <el-table
            :data="tableData"
            stripe
            class="custom-element-table custom-element-table--has-append"
          >
            <el-table-column
              prop="ingredients"
              label="Ингредиенты"
            />
            <el-table-column
              prop="quantity"
              label="Количество"
            />
            <el-table-column
              prop="unit_measurement"
              label="Ед. измерения"
            />
            <el-table-column
              prop="sum"
              label="Сумма"
            />

            <template #append>
              <div class="px-4 py-3.5 flex justify-end items-center ">
                <div class="flex items-center gap-x-8">
                  <div class="flex items-center gap-x-1 text-sm">
                    <span class="text-cool-gray">
                      Цена:
                    </span>
                    <strong class="font-semibold text-dark">
                      25 000 сум
                    </strong>
                  </div>
                  <div class="flex items-center gap-x-1 text-sm">
                    <span class="text-cool-gray">
                      НДС:
                    </span>
                    <strong class="font-semibold text-dark">
                      3 000 сум
                    </strong>
                  </div>
                  <div class="flex items-center gap-x-1 text-sm">
                    <span class="text-cool-gray">
                      Общая сумма:
                    </span>
                    <strong class="font-semibold text-dark">
                      28 000 сум
                    </strong>
                  </div>
                </div>
              </div>
            </template>
          </el-table>
        </div>
      </div>
    </div>
  </section>
</template>