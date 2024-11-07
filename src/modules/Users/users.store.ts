import { defineStore } from "pinia";
import { ref } from "vue";
import { UsersParamsType, UsersType, UserType } from "@/modules/Users/users.types";
import usersApi from "@/modules/Users/users.api";

export const useUsersStore = defineStore("usersStore", () => {
    const users = ref<null | UsersType>(null);
    const usersLoading = ref(false);

    const fetchUsers = async (params: UsersParamsType = {}) => {
        usersLoading.value = true;

        try {
            users.value = await usersApi.fetchUsers(params);
        } finally {
            usersLoading.value = false;
        }
    };

    const getUserFullName = (user: UserType | null) => {
        if (!user) return ""
        return `${user.firstname} ${user.lastname}`;
    };

    return {
        users,
        usersLoading,
        fetchUsers,
        getUserFullName,
    };
});