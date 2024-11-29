<script
  setup
  lang="ts"
>
import { useRoute } from "vue-router";
import { onMounted, ref, watch, watchEffect } from "vue";
import { useKitchenStore } from "@/modules/Kitchen/kitchen.store";
import useBreadcrumb from "@/components/ui/app-breadcrumb/useBreadcrumb";

const kitchenStore = useKitchenStore();
const route = useRoute();
const { setBreadCrumb } = useBreadcrumb();

const num = ref(1);

interface TableData {
  id: number;
  num: string;
  date: string;
  doc: string;
  theme: string;
  send: string;
  receive: string;
}

const tableData = ref<TableData[]>([
  {
    id: 1,
    num: "1",
    date: "23.08.2024",
    doc: "852369",
    theme: "Доставка мяса",
    send: "Зарафшан",
    receive: "Фонд",
  },
  {
    id: 2,
    num: "2",
    date: "22.08.2024",
    doc: "556261",
    theme: "Доставка картофеля",
    send: "Учкудук",
    receive: "Фонд",
  },
  {
    id: 3,
    num: "3",
    date: "21.08.2024",
    doc: "584534",
    theme: "Доставка лука",
    send: "Навои",
    receive: "Фонд",
  },
  {
    id: 4,
    num: "4",
    date: "22.08.2024",
    doc: "556261",
    theme: "Доставка картофеля",
    send: "Учкудук",
    receive: "Фонд",
  },
]);

const setBreadCrumbFn = () => {
  kitchenStore.fetchPart(+route.params.department_id, route.params.part_name as string);
  kitchenStore.fetchPart2(+route.params.kitchen_id);
  kitchenStore.fetchPart3(+route.params.child_id);

  if (!kitchenStore.part) return;

  console.log(kitchenStore.part.kitchen_vid);

  setBreadCrumb([
    {
      label: "Кухня",
    },
    {
      label: kitchenStore.part.title,
    },
    {
      label: kitchenStore.part.department_name,
      to: { name: "KitchenIndex" },
    },
    {
      label: kitchenStore.part.kitchen_vid as string,
      isActionable: true,
      to: { name: "KitchenShow" },
    },
    {
      label: kitchenStore.part.kitchen_type as string,
      isActionable: true,
    },
    {
      label: "Меню",
      isActionable: true,
    },
    {
      label: "Продать",
      isActionable: true,
    },
  ]);
};

onMounted(async () => {
  await kitchenStore.GET_CURRENT_MENU_LIST(route.params.child_id as number);
});

watch(() => route.params, async () => {
  await kitchenStore.GET_KITCHEN_VID({
    management_id: route.params.department_id as string,
    is_paid: route.params.part_name == "free-kitchen" ? 0 : route.params.part_name == "sales" ? 1 : null,
  });
  await kitchenStore.GET_KITCHEN_TYPE({
    management_id: route.params.department_id as string,
    is_paid: route.params.part_name == "free-kitchen" ? 0 : route.params.part_name == "sales" ? 1 : null,
    kitchen_type_id: route.params.kitchen_id as string,
  });

  setBreadCrumbFn();
}, { immediate: true });

watchEffect(() => {
  setBreadCrumbFn();
});

</script>

<template>
  <div>
    <h1 class="mb-6 text-[32px] text-[#000D24] font-semibold">
      Продать
      <!--      {{kitchenStore.part}}-->

    </h1>
    {{ kitchenStore.menuToday }}
    <div class="bg-[#FFFFFF] border border-[#E2E6F3] rounded-[24px] p-[24px]">

      <div class="flex items-center mb-[24px]">
        <div
          v-for="item in kitchenStore.menuToday.elements"
          class="bg-[#F8F9FC] rounded-[16px] p-[12px] mr-[24px] cursor-pointer w-[113px]"
        >
          <span class="block text-[18px] text-[#4F5662] font-medium mb-[4px]">{{ item.product_name }}</span>
          <span class="block text-[14px] text-[#8F9194] mb-[4px]">{{ item.product_number }}</span>
          <span class="block text-[14px] text-[#8F9194]">R-0000</span>
        </div>
      </div>

      <div class="mb-[24px]">
        <el-table
          :data="tableData"
          stripe
          class="custom-element-table"
        >
          <el-table-column
            prop="num"
            label="Название"
          />
          <el-table-column
            prop="date"
            label="Количество"
          />
          <el-table-column
            prop="doc"
            label="Ед. измерения"
          />

          <template #append>
            <div class="px-4 py-3.5 flex justify-between items-center ">
              <div class="flex items-center">
                <span class="text-[#8F9194] text-[14px] font-medium mr-[16px]">Количество порции</span>
                <el-input-number
                  v-model="num"
                  :min="1"
                  size="small"
                />
              </div>
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
      <div class="flex justify-end">
        <button class="custom-apply-btn">Продать</button>
      </div>

    </div>
  </div>
</template>