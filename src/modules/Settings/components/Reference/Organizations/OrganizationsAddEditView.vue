<script setup lang="ts">
import { ref, watch } from "vue";
import { Search } from "@element-plus/icons-vue";
import { useRoute, useRouter } from "vue-router";
import AppInput from "@/components/ui/form/app-input/AppInput.vue";
import AppSelect from "@/components/ui/form/app-select/AppSelect.vue";
import useBreadcrumb from "@/components/ui/app-breadcrumb/useBreadcrumb";

const route = useRoute();
const router = useRouter();


interface TableData {
  id: number;
  name: string;
  type: string;
}

const input1 = ref<string>("");

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
      label: "Поставщики и организации",
      to: { name: "reference" },
    },

    {
      label: "Организации",
      to: {name: "reference-organization"},
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
    <div class="flex items-center justify-between mb-[24px]">
      <h1 class="m-0 font-semibold text-[32px] leading-[48px]">{{ route.meta.title }}</h1>

    </div>

    <div class="flex gap-6">
      <div class="w-[70%]">
        <div class="border border-[#E2E6F3] rounded-[24px] p-[24px] h-[65vh] flex flex-col">
          <div class="grid grid-cols-2 gap-4">
            <app-input label="Наименование" placeholder="Введите"
                       label-class="text-[#A8AAAE] font-medium text-[12px]" class="w-full" />

            <app-input label="Юр. адрес" placeholder="Введите"
                       label-class="text-[#A8AAAE] font-medium text-[12px]" class="w-full" />
          </div>

          <div class="grid grid-cols-2 gap-4">
            <app-input label="ИНН" placeholder="Выберите"
                       label-class="text-[#A8AAAE] font-medium text-[12px]" class="w-full" />
            <span class="blo"></span>
          </div>


          <ElSwitch
            v-if="route.params.id && !route.query.type"
            active-text="Деактивация"
            class="app-switch mt-auto"
          />
        </div>

        <div v-if="!route.query.type" class="flex items-center mt-[24px] "
             :class="!route.params.id ? 'justify-end' : 'justify-between'">
          <button v-if="route.params.id" class="custom-danger-btn">
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
        <button @click="router.push({name: 'reference-organization-edit', params: {id: 1}})"
                v-if="route.query.type == 'view'"
                class="flex items-center gap-4 bg-[#F8F9FC] py-[10px] px-[20px] rounded-[8px]">
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

