<script
    setup
    lang="ts"
>

import { AppPaginationPropsType, PaginationPageType } from "@/components/ui/app-pagination/app-pagination.types";

const page = defineModel<PaginationPageType>({
  default: 1
});

const props = defineProps<AppPaginationPropsType>();

const emit = defineEmits<{
  currentChange: [value: number]
}>();

</script>

<template>
  <div class="app-pagination flex items-center justify-between">
    <p class="text-cool-gray text-sm">
      Показано {{ page }}–{{ pagination.per_page }} из {{ pagination.total_count }}
      результатов
    </p>
    <ElPagination
        v-model:current-page="page as number"
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