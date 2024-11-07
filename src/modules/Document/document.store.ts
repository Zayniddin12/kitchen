import { defineStore } from "pinia";
import { ref } from "vue";
import {
    DocumentCreateDataDocumentType,
    DocumentCreateDataType, DocumentType,
    DraftsParamsType,
    DraftsResponseType
} from "@/modules/Document/document.types";
import documentApi from "@/modules/Document/document.api";

export const useDocumentStore = defineStore("documentStore", () => {
    const createLoading = ref(false);

    const create = async (data: DocumentCreateDataType | DocumentCreateDataDocumentType) => {
        createLoading.value = true;

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

    const documentLoading = ref(false);
    const document = ref<DocumentType | null>(null);

    const fetchDocument = async (uuid: string) => {
        documentLoading.value = true;
        try {
            document.value = await documentApi.fetchDocument(uuid);
        } finally {
            documentLoading.value = false;
        }
    };

    return {
        createLoading,
        create,
        draftsLoading,
        drafts,
        fetchDrafts,
        documentLoading,
        document,
        fetchDocument
    };
});
