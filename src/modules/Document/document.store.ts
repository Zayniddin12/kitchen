import { defineStore } from "pinia";
import { ref } from "vue";
import { DocumentCreateDataType } from "@/modules/Document/document.types";
import documentApi from "@/modules/Document/document.api";

export const useDocumentStore = defineStore("documentStore", () => {
  const createLoading = ref(false);

  const create = async (data: DocumentCreateDataType) => {
    createLoading.value = true;

    try {
      await documentApi.create(data);
    } finally {
      createLoading.value = false;
    }
  };

  return {
    createLoading,
    create,
  };
});
