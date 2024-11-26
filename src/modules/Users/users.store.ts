import { defineStore } from "pinia";
import { computed, ref } from "vue";
import {
    SearchUserDataType,
    UserApiUrlType, UserCreateOrUpdateDataType,
    UserShowType,
    UsersParamsType,
    UsersType,
    UserType
} from "@/modules/Users/users.types";
import usersApi from "@/modules/Users/users.api";
import { useRoute } from "vue-router";
import { getSessionItem, removeSessionItem, setSessionItem } from "@/utils/sessionStorage";

export const useUsersStore = defineStore("usersStore", () => {
    const route = useRoute();

    const includeRouteName = (text: string) => {
        return (route.name as string).includes(text);
    };

    const usersUrl = "users";
    const userApi = usersApi(usersUrl);

    const userRoutesPrefix = "personal-database";

    const activeUserPage = computed(() => {
        return includeRouteName(userRoutesPrefix);
    });

    const users = ref<null | UsersType>(null);
    const usersLoading = ref(false);

    const fetchUsers = async (params: UsersParamsType = {}) => {
        usersLoading.value = true;

        try {
            users.value = await userApi.fetchUsers(params);
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
            user.value = await userApi.fetchUser(id);
        } finally {
            userLoading.value = false;
        }
    };

    const deleteUserLoading = ref(false);

    const deleteUser = async (id: number) => {
        deleteUserLoading.value = true;

        try {
            await userApi.deleteUser(id);
        } finally {
            deleteUserLoading.value = false;
        }
    };

    const createUserLoading = ref(false);

    const createUser = async (data: UserCreateOrUpdateDataType) => {
        createUserLoading.value = true;

        await userApi.createUser(data).finally(() => {
            createUserLoading.value = false;
        });
    };

    const updateUserLoading = ref(false);

    const updateUser = async (id: number, data: UserCreateOrUpdateDataType) => {
        updateUserLoading.value = true;
        await userApi.updateUser(id, data).finally(() => {
            updateUserLoading.value = false;
        });
    };


    const employeeUrl = "employee";
    const employeeApi = usersApi(employeeUrl);

    const employeeRoutesPrefix = "visitors";

    const activeEmployeePage = computed(() => {
        return includeRouteName(employeeRoutesPrefix);
    });

    const employees = ref<null | UsersType>(null);
    const employeesLoading = ref(false);

    const fetchEmployees = async (params: UsersParamsType = {}) => {
        employeesLoading.value = true;

        try {
            employees.value = await employeeApi.fetchUsers(params);
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
            employee.value = await employeeApi.fetchUser(id);
        } finally {
            employeeLoading.value = false;
        }
    };

    const deleteEmployeeLoading = ref(false);

    const deleteEmployee = async (id: number) => {
        deleteEmployeeLoading.value = true;

        try {
            await employeeApi.deleteUser(id);
        } finally {
            deleteEmployeeLoading.value = false;
        }
    };

    const createEmployeeLoading = ref(false);

    const createEmployee = async (data: UserCreateOrUpdateDataType) => {
        createEmployeeLoading.value = true;

        await employeeApi.createUser(data).finally(() => {
            createEmployeeLoading.value = false;
        });
    };

    const updateEmployeeLoading = ref(false);

    const updateEmployee = async (id: number, data: UserCreateOrUpdateDataType) => {
        updateEmployeeLoading.value = true;
        await employeeApi.updateUser(id, data).finally(() => {
            updateEmployeeLoading.value = false;
        });
    };

    const activeRoutePrefix = computed(() => {
        return activeUserPage.value ? userRoutesPrefix : employeeRoutesPrefix;
    });

    const searchUser = ref<UserShowType | null>(null);
    const searchUserLoading = ref(false);
    const searchUserStorageKey = "search-user";

    const setSearchUser = (user: UserShowType) => {
        searchUser.value = user;
        setSessionItem(searchUserStorageKey, JSON.stringify(user));
    };

    const initializeSearchUser = () => {
        if (searchUser.value) return;

        const storedUser = getSessionItem(searchUserStorageKey);
        searchUser.value = storedUser ? JSON.parse(storedUser) : null;
    };

    const clearSearchUser = () => {
        searchUser.value = null;
        removeSessionItem(searchUserStorageKey);
    };

    const fetchSearchUser = async (url: UserApiUrlType, data: SearchUserDataType) => {
        searchUserLoading.value = true;
        try {
            const response = await employeeApi.fetchSearchUser(data);
            setSearchUser(response);
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
        createUserLoading,
        createUser,
        updateUserLoading,
        updateUser,

        employeeRoutesPrefix,
        activeEmployeePage,
        employees,
        employeesLoading,
        fetchEmployees,
        employee,
        employeeFullName,
        employeeLoading,
        fetchEmployee,
        deleteEmployeeLoading,
        deleteEmployee,
        createEmployeeLoading,
        createEmployee,
        updateEmployeeLoading,
        updateEmployee,

        activeRoutePrefix,
        searchUser,
        searchUserLoading,
        fetchSearchUser,
        initializeSearchUser,
        clearSearchUser
    };
});