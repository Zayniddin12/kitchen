import { defineStore } from "pinia";
import { ref } from "vue";
import {
  ActsParamsType,
  ActsType, ContractsParamsType, ContractsType,
  DocumentCreateDataDocumentType,
  DocumentCreateDataType, DocumentType,
  DraftsParamsType,
  DraftsResponseType,
} from "@/modules/Document/document.types";
import documentApi from "@/modules/Document/document.api";

export const useDocumentStore = defineStore("documentStore", () => {
  const documentsIsRefresh = ref(false);

  const setDocumentsIsRefresh = (value: boolean) => {
    documentsIsRefresh.value = value;
  };

  const createLoading = ref(false);

  const create = async (data: DocumentCreateDataType | DocumentCreateDataDocumentType) => {
    createLoading.value = true;

    try {
      await documentApi.create(data);
      documentsIsRefresh.value = true;
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
      setDocumentsIsRefresh(false);
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
    window.open(`${import.meta.env.VITE_BACKEND}/documents/get-pdf/${uuid}`, "_blank");
    // pdfLoading.value = true;
    //
    // try {
    //     const response = await documentApi.getPdf(uuid);
    //     console.log(response);
    // } catch (error) {
    //     console.log("SS", error);
    // } finally {
    //     pdfLoading.value = false;
    // }
  };

  const acts = ref<ActsType | null>(null);
  const actsLoading = ref(false);

  const fetchActs = async (params: ActsParamsType = {}) => {
    actsLoading.value = true;

    try {
      acts.value = await documentApi.fetchActs(params);
      setDocumentsIsRefresh(false);
    } finally {
      actsLoading.value = false;
    }
  };

  const contracts = ref<ContractsType | null>(null);
  const contractsLoading = ref(false);

  const fetchContracts = async (params: ContractsParamsType = {}) => {
    contractsLoading.value = true;

    try {
      contracts.value = await documentApi.fetchContracts(params);
      setDocumentsIsRefresh(false);
    } finally {
      contractsLoading.value = false;
    }
  };

  const approveLoading = ref(false);

  const approve = async (uuid: string) => {
    approveLoading.value = true;

    try {
      await documentApi.approve(uuid);
    } finally {
      approveLoading.value = false;
    }
  };

  const cancelLoading = ref(false);

  const cancel = async (uuid: string) => {
    cancelLoading.value = true;

    try {
      await documentApi.cancel(uuid);
    } finally {
      cancelLoading.value = false;
    }
  };

  const rejectLoading = ref(false);

  const reject = async (uuid: string) => {
    rejectLoading.value = true;

    try {
      await documentApi.reject(uuid);
    } finally {
      rejectLoading.value = false;
    }
  };

  const changeDocumentStatus = async (status: "approved" | "rejected" | "cancelled", id: string) => {
    if (status === "approved") await approve(id);
    else if (status === "cancelled") await cancel(id);
    else if (status === "rejected") await reject(id);
    if (document.value) document.value.status = status;
  };

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
    fetchContracts,
    approveLoading,
    approve,
    rejectLoading,
    reject,
    cancelLoading,
    cancel,
    changeDocumentStatus,
    documentsIsRefresh,
    setDocumentsIsRefresh
  };
});
