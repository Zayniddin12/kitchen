<script
  setup
  lang="ts"
>
import { Search } from "@element-plus/icons-vue";
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import useBreadcrumb from "@/components/ui/app-breadcrumb/useBreadcrumb";

interface Name {
  uz: string;
  ru: string;
}

interface TableData {
  id: number;
  name: Name;
}

interface name {
  uz: string;
  ru: string;
}

const router = useRouter();

const tableData = ref<TableData[]>([
  {
    id: 1,
    name: {
      uz: "Gosht",
      ru: "Мясные",
    },
  },
  {
    id: 2,
    name: {
      uz: "Молочные",
      ru: "Молочные",
    },
  },
  {
    id: 3,
    name: {
      uz: "Овощи",
      ru: "Овощи",
    },
  },
  {
    id: 4,
    name: {
      uz: "Молочные",
      ru: "Молочные",
    },
  },
  {
    id: 5,
    name: {
      uz: "Напитки",
      ru: "Напитки",
    },
  },
]);

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
      label: "Продукты",
      to: { name: "reference" },
    },
    {
      label: "Типы продуктов",
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
    <div class="flex items-center justify-between">
      <h1 class="m-0 font-semibold text-[32px] leading-[48px]">Типы продуктов</h1>

      <div class="flex items-center">
        <el-input
          size="large"
          placeholder="Поиск"
          :prefix-icon="Search as any"
          class="w-[300px]"
        />

        <button
          class="custom-apply-btn ml-[16px]"
          @click="router.push('/reference-type-product-create')"
        >
          <img
            src="@/assets/images/icons/plus.svg"
            alt="plus"
          />
          Добавить
        </button>
      </div>
    </div>

    <div class="mt-[24px]">
      <el-table
        :data="tableData"
        class="custom-element-table"
      >
        <el-table-column
          prop="id"
          label="№"
          width="80"
        />
        <el-table-column
          prop="name"
          label="Наименование типа"
          sortable
        >
          <template #default="scope">
            {{ scope.row?.name?.[$i18n.locale] }}
          </template>
        </el-table-column>
        <el-table-column
          label="Действие"
          align="right"
        >
          <template #default="scope">
            <button
              class="action-btn"
              @click="router.push(`/reference-type-product-view/${scope.row.id}`)"
            >
              <img
                src="../../../../../../assets/images/eye.svg"
                alt="eye"
              />
            </button>

            <button
              class="action-btn ml-[8px]"
              @click="router.push(`/reference-type-product-edit/${scope.row.id}`)"
            >
              <img
                src="../../../../../../assets/images/icons/edit.svg"
                alt="edit"
              />
            </button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>
