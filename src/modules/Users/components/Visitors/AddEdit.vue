<script
  setup
  lang="ts"
>
import { computed, onMounted, ref } from "vue";
import AppInput from "@/components/ui/form/app-input/AppInput.vue";
import AppDatePicker from "@/components/ui/form/app-date-picker/AppDatePicker.vue";
import AppSelect from "@/components/ui/form/app-select/AppSelect.vue";
import { useRoute, useRouter } from "vue-router";
import useBreadcrumb from "@/components/ui/app-breadcrumb/useBreadcrumb";

interface Tabs {
  title: string;
  value: number;
}

const router = useRouter();
const route = useRoute();

const activeTab = ref<number>(0);
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
let user_photo_new = ref<string>("");

const setActiveTab = (item: any) => {
  activeTab.value = item.value;
};

const previewImage = (event: any) => {
  const input = event.target;
  if (input.files && input.files[0]) {
    const reader = new FileReader();
    reader.onload = (e) => {
      user_photo_new.value = e.target.result as any;
    };
    reader.readAsDataURL(input.files[0]);
  }
};

const { setBreadCrumb } = useBreadcrumb();

const title = computed<string>(() => {
  return route.name === "visitors-create-form" ? "Добавить" : "Редактировать";
});

const setBreadCrumbFn = () => {
  setBreadCrumb([
    {
      label: "Кадры",
    },
    {
      label: "Посетители",
      to: { name: "visitors" },
    },
    {
      label: title.value,
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
      {{ title }}</h1>

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

          <div class="grid grid-cols-2 gap-4 mt-[40px]">
            <app-select
              label="Место работы (необязательно)"
              label-class="text-[#A8AAAE] text-[12px] font-medium"
              placeholder="Выберите"
            />

            <app-select
              label="График работы (необязательно)"
              label-class="text-[#A8AAAE] text-[12px] font-medium"
              placeholder="Выберите"
            />
          </div>
        </div>
      </template>

      <template v-else>
        <div
          class="rounded-[24px] py-[32px] px-[24px] w-[50%] flex justify-center m-auto relative group"
          v-if="user_photo_new"
        >
          <img
            :src="user_photo_new"
            alt="#"
          />
        </div>

        <template v-else>
          <input
            type="file"
            class="hidden"
            id="fileInput"
            @change="previewImage"
          />
          <label
            for="fileInput"
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
      </template>
    </div>

    <div class="flex items-center justify-end mt-[24px]">
      <button
        class="custom-cancel-btn"
        @click="router.push('/visitors')"
      >Отменить
      </button>
      <button class="custom-apply-btn ml-[8px]">Добавить</button>
    </div>
  </div>
</template>
