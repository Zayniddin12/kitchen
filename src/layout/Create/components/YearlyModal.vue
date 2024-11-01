<script
    setup
    lang="ts"
>
import AppInput from "@/components/ui/form/app-input/AppInput.vue";
import AppSelect from "@/components/ui/form/app-select/AppSelect.vue";
import AppDatePicker from "@/components/ui/form/app-date-picker/AppDatePicker.vue";
import { ref } from "vue";
import useConfirm from "@/components/ui/app-confirm/useConfirm";
import { ModalPropsType, ModalValueType } from "@/layout/Create/components/modal.types";

const model = defineModel<ModalValueType>();

const props = defineProps<ModalPropsType>();

interface TableData {
  id: number;
  title: string;
  total_count: number;
  measurement: string;
  price: string;
  sum: string;
}

const tableData = ref<TableData[]>([
  {
    id: 1,
    title: "Картофель",
    total_count: 80,
    measurement: "кг",
    price: "22 000 сум",
    sum: "1 760 000 сум"
  },
  {
    id: 1,
    title: "Картофель",
    total_count: 80,
    measurement: "кг",
    price: "22 000 сум",
    sum: "1 760 000 сум"
  },
  {
    id: 1,
    title: "Картофель",
    total_count: 80,
    measurement: "кг",
    price: "22 000 сум",
    sum: "1 760 000 сум"
  },
  {
    id: 1,
    title: "Картофель",
    total_count: 80,
    measurement: "кг",
    price: "22 000 сум",
    sum: "1 760 000 сум"
  }
]);

const { confirm } = useConfirm();

const closeModal = () => {
  // Let it come out when the form changes
  confirm.cancel({ disabledBody: true }).then((response) => {
    model.value = false;
  });
};
</script>

