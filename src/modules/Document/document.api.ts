import axios from "@/plugins/axios/axios";
import {
  DraftsResponseType,
  DraftsParamsType,
  DocumentCreateDataType,
  DocumentType,
  DocumentCreateDataDocumentType,
  ActsParamsType,
  ActsType,
  ContractsParamsType,
  ContractsType,
} from "@/modules/Document/document.types";
import { AxiosError } from "axios";

const prefix = "documents";

export default {
  create(data: DocumentCreateDataType | DocumentCreateDataDocumentType) {
    return axios.post(prefix, data);
  },

  update(uuid: string, data: DocumentCreateDataDocumentType) {
    return axios.put(`${prefix}/${uuid}`, data);
  },

  async fetchDrafts(url: string, params: DraftsParamsType = {}): Promise<DraftsResponseType> {
    const { data }: { data: Record<string, any> } = await axios.get(`${prefix}/${url}`, { params });
    return data.data as DraftsResponseType;
  },

  async fetchDocument(uuid: string): Promise<DocumentType> {
    const { data }: { data: Record<string, any> } = await axios.get(`${prefix}/${uuid}`);
    return data.data.document as DocumentType;
  },

  async getPdf(uuid: string) {
    return await axios.get(`${prefix}/get-pdf/${uuid}`).catch((err: AxiosError) => {
      console.log(err);
    });
  },

  async fetchActs(params: ActsParamsType = {}): Promise<ActsType> {
    const { data }: { data: Record<string, any> } = await axios.get(`${prefix}/acts`, { params });
    return data.data as ActsType;
  },

  async fetchContracts(params: ContractsParamsType = {}): Promise<ContractsType> {
    const { data }: { data: Record<string, any> } = await axios.get(`${prefix}/contracts`, { params });
    return data.data as ContractsType;
  },

  async deleteDocument(id: string | number): Promise<any> {
    return await axios.delete(`${prefix}/${id}`);
  },

  approve(uuid: string) {
    return axios.post(`${prefix}/approve/${uuid}`);
  },

  reject(uuid: string) {
    return axios.post(`${prefix}/reject/${uuid}`);
  },

  cancel(uuid: string) {
    return axios.post(`${prefix}/cancel/${uuid}`);
  },
};