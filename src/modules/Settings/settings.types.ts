export interface DocTypeListType {
    id: number,
    name: string,
    childs: DocTypeListType[]
}

export interface RespondentParamsType {
    search?: string;
}

export interface RespondentType {
    id: number,
    name: string,
    model_type: string
}