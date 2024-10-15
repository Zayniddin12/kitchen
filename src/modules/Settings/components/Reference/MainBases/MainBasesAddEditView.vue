<script
  setup
  lang="ts"
>
import { ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import AppInput from "@/components/ui/form/app-input/AppInput.vue";
import AppSelect from "@/components/ui/form/app-select/AppSelect.vue";
import useBreadcrumb from "@/components/ui/app-breadcrumb/useBreadcrumb";

const route = useRoute();
const router = useRouter();

const input1 = ref<string>("");
const tableData = ref([
  {
    id: 1,
    name: "Овощи",
  },
  {
    id: 2,
    name: "Фрукты",
  },
]);

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
      label: "Управ, комбинаты и склады",
      to: { name: "reference" },
    },

    {
      label: "Склады базы",
      to: { name: "reference-main-bases" },
    },
    {
      label: String(route?.meta?.breadcrumbItemTitle ?? ""),
      isActionable: true,
    },
  ]);
};

watch(() => route.name, () => {
  setBreadCrumbFn();
}, { immediate: true });

</script>

<template>
  <div>
    <div class="flex items-center justify-between mb-[24px]">
      <h1 class="m-0 font-semibold text-[32px] leading-[48px]">{{ route.meta.title }}</h1>

    </div>

    <div class="flex gap-6">
      <div class="w-[70%]">
        <div class="border border-[#E2E6F3] rounded-[24px] p-[24px] h-[65vh] flex flex-col">
          <div class="flex items-center gap-4">
            <app-input
              label="Наименование (RU)"
              placeholder="Введите"
              label-class="text-[#A8AAAE] font-medium text-[12px]"
              class="w-full"
            />

            <app-input
              label="Наименование (UZ)"
              placeholder="Введите"
              label-class="text-[#A8AAAE] font-medium text-[12px]"
              class="w-full"
            />

            <app-select
              label="База складов"
              placeholder="Введите"
              label-class="text-[#A8AAAE] font-medium text-[12px]"
              class="w-full"
            />
          </div>

          <div class="flex items-center gap-4">

            <app-input
              label="Вместимость склада"
              placeholder="Выберите"
              label-class="text-[#A8AAAE] font-medium text-[12px]"
              class="w-full"
            />

            <app-input
              label="Единица измерения"
              placeholder="тонна"
              label-class="text-[#A8AAAE] font-medium text-[12px]"
              class="w-full"
            />

            <app-select
              v-if="!route.query.type"
              label="Типы продуктов хранения"
              placeholder="Мясные"
              label-class="text-[#A8AAAE] font-medium text-[12px]"
              class="w-full"
            />
            <div
              v-if="route.query.type"
              class="w-full"
            ></div>

          </div>

          <div v-if="route.query.type == 'view'">
            <el-table
              :data="tableData"
              class="custom-element-table"
              stripe
            >
              <el-table-column
                prop="id"
                label="№"
                width="100"
              />
              <el-table-column
                prop="name"
                label="Наименование базы"
              />

            </el-table>
          </div>


          <ElSwitch
            v-if="route.params.id && !route.query.type"
            active-text="Деактивация"
            class="app-switch mt-auto"
          />
        </div>

        <div
          v-if="!route.query.type"
          class="flex items-center mt-[24px] "
          :class="!route.params.id ? 'justify-end' : 'justify-between'"
        >
          <button
            v-if="route.params.id"
            class="custom-danger-btn"
          >
            Удалить
          </button>


          <div class="flex items-center gap-4">
            <button class="custom-cancel-btn">
              Отменить
            </button>

            <button class="custom-apply-btn">
              {{ $route.params.id ? "Сохранить" : "Добавить" }}
            </button>
          </div>
        </div>
      </div>

      <div class="w-[30%]">
        <button
          @click="router.push({name: 'reference-main-bases-edit', params: {id: 1}})"
          v-if="route.query.type == 'view'"
          class="flex items-center gap-4 bg-[#F8F9FC] py-[10px] px-[20px] rounded-[8px]"
        >
          <li
            :style="{
                  maskImage: 'url(/icons/edit.svg)',
                  backgroundColor: '#8F9194',
                  color: '#8F9194',
                  width: '20px',
                  height: '20px',
                  maskSize: '20px',
                  maskPosition: 'center',
                  maskRepeat: 'no-repeat'
                   }"
          ></li>
          Редактировать
        </button>
      </div>
    </div>
  </div>
</template>

