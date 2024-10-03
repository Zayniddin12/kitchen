<script setup lang="ts">
import { ref } from "vue";
import { Search } from '@element-plus/icons-vue'

interface Tabs {
  title: string;
  value: number;
}

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

const setActiveTab = (item: any) => {
  activeTab.value = item.value;
};
</script>

<template>
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

      <button class="custom-apply-btn ml-[16px] !px-[30px]">
        <img src="@/assets/images/icons/plus.svg" alt="add">
        Добавить
      </button>
    </div>
  </div>
</template>

<style scoped lang="scss">

</style>