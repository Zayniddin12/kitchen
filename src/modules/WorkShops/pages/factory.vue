<script setup lang="ts">
import AppSelect from "@/components/ui/form/app-select/AppSelect.vue";
import { useI18n } from "vue-i18n";
import AppInput from "@/components/ui/form/app-input/AppInput.vue";
import { computed, onMounted, ref, watchEffect } from "vue";
import { useSettingsStore } from "@/modules/Settings/store";
import { useRoute, useRouter } from "vue-router";
import { useWorkshopsStore } from "@/modules/WorkShops/workshops.store";
import { ElNotification } from "element-plus";
import useConfirm from "@/components/ui/app-confirm/useConfirm";
import useBreadcrumb from "@/components/ui/app-breadcrumb/useBreadcrumb";
import { useKitchenStore } from "@/modules/Kitchen/kitchen.store";

const { t } = useI18n();
const router = useRouter();
const route = useRoute();
const settingsStore = useSettingsStore();
const store = useWorkshopsStore();
const { confirm } = useConfirm();
const workshopsStore = useWorkshopsStore();

const in_products = ref<any[]>([{
  category_id: null,
  product_type_id: null,
  quantity: "0.00001",
  measurement: null,
  price: null,
  totalSum: null,
}]);

const meal_products = ref<any[]>([{
  meal_id: null,
  quantity: "",
  price: null,
}]);

const out_products = ref<any[]>([{
  category_id: null,
  product_type_id: null,
  quantity: "0.00001",
  measurement: null,
  price: null,
  totalSum: null,
}]);
const vidProducts = ref<any[]>([]);
const vidProductsResult = ref<any[]>([]);
let quantity = ref(1)

onMounted(async () => {
  await settingsStore.GET_TYPE_PRODUCT();
  await settingsStore.GET_MEALS({per_page: 100,});
});


const addConsumption = () => {
  in_products.value.push({
    category_id: null,
    product_type_id: null,
    quantity: null,
    measurement: null,
    price: null,
    totalSum: null,
  });
};

const deleteConsumption = (index: number) => {
  in_products.value.splice(index, 1);
};

const fetchVidProductsList = async (item: any, index: number) => {
  vidProducts.value[index] = await settingsStore.GET_VID_PRODUCT({
    parent_id: item.category_id,
    per_page: 100,
  });
};

const changeProduct = async (item: any, index: number) => {
  const activeVidProduct = vidProducts.value[index].product_types.find(el => el.id == item.product_type_id);
  if (activeVidProduct) {
    item.measurement = activeVidProduct.unit;
    item.price = activeVidProduct.price || 0;
    item.totalSum = activeVidProduct.totalSum || 0;
  }
};

// results

const addResult = () => {
  out_products.value.push({
    category_id: null,
    product_type_id: null,
    quantity: null,
    measurement: null,
    price: null,
    totalSum: null,
  });
};

const deleteResult = (index: number) => {
  out_products.value.splice(index, 1);
};

const resultFetchVidProductsList = async (item: any, index: number) => {
  vidProductsResult.value[index] = await settingsStore.GET_VID_PRODUCT({
    parent_id: item.category_id,
    per_page: 100,
  });
};

const resultChangeProduct = (item: any, index: number) => {
  const data = vidProductsResult.value[index].product_types.find(el => el.id == item.product_type_id);
  if (data) {
    item.measurement = data.unit;
    item.price = data.price || 0;
    item.totalSum = data.totalSum || 0;
  }
};


const createFactory = async () => {
  try {
    confirm.factory({
      description: "Вы уверены, что хотите произвести переработку выбранных продуктов? Это действие необратимо.",
    }).then(() => {
      let factory_id = route.params.factory_id;
      if (factory_id) {
        store.createWorkshopUnpacking({
          in_products: in_products.value,
          out_products: out_products.value,
        }, factory_id as string).then(() => {
          router.go(-1);
          ElNotification({ title: "Success", type: "success" });
        });

      }
    });


  } catch (e) {
    ElNotification({ title: "Error", type: "error", message: "Failed to create factory." });
  }
};

const createFactoryMeals = async () => {
  try {
    confirm.factory({
      description: "Вы уверены, что хотите произвести переработку выбранных продуктов? Это действие необратимо.",
    }).then(() => {
      let factory_id = route.params.factory_id;
      if (factory_id) {
        store.createWorkshopUnpacking({
          in_products: settingsStore?.mealDetail?.compositions.map((item:any)=>{
            return {...item, quantity: item.quantity * quantity.value};
          }),
          out_products: meal_products.value,
        }, factory_id as string).then(() => {
          router.go(-1);
          ElNotification({ title: "Success", type: "success" });
        });

      }
    });


  } catch (e) {
    ElNotification({ title: "Error", type: "error", message: "Failed to create factory." });
  }
};

