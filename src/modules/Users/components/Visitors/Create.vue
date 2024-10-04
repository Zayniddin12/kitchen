<script setup lang="ts">
import { ref } from "vue";
import { Search } from "@element-plus/icons-vue";
import { useRouter } from "vue-router";

interface CreateBtn {
  title: string;
  icon: string;
}

const router = useRouter()

const createBtn = ref<CreateBtn[]>([
  {
    title: "ПИНФЛ",
    icon: "pinFl",
  },
  {
    title: "Серия и номер паспорта",
    icon: "seria",
  },
]);
const search = ref<string>('')
const isSearch = ref<boolean>(false);
</script>

<template>
  <div>
    <h1 class="m-0 font-semibold text-[32px]">Добавить</h1>

    <div class="mt-[24px] flex justify-center create-form" v-if="isSearch">
      <el-input
        v-model="search"
        style="max-width: 500px"
        placeholder="Серия и номер паспорта"
        class="input-with-select"
      >
        <template #prepend>
          <el-button :icon="Search" />
        </template>
        <template #append>
          <el-button type="primary" @click="router.push('/visitors-create-form')">
            Найти
          </el-button>
        </template>
      </el-input>
    </div>

    <div class="flex items-center gap-6 justify-center h-[60vh]" v-else>
      <div
        class="bg-[#F8F9FC] rounded-[24px] w-[300px] h-[200px] flex items-center justify-center flex-col cursor-pointer"
        v-for="item in createBtn"
        :key="item.title"
        @click="isSearch =! isSearch"
      >
        <svg :data-src="'/sidebar/' + item.icon + '.svg'" width="40px" height="40px" />
        <h1 class="text-[#4F5662] text-[14px] font-medium mt-[16px]">{{item.title}}</h1>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
.create-form {
  .el-input-group__prepend {
    background-color: transparent;
  }

  .el-input-group__append {
    color: #FFFFFF;
    background-color: #2E90FA;
  }
}
</style>