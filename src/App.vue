<script setup lang="ts">
import AppInput from "@/components/ui/form/app-input/AppInput.vue";
import { ref } from "vue";
import AppSelect from "@/components/ui/form/app-select/AppSelect.vue";
import AppDatePicker from "@/components/ui/form/app-date-picker/AppDatePicker.vue";

const inputValue = ref<number | null>(null);

const activeItem = ref("");

const items = [
  {
    id: 1,
    name: "Option 1",
  },
  {
    id: 2,
    name: "Option 2",
  },
  {
    id: 3,
    name: "Option 3",
  },
];
</script>
<template>
  <div class="max-w-[1200px] mx-auto">
    <AppInput
      v-model="inputValue"
      label="Label"
      mask="###-###"
    />
    <AppSelect
      v-model="activeItem"
      :items
      item-label="name"
      item-value="id"
      label="Label"
    />
    <AppDatePicker label="Label" />
  </div>
  <RouterView />
</template>
