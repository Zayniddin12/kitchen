import { defineStore } from "pinia";
import { ref } from "vue";
import { PositionsType, PositionType } from "@/modules/Settings/components/Reference/Position/position.types";
import positionApi from "@/modules/Settings/components/Reference/Position/position.api";

export const usePositionStore = defineStore("positionStore", () => {

    const positions = ref<PositionsType>([]);
    const positionsLoading = ref(false);

    const fetchPositions = async () => {
        positionsLoading.value = true;

        try {
            positions.value = await positionApi.fetchPositions();
        } finally {
            positionsLoading.value = false;
        }
    };

    const position = ref<PositionType | null>(null);
    const positionLoading = ref(false);

    const fetchPosition = async (id: number) => {
        positionLoading.value = true;

        try {
            position.value = await positionApi.fetchPosition(id);
        } finally {
            positionLoading.value = false;
        }
    };

    return {
        positions,
        positionsLoading,
        fetchPositions,
        position,
        positionLoading,
        fetchPosition
    };
});