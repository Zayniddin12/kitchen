<script setup lang="ts">
import { useRoute, useRouter } from "vue-router";
import AppInput from "@/components/ui/form/app-input/AppInput.vue";
import AppSelect from "@/components/ui/form/app-select/AppSelect.vue";
import { ref, watch } from "vue";
import useBreadcrumb from "@/components/ui/app-breadcrumb/useBreadcrumb";

interface TableData {
  id: string;
  name: string;
  unique: string;
}

const route = useRoute();
const router = useRouter();

const repeater = ref<[]>([{}]);
const value = ref<boolean>(true);
const tableData = ref<TableData[]>([
  {
    id: "Плов",
    name: "80",
    unique: "грамм",
  },
  {
    id: "Хлеб",
    name: "30",
    unique: "грамм",
  },
  {
    id: "Компот",
    name: "80",
    unique: "грамм",
  },
  {
    id: "Яйцо",
    name: "80",
    unique: "грамм",
  },
]);

const repeaterAgain = () => {
  repeater.value.push({});
};

const handleDelete = (index: number) => {
  if (repeater.value.length > 1) {
    repeater.value.splice(index, 1);
  }
};

const { setBreadCrumb } = useBreadcrumb();

const setBreadCrumbFn = () => {
  setBreadCrumb([
    {
      label: "Настройки",
    },
    {
      label: "Справочники",
      to: { name: "reference" },
    },
    {
      label: "Рационы и блюда",
      to: { name: "reference" },
    },
    {
      label: "Рационы",
      to: {name: "reference-ration"},
    },
    {
      label: String(route?.meta?.breadcrumbItemTitle ?? ""),
      isActionable: true,
    },
  ]);
};

watch(() => route.name, () => {
  setBreadCrumbFn();
}, {immediate: true});

</script>

<template>
  <div>
    <h1 class="m-0 font-semibold text-[32px] leading-[48px]">{{ route.meta.title }}</h1>

    <div class="flex items-start mt-[24px]">
      <div class="w-[90%]">
        <div class="border rounded-[24px] p-[24px]">
          <div class="grid grid-cols-2 gap-5">
            <app-input
              label="Наименование (RU)" placeholder="Введите"
              label-class="text-[#A8AAAE] font-medium text-[12px]"
            />

            <app-input
              label="Наименование (RU)" placeholder="Введите"
              label-class="text-[#A8AAAE] font-medium text-[12px]"
            />
          </div>

          <div class="grid grid-cols-3 gap-5">
            <app-input
              label="Уникальный номер рациона" placeholder="Введите"
              label-class="text-[#A8AAAE] font-medium text-[12px]"
            />

            <app-select label="Тип кухни" placeholder="Выберите" label-class="text-[#A8AAAE] font-medium text-[12px]" />

            <app-input label="Длительность" placeholder="Введите"
                       label-class="text-[#A8AAAE] font-medium text-[12px]" />
          </div>

          <template v-if="route.name === 'reference-ration-view-id'">
            <el-table :data="tableData" class="custom-element-table mt-[40px]">
              <el-table-column prop="id" label="Состав" />
              <el-table-column prop="name" label="Количество" />
              <el-table-column prop="unique" label="Ед. измерения" />
            </el-table>
          </template>

          <template v-else>
            <h1 class="text-[#000D24] text-[18px] font-medium mb-[28px]">Состав рациона</h1>

            <div
              class="grid grid-cols-5 gap-5 border-b pb-3 mt-[16px]"
              v-for="(item, index) in repeater"
              :key="index"
            >
              <app-select label="Блюдо" placeholder="Выберите" label-class="text-[#A8AAAE] font-medium text-[12px]" />
              <app-select label="Тип продукта" placeholder="Выберите"
                          label-class="text-[#A8AAAE] font-medium text-[12px]" />
              <app-select label="Вид продукта" placeholder="Выберите"
                          label-class="text-[#A8AAAE] font-medium text-[12px]" />
              <app-input label="Количество" placeholder="0.0" label-class="text-[#A8AAAE] font-medium text-[12px]" />
              <div class="flex items-center">
                <app-input label="Ед. измерения" placeholder="Введите"
                           label-class="text-[#A8AAAE] font-medium text-[12px]" />
                <button
                  class="custom-cancel-btn ml-[16px] mt-2"
                  @click="handleDelete(index)"
                >
                  <img src="@/assets/images/icons/delete.svg" alt="delete" />
                </button>
              </div>
            </div>

            <button
              class="text-[#2E90FA] flex items-center border px-[16px] py-[8px] border-[#2E90FA] rounded-lg text-[12px] font-medium mt-[35px]"
              @click="repeaterAgain"
            >
              <img src="@/assets/images/icons/plus2.svg" class="mr-[4px]" alt="plus" />
              Добавить еще
            </button>

            <el-switch
              v-if="route.name === 'reference-ration-edit-id'"
              class="mt-[120px]"
              v-model="value"
              active-text="Деактивация"
            />
          </template>
        </div>

        <div
          class="mt-[24px] flex items-center justify-between"
          v-if="route.name === 'reference-ration-edit-id' || route.name === 'reference-ration-create'"
        >
          <button
            class="custom-danger-btn"
            v-if="route.name === 'reference-ration-edit-id'"
          >
            Удалить
          </button>

          <div class="flex items-center gap-4 ml-auto">
            <button class="custom-cancel-btn" @click="router.go(-1)">Отменить</button>
            <button class="custom-apply-btn">Добавить</button>
          </div>
        </div>
      </div>

      <button
        class="custom-cancel-btn flex items-center ml-[14px]"
        v-if="route.name === 'reference-ration-view-id'"
        @click="router.push(`/reference-ration-edit/${route.params.id}`)"
      >
        <img src="@/assets/images/icons/edit.svg" class="mr-[12px]" alt="edit" />
        Редактировать
      </button>
    </div>
  </div>
</template>
