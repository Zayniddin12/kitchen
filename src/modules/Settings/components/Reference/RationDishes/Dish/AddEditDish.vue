<script setup lang="ts">
import {onMounted, ref, watch} from "vue";
import {useRoute, useRouter} from "vue-router";
import AppInput from "@/components/ui/form/app-input/AppInput.vue";
import AppSelect from "@/components/ui/form/app-select/AppSelect.vue";
import useBreadcrumb from "@/components/ui/app-breadcrumb/useBreadcrumb";
import AppMediaUploader from "@/components/ui/form/app-media-uploader/AppMediaUploader.vue";
import useConfirm from "@/components/ui/app-confirm/useConfirm";
import {useSettingsStore} from "@/modules/Settings/store";

interface TableData {
  id: string;
  type: string;
  vid: string;
  count: string;
  count2: string;
}

interface Repeater {
  typeProduct: string;
  product_type_id: string;
  quantity: number;
  unit_id: string;
}

const store = useSettingsStore()
const route = useRoute();
const router = useRouter();
const {confirm} = useConfirm();
const {setBreadCrumb} = useBreadcrumb();
const setBreadCrumbFn = () => {
  setBreadCrumb([
    {
      label: "Настройки",
    },
    {
      label: "Справочники",
      to: {name: "reference"},
    },
    {
      label: "Рационы и блюда",
      to: {name: "reference"},
    },
    {
      label: "Блюда",
      to: {name: "reference-dish"},
    },
    {
      label: String(route?.meta?.breadcrumbItemTitle ?? ""),
      isActionable: true,
    },
  ]);
};

const repeater = ref<Repeater[]>([{
  typeProduct: '',
  product_type_id: "",
  quantity: 0,
  unit_id: '',
}]);
const dataValue = ref({
  name: {
    ru: '',
    uz: ''
  },
  number: '',
  quantity: '',
  unit_id: '',
  image: '',
})
const existingImage = ref<string>('')

const tableData = ref<TableData[]>([
  {
    id: "Картофель",
    type: "Овощи",
    vid: "Картофель",
    count: "0.1",
    count2: "кг",
  }
]);

onMounted(async() => {
  await store.GET_UNITS()
  await store.GET_TYPE_PRODUCT()
})

const repeaterAgain = () => {
  repeater.value.push({
    title: "",
    value: 0,
  });
};

const handleDelete = (index: number) => {
  if (repeater.value.length > 1) {
    confirm.delete().then(response => {
      repeater.value.splice(index, 1);
    });
  }
};

const cancelFn = () => {
  confirm.cancel().then(() => {
    router.push('/reference-dish');
  });
};

const deleteFn = () => {
  confirm.delete().then(() => {
    router.push('/reference-dish');
  });
};

const handleSubmit = () => {

}


watch(() => route.name, () => {
  setBreadCrumbFn();
}, {immediate: true});
</script>

