<script
    setup
    lang="ts"
>
import { computed, onMounted, ref } from "vue";
import AppInput from "@/components/ui/form/app-input/AppInput.vue";
import useBreadcrumb from "@/components/ui/app-breadcrumb/useBreadcrumb";
import { useDocumentStore } from "@/modules/Document/document.store";
import { useRoute } from "vue-router";
import AppOverlay from "@/components/ui/app-overlay/AppOverlay.vue";
import { DocumentProductType, DocumentType } from "@/modules/Document/document.types";
import { formatNumber } from "@/utils/helper";

const route = useRoute();

const documentStore = useDocumentStore();

const routeId = computed<string>(() => route.params.id as string);

interface TableData {
  typePro: string;
  vidPro: string;
  count: string;
  unit: string;
  cost: string;
  sum: string;
}


const tableData = ref<TableData[]>([
  {
    typePro: "Овощи",
    vidPro: "Картофель",
    count: "200",
    unit: "кг",
    cost: "1 000 сум",
    sum: "200 000 сум"
  },
  {
    typePro: "Мясные",
    vidPro: "Говядина",
    count: "200",
    unit: "кг",
    cost: "1 000 сум",
    sum: "200 000 сум"
  },
  {
    typePro: "Зерновые",
    vidPro: "Горох",
    count: "200",
    unit: "кг",
    cost: "1 000 сум",
    sum: "200 000 сум"
  },
  {
    typePro: "Овощи",
    vidPro: "Морковь",
    count: "200",
    unit: "кг",
    cost: "1 000 сум",
    sum: "200 000 сум"
  }
]);

const productsSum = computed(() => {
  if (!documentStore.document) return 0;
  return documentStore.document.products.reduce((sum: number, product: DocumentProductType) => {
    return (
        sum +
        Number(
            product.price && product.quantity ? product.price * product.quantity : 0
        )
    );
  }, 0);
});

const { setBreadCrumb } = useBreadcrumb();

const setBreadCrumbFn = () => {
  setBreadCrumb([
    {
      label: "Документы"
    },
    {
      label: "Контракты",
      to: { name: "contracts" }
    },
    {
      label: "Просмотр",
      isActionable: true
    }
  ]);
};

onMounted(() => {
  setBreadCrumbFn();
  documentStore.fetchDocument(routeId.value);
});

</script>

<template>
  <h1 class="m-0 font-semibold text-[32px]">Просмотор</h1>

  <AppOverlay
      :loading="documentStore.documentLoading"
      parent-class-name="border rounded-[24px] p-6 mt-6 pb-8 min-h-[65vh]"
  >
    <div class="grid grid-cols-2 gap-6">
      <AppInput
          :placeholder="documentStore.document?.number"
          label-class="text-[#A8AAAE] text-xs font-medium"
          label="№ контракта"
          disabled
      />
      <AppInput
          :placeholder="documentStore.document?.from_name"
          label-class="text-[#A8AAAE] text-xs font-medium"
          label="Поставщик"
          disabled
      />
    </div>

    <el-table
        :data="documentStore.document?.products ?? []"
        stripe
        class="custom-element-table custom-element-table--has-append"
    >
      <el-table-column
          prop="name"
          label="Название"
      />
      <el-table-column
          prop="quantity"
          label="Количество"
      />
      <el-table-column
          prop="unit"
          label="Ед. измерения"
      />
      <el-table-column
          prop="price"
          label="Цена"
      />
      <el-table-column
          prop="sum"
          label="Сумма"
      >
        <template #default="{row}:{row:DocumentType}">
          {{ formatNumber(row.quantity * row.price) }} сум
        </template>
      </el-table-column>
      <template
          v-if="productsSum"
          #append
      >
        <div class="flex items-center justify-end p-4">
          <h1 class="text-[#8F9194] text-sm font-bold mr-[5px]">
            Общая сумма:
          </h1>
          <h1 class="text-[#000D24] text-sm font-bold mr-5">
            {{ formatNumber(productsSum) }} сум
          </h1>
        </div>
      </template>
    </el-table>
  </AppOverlay>
</template>