const districtId = computed(() => +route.params.district_id);

const productId = computed(() => +route.params.factory_id);

const selectedWorkshopType = computed(() => {
  for (const base of workshopsStore.managementBases) {
    const workshop = base.workshops.find(w => w.id === productId.value)
    if (workshop) return workshop.type
  }
  return null
})

const { setBreadCrumb } = useBreadcrumb();

const setBreadCrumbFn = async () => {

  store.getManagementWorkshop(districtId.value, productId.value);

  if (!store.activeManagementBase) return;

  setBreadCrumb([
    {
      label: "Цех",
    },
    {
      label: store.activeManagementBase?.name ?? "",
    },
    {
      label: store.activeManagementBase?.workshops?.name ?? "",
    },
    {
      label: "Переработка",
      isActionable: true,
    },
  ]);
};
let unit = ref('')
const getUnit = async (id: number) => {
  unit.value = settingsStore.meals.meals.find((el:any) => el.id == id).unit;
  await settingsStore.GET_MEALS_DETAIL(id, {per_page: 100})
}


const getQuantity = (quan: number) => {
  quantity.value = Number(quan);
}

watchEffect(() => {
  setBreadCrumbFn();
});

</script>

<template>
  <div v-if="selectedWorkshopType==='confectionery'">
    <!--    <div-->
    <!--      v-if="!!settingsStore.baseWarehouses?.base_warehouses.find((e) => e.id == route.query.id)?.workshop_name"-->
    <!--      class="flex items-center justify-between mb-[24px]"-->
    <!--    >-->
    <!--      <h1 class="text-[#000D24] font-semibold text-[32px]">-->
    <!--        {{ settingsStore.baseWarehouses?.base_warehouses.find((e) => e.id == route.query.id)?.workshop_name }}-->
    <!--      </h1>-->

    <!--      <button-->
    <!--        class="custom-light-btn"-->
    <!--        @click="router.go(-1)"-->
    <!--      >-->
    <!--        {{ settingsStore.baseWarehouses?.base_warehouses.find((e) => e.id == route.query.id)?.workshop_name }}-->
    <!--      </button>-->
    <!--    </div>-->

    <div>
      <h1 class="text-[#000D24] font-semibold text-[32px] mb-[24px]">
        {{ route.meta.title }}
      </h1>
    </div>
<!--      {{workshopsStore.managementBases}}-->
<!--    {{settingsStore.meals}}-->

    <!--------------------Результат-------------------->
    <h5 class="text-[18px] font-medium text-[#000D24]">Готовая продукция</h5>

    <div class="mt-[12px] bg-[#F8F9FC] rounded-[16px] py-[16px] px-[12px]">
      <div class="grid grid-cols-5 gap-4" v-for="(item2, index2) in meal_products" :key="index2">
        <AppSelect
          v-model="item2.meal_id"
          :items="settingsStore.meals.meals"
          item-value="id"
          item-label="name"
          :label="t('monitoring.dishes')"
          :placeholder="t('monitoring.dishes')"
          label-class="text-[#A8AAAE] text-xs font-medium"
          filterable
          @change="getUnit(item2.meal_id)"
          trigger="blur"
        />


        <app-input
          v-model="item2.quantity"
          :label="t('common.quantity')"
          label-class="text-[#A8AAAE] text-[12px]"
          @change="getQuantity(item2.quantity)"
        />

        <app-input
          disabled
          v-model="unit"
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
            :placeholder="item2.quantity && (item2.quantity * item2.price).toLocaleString()"
            class="w-full"
            disabled
            :label="t('common.totalSum')"
            label-class="text-[#A8AAAE] text-[12px]"
          />

          <button class="bg-[#E2E6F3] p-[10px] rounded-[8px] mt-2" @click="deleteResult(index2)"
                  v-if="out_products && out_products.length !== 1">
            <img src="@/assets/images/icons/delete.svg" alt="delete" />
          </button>
        </div>
      </div>

