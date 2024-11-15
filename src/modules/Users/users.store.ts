import { defineStore } from "pinia";
import { computed, ref } from "vue";
import { UserShowType, UsersParamsType, UsersType, UserType } from "@/modules/Users/users.types";
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
        if (!user) return "";

        const { firstname, lastname } = user;

        if (!firstname) return lastname || "";
        if (!lastname) return firstname;

        return `${firstname} ${lastname}`;
    };

    const userLoading = ref(false);
    const user = ref<null | UserShowType>(null);

    const userFullName = computed(() => {
        return getUserFullName(user.value);
    });

    const fetchUser = async (id: number) => {
        userLoading.value = true;

        try {
            user.value = await usersApi.fetchUser(id);
        } finally {
            userLoading.value = false;
        }
    };

    const deleteUserLoading = ref(false);

    const deleteUser = async (id: number) => {
        deleteUserLoading.value = true;

        try {
            await usersApi.deleteUser(id);
        } finally {
            deleteUserLoading.value = false;
        }
    };

    return {
        users,
        usersLoading,
        fetchUsers,
        getUserFullName,
        userLoading,
        user,
        userFullName,
        fetchUser,
        deleteUserLoading,
        deleteUser
    };
});