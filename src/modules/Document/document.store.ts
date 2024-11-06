import { defineStore } from "pinia";
import { ref } from "vue";
import {
    DocumentCreateDataActType,
    DocumentCreateDataDocumentType, DocumentCreateDataType,
    DraftsParamsType,
    DraftsResponseType
} from "@/modules/Document/document.types";
import documentApi from "@/modules/Document/document.api";

export const useDocumentStore = defineStore("documentStore", () => {
    const createLoading = ref(false);

    const create = async (documentData: DocumentCreateDataDocumentType, actData?: DocumentCreateDataActType) => {
        createLoading.value = true;

        const data: DocumentCreateDataType = {
            Document: documentData
        };

        if (actData) data.Act = actData;

        try {
            await documentApi.create(data);
        } finally {
            createLoading.value = false;
        }
    };

    const draftsLoading = ref(false);
    const drafts = ref<DraftsResponseType | null>(null);
    const fetchDrafts = async (url: string, params: DraftsParamsType = {}) => {
        draftsLoading.value = true;
        try {
            drafts.value = await documentApi.fetchDrafts(url, params);
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
