<script setup lang="ts">
import { ref } from "vue";


const branches = ref<number>(0);

const changeBranch = (code: number) => {
  branches.value = code;
};
</script>

<template>
  <div>
    <h1 class="m-0 font-semibold text-[32px] mb-[24px]">
      Главная
    </h1>

    <div>
      <div class="flex items-center rounded bg-[#F8F9FC] p-[4px] w-[586px]">
        <button @click="changeBranch(0)" :class="{'bg-[#FFFFFF] rounded-[8px] text-[#000D24]': branches == 0}"
                class="px-[20px] py-[10px] text-[14px] text-[#4F5662] font-medium">
          Все
        </button>

        <button @click="changeBranch(1)" :class="{'bg-[#FFFFFF] rounded-[8px] text-[#000D24]': branches == 1}"
                class="px-[20px] py-[10px] text-[14px] text-[#4F5662] font-medium">
          Зарафшан
        </button>

        <button @click="changeBranch(2)" :class="{'bg-[#FFFFFF] rounded-[8px] text-[#000D24]': branches == 2}"
                class="px-[20px] py-[10px] text-[14px] text-[#4F5662] font-medium">
          Навои
        </button>

        <button @click="changeBranch(3)" :class="{'bg-[#FFFFFF] rounded-[8px] text-[#000D24]': branches == 3}"
                class="px-[20px] py-[10px] text-[14px] text-[#4F5662] font-medium">
          Нуробод
        </button>

        <button @click="changeBranch(4)" :class="{'bg-[#FFFFFF] rounded-[8px] text-[#000D24]': branches == 4}"
                class="px-[20px] py-[10px] text-[14px] text-[#4F5662] font-medium">
          Учкудук
        </button>

        <button @click="changeBranch(5)" :class="{'bg-[#FFFFFF] rounded-[8px] text-[#000D24]': branches == 5}"
                class="px-[20px] py-[10px] text-[14px] text-[#4F5662] font-medium">
          Зафаробод
        </button>

      </div>


    </div>
  </div>
</template>
