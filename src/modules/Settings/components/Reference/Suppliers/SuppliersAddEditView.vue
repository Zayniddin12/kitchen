<script
  setup
  lang="ts"
>
import { ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import AppInput from "@/components/ui/form/app-input/AppInput.vue";
import useBreadcrumb from "@/components/ui/app-breadcrumb/useBreadcrumb";
import useConfirm from "@/components/ui/app-confirm/useConfirm";

const route = useRoute();
const router = useRouter();
const { confirm } = useConfirm();


interface TableData {
  id: number;
  name: string;
  type: string;
}

const input1 = ref<string>("");
const tableData = ref<TableData[]>([
  {
    id: 1,
    name: "Зарафшан",
    type: "Начальник управления",
  },
  {
    id: 2,
    name: "Зафаробод",
    type: "Начальник управления",
  },
  {
    id: 3,
    name: "Навои",
    type: "Начальник управления",
  },
  {
    id: 4,
    name: "Нуробод",
    type: "Начальник управления",
  },
  {
    id: 5,
    name: "Учкудук",
    type: "Начальник управления",
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
      label: "Поставщики и организации",
      to: { name: "reference" },
    },

    {
      label: "Поставщики",
      to: { name: "reference-suppliers" },
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

const cancelFn = () => {
  confirm.cancel().then(() => {
    router.push({ name: "reference-suppliers" });
  });
};

const deleteFn = () => {
  confirm.delete().then(() => {
    router.push({ name: "reference-suppliers" });
  });
};

const switchChange = () => {
  confirm.show().then(response => {

  });
};

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
            <app-input
              label="Наименование"
              placeholder="Введите"
              label-class="text-[#A8AAAE] font-medium text-[12px]"
              class="w-full"
            />

            <app-input
              label="Юр. адрес"
              placeholder="Введите"
              label-class="text-[#A8AAAE] font-medium text-[12px]"
              class="w-full"
            />
          </div>

          <div class="grid grid-cols-3 gap-4">
            <app-input
              label="ИНН"
              placeholder="Введите"
              label-class="text-[#A8AAAE] font-medium text-[12px]"
              class="w-full"
            />

            <app-input
              label="Номер лицензии"
              placeholder="Введите"
              label-class="text-[#A8AAAE] font-medium text-[12px]"
              class="w-full"
            />


            <app-input
              label="Сертификат"
              placeholder="Введите"
              label-class="text-[#A8AAAE] font-medium text-[12px]"
              class="w-full"
            />


            <app-input
              label="Срок сертификата"
              placeholder="Введите"
              label-class="text-[#A8AAAE] font-medium text-[12px]"
              class="w-full"
            />


            <app-input
              label="Руководитель"
              placeholder="Введите"
              label-class="text-[#A8AAAE] font-medium text-[12px]"
              class="w-full"
            />


            <app-input
              label="Контакты"
              placeholder="Введите"
              label-class="text-[#A8AAAE] font-medium text-[12px]"
              class="w-full"
            />
          </div>


          <ElSwitch
            v-if="route.params.id && !route.query.type"
            active-text="Деактивация"
            class="app-switch mt-auto"
            :before-change="switchChange"
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
            @click="deleteFn"
          >
            Удалить
          </button>


          <div class="flex items-center gap-4">
            <button
              @click="cancelFn"
              class="custom-cancel-btn"
            >
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
          @click="router.push({name: 'reference-suppliers-edit', params: {id: 1}})"
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

