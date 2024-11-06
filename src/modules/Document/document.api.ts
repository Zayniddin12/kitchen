import axios from "@/plugins/axios/axios";
import { DocumentCreateDataType, DraftsResponseType, DraftsParamsType } from "@/modules/Document/document.types";

const prefix = "documents";

export default {
    create(data: DocumentCreateDataType) {
        return axios.post(prefix, data);
    },

    async fetchDrafts(params: DraftsParamsType): Promise<DraftsResponseType> {
        const { data }: { data: Record<string, any> } = await axios.get(`${prefix}/drafts`, { params });
        return data.data as DraftsResponseType;
    }
};