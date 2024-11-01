<script
    setup
    lang="ts"
>
import { ref, watchEffect } from "vue";
import useBreadcrumb from "@/components/ui/app-breadcrumb/useBreadcrumb";
import useConfirm from "@/components/ui/app-confirm/useConfirm";

const { init } = useConfirm();

interface TableData {
  name: string;
  count: string;
  count2: string;
  cost: string;
  sum: string;
}

const tableData = ref<TableData[]>([
  {
    name: "Картофель",
    count: "80",
    count2: "кг",
    cost: "22 000 сум",
    sum: "1 760 000 сум"
  },
  {
    name: "Говядина",
    count: "30",
    count2: "кг",
    cost: "86 000 сум",
    sum: "1 700 000 сум"
  },
  {
    name: "Горох",
    count: "50",
    count2: "кг",
    cost: "34 000 сум",
    sum: "1 000 000 сум"
  },
  {
    name: "Морковь",
    count: "50",
    count2: "кг",
    cost: "20 000 сум",
    sum: "1 760 000 сум"
  }
]);

const { setBreadCrumb } = useBreadcrumb();

const setBreadCrumbFn = () => {
  setBreadCrumb([
    {
      label: "Документы"
    },
    {
      label: "Накладные"
    },
    {
      label: "Входящие",
      to: { name: "invoice-inbox" }
    },
    {
      label: "Просмотр",
      isActionable: true
    }
  ]);
};

watchEffect(() => {
  setBreadCrumbFn();
});

const accepted = () => {
  init({
    title: "Title",
    description: "description",
    buttons: [
      {
        status: "secondary",
        action: "cancel",
        label: "No"
      },
      {
        status: "primary",
        action: "confirm",
        label: "Yes"
      }
    ]
  });
};

</script>

<template>
  <div class="flex items-start justify-center">
    <div class="border-[#E2E6F3] border rounded-[15px] w-[55%] mr-0">
      <div class="px-[72px] pb-[70px]">
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
        <h1 class="text-[#000D24] font-bold text-[20px] text-center mb-[24px]">НАКЛАДНОЙ</h1>

        <div class="flex justify-between items-center">
          <div class="flex items-center mb-[8px]">
            <h1 class="text-[#4F5662] text-[14px] font-medium">Дата создания в системе:</h1>
            <span class="ml-2 text-[#A8AAAE] text-[14px] font-medium block">24.08.2024</span>
          </div>

          <!--pdf-->
          <div class="border rounded-lg py-[8px] px-[12px] flex items-start cursor-pointer">
            <img
                src="@/assets/images/icons/pdf2.svg"
                class="mr-[8px] mt-1"
                alt="pdf"
            >

            <div>
              <h3 class="mb-[4px] text-[#000D24] text-[14px] font-medium">Накладной документ</h3>
              <h4 class="text-[#A8AAAE] text-[12px]">PDF | 9.83 MB</h4>
            </div>
          </div>
          <!--pdf-->
        </div>

        <div class="flex items-center mb-[24px]">
          <h1 class="text-[#4F5662] text-[14px] font-medium">№ накладной в системе:</h1>
          <span class="ml-2 text-[#A8AAAE] text-[14px] font-medium block"> NK-00000</span>
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

        <div class="flex items-center mb-[24px]">
          <h1 class="text-[#4F5662] text-[14px] font-medium">От кого:</h1>
          <span class="ml-2 text-[#A8AAAE] text-[14px] font-medium block">Руководитель группы отдела координации общественного питания</span>
        </div>
        <div class="flex items-baseline mb-[8px]">
          <h1 class="text-[#4F5662] text-[14px] font-medium">Кому:</h1>
          <span class="ml-2 text-[#A8AAAE] text-[14px] font-medium block">«Фонд НКМК» ДМ «Навоийской» областной администрации, руководитель комплекса общественного питания Баракаеву Д.</span>
        </div>
        <div class="flex items-baseline mb-[24px]">
          <h1 class="text-[#4F5662] text-[14px] font-medium">Через кого:</h1>
          <span class="ml-2 text-[#A8AAAE] text-[14px] font-medium block">«Фонд НКМК» ДМ «Навоийской» областной администрации, руководитель комплекса общественного питания Баракаеву Д.</span>
        </div>

        <div class="flex items-center mb-[14px]">
          <h1 class="text-[#4F5662] text-[14px] font-medium">Основание:</h1>
          <span class="ml-2 text-[#A8AAAE] text-[14px] font-medium block">Назначение №2392</span>
        </div>
        <div class="flex items-center mb-[24px]">
          <h1 class="text-[#4F5662] text-[14px] font-medium">Способ отправления:</h1>
          <span class="ml-2 text-[#A8AAAE] text-[14px] font-medium block">85 897 VAA</span>
        </div>

        <el-table
            :data="tableData"
            stripe
            class="custom-element-table custom-element-table--has-append"
        >
          <el-table-column
              prop="name"
              label="Название"
          />
          <el-table-column
              prop="count"
              label="Количество"
          />
          <el-table-column
              prop="count2"
              label="Ед. измерения"
          />
          <el-table-column
              prop="cost"
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
        <ElButton
            class="flex ml-auto mt-5 px-10"
            type="primary"
            size="large"
            @click="accepted"
        >
          Принят
        </ElButton>
      </div>
    </div>

    <button class="custom-white-btn ml-[24px] w-[260px]">
      <img
          src="@/assets/images/icons/plane.svg"
          alt="plane"
          class="mr-[12px]"
      />
      Отправить
    </button>
  </div>
</template>
