<script
  setup
  lang="ts"
>
import { useRoute, useRouter } from "vue-router";
import AppInput from "@/components/ui/form/app-input/AppInput.vue";
import AppSelect from "@/components/ui/form/app-select/AppSelect.vue";
import { ref, watch } from "vue";
import useBreadcrumb from "@/components/ui/app-breadcrumb/useBreadcrumb";
import AppTimePicker from "@/components/ui/form/app-time-picker/AppTimePicker.vue";
import useConfirm from "@/components/ui/app-confirm/useConfirm";

interface TableData {
  id: string;
  name: string;
  unique: string;
}

const route = useRoute();
const router = useRouter();

interface Repeater {
  title: string;
  value: number;
}

const repeater = ref<Repeater[]>([{
  title: "",
  value: 0,
}]);
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
      to: { name: "reference-ration" },
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

const { confirm } = useConfirm();

const cancelFn = () => {
  confirm.cancel().then(response => {
    router.push({ name: "reference-ration" });
  });
};

const deleteFn = () => {
  confirm.delete().then(response => {
    router.push({ name: "reference-ration" });
  });
};

const switchChange = () => {
  confirm.show().then(response => {
    
  });
};

</script>

<template>
  <div>
    <h1 class="m-0 font-semibold text-[32px] leading-[48px]">{{ route.meta.title }}</h1>

    <div class="flex items-start mt-[24px]">
      <div class="w-[70%]">
        <div class="border rounded-[24px] p-[24px]">
          <div class="grid grid-cols-3 gap-5">
            <app-input
              label="Наименование (RU)"
              placeholder="Введите"
              label-class="text-[#A8AAAE] font-medium text-[12px]"
            />

            <app-input
              label="Наименование (UZ)"
              placeholder="Введите"
              label-class="text-[#A8AAAE] font-medium text-[12px]"
            />

            <app-input
              label="Уникальный номер рациона"
              placeholder="Введите"
              label-class="text-[#A8AAAE] font-medium text-[12px]"
              disabled
            />
          </div>

          <div class="grid grid-cols-3 gap-5">
            <app-select
              label="Тип кухни"
              placeholder="Выберите"
              label-class="text-[#A8AAAE] font-medium text-[12px]"
            />

            <div class="grid grid-cols-2">
              <app-time-picker
                type="time"
                label="Время начало"
                class="w-full"
                label-class="text-[#A8AAAE] font-medium text-[12px]"
              />

              <app-time-picker
                label="Время окончания"
                class="w-full ml-[8px]"
                label-class="text-[#A8AAAE] font-medium text-[12px]"
              />
            </div>

            <app-input
              label="Длительность"
              placeholder="Введите"
              label-class="text-[#A8AAAE] font-medium text-[12px]"
            />
          </div>

          <template v-if="route.name === 'reference-ration-view-id'">
            <el-table
              :data="tableData"
              class="custom-element-table mt-[40px]"
            >
              <el-table-column
                prop="id"
                label="Состав"
              />
              <el-table-column
                prop="name"
                label="Количество"
              />
              <el-table-column
                prop="unique"
                label="Ед. измерения"
              />
            </el-table>
          </template>

          <template v-else>
            <h1 class="text-[#000D24] text-[18px] font-medium mb-[12px]">Состав рациона</h1>

            <div
              class=" pb-3 bg-[#F8F9FC] rounded-[16px] px-[12px]"
              v-for="(index) in repeater"
              :key="index as any"
            >
              <div class="grid grid-cols-5 gap-5 border-b  py-[16px]">
                <app-select
                  label="Блюдо"
                  placeholder="Выберите"
                  label-class="text-[#A8AAAE] font-medium text-[12px]"
                />
                <app-select
                  label="Тип продукта"
                  placeholder="Выберите"
                  label-class="text-[#A8AAAE] font-medium text-[12px]"
                />
                <app-select
                  label="Вид продукта"
                  placeholder="Выберите"
                  label-class="text-[#A8AAAE] font-medium text-[12px]"
                />
                <app-input
                  label="Количество"
                  placeholder="0.0"
                  label-class="text-[#A8AAAE] font-medium text-[12px]"
                />
                <div class="flex items-center">
                  <app-input
                    label="Ед. измерения"
                    placeholder="Введите"
                    disabled
                    label-class="text-[#A8AAAE] font-medium text-[12px]"
                  />

                  <button
                    class="bg-[#E2E6F3] rounded-[8px] flex justify-center items-center h-[40px] w-[60px] ml-[16px] mt-2"
                    @click="handleDelete(index as any)"
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
              class="text-[#2E90FA] flex items-center border px-[16px] py-[8px] border-[#2E90FA] rounded-lg text-[12px] font-medium mt-[35px]"
              @click="repeaterAgain"
            >
              <img
                src="@/assets/images/icons/plus2.svg"
                class="mr-[4px]"
                alt="plus"
              />
              Добавить еще
            </button>

            <el-switch
              v-if="route.name === 'reference-ration-edit-id'"
              class="mt-[120px]"
              v-model="value"
              active-text="Деактивация"
              :before-change="switchChange"
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
            @click="deleteFn"
          >
            Удалить
          </button>

          <div class="flex items-center gap-4 ml-auto">
            <button
              class="custom-cancel-btn"
              @click="cancelFn"
            >Отменить
            </button>
            <button class="custom-apply-btn">
              {{ route.name === "reference-ration-edit-id" ? "Сохранить" : "Добавить" }}
            </button>
          </div>
        </div>
      </div>

      <button
        class="custom-light-btn flex items-center ml-[14px]"
        v-if="route.name === 'reference-ration-view-id'"
        @click="router.push(`/reference-ration-edit/${route.params.id}`)"
      >
        <img
          src="@/assets/images/icons/edit.svg"
          class="mr-[12px]"
          alt="edit"
        />
        Редактировать
      </button>
    </div>
  </div>
</template>
