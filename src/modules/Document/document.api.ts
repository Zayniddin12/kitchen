import axios from "@/plugins/axios/axios";
import { DocumentCreateDataType } from "@/modules/Document/document.types";

const prefix = "documents";

export default {
    create(data: DocumentCreateDataType) {
        return axios.post(prefix, data);
    }
};