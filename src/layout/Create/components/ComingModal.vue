<script setup lang="ts">
import AppInput from "@/components/ui/form/app-input/AppInput.vue";
import AppSelect from "@/components/ui/form/app-select/AppSelect.vue";
import { ref } from "vue";

const emit = defineEmits(["update:editModal"]);
const props = defineProps({
  editModal: {
    type: Boolean,
    default: false,
  },
});

const tableData = ref<TableData[]>([
  {
    id: 1,
    title: "Картофель",
    total_count: 80,
    measurement: "кг",
    price: "22 000 сум",
    sum: "1 760 000 сум",
  },
  {
    id: 1,
    title: "Картофель",
    total_count: 80,
    measurement: "кг",
    price: "22 000 сум",
    sum: "1 760 000 сум",
  },
  {
    id: 1,
    title: "Картофель",
    total_count: 80,
    measurement: "кг",
    price: "22 000 сум",
    sum: "1 760 000 сум",
  },
  {
    id: 1,
    title: "Картофель",
    total_count: 80,
    measurement: "кг",
    price: "22 000 сум",
    sum: "1 760 000 сум",
  },
]);

const closeModal = () => {
  emit("update:editModal", false);
};

const headerClass = (item) => {
  console.log(item);

  return "p-0";
};
</script>

<template>
  <el-dialog
    v-model="props.editModal"
    :show-close="false"
    class="w-[75%]"
    align-center
    :before-close="closeModal"
  >
    <template #header>
      <div class="text-center text-[#000000] font-bold text-[18px]">Создать приход</div>
    </template>

    <div class="flex">
      <div class="border-[#E2E6F3] bg-[#fff] border rounded-[15px] w-[60%] mr-0">
        <div class="px-[72px] pb-[150px]">
          <header class="flex items-center justify-center my-[24px] mb-6">
            <img src="@/assets/images/logo.svg" alt="logo">
            <div class="flex flex-col ml-3">
              <b class="text-[#000D24] text-lg">NKMK</b>
              <span class="text-[#CBCCCE]">Jamg‘armasi</span>
            </div>
          </header>
          <h1 class="text-[#000D24] font-bold text-[20px] text-center mb-[24px]">НАКЛАДНОЙ</h1>

          <div class="flex items-center mb-[8px]">
            <h1 class="text-[#4F5662] text-[14px] font-medium">Дата создания в системе:</h1>
            <span class="ml-2 text-[#A8AAAE] text-[14px] font-medium block">24.08.2024</span>
          </div>

          <div class="flex items-center mb-[24px]">
            <h1 class="text-[#4F5662] text-[14px] font-medium">№ накладной в системе:</h1>
            <span class="ml-2 text-[#A8AAAE] text-[14px] font-medium block">NK-00000</span>
          </div>

          <div class="flex items-center mb-[8px]">
            <h1 class="text-[#4F5662] text-[14px] font-medium">Дата накладной:</h1>
            <span class="ml-2 text-[#A8AAAE] text-[14px] font-medium block">24.08.2024</span>
          </div>

          <div class="flex items-center mb-[24px]">
            <h1 class="text-[#4F5662] text-[14px] font-medium">№ накладной:</h1>
            <span class="ml-2 text-[#A8AAAE] text-[14px] font-medium block">247</span>
          </div>

          <div class="flex items-center mb-[24px]">
            <h1 class="text-[#4F5662] text-[14px] font-medium">Вид документа:</h1>
            <span class="ml-2 text-[#A8AAAE] text-[14px] font-medium block">Входящий накладной</span>
          </div>

          <div class="flex items-center mb-[8px]">
            <h1 class="text-[#4F5662] text-[14px] font-medium">От кого:</h1>
            <span class="ml-2 text-[#A8AAAE] text-[14px] font-medium block">Руководитель группы отдела координации общественного питания</span>
          </div>

          <div class="flex items-center mb-[8px]">
            <h1 class="text-[#4F5662] text-[14px] font-medium">Кому:</h1>
            <span class="ml-2 text-[#A8AAAE] text-[14px] font-medium block">«Фонд НКМК» ДМ «Навоийской» областной администрации, руководитель комплекса общественного питания Баракаеву Д.</span>
          </div>

          <div class="flex items-center mb-[24px]">
            <h1 class="text-[#4F5662] text-[14px] font-medium">Через кого:</h1>
            <span class="ml-2 text-[#A8AAAE] text-[14px] font-medium block">«Фонд НКМК» ДМ «Навоийской» областной администрации, руководитель комплекса общественного питания Баракаеву Д.</span>
          </div>

          <div class="flex items-center mb-[8px]">
            <h1 class="text-[#4F5662] text-[14px] font-medium">Основание: </h1>
            <span class="ml-2 text-[#A8AAAE] text-[14px] font-medium block">Назначение №2392</span>
          </div>

          <div class="flex items-center mb-[24px]">
            <h1 class="text-[#4F5662] text-[14px] font-medium">Способ отправления:</h1>
            <span class="ml-2 text-[#A8AAAE] text-[14px] font-medium block">85 897 VAA</span>
          </div>

          <el-table :data="tableData" class="custom-element-table" header-cell-class-name="custom-cell-header"
                    cell-class-name="custom-cell-header">
            <el-table-column prop="title" label="Название" class="!p-0" />
            <el-table-column prop="total_count" label="Количество" />
            <el-table-column prop="measurement" label="Ед. измерения" />
            <el-table-column prop="price" label="Цена" />
            <el-table-column prop="sum" label="Сумма" />

          </el-table>


        </div>
      </div>

      <div class="w-[40%] ml-[24px] flex flex-col justify-between">
        <div>
          <app-input placeholder="Служебная записка" />

          <app-input placeholder="Дата создания документа" />

          <app-input placeholder="№ документа" />

          <app-input placeholder="Кому" />

          <app-input placeholder="Тема" />

          <app-input placeholder="Отображение сообщения служебки" type="textarea" :rows="5" />

          <app-select placeholder="Отправитель" />
        </div>

        <div class="flex items-start justify-between">
          <button class="custom-cancel-btn" @click="closeModal">Отменить</button>
          <button class="custom-apply-btn">Сохранить как черновик</button>
          <button class="custom-send-btn">Отправить</button>
        </div>
      </div>
    </div>
  </el-dialog>
</template>

<style lang="scss">
.custom-cell-header div {
  padding: 0 !important;
}
</style>
