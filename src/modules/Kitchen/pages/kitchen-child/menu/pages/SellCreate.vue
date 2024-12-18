<script
  setup
  lang="ts"
>
import { useRoute, useRouter } from "vue-router";
import { onMounted, ref, watch, watchEffect } from "vue";
import { useKitchenStore } from "@/modules/Kitchen/kitchen.store";
import useBreadcrumb from "@/components/ui/app-breadcrumb/useBreadcrumb";

const kitchenStore = useKitchenStore();
const route = useRoute();
const router = useRouter();
const { setBreadCrumb } = useBreadcrumb();

const num = ref(1);

const tableData = ref<any>({});
const activeData = ref<number | string | null>(null);

const setBreadCrumbFn = () => {
  kitchenStore.fetchPart(+route.params.department_id, route.params.part_name as string);
  kitchenStore.fetchPart2(+route.params.kitchen_id);
  kitchenStore.fetchPart3(+route.params.child_id);

  if (!kitchenStore.part) return;

  console.log(kitchenStore.part.kitchen_vid);

  setBreadCrumb([
    {
      label: "kitchen.title",
      isTranslate: true,
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
      to: { name: "KitchenShow" },
    },
    {
      label: kitchenStore.part.kitchen_type as string,
    },
    {
      label: "common.menu",
      to: { name: "KitchenShow" },
      isTranslate: true,
    },
    {
      label: "Продать",
      isActionable: true,
    },
  ]);
};

onMounted(async () => {
  await kitchenStore.GET_CURRENT_MENU_LIST(route.params.child_id as number);
  tableData.value = kitchenStore.menuToday.elements[0];
  activeData.value = 0;
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


const setActiveData = (data, index) => {
  console.log(data);
  tableData.value = data ? data : {};
  activeData.value = index;
};

const handleSubmit = async () => {
  try {
    let data = {
      kitchen_id: Number(route.params.child_id),
      rations: [
        {
          id: tableData.value.product_id,
          price: tableData.value.price,
          menu_id: tableData.value.id,
          quantity: num.value,
        },

      ],

    };
    await kitchenStore.CREATE_ORDER(data);
    await router.push(`/kitchen/${route.params.department_id}/free-kitchen/${route.params.kitchen_id}/${route.params.child_id}/menu`);
  } catch (err) {

  }
};

</script>

<template>
  <div>
    <h1 class="mb-6 text-[32px] text-[#000D24] font-semibold">
      Продать
      <!--      {{kitchenStore.part}}-->

    </h1>
    <!--    {{ kitchenStore.menuToday }}-->
    <div class="bg-[#FFFFFF] border border-[#E2E6F3] rounded-[24px] p-[24px]">

      <div class="flex items-center mb-[24px]">
        <div
          v-for="(item, index) in kitchenStore.menuToday.elements"
          :key="index"
          :class="['bg-[#F8F9FC] rounded-[16px] p-[12px] mr-[24px] cursor-pointer w-[113px]', activeData == index && 'bg-[#F8F9FC] shadow-2xl !text-[#2E90FA]']"

          @click="setActiveData(item, index)"
        >
          <span
            class="block text-[18px] text-[#4F5662] font-medium mb-[4px]"
            :class="activeData == index && '!text-[#2E90FA]'"
          >{{ item.product_name }}</span>
          <span
            class="block text-[14px] text-[#8F9194] mb-[4px]"
            :class="activeData == index && '!text-[#2E90FA]'"
          >{{ item.product_number }}</span>
          <span
            class="block text-[14px] text-[#8F9194]"
            :class="activeData == index && '!text-[#2E90FA]'"
          >R-0000</span>
        </div>
      </div>

      <div class="mb-[24px]">
        <!--        {{ tableData }} {{ activeData }}-->
        <el-table
          empty-text="Нет данных"
          :data="tableData.product"
          stripe
          class="custom-element-table"
        >
          <el-table-column
            prop="name"
            label="Название"
          />
          <el-table-column
            prop="quantity"
            label="Количество"
          />
          <el-table-column
            prop="unit"
            label="Ед. измерения"
          />

          <template #append>
            <div class="px-4 py-3.5 flex justify-between items-center ">
              <div class="flex items-center">
                <span class="text-[#8F9194] text-[14px] font-medium mr-[16px]">Количество порции</span>
                <!--                {{ num }}-->
                <el-input-number
                  class="order-kitchen"
                  v-model="num"
                  :min="1"
                  :max="tableData.amount_left"
                  size="small"
                />
              </div>
              <div class="flex items-center gap-x-8">
                <div class="flex items-center gap-x-1 text-sm">
                  <span class="text-cool-gray">
                    Цена:
                  </span>
                  <strong class="font-semibold text-dark">
                    {{ tableData.price && tableData.price.toLocaleString() }} сум
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
        <button
          @click="handleSubmit"
          class="custom-apply-btn"
        >Продать
        </button>
      </div>

    </div>
  </div>
</template>

<style lang="scss">

</style>