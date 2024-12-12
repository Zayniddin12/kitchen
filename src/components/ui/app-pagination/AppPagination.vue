<script
  setup
  lang="ts"
>
import { AppPaginationPropsType, PaginationPageType } from "@/components/ui/app-pagination/app-pagination.types";
import { computed } from "vue";
import { useI18n } from "vue-i18n";

const page = defineModel<PaginationPageType>();
const props = defineProps<AppPaginationPropsType>();
const emit = defineEmits<{
  currentChange: [value: number];
}>();

const computedPage = computed<number>({
  get: () => page.value ?? 1,
  set: (value: number) => {
    page.value = value;
  },
});

const { t } = useI18n();

const paginationText = computed(() => {
  const start = (computedPage.value - 1) * props.pagination.per_page + 1;
  const end = Math.min(
    start + props.pagination.items_count - 1,
    props.pagination.total_count,
  );
  return t("pagination.description", { start, end, count: props.pagination.total_count });
});
</script>

<template>
  <div
    v-show="props.pagination.pages_count > 1"
    class="app-pagination flex items-center justify-between"
  >
    <p class="text-cool-gray text-sm">
      {{ paginationText }}
    </p>
    <ElPagination
      v-model:current-page="computedPage"
      @current-change="(value:number) => emit('currentChange', value)"
      :page-size="props.pagination.per_page"
      class="float-right"
      background
      layout="prev, pager, next"
      :total="props.pagination.total_count"
    />
  </div>
</template>

<style
  scoped
  lang="scss"
>
.app-pagination {
  & > p {
    margin: 0;
  }
}
</style>
