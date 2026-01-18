
export interface ApiResponse<T> {
    data?: T;
    error?: string;
    status: number;
}

export const createResponse = <T>(data: T, status: number = 200): ApiResponse<T> => {
    return { data, status };
};

export const createErrorResponse = (message: string, status: number = 400): ApiResponse<null> => {
    return { error: message, status };
};
