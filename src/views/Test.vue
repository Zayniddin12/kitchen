<script lang="ts" setup>
import AppDatePicker from "@/components/ui/form/app-date-picker/AppDatePicker.vue";
import { ValidationType } from "@/components/ui/form/app-form/app-form.type";
import AppForm from "@/components/ui/form/app-form/AppForm.vue";
import AppInput from "@/components/ui/form/app-input/AppInput.vue";
import AppSelect from "@/components/ui/form/app-select/AppSelect.vue";
import { reactive, ref } from "vue";

const form = reactive({
  name: "",
  jobId: "",
  birth_date: "",
});

const jobs = [
  {
    id: 1,
    name: "Frontend devoloper",
  },
  {
    id: 2,
    name: "Backend devoloper",
  },
];

const v$ = ref<ValidationType | null>(null);

const setValidation = (value: ValidationType) => {
  v$.value = value;
};

const submitss = async () => {
  if (!v$.value || (v$.value && !(await v$.value.validate()))) return;

  console.log("Succeess");
};
</script>
<template>
  <AppForm
    :value="form"
    @validation="setValidation"
    class="grid grid-cols-2 gap-2"
  >
    <AppInput
      v-model="form.name"
      label="Name"
      required
      :max="5"
      prop="name"
      trigger="change"
    />
    <AppSelect
      v-model="form.jobId"
      :items="jobs"
      item-label="name"
      item-value="id"
      label="Select"
      required
      prop="jobId"
    />
    <AppDatePicker
      v-model="form.birth_date"
      label="Date Picker"
      prop="birth_date"
      required
    />
  </AppForm>
  <ElButton @click="submitss"> Summit </ElButton>
</template>
