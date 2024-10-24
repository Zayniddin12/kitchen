export type UserData = {
    id: number;
    username: string | null;
    is_superuser: boolean;
    language: string | null;
    theme: string | null;
    role: Role[];
    photo: string | null;
    user_id: number
};

export type Role = {
    id: number;
    name: object;
    unique_name: string;
};

