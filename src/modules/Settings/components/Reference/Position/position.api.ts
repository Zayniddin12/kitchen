import axios from "@/plugins/axios/axios";
import { PositionsType, PositionType } from "@/modules/Settings/components/Reference/Position/position.types";

const prefix = "positions";

export default {
  async fetchPositions(): Promise<PositionsType> {
    const { data } = await axios.get(prefix);
    return data.data.positions as PositionsType;
  },

  async fetchPosition(id: number): Promise<PositionType> {
    const { data } = await axios.get(`${prefix}/${id}`);
    return data.data.position as PositionType;
  },
};