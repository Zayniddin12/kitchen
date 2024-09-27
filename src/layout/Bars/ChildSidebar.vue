<script setup lang="ts">
import { onMounted, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";

const route = useRoute();
const router = useRouter();
const emit = defineEmits(["closeSidebar"]);
defineProps({
  children: {
    type: Array as () => PropType<string>[],
    required: true,
  },
  header: {
    type: String,
    default: () => "",
  },
});

const currentItem = ref<string>("");

onMounted(() => {
  currentItem.value = route?.path;
});

watch(
  () => route?.path,
  function () {
    currentItem.value = route.path;
  }
);

const activeChildMenu = (item: any) => {
  currentItem.value = item.route;
  router.push(item.route);
  emit("closeSidebar");
};
</script>

<template>
  <div class="px-[24px]">
    <header class="flex items-center justify-between pt-[16px] pb-[32px]">
      <h1 class="text-[#000000] font-medium text-[20px]">{{ header }}</h1>

      <div class="flex items-center cursor-pointer">
        <img
          src="@/assets/images/pin.svg"
          alt="pin"
        />
        <img
          src="@/assets/images/close.svg"
          class="ml-[15px]"
          alt="close"
          @click.stop="emit('closeSidebar')"
        />
      </div>
    </header>

    <el-collapse
      v-for="(item, index) in children"
      :key="index"
      accordion
      class="border-0"
    >
      <el-collapse-item
        v-if="item.children"
        :title="item.title"
        :name="index + 1"
        class="element-collapse"
      >
        <template #title>
          <div class="flex items-center">
            <svg
              :data-src="'/sidebar/' + item.icon + '.svg'"
              class="svg-class shrink-1 mr-[12px]"
              width="24px"
              height="24px"
            />
            {{ item.title }}
          </div>
        </template>
        <template #icon="{ isActive }">
          <img
            v-if="item.children && item.children.length"
            src="@/assets/images/arrowUp.svg"
            :class="isActive ? 'rotate-180' : ''"
            class="transition-all"
            alt="arrow"
          />
          <div v-else />
        </template>

        <div
          v-for="(sub, index2) in item.children"
          :key="index2"
          class="text-left py-[10px] px-[12px] text-dark text-[14px] font-medium cursor-pointer"
          :class="{ activeMenu: currentItem == sub.route }"
          @click.stop="activeChildMenu(sub)"
        >
          {{ sub.title }}
        </div>
      </el-collapse-item>

      <div
        v-else
        class="text-dark-gray text-[14px] text-left py-[10px] font-medium cursor-pointer"
        :class="{ activeMenu: currentItem == item.route }"
        @click.stop="activeChildMenu(item)"
      >
        <div class="flex items-center">
          <svg
            :data-src="'/sidebar/' + item.icon + '.svg'"
            class="svg-class shrink-1 mr-[12px]"
            width="24px"
            height="24px"
          />
          {{ item.title }}
        </div>
      </div>
    </el-collapse>
  </div>
</template>

<style lang="scss">
.element-collapse {
  .el-collapse-item__header {
    color: #4f5662;
    font-size: 14px !important;
    font-weight: 500;
    background-color: transparent;
    border-bottom: 0;
    width: 100%;
    align-content: center;
    justify-content: space-between;
  }

  .el-collapse-item__wrap {
    border-bottom: none;
    background-color: transparent;
  }
}

.activeMenu {
  @apply bg-[#ffffff] rounded-md shadow-menu;
}
</style>
