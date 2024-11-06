import axios from "@/plugins/axios/axios";
import {
    DraftsResponseType,
    DraftsParamsType,
    DocumentCreateDataType
} from "@/modules/Document/document.types";

const prefix = "documents";

export default {
    create(data: DocumentCreateDataType) {
        return axios.post(prefix, data);
    },

    async fetchDrafts(url: string, params: DraftsParamsType = {}): Promise<DraftsResponseType> {
        const { data }: { data: Record<string, any> } = await axios.get(`${prefix}/${url}`, { params });
        return data.data as DraftsResponseType;
    }
};