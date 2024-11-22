import { defineStore } from "pinia";
import { computed, ref } from "vue";
import {
    SearchUserDataType,
    UserApiUrlType,
    UserShowType,
    UsersParamsType,
    UsersType,
    UserType
} from "@/modules/Users/users.types";
import usersApi from "@/modules/Users/users.api";
import { useRoute } from "vue-router";

export const useUsersStore = defineStore("usersStore", () => {
    const route = useRoute();

    const includeRouteName = (text: string) => {
        return (route.name as string).includes(text);
    };

    const usersUrl = "users";

    const userRoutesPrefix = "personal-database";

    const activeUserPage = computed(() => {
        return includeRouteName(userRoutesPrefix);
    });

    const users = ref<null | UsersType>(null);
    const usersLoading = ref(false);

    const fetchUsers = async (params: UsersParamsType = {}) => {
        usersLoading.value = true;

        try {
            users.value = await usersApi.fetchUsers(usersUrl, params);
        } finally {
            usersLoading.value = false;
        }
    };

    const getUserFullName = (user: UserType | null) => {
        if (!user) return "";

        const { firstname, lastname, patronymic } = user;

        return [firstname, lastname, patronymic].filter(Boolean).join(" ");
    };

    const userLoading = ref(false);
    const user = ref<null | UserShowType>(null);

    const userFullName = computed(() => {
        return getUserFullName(user.value);
    });

    const fetchUser = async (id: number) => {
        userLoading.value = true;

        try {
            user.value = await usersApi.fetchUser(usersUrl, id);
        } finally {
            userLoading.value = false;
        }
    };

    const deleteUserLoading = ref(false);

    const deleteUser = async (id: number) => {
        deleteUserLoading.value = true;

        try {
            await usersApi.deleteUser(usersUrl, id);
        } finally {
            deleteUserLoading.value = false;
        }
    };


    const employeeUrl = "employee";
    const employeeRoutesPrefix = "visitors";

    const activeEmployeePage = computed(() => {
        return includeRouteName(employeeRoutesPrefix);
    });

    const employees = ref<null | UsersType>(null);
    const employeesLoading = ref(false);

    const fetchEmployees = async (params: UsersParamsType = {}) => {
        employeesLoading.value = true;

        try {
            employees.value = await usersApi.fetchUsers(employeeUrl, params);
        } finally {
            employeesLoading.value = false;
        }
    };

    const employeeLoading = ref(false);
    const employee = ref<null | UserShowType>(null);

    const employeeFullName = computed(() => {
        return getUserFullName(employee.value);
    });

    const fetchEmployee = async (id: number) => {
        employeeLoading.value = true;

        try {
            employee.value = await usersApi.fetchUser(employeeUrl, id);
        } finally {
            employeeLoading.value = false;
        }
    };


    const activeRoutePrefix = computed(() => {
        return activeUserPage.value ? userRoutesPrefix : employeeRoutesPrefix;
    });

    const searchUser = ref<UserShowType | null>(null);
    const searchUserLoading = ref(false);

    const fetchSearchUser = async (url: UserApiUrlType, data: SearchUserDataType) => {
        searchUserLoading.value = true;
        try {
            searchUser.value = await usersApi.fetchSearchUser(url, data);
        } finally {
            searchUserLoading.value = false;
        }
    };

    return {
        userRoutesPrefix,
        activeUserPage,
        users,
        usersLoading,
        fetchUsers,
        getUserFullName,
        userLoading,
        user,
        userFullName,
        fetchUser,
        deleteUserLoading,
        deleteUser,

        employeeRoutesPrefix,
        activeEmployeePage,
        employees,
        employeesLoading,
        fetchEmployees,
        employee,
        employeeFullName,
        employeeLoading,
        fetchEmployee,

        activeRoutePrefix,
        searchUser,
        searchUserLoading,
        fetchSearchUser
    };
});