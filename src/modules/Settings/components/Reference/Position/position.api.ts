import axios from "@/plugins/axios/axios";
import {
  PositionDataType, PositionShowType, PositionsPaginationType, PositionsParamsType,
  PositionsType,
  PositionType,
} from "@/modules/Settings/components/Reference/Position/position.types";

const prefix = "positions";

export default {
  async fetchPositions(params?: PositionsParamsType): Promise<PositionsType | PositionsPaginationType> {

    const { data } = await axios.get(prefix, { params });
    if (params?.getAll) return data.data.positions as PositionsType;
    return data.data as PositionsPaginationType;
  },

  async fetchPosition(id: number): Promise<PositionShowType> {
    const { data } = await axios.get(`${prefix}/${id}`);
    return data.data.position as PositionShowType;
  },

  async createPosition(data: PositionDataType) {
    return axios.post(prefix, data);
  },

  async updatePosition(id: number, data: PositionDataType) {
    return axios.put(`${prefix}/${id}`, data);
  },

  async deletePosition(id: number) {
    return axios.delete(`${prefix}/${id}`);
  },
};