<!--      <button class="primary__btn" @click="addResult">-->
<!--        <img src="@/assets/images/icons/plus2.svg" alt="plus" class="mr-[4px]" />-->
<!--        Добавить еще-->
<!--      </button>-->
    </div>

    <div class="border border-[#F1F1F1] w-full my-[24px]" />
    <!----------------------Расход-------------------->
    <h5 class="text-[18px] font-medium text-[#000D24]">Исходные продукты</h5>

    <div class="mt-[12px] bg-[#F8F9FC] rounded-[16px] py-[16px] px-[12px]">
      <div class="grid grid-cols-5 gap-4" v-for="(item, index) in settingsStore?.mealDetail?.compositions??[{product_type_name:'', quantity:'', unit:'', price:''}]" :key="index">
        <app-input
          disabled
          v-model="item.product_type_name"
          :label="t('product.type')"
          label-class="text-[#A8AAAE] text-[12px]"
        />


        <app-input
          disabled
          :placeholder="item.quantity && (item.quantity * quantity).toLocaleString()"
          :label="t('common.quantity')"
          label-class="text-[#A8AAAE] text-[12px]"
        />

        <app-input
          disabled
          v-model="item.unit"
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
            :placeholder="item.quantity && (item.quantity * item.price).toLocaleString()"
            class="w-full"
            disabled
            :label="t('common.totalSum')"
            label-class="text-[#A8AAAE] text-[12px]"
          />

          <button
            v-if="in_products && in_products.length !== 1"
            class="bg-[#E2E6F3] p-[10px] rounded-[8px] mt-2"
            @click="deleteConsumption(index)"
          >
            <img src="@/assets/images/icons/delete.svg" alt="delete" />
          </button>
        </div>
      </div>

<!--      <button class="primary__btn" @click="addConsumption">-->
<!--        <img src="@/assets/images/icons/plus2.svg" alt="plus" class="mr-[4px]" />-->
<!--        Добавить еще-->
<!--      </button>-->
    </div>





    <div class="border border-[#F1F1F1] w-full my-[24px]" />

    <div class="flex items-center gap-4 justify-end">
      <button class="custom-light-btn" @click="router.go(-1)">Отменить</button>
      <button class="custom-apply-btn" @click="createFactoryMeals">Произвести</button>
    </div>
  </div>
  <div v-else>
    <!--    <div-->
    <!--      v-if="!!settingsStore.baseWarehouses?.base_warehouses.find((e) => e.id == route.query.id)?.workshop_name"-->
    <!--      class="flex items-center justify-between mb-[24px]"-->
    <!--    >-->
    <!--      <h1 class="text-[#000D24] font-semibold text-[32px]">-->
    <!--        {{ settingsStore.baseWarehouses?.base_warehouses.find((e) => e.id == route.query.id)?.workshop_name }}-->
    <!--      </h1>-->

    <!--      <button-->
    <!--        class="custom-light-btn"-->
    <!--        @click="router.go(-1)"-->
    <!--      >-->
    <!--        {{ settingsStore.baseWarehouses?.base_warehouses.find((e) => e.id == route.query.id)?.workshop_name }}-->
    <!--      </button>-->
    <!--    </div>-->

    <div>
      <h1 class="text-[#000D24] font-semibold text-[32px] mb-[24px]">
        {{ route.meta.title }}
      </h1>
    </div>
    <!----------------------Расход-------------------->
    <h5 class="text-[18px] font-medium text-[#000D24]">Исходные продукты</h5>

    <div class="mt-[12px] bg-[#F8F9FC] rounded-[16px] py-[16px] px-[12px]">
      <div class="grid grid-cols-6 gap-4" v-for="(item, index) in in_products" :key="index">
        <AppSelect
          v-model="item.category_id"
          :items="settingsStore.typeProduct.product_categories"
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
            :placeholder="item.quantity && (item.quantity * item.price).toLocaleString()"
            class="w-full"
            disabled
            :label="t('common.totalSum')"
            label-class="text-[#A8AAAE] text-[12px]"
          />

          <button
            v-if="in_products && in_products.length !== 1"
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
    <h5 class="text-[18px] font-medium text-[#000D24]">Готовая продукция</h5>

    <div class="mt-[12px] bg-[#F8F9FC] rounded-[16px] py-[16px] px-[12px]">
      <div class="grid grid-cols-6 gap-4" v-for="(item2, index2) in out_products" :key="index2">
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
            :placeholder="item2.quantity && (item2.quantity * item2.price).toLocaleString()"
            class="w-full"
            disabled
            :label="t('common.totalSum')"
            label-class="text-[#A8AAAE] text-[12px]"
          />

          <button class="bg-[#E2E6F3] p-[10px] rounded-[8px] mt-2" @click="deleteResult(index2)"
                  v-if="out_products && out_products.length !== 1">
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
      <button class="custom-apply-btn" @click="createFactory">Произвести</button>
    </div>
  </div>
</template>

<style scoped lang="scss">
.primary__btn {
  @apply bg-[white] border border-[#2E90FA] rounded-[8px] text-[#2E90FA] text-[12px] font-medium flex items-center justify-center px-[16px] py-[8px] mt-[20px]
}
</style>