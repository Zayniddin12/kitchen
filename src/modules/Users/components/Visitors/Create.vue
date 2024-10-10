<script
  setup
  lang="ts"
>
import { ref, watchEffect } from "vue";
import { useRouter } from "vue-router";
import useBreadcrumb from "@/components/ui/app-breadcrumb/useBreadcrumb";
import AppDatePicker from "@/components/ui/form/app-date-picker/AppDatePicker.vue";
import AppInput from "@/components/ui/form/app-input/AppInput.vue";

interface CreateBtn {
  title: string;
  icon: string;
}

const router = useRouter();

const createBtn = ref<CreateBtn[]>([
  {
    title: "ПИНФЛ",
    icon: "pinFl",
    value: 0,
  },
  {
    title: "Серия и номер паспорта",
    icon: "seria",
    value: 1,
  },
]);
const search = ref<string>("");

const activeTab = ref<number>(0);
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
      label: "Добавить",
      isActionable: true,
    },
  ]);
};

watchEffect(() => {
  setBreadCrumbFn();
});

const setActiveTab = (item: any) => {
  activeTab.value = item.value;
};
</script>

<template>
  <div>
    <h1 class="m-0 font-semibold text-[32px]">Добавить</h1>

    <div class="flex items-center gap-6 justify-center mt-[50px]">
      <div class="app-tabs">
        <div
          v-for="item in createBtn"
          :key="item.value"
          class="cursor-pointer flex items-center"
          :class="['app-tab', {'app-tab--active': activeTab === item.value}]"
          @click="setActiveTab(item)"
        >
          <svg
            :data-src="'/sidebar/' + item.icon + '.svg'"
            width="20px"
            height="20px"
            class="mr-[8px]"
          />
          {{ item.title }}
        </div>
      </div>
    </div>

    <div class="w-[370px] m-auto">
      <div class="border  rounded-[24px] p-[24px] my-[16px]">
        <app-input
          placeholder="Введите"
          label="ПИНФЛ"
          label-class="text-[#A8AAAE]"
        />

        <app-date-picker
          v-if="activeTab === 1"
          label="Дата рождения"
          placeholder="дд.мм.гггг"
          label-class="text-[#A8AAAE]"
        />
      </div>

      <button
        class="custom-apply-btn ml-auto"
        @click="router.push('/visitors-create-form')"
      >
        Найти
      </button>
    </div>
  </div>
</template>

<style lang="scss">
.create-form {
  .el-input-group__prepend {
    background-color: transparent;
  }

  .el-input-group__append {
    color: #FFFFFF;
    background-color: #2E90FA;
  }
}
</style>