<script
  setup
  lang="ts"
>

import { RouterLink, useRoute, useRouter } from "vue-router";
import { computed, onMounted, reactive, watch } from "vue";
import useBreadcrumb from "@/components/ui/app-breadcrumb/useBreadcrumb";
import { useI18n } from "vue-i18n";
import AppInput from "@/components/ui/form/app-input/AppInput.vue";
import { usePositionStore } from "@/modules/Settings/components/Reference/Position/position.store";
import { filterObjectValues, setTableColumnIndex } from "@/utils/helper";
import { PositionsParamsType, PositionType } from "@/modules/Settings/components/Reference/Position/position.types";
import AppPagination from "@/components/ui/app-pagination/AppPagination.vue";
import { watchDebounced } from "@vueuse/core";

const { t } = useI18n();

const positionStore = usePositionStore();

const route = useRoute();
const router = useRouter();

const title = computed(() => route.meta.title ?? "");
const isTranslate = computed(() => !!route.meta.isTranslate);

const { setBreadCrumb } = useBreadcrumb();

const setBreadCrumbFn = () => {
  setBreadCrumb([
    {
      label: "common.settings",
      isTranslate: true,
      to: { name: "reference" },
    },
    {
      label: "settings.directories",
      to: { name: "reference" },
      isTranslate: true,
    },
    {
      label: "settings.positionsAndRoles",
      to: { name: "reference" },
      isTranslate: true,
    },
    {
      label: title.value,
      isActionable: true,
      isTranslate: isTranslate.value,
    },
  ]);
};


const tableCurrentChange = ({ id }: { id: number }) => {
  router.push({ name: "position-show", params: { id } });
};

const form = reactive<PositionsParamsType>({
  search: "",
  page: null,
});

const fetchPositions = () => {
  const query = route.query as Record<string, string>;

  const page = parseInt(query.page);

  form.page = !isNaN(page) ? page : null;
  form.search = query.search ?? "";

  positionStore.fetchPositions(filterObjectValues(form));
};

const changePage = (value: number) => {
  router.replace({ query: { ...route.query, page: value } });
};

onMounted(() => {
  setBreadCrumbFn();
});

watchDebounced(() => form.search, () => {
  router.push({ query: filterObjectValues({ search: form.search }) });
}, { debounce: 1000, maxWait: 5000 });

watch(() => route.query, fetchPositions, { immediate: true });

</script>

<template>
  <section>
    <div class="flex items-center justify-between gap-x-10">
      <h1 class="text-black-text font-semibold text-[32px]">
        {{ isTranslate ? t(title) : title }}
      </h1>
      <div class="flex items-center gap-x-4">
        <AppInput
          v-model="form.search"
          class="w-[300px] mb-0"
          custom-type="search"
          input-style="height: 42px"
        />
        <RouterLink
          v-if="$can('create', 'Button')"
          :to="{name: 'position-create'}"
          class="custom-apply-btn"
        >
          <img
            src="@/assets/images/icons/plus.svg"
            alt="plus"
          />
          <span class="font-medium text-base">
            {{ t("method.add") }}
          </span>
        </RouterLink>
      </div>
    </div>
    <ElTable
      v-loading="positionStore.positionsLoading"
      :data="positionStore.positionsPagination?.positions ?? []"
      :empty-text="t('common.empty')"
      class="custom-element-table mt-6"
      stripe
      highlight-current-row
      @current-change="tableCurrentChange"
    >
      <ElTableColumn
        prop="idx"
        label="№"
        width="100"
      >
        <template #default="{$index}">
          {{ setTableColumnIndex($index, form.page ?? 0, positionStore.positionsPagination?.pagination.per_page ?? 0) }}
        </template>
      </ElTableColumn>
      <ElTableColumn
        prop="name"
        :label="t('position.name')"
        sortable
      >
        <template #default="{row}:{row: PositionType}">
          {{ row.name || "-" }}
        </template>
      </ElTableColumn>
      <ElTableColumn
        prop="work_place_name"
        :label="t('position.responsibility')"
        sortable
      >
        <template #default="{row}:{row: PositionType}">
          {{ row.work_place_name || "-" }}
        </template>
      </ElTableColumn>
      <ElTableColumn
        prop="status"
        :label="t('common.status')"
        sortable
      >
        <template #default="{row}:{row: PositionType}">
          <div
            :class="['py-2 px-4 rounded-full text-center text-sm font-medium inline-flex items-center justify-center w-[125px] min-h-10',row.status==='active' ? 'text-[#22A95E] bg-[#D4F4E2]' : 'text-[#8F9194] bg-[#EEEEEF]']"
          >
            {{ row.status === "active" ? t("status.active") : t("status.completed") }}
          </div>
        </template>
      </ElTableColumn>
      <ElTableColumn
        prop="action"
        :label="t('common.action')"
        align="right"
      >
        <template #default="{row}">
          <div
            @click.stop
            class="flex items-center justify-end gap-x-2"
          >
            <RouterLink
              v-if="$can('read', 'Button')"
              :to="{name: 'position-show', params:{id: row.id}}"
              class="action-btn"
            >
              <img
                src="@/assets/images/eye.svg"
                alt="eye"
              />
            </RouterLink>

            <RouterLink
              v-if="$can('update', 'Button')"
              :to="{name: 'position-edit', params: {id: row.id}}"
              class="action-btn"
            >
              <img
                src="@/assets/images/icons/edit.svg"
                alt="edit"
              />
            </RouterLink>
          </div>
        </template>
      </ElTableColumn>
    </ElTable>
    <AppPagination
      v-if="positionStore.positionsPagination"
      v-model="form.page"
      :pagination="positionStore.positionsPagination.pagination"
      @current-change="changePage"
      class="mt-6"
    />
  </section>
</template>