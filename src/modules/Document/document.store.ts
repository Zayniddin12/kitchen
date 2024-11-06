import { defineStore } from "pinia";
import { ref } from "vue";
import { DocumentCreateDataType, DraftsParamsType, DraftsResponseType } from "@/modules/Document/document.types";
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

    const draftsLoading = ref(false);
    const drafts = ref<DraftsResponseType | null>(null);
    const fetchDrafts = async (params: DraftsParamsType = {}) => {
        draftsLoading.value = true;
        try {
            drafts.value = await documentApi.fetchDrafts(params);
        } finally {
            draftsLoading.value = false;
        }
    };

    return {
        createLoading,
        create,
        draftsLoading,
        drafts,
        fetchDrafts
    };
});
