import { defineStore } from "pinia";
import { ref } from "vue";
import {
  PositionDataType, PositionShowType, PositionsPaginationType, PositionsParamsType,
  PositionsType,
  PositionType,
} from "@/modules/Settings/components/Reference/Position/position.types";
import positionApi from "@/modules/Settings/components/Reference/Position/position.api";

export const usePositionStore = defineStore("positionStore", () => {

  const positions = ref<PositionsType>([]);

  const positionsPagination = ref<PositionsPaginationType | null>(null);

  const positionsLoading = ref(false);

  const fetchPositions = async (params: PositionsParamsType = {}) => {

    positionsLoading.value = true;

    try {
      const response = await positionApi.fetchPositions(params);
      if (params.getAll) positions.value = response as PositionsType;
      else positionsPagination.value = response as PositionsPaginationType;
    } finally {
      positionsLoading.value = false;
    }
  };

  const position = ref<PositionShowType | null>(null);
  const positionLoading = ref(false);

  const fetchPosition = async (id: number) => {
    positionLoading.value = true;

    try {
      position.value = await positionApi.fetchPosition(id);
    } finally {
      positionLoading.value = false;
    }
  };

  const createPositionLoading = ref(false);

  const createPosition = async (data: PositionDataType) => {
    createPositionLoading.value = true;

    try {
      await positionApi.createPosition(data);
    } finally {
      createPositionLoading.value = false;
    }
  };

  const updatePositionLoading = ref(false);

  const updatePosition = async (id: number, data: PositionDataType) => {
    updatePositionLoading.value = true;

    try {
      await positionApi.updatePosition(id, data);
    } finally {
      updatePositionLoading.value = false;
    }
  };

  const deletePositionLoading = ref(false);

  const deletePosition = async (id: number) => {
    deletePositionLoading.value = true;

    try {
      await positionApi.deletePosition(id);
    } finally {
      deletePositionLoading.value = false;
    }
  };

  return {
    positions,
    positionsPagination,
    positionsLoading,
    fetchPositions,
    position,
    positionLoading,
    fetchPosition,
    createPositionLoading,
    createPosition,
    updatePositionLoading,
    updatePosition,
    deletePositionLoading,
    deletePosition,
  };
});