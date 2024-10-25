<template>
  <div class="flex flex-wrap gap-4 items-center">
    <el-select
        v-model="value"
        placeholder="Select"
        style="width: 240px"
        clearable
    >
      <el-option
          v-for="item in settingsStore.wareHouseList.bases"
          :key="item.id"
          :label="item.name"
          :value="item.id"
      />
    </el-select>

    <el-select
        v-model="value2"
        placeholder="Select"
        style="width: 240px"
        multiple
    >
      <el-option
          v-for="item in options"
          :key="item.value"
          :label="item.label"
          :value="item.value"
      />
    </el-select>
  </div>
</template>

<script
    lang="ts"
    setup
>
import { onMounted, ref } from "vue";
import { useSettingsStore } from "@/modules/Settings/store";

const settingsStore = useSettingsStore();

const value = ref(2);

onMounted(() => {
  settingsStore.GET_WAREHOUSE_BASES_LIST({ per_page: 100 });
});

const value1 = ref<string>("Option1");
const value2 = ref<string[]>(["Option1"]);
const options = [
  {
    value: "Option1",
    label: "Label1"
  },
  {
    value: "Option2",
    label: "Label2"
  },
  {
    value: "Option3",
    label: "Label3"
  },
  {
    value: "Option4",
    label: "Label4"
  },
  {
    value: "Option5",
    label: "Label5"
  }
];
</script>

<style scoped></style>
