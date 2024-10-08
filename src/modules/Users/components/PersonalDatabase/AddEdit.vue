<script
  setup
  lang="ts"
>
import { computed, onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import AppInput from "@/components/ui/form/app-input/AppInput.vue";
import AppDatePicker from "@/components/ui/form/app-date-picker/AppDatePicker.vue";
import AppSelect from "@/components/ui/form/app-select/AppSelect.vue";

import useBreadcrumb from "@/components/ui/app-breadcrumb/useBreadcrumb";

const { setBreadCrumb } = useBreadcrumb();


interface Tabs {
  title: string;
  value: number;
}

const router = useRouter();
const route = useRoute();

const tabs = ref<Tabs[]>([
  {
    title: "Данные кандидата",
    value: 0,
  },
  {
    title: "Фотография для Face ID",
    value: 1,
  },
]);
const activeTab = ref<number>(0);

const setActiveTab = (item: any) => {
  activeTab.value = item.value;
};

const title = computed(() => {
  return  route.name === "personal-database-create-form" ? "Добавить" : "Редактировать"
})

const setBreadCrumbFn = () => {
  setBreadCrumb([
    {
      label: "Кадры",
    },
    {
      label: "База кадров",
      to: { name: "personal-database" },
    },
    {
      label:  title,
      isActionable: true,
    },
  ]);
};

onMounted(() => {
  setBreadCrumbFn();
});

</script>

<template>
  <div>
    <h1 class="m-0 font-semibold text-[32px]">
      {{ title }}
    </h1>

    <div class="app-tabs w-[345px] my-[24px]">
      <div
        v-for="item in tabs"
        :key="item.value"
        class="cursor-pointer"
        :class="['app-tab', {'app-tab--active': activeTab === item.value}]"
        @click="setActiveTab(item)"
      >
        {{ item.title }}
      </div>
    </div>

    <div class="border rounded-[24px] pb-[32px] overflow-hidden">
      <template v-if="activeTab === 0">
        <div class="py-[70px] bg-[#F8F9FC] px-[24px] relative">
          <div class="top-[32px] absolute flex items-center">
            <div class="rounded-full overflow-hidden border-4 border-gray-100">
              <img
                src="../../../../assets/images/avatar.png"
                alt="Profile Picture"
                class="object-cover h-[160px] w-[160px] rounded-full"
              >
            </div>

            <div class="text-xl font-semibold text-gray-900 ml-[24px]">
              Хамидов Иброхим Илхомович
            </div>
          </div>
        </div>

        <div class="px-[24px] mt-[90px]">
          <div class="grid grid-cols-3 gap-4">
            <app-input
              label="Фамилия"
              label-class="text-[#A8AAAE] text-[12px] font-medium"
            />

            <app-input
              label="Имя"
              label-class="text-[#A8AAAE] text-[12px] font-medium"
            />

            <app-input
              label="Отчество"
              label-class="text-[#A8AAAE] text-[12px] font-medium"
            />

            <app-date-picker
              placeholder=""
              label="Дата рождения"
              label-class="text-[#A8AAAE] text-[12px] font-medium"
            />

            <app-input
              label="Национальность"
              label-class="text-[#A8AAAE] text-[12px] font-medium"
            />

            <app-input
              label="Пол"
              label-class="text-[#A8AAAE] text-[12px] font-medium"
            />

            <app-input
              label="Серия и номер паспорта"
              label-class="text-[#A8AAAE] text-[12px] font-medium"
            />

            <app-input
              label="Кем выдан"
              label-class="text-[#A8AAAE] text-[12px] font-medium"
            />

            <app-date-picker
              label="Дата выпуска"
              placeholder=""
              label-class="text-[#A8AAAE] text-[12px] font-medium"
            />

            <app-date-picker
              label="Срок действия"
              placeholder=""
              label-class="text-[#A8AAAE] text-[12px] font-medium"
            />

            <app-input
              label="ПИНФЛ"
              label-class="text-[#A8AAAE] text-[12px] font-medium"
            />

            <div />
          </div>

          <div class="mt-[40px] grid grid-cols-3 gap-4">
            <app-input
              label="OneID (необязательно)"
              label-class="text-[#A8AAAE] text-[12px] font-medium"
            />

            <app-select
              label="Должность в системе(необязательно)"
              placeholder=""
              label-class="text-[#A8AAAE] text-[12px] font-medium"
            />

            <app-select
              label="Роли (необязательно)"
              placeholder=""
              label-class="text-[#A8AAAE] text-[12px] font-medium"
            />
          </div>
        </div>
      </template>

      <template v-else>
        <input
          type="file"
          id="inputFile"
          class="hidden"
        >
        <label
          for="inputFile"
          class="cursor-pointer bg-[#F8F9FC] rounded-[16px] border-dashed border border-gray-300 flex flex-col items-center justify-center p-10 h-[60vh]"
        >
          <img
            src="@/assets/images/icons/upload.svg"
            alt="upload"
          />

          <p class="text-gray-700 text-sm mt-[24px]">Перетащите фотографию для загрузки</p>
          <p class="text-gray-400 text-xs mb-[24px]">Максимальный размер фотографии 10 МБ</p>

          <div class="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600">
            Выбрать фото
          </div>
        </label>
      </template>
    </div>

    <div class="flex items-center justify-end mt-[24px]">
      <button
        class="custom-cancel-btn"
        @click="router.push('/personal-database')"
      >Отменить
      </button>
      <button class="custom-apply-btn ml-[8px]">Добавить</button>
    </div>
  </div>
</template>