<script
  setup
  lang="ts"
>
import { onMounted, ref } from "vue";
import { Search } from "@element-plus/icons-vue";
import { useRouter } from "vue-router";
import useBreadcrumb from "@/components/ui/app-breadcrumb/useBreadcrumb";

const { setBreadCrumb } = useBreadcrumb();

interface Tabs {
  title: string;
  value: number;
}

interface TableData {
  id: number,
  sureName: string,
  position: string,
  phone: string,
  oneId: string,
  status?: StatusInterface,
}

interface StatusInterface {
  title?: string;
  status?: boolean;
}

const router = useRouter();

const activeTab = ref<number>(0);
const tabs = ref<Tabs[]>([
  {
    title: "Все",
    value: 0,
  },
  {
    title: "Кадровый резерв",
    value: 1,
  },
  {
    title: "Сотрудники",
    value: 2,
  },
]);
const tableData = ref<TableData[]>([
  {
    id: 1,
    sureName: "Хамидов Иброхим Илхомович",
    position: "Електромеханик",
    phone: "99 987 65 43",
    oneId: "5698745",
    status: {
      title: "Активный",
      status: true,
    },
  },
  {
    id: 2,
    sureName: "Собиров Аваз Рахмонович",
    position: "Електромонтёр",
    phone: "99 596 47 56",
    oneId: "9658756",
    status: {
      title: "Завершено",
      status: false,
    },
  },
  {
    id: 3,
    sureName: "Хамидов Иброхим Илхомович",
    position: "Електромеханик",
    phone: "99 987 65 43",
    oneId: "5698745",
    status: {
      title: "Активный",
      status: true,
    },
  },
  {
    id: 4,
    sureName: "Собиров Аваз Рахмонович",
    position: "Електромонтёр",
    phone: "99 596 47 56",
    oneId: "9658756",
    status: {
      title: "Завершено",
      status: false,
    },
  },
]);
const input1 = ref<string>("");

const setActiveTab = (item: any) => {
  activeTab.value = item.value;
};

const setBreadCrumbFn = () => {
  setBreadCrumb([
    {
      label: "Кадры",
      isActionable: false,
    },
    {
      label: "База кадров",
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
    <h1 class="m-0 font-semibold text-[32px]">База кадров</h1>

    <div class="flex items-center justify-between my-[24px]">
      <div class="app-tabs">
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

      <div class="flex items-center">
        <el-input
          v-model="input1"
          size="large"
          placeholder="Поиск"
          :prefix-icon="Search"
        />

        <button
          class="custom-apply-btn ml-[16px] !px-[30px]"
          @click="router.push('/personal-database-create')"
        >
          <img
            src="@/assets/images/icons/plus.svg"
            alt="add"
          />
          Добавить
        </button>
      </div>
    </div>

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
        prop="sureName"
        label="Фамилия И.О."
        sortable
        width="400"
      >
        <template #default="scope">
          <div class="flex items-center">
            <img
              src="@/assets/images/avatar.png"
              class="h-[32px] w-[32px]"
              alt="avatar"
            />
            <p class="text-[#4F5662] text-[14px] ml-[12px]">{{ scope.row.sureName }}</p>
          </div>
        </template>
      </el-table-column>
      <el-table-column
        prop="position"
        label="Должность"
        sortable
      />
      <el-table-column
        prop="phone"
        label="Телефон"
        sortable
      />
      <el-table-column
        prop="oneId"
        label="OneID"
        sortable
      />
      <el-table-column
        prop="status"
        sortable
        label="Статус"
      >
        <template #default="scope">
          <div
            :class="scope.row.status.status ? 'text-[#22A95E] bg-[#D4F4E2]' : 'text-[#8F9194] bg-[#EEEEEF]'"
            class="py-[8px] px-[16px] rounded-full text-center text-[12px] font-medium"
          >
            {{ scope.row.status.title }}
          </div>
        </template>
      </el-table-column>
      <el-table-column label="Действие">
        <template #default="scope">
          <button
            class="action-btn"
            @click="router.push(`/personal-database-view/${scope.row.id}`)"
          >
            <img
              src="@/assets/images/eye.svg"
              alt="eye"
            />
          </button>

          <button
            class="action-btn ml-[8px]"
            @click="router.push(`/personal-database-edit-form/${scope.row.id}`)"
          >
            <img
              src="@/assets/images/icons/edit.svg"
              alt="edit"
            />
          </button>
        </template>
      </el-table-column>
    </el-table>

    <div class="mt-[24px] flex items-center justify-between">
      <div class="text-cool-gray text-[14px]">
        Показано 1–12 из 100 результатов
      </div>

      <el-pagination
        class="float-right"
        background
        layout="prev, pager, next"
        :total="1000"
      />
    </div>
  </div>
</template>

