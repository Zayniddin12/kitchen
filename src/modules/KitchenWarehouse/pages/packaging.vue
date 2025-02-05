<script setup lang="ts">
import AppSelect from "@/components/ui/form/app-select/AppSelect.vue";
import { useI18n } from "vue-i18n";
import AppInput from "@/components/ui/form/app-input/AppInput.vue";
import { onMounted, ref } from "vue";
import { useSettingsStore } from "@/modules/Settings/store";
import { useRoute, useRouter } from "vue-router";
import { ElNotification } from "element-plus";
import { useKitchenWarehouseStore } from "@/modules/KitchenWarehouse/kitchen-warehouse.store";

const { t } = useI18n();
const router = useRouter();
const route = useRoute();
const settingsStore = useSettingsStore();
const store = useKitchenWarehouseStore();

const consumption = ref<any[]>([{
  category_id: null,
  product_type_id: null,
  quantity: null,
  measurement: null,
  price: null,
  totalSum: null,
}]);
const result = ref<any[]>([{
  category_id: null,
  product_type_id: null,
  quantity: null,
  measurement: null,
  price: null,
  totalSum: null,
}]);
const vidProducts = ref<any[]>([]);
const vidProductsResult = ref<any[]>([]);

const consumptionTipList = ref<any>([]);

onMounted(async () => {
  await settingsStore.GET_TYPE_PRODUCT({ kitchen_id: route.params.id4 });
  consumptionTipList.value = settingsStore.typeProduct.product_categories;

  await settingsStore.GET_TYPE_PRODUCT();
});


const addConsumption = () => {
  consumption.value.push({
    category_id: null,
    product_type_id: null,
    quantity: null,
    measurement: null,
    price: null,
    totalSum: null,
  });
};

const deleteConsumption = (index: number) => {
  consumption.value.splice(index, 1);
};

const fetchVidProductsList = async (item: any, index: number) => {
  vidProducts.value[index] = await settingsStore.GET_VID_PRODUCT({
    parent_id: item.category_id,
    per_page: 100,
    kitchen_id: route.params.id4,
  });
};

const changeProduct = async (item: any, index: number) => {
  const activeVidProduct = vidProducts.value[index].product_types.find(el => el);
  if (activeVidProduct) {
    item.measurement = activeVidProduct.unit;
    item.price = activeVidProduct.price || 0;
    item.totalSum = activeVidProduct.totalSum || 0;
  }
};

// results

const addResult = () => {
  result.value.push({
    category_id: null,
    product_type_id: null,
    quantity: null,
    measurement: null,
    price: null,
    totalSum: null,
  });
};

const deleteResult = (index: number) => {
  result.value.splice(index, 1);
};

const resultFetchVidProductsList = async (item: any, index: number) => {
  vidProductsResult.value[index] = await settingsStore.GET_VID_PRODUCT({
    parent_id: item.category_id,
    per_page: 100,
  });
};

const resultChangeProduct = (item: any, index: number) => {
  const data = vidProductsResult.value[index].product_types.find(el => el);
  if (data) {
    item.measurement = data.unit;
    item.price = data.price;
    item.totalSum = data.totalSum || 0;
  }
};


const createFactory = async () => {
  try {
    await store.CREATE_FACTORY_KITCHEN({
      id: route.params.id4,
      data: {
        in_products: consumption.value.map((e) => ({
          product_type_id: e.product_type_id,
          quantity: e.quantity,
        })),
        out_products: result.value.map((v) => ({
          product_type_id: v.product_type_id,
          quantity: v.quantity,
        })),
      },
    });

    router.go(-1);
    ElNotification({ title: "Success", type: "success" });
  } catch (e) {
    ElNotification({ title: "Error", type: "error", message: "Failed to create factory." });
  }
};

</script>