<template>
  <el-dialog
      v-model="model"
      :show-close="false"
      class="w-[70%]"
      align-center
      :before-close="closeModal"
  >
    <template #header>
      <div class="text-center text-[#000000] font-bold text-[18px]">Создать запрос годовой запрос</div>
    </template>

    <div class="flex">
      <div class="border-[#E2E6F3] bg-[#fff] border rounded-[15px] w-[65%] mr-0">
        <div class="px-[72px] pb-[150px]">
          <header class="flex items-center justify-center my-[24px] mb-6">
            <img
                src="@/assets/images/logo.svg"
                alt="logo"
            >
            <div class="flex flex-col ml-3">
              <b class="text-[#000D24] text-lg">NKMK</b>
              <span class="text-[#CBCCCE]">Jamg‘armasi</span>
            </div>
          </header>
          <h1 class="text-[#000D24] font-bold text-[20px] text-center mb-[24px]">ЗАПРОС</h1>

          <div class="flex items-center mb-[8px]">
            <h1 class="text-[#4F5662] text-[14px] font-semibold">Дата:</h1>
            <span class="ml-2 text-[#A8AAAE] text-[14px] font-medium block">24.08.2024</span>
          </div>

          <div class="flex items-center mb-[24px]">
            <h1 class="text-[#4F5662] text-[14px] font-semibold">№:</h1>
            <span class="ml-2 text-[#A8AAAE] text-[14px] font-medium block">04-04-01/463</span>
          </div>

          <div class="flex items-baseline mb-[24px]">
            <h1 class=" text-[14px] font-medium">
              <span class="text-[#4F5662] font-semibold">Получатель: </span>
              <span class="text-[#A8AAAE] ml-2">«Фонд НКМК» ДМ «Навоийской» областной администрации, руководитель комплекса общественного питания Баракаеву Д.</span>
            </h1>
          </div>

          <div class="flex items-baseline mb-[24px]">
            <h1 class=" text-[14px] font-medium">
              <span class="text-[#4F5662] font-semibold">Тип запроса:</span>
              <span class="text-[#A8AAAE] ml-2">Полученные</span>
            </h1>
          </div>

          <div class="flex items-center mb-[24px]">
            <h1 class="text-[#4F5662] text-[14px] font-semibold">Тема:</h1>
            <span class="ml-2 text-[#A8AAAE] text-[14px] font-medium block">О получении товара</span>
          </div>

          <div class="text-[#4F5662] text-[14px] mb-[24px]">
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 1000 кг перца сладкого свеженарезанного, выделенного у Вас в
            соответствии
            с договором № 3259031.1.1 от 31 июля
            2024 года, проведенным посредством электронных аукционов в августе текущего года, в целях обеспечения
            непрерывного питания продуктами лечебно-профилактического назначения. кормления и медико-санитарных больных
            просим получить до 23 августа доверенность от отдела ДМ «Фонд НКМК» на продукцию.
          </div>

          <el-table
              :data="tableData"
              stripe
              class="custom-element-table"
              header-cell-class-name="custom-cell-header"
              cell-class-name="custom-cell-header"
          >
            <el-table-column
                prop="title"
                label="Название"
                class="!p-0"
            />
            <el-table-column
                prop="total_count"
                label="Количество"
            />
            <el-table-column
                prop="measurement"
                label="Ед. измерения"
            />
            <el-table-column
                prop="price"
                label="Цена"
            />
            <el-table-column
                prop="sum"
                label="Сумма"
            />

            <template #append>
              <div class="flex items-center justify-end p-4">
                <h1 class="text-[#8F9194] text-[14px] font-bold mr-[5px]">Общая сумма: </h1>
                <h1 class="text-[#000D24] text-[14px] font-bold mr-5">7 040 000 сум</h1>
              </div>
            </template>

          </el-table>

          <div class="mt-[40px] flex items-center justify-between">
            <div class="flex items-baseline mb-[24px] w-[200px]">
              <h1 class=" text-[14px] font-medium">
                <span class="text-[#4F5662] font-semibold">Отправитель:</span>
                <span class="text-[#A8AAAE] ml-2">Руководитель группы отдела координации общественного питания</span>
              </h1>
            </div>

            <img
                src="@/assets/images/icons/qr.svg"
                alt="qr"
            />

            <h1 class="text-[#A8AAAE] text-[14px] mr-[100px]">Эргашева Л.</h1>
          </div>
        </div>
      </div>

      <div class="w-[35%] ml-[24px] flex flex-col justify-between">
        <div>
          <app-input
              placeholder="Накладние"
              label="Накладние"
              label-class="text-[#A8AAAE] text-[12px] font-medium"
          />

          <app-input placeholder="Z 04-04-01/463"/>

          <app-date-picker placeholder="24.08.2024"/>

          <app-select
              placeholder="Получатель"
              label="Получатель"
              label-class="text-[#A8AAAE] text-[12px] font-medium"
          />

          <app-input
              placeholder="Полученные"
              label="Полученные"
              label-class="text-[#A8AAAE] text-[12px] font-medium"
          />

          <app-input
              placeholder="Тема"
              label="Тема"
              label-class="text-[#A8AAAE] text-[12px] font-medium"
          />

          <app-input
              placeholder="Содержание запроса"
              type="textarea"
              :rows="5"
              label="Содержание запроса"
              label-class="text-[#A8AAAE] text-[12px] font-medium"
          />

        </div>

        <div class="bg-[#FFFFFF] rounded-[8px] p-[12px] mb-[24px]">
            <span class="block text-[#4F5662] text-[14px] font-medium mb-[16px]">
                Таблица получаемых продуктов
            </span>

          <app-select
              placeholder="Тип продукта"
              label="Тип продукта"
              label-class="text-[#A8AAAE] text-[12px] font-medium"
          />

          <app-select
              placeholder="Вид продукта"
              label="Вид продукта"
              label-class="text-[#A8AAAE] text-[12px] font-medium"
          />

          <app-input
              placeholder="Количество"
              label="Количество"
              label-class="text-[#A8AAAE] text-[12px] font-medium"
          />

          <app-input
              placeholder="Ед. измерения"
              label="Ед. измерения"
              label-class="text-[#A8AAAE] text-[12px] font-medium"
          />

          <app-input
              placeholder="Цена"
              label="Цена"
              label-class="text-[#A8AAAE] text-[12px] font-medium"
          />

          <app-input
              placeholder="Сумма"
              label="Сумма"
              label-class="text-[#A8AAAE] text-[12px] font-medium"
          />
          <app-input
              placeholder="Отображение итого суммы полученных продуктов"
              label="Отображение итого суммы полученных продуктов"
              label-class="text-[#A8AAAE] text-[12px] font-medium"
          />

          <button
              class="flex items-center justify-center gap-3 border-[1px] border-[#2E90FA] rounded-[8px] w-full text-[#2E90FA] text-[14px] font-medium py-[10px]"
          >
            <li
                :style="{
                  maskImage: 'url(/icons/plusIcon.svg)',
                  backgroundColor: '#2E90FA',
                  color: '#2E90FA',
                  width: '20px',
                  height: '20px',
                  maskSize: '20px',
                  maskPosition: 'center',
                  maskRepeat: 'no-repeat'
                   }"
            ></li>
            Добавить
          </button>


        </div>

        <div>
          <app-input
              placeholder="Отправитель"
              label="Отправитель"
              label-class="text-[#A8AAAE] text-[12px] font-medium"
          />
        </div>

        <div class="flex items-start justify-between">
          <button
              class="custom-cancel-btn"
              @click="closeModal"
          >Отменить
          </button>
          <button class="custom-apply-btn">Сохранить как черновик</button>
          <button class="custom-send-btn">Отправить</button>
        </div>
      </div>
    </div>
  </el-dialog>
</template>
