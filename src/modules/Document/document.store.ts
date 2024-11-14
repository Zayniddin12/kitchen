import { defineStore } from "pinia";
import { ref } from "vue";
import {
    ActsParamsType,
    ActsType, ContractsParamsType, ContractsType,
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

    const updateLoading = ref(false);
    const update = async (uuid: string, data: DocumentCreateDataDocumentType) => {
        updateLoading.value = true;

        try {
            await documentApi.update(uuid, data);
        } finally {
            updateLoading.value = false;
        }
    };

    const pdfLoading = ref(false);

    const getPdf = async (uuid: string) => {
        pdfLoading.value = true;

        try {
            await documentApi.getPdf(uuid);
        } finally {
            pdfLoading.value = false;
        }
    };

    const acts = ref<ActsType | null>(null);
    const actsLoading = ref(false);

    const fetchActs = async (params:ActsParamsType = {}) => {
        actsLoading.value = true;

        try {
            acts.value = await documentApi.fetchActs(params);
        }finally {
            actsLoading.value = false;
        }
    }

    const contracts = ref<ContractsType | null>(null);
    const contractsLoading = ref(false);

    const fetchContracts = async (params:ContractsParamsType = {}) => {
        contractsLoading.value = true;

        try {
            contracts.value = await documentApi.fetchContracts(params);
        }finally {
            contractsLoading.value = false;
        }
    }

    return {
        createLoading,
        create,
        draftsLoading,
        drafts,
        fetchDrafts,
        documentLoading,
        document,
        fetchDocument,
        updateLoading,
        update,
        pdfLoading,
        getPdf,
        acts,
        actsLoading,
        fetchActs,
        contracts,
        contractsLoading,
        fetchContracts
    };
});