<template>
  <div>
    <div
      class="flex items-center justify-between mb-[24px]"
    >
      <h1 class="text-[#000D24] font-semibold text-[32px]">
        Расфасовка
      </h1>
    </div>

    <!----------------------Расход-------------------->
    <h5 class="text-[18px] font-medium text-[#000D24]">Расход</h5>

    <div class="mt-[12px] bg-[#F8F9FC] rounded-[16px] py-[16px] px-[12px]">
      <div class="grid grid-cols-6 gap-4" v-for="(item, index) in consumption" :key="index">
        <AppSelect
          v-model="item.category_id"
          :items="consumptionTipList"
          item-value="id"
          item-label="name"
          :label="t('product.type')"
          :placeholder="t('product.type')"
          label-class="text-[#A8AAAE] text-xs font-medium"
          @change="fetchVidProductsList(item, index)"
          trigger="blur"
        />

        <AppSelect
          v-model="item.product_type_id"
          :items="vidProducts[index]?.product_types"
          item-label="name"
          item-value="id"
          :label="t('product.view')"
          :placeholder="t('product.view')"
          label-class="text-[#A8AAAE] text-xs font-medium"
          :disabled="!item.category_id"
          @change="changeProduct(item, index)"
        />


        <app-input
          v-model="item.quantity"
          :label="t('common.quantity')"
          label-class="text-[#A8AAAE] text-[12px]"
        />

        <app-input
          disabled
          v-model="item.measurement"
          :label="t('common.measurement')"
          label-class="text-[#A8AAAE] text-[12px]"
        />

        <app-input
          disabled
          v-model="item.price"
          :label="t('common.price')"
          label-class="text-[#A8AAAE] text-[12px]"
        />

        <div class="flex items-center gap-4">
          <app-input
            :placeholder="item.quantity * item.price"
            class="w-full"
            disabled
            :label="t('common.totalSum')"
            label-class="text-[#A8AAAE] text-[12px]"
          />

          <button
            v-if="consumption && consumption.length !== 1"
            class="bg-[#E2E6F3] p-[10px] rounded-[8px] mt-2"
            @click="deleteConsumption(index)"
          >
            <img src="@/assets/images/icons/delete.svg" alt="delete" />
          </button>
        </div>
      </div>

      <button class="primary__btn" @click="addConsumption">
        <img src="@/assets/images/icons/plus2.svg" alt="plus" class="mr-[4px]" />
        Добавить еще
      </button>
    </div>

    <div class="border border-[#F1F1F1] w-full my-[24px]" />

    <!--------------------Результат-------------------->
    <h5 class="text-[18px] font-medium text-[#000D24]">Результат</h5>

    <div class="mt-[12px] bg-[#F8F9FC] rounded-[16px] py-[16px] px-[12px]">
      <div class="grid grid-cols-6 gap-4" v-for="(item2, index2) in result" :key="index2">
        <AppSelect
          v-model="item2.category_id"
          :items="settingsStore.typeProduct.product_categories"
          item-value="id"
          item-label="name"
          :label="t('product.type')"
          :placeholder="t('product.type')"
          label-class="text-[#A8AAAE] text-xs font-medium"
          @change="resultFetchVidProductsList(item2, index2)"
          trigger="blur"
        />

        <AppSelect
          v-model="item2.product_type_id"
          :items="vidProductsResult[index2]?.product_types"
          item-label="name"
          item-value="id"
          :label="t('product.view')"
          :placeholder="t('product.view')"
          label-class="text-[#A8AAAE] text-xs font-medium"
          :disabled="!item2.category_id"
          @change="resultChangeProduct(item2, index2)"
        />


        <app-input
          v-model="item2.quantity"
          :label="t('common.quantity')"
          label-class="text-[#A8AAAE] text-[12px]"
        />

        <app-input
          disabled
          v-model="item2.measurement"
          :label="t('common.measurement')"
          label-class="text-[#A8AAAE] text-[12px]"
        />

        <app-input
          v-model="item2.price"
          :label="t('common.price')"
          label-class="text-[#A8AAAE] text-[12px]"
        />

        <div class="flex items-center gap-4">
          <app-input
            :placeholder="item2.totalSum"
            class="w-full"
            disabled
            :label="t('common.totalSum')"
            label-class="text-[#A8AAAE] text-[12px]"
          />

          <button class="bg-[#E2E6F3] p-[10px] rounded-[8px] mt-2" @click="deleteResult(index2)"
                  v-if="result && result.length !== 1">
            <img src="@/assets/images/icons/delete.svg" alt="delete" />
          </button>
        </div>
      </div>

      <button class="primary__btn" @click="addResult">
        <img src="@/assets/images/icons/plus2.svg" alt="plus" class="mr-[4px]" />
        Добавить еще
      </button>
    </div>


    <div class="border border-[#F1F1F1] w-full my-[24px]" />

    <div class="flex items-center gap-4 justify-end">
      <button class="custom-light-btn" @click="router.go(-1)">Отменить</button>
      <button class="custom-apply-btn" @click="createFactory">Добавить</button>
    </div>
  </div>
</template>

<style scoped lang="scss">
.primary__btn {
  @apply bg-[white] border border-[#2E90FA] rounded-[8px] text-[#2E90FA] text-[12px] font-medium flex items-center justify-center px-[16px] py-[8px] mt-[20px]
}
</style>