<template>
  <div>
    <pre>{{repeater}}</pre>
    <h1 class="m-0 font-semibold text-[32px] leading-[48px]">{{ route.meta.title }}</h1>

    <div class="mt-[24px] flex items-start">
      <div class="w-[70%]">
        <div class="border rounded-[24px] p-[24px]">
          <AppMediaUploader
              v-model="dataValue.image"
              :value="existingImage"
              class="mt-4"
          />

          <div class="mt-[24px] grid grid-cols-2 gap-5">
            <app-input
                v-model="dataValue.name.ru"
                label="Наименование (RU)"
                placeholder="Введите"
                label-class="text-[#A8AAAE] text-[12px]"
            />

            <app-input
                v-model="dataValue.name.uz"
                label="Наименование (UZ)"
                placeholder="Введите"
                label-class="text-[#A8AAAE] text-[12px]"
            />


            <app-select
                v-model="dataValue.unit_id"
                label="Ед. измерения"
                placeholder="Выберите"
                label-class="text-[#A8AAAE] text-[12px]"
            />

            <app-input
                v-model="dataValue.number"
                label="Уникальный номер блюда"
                placeholder="Введите"
                label-class="text-[#A8AAAE] font-medium text-[12px]"
                disabled
            />
          </div>

          <template v-if="route.name === 'reference-view-id'">
            <el-table
                :data="tableData"
                stripe
                class="custom-element-table mt-[40px]"
            >
              <el-table-column
                  prop="id"
                  label="Состав"
              />
              <el-table-column
                  prop="count"
                  label="Количество"
              />
              <el-table-column
                  prop="count2"
                  label="Ед. измерения"
              />
            </el-table>
          </template>

          <template v-else>
            <div class="mt-[24px]">
              <h1 class="text-[#000D24] text-[18px] font-medium">Состав блюда</h1>

              <div class="bg-[#F8F9FC] rounded-[16px] p-[16px] mt-[24px]">
                <div
                    class="grid grid-cols-4 gap-4 border-b mt-[16px]"
                    v-for="(item, index) in repeater"
                    :key="index"
                >
                  <app-select
                      v-model="typeProduct"
                      label="Тип продукта"
                      label-class="text-[#A8AAAE] text-[12px]"
                      placeholder="Выберите"
                      itemValue="id"
                      itemLabel="name"
                      :items="store.typeProduct.product_categories"
                  />

                  <app-select
                      v-model="item.product_type_id"
                      label="Вид продукта"
                      label-class="text-[#A8AAAE] text-[12px]"
                      placeholder="Выберите"
                  />

                  <app-input
                      v-model="item.quantity"
                      label="Количество"
                      label-class="text-[#A8AAAE] text-[12px]"
                      placeholder="0.0"
                  />

                  <div class="flex items-center">
                    <app-select
                        v-model="item.unit_id"
                        label="Ед. измерения"
                        label-class="text-[#A8AAAE] text-[12px]"
                        placeholder="кг"
                        itemValue="id"
                        itemLabel="name"
                        :items="store.units.units"
                    />
                    <button
                        class="bg-[#E2E6F3] rounded-[8px] flex justify-center items-center h-[40px] w-[40px] ml-[16px] mt-2"
                        @click="handleDelete(index)"
                    >
                      <img
                          src="@/assets/images/icons/delete.svg"
                          alt="delete"
                      />
                    </button>
                  </div>
                </div>
              </div>

              <button
                  class="text-[#2E90FA] flex items-center border px-[16px] py-[8px] border-[#2E90FA] rounded-lg text-[12px] font-medium mt-[12px]"
                  @click="repeaterAgain"
              >
                <img
                    src="@/assets/images/icons/plus2.svg"
                    class="mr-[4px]"
                    alt="plus"
                />
                Добавить еще
              </button>
            </div>
          </template>
        </div>

        <div
            class="flex items-center justify-between mt-[24px]"
            v-if="route.name === 'reference-dish-create' || route.name === 'reference-dish-id'"
        >
          <button
              class="custom-danger-btn"
              v-if="route.name === 'reference-dish-id'"
              @click="deleteFn"
          >
            Удалить
          </button>

          <div class="flex items-center justify-end ml-auto">
            <button
                class="custom-cancel-btn"
                @click="cancelFn"
            >
              Отменить
            </button>

            <button class="custom-apply-btn ml-[8px]" @click="handleSubmit">
              {{ route.name === "reference-dish-id" ? "Сохранить" : "Добавить" }}
            </button>
          </div>
        </div>
      </div>

      <button
          class="custom-light-btn flex items-center ml-[24px]"
          v-if="route.name === 'reference-view-id'"
          @click="router.push(`/reference-dish-edit/${route.params.id}`)"
      >
        <img
            src="@/assets/images/icons/edit.svg"
            alt="edit"
            class="mr-[12px]"
        />
        Редактировать
      </button>
    </div>
  </div>
</template>

<style
    scoped
    lang="scss"
>
.edit__btn {
  @apply bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50
}
</style>