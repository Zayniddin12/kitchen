<script
  setup
  lang="ts"
>
import { ref, watchEffect } from "vue";
import { useRoute, useRouter } from "vue-router";
import useBreadcrumb from "@/components/ui/app-breadcrumb/useBreadcrumb";

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

const { setBreadCrumb } = useBreadcrumb();

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
      label: "Просмотр",
      isActionable: true,
    },
  ]);
};

watchEffect(() => {
  setBreadCrumbFn();
});

</script>

<template>
  <div>
    <h1 class="m-0 font-semibold text-[32px]">Просмотр</h1>

    <div class="flex items-center justify-between">
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

      <button
        class="custom-cancel-btn flex items-center"
        @click="router.push(`/visitors-edit-form/${route.params.id}`)"
      >
        <img
          src="@/assets/images/icons/edit.svg"
          alt="edit"
          class="mr-[8px]"
        />
        Редактировать
      </button>
    </div>

    <div
      class="border rounded-[24px] pb-[32px] overflow-hidden"
      v-if="activeTab === 0"
    >
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
        <div class="bg-gray-50 p-6 rounded-[16px] ">
          <h3 class="text-gray-500 mb-4">Основная информация</h3>
          <div class="grid grid-cols-2 gap-8">
            <!-- Left Column -->
            <div>
              <div class="mb-4">
                <span class="text-blue-500">Дата рождения:</span>
                <p>22.08.1987</p>
              </div>
              <div class="mb-4">
                <span class="text-blue-500">Пол:</span>
                <p>Мужской</p>
              </div>
              <div class="mb-4">
                <span class="text-blue-500">Кем выдан:</span>
                <p>Бостонликский район Ташкентской области ИИБ</p>
              </div>
              <div class="mb-4">
                <span class="text-blue-500">Срок действия:</span>
                <p>25.04.2013</p>
              </div>
              <div class="mb-4">
                <span class="text-blue-500">Номер телефона:</span>
                <p>+998 99 000 00 00</p>
              </div>
              <div class="mb-4">
                <span class="text-blue-500">OneID:</span>
                <p>—</p>
              </div>
              <div class="mb-4">
                <span class="text-blue-500">Роли:</span>
                <p>—</p>
              </div>
            </div>

            <!-- Right Column -->
            <div>
              <div class="mb-4">
                <span class="text-blue-500">Национальность:</span>
                <p>22.08.1987</p>
              </div>
              <div class="mb-4">
                <span class="text-blue-500">Серия и номер паспорта:</span>
                <p>AB 0000000</p>
              </div>
              <div class="mb-4">
                <span class="text-blue-500">Дата выпуска:</span>
                <p>25.04.2003</p>
              </div>
              <div class="mb-4">
                <span class="text-blue-500">ПИНФЛ:</span>
                <p>54236987424856</p>
              </div>
              <div class="mb-4">
                <span class="text-blue-500">Должность в системе:</span>
                <p>—</p>
              </div>
            </div>
          </div>
        </div>

        <div class="bg-gray-50 p-6 mt-[24px] rounded-[16px]">
          <h3 class="text-gray-500 mb-4">История сотрудника</h3>

          <div class="p-[16px] rounded-[8px] border mb-[16px]">
            Здесь будет текст
          </div>

          <div class="grid grid-cols-2 gap-8">
            <div>
              <span class="text-blue-500 mb-[4px] block">Дата и время изменения:</span>
              <p>28.09.2024</p>
            </div>

            <div>
              <span class="text-blue-500 mb-[4px] block">Кто внес изменение:</span>
              <p>Админ: Олимов М.</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div
      class="border rounded-[24px] py-[32px] px-[24px] w-[50%] m-auto relative group"
      v-else
    >
      <button class="absolute top-2 left-2 opacity-0 group-hover:opacity-100 edit__btn transition-opacity duration-300 bg-blue-500 text-white px-4 py-2 rounded-lg">
        Изменить фото
      </button>
      <img
        src="@/assets/images/bigMan.png"
        class="w-full group-hover:filter group-hover:brightness-50 transition duration-300 rounded-lg"
        alt="bigMan"
      />
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