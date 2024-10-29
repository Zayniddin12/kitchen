<script
  setup
  lang="ts"
>
import { computed, ref, watchEffect } from "vue";
import AppInput from "@/components/ui/form/app-input/AppInput.vue";
import AppDatePicker from "@/components/ui/form/app-date-picker/AppDatePicker.vue";
import AppSelect from "@/components/ui/form/app-select/AppSelect.vue";
import { useRoute, useRouter } from "vue-router";
import useBreadcrumb from "@/components/ui/app-breadcrumb/useBreadcrumb";
import AppMediaUploader from "@/components/ui/form/app-media-uploader/AppMediaUploader.vue";
import useConfirm from "@/components/ui/app-confirm/useConfirm";

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

const setActiveTab = (item: any) => {
  activeTab.value = item.value;
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

watchEffect(() => {
  setBreadCrumbFn();
});

const { confirm } = useConfirm();

const deleteFn = () => {
  confirm.delete().then(response => {
    router.push({ name: "visitors" });
  });
};

const cancelFn = () => {
  confirm.cancel().then(response => {
    router.push({ name: "visitors" });
  });
};

const switchChange = async (): Promise<boolean> => {
  try {
    const response = await confirm.show();
    return true;
  } catch (error) {
    return false;
  }
};

</script>

<template>
  <div>
    <h1 class="m-0 font-semibold text-[32px]">{{ title }}</h1>

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
                  src="@/assets/images/avatar.png"
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

            <app-input
                label="Номер телефона"
                label-class="text-[#A8AAAE] text-[12px] font-medium"
            />
          </div>

          <div class="grid grid-cols-2 gap-4 mt-[40px]">
            <app-select
                label="Место работы"
                label-class="text-[#A8AAAE] text-[12px] font-medium"
                placeholder="Выберите"
            />

            <app-select
                label="График работы"
                label-class="text-[#A8AAAE] text-[12px] font-medium"
                placeholder="Выберите"
            />
            <ElSwitch
                v-if="route.params.id && !route.query.type"
                active-text="Деактивация"
                class="app-switch mt-auto"
                :before-change="switchChange"
            />
          </div>
        </div>
      </template>

      <template v-else>
        <AppMediaUploader
          class="m-6"
          :height="633"
        />

      </template>
    </div>

    <div class="flex items-center justify-between mt-[24px]">
      <button
        v-if="route.params.id"
        @click="deleteFn"
        class="custom-danger-btn"
      >
        Удалить
      </button>
      <div class="flex items-center ml-auto">
        <button
          class="custom-cancel-btn"
          @click="cancelFn"
        >
          Отменить
        </button>
        <button class="custom-apply-btn ml-[8px]">
          {{ route.name === "visitors-edit-form-id" ? "Сохранить" : "Добавить" }}
        </button>
      </div>
    </div>
  </div>
</template>
