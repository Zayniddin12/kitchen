import axios from "@/plugins/axios/axios";
import { ListParamsType, ListType } from "@/List/list.types";

export default {
  async fetchList(params: ListParamsType) {
    const { data } = await axios.get(`${params.parent_url}/${params.id}/${params.url}`);
    return data.data;
  },
};