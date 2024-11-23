<script
    setup
    lang="ts"
>

import { RouteRecordRaw, useRoute, useRouter } from "vue-router";
import { computed, onMounted, reactive, ref, watch } from "vue";
import { UsersParamsType, UserType } from "@/modules/Users/users.types";
import { StatusType } from "@/types/common.type";
import { useUsersStore } from "@/modules/Users/users.store";
import { filterObjectValues, phoneFormatter, setTableColumnIndex } from "@/utils/helper";
import AppInput from "@/components/ui/form/app-input/AppInput.vue";
import { Search } from "@element-plus/icons-vue";
import { watchDebounced } from "@vueuse/core";
import AppForm from "@/components/ui/form/app-form/AppForm.vue";
import { ValidationType } from "@/components/ui/form/app-form/app-form.type";
import { useCommonStore } from "@/stores/common.store";
import { FoodFactoryListType } from "@/modules/Settings/components/Reference/CombineNutrition/combine-nutrition.type";
import AppPagination from "@/components/ui/app-pagination/AppPagination.vue";
import useBreadcrumb from "@/components/ui/app-breadcrumb/useBreadcrumb";

const route = useRoute();
const router = useRouter();

const userStore = useUsersStore();
const commonStore = useCommonStore();

const form = reactive<UsersParamsType>({
  page: null,
  search: "",
  status: ""
});

const v$ = ref<ValidationType | null>(null);

const validationErrors = ref<Record<string, any> | null>(null);

interface StatusTabType {
  name: string,
  value: StatusType
}

const statuses = computed<StatusTabType[]>(() => {
  return [
    {
      name: "Все",
      value: ""
    },
    {
      name: "Кадровый резерв",
      value: "active"
    },
    {
      name: "Сотрудники",
      value: "inactive"
    }
  ];
});

const statusTabUrl = (value: StatusType) => {
  const query = { ...route.query, ...{ status: value } } as Record<string, any>;
  delete query.page;

  return filterObjectValues(query);
};

const validateStatus = (status: string) => {
  return status === "active" || status === "inactive";
};

const fetchUsers = async () => {
  const query = route.query as Record<string, string | undefined>;
  const { status = "", page = "" } = query;

  const intPage = parseInt(page);

  form.status = validateStatus(status) ? status : "";
  form.search = query.search || "";
  form.page = !isNaN(intPage) ? intPage : null;


  if (v$.value && !(await v$.value.validate())) {
    commonStore.errorToast("Validation Error");
    return;
  }

  const newForm = filterObjectValues(form);

  try {
    if (userStore.activeUserPage) {
      await userStore.fetchUsers(newForm);
    } else {
      await userStore.fetchEmployees(newForm);
    }
  } catch (error: any) {
    if (error?.error?.code === 422) {
      validationErrors.value = error.meta.validation_errors;
    }
  }
};

const data = computed(() => {
  return userStore.activeUserPage ? userStore.users : userStore.employees;
});

const loading = computed(() => {
  return userStore.activeUserPage ? userStore.usersLoading : userStore.employeesLoading;
});

const changePage = () => {
  router.replace({ query: { ...route.query, page: form.page } });
};

const tableCurrentChange = (value: FoodFactoryListType) => {
  router.push({ name: `${route.name as string}-id`, params: { id: value.id } });
};

const { setBreadCrumb } = useBreadcrumb();

const setBreadCrumbFn = () => {
  setBreadCrumb([
    {
      label: "Кадры",
      isActionable: false
    },
    {
      label: String(route.meta.title ?? ""),
      isActionable: true
    }
  ]);
};


watch(() => route.query, () => {
  fetchUsers();
}, { immediate: true });


watchDebounced(() => form.search, () => {
  router.push({ query: filterObjectValues({ search: form.search }) });
}, { debounce: 1000, maxWait: 5000 });

watch(() => route.name, () => {
  setBreadCrumbFn();
}, { immediate: true });

</script>

