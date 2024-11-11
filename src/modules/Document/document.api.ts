import axios from "@/plugins/axios/axios";
import {
    DraftsResponseType,
    DraftsParamsType,
    DocumentCreateDataType, DocumentType, DocumentCreateDataDocumentType
} from "@/modules/Document/document.types";

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
    }
};