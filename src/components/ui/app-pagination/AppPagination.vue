<script
    setup
    lang="ts"
>

import { AppPaginationPropsType, PaginationPageType } from "@/components/ui/app-pagination/app-pagination.types";
import { computed } from "vue";

const page = defineModel<PaginationPageType>();

const props = defineProps<AppPaginationPropsType>();

const computedPage = computed<number>({
  get() {
    return page.value ?? 1;
  },
  set(value: PaginationPageType) {
    page.value = value;
  }
});

const emit = defineEmits<{
  currentChange: [value: number]
}>();


</script>

<template>
  <div class="app-pagination flex items-center justify-between">
    <p class="text-cool-gray text-sm">
      Показано {{ computedPage }}–{{ pagination.per_page }} из {{ pagination.total_count }}
      результатов
    </p>
    <ElPagination
        v-model:current-page="computedPage"
        @current-change="(value:number)=>emit('currentChange', value)"
        :page-size="pagination.per_page"
        class="float-right"
        background
        layout="prev, pager, next"
        :total="pagination.total_count"
    />
  </div>
</template>

<style lang="scss">

</style>