<template>
  <div>
    <div class="flex items-end justify-between">
      <div class="flex flex-col gap-y-6">
        <h1
            v-if="route.meta?.title"
            class="font-semibold text-[32px]"
        >
          {{ route.meta.title }}
        </h1>
        <div
            v-if="route.meta?.hasTabs"
            class="app-tabs"
        >
          <RouterLink
              v-for="tab in statuses"
              :key="tab.value"
              :to="{query: statusTabUrl(tab.value)}"
              :class="[
              'app-tab',
              { 'app-tab--active': form.status === tab.value },
            ]"
          >
            {{ tab.name }}
          </RouterLink>
        </div>
      </div>
      <div class="flex items-start gap-x-4 -mb-4">
        <AppForm
            :value="form"
            :validation-errors
            @validation="(value) => v$ = value"
        >
          <AppInput
              v-model="form.search"
              prop="search"
              size="large"
              class="h-[47px] w-[300px]"
              placeholder="Поиск"
              :prefix-icon="Search"
              :min="3"
          />
        </AppForm>
        <RouterLink
            :to="{name: `${route.name as string}-fetch`}"
            class="custom-apply-btn h-[47px]"
        >
          <img
              src="@/assets/images/icons/plus.svg"
              alt="add"
          />
          Добавить
        </RouterLink>
      </div>
    </div>
    <ElTable
        v-loading="loading"
        :data="data?.users ?? []"
        class="custom-element-table mt-6"
        stripe
        highlight-current-row
        @current-change="tableCurrentChange"
    >
      <ElTableColumn
          prop="idx"
          label="№"
          width="80"
      >
        <template #default="{$index}">
          {{ setTableColumnIndex($index, form.page as number, data?.pagination.per_page ?? 0) }}
        </template>
      </ElTableColumn>
      <ElTableColumn
          label="Фамилия И.О."
          prop="full_name"
          sortable
      >
        <template #default="{row}:{row:UserType}">
          <div
              v-if="row.avatar || row.firstname || row.lastname"
              class="flex items-center gap-x-3"
          >
            <img
                v-if="row.avatar"
                :src="row.avatar"
                :alt="userStore.getUserFullName(row)"
                class="size-[32px] rounded-full"
            />
            <span class="text-[#4F5662] text-sm">
              {{ userStore.getUserFullName(row) }}
            </span>
          </div>
          <template v-else>
            —
          </template>
        </template>
      </ElTableColumn>
      <template v-if="userStore.activeUserPage">
        <ElTableColumn
            label="Должность"
            prop="position"
            sortable
        >
          <template #default="{row}:{row:UserType}">
            {{ row.position || "—" }}
          </template>
        </ElTableColumn>
        <ElTableColumn
            label="Телефон"
            prop="phone"
            sortable
        >
          <template #default="{row}:{row:UserType}">
            {{ row.phone ? phoneFormatter(row.phone) : "—" }}
          </template>
        </ElTableColumn>
        <ElTableColumn
            label="OneID"
            prop="is_oneid_enabled"
        >
          <template #default="{row}:{row:UserType}">
            {{ row.is_oneid_enabled ? "Есть" : "—" }}
          </template>
        </ElTableColumn>
      </template>
      <template v-else>
        <ElTableColumn
            label="Место работы"
            prop="work_place"
            sortable
        >
          <template #default="{row}:{row:UserType}">
            {{ row.work_place || "—" }}
          </template>
        </ElTableColumn>
        <ElTableColumn
            label="График работы"
            prop="work_hours"
            sortable
        >
          <template #default="{row}:{row:UserType}">
            {{ row.work_hours ? `${row.work_hours} часов` : "—" }}
          </template>
        </ElTableColumn>
      </template>
      <ElTableColumn
          label="Статус"
          prop="status"
      >
        <template #default="{row}:{row:UserType}">
          <div
              :class="['py-2 px-4 rounded-full text-center text-sm font-medium inline-flex items-center justify-center w-[125px] min-h-10',row.status === 'active' ? 'text-[#22A95E] bg-[#D4F4E2]' : 'text-[#8F9194] bg-[#EEEEEF]']"
          >
            {{ row.status === "active" ? "Активный" : "Завершено" }}
          </div>
        </template>
      </ElTableColumn>
      <ElTableColumn label="Действие">
        <template #default="{row}:{row:UserType}">
          <div class="inline-flex items-center">
            <RouterLink
                class="action-btn mr-2"
                :to="{name: `${route.name as string}-id`, params: {id: row.id}}"
            >
              <img
                  src="@/assets/images/eye.svg"
                  alt="eye"
              />
            </RouterLink>

            <RouterLink
                class="action-btn"
                :to="{name: `${route.name as string}-edit`, params: {id: row.id}}"
            >
              <img
                  src="@/assets/images/icons/edit.svg"
                  alt="eye"
              />
            </RouterLink>
          </div>
        </template>
      </ElTableColumn>
    </ElTable>
    <AppPagination
        v-if="data"
        v-model="form.page"
        :pagination="data.pagination"
        @currentChange="changePage"
        class="mt-6"
    />
  </div>
</template>

<style lang="scss">

</style>