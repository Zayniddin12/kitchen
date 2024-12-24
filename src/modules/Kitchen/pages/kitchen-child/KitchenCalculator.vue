<script
  setup
  lang="ts"
>
import { useRoute } from "vue-router";
import { computed, onMounted, ref, watch, watchEffect } from "vue";
import AppSelect from "@/components/ui/form/app-select/AppSelect.vue";
import AppInput from "@/components/ui/form/app-input/AppInput.vue";
import useBreadcrumb from "@/components/ui/app-breadcrumb/useBreadcrumb";
import { useKitchenStore } from "@/modules/Kitchen/kitchen.store";
import { useSettingsStore } from "@/modules/Settings/store";
import { useI18n } from "vue-i18n";

const route = useRoute();

const { t } = useI18n();

const { setBreadCrumb } = useBreadcrumb();

const settingsStore = useSettingsStore();
const kitchenStore = useKitchenStore();


const num = ref(1);

const tableData = ref({ products: [] });

const title = computed(() => route.meta.title ?? "");

const isTranslate = computed(() => !!route.meta.isTranslate);

const setBreadCrumbFn = () => {
  kitchenStore.fetchPart(+route.params.department_id, route.params.part_name as string);
  kitchenStore.fetchPart2(+route.params.kitchen_id);
  kitchenStore.fetchPart3(+route.params.child_id);

  if (!kitchenStore.part) return;

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
      to: { name: "KitchenShowChildIndex" },
    },
    {
      label: title.value,
      isTranslate: isTranslate.value,
      isActionable: true,
    },
  ]);
};

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

const changeRation = async (val: string | number) => {
  if (val) {
    const response = await kitchenStore.GET_RATION_LIST_IN_MENU(val);
    tableData.value = response;
  } else {
    tableData.value = {};
  }
};

const changeMeal = async (val: string | number) => {
  if (val) {
    tableData.value = await settingsStore.GET_MEALS_DETAIL(val);
  } else {
    tableData.value = {};
  }
};

onMounted(async () => {
  await settingsStore.GET_RATION_LIST({ per_page: 100 });
  await settingsStore.GET_MEALS({ per_page: 100 });
});

watchEffect(() => {
  setBreadCrumbFn();
});

const params = ref({
  ration_id: null,
  meal_id: null,
});

</script>

<template>
  <section>
    <div>
      <h1
        v-if="title"
        class="mb-6 text-[32px] text-[#000D24] font-semibold	block"
      >
        {{ isTranslate ? t(title) : title }}
      </h1>

      <div class="bg-[#FFFFFF] min-h-[65vh] border border-[#E2E6F3] rounded-[24px] p-[24px]">
        <!--        {{ tableData }}-->
        <div class="flex items-center gap-4 w-full">
          <AppSelect
            v-model="params.ration_id"
            :items="settingsStore.rationList.rations"
            @change="changeRation"
            :disabled="params.meal_id"
            clearable
            item-value="id"
            item-label="name"
            :label="t('kitchen.ration2')"
            label-class="text-[#A8AAAE]"
            class="w-full"
          />

          <AppSelect
            v-model="params.meal_id"
            :items="settingsStore.meals.meals"
            @change="changeMeal"
            :disabled="!!params.ration_id"
            clearable
            class="w-full"
            item-value="id"
            item-label="name"
            :label="t('kitchen.dishes')"
            label-class="text-[#A8AAAE] text-xs font-medium"
            :placeholder="t('kitchen.dishesPlaceholder')"
          />

          <AppInput
            disabled
            class="w-full"
            placeholder="1"
            :label="t('kitchen.portion')"
            label-class="text-[#A8AAAE] text-xs font-medium"
          />
        </div>

        <div class="mb-[24px]">
          <el-table
            v-if="tableData && tableData.products"
            :empty-text="t('common.empty')"
            :data="tableData && tableData.products"
            stripe
            class="custom-element-table custom-element-table--has-append w-full"
          >
            <el-table-column
              prop="name"
              :label="t('kitchen.ingredients')"
            />
            <el-table-column
              prop="quantity"
              :label="t('common.quantity')"
            />
            <el-table-column
              prop="unit"
              :label="t('common.measurement')"
            />
            <el-table-column
              prop="price"
              :label="t('common.price')"
            />

            <el-table-column
              prop="net_price"
              :label="t('common.sum')"
            />

            <template #append>
              <div class="px-4 py-3.5 flex justify-end items-center ">
                <div class="flex items-center gap-x-8">
                  <div class="flex items-center gap-x-1 text-sm">
                    <span class="text-cool-gray">
                      {{ t("common.price") }}:
                    </span>
                    <strong class="font-semibold text-dark">
                      25 000 {{ t("currency.sum") }}
                    </strong>
                  </div>
                  <div class="flex items-center gap-x-1 text-sm">
                    <span class="text-cool-gray">
                      {{ t("common.ndc") }}:
                    </span>
                    <strong class="font-semibold text-dark">
                      3 000 {{ t("currency.sum") }}
                    </strong>
                  </div>
                  <div class="flex items-center gap-x-1 text-sm">
                    <span class="text-cool-gray">
                      {{ t("common.totalSum") }}:
                    </span>
                    <strong class="font-semibold text-dark">
                      {{ tableData?.total_price && tableData?.total_price.toLocaleString() }} {{ t("currency.sum") }}
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