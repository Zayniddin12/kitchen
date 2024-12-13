<script
  setup
  lang="ts"
>

import { RouterLink, useRoute, useRouter } from "vue-router";
import { computed, onMounted, reactive, ref } from "vue";
import useBreadcrumb from "@/components/ui/app-breadcrumb/useBreadcrumb";
import { useI18n } from "vue-i18n";
import AppInput from "@/components/ui/form/app-input/AppInput.vue";
import { usePositionStore } from "@/modules/Settings/components/Reference/Position/position.store";

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

const tableData = ref([
  {
    idx: 1,
    name: "Главный инженер",
    "responsibility": "Зарафшан",
    status: true,
  },
  {
    idx: 2,
    name: "Главный инженер",
    "responsibility": "Зарафшан",
    status: false,
  },
  {
    idx: 3,
    name: "Главный инженер",
    "responsibility": "Зарафшан",
    status: true,
  },
  {
    idx: 4,
    name: "Главный инженер",
    "responsibility": "Зарафшан",
    status: false,
  },
  {
    idx: 5,
    name: "Главный инженер",
    "responsibility": "Зарафшан",
    status: true,
  },
  {
    idx: 6,
    name: "Главный инженер",
    "responsibility": "Зарафшан",
    status: false,
  },
]);

const tableCurrentChange = ({ idx }: { idx: number }) => {
  router.push({ name: "position-show", params: { id: idx } });
};

const form = reactive({
  search: "",
});

const fetchPositions = () => {

};

onMounted(() => {
  setBreadCrumbFn();
});

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
      :data="tableData"
      :empty-text="t('common.empty')"
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
      </ElTableColumn>
      <ElTableColumn
        prop="name"
        :label="t('position.name')"
        sortable
        width="500"
      >
      </ElTableColumn>
      <ElTableColumn
        prop="responsibility"
        :label="t('position.responsibility')"
        sortable
        width="500"
      ></ElTableColumn>
      <ElTableColumn
        prop="status"
        :label="t('common.status')"
        sortable
        width="500"
      >
        <template #default="{row}">
          <div
            :class="['py-2 px-4 rounded-full text-center text-sm font-medium inline-flex items-center justify-center w-[125px] min-h-10',row.status ? 'text-[#22A95E] bg-[#D4F4E2]' : 'text-[#8F9194] bg-[#EEEEEF]']"
          >
            {{ row.status ? t("status.active") : t("status.completed") }}
          </div>
        </template>
      </ElTableColumn>
      <ElTableColumn
        prop="action"
        :label="t('common.action')"
        align="right"
      >
        <template #default="{row}">
          <div @click.stop class="flex items-center justify-end gap-x-2">
            <RouterLink
              :to="{name: 'position-show', params:{id: row.idx}}"
              class="action-btn"
            >
              <img
                src="@/assets/images/eye.svg"
                alt="eye"
              />
            </RouterLink>

            <RouterLink
              :to="{name: 'position-edit', params: {id: row.idx}}"
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
  </section>
</template>