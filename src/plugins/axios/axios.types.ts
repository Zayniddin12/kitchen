export interface ErrorType {
    message: string;
    code: number;
}

export interface MetaType {
    validation_errors: Record<string, string>;
}

export interface ResponseDataType {
    success: boolean;
    data: null | Record<string, any>;
    error: null | ErrorType;
    meta?: null | MetaType;
}