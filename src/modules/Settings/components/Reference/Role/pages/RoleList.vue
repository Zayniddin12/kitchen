<script
  setup
  lang="ts"
>

import useBreadcrumb from "@/components/ui/app-breadcrumb/useBreadcrumb";
import { computed, onMounted, reactive, ref } from "vue";
import { useRoute } from "vue-router";
import { useI18n } from "vue-i18n";
import AppInput from "@/components/ui/form/app-input/AppInput.vue";
import { useRoleStore } from "@/modules/Settings/components/Reference/Role/role.store";
import { RoleType } from "@/modules/Settings/components/Reference/Role/role.types";

const { t } = useI18n();

const roleStore = useRoleStore();

const route = useRoute();

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

const form = reactive({
  search: "",
});

const tableData = ref([
  {
    name: "Супер админ",
    ownership: "Фонд НГМК",
    numberOfUses: 3,
  },
  {
    name: "Супер админ",
    ownership: "Фонд НГМК",
    numberOfUses: 3,
  },
  {
    name: "Супер админ",
    ownership: "Фонд НГМК",
    numberOfUses: 3,
  },
  {
    name: "Супер админ",
    ownership: "Фонд НГМК",
    numberOfUses: 3,
  },
]);

onMounted(() => {
  setBreadCrumbFn();
  roleStore.fetchRoles();
});

</script>

<template>
  <section>
    <div class="flex items-center justify-between">
      <h1 class="text-black-text font-semibold text-[32px]">
        {{ isTranslate ? t(title) : title }}
      </h1>
<!--      <AppInput-->
<!--        v-model="form.search"-->
<!--        class="w-[300px] mb-0"-->
<!--        custom-type="search"-->
<!--        input-style="height: 42px"-->
<!--      />-->
    </div>
    <ElTable
      v-loading="roleStore.rolesLoading"
      :data="roleStore.roles"
      class="custom-element-table mt-6"
      :empty-text="t('common.empty')"
      stripe
    >
      <ElTableColumn
        prop="idx"
        label="№"
        width="100"
      >
        <template #default="{$index}">
          {{ $index + 1 }}
        </template>
      </ElTableColumn>
      <ElTableColumn
        prop="name"
        :label="t('role.name2')"
        sortable
        width="670"
      >
        <template #default="{row}:{row: RoleType}">
          {{ row.name ?? "-" }}
        </template>
      </ElTableColumn>
      <ElTableColumn
        prop="parent_name"
        :label="t('role.ownership')"
        sortable
        width="670"
      >
        <template #default="{row}:{row: RoleType}">
          {{ row.parent_name ?? "-" }}
        </template>
      </ElTableColumn>
      <ElTableColumn
        prop="users_count"
        :label="t('role.numberOfUses')"
        sortable
      >
        <template #default="{row}:{row: RoleType}">
          {{row.users_count ?? 0}}
        </template>
      </ElTableColumn>
    </ElTable>
  </section>
